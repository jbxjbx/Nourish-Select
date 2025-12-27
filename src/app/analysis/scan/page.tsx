'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Camera, Upload, X, ArrowRight, Loader2, Video, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/context/language-context';

export default function ScanPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraMode, setIsCameraMode] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const supabase = createClient();

    // Handle file upload from local folder
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCapturedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Start camera stream
    const startCamera = async () => {
        setError(null);
        try {
            // Request camera access - prefers back camera on mobile, any camera on desktop
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: 'environment' }, // Back camera on mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            setStream(mediaStream);
            setIsCameraMode(true);

            // Wait for next render to attach stream to video
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play();
                }
            }, 100);

        } catch (err: any) {
            console.error('Camera access error:', err);
            if (err.name === 'NotAllowedError') {
                setError(t('analysis.camera_denied') || 'Camera access denied.');
            } else if (err.name === 'NotFoundError') {
                setError('No camera found on this device.');
            } else {
                setError('Could not access camera. Please try uploading a photo instead.');
            }
        }
    };

    // Stop camera stream
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraMode(false);
    }, [stream]);

    // Capture photo from video stream
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);

                // Convert to blob and create file
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                        setCapturedFile(file);
                        setImagePreview(canvas.toDataURL('image/jpeg'));
                        stopCamera();
                    }
                }, 'image/jpeg', 0.9);
            }
        }
    };

    // Clear current image and reset
    const clearImage = () => {
        setImagePreview(null);
        setCapturedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Analyze the image
    const handleAnalyze = async () => {
        if (!imagePreview || !capturedFile) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const fileName = `${Date.now()}-${capturedFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;

            // 1. Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('analysis-images')
                .upload(fileName, capturedFile);

            if (uploadError) {
                console.error("Upload Error:", uploadError);
                throw new Error("Failed to upload image. Please try again.");
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('analysis-images')
                .getPublicUrl(fileName);

            console.log("Image uploaded:", publicUrl);

            // 3. Call Python Backend
            const backendUrl = 'http://localhost:8000/analyze';
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image_url: publicUrl }),
            });

            if (!response.ok) {
                throw new Error("AI Service is attempting to connect... Ensure backend is running!");
            }

            const result = await response.json();

            // 4. Redirect with Result
            const query = encodeURIComponent(JSON.stringify(result));
            router.push(`/analysis/result?data=${query}`);

        } catch (err: any) {
            console.error("Analysis Error:", err);
            setError(err.message || "An unexpected error occurred.");
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="container max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl font-bold mb-4">{t('analysis.title')}</h1>
                    <p className="text-muted-foreground">
                        {t('analysis.desc')}
                    </p>
                </motion.div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
                        {error}
                        <p className="text-xs mt-1 text-muted-foreground">Make sure the Python Backend is running on port 8000.</p>
                    </div>
                )}

                <Card className="overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-muted/30 w-full max-w-sm mx-auto">
                    <CardContent className="p-0">
                        <div className="relative aspect-[3/4] flex flex-col items-center justify-center">

                            {/* Camera Mode - Live Video */}
                            {isCameraMode && !imagePreview && (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="absolute inset-0 w-full h-full object-cover transform scale-125"
                                    />

                                    {/* Tongue Guide Overlay */}
                                    <div className="absolute inset-0 pointer-events-none z-10 opacity-60">
                                        <svg viewBox="0 0 100 133" className="w-full h-full stroke-white stroke-[1.5] fill-none drop-shadow-md">
                                            {/* Natural Tongue Shape */}
                                            {/* M30,50 (Top Left) -> C30,25 70,25 70,50 (Top Arch) -> L70,85 (Right Side) -> C70,115 30,115 30,85 (Bottom Tip) -> Z */}
                                            <path d="M32,50 C32,25 68,25 68,50 L68,85 C68,115 32,115 32,85 Z" className="stroke-white/80" />

                                            {/* Center Line alignment help */}
                                            <line x1="50" y1="30" x2="50" y2="110" strokeDasharray="3 3" className="stroke-white/40" />

                                            <text x="50" y="20" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" className="uppercase tracking-widest drop-shadow-sm font-sans">
                                                {t('analysis.align_tongue') || 'Align Tongue Here'}
                                            </text>
                                        </svg>
                                    </div>

                                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="rounded-full w-12 h-12"
                                            onClick={stopCamera}
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            size="lg"
                                            className="rounded-full bg-white text-black hover:bg-gray-100 shadow-xl w-16 h-16 p-0 flex items-center justify-center"
                                            onClick={capturePhoto}
                                        >
                                            <div className="w-12 h-12 rounded-full border-4 border-red-500" />
                                        </Button>
                                    </div>
                                    {/* Hidden canvas for capturing */}
                                    <canvas ref={canvasRef} className="hidden" />
                                </>
                            )}

                            {/* Preview Mode - Captured/Uploaded Image */}
                            {imagePreview && (
                                <>
                                    <Image
                                        src={imagePreview}
                                        alt="Tongue Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    {!isAnalyzing && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-4 right-4 rounded-full z-20"
                                            onClick={clearImage}
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    )}
                                </>
                            )}

                            {/* Default State - Upload/Camera Options */}
                            {!isCameraMode && !imagePreview && (
                                <div className="text-center p-8 space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                                        <Camera className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-4">
                                        <Button onClick={triggerFileInput} size="lg" className="rounded-full w-48">
                                            <Upload className="mr-2 w-5 h-5" /> {t('analysis.upload_btn')}
                                        </Button>
                                        <p className="text-sm text-muted-foreground">or</p>
                                        <Button onClick={startCamera} variant="outline" size="lg" className="rounded-full w-48">
                                            <Video className="mr-2 w-5 h-5" /> {t('analysis.camera_btn')}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                        {t('analysis.privacy_note')}
                                    </p>
                                </div>
                            )}

                            {/* Analyzing Overlay */}
                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                                    <p className="text-lg font-medium animate-pulse">{t('analysis.analyzing')}</p>
                                </div>
                            )}

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </CardContent>
                </Card>

                {imagePreview && !isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 flex justify-center"
                    >
                        <Button onClick={handleAnalyze} size="lg" className="px-12 h-14 text-lg rounded-full shadow-xl">
                            {t('analysis.analyze_now')} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

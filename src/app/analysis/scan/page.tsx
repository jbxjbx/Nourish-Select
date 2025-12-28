'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Camera, Upload, X, ArrowRight, Loader2, Video, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/context/language-context';
import { useFaceDetection } from '@/hooks/useFaceDetection';

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
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [autoDetectEnabled, setAutoDetectEnabled] = useState(true);

    const supabase = createClient();

    // Auto-detection using TensorFlow.js
    const { status: detectionStatus, faceInFrame, isLoading: isModelLoading, reset: resetDetection } = useFaceDetection({
        videoRef: videoRef as React.RefObject<HTMLVideoElement>,
        enabled: isCameraMode && autoDetectEnabled && !imagePreview,
        onAutoCapture: () => {
            console.log('🎯 Auto-capture triggered!');
            capturePhoto();
        },
    });

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

    // Start camera stream with specified facing mode
    const startCamera = async (facing: 'user' | 'environment' = facingMode) => {
        setError(null);

        // Stop existing stream if any
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: facing },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            setStream(mediaStream);
            setIsCameraMode(true);
            setFacingMode(facing);

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

    // Switch between front and back cameras
    const switchCamera = () => {
        const newFacing = facingMode === 'user' ? 'environment' : 'user';
        startCamera(newFacing);
    };

    // Stop camera stream
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraMode(false);
    }, [stream]);

    // Cleanup camera on unmount (when user leaves page)
    useEffect(() => {
        return () => {
            // Stop all tracks when component unmounts
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
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
                // For front camera, flip the image horizontally
                if (facingMode === 'user') {
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                }
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

            // 3. Call AI Backend (Modal in production, localhost in development)
            const backendUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000/analyze';
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
                                        className={`absolute inset-0 w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                                    />

                                    {/* Tongue Guide Overlay - Modern Design */}
                                    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                                        {/* Dark overlay outside the scan area */}
                                        <div className="absolute inset-0 bg-black/40" />

                                        {/* Scan Frame Container - Large for better image quality */}
                                        <div className="relative w-[80%] aspect-[3/4] max-w-[300px]">
                                            {/* Clear center area */}
                                            <div className="absolute inset-0 bg-transparent" style={{
                                                boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)'
                                            }} />

                                            {/* Corner Brackets - Top Left */}
                                            <div className="absolute top-0 left-0 w-8 h-8 border-l-[3px] border-t-[3px] border-white rounded-tl-lg" />
                                            {/* Top Right */}
                                            <div className="absolute top-0 right-0 w-8 h-8 border-r-[3px] border-t-[3px] border-white rounded-tr-lg" />
                                            {/* Bottom Left */}
                                            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-[3px] border-b-[3px] border-white rounded-bl-lg" />
                                            {/* Bottom Right */}
                                            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-[3px] border-b-[3px] border-white rounded-br-lg" />

                                            {/* Dashed Tongue Shape Outline - Large, fills frame */}
                                            <svg
                                                viewBox="0 0 100 130"
                                                className="absolute inset-0 w-full h-full"
                                                style={{ padding: '3%' }}
                                            >
                                                {/* Realistic tongue shape - large with heart-shaped top */}
                                                <path
                                                    d="M50,8 
                                                       C35,8 25,12 22,22
                                                       C18,35 20,30 35,18
                                                       C42,13 50,15 50,15
                                                       C50,15 58,13 65,18
                                                       C80,30 82,35 78,22
                                                       C75,12 65,8 50,8
                                                       M22,22
                                                       C15,40 12,55 12,75
                                                       C12,100 28,120 50,120
                                                       C72,120 88,100 88,75
                                                       C88,55 85,40 78,22"
                                                    fill="none"
                                                    stroke="#FF6B6B"
                                                    strokeWidth="2"
                                                    strokeDasharray="8 5"
                                                    strokeLinecap="round"
                                                    opacity="0.85"
                                                />

                                                {/* Center alignment line */}
                                                <line
                                                    x1="50" y1="25" x2="50" y2="115"
                                                    stroke="#FF6B6B"
                                                    strokeWidth="1.2"
                                                    strokeDasharray="5 4"
                                                    opacity="0.5"
                                                />

                                                {/* Alignment text */}
                                                <text
                                                    x="50" y="70"
                                                    textAnchor="middle"
                                                    fill="white"
                                                    fontSize="6"
                                                    fontWeight="500"
                                                    className="drop-shadow-lg"
                                                >
                                                    {t('analysis.align_tongue') || '将舌头对准此处'}
                                                </text>
                                            </svg>
                                        </div>

                                        {/* Auto-Detection Status Indicator */}
                                        {autoDetectEnabled && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
                                            >
                                                <div className={`px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 text-sm font-medium shadow-lg transition-all duration-300 ${detectionStatus === 'aligned'
                                                    ? 'bg-green-500/90 text-white'
                                                    : detectionStatus === 'detecting'
                                                        ? 'bg-white/80 text-stone-700'
                                                        : 'bg-white/60 text-stone-500'
                                                    }`}>
                                                    {detectionStatus === 'loading' && (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            <span>Loading AI...</span>
                                                        </>
                                                    )}
                                                    {detectionStatus === 'ready' && (
                                                        <>
                                                            <Sparkles className="w-4 h-4" />
                                                            <span>Ready to detect</span>
                                                        </>
                                                    )}
                                                    {detectionStatus === 'detecting' && (
                                                        <>
                                                            <motion.div
                                                                animate={{ scale: [1, 1.2, 1] }}
                                                                transition={{ repeat: Infinity, duration: 1 }}
                                                            >
                                                                <Camera className="w-4 h-4" />
                                                            </motion.div>
                                                            <span>Align your tongue...</span>
                                                        </>
                                                    )}
                                                    {detectionStatus === 'aligned' && (
                                                        <>
                                                            <motion.div
                                                                animate={{ scale: [1, 1.3, 1] }}
                                                                transition={{ repeat: Infinity, duration: 0.5 }}
                                                            >
                                                                <Sparkles className="w-4 h-4" />
                                                            </motion.div>
                                                            <span>Perfect! Capturing...</span>
                                                        </>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
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
                                        <Button onClick={() => startCamera('user')} variant="outline" size="lg" className="rounded-full w-48">
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

                {/* Camera Controls - Outside the frame */}
                {isCameraMode && !imagePreview && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 flex flex-col items-center"
                    >
                        <div className="flex items-center justify-center gap-8">
                            {/* Cancel Button */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full w-12 h-12 border-2 border-stone-300 hover:border-stone-400 hover:bg-stone-100"
                                onClick={stopCamera}
                            >
                                <X className="w-5 h-5 text-stone-600" />
                            </Button>

                            {/* Capture Button */}
                            <button
                                onClick={capturePhoto}
                                className="relative w-16 h-16 flex items-center justify-center group"
                            >
                                <div className="absolute w-full h-full rounded-full border-4 border-primary opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="w-12 h-12 rounded-full bg-primary group-hover:scale-95 transition-transform shadow-lg" />
                            </button>

                            {/* Switch Camera Button */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full w-12 h-12 border-2 border-stone-300 hover:border-stone-400 hover:bg-stone-100"
                                onClick={switchCamera}
                            >
                                <RefreshCw className="w-5 h-5 text-stone-600" />
                            </Button>
                        </div>

                        {/* Camera Mode Indicator */}
                        <p className="text-center text-stone-500 text-sm mt-3">
                            {facingMode === 'user' ? '📸 Front Camera' : '📷 Back Camera'}
                        </p>
                    </motion.div>
                )}

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

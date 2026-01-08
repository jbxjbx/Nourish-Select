'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, ArrowRight, Loader2, Video, RefreshCw, Sparkles, Scan, Crosshair } from 'lucide-react';
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
        <div className="min-h-screen bg-black text-white py-16 px-4 relative overflow-hidden font-mono">
            {/* Sci-Fi Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            <div className="container max-w-2xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 border border-primary px-3 py-1 bg-primary/10 text-primary text-xs uppercase tracking-widest mb-4 animate-pulse">
                        <Scan className="w-4 h-4" /> System Ready
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-white">
                        {t('analysis.title')}
                    </h1>
                    <p className="text-stone-400 max-w-lg mx-auto font-mono text-sm leading-relaxed">
                        {t('analysis.desc')} <br />
                        <span className="text-primary opacity-70">&gt;&gt; Initializing biometric sensors...</span>
                    </p>
                </motion.div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-500 rounded-none text-center font-bold uppercase relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                        <span className="relative z-10">ERROR: {error}</span>
                    </div>
                )}

                <Card className="overflow-hidden border-2 border-primary bg-black/50 shadow-[0_0_30px_rgba(34,197,94,0.1)] w-full max-w-sm mx-auto relative group">
                    {/* Scanner Lines Decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary z-20 animate-scan-line opacity-50 pointer-events-none" />

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

                                    {/* Tongue Guide Overlay - Sci-Fi HUD Design */}
                                    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-primary/5 video-scanlines opacity-20" />

                                        {/* HUD Corners */}
                                        <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary" />
                                        <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary" />
                                        <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-bottom-2 border-primary" />
                                        <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-bottom-2 border-primary" />

                                        {/* Crosshair Center */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border border-primary/30 rounded-full flex items-center justify-center">
                                            <Crosshair className="w-8 h-8 text-primary/50 animate-spin-slow" />
                                        </div>

                                        {/* Auto-Detection Status Indicator */}
                                        {autoDetectEnabled && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full px-8"
                                            >
                                                <div className={`w-full py-3 bg-black/80 border border-primary/50 backdrop-blur-sm flex items-center justify-center gap-3 text-sm font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300 ${detectionStatus === 'aligned' ? 'bg-primary/20 text-white' : 'text-primary'}`}>
                                                    {detectionStatus === 'loading' && (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            <span>Loading AI Model...</span>
                                                        </>
                                                    )}
                                                    {detectionStatus === 'ready' && (
                                                        <>
                                                            <Scan className="w-4 h-4 animate-pulse" />
                                                            <span>Searching for Target...</span>
                                                        </>
                                                    )}
                                                    {detectionStatus === 'detecting' && (
                                                        <>
                                                            <Camera className="w-4 h-4 animate-bounce" />
                                                            <span>Align Tongue In Frame</span>
                                                        </>
                                                    )}
                                                    {detectionStatus === 'aligned' && (
                                                        <>
                                                            <Sparkles className="w-4 h-4 animate-spin" />
                                                            <span>LOCKED. CAPTURING...</span>
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
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none" />

                                    {!isAnalyzing && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-4 right-4 rounded-none w-10 h-10 border border-red-500 bg-black hover:bg-red-900 z-20"
                                            onClick={clearImage}
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    )}
                                </>
                            )}

                            {/* Default State - Upload/Camera Options */}
                            {!isCameraMode && !imagePreview && (
                                <div className="text-center p-8 space-y-8 w-full bg-black/80 h-full flex flex-col justify-center border-t border-b border-primary/20">
                                    <div className="w-24 h-24 border-2 border-primary rounded-full flex items-center justify-center mx-auto text-primary shadow-stark relative group cursor-pointer hover:bg-primary hover:text-black transition-all">
                                        <div className="absolute inset-0 border border-primary rounded-full animate-ping opacity-20" />
                                        <Camera className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-4">
                                        <Button onClick={() => startCamera('user')} size="lg" className="w-full h-14 rounded-none border-2 border-primary bg-primary text-black font-black uppercase tracking-widest hover:bg-white hover:border-white shadow-stark hover:shadow-stark-hover transition-all">
                                            <Video className="mr-2 w-5 h-5" /> {t('analysis.camera_btn')}
                                        </Button>

                                        <div className="flex items-center gap-2 justify-center opacity-50">
                                            <div className="h-px bg-primary flex-1" />
                                            <span className="text-xs font-mono text-primary">OR</span>
                                            <div className="h-px bg-primary flex-1" />
                                        </div>

                                        <Button onClick={triggerFileInput} variant="outline" size="lg" className="w-full h-12 rounded-none border border-stone-700 bg-transparent text-stone-400 font-mono text-xs uppercase hover:bg-stone-900 hover:text-white hover:border-white transition-all">
                                            <Upload className="mr-2 w-4 h-4" /> {t('analysis.upload_btn')}
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-primary/40 font-mono uppercase tracking-widest">
                                        {t('analysis.privacy_note')}
                                    </p>
                                </div>
                            )}

                            {/* Analyzing Overlay */}
                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30">
                                    <div className="relative w-20 h-20 mb-6">
                                        <div className="absolute inset-0 border-4 border-primary/30 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                                        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
                                    </div>
                                    <p className="text-xl font-black italic text-white animate-pulse uppercase tracking-widest">{t('analysis.analyzing')}</p>
                                    <div className="mt-2 font-mono text-xs text-primary">
                                        <span className="inline-block animate-pulse">Running Neural Net...</span>
                                    </div>
                                    <div className="mt-8 font-mono text-[10px] text-stone-500 overflow-hidden w-64 h-20 text-center opacity-50">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                                                0x{Math.random().toString(16).substr(2, 8).toUpperCase()}... PROCESSING ... OK
                                            </div>
                                        ))}
                                    </div>
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
                        className="mt-8 flex flex-col items-center"
                    >
                        <div className="flex items-center justify-center gap-8">
                            {/* Cancel Button */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full w-12 h-12 border border-stone-700 bg-black text-white hover:bg-red-900 hover:border-red-500 hover:text-red-100 transition-colors"
                                onClick={stopCamera}
                            >
                                <X className="w-5 h-5" />
                            </Button>

                            {/* Capture Button */}
                            <button
                                onClick={capturePhoto}
                                className="relative w-20 h-20 flex items-center justify-center group"
                            >
                                <div className="absolute w-full h-full rounded-full border-4 border-white opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                                <div className="w-16 h-16 rounded-full bg-white group-hover:bg-primary group-hover:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
                            </button>

                            {/* Switch Camera Button */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full w-12 h-12 border border-stone-700 bg-black text-white hover:bg-stone-800 hover:border-white transition-colors"
                                onClick={switchCamera}
                            >
                                <RefreshCw className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {imagePreview && !isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 flex justify-center w-full"
                    >
                        <Button onClick={handleAnalyze} size="lg" className="w-full max-w-sm h-16 text-xl rounded-none font-black uppercase bg-primary text-black border-2 border-primary hover:bg-black hover:text-white hover:border-white shadow-stark hover:shadow-stark-hover transition-all skew-x-[-2deg]">
                            {t('analysis.analyze_now')} <ArrowRight className="ml-3 w-6 h-6 animate-pulse" />
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseFaceDetectionOptions {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    enabled: boolean;
    onMouthInFrame?: (isInFrame: boolean) => void;
    onAutoCapture?: () => void;
}

interface DetectionState {
    isLoading: boolean;
    isDetecting: boolean;
    faceInFrame: boolean;
    status: 'loading' | 'ready' | 'detecting' | 'aligned' | 'captured' | 'error' | 'unsupported';
    error: string | null;
}

/**
 * Custom hook for face detection using browser's FaceDetector API
 * Falls back to simple motion detection if FaceDetector is not available
 */
export function useFaceDetection({
    videoRef,
    enabled,
    onMouthInFrame,
    onAutoCapture,
}: UseFaceDetectionOptions) {
    const [state, setState] = useState<DetectionState>({
        isLoading: true,
        isDetecting: false,
        faceInFrame: false,
        status: 'loading',
        error: null,
    });

    const detectorRef = useRef<any>(null);
    const animationFrameRef = useRef<number | null>(null);
    const capturedRef = useRef(false);
    const alignedFramesRef = useRef(0);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const prevFrameRef = useRef<ImageData | null>(null);

    // Check for FaceDetector API support
    const loadDetector = useCallback(async () => {
        if (!enabled) return;

        setState(prev => ({ ...prev, isLoading: true, status: 'loading' }));

        try {
            // Check if FaceDetector API is available (Chrome/Edge 94+)
            if ('FaceDetector' in window) {
                // @ts-ignore - FaceDetector is experimental
                const detector = new window.FaceDetector({
                    fastMode: true,
                    maxDetectedFaces: 1,
                });
                detectorRef.current = detector;
                console.log('✅ Using native FaceDetector API');
            } else {
                // Fallback: use simple motion/color detection
                console.log('ℹ️ FaceDetector not available, using motion detection');
                detectorRef.current = 'motion';

                // Create canvas for motion detection
                canvasRef.current = document.createElement('canvas');
            }

            setState(prev => ({ ...prev, isLoading: false, status: 'ready' }));

        } catch (error: any) {
            console.error('❌ Failed to initialize detector:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                status: 'ready', // Still allow manual capture
                error: null,
            }));
        }
    }, [enabled]);

    // Motion detection fallback - detects movement/color in frame center
    const detectMotion = useCallback((video: HTMLVideoElement): boolean => {
        if (!canvasRef.current) return false;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;

        // Small canvas for performance
        canvas.width = 64;
        canvas.height = 64;

        // Draw center region of video
        const size = Math.min(video.videoWidth, video.videoHeight) * 0.6;
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;

        ctx.drawImage(video, sx, sy, size, size, 0, 0, 64, 64);
        const currentFrame = ctx.getImageData(0, 0, 64, 64);

        // Check for pink/red color (tongue-like)
        let pinkPixels = 0;
        for (let i = 0; i < currentFrame.data.length; i += 4) {
            const r = currentFrame.data[i];
            const g = currentFrame.data[i + 1];
            const b = currentFrame.data[i + 2];

            // Pink/red detection (tongue typically has these colors)
            if (r > 150 && r > g * 1.1 && r > b * 1.1) {
                pinkPixels++;
            }
        }

        const pinkRatio = pinkPixels / (64 * 64);

        // If more than 15% of center area is pink/red, likely a tongue
        return pinkRatio > 0.15;
    }, []);

    // Detection loop
    const detectFaces = useCallback(async () => {
        if (!detectorRef.current || !videoRef.current || !enabled || capturedRef.current) {
            return;
        }

        const video = videoRef.current;

        if (video.readyState < 2) {
            animationFrameRef.current = requestAnimationFrame(detectFaces);
            return;
        }

        try {
            let faceDetected = false;

            if (detectorRef.current === 'motion') {
                // Use motion/color detection
                faceDetected = detectMotion(video);
            } else {
                // Use native FaceDetector
                const faces = await detectorRef.current.detect(video);
                faceDetected = faces.length > 0;
            }

            if (faceDetected) {
                alignedFramesRef.current++;

                onMouthInFrame?.(true);

                // Require 15 consecutive frames (about 0.5s at 30fps)
                if (alignedFramesRef.current >= 15 && !capturedRef.current) {
                    capturedRef.current = true;
                    setState(prev => ({ ...prev, status: 'captured', faceInFrame: true }));
                    onAutoCapture?.();
                    return;
                }

                setState(prev => ({
                    ...prev,
                    isDetecting: true,
                    faceInFrame: true,
                    status: 'aligned',
                }));
            } else {
                alignedFramesRef.current = Math.max(0, alignedFramesRef.current - 2); // Decay slowly
                onMouthInFrame?.(false);

                setState(prev => ({
                    ...prev,
                    isDetecting: true,
                    faceInFrame: false,
                    status: 'detecting',
                }));
            }

        } catch (error) {
            console.error('Detection error:', error);
        }

        // Continue detection loop
        if (enabled && !capturedRef.current) {
            animationFrameRef.current = requestAnimationFrame(detectFaces);
        }
    }, [enabled, videoRef, detectMotion, onMouthInFrame, onAutoCapture]);

    // Initialize detector
    useEffect(() => {
        loadDetector();
    }, [loadDetector]);

    // Start detection loop when ready
    useEffect(() => {
        if (!state.isLoading && enabled && detectorRef.current) {
            capturedRef.current = false;
            alignedFramesRef.current = 0;
            detectFaces();
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [state.isLoading, enabled, detectFaces]);

    // Reset when disabled
    useEffect(() => {
        if (!enabled) {
            capturedRef.current = false;
            alignedFramesRef.current = 0;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    }, [enabled]);

    const reset = useCallback(() => {
        capturedRef.current = false;
        alignedFramesRef.current = 0;
        setState(prev => ({ ...prev, status: 'ready', faceInFrame: false }));
    }, []);

    return {
        ...state,
        reset,
    };
}

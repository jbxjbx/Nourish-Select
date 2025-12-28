'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface AuthSuccessToastProps {
    isVisible: boolean;
    message: string;
    onClose: () => void;
    autoCloseMs?: number;
}

export function AuthSuccessToast({
    isVisible,
    message,
    onClose,
    autoCloseMs = 2000
}: AuthSuccessToastProps) {

    useEffect(() => {
        if (isVisible && autoCloseMs > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseMs);
            return () => clearTimeout(timer);
        }
    }, [isVisible, autoCloseMs, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }}
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-[100]"
                >
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-100/50 px-6 py-4 flex items-center gap-4 min-w-[280px]">
                        {/* Animated checkmark */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 15,
                                delay: 0.1
                            }}
                            className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                            <CheckCircle className="w-7 h-7 text-white" />
                        </motion.div>

                        <div className="flex-1">
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="font-semibold text-gray-800"
                            >
                                {message}
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-sm text-gray-500"
                            >
                                Redirecting...
                            </motion.p>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Progress bar */}
                    <motion.div
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: autoCloseMs / 1000, ease: "linear" }}
                        className="h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-b-full origin-left mt-[-4px] mx-4"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

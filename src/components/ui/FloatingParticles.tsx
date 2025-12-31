'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    size: number;
    duration: number;
    delay: number;
    type: 'leaf' | 'glow' | 'dot';
}

export function FloatingParticles({ count = 30, className = '' }: { count?: number; className?: string }) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const generated: Particle[] = [];
        for (let i = 0; i < count; i++) {
            generated.push({
                id: i,
                x: Math.random() * 100,
                size: Math.random() * 16 + 8,
                duration: Math.random() * 12 + 15,
                delay: Math.random() * 8,
                type: ['leaf', 'leaf', 'glow', 'dot'][Math.floor(Math.random() * 4)] as 'leaf' | 'glow' | 'dot',
            });
        }
        setParticles(generated);
    }, [count]);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute"
                    style={{
                        left: `${particle.x}%`,
                        bottom: '-20px',
                    }}
                    animate={{
                        y: [0, -window?.innerHeight * 1.2 || -1000],
                        x: [0, Math.sin(particle.id) * 50, 0],
                        rotate: [0, 360],
                        opacity: [0, 0.8, 0.8, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {particle.type === 'leaf' && (
                        <svg
                            width={particle.size}
                            height={particle.size}
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-emerald-400/50"
                        >
                            <path
                                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5-2 2.5-5 2.5-10S13.5 2 12 2z"
                                fill="currentColor"
                            />
                        </svg>
                    )}
                    {particle.type === 'glow' && (
                        <div
                            className="rounded-full bg-gradient-to-br from-emerald-400/50 to-amber-400/30 blur-sm"
                            style={{ width: particle.size, height: particle.size }}
                        />
                    )}
                    {particle.type === 'dot' && (
                        <div
                            className="rounded-full bg-stone-400/20"
                            style={{ width: particle.size / 2, height: particle.size / 2 }}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    );
}

// Organic blob background
export function OrganicBlobs({ className = '' }: { className?: string }) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Main green blob */}
            <motion.div
                className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[100px]"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Amber accent blob */}
            <motion.div
                className="absolute top-1/2 -right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px]"
                animate={{
                    scale: [1, 1.15, 1],
                    x: [0, -40, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Bottom stone blob */}
            <motion.div
                className="absolute -bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-stone-500/10 blur-[80px]"
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 30, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
}

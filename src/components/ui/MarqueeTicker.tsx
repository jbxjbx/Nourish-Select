'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MarqueeTickerProps {
    text?: string;
    className?: string;
    speed?: 'slow' | 'normal' | 'fast';
}

export function MarqueeTicker({
    text = "HERBAL WELLNESS • NATURAL INGREDIENTS • HEALTH BENEFITS • PREMIUM QUALITY • ",
    className,
    speed = 'normal'
}: MarqueeTickerProps) {
    const speedClass = {
        slow: 'animate-marquee',
        normal: 'animate-marquee-fast',
        fast: 'animate-marquee-fast'
    }[speed];

    // Repeat text 4 times for seamless loop
    const repeatedText = text.repeat(4);

    return (
        <div className={cn("overflow-hidden whitespace-nowrap", className)}>
            <div className={cn("inline-block", speedClass)}>
                <span className="text-[8rem] md:text-[12rem] font-black uppercase tracking-tighter text-white/5 select-none">
                    {repeatedText}
                </span>
            </div>
        </div>
    );
}

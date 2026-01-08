'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRef, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import { FloatingParticles } from '@/components/ui/FloatingParticles';

export function HeroSection() {
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    // Mouse Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        mouseX.set(x);
        mouseY.set(y);
    };

    const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], ['-5%', '5%']), { stiffness: 50, damping: 20 });
    const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], ['-5%', '5%']), { stiffness: 50, damping: 20 });

    return (
        <section
            ref={ref}
            className="relative min-h-[90vh] w-full overflow-hidden flex items-center justify-center bg-background"
            onMouseMove={handleMouseMove}
        >
            {/* NOISE OVERLAY */}
            <div className="absolute inset-0 bg-noise opacity-30 z-[1] pointer-events-none" />

            {/* GRAFFITI / STICKERS BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
                <motion.div style={{ x: bgX, y: bgY }} className="absolute md:top-20 top-10 md:left-[10%] left-[-5%] rotate-[-12deg] opacity-80">
                    <div className="bg-primary text-black font-black text-xl px-4 py-2 uppercase transform -rotate-6 shadow-stark border-2 border-black">
                        Hangover Cure
                    </div>
                </motion.div>

                <motion.div style={{ x: bgY, y: bgX }} className="absolute md:bottom-[20%] bottom-[10%] md:right-[15%] right-[-5%] rotate-[15deg] opacity-90">
                    <div className="bg-secondary text-white font-black text-2xl px-6 py-3 uppercase shadow-stark border-2 border-black">
                        100% Party Proof
                    </div>
                </motion.div>

                {/* Floating Icons */}
                <div className="absolute top-[15%] right-[20%] text-black animate-float">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                </div>
                <div className="absolute bottom-[30%] left-[8%] text-primary animate-shake">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                </div>
            </div>

            {/* VIDEO PLACEHOLDERS (TIKTOK STYLE) */}
            <div className="absolute inset-0 z-[2] pointer-events-none hidden md:block">
                {/* Left Video */}
                <motion.div
                    initial={{ y: 100, opacity: 0, rotate: -6 }}
                    animate={{ y: 0, opacity: 1, rotate: -6 }}
                    transition={{ delay: 0.2 }}
                    className="absolute left-[5%] top-[20%] w-[240px] aspect-[9/16] bg-black border-4 border-black rounded-3xl shadow-2xl overflow-hidden rotate-[-6deg] hover:rotate-0 transition-transform duration-500 hover:z-50 hover:scale-105"
                >
                    <div className="w-full h-full bg-stone-800 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-stone-900 animate-pulse" />
                        <div className="absolute bottom-4 left-4 text-white font-black text-2xl tracking-tighter leading-none">
                            WRECKED<br />RALPH<br /><span className="text-primary">VIBES</span>
                        </div>
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm animate-pulse">
                            LIVE
                        </div>
                    </div>
                </motion.div>

                {/* Right Video */}
                <motion.div
                    initial={{ y: 100, opacity: 0, rotate: 6 }}
                    animate={{ y: 0, opacity: 1, rotate: 6 }}
                    transition={{ delay: 0.4 }}
                    className="absolute right-[5%] bottom-[15%] w-[220px] aspect-[9/16] bg-black border-4 border-black rounded-3xl shadow-2xl overflow-hidden rotate-[6deg] hover:rotate-0 transition-transform duration-500 hover:z-50 hover:scale-105"
                >
                    <div className="w-full h-full bg-stone-800 relative">
                        <div className="absolute inset-0 bg-gradient-to-bl from-secondary/80 to-purple-900 animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute bottom-4 left-4 text-white font-black text-2xl tracking-tighter leading-none">
                            POPPIN'<br />OFF
                        </div>
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-[10px] text-white font-bold">@nourishselect</span>
                        </div>
                    </div>
                </motion.div>
            </div>


            {/* Content  */}
            <div className="container relative z-10 px-4 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="mb-8 inline-block animate-pop">
                        <span className="bg-black text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm border-2 border-primary shadow-stark transform -rotate-2 inline-block">
                            {t('hero.badge')}
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-black mb-6 leading-[0.9] uppercase drop-shadow-sm">
                        {t('hero.title_1') || 'DRINK'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 hover-glitch cursor-default block md:inline">{t('hero.title_chi') || 'CLEAN'}</span>
                        <br className="hidden md:block" />
                        {t('hero.title_2') || 'FEEL'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-purple-600 hover-glitch cursor-default block md:inline">{t('hero.title_body') || 'WILD'}</span>
                    </h1>

                    <p className="max-w-xl mx-auto text-xl md:text-2xl text-stone-800 font-bold mb-10 leading-snug bg-white/50 backdrop-blur-sm p-4 rounded-xl border-2 border-black/5 rotate-1">
                        {t('hero.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Button asChild size="lg" className="h-16 px-12 text-xl shadow-stark hover:shadow-stark-hover hover:-translate-y-1 transition-all border-2 border-black bg-black text-white hover:bg-stone-900">
                            <Link href="/analysis">
                                {t('hero.cta_scan')} <ArrowRight className="ml-3 w-6 h-6" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-16 px-12 text-xl shadow-stark hover:shadow-stark-hover hover:-translate-y-1 transition-all bg-white text-black border-2 border-black hover:bg-primary hover:text-black">
                            <Link href="/shop/drinks">
                                {t('hero.cta_shop')}
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
            >
                <div className="w-6 h-10 border-4 border-black rounded-full flex justify-center p-1">
                    <div className="w-1.5 h-3 bg-black rounded-full animate-bounce" />
                </div>
            </motion.div>
        </section>
    );
}

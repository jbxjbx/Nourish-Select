'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
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
            className="relative h-screen min-h-[600px] md:min-h-[800px] w-full overflow-hidden flex items-center justify-center"
            onMouseMove={handleMouseMove}
        >
            {/* Floating Particles - dense herbal effect */}
            <FloatingParticles count={40} className="z-15" />

            {/* Dynamic Background Image */}
            <motion.div
                className="absolute inset-[-10%] z-0"
                style={{ x: bgX, y: bgY }}
            >
                {/* Fallback to gradient/abstract art if no image yet */}
                <div className="absolute inset-0 bg-stone-900">
                    {/* Abstract organic shapes with animate-breathe */}
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-900/40 rounded-full blur-[120px] mix-blend-screen animate-breathe" />
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-amber-900/30 rounded-full blur-[100px] mix-blend-screen animate-breathe" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://images.unsplash.com/photo-1544367563-12123d8959f9?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay scale-110" />
                </div>
            </motion.div>

            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent z-10" />

            {/* Floating decorative elements */}
            <div className="absolute top-20 left-10 z-15 animate-float">
                <Leaf className="w-8 h-8 text-emerald-500/30" />
            </div>
            <div className="absolute top-40 right-20 z-15 animate-float" style={{ animationDelay: '1s' }}>
                <Sparkles className="w-6 h-6 text-amber-400/30" />
            </div>
            <div className="absolute bottom-40 left-20 z-15 animate-float" style={{ animationDelay: '2s' }}>
                <Leaf className="w-10 h-10 text-emerald-400/20 rotate-45" />
            </div>

            {/* Content  */}
            <div className="container relative z-20 px-4 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-widest text-emerald-400 uppercase border border-emerald-500/30 rounded-full bg-emerald-950/30 backdrop-blur-md animate-glow">
                        {t('hero.badge')}
                    </span>

                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white mb-8 drop-shadow-lg leading-tight">
                        {t('hero.title_1')} <span className="italic text-emerald-300 font-light">{t('hero.title_chi')}</span>,<br />
                        {t('hero.title_2')} <span className="italic text-emerald-300 font-light">{t('hero.title_body')}</span>.
                    </h1>

                    <p className="max-w-xl mx-auto text-xl text-stone-300 mb-12 leading-relaxed font-light">
                        {t('hero.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-lg shadow-emerald-900/20 hover:scale-105 hover:shadow-emerald-500/30 transition-all duration-300">
                            <Link href="/analysis">
                                {t('hero.cta_scan')} <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full border-stone-600 text-stone-300 hover:bg-stone-800 hover:text-white hover:border-stone-500 backdrop-blur-sm bg-stone-900/30 transition-all duration-300">
                            <Link href="/shop/drinks">
                                {t('hero.cta_shop')}
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator with animation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-stone-400"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-stone-400 to-transparent animate-wave" />
                <span className="text-[10px] uppercase tracking-[0.2em]">{t('hero.scroll')}</span>
            </motion.div>
        </section>
    );
}

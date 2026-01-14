'use client';

import { motion } from 'framer-motion';
import { Leaf, Heart, Globe, Star, Zap, Skull } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero - The Manifesto */}
            <section className="bg-black text-white py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

                {/* Scrolling Marquee Background */}
                <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 opacity-10 whitespace-nowrap pointer-events-none select-none overflow-hidden font-black text-[200px] leading-none text-white/20">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="flex gap-20"
                    >
                        <span>REBEL WELLNESS</span>
                        <span>ANTIGRAVITY</span>
                        <span>NOURISH SELECT</span>
                        <span>CHAOS</span>
                    </motion.div>
                </div>

                <div className="container mx-auto text-center max-w-5xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                    >
                        <div className="inline-block border-2 border-primary bg-black px-6 py-2 mb-8 transform -rotate-3 hover:rotate-0 transition-transform shadow-[4px_4px_0px_#22c55e]">
                            <span className="text-primary font-mono text-sm uppercase tracking-widest font-bold">EST. 2024 // GLOBAL</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-stone-400">
                            {t('about.title') || 'THE MANIFESTO'}
                        </h1>
                        <p className="text-2xl md:text-4xlfont-bold text-stone-300 leading-tight max-w-3xl mx-auto font-serif italic">
                            "{t('about.quote') || 'Normal wellness is boring as hell. We chose violence.'}"
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content - Zine Layout */}
            <section className="py-24 px-4 bg-stone-50 relative">
                <div className="container mx-auto max-w-6xl space-y-32">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20" />
                            <h2 className="text-5xl font-black uppercase mb-8 leading-none relative z-10">
                                {t('about.motivation_title') || 'WHY WE EXIST'}
                                <span className="block text-primary text-6xl italic">NO BS.</span>
                            </h2>
                            <div className="space-y-6 text-lg font-mono leading-relaxed text-stone-700 bg-white p-6 border-2 border-black shadow-stark rotate-1">
                                <p>
                                    {t('about.motivation_p1')}
                                </p>
                                <p>
                                    {t('about.motivation_p2')}
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* About Hero Image */}
                            <div className="aspect-square bg-black border-4 border-black relative transform rotate-2 shadow-[8px_8px_0px_#22c55e] overflow-hidden group">
                                <img
                                    src="/about-hero.png"
                                    alt="AI tongue analysis wellness technology"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-0 right-0 p-4 bg-white border-b-4 border-l-4 border-black">
                                    <Star className="w-8 h-8 text-black animate-spin-slow" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Pillars - Sticker Cards */}
                    <div className="relative">
                        <div className="absolute -top-20 right-0 bg-black text-white px-4 py-2 font-black uppercase text-2xl -rotate-6 z-10 shadow-stark">
                            CORE PRINCIPLES
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="bg-white border-2 border-black shadow-stark hover:shadow-stark-hover transition-all hover:-translate-y-2 rounded-none overflow-hidden relative group">
                                <div className="h-2 bg-green-500 w-full" />
                                <CardContent className="p-8 pt-12 text-center relative z-10">
                                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black group-hover:bg-green-400 transition-colors">
                                        <Leaf className="w-10 h-10 text-black" />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase mb-4 italic">{t('about.pillar_1_title')}</h3>
                                    <p className="font-mono text-sm leading-relaxed">{t('about.pillar_1_desc')}</p>
                                </CardContent>
                                <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
                            </Card>

                            <Card className="bg-white border-2 border-black shadow-stark hover:shadow-stark-hover transition-all hover:-translate-y-2 rounded-none overflow-hidden relative group mt-8 md:mt-0">
                                <div className="h-2 bg-pink-500 w-full" />
                                <CardContent className="p-8 pt-12 text-center relative z-10">
                                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black group-hover:bg-pink-400 transition-colors">
                                        <Heart className="w-10 h-10 text-black" />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase mb-4 italic">{t('about.pillar_2_title')}</h3>
                                    <p className="font-mono text-sm leading-relaxed">{t('about.pillar_2_desc')}</p>
                                </CardContent>
                                <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
                            </Card>

                            <Card className="bg-white border-2 border-black shadow-stark hover:shadow-stark-hover transition-all hover:-translate-y-2 rounded-none overflow-hidden relative group mt-16 md:mt-0">
                                <div className="h-2 bg-blue-500 w-full" />
                                <CardContent className="p-8 pt-12 text-center relative z-10">
                                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black group-hover:bg-blue-400 transition-colors">
                                        <Globe className="w-10 h-10 text-black" />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase mb-4 italic">{t('about.pillar_3_title')}</h3>
                                    <p className="font-mono text-sm leading-relaxed">{t('about.pillar_3_desc')}</p>
                                </CardContent>
                                <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
                            </Card>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}

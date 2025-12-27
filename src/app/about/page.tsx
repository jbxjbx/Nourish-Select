'use client';

import { motion } from 'framer-motion';
import { Leaf, Heart, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Hero */}
            <section className="bg-stone-100 py-20 px-4">
                <div className="container mx-auto text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-stone-800">
                            {t('about.title')}
                        </h1>
                        <p className="text-xl text-stone-600 leading-relaxed font-light">
                            {t('about.quote')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl space-y-20">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-4 text-primary">{t('about.motivation_title')}</h2>
                            <p className="text-stone-600 mb-4 leading-relaxed">
                                {t('about.motivation_p1')}
                            </p>
                            <p className="text-stone-600 leading-relaxed">
                                {t('about.motivation_p2')}
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-stone-200 aspect-square rounded-2xl flex items-center justify-center p-8 text-stone-400 italic"
                        >
                            [Founder Image / Zen Garden Photo]
                        </motion.div>
                    </div>

                    {/* Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-white border-none shadow-sm">
                            <CardContent className="p-8 text-center pt-12">
                                <Leaf className="w-12 h-12 text-green-600 mx-auto mb-6" />
                                <h3 className="text-xl font-bold mb-2">{t('about.pillar_1_title')}</h3>
                                <p className="text-sm text-muted-foreground">{t('about.pillar_1_desc')}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-none shadow-sm">
                            <CardContent className="p-8 text-center pt-12">
                                <Heart className="w-12 h-12 text-red-400 mx-auto mb-6" />
                                <h3 className="text-xl font-bold mb-2">{t('about.pillar_2_title')}</h3>
                                <p className="text-sm text-muted-foreground">{t('about.pillar_2_desc')}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-none shadow-sm">
                            <CardContent className="p-8 text-center pt-12">
                                <Globe className="w-12 h-12 text-blue-500 mx-auto mb-6" />
                                <h3 className="text-xl font-bold mb-2">{t('about.pillar_3_title')}</h3>
                                <p className="text-sm text-muted-foreground">{t('about.pillar_3_desc')}</p>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </section>
        </div>
    );
}

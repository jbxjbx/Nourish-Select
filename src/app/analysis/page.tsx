'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Activity, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';

export default function AnalysisIntroPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-[url('/bg-texture.png')] bg-fixed bg-cover">
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            {t('analysis.intro_tag')}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                            {t('analysis.intro_title_1')} <br />
                            {t('analysis.intro_title_2')} <span className="text-primary italic">{t('analysis.intro_title_highlight')}</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {t('analysis.intro_desc')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
                    >
                        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-md">
                            <CardContent className="p-6">
                                <Activity className="w-10 h-10 text-primary mb-4" />
                                <h3 className="font-semibold text-lg mb-2">{t('analysis.card_health_title')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('analysis.card_health_desc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-md">
                            <CardContent className="p-6">
                                <Brain className="w-10 h-10 text-primary mb-4" />
                                <h3 className="font-semibold text-lg mb-2">{t('analysis.card_mental_title')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('analysis.card_mental_desc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-md">
                            <CardContent className="p-6">
                                <Sparkles className="w-10 h-10 text-primary mb-4" />
                                <h3 className="font-semibold text-lg mb-2">{t('analysis.card_plan_title')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('analysis.card_plan_desc')}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="pt-8"
                    >
                        <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg shadow-lg shadow-primary/20">
                            <Link href="/analysis/scan">
                                {t('analysis.start_analysis')} <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                        <p className="mt-4 text-xs text-muted-foreground">
                            {t('analysis.privacy_footnote')}
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Activity, Percent, Brain, Zap, AlertTriangle, Battery, Moon, Droplets, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useLanguage } from '@/context/language-context';

export default function ResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading result...</div>}>
            <AnalysisResultContent />
        </Suspense>
    );
}

function AnalysisResultContent() {
    const searchParams = useSearchParams();
    const dataParam = searchParams.get('data');
    const { t } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Define types for the result object
    interface Recommendation {
        id: string;
        name: string;
        type: string;
        reason: string;
        link: string;
    }

    interface AnalysisResult {
        constitution: string;
        score: number;
        issues: string[];
        recommendations: Recommendation[];
        tongue_features: {
            teeth_marks: boolean;
            pale_white: boolean;
            red: boolean;
            cracked: boolean;
            peeling: boolean;
        };
        symptoms: {
            obesity: number;
            high_sugar: number;
            indigestion: number;
            fatigue: number;
            insomnia: number;
            acid_reflux: number;
            dry_mouth: number;
            constipation: number;
            irritability: number;
        };
    }

    // Initial fallback data
    let result: AnalysisResult = {
        constitution: 'Detecting...',
        score: 0,
        issues: [],
        recommendations: [],
        tongue_features: {
            teeth_marks: false,
            pale_white: false,
            red: false,
            cracked: false,
            peeling: false
        },
        symptoms: {
            obesity: 0,
            high_sugar: 0,
            indigestion: 0,
            fatigue: 0,
            insomnia: 0,
            acid_reflux: 0,
            dry_mouth: 0,
            constipation: 0,
            irritability: 0
        }
    };

    if (dataParam) {
        try {
            const parsed = JSON.parse(decodeURIComponent(dataParam));
            if (parsed.constitution) {
                result = {
                    constitution: parsed.constitution,
                    score: parsed.score,
                    issues: parsed.issues,
                    tongue_features: parsed.tongue_features || result.tongue_features,
                    symptoms: parsed.symptoms || result.symptoms,
                    recommendations: [
                        {
                            id: parsed.recommendation.productId,
                            name: parsed.recommendation.name,
                            type: 'Recommended',
                            reason: parsed.recommendation.desc,
                            link: '/shop/drinks'
                        }
                    ]
                };
            }
        } catch (e) {
            console.error("Failed to parse result data", e);
        }
    }

    const featureKeys = [
        { key: 'teeth_marks', label: t('analysis.tongue_features.teeth_marks') },
        { key: 'pale_white', label: t('analysis.tongue_features.pale_white') },
        { key: 'red', label: t('analysis.tongue_features.red') },
        { key: 'cracked', label: t('analysis.tongue_features.cracked') },
        { key: 'peeling', label: t('analysis.tongue_features.peeling') },
    ];

    const activeFeatures = featureKeys.filter(f => result.tongue_features[f.key as keyof typeof result.tongue_features]);

    const symptomList = [
        { key: 'obesity', label: t('analysis.symptoms.obesity'), icon: Activity },
        { key: 'high_sugar', label: t('analysis.symptoms.high_sugar'), icon: Zap },
        { key: 'indigestion', label: t('analysis.symptoms.indigestion'), icon: AlertTriangle },
        { key: 'fatigue', label: t('analysis.symptoms.fatigue'), icon: Battery },
        { key: 'insomnia', label: t('analysis.symptoms.insomnia'), icon: Moon },
        { key: 'acid_reflux', label: t('analysis.symptoms.acid_reflux'), icon: Droplets },
        { key: 'dry_mouth', label: t('analysis.symptoms.dry_mouth'), icon: Droplets },
        { key: 'constipation', label: t('analysis.symptoms.constipation'), icon: Activity },
        { key: 'irritability', label: t('analysis.symptoms.irritability'), icon: Brain },
    ];

    // Sort symptoms by probability desc
    const sortedSymptoms = symptomList.sort((a, b) => {
        const valA = result.symptoms[a.key as keyof typeof result.symptoms] || 0;
        const valB = result.symptoms[b.key as keyof typeof result.symptoms] || 0;
        return valB - valA;
    });

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 font-sans">
            <div className="container max-w-6xl mx-auto">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100/50 text-green-700 mb-6 backdrop-blur-sm shadow-sm ring-1 ring-green-200">
                        <Check className="w-5 h-5 mr-2" /> {t('analysis.result_title')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-stone-800 mb-4 tracking-tight">
                        {t(`analysis.constitutions.${result.constitution}`) || result.constitution}
                    </h1>
                    <p className="text-stone-500 max-w-xl mx-auto text-lg leading-relaxed">
                        {t('analysis.result_desc')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">

                    {/* Left Column: Score & Interpretation */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Health Score */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="border-none shadow-xl bg-gradient-to-br from-white to-stone-100 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-2 bg-primary/20" />
                                <CardHeader>
                                    <CardTitle className="text-stone-600 font-medium">{t('analysis.score')}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center pb-10">
                                    <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-stone-200/50" />
                                            <motion.circle
                                                initial={{ strokeDashoffset: 502 }}
                                                animate={{ strokeDashoffset: 502 - (502 * result.score) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                cx="96" cy="96" r="80"
                                                stroke="currentColor" strokeWidth="12"
                                                fill="transparent"
                                                strokeDasharray={502}
                                                strokeLinecap="round"
                                                className="text-primary"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-6xl font-bold text-stone-800 tracking-tighter">{result.score}</span>
                                            <span className="text-sm text-stone-400">/ 100</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {result.issues.map((issue: string, idx: number) => (
                                            <Badge key={idx} variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-100 px-3 py-1">
                                                {issue}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Tongue Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="border-none shadow-lg bg-white">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center">
                                        <Activity className="w-5 h-5 mr-2 text-primary" />
                                        {t('analysis.tongue_features.title')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {activeFeatures.length > 0 ? (
                                        <div className="flex flex-wrap gap-3">
                                            {activeFeatures.map((f) => (
                                                <Badge key={f.key} variant="outline" className="text-base py-1 px-3 border-stone-300 text-stone-700 bg-stone-50">
                                                    {f.label}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-stone-400 italic text-sm">{t('analysis.no_anomalies')}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Middle Column: Symptom Risk Analysis */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="h-full"
                        >
                            <Card className="border-none shadow-lg bg-white h-full">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center text-xl">
                                        <Brain className="w-5 h-5 mr-3 text-purple-500" />
                                        {t('analysis.symptoms.title')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('analysis.symptoms.desc')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {sortedSymptoms.map((symptom, idx) => {
                                        // Type assertion to tell TS that symptom.key is a valid key
                                        const probability = result.symptoms[symptom.key as keyof typeof result.symptoms] || 0;

                                        // Only show relevant risks
                                        if (probability < 0.2) return null;

                                        return (
                                            <div key={symptom.key} className="space-y-2">
                                                <div className="flex justify-between items-center text-sm font-medium text-stone-600">
                                                    <div className="flex items-center">
                                                        <symptom.icon className="w-4 h-4 mr-2 text-stone-400" />
                                                        {symptom.label}
                                                    </div>
                                                    <span className={(probability > 0.7 ? "text-red-500 font-bold" : "text-stone-500")}>
                                                        {Math.round(probability * 100)}%
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${probability * 100}%` }}
                                                        transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                                                        className={`h-full rounded-full ${probability > 0.7 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                                                            probability > 0.4 ? 'bg-gradient-to-r from-orange-300 to-orange-400' :
                                                                'bg-gradient-to-r from-green-300 to-green-400'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right Column: Recommendation */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="h-full"
                        >
                            <Card className="h-full border-none shadow-xl bg-stone-900 text-stone-50 flex flex-col relative overflow-hidden">
                                {/* Decorative background element */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full transform translate-x-10 -translate-y-10" />

                                <CardHeader>
                                    <div className="bg-white/10 w-fit p-2 rounded-lg mb-4">
                                        <HeartPulse className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <CardTitle className="text-xl leading-snug">{t('analysis.recommendation')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 flex-grow">
                                    {result.recommendations.map((rec: any) => (
                                        <div key={rec.id} className="group cursor-pointer">
                                            <div className="aspect-square bg-white/5 rounded-xl mb-4 overflow-hidden relative">
                                                {/* Placeholder for product image */}
                                                <div className="absolute inset-0 flex items-center justify-center text-stone-500 text-xs">
                                                    Product Image
                                                </div>
                                            </div>
                                            <h4 className="font-serif text-xl text-yellow-50 mb-1 group-hover:text-yellow-400 transition-colors">{rec.name}</h4>
                                            <p className="text-sm text-stone-400 mb-4 line-clamp-3">{rec.reason}</p>
                                            <Button asChild className="w-full bg-white text-stone-950 hover:bg-stone-200 rounded-full font-medium">
                                                <Link href={rec.link}>
                                                    {t('analysis.buy_now')}
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Footer Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center pt-8 border-t border-stone-200"
                >
                    <p className="text-stone-400 text-sm mb-6 max-w-2xl mx-auto">
                        * {t('suggestion_disclaimer') || 'This analysis is based on Traditional principles and is for wellness purposes only. It is not a medical diagnosis.'}
                    </p>
                </motion.div>

            </div>
        </div>
    );
}

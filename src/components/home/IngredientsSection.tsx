'use client';

import { motion } from 'framer-motion';
import { Leaf, Sparkles, Heart, Brain, Shield, Zap, Moon, Flame } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const ingredients = [
    {
        icon: Zap,
        name_en: 'Ginseng',
        name_zh: '人参',
        benefit_en: 'For Energy',
        benefit_zh: '提升能量',
        desc_en: 'Boosts vitality, reduces fatigue, and enhances physical performance naturally.',
        desc_zh: '增强活力，缓解疲劳，自然提升身体表现。',
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-50',
    },
    {
        icon: Brain,
        name_en: 'Goji Berry',
        name_zh: '枸杞',
        benefit_en: 'For Focus',
        benefit_zh: '改善专注',
        desc_en: 'Rich in antioxidants, supports eye health and cognitive function.',
        desc_zh: '富含抗氧化剂，支持眼睛健康和认知功能。',
        color: 'from-rose-500 to-pink-500',
        bgColor: 'bg-rose-50',
    },
    {
        icon: Moon,
        name_en: 'Chrysanthemum',
        name_zh: '菊花',
        benefit_en: 'For Calm',
        benefit_zh: '舒缓放松',
        desc_en: 'Clears heat, calms the mind, and promotes restful sleep.',
        desc_zh: '清热去火，舒缓心情，促进安眠。',
        color: 'from-violet-500 to-purple-500',
        bgColor: 'bg-violet-50',
    },
    {
        icon: Shield,
        name_en: 'Astragalus',
        name_zh: '黄芪',
        benefit_en: 'For Immunity',
        benefit_zh: '增强免疫',
        desc_en: 'Strengthens the immune system and supports overall body defense.',
        desc_zh: '增强免疫系统，支持身体整体防御能力。',
        color: 'from-emerald-500 to-green-500',
        bgColor: 'bg-emerald-50',
    },
    {
        icon: Heart,
        name_en: 'Red Date',
        name_zh: '红枣',
        benefit_en: 'For Blood',
        benefit_zh: '养血补气',
        desc_en: 'Nourishes blood, supports digestion, and promotes healthy complexion.',
        desc_zh: '养血安神，健脾益胃，改善气色。',
        color: 'from-red-500 to-rose-500',
        bgColor: 'bg-red-50',
    },
    {
        icon: Flame,
        name_en: 'Ginger',
        name_zh: '生姜',
        benefit_en: 'For Warmth',
        benefit_zh: '温中散寒',
        desc_en: 'Warms the body, aids digestion, and supports healthy circulation.',
        desc_zh: '温暖身体，促进消化，支持健康血液循环。',
        color: 'from-orange-500 to-amber-500',
        bgColor: 'bg-orange-50',
    },
];

export function IngredientsSection() {
    const { language } = useLanguage();

    return (
        <section className="py-20 md:py-32 bg-stone-900 text-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium tracking-widest text-emerald-400 uppercase border border-emerald-500/30 rounded-full bg-emerald-950/30">
                        {language === 'cn' ? '核心成分' : 'Super Ingredients'}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
                        {language === 'cn' ? '古老智慧的力量' : 'The Power of Ancient Wisdom'}
                    </h2>
                    <p className="text-lg text-stone-400 max-w-2xl mx-auto">
                        {language === 'cn'
                            ? '每一种成分都经过精心挑选，来自千年中医养生传统'
                            : 'Each ingredient is carefully selected from thousands of years of TCM wellness tradition'}
                    </p>
                </motion.div>

                {/* Ingredients Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {ingredients.map((ingredient, index) => {
                        const Icon = ingredient.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative"
                            >
                                <div className={`${ingredient.bgColor} rounded-2xl p-5 text-center h-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/20`}>
                                    {/* Icon */}
                                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${ingredient.color} flex items-center justify-center shadow-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Benefit Badge */}
                                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                                        {language === 'cn' ? ingredient.benefit_zh : ingredient.benefit_en}
                                    </span>

                                    {/* Name */}
                                    <h3 className="text-lg font-bold text-stone-900 mt-1 mb-2">
                                        {language === 'cn' ? ingredient.name_zh : ingredient.name_en}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs text-stone-600 leading-relaxed">
                                        {language === 'cn' ? ingredient.desc_zh : ingredient.desc_en}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-stone-500 text-sm flex items-center justify-center gap-2">
                        <Leaf className="w-4 h-4" />
                        {language === 'cn' ? '100% 天然有机成分' : '100% Organic Natural Ingredients'}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

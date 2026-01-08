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

// ... imports ...

export function IngredientsSection() {
    const { language } = useLanguage();

    return (
        <section className="py-20 md:py-32 bg-stone-950 text-white overflow-hidden relative border-t-2 border-b-2 border-primary">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-10" style={{
                backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
            }} />

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 animate-spin-slow opacity-20 hidden md:block">
                <Zap className="w-32 h-32 text-primary" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-black tracking-widest text-black bg-primary uppercase transform -rotate-2 border-2 border-black shadow-stark">
                        {language === 'cn' ? '核心成分' : 'Super Ingredients'}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase text-white tracking-tighter">
                        {language === 'cn' ? '古老智慧 X 现代科技' : 'Ancient Herbs X Modern Tech'}
                    </h2>
                    <p className="text-lg text-stone-400 max-w-2xl mx-auto font-mono">
                        {language === 'cn'
                            ? '每一种成分都经过精心挑选，拒绝没有任何作用的安慰剂'
                            : 'No placebo dust. Just effective doses of the real stuff.'}
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
                                whileHover={{ y: -4, scale: 1.05 }}
                                className="group relative"
                            >
                                <div className={`bg-stone-900 border-2 border-stone-800 hover:border-primary transition-all duration-300 rounded-sm p-5 text-center h-full group-hover:shadow-[4px_4px_0px_#22c55e]`}>
                                    {/* Icon */}
                                    <div className={`w-12 h-12 mx-auto mb-3 bg-black border border-stone-700 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors rounded-none`}>
                                        <Icon className="w-6 h-6 text-white group-hover:text-black" />
                                    </div>

                                    {/* Benefit Badge */}
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2 font-mono">
                                        {language === 'cn' ? ingredient.benefit_zh : ingredient.benefit_en}
                                    </span>

                                    {/* Name */}
                                    <h3 className="text-lg font-black text-white mt-1 mb-2 uppercase">
                                        {language === 'cn' ? ingredient.name_zh : ingredient.name_en}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs text-stone-500 leading-relaxed font-mono">
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
                    <p className="text-white text-sm flex items-center justify-center gap-2 font-black uppercase tracking-tight">
                        <Leaf className="w-4 h-4 text-primary animate-pulse" />
                        {language === 'cn' ? '100% 天然有机成分' : '100% Organic. 0% Bullsh*t.'}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

'use client';

import { motion } from 'framer-motion';
import { Leaf, Heart, Brain, Shield, Zap, Moon } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const ingredients = [
    {
        icon: Zap,
        name_en: 'Kudzu Root',
        name_zh: '葛根',
        name_jp: '葛根',
        benefit_en: 'Liver Support',
        benefit_zh: '护肝',
        benefit_jp: '肝臓サポート',
        desc_en: 'Supports liver function and helps process alcohol byproducts faster.',
        desc_zh: '支持肝脏功能，加速酒精代谢。',
        desc_jp: '肝機能をサポートし、アルコール代謝を促進。',
        imageUrl: '/images/home-ingredients/kudzu_root.png?v=1',
    },
    {
        icon: Brain,
        name_en: 'Schisandra Berry',
        name_zh: '五味子',
        name_jp: '五味子',
        benefit_en: 'Adaptogen',
        benefit_zh: '适应原',
        benefit_jp: 'アダプトゲン',
        desc_en: 'Powerful adaptogen that protects liver cells and reduces fatigue.',
        desc_zh: '强效适应原，保护肝细胞，减轻疲劳。',
        desc_jp: '肝細胞を保護し、疲労を軽減する強力なアダプトゲン。',
        imageUrl: '/images/home-ingredients/schisandra_berry.png?v=1',
    },
    {
        icon: Leaf,
        name_en: 'Lotus Leaf',
        name_zh: '荷叶',
        name_jp: '蓮の葉',
        benefit_en: 'Metabolism',
        benefit_zh: '代谢',
        benefit_jp: '代謝',
        desc_en: 'Boosts metabolism and helps break down body fat naturally.',
        desc_zh: '促进代谢，帮助分解体脂。',
        desc_jp: '代謝を促進し、体脂肪の分解をサポート。',
        imageUrl: '/images/home-ingredients/lotus_leaf.png?v=1',
    },
    {
        icon: Shield,
        name_en: 'Radish Seed',
        name_zh: '莱菔子',
        name_jp: '大根の種',
        benefit_en: 'Digestion',
        benefit_zh: '消化',
        benefit_jp: '消化',
        desc_en: 'Breaks down food stagnation and relieves bloating fast.',
        desc_zh: '消食化积，快速缓解胀气。',
        desc_jp: '食滞を解消し、膨満感を素早く軽減。',
        imageUrl: '/images/home-ingredients/radish_seed.png?v=1',
    },
    {
        icon: Heart,
        name_en: 'Rose Petals',
        name_zh: '玫瑰花',
        name_jp: 'バラの花びら',
        benefit_en: 'Mood Lift',
        benefit_zh: '舒缓情绪',
        benefit_jp: 'リラックス',
        desc_en: 'Eases tension and lifts mood naturally for calm relaxation.',
        desc_zh: '舒缓紧张，自然提升心情。',
        desc_jp: '緊張を和らげ、自然に気分を高めます。',
        imageUrl: '/images/home-ingredients/rose_petals.png?v=1',
    },
    {
        icon: Moon,
        name_en: 'Jujube Seed',
        name_zh: '酸枣仁',
        name_jp: '酸棗仁',
        benefit_en: 'Sleep Aid',
        benefit_zh: '助眠',
        benefit_jp: '睡眠サポート',
        desc_en: 'Calms the nervous system and promotes deep, restful sleep.',
        desc_zh: '镇静神经系统，促进深度睡眠。',
        desc_jp: '神経系を落ち着かせ、深い眠りを促進。',
        imageUrl: '/images/home-ingredients/jujube_seed.png?v=1',
    },
];

// ... imports ...

export function IngredientsSection() {
    const { language } = useLanguage();

    return (
        <section className="py-20 md:py-32 bg-background text-stone-900 overflow-hidden relative border-t-2 border-b-2 border-primary">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-10" style={{
                backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
            }} />

            {/* Noise overlay like Hero */}
            <div className="absolute inset-0 bg-noise opacity-20 z-[1] pointer-events-none" />

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
                        {language === 'cn' ? '核心成分' : language === 'jp' ? 'スーパー成分' : 'Super Ingredients'}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase text-stone-900 tracking-tighter">
                        {language === 'cn' ? '古老智慧 X 现代科技' : language === 'jp' ? '古代の知恵 X 現代技術' : 'Ancient Herbs X Modern Tech'}
                    </h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto font-mono">
                        {language === 'cn'
                            ? '每一种成分都经过精心挑选，拒绝没有任何作用的安慰剂'
                            : language === 'jp'
                                ? 'プラセボなし。本物の有効成分だけ。'
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
                                <div
                                    className="relative border-2 border-stone-200 hover:border-primary transition-all duration-300 rounded-sm p-5 text-center h-full group-hover:shadow-[4px_4px_0px_#22c55e] overflow-hidden"
                                    style={{
                                        backgroundImage: `url(${ingredient.imageUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    {/* Dark overlay */}
                                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />

                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Icon */}
                                        <div className="w-12 h-12 mx-auto mb-3 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors rounded-none">
                                            <Icon className="w-6 h-6 text-white group-hover:text-black" />
                                        </div>

                                        {/* Benefit Badge */}
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2 font-mono">
                                            {language === 'cn' ? ingredient.benefit_zh : language === 'jp' ? ingredient.benefit_jp : ingredient.benefit_en}
                                        </span>

                                        {/* Name */}
                                        <h3 className="text-lg font-black text-white mt-1 mb-2 uppercase">
                                            {language === 'cn' ? ingredient.name_zh : language === 'jp' ? ingredient.name_jp : ingredient.name_en}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-xs text-white/80 leading-relaxed font-mono">
                                            {language === 'cn' ? ingredient.desc_zh : language === 'jp' ? ingredient.desc_jp : ingredient.desc_en}
                                        </p>
                                    </div>
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
                    <p className="text-stone-700 text-sm flex items-center justify-center gap-2 font-black uppercase tracking-tight">
                        <Leaf className="w-4 h-4 text-primary animate-pulse" />
                        {language === 'cn' ? '100% 天然有机成分' : language === 'jp' ? '100%オーガニック。' : '100% Organic. 0% Bullsh*t.'}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

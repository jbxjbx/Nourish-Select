'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/shop/ProductCard';
import { useLanguage } from '@/context/language-context';
import { OrganicBlobs, FloatingParticles } from '@/components/ui/FloatingParticles';
import { Leaf, Droplets, Sparkles } from 'lucide-react';

export default function DrinksPage() {
    const { t, language } = useLanguage();

    const drinks = [
        {
            id: 'wrecked-ralph',
            name: language === 'cn' ? '醉后拉尔夫' : language === 'jp' ? '二日酔いラルフ' : 'Wrecked Ralph',
            description: language === 'cn'
                ? '派对后的救星！姜黄、朝鲜蓟和电解质的强效组合，帮你告别宿醉。'
                : language === 'jp'
                    ? 'パーティー後の救世主！ターメリック、アーティチョーク、電解質で二日酔いをぶっ飛ばせ。'
                    : 'Party too hard? This turmeric, artichoke & electrolyte powerhouse kicks hangovers to the curb.',
            price: 4.99,
            imageUrl: '/wrecked-ralph.png',
            tags: language === 'cn' ? ['解酒', '护肝'] : language === 'jp' ? ['二日酔い', '肝臓ケア'] : ['Hangover', 'Liver Support'],
            rating: 5,
            isSubscription: true,
        },
        {
            id: 'bloated-bob',
            name: language === 'cn' ? '胀气鲍勃' : language === 'jp' ? '満腹ボブ' : 'Bloated Bob',
            description: language === 'cn'
                ? '吃撑了？消化酵素、益生菌和薄荷来帮忙，让你的肚子恢复平静。'
                : language === 'jp'
                    ? '食べすぎた？消化酵素、プロバイオティクス、ペパーミントがお腹をスッキリさせる。'
                    : 'Ate too much? Digestive enzymes, probiotics & peppermint to calm that angry belly.',
            price: 4.99,
            imageUrl: '/bloated-bob.png',
            tags: language === 'cn' ? ['消化', '益生菌'] : language === 'jp' ? ['消化', 'プロバイオティクス'] : ['Digestion', 'Probiotic'],
            rating: 5,
            isSubscription: true,
        },
        {
            id: 'heavy-kev',
            name: language === 'cn' ? '沉重凯文' : language === 'jp' ? 'ヘビー級ケヴィン' : 'Heavy Kev',
            description: language === 'cn'
                ? '绿茶提取物、左旋肉碱和藤黄果，助你轻盈起航，告别沉重感。'
                : language === 'jp'
                    ? '緑茶エキス、L-カルニチン、ガルシニアで軽やかな毎日を。重さよ、さらば。'
                    : 'Green tea extract, L-carnitine & garcinia to help you feel lighter. Say goodbye to the heavy feels.',
            price: 4.99,
            imageUrl: '/heavy-kev.png',
            tags: language === 'cn' ? ['代谢', '减脂'] : language === 'jp' ? ['代謝', '脂肪燃焼'] : ['Metabolism', 'Fat Burn'],
            rating: 5,
            isSubscription: true,
        },
        {
            id: 'manic-max',
            name: language === 'cn' ? '狂躁麦克斯' : language === 'jp' ? 'パニックマックス' : 'Manic Max',
            description: language === 'cn'
                ? '脑子转太快？南非醉茄、L-茶氨酸和柠檬香蜂草，让你的思绪平静下来。'
                : language === 'jp'
                    ? '頭がグルグル？アシュワガンダ、L-テアニン、レモンバームで心を落ち着かせよう。'
                    : 'Brain going a million miles? Ashwagandha, L-theanine & lemon balm to slow down the mental chaos.',
            price: 4.99,
            imageUrl: '/manic-max.png',
            tags: language === 'cn' ? ['抗焦虑', '放松'] : language === 'jp' ? ['不安解消', 'リラックス'] : ['Anti-Anxiety', 'Calm'],
            rating: 5,
            isSubscription: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
            {/* Hero Header with organic background */}
            <section className="bg-stone-900 text-stone-50 py-24 px-4 relative overflow-hidden">
                {/* Floating Particles */}
                <FloatingParticles count={15} className="z-10" />

                {/* Breathing background blobs */}
                <div className="absolute top-10 -left-20 w-96 h-96 bg-emerald-900/30 rounded-full blur-[120px] animate-breathe" />
                <div className="absolute bottom-10 -right-20 w-80 h-80 bg-amber-900/20 rounded-full blur-[100px] animate-breathe" style={{ animationDelay: '2s' }} />

                <div className="container mx-auto text-center max-w-3xl relative z-20">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-emerald-400 border border-emerald-500/30 rounded-full bg-emerald-950/50 backdrop-blur-sm animate-glow"
                    >
                        <Droplets className="w-4 h-4" />
                        {language === 'cn' ? '养生饮品' : 'Wellness Elixirs'}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif font-bold mb-6"
                    >
                        {t('shop.drinks_title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-300 leading-relaxed"
                    >
                        {t('shop.drinks_desc')}
                    </motion.p>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute top-20 left-10 animate-float z-10">
                    <Leaf className="w-8 h-8 text-emerald-500/20" />
                </div>
                <div className="absolute bottom-20 right-16 animate-float z-10" style={{ animationDelay: '1.5s' }}>
                    <Sparkles className="w-6 h-6 text-amber-400/20" />
                </div>
            </section>

            {/* Product Grid with organic background */}
            <section className="py-20 px-4 relative overflow-hidden">
                <OrganicBlobs className="opacity-30" />

                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {drinks.map((drink, index) => (
                            <motion.div
                                key={drink.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard
                                    category="drink"
                                    {...drink}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Why Subscribe Section with glassmorphism */}
                    <div className="mt-20 text-center pt-16 relative">
                        <div className="absolute inset-0 border-t border-stone-200" />

                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl font-semibold mb-4 text-stone-800"
                        >
                            {t('shop.why_subscribe')}
                        </motion.h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-10">
                            {[1, 2, 3].map((num, index) => (
                                <motion.div
                                    key={num}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-stone-100 shadow-lg shadow-stone-200/30 hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 font-bold text-lg group-hover:scale-110 group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white transition-all duration-300">
                                        {num}
                                    </div>
                                    <h4 className="font-medium mb-2 text-stone-800">{t(`shop.reason_${num}_title`)}</h4>
                                    <p className="text-sm text-muted-foreground">{t(`shop.reason_${num}_desc`)}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

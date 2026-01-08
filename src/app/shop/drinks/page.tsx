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
        <div className="min-h-screen bg-stone-50">
            {/* COMPACT PUNK HERO */}
            <section className="bg-black text-white py-12 md:py-16 relative overflow-hidden border-b-4 border-primary shadow-stark z-20">
                {/* NOISE */}
                <div className="absolute inset-0 bg-noise opacity-30 z-0 pointer-events-none" />

                {/* MARQUEE BACKGROUND (Subtle) */}
                <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 opacity-10 whitespace-nowrap pointer-events-none select-none overflow-hidden">
                    <div className="animate-marquee inline-block text-[10rem] font-black text-white leading-none">
                        FUNCTIONAL SODA • NO BS • 100% ORGANIC • FUNCTIONAL SODA • NO BS • 100% ORGANIC •
                    </div>
                </div>

                <div className="container mx-auto text-center max-w-4xl relative z-10 px-4">
                    {/* Sticker Badge */}
                    <div className="absolute -top-6 -right-6 md:right-20 rotate-12 hidden md:block animate-float">
                        <div className="bg-yellow-400 text-black font-black text-xs md:text-sm px-3 py-1 border-2 border-black shadow-stark uppercase">
                            New Flavors Dropped!
                        </div>
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block relative mb-4"
                    >
                        <div className="absolute -inset-2 bg-primary blur-xl opacity-20 rounded-full animate-pulse"></div>
                        <span className="relative z-10 inline-block px-4 py-1 text-xs font-black tracking-[0.2em] text-black bg-primary uppercase transform -skew-x-12 border border-black shadow-[2px_2px_0px_#fff]">
                            {language === 'cn' ? '养生饮品' : 'Wellness Elixirs'}
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-[4px_4px_0px_rgba(34,197,94,1)]">
                        {t('shop.drinks_title')}
                    </h1>

                    <p className="text-base md:text-lg text-stone-400 max-w-xl mx-auto font-mono leading-relaxed">
                        {t('shop.drinks_desc')}
                    </p>
                </div>
            </section>

            {/* Product Grid - PUNK */}
            <section className="py-16 px-4 relative overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 z-0 opacity-5" style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />

                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {drinks.map((drink, index) => (
                            <motion.div
                                key={drink.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
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

                    {/* Why Subscribe Section - BRUTALIST */}
                    <div className="mt-24 text-center pt-12 relative border-t-4 border-black border-dashed">
                        <motion.div className="inline-block bg-black text-white px-8 py-2 transform -translate-y-[calc(100%+24px)] -rotate-1 border-2 border-primary shadow-stark">
                            <h3 className="text-2xl font-black uppercase tracking-tight">
                                {t('shop.why_subscribe')}
                            </h3>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto -mt-4">
                            {[1, 2, 3].map((num, index) => (
                                <motion.div
                                    key={num}
                                    initial={{ opacity: 0, x: num % 2 === 0 ? 20 : -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 bg-white border-2 border-black shadow-stark hover:shadow-stark-hover hover:-translate-y-1 transition-all duration-300 relative group"
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary border-2 border-black flex items-center justify-center font-black text-xl text-black shadow-[2px_2px_0px_#000] group-hover:bg-black group-hover:text-primary transition-colors">
                                        {num}
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-black mb-2 text-black text-lg uppercase">{t(`shop.reason_${num}_title`)}</h4>
                                        <p className="text-sm text-stone-600 font-medium leading-relaxed">{t(`shop.reason_${num}_desc`)}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

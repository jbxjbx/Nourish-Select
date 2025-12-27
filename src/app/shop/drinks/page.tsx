'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/shop/ProductCard';
import { useLanguage } from '@/context/language-context';

export default function DrinksPage() {
    const { t, language } = useLanguage();

    const drinks = [
        {
            id: 'dream-weave',
            name: language === 'en' ? 'Dream Weave' : '梦境编织',
            description: language === 'en' ? 'A calming blend of Valerian Root and Chamomile to guide you into a deep, restorative sleep.' : '缬草根与洋甘菊的镇静混合，引导您进入深度修复睡眠。',
            price: 29.99,
            imageUrl: '/placeholder-drink-1.jpg',
            tags: language === 'en' ? ['Sleep', 'Relaxation'] : ['助眠', '放松'],
            rating: 5,
            isSubscription: true,
        },
        {
            id: 'calm-flow',
            name: language === 'en' ? 'Calm Flow' : '静谧心流',
            description: language === 'en' ? 'Reduce anxiety and center your spirit with Ashwagandha and Lemon Balm.' : '南非醉茄与柠檬香蜂草，缓解焦虑，安神定志。',
            price: 34.99,
            imageUrl: '/placeholder-drink-2.jpg',
            tags: language === 'en' ? ['Anxiety', 'Balance'] : ['抗焦虑', '平衡'],
            rating: 4,
            isSubscription: true,
        },
        {
            id: 'vitality-spark',
            name: language === 'en' ? 'Vitality Spark' : '活力火花',
            description: language === 'en' ? 'Awaken your inner fire. A potent mix of Ginseng and Matcha for sustained energy.' : '唤醒内在之火。人参与抹茶的强效组合，提供持久能量。',
            price: 24.99,
            imageUrl: '/placeholder-drink-3.jpg',
            tags: language === 'en' ? ['Energy', 'Vigor'] : ['能量', '活力'],
            rating: 5,
            isSubscription: true,
        },
    ];

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Hero Header */}
            <section className="bg-stone-900 text-stone-50 py-20 px-4">
                <div className="container mx-auto text-center max-w-3xl">
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
            </section>

            {/* Product Grid */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {drinks.map((drink) => (
                            <ProductCard
                                key={drink.id}
                                category="drink"
                                {...drink}
                            />
                        ))}
                    </div>

                    <div className="mt-20 text-center border-t border-stone-200 pt-16">
                        <h3 className="text-2xl font-semibold mb-4 text-stone-800">{t('shop.why_subscribe')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-10">
                            <div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 font-bold">1</div>
                                <h4 className="font-medium mb-2">{t('shop.reason_1_title')}</h4>
                                <p className="text-sm text-muted-foreground">{t('shop.reason_1_desc')}</p>
                            </div>
                            <div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 font-bold">2</div>
                                <h4 className="font-medium mb-2">{t('shop.reason_2_title')}</h4>
                                <p className="text-sm text-muted-foreground">{t('shop.reason_2_desc')}</p>
                            </div>
                            <div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 font-bold">3</div>
                                <h4 className="font-medium mb-2">{t('shop.reason_3_title')}</h4>
                                <p className="text-sm text-muted-foreground">{t('shop.reason_3_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

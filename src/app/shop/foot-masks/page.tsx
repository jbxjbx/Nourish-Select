'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/shop/ProductCard';
import { useLanguage } from '@/context/language-context';

export default function FootMasksPage() {
    const { t, language } = useLanguage();

    const masks = [
        {
            id: 'bamboo-detox',
            name: language === 'en' ? 'Bamboo Detox' : '竹醋排毒',
            description: language === 'en' ? 'Draws out impurities and reduces swelling with natural bamboo vinegar.' : '天然竹醋提取，吸附杂质，缓解肿胀。',
            price: 19.99,
            imageUrl: '/placeholder-mask-1.jpg',
            tags: language === 'en' ? ['Detox', 'Swelling'] : ['排毒', '消肿'],
            rating: 5,
            isSubscription: false,
        },
        {
            id: 'silk-exfoliator',
            name: language === 'en' ? 'Silk Renew' : '丝滑嫩肤',
            description: language === 'en' ? 'Gentle exfoliation with crushed silk and rice water for baby-soft skin.' : '碎蚕丝与淘米水温和去角质，还原本真嫩肤。',
            price: 22.99,
            imageUrl: '/placeholder-mask-2.jpg',
            tags: language === 'en' ? ['Exfoliation', 'Softening'] : ['去角质', '柔肤'],
            rating: 5,
            isSubscription: false,
        },
        {
            id: 'acupressure-relief',
            name: language === 'en' ? 'Point Relief' : '穴位舒缓',
            description: language === 'en' ? 'Targeted pressure point stimulation to relieve tension from head to toe.' : '针对性穴位刺激，从头到脚缓解紧张压力。',
            price: 29.99,
            imageUrl: '/placeholder-mask-3.jpg',
            tags: language === 'en' ? ['Pain Relief', 'Circulation'] : ['止痛', '循环'],
            rating: 5,
            isSubscription: false,
        },
    ];

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Hero Header */}
            <section className="bg-[#4a4e4d] text-stone-50 py-20 px-4">
                <div className="container mx-auto text-center max-w-3xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif font-bold mb-6"
                    >
                        {t('shop.masks_title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-300 leading-relaxed"
                    >
                        {t('shop.masks_desc')}
                    </motion.p>
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {masks.map((mask) => (
                            <ProductCard
                                key={mask.id}
                                category="mask"
                                {...mask}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

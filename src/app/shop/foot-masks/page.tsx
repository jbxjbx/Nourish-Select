'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/shop/ProductCard';
import { useLanguage } from '@/context/language-context';
import { OrganicBlobs, FloatingParticles } from '@/components/ui/FloatingParticles';
import { Footprints, Leaf, Sparkles } from 'lucide-react';

export default function FootMasksPage() {
    const { t, language } = useLanguage();

    const masks = [
        {
            id: 'bamboo-detox',
            name: language === 'en' ? 'Bamboo Detox' : '竹醋排毒',
            description: language === 'en' ? 'Draws out impurities and reduces swelling with natural bamboo vinegar.' : '天然竹醋提取，吸附杂质，缓解肿胀。',
            price: 19.99,
            imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400&h=400&fit=crop',
            tags: language === 'en' ? ['Detox', 'Swelling'] : ['排毒', '消肿'],
            rating: 5,
            isSubscription: false,
        },
        {
            id: 'silk-exfoliator',
            name: language === 'en' ? 'Silk Renew' : '丝滑嫩肤',
            description: language === 'en' ? 'Gentle exfoliation with crushed silk and rice water for baby-soft skin.' : '碎蚕丝与淘米水温和去角质，还原本真嫩肤。',
            price: 22.99,
            imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop',
            tags: language === 'en' ? ['Exfoliation', 'Softening'] : ['去角质', '柔肤'],
            rating: 5,
            isSubscription: false,
        },
        {
            id: 'acupressure-relief',
            name: language === 'en' ? 'Point Relief' : '穴位舒缓',
            description: language === 'en' ? 'Targeted pressure point stimulation to relieve tension from head to toe.' : '针对性穴位刺激，从头到脚缓解紧张压力。',
            price: 29.99,
            imageUrl: 'https://images.unsplash.com/photo-1600428877878-1a0ff561f8a3?w=400&h=400&fit=crop',
            tags: language === 'en' ? ['Pain Relief', 'Circulation'] : ['止痛', '循环'],
            rating: 5,
            isSubscription: false,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
            {/* Hero Header with organic background */}
            <section className="bg-gradient-to-br from-stone-800 via-stone-700 to-stone-800 text-stone-50 py-24 px-4 relative overflow-hidden">
                {/* Floating Particles */}
                <FloatingParticles count={12} className="z-10" />

                {/* Breathing background blobs */}
                <div className="absolute top-10 -left-20 w-96 h-96 bg-stone-600/30 rounded-full blur-[120px] animate-breathe" />
                <div className="absolute bottom-10 -right-20 w-80 h-80 bg-amber-900/20 rounded-full blur-[100px] animate-breathe" style={{ animationDelay: '2s' }} />

                <div className="container mx-auto text-center max-w-3xl relative z-20">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-amber-300 border border-amber-500/30 rounded-full bg-stone-900/50 backdrop-blur-sm animate-glow"
                    >
                        <Footprints className="w-4 h-4" />
                        {language === 'cn' ? '足部护理' : language === 'jp' ? 'フットケア' : 'Foot Care'}
                    </motion.div>

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

                {/* Floating decorative elements */}
                <div className="absolute top-20 left-10 animate-float z-10">
                    <Leaf className="w-8 h-8 text-stone-500/30" />
                </div>
                <div className="absolute bottom-20 right-16 animate-float z-10" style={{ animationDelay: '1.5s' }}>
                    <Sparkles className="w-6 h-6 text-amber-400/30" />
                </div>
            </section>

            {/* Product Grid with organic background */}
            <section className="py-20 px-4 relative overflow-hidden">
                <OrganicBlobs className="opacity-30" />

                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {masks.map((mask, index) => (
                            <motion.div
                                key={mask.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard
                                    category="mask"
                                    {...mask}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

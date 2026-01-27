'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Leaf, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductDetail } from '@/lib/products';
import { useLanguage } from '@/context/language-context';
import { useCart } from '@/context/cart-context';
import { useState } from 'react';
import Image from 'next/image';
import { IngredientFlipCard } from './IngredientFlipCard';

interface ProductDetailModalProps {
    product: ProductDetail;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
    const { language } = useLanguage();
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [purchaseMode, setPurchaseMode] = useState<'once' | 'subscribe'>('once');

    const handleAddToCart = () => {
        const itemPrice = purchaseMode === 'subscribe' ? product.price * 0.85 : product.price;
        addItem({
            id: purchaseMode === 'subscribe' ? `${product.id}-sub` : product.id,
            name: purchaseMode === 'subscribe'
                ? `${language === 'cn' ? product.nameCn : product.name} (${language === 'cn' ? '订阅' : 'Subscribe'})`
                : (language === 'cn' ? product.nameCn : product.name),
            price: itemPrice,
            imageUrl: product.imageUrl,
            category: 'drink',
            isSubscription: purchaseMode === 'subscribe',
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const getName = () => language === 'cn' ? product.nameCn : product.name;
    const getTagline = () => language === 'cn' ? product.taglineCn : product.tagline;
    const getDescription = () => language === 'cn' ? product.descriptionCn : product.description;
    const getTags = () => language === 'cn' ? product.tagsCn : product.tags;
    const getFlavorProfile = () => language === 'cn' ? product.flavorProfileCn : product.flavorProfile;
    const getFlavorDescription = () => language === 'cn' ? product.flavorDescriptionCn : product.flavorDescription;
    const getBenefits = () => language === 'cn' ? product.benefitsCn : product.benefits;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-white border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors border-2 border-black"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Hero Section */}
                            <div
                                className="relative py-12 px-6 md:px-12"
                                style={{ background: `linear-gradient(135deg, ${product.color}20, transparent)` }}
                            >
                                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
                                    {/* Product Image */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="relative w-48 h-64 md:w-56 md:h-72 shrink-0"
                                    >
                                        <div
                                            className="absolute inset-0 blur-3xl opacity-30 -z-10"
                                            style={{ backgroundColor: product.color }}
                                        />
                                        <Image
                                            src={product.imageUrl}
                                            alt={getName()}
                                            fill
                                            className="object-contain drop-shadow-2xl"
                                        />
                                    </motion.div>

                                    {/* Product Info */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex-1 text-center md:text-left"
                                    >
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                            {getTags().map((tag, i) => (
                                                <Badge
                                                    key={i}
                                                    className="bg-black text-white font-bold uppercase text-xs"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">
                                            {getName()}
                                        </h1>
                                        <p
                                            className="text-xl md:text-2xl font-bold mb-4"
                                            style={{ color: product.color }}
                                        >
                                            "{getTagline()}"
                                        </p>
                                        <p className="text-stone-600 text-lg leading-relaxed max-w-xl">
                                            {getDescription()}
                                        </p>

                                        {/* Price & CTA */}
                                        <div className="mt-6 space-y-4">
                                            {/* Subscription Toggle */}
                                            <div className="flex gap-2 bg-stone-100 p-1 rounded-lg max-w-xs mx-auto md:mx-0">
                                                <button
                                                    onClick={() => setPurchaseMode('once')}
                                                    className={`flex-1 py-2 px-4 rounded-md text-xs font-bold transition-all ${purchaseMode === 'once'
                                                        ? 'bg-black text-white shadow-md'
                                                        : 'text-stone-600 hover:bg-stone-200'
                                                        }`}
                                                >
                                                    {language === 'cn' ? '单次购买' : 'Buy Once'}
                                                </button>
                                                <button
                                                    onClick={() => setPurchaseMode('subscribe')}
                                                    className={`flex-1 py-2 px-4 rounded-md text-xs font-bold transition-all ${purchaseMode === 'subscribe'
                                                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                                                        : 'text-stone-600 hover:bg-stone-200'
                                                        }`}
                                                >
                                                    {language === 'cn' ? '订阅 -15%' : 'Subscribe -15%'}
                                                </button>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-black">
                                                        ${purchaseMode === 'subscribe' ? (product.price * 0.85).toFixed(2) : product.price.toFixed(2)}
                                                    </span>
                                                    {purchaseMode === 'subscribe' && (
                                                        <span className="text-sm text-stone-400 line-through">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                <Button
                                                    onClick={handleAddToCart}
                                                    className="h-12 px-6 rounded-none bg-black text-white font-black uppercase hover:bg-primary hover:text-black border-2 border-black shadow-stark text-sm"
                                                >
                                                    {isAdded ? (
                                                        <>Added! ✓</>
                                                    ) : (
                                                        <>
                                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                                            {language === 'cn' ? '加入购物车' : 'Add to Cart'}
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Flavor Profile */}
                            <div className="bg-stone-100 py-8 px-6 md:px-12 border-y-4 border-black">
                                <div className="max-w-6xl mx-auto text-center">
                                    <div className="inline-block bg-black text-white px-4 py-1 font-black uppercase text-sm mb-3 transform -rotate-1">
                                        {language === 'cn' ? '风味档案' : 'Flavor Profile'}
                                    </div>
                                    <h3
                                        className="text-2xl md:text-3xl font-black mb-2"
                                        style={{ color: product.color }}
                                    >
                                        {getFlavorProfile()}
                                    </h3>
                                    <p className="text-stone-600 max-w-2xl mx-auto">
                                        {getFlavorDescription()}
                                    </p>
                                </div>
                            </div>

                            {/* Core Ingredients */}
                            <div className="py-12 px-6 md:px-12 bg-stone-900 text-white">
                                <div className="max-w-6xl mx-auto">
                                    <div className="text-center mb-10">
                                        <div
                                            className="inline-block px-4 py-1 font-black uppercase text-sm mb-3 border-2"
                                            style={{ borderColor: product.color, color: product.color }}
                                        >
                                            <Sparkles className="w-4 h-4 inline mr-2" />
                                            {language === 'cn' ? '核心成分' : 'Power Ingredients'}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black uppercase">
                                            {language === 'cn' ? '配方揭秘' : 'The Formula'}
                                        </h2>
                                        <p className="text-stone-400 text-sm mt-2">
                                            {language === 'cn' ? '将鼠标移到卡片上查看详情' : 'Hover over a card to learn more'}
                                        </p>
                                    </div>

                                    {/* Flip Card Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                        {product.coreIngredients.map((ingredient, index) => (
                                            <IngredientFlipCard
                                                key={ingredient.name}
                                                ingredient={ingredient}
                                                index={index}
                                                accentColor={product.color}
                                            />
                                        ))}

                                    </div>
                                </div>
                            </div>

                            {/* Benefits - now directly after Core Ingredients */}
                            <div
                                className="py-12 px-6 md:px-12"
                                style={{ background: `linear-gradient(180deg, ${product.color}10, transparent)` }}
                            >
                                <div className="max-w-4xl mx-auto">
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-black uppercase mb-2">
                                            {language === 'cn' ? '健康益处' : 'Health Benefits'}
                                        </h2>
                                        <div
                                            className="w-24 h-1 mx-auto"
                                            style={{ backgroundColor: product.color }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {getBenefits().map((benefit, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start gap-3 p-4 bg-white border-2 border-black shadow-stark"
                                            >
                                                <span
                                                    className="w-8 h-8 flex items-center justify-center font-black text-white shrink-0"
                                                    style={{ backgroundColor: product.color }}
                                                >
                                                    {index + 1}
                                                </span>
                                                <p className="font-medium">{benefit}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom CTA */}
                            <div className="py-6 px-6 md:px-12 bg-black text-white text-center">
                                <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <p className="text-base font-bold">
                                        {language === 'cn'
                                            ? `准备好试试 ${product.nameCn} 了吗？`
                                            : `Ready to try ${product.name}?`
                                        }
                                    </p>
                                    <Button
                                        onClick={handleAddToCart}
                                        className="h-10 px-8 rounded-none font-black uppercase text-sm border-2 border-primary shadow-stark"
                                        style={{ backgroundColor: product.color }}
                                    >
                                        {isAdded ? (
                                            <>Added! ✓</>
                                        ) : (
                                            <>
                                                {purchaseMode === 'subscribe'
                                                    ? (language === 'cn' ? '开始订阅' : 'Subscribe Now')
                                                    : (language === 'cn' ? '立即购买' : 'Get It Now')
                                                }
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

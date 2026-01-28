'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Star, Plus, Check, Eye, Repeat, ShoppingCart, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { useLanguage } from '@/context/language-context';

interface ProductCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: 'drink' | 'mask';
    rating?: number;
    tags?: string[];
    isSubscription?: boolean;
    onLearnMore?: () => void;
}

export function ProductCard({
    id,
    name,
    description,
    price,
    imageUrl,
    category,
    rating = 5,
    tags = [],
    isSubscription = false,
    onLearnMore,
}: ProductCardProps) {
    const { addItem } = useCart();
    const { t, language } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [purchaseMode, setPurchaseMode] = useState<'once' | 'subscribe'>('once');

    // 3D Tilt Effect Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;
        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const itemPrice = purchaseMode === 'subscribe' ? price * 0.85 : price; // 15% off for subscription

        addItem({
            id: purchaseMode === 'subscribe' ? `${id}-sub` : id,
            name: purchaseMode === 'subscribe'
                ? `${name} (${language === 'cn' ? '订阅' : language === 'jp' ? '定期' : 'Subscribe'})`
                : name,
            price: itemPrice,
            imageUrl,
            category,
            isSubscription: purchaseMode === 'subscribe',
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    // Calculate prices
    const oneTimePrice = price;
    const subscribePrice = (price * 0.85).toFixed(2);

    // Text translations
    const buyOnceText = language === 'cn' ? '单次购买' : language === 'jp' ? '単品購入' : 'Buy Once';
    const subscribeText = language === 'cn' ? '订阅 -15%' : language === 'jp' ? '定期 -15%' : 'Subscribe -15%';

    return (
        <motion.div
            style={{
                perspective: 1000,
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
        >
            <motion.div
                style={{
                    rotateX: isHovered ? rotateX : 0,
                    rotateY: isHovered ? rotateY : 0,
                    z: isHovered ? 20 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full group relative transform-gpu preserve-3d"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
            >
                <Card className="overflow-hidden border-4 border-black shadow-stark hover:shadow-stark-hover bg-background h-full flex flex-col relative transition-all duration-100 rounded-none hover:border-[#39FF14]">

                    {/* Image Area with "Layer Reveal" Effect */}
                    <div className="relative aspect-[4/4] overflow-hidden bg-stone-900">
                        {/* Layer 1: Base Image */}
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-br transition-opacity duration-700",
                            "from-stone-800 to-stone-900",
                            "opacity-100"
                        )} />

                        {/* Mock Image Content */}
                        <div className="absolute inset-0 flex items-center justify-center text-stone-700/30 font-bold text-8xl">
                            {name.charAt(0)}
                        </div>

                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-0"
                            onLoadingComplete={(img) => img.classList.remove('opacity-0')}
                        />

                        {/* Layer 2: Overlay Reveal on Hover */}
                        <div className={cn(
                            "absolute inset-0 bg-stone-900/20 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center z-20",
                            isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        )}>
                            <Button
                                variant="secondary"
                                size="sm"
                                asChild
                                className="scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-100 shadow-lg text-xs md:text-sm pointer-events-auto"
                            >
                                <Link href={`/shop/drinks/${id}`}>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {language === 'cn' ? '了解更多' : language === 'jp' ? '詳細を見る' : 'Learn More'}
                                </Link>
                            </Button>
                        </div>

                        {/* Punk badge */}
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white backdrop-blur-md border-none font-bold tracking-wide shadow-lg z-10 uppercase text-[10px]">
                            🔥 {language === 'cn' ? '功能饮料' : language === 'jp' ? '機能性ソーダ' : 'Functional Soda'}
                        </Badge>
                    </div>

                    <CardContent className="p-4 flex-grow flex flex-col relative z-20 bg-stone-50">
                        {/* Fixed height tags row */}
                        <div className="flex justify-between items-start mb-2 min-h-[24px]">
                            <div className="flex gap-1 flex-wrap">
                                {tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="text-[9px] uppercase tracking-wider font-bold text-white bg-stone-800 px-1.5 py-0.5 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-1 text-stone-900 group-hover:text-pink-600 transition-colors duration-300 tracking-tight line-clamp-1">
                            {name}
                        </h3>
                        <p className="text-xs text-stone-500 line-clamp-2 mb-3 leading-relaxed min-h-[32px]">
                            {description}
                        </p>

                        {/* Purchase Mode Toggle */}
                        {isSubscription && (
                            <div className="flex gap-1.5 mb-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setPurchaseMode('once'); }}
                                    className={cn(
                                        "flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1",
                                        purchaseMode === 'once'
                                            ? "bg-stone-900 text-white shadow-md"
                                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                    )}
                                >
                                    <ShoppingCart className="w-2.5 h-2.5" />
                                    {buyOnceText}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setPurchaseMode('subscribe'); }}
                                    className={cn(
                                        "flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1",
                                        purchaseMode === 'subscribe'
                                            ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
                                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                    )}
                                >
                                    <Repeat className="w-2.5 h-2.5" />
                                    {subscribeText}
                                </button>
                            </div>
                        )}

                        <div className="mt-auto flex items-end justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wide">{t('shop.price')}</span>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-bold text-stone-900">
                                        ${purchaseMode === 'subscribe' ? subscribePrice : oneTimePrice.toFixed(2)}
                                    </span>
                                    {purchaseMode === 'subscribe' && (
                                        <span className="text-[10px] font-medium text-stone-400 line-through">
                                            ${oneTimePrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center text-yellow-500 bg-yellow-50 px-1.5 py-0.5 rounded-md">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-[10px] font-bold ml-0.5 text-yellow-700">{rating}.0</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="p-3 pt-0 bg-stone-50 relative z-20">
                        <Button
                            className={cn(
                                "w-full rounded-full transition-all duration-500 shadow-md font-bold text-sm",
                                isAdded
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-black"
                                    : purchaseMode === 'subscribe'
                                        ? "variant-punk shadow-stark border-2 border-black bg-secondary hover:bg-secondary/90 text-white"
                                        : "bg-black hover:bg-stone-800 text-white"
                            )}
                            onClick={handleAddToCart}
                            size="default"
                        >
                            <AnimatePresence mode="wait">
                                {isAdded ? (
                                    <motion.div
                                        key="added"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center"
                                    >
                                        <Check className="w-4 h-4 mr-2" /> {t('shop.added')}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="add"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center"
                                    >
                                        {purchaseMode === 'subscribe' ? (
                                            <>
                                                <Zap className="w-4 h-4 mr-2" />
                                                {language === 'cn' ? '开始订阅' : language === 'jp' ? '定期購入' : 'Start Subscription'}
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-2" /> {t('shop.add_to_cart')}
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </motion.div>
    );
}

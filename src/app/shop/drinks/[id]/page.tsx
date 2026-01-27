'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Check, Zap, Truck, Gift, ShoppingCart, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { products } from '@/lib/products';
import { useCart } from '@/context/cart-context';
import { useLanguage } from '@/context/language-context';
import { IngredientFlipCard } from '@/components/shop/IngredientFlipCard';

// Gallery images for each product
const productGallery: Record<string, string[]> = {
    'wrecked-ralph': ['/wrecked-ralph.png', '/wrecked-ralph-2.png', '/wrecked-ralph-3.png'],
    'bloated-bob': ['/bloated-bob.png', '/bloated-bob-2.png'],
    'heavy-kev': ['/heavy-kev.png', '/heavy-kev-2.png'],
    'manic-max': ['/manic-max.png', '/manic-max-2.png'],
};

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCart();
    const { t, language } = useLanguage();

    const productId = params.id as string;
    const product = products.find(p => p.id === productId);

    const [selectedImage, setSelectedImage] = useState(0);
    const [purchaseMode, setPurchaseMode] = useState<'subscribe' | 'once'>('subscribe');
    const [deliveryFrequency, setDeliveryFrequency] = useState(30);
    const [isAdded, setIsAdded] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">Product Not Found</h1>
                    <Button asChild>
                        <Link href="/shop/drinks">Back to Shop</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const galleryImages = productGallery[productId] || [product.imageUrl];
    const name = language === 'cn' ? product.nameCn : product.name;
    const tagline = language === 'cn' ? product.taglineCn : product.tagline;
    const description = language === 'cn' ? product.descriptionCn : product.description;
    const tags = language === 'cn' ? product.tagsCn : product.tags;

    const oneTimePrice = product.price;
    const subscribePrice = (product.price * 0.85).toFixed(2);
    const savingsAmount = (product.price * 0.15).toFixed(2);

    const handleAddToCart = () => {
        const itemPrice = purchaseMode === 'subscribe' ? product.price * 0.85 : product.price;

        addItem({
            id: purchaseMode === 'subscribe' ? `${product.id}-sub` : product.id,
            name: purchaseMode === 'subscribe'
                ? `${name} (${language === 'cn' ? '订阅' : 'Subscribe'})`
                : name,
            price: itemPrice,
            imageUrl: product.imageUrl,
            category: 'drink',
            isSubscription: purchaseMode === 'subscribe',
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="min-h-screen bg-stone-100">
            {/* Punk Back Button */}
            <motion.div
                className="fixed top-24 right-6 z-50"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <motion.button
                    onClick={() => router.push('/shop/drinks')}
                    className="group relative px-6 py-3 bg-black text-white font-black uppercase tracking-wider border-4 border-black rounded-none overflow-hidden hover:bg-secondary transition-colors duration-200"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" />
                        {language === 'cn' ? '返回商店' : 'Back to Shop'}
                    </span>
                </motion.button>
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 pt-20">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">

                    {/* LEFT: Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <motion.div
                            className="relative aspect-square bg-white rounded-3xl overflow-hidden border-4 border-black shadow-stark"
                            layoutId={`product-image-${productId}`}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full"
                                >
                                    <Image
                                        src={galleryImages[selectedImage]}
                                        alt={name}
                                        fill
                                        className="object-contain p-8"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Thumbnail Row */}
                        {galleryImages.length > 1 && (
                            <div className="flex gap-3 justify-center">
                                {galleryImages.map((img, idx) => (
                                    <motion.button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-3 transition-all ${selectedImage === idx
                                            ? 'border-black ring-2 ring-primary'
                                            : 'border-stone-300 hover:border-black'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${name} view ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Purchase Panel */}
                    <div className="space-y-6">
                        {/* Product Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-primary text-black font-bold uppercase">
                                    Functional Soda
                                </Badge>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
                                {name}
                            </h1>
                            <p className="text-xl text-stone-600 italic mb-4">{tagline}</p>

                            {/* Stars */}
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-sm text-stone-600">4.9 (127 reviews)</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="border-2 border-black font-bold">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        {/* Purchase Options */}
                        <div className="space-y-4">
                            {/* Subscribe Option */}
                            <motion.div
                                onClick={() => setPurchaseMode('subscribe')}
                                className={`relative p-6 rounded-2xl border-3 cursor-pointer transition-all ${purchaseMode === 'subscribe'
                                    ? 'border-black bg-white shadow-stark'
                                    : 'border-stone-300 bg-stone-50 hover:border-stone-400'
                                    }`}
                                whileHover={{ scale: purchaseMode === 'subscribe' ? 1 : 1.01 }}
                            >
                                {/* Most Popular Badge */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-black text-white font-bold uppercase px-4">
                                        {language === 'cn' ? '最受欢迎' : 'Most Popular'}
                                    </Badge>
                                </div>

                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-3 flex items-center justify-center ${purchaseMode === 'subscribe' ? 'border-black bg-black' : 'border-stone-400'
                                            }`}>
                                            {purchaseMode === 'subscribe' && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg">
                                                {language === 'cn' ? '订阅并节省' : 'Autoship & Save'}
                                            </h3>
                                            <p className="text-sm text-stone-600">
                                                ${(parseFloat(subscribePrice) / 6).toFixed(2)} {language === 'cn' ? '每罐' : 'Per Can'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            <span className="text-stone-400 line-through">${oneTimePrice}</span>
                                            <span className="text-2xl font-black">${subscribePrice}</span>
                                        </div>
                                        <Badge className="bg-primary text-black font-bold">
                                            SAVE ${savingsAmount}
                                        </Badge>
                                    </div>
                                </div>

                                {purchaseMode === 'subscribe' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="space-y-3"
                                    >
                                        <div className="flex flex-col gap-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-primary" />
                                                <span>{language === 'cn' ? '额外15%折扣' : 'Extra 15% OFF'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Truck className="w-4 h-4 text-primary" />
                                                <span>{language === 'cn' ? '免费配送' : 'FREE Shipping'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Gift className="w-4 h-4 text-primary" />
                                                <span>{language === 'cn' ? '随时取消' : 'Cancel Anytime'}</span>
                                            </div>
                                        </div>

                                        {/* Delivery Frequency */}
                                        <div className="relative">
                                            <select
                                                value={deliveryFrequency}
                                                onChange={(e) => setDeliveryFrequency(Number(e.target.value))}
                                                className="w-full p-3 border-2 border-stone-300 rounded-xl appearance-none bg-white font-medium cursor-pointer"
                                            >
                                                <option value={14}>{language === 'cn' ? '每14天配送' : 'Delivery every 14 days'}</option>
                                                <option value={30}>{language === 'cn' ? '每30天配送' : 'Delivery every 30 days'}</option>
                                                <option value={60}>{language === 'cn' ? '每60天配送' : 'Delivery every 60 days'}</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 pointer-events-none" />
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* One Time Purchase */}
                            <motion.div
                                onClick={() => setPurchaseMode('once')}
                                className={`p-6 rounded-2xl border-3 cursor-pointer transition-all ${purchaseMode === 'once'
                                    ? 'border-black bg-white shadow-stark'
                                    : 'border-stone-300 bg-stone-50 hover:border-stone-400'
                                    }`}
                                whileHover={{ scale: purchaseMode === 'once' ? 1 : 1.01 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-3 flex items-center justify-center ${purchaseMode === 'once' ? 'border-black bg-black' : 'border-stone-400'
                                            }`}>
                                            {purchaseMode === 'once' && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <h3 className="font-black text-lg">
                                            {language === 'cn' ? '单次购买' : 'One Time Purchase'}
                                        </h3>
                                    </div>
                                    <span className="text-2xl font-black">${oneTimePrice}</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Add to Cart Button */}
                        <motion.button
                            onClick={handleAddToCart}
                            className={`w-full py-5 text-xl font-black uppercase tracking-wider rounded-2xl border-4 transition-all ${isAdded
                                ? 'bg-primary text-black border-primary'
                                : 'bg-stone-900 text-white border-black hover:bg-black'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="flex items-center justify-center gap-3">
                                {isAdded ? (
                                    <>
                                        <Check className="w-6 h-6" />
                                        {language === 'cn' ? '已添加!' : 'Added!'}
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-6 h-6" />
                                        {language === 'cn' ? '加入购物车' : 'Add to Cart'}
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="mt-16 space-y-16">
                    {/* Description */}
                    <section className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-black uppercase mb-6">
                            {language === 'cn' ? '关于此产品' : 'About This Product'}
                        </h2>
                        <p className="text-xl text-stone-700 leading-relaxed">
                            {description}
                        </p>
                    </section>

                    {/* Flavor Profile */}
                    <section className="bg-white rounded-3xl p-8 md:p-12 border-4 border-black shadow-stark max-w-4xl mx-auto">
                        <div className="text-center">
                            <h3 className="text-2xl font-black uppercase mb-4">
                                {language === 'cn' ? '风味特征' : 'Flavor Profile'}
                            </h3>
                            <p className="text-3xl font-black mb-4" style={{ color: product.color }}>
                                {language === 'cn' ? product.flavorProfileCn : product.flavorProfile}
                            </p>
                            <p className="text-lg text-stone-600 italic">
                                {language === 'cn' ? product.flavorDescriptionCn : product.flavorDescription}
                            </p>
                        </div>
                    </section>

                    {/* Ingredients Section */}
                    <section className="bg-stone-900 rounded-3xl p-8 md:p-12 text-white">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">
                                {language === 'cn' ? '配方揭秘' : 'The Formula'}
                            </h2>
                            <p className="text-stone-400">
                                {language === 'cn' ? '悬停查看功效' : 'Hover to see benefits'}
                            </p>
                        </div>

                        {/* Core Ingredients */}
                        <div className="mb-12">
                            <h3 className="text-xl font-black uppercase mb-6 text-center text-primary">
                                {language === 'cn' ? '核心成分' : 'Core Ingredients'}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {product.coreIngredients.map((ingredient, idx) => (
                                    <IngredientFlipCard
                                        key={idx}
                                        ingredient={ingredient}
                                        index={idx}
                                        accentColor={product.color}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Base Ingredients */}
                        <div>
                            <h3 className="text-xl font-black uppercase mb-6 text-center text-stone-400">
                                {language === 'cn' ? '基础配料' : 'Base Ingredients'}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.baseIngredients.slice(0, 4).map((ingredient, idx) => (
                                    <IngredientFlipCard
                                        key={idx}
                                        ingredient={ingredient}
                                        index={idx + product.coreIngredients.length}
                                        accentColor={product.color}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Benefits Section */}
                    <section className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-black uppercase mb-8 text-center">
                            {language === 'cn' ? '功效' : 'Benefits'}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {(language === 'cn' ? product.benefitsCn : product.benefits).map((benefit, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-4 p-6 bg-white rounded-2xl border-3 border-black shadow-stark"
                                >
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: product.color }}
                                    >
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-lg font-medium">{benefit}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Bottom Spacer */}
            <div className="h-24" />
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductDetailModal } from '@/components/shop/ProductDetailModal';
import { useLanguage } from '@/context/language-context';
import { products, ProductDetail } from '@/lib/products';
import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';

// Extract unique brands and tags for filters
const brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D'];
const allTags = ['Hangover', 'Detox', 'Liver Support', 'Digestion', 'Bloating Relief', 'Gut Health', 'Metabolism', 'Water Retention', 'Slimming', 'Calm', 'Anti-Anxiety', 'Sleep Support'];

export default function DrinksPage() {
    const { t, language } = useLanguage();
    const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Filter products based on search, brand, and tag
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const name = language === 'cn' ? product.nameCn : product.name;
            const matchesSearch = searchQuery === '' ||
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesBrand = !selectedBrand || product.name.includes(selectedBrand);
            const matchesTag = !selectedTag || product.tags.includes(selectedTag);

            return matchesSearch && matchesBrand && matchesTag;
        });
    }, [searchQuery, selectedBrand, selectedTag, language]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedBrand(null);
        setSelectedTag(null);
    };

    const hasActiveFilters = searchQuery || selectedBrand || selectedTag;

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
                            {language === 'cn' ? '养生饮品' : language === 'jp' ? 'ウェルネスドリンク' : 'Wellness Elixirs'}
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

            {/* FILTER SECTION */}
            <section className="py-6 px-4 bg-white border-b-2 border-stone-200">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Input */}
                        <div className="relative w-full md:w-auto md:flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder={t('shop.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-none bg-white text-black font-mono text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <Filter className="w-4 h-4 text-stone-500 hidden md:block" />

                            {/* Brand Filter */}
                            <div className="flex gap-1">
                                {brands.map(brand => (
                                    <button
                                        key={brand}
                                        onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                                        className={`px-3 py-1 text-xs font-bold uppercase border-2 transition-all ${selectedBrand === brand
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-black border-stone-300 hover:border-black'
                                            }`}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase bg-red-500 text-white border-2 border-red-600 hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                    {t('shop.clear_filter')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Benefit Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className="text-xs font-bold text-stone-500 uppercase mr-2">
                            {t('shop.by_benefit')}
                        </span>
                        {allTags.slice(0, 6).map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border transition-all ${selectedTag === tag
                                    ? 'bg-primary text-black border-primary'
                                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:border-primary'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
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
                    {/* Results count */}
                    {hasActiveFilters && (
                        <p className="text-sm text-stone-500 mb-6 font-mono">
                            {t('shop.found_products').replace('{count}', filteredProducts.length.toString())}
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard
                                    id={product.id}
                                    name={language === 'cn' ? product.nameCn : product.name}
                                    description={language === 'cn' ? product.descriptionCn : product.description}
                                    price={product.price}
                                    imageUrl={product.imageUrl}
                                    category="drink"
                                    tags={language === 'cn' ? product.tagsCn : product.tags}
                                    rating={5}
                                    isSubscription={true}
                                    onLearnMore={() => setSelectedProduct(product)}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* No results message */}
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-lg font-bold text-stone-500">
                                {t('shop.no_products')}
                            </p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 px-6 py-2 bg-black text-white font-bold uppercase text-sm border-2 border-black hover:bg-primary hover:text-black transition-colors"
                            >
                                {t('shop.clear_filters')}
                            </button>
                        </div>
                    )}
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
            </section>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}

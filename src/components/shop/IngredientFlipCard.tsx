'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ingredient } from '@/lib/products';
import { useLanguage } from '@/context/language-context';

interface IngredientFlipCardProps {
    ingredient: Ingredient;
    index: number;
    accentColor: string;
}

export function IngredientFlipCard({ ingredient, index, accentColor }: IngredientFlipCardProps) {
    const { language } = useLanguage();
    const [isFlipped, setIsFlipped] = useState(false);

    const getName = () => language === 'cn' ? ingredient.nameCn : ingredient.name;
    const getBenefit = () => language === 'cn' ? ingredient.benefitCn : ingredient.benefit;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative h-56 md:h-64 cursor-pointer perspective-1000"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div
                className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''
                    }`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front - Photo */}
                <div
                    className="absolute inset-0 backface-hidden overflow-hidden rounded-xl border-2 border-white/20 group"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* Realistic herbal photo background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: ingredient.imageUrl
                                ? `url(${ingredient.imageUrl})`
                                : `linear-gradient(135deg, ${accentColor}40, ${accentColor}80)`,
                        }}
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Index number */}
                    <span
                        className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded bg-white/20 text-white backdrop-blur-sm"
                    >
                        {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-xl md:text-2xl font-black text-white leading-tight mb-1">
                            {getName()}
                        </h4>
                        <p className="text-xs text-white/60 font-medium">
                            {language === 'cn' ? '了解更多' : 'Learn more'}
                        </p>
                    </div>

                    {/* Emoji indicator */}
                    <span className="absolute top-3 right-3 text-2xl drop-shadow-lg">
                        {ingredient.emoji}
                    </span>
                </div>

                {/* Back - Benefit */}
                <div
                    className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-xl border-2 p-5 flex flex-col justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        backgroundColor: accentColor,
                        borderColor: accentColor,
                    }}
                >
                    <span className="text-4xl mb-3">{ingredient.emoji}</span>
                    <h4 className="text-lg font-black text-white mb-2 leading-tight">
                        {getName()}
                    </h4>
                    <p className="text-xs text-white/70 italic mb-3">
                        {ingredient.scientificName}
                    </p>
                    <p className="text-sm text-white/90 leading-relaxed">
                        {getBenefit()}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

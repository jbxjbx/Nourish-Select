'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            className="relative h-56 md:h-64 cursor-pointer"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Front - Photo */}
            <motion.div
                className="absolute inset-0 overflow-hidden rounded-xl border-2 border-white/20"
                initial={false}
                animate={{
                    opacity: isFlipped ? 0 : 1,
                    scale: isFlipped ? 0.95 : 1,
                    rotateY: isFlipped ? 90 : 0,
                }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ pointerEvents: isFlipped ? 'none' : 'auto' }}
            >
                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: ingredient.imageUrl
                            ? `url(${ingredient.imageUrl})`
                            : `linear-gradient(135deg, ${accentColor}40, ${accentColor}80)`,
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Index */}
                <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded bg-white/20 text-white backdrop-blur-sm">
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


            </motion.div>

            {/* Back - Benefit */}
            <motion.div
                className="absolute inset-0 overflow-hidden rounded-xl border-2 p-5 flex flex-col justify-center"
                initial={false}
                animate={{
                    opacity: isFlipped ? 1 : 0,
                    scale: isFlipped ? 1 : 0.95,
                    rotateY: isFlipped ? 0 : -90,
                }}
                transition={{ duration: 0.25, ease: 'easeInOut', delay: isFlipped ? 0.15 : 0 }}
                style={{
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                    pointerEvents: isFlipped ? 'auto' : 'none',
                }}
            >

                <h4 className="text-lg font-black text-white mb-2 leading-tight">
                    {getName()}
                </h4>
                <p className="text-xs text-white/70 italic mb-3">
                    {ingredient.scientificName}
                </p>
                <p className="text-sm text-white/90 leading-relaxed">
                    {getBenefit()}
                </p>
            </motion.div>
        </motion.div>
    );
}



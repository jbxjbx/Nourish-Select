'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { IngredientsSection } from '@/components/home/IngredientsSection';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, Footprints } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Interactive Hero */}
      <HeroSection />

      {/* Feature Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-100/50 -skew-x-12 z-0" />

        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4">{t('feature.title')}</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-none shadow-xl bg-white hover:-translate-y-2 transition-transform duration-500 overflow-hidden group">
                <div className="h-2 w-full bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold mb-3 text-stone-900">{t('feature.card_1_title')}</h3>
                  <p className="text-stone-500 leading-relaxed">
                    {t('feature.card_1_desc')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-none shadow-xl bg-white hover:-translate-y-2 transition-transform duration-500 overflow-hidden group">
                <div className="h-2 w-full bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                    <Droplets className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold mb-3 text-stone-900">{t('feature.card_2_title')}</h3>
                  <p className="text-stone-500 leading-relaxed">
                    {t('feature.card_2_desc')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full border-none shadow-xl bg-white hover:-translate-y-2 transition-transform duration-500 overflow-hidden group">
                <div className="h-2 w-full bg-stone-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center mb-6 group-hover:bg-stone-800 group-hover:text-white transition-colors duration-300">
                    <Footprints className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold mb-3 text-stone-900">{t('feature.card_3_title')}</h3>
                  <p className="text-stone-500 leading-relaxed">
                    {t('feature.card_3_desc')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Super Ingredients Section */}
      <IngredientsSection />

      {/* Customer Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}

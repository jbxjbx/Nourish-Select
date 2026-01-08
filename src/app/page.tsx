'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { IngredientsSection } from '@/components/home/IngredientsSection';
import { OrganicBlobs } from '@/components/ui/FloatingParticles';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, Footprints, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      {/* Interactive Hero */}
      <HeroSection />

      {/* Feature Section - Enhanced with organic backgrounds */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Organic background blobs */}
        <OrganicBlobs className="opacity-50" />

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-amber-50/20 z-0" />

        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.015] z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container px-4 mx-auto relative z-10">
          {/* Section Header with animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center"
            >
              <Leaf className="w-8 h-8 text-emerald-600" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4">{t('feature.title')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-amber-400 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
            {/* Feature 1 - AI Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card className="h-full border-none shadow-xl shadow-emerald-900/5 bg-white/80 backdrop-blur-sm hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 overflow-hidden group">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                  >
                    <Sparkles className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-serif font-semibold mb-3 text-stone-900">{t('feature.card_1_title')}</h3>
                  <p className="text-stone-500 leading-relaxed">
                    {t('feature.card_1_desc')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 2 - Elixirs */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="h-full border-none shadow-xl shadow-amber-900/5 bg-white/80 backdrop-blur-sm hover:-translate-y-3 hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-500 overflow-hidden group">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:from-amber-500 group-hover:to-amber-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3"
                    whileHover={{ rotate: [0, 5, -5, 0] }}
                  >
                    <Droplets className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-serif font-semibold mb-3 text-stone-900">{t('feature.card_2_title')}</h3>
                  <p className="text-stone-500 leading-relaxed">
                    {t('feature.card_2_desc')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 3 - Foot Masks - Hidden for now, launching later
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="h-full border-none shadow-xl shadow-stone-900/5 bg-white/80 backdrop-blur-sm hover:-translate-y-3 hover:shadow-2xl hover:shadow-stone-900/10 transition-all duration-500 overflow-hidden group">
                <div className="h-1.5 w-full bg-gradient-to-r from-stone-400 to-stone-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 text-stone-600 flex items-center justify-center mb-6 group-hover:from-stone-700 group-hover:to-stone-800 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                  >
                    <Footprints className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-serif font-semibold mb-3 text-stone-900">{t('feature.card_3_title')}</h3>
                  <p className="text-stone-500 leading-relaxed">
                    {t('feature.card_3_desc')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            */}
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

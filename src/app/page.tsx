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

      {/* Feature Section - CYBERPUNK STYLE */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-black">
        {/* Cyber Grid Overlay */}
        <div className="absolute inset-0 bg-grid-cyber opacity-30" />

        {/* Scanlines */}
        <div className="absolute inset-0 scanlines opacity-20" />

        {/* Noise texture */}
        <div className="absolute inset-0 bg-noise opacity-30" />

        <div className="container px-4 mx-auto relative z-10">
          {/* Section Header - Brutalist */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-primary text-black font-black text-sm px-4 py-2 mb-6 transform -rotate-1 shadow-stark">
              // CORE FEATURES
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase">
              {t('feature.title')}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-[#FF10F0] via-[#39FF14] to-[#FF10F0] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
            {/* Feature 1 - AI Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Card className="h-full border-4 border-white bg-black hover:border-[#39FF14] transition-colors duration-100 overflow-hidden group rounded-none">
                <div className="h-1 w-full bg-[#39FF14] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-20 h-20 border-4 border-white bg-black text-[#39FF14] flex items-center justify-center mb-6 group-hover:bg-[#39FF14] group-hover:text-black transition-colors duration-100">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-white uppercase tracking-tight">{t('feature.card_1_title')}</h3>
                  <p className="text-stone-400 leading-relaxed font-mono text-sm">
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
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Card className="h-full border-4 border-white bg-black hover:border-[#FF10F0] transition-colors duration-100 overflow-hidden group rounded-none">
                <div className="h-1 w-full bg-[#FF10F0] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-20 h-20 border-4 border-white bg-black text-[#FF10F0] flex items-center justify-center mb-6 group-hover:bg-[#FF10F0] group-hover:text-black transition-colors duration-100">
                    <Droplets className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-white uppercase tracking-tight">{t('feature.card_2_title')}</h3>
                  <p className="text-stone-400 leading-relaxed font-mono text-sm">
                    {t('feature.card_2_desc')}
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

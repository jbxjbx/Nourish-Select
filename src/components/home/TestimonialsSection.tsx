'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const testimonials = [
    {
        name: 'Sarah M.',
        role: 'Yoga Instructor',
        content_en: "I've tried many wellness drinks, but Nourish Select is different. It genuinely improved my energy and focus without any jitters. My students have noticed the difference!",
        content_zh: "我尝试过很多养生饮品，但Nourish Select与众不同。它真正提升了我的能量和专注力，没有任何不适。我的学生都注意到了变化！",
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    },
    {
        name: 'Michael C.',
        role: 'Software Engineer',
        content_en: "As someone who stares at screens all day, I needed something for my tired eyes and mental fatigue. The AI tongue analysis recommended the perfect blend for me. Game changer!",
        content_zh: "作为一个整天盯着屏幕的人，我需要缓解眼疲劳和精神疲劳。AI舌诊为我推荐了完美的配方。太棒了！",
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
        name: 'Lisa W.',
        role: 'Busy Mom of 3',
        content_en: "With three kids, I'm always exhausted. Nourish Select has completely changed how my days feel. I have sustained energy from morning to evening!",
        content_zh: "带着三个孩子，我总是筋疲力尽。Nourish Select完全改变了我的日常感受。从早到晚都有持续的能量！",
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    {
        name: 'David K.',
        role: 'Martial Arts Coach',
        content_en: "Just 8 simple ingredients that provide immune support, improved focus, and boosted metabolism. Everything I need for my training career!",
        content_zh: "只有8种简单成分，提供免疫支持、改善专注力和促进新陈代谢。这正是我训练事业所需要的一切！",
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
];

export function TestimonialsSection() {
    const { language } = useLanguage();

    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            {/* Organic gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-emerald-50/30 to-white" />

            {/* Decorative organic shapes */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.3) 1px, transparent 0)`,
                backgroundSize: '40px 40px',
            }} />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-sm font-medium tracking-widest text-emerald-700 uppercase border border-emerald-200 rounded-full bg-gradient-to-r from-emerald-50 to-white shadow-sm"
                    >
                        <Sparkles className="w-4 h-4" />
                        {language === 'cn' ? '真实评价' : 'Real Reviews'}
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
                        {language === 'cn' ? '用户怎么说' : 'What Our Customers Say'}
                    </h2>
                    <motion.div
                        className="w-32 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-amber-400 mx-auto rounded-full"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    />
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto mt-4">
                        {language === 'cn'
                            ? '来自我们社区真实用户的声音'
                            : 'Hear from real people in our wellness community'}
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="group"
                        >
                            <div className="h-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-stone-200/50 border border-stone-100/50 hover:shadow-xl hover:shadow-emerald-100/50 hover:border-emerald-100 transition-all duration-500">
                                {/* Quote Icon with gradient */}
                                <div className="relative mb-4">
                                    <Quote className="w-10 h-10 text-emerald-100 group-hover:text-emerald-200 transition-colors duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                {/* Rating with animation */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 + i * 0.05 }}
                                        >
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-stone-700 mb-6 leading-relaxed text-sm">
                                    "{language === 'cn' ? testimonial.content_zh : testimonial.content_en}"
                                </p>

                                {/* Author with hover effect */}
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-11 h-11 rounded-full object-cover ring-2 ring-stone-100 group-hover:ring-emerald-200 transition-all duration-300"
                                        />
                                        <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-amber-400 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-stone-900 text-sm group-hover:text-emerald-700 transition-colors duration-300">{testimonial.name}</p>
                                        <p className="text-xs text-stone-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badge with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-14"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-stone-200/50 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-stone-600 text-sm font-medium">
                            {language === 'cn' ? '30天无条件退款保证' : '30-Day Money Back Guarantee'}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

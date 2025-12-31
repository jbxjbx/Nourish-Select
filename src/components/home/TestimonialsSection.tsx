'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
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
    const { language, t } = useLanguage();

    return (
        <section className="py-20 md:py-32 bg-gradient-to-b from-stone-50 to-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium tracking-widest text-emerald-600 uppercase border border-emerald-200 rounded-full bg-emerald-50">
                        {language === 'cn' ? '真实评价' : 'Real Reviews'}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
                        {language === 'cn' ? '用户怎么说' : 'What Our Customers Say'}
                    </h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
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
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-lg shadow-stone-200/50 border border-stone-100 hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Quote Icon */}
                            <Quote className="w-8 h-8 text-emerald-200 mb-4" />

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-stone-700 mb-6 leading-relaxed text-sm">
                                "{language === 'cn' ? testimonial.content_zh : testimonial.content_en}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-stone-900 text-sm">{testimonial.name}</p>
                                    <p className="text-xs text-stone-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-stone-500 text-sm">
                        {language === 'cn' ? '30天无条件退款保证' : '30-Day Money Back Guarantee'}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

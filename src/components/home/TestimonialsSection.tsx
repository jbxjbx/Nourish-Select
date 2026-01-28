'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const testimonials = [
    {
        name: 'Sarah M.',
        role: 'Yoga Instructor',
        content_en: "I've tried many wellness drinks, but Nourish Select is different. It genuinely improved my energy and focus without any jitters. My students have noticed the difference!",
        content_zh: "我尝试过很多养生饮品，但Nourish Select与众不同。它真正提升了我的能量和专注力，没有任何不适。我的学生都注意到了变化！",
        content_jp: "多くのウェルネスドリンクを試しましたが、Nourish Selectは違います。本当にエネルギーと集中力が向上し、不快感はありません。生徒たちも変化に気づいています！",
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    },
    {
        name: 'Michael C.',
        role: 'Software Engineer',
        content_en: "As someone who stares at screens all day, I needed something for my tired eyes and mental fatigue. The AI tongue analysis recommended the perfect blend for me. Game changer!",
        content_zh: "作为一个整天盯着屏幕的人，我需要缓解眼疲劳和精神疲劳。AI舌诊为我推荐了完美的配方。太棒了！",
        content_jp: "一日中画面を見ている者として、疲れ目と精神的疲労に必要なものを探していました。AI舌診断が私に最適なブレンドを推薦してくれました。革命的です！",
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
        name: 'Lisa W.',
        role: 'Busy Mom of 3',
        content_en: "With three kids, I'm always exhausted. Nourish Select has completely changed how my days feel. I have sustained energy from morning to evening!",
        content_zh: "带着三个孩子，我总是筋疲力尽。Nourish Select完全改变了我的日常感受。从早到晚都有持续的能量！",
        content_jp: "3人の子供がいて、いつも疲れ果てています。Nourish Selectは私の日々の感覚を完全に変えました。朝から晩まで持続するエネルギーがあります！",
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    {
        name: 'David K.',
        role: 'Martial Arts Coach',
        content_en: "Just 8 simple ingredients that provide immune support, improved focus, and boosted metabolism. Everything I need for my training career!",
        content_zh: "只有8种简单成分，提供免疫支持、改善专注力和促进新陈代谢。这正是我训练事业所需要的一切！",
        content_jp: "たった8つのシンプルな成分で、免疫サポート、集中力向上、代謝促進。私のトレーニングキャリアに必要なすべてです！",
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
];

export function TestimonialsSection() {
    const { language } = useLanguage();

    return (
        <section className="py-20 md:py-32 relative overflow-hidden bg-secondary text-black">
            {/* NOISE OVERLAY */}
            <div className="absolute inset-0 bg-noise opacity-30 z-0 pointer-events-none" />

            {/* TAPE BORDERS */}
            <div className="absolute top-0 left-0 w-full h-4 bg-black/10 rotate-1 transform scale-110" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-4 uppercase stroke-black tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-shadow">
                        {language === 'cn' ? '用户怎么说' : language === 'jp' ? 'リアルな声' : 'REAL TALK'}
                    </h2>
                    <div className="inline-block bg-black text-white px-4 py-1 font-mono text-sm transform -rotate-2">
                        {language === 'cn' ? '真实评价' : language === 'jp' ? '本音レビュー' : 'NO BS REVIEWS'}
                    </div>
                </motion.div>

                {/* Mobile: Horizontal Scroll Carousel */}
                <div className="md:hidden overflow-hidden">
                    <div
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-2"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch'
                        } as React.CSSProperties}
                    >
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[80vw] max-w-[320px] snap-center pt-4"
                            >
                                <div className={`bg-white p-5 shadow-stark border-2 border-black ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                                    <div className="flex gap-1 mb-3">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-black text-black" />
                                        ))}
                                    </div>
                                    <p className="text-black font-medium mb-4 leading-relaxed text-xs font-mono bg-yellow-100 p-2">
                                        &quot;{language === 'cn' ? testimonial.content_zh : language === 'jp' ? testimonial.content_jp : testimonial.content_en}&quot;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-10 h-10 grayscale contrast-125 border-2 border-black object-cover"
                                        />
                                        <div>
                                            <p className="font-black text-black text-xs uppercase tracking-tighter">{testimonial.name}</p>
                                            <p className="text-[10px] text-stone-500 font-bold uppercase">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center gap-2 mt-2 text-white/70">
                        <span className="text-xs font-mono">← {language === 'cn' ? '左右滑动' : language === 'jp' ? 'スワイプ' : 'Swipe'} →</span>
                    </div>
                </div>

                {/* Desktop: Grid Layout */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative"
                        >
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/30 backdrop-blur-sm z-20 transform -rotate-2 border-l border-r border-white/50 shadow-sm"></div>

                            <div className={`h-full bg-white p-6 shadow-stark border-2 border-black transition-all duration-300 hover:shadow-stark-hover transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 hover:z-10 relative`}>
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-black text-black" />
                                    ))}
                                </div>
                                <p className="text-black font-medium mb-6 leading-relaxed text-sm font-mono uppercase bg-yellow-100 p-2 inline-block transform -rotate-1">
                                    &quot;{language === 'cn' ? testimonial.content_zh : language === 'jp' ? testimonial.content_jp : testimonial.content_en}&quot;
                                </p>
                                <div className="flex items-center gap-3 mt-auto">
                                    <div className="relative">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-12 h-12 grayscale contrast-125 border-2 border-black object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-black text-black text-sm uppercase tracking-tighter">{testimonial.name}</p>
                                        <p className="text-xs text-stone-500 font-bold uppercase">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

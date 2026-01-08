'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const faqs = [
    {
        question_en: 'What is AI Tongue Analysis?',
        question_zh: 'AI舌诊是什么？',
        answer_en: 'Computer vision meets TCM. Snap a pic, get roasted (and helped). We analyze coating, shape, and color to tell you exactly what your body is screaming for.',
        answer_zh: '计算机视觉遇上中医。拍张照，不仅能被吐槽（还能被拯救）。我们分析舌苔、形状和颜色，告诉你身体到底渴望什么。',
    },
    {
        question_en: 'Any nasty additives?',
        question_zh: '有任何糟糕的添加剂吗？',
        answer_en: 'Zero. None. Zilch. 100% natural, organic, and clean AF. No fake sweeteners, no preservatives, no BS.',
        answer_zh: '零。没有。完全没有。100%天然、有机、超级干净。无人工甜味剂，无防腐剂，无废话。',
    },
    {
        question_en: 'Pregnancy safe?',
        question_zh: '孕期安全吗？',
        answer_en: 'Usually yes, but ask your doc. You\'re growing a human, don\'t take advice from a soda website.',
        answer_zh: '通常是安全的，但请咨询医生。你在孕育生命，别听汽水网站的建议。',
    },
    {
        question_en: 'When to drink?',
        question_zh: '什么时候喝？',
        answer_en: 'Morning for energy. Night for chill. Anytime for immunity. It\'s functional soda, not rocket science.',
        answer_zh: '早上喝提神。晚上喝放松。随时喝增强免疫。这是功能性汽水，不是火箭科学。',
    },
    {
        question_en: 'Shipping time?',
        question_zh: '配送时间？',
        answer_en: 'We ship fast. 3-5 days in the US. International coming soon-ish.',
        answer_zh: '我们发货很快。美国境内3-5天。国际配送即将推出（大概吧）。',
    },
    {
        question_en: 'Why better than tea?',
        question_zh: '为什么比茶好？',
        answer_en: 'Tea is boring. This is effective doses of TCM herbs that actually taste good. Plus, our AI customizes it for you.',
        answer_zh: '茶太无聊了。这是有效剂量的中草药，而且真的好喝。另外，我们的AI为你量身定制。',
    },
    {
        question_en: 'Organic?',
        question_zh: '有机吗？',
        answer_en: '100% Organic. Certified Gluten-Free. Ethical sourcing. We care about the planet, unlike your ex.',
        answer_zh: '100%有机。无麸质认证。道德采购。我们关心地球，不像你的前任。',
    },
    {
        question_en: 'How to cancel sub?',
        question_zh: '怎么取消订阅？',
        answer_en: 'One click in your dashboard. We don\'t hold you hostage. Save 15% if you stay, though.',
        answer_zh: '仪表板一键取消。要把你绑架。不过留下来的话能省15%。',
    },
];

function FAQItem({ faq, isOpen, onToggle, index }: {
    faq: typeof faqs[0];
    isOpen: boolean;
    onToggle: () => void;
    index: number;
}) {
    const { language } = useLanguage();

    return (
        <div className="border-b-2 border-stone-800 last:border-b-2">
            <button
                onClick={onToggle}
                className={`w-full py-6 px-4 flex items-center justify-between text-left transition-all duration-300 ${isOpen ? 'bg-primary text-black' : 'bg-transparent text-white hover:bg-stone-900'}`}
            >
                <span className="text-lg md:text-xl font-black uppercase tracking-tight pr-4">
                    {language === 'cn' ? faq.question_zh : faq.question_en}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                >
                    <ChevronDown className={`w-6 h-6 ${isOpen ? 'text-black' : 'text-primary'}`} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-stone-900"
                    >
                        <p className="p-6 text-stone-300 leading-relaxed font-mono text-sm border-t border-stone-800">
                            <span className="text-primary font-bold mr-2">&gt;</span>
                            {language === 'cn' ? faq.answer_zh : faq.answer_en}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function FAQSection() {
    const { language } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 md:py-32 bg-black text-white relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20" style={{
                backgroundImage: `linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="w-20 h-20 mx-auto mb-6 bg-black border-2 border-primary flex items-center justify-center shadow-[4px_4px_0px_#22c55e]">
                        <HelpCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter">
                        {language === 'cn' ? '常见问题' : 'F*cking Asked Qs'}
                    </h2>
                    <p className="text-xl text-stone-400 max-w-2xl mx-auto font-mono">
                        {language === 'cn'
                            ? '别问了，答案都在这'
                            : 'Don\'t DM us, read this first.'}
                    </p>
                </motion.div>

                {/* FAQ List */}
                <div className="max-w-3xl mx-auto border-2 border-stone-800 shadow-[8px_8px_0px_#333]">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <p className="text-stone-500 font-mono text-sm uppercase">
                        {language === 'cn' ? '还有其他问题？' : 'Still unclear?'}{' '}
                        <a href="mailto:support@nourishselect.co" className="text-primary font-bold hover:underline hover:text-white transition-colors">
                            support@nourishselect.co
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

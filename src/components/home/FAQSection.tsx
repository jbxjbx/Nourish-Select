'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const faqs = [
    {
        question_en: 'What is AI Tongue Analysis and how does it work?',
        question_zh: 'AI舌诊是什么？它是如何工作的？',
        answer_en: 'Our AI Tongue Analysis uses advanced computer vision technology based on Traditional Chinese Medicine principles. Simply take a photo of your tongue, and our AI will analyze its color, coating, shape, and other features to provide personalized wellness recommendations.',
        answer_zh: '我们的AI舌诊使用基于中医原理的先进计算机视觉技术。只需拍摄一张舌头照片，AI就会分析其颜色、舌苔、形状等特征，为您提供个性化的养生建议。',
    },
    {
        question_en: 'Are there any additives or artificial sweeteners in your drinks?',
        question_zh: '你们的饮品中是否含有添加剂或人工甜味剂？',
        answer_en: 'Absolutely none. All our wellness drinks are made with 100% natural, organic ingredients. We believe in the pure power of Traditional Chinese herbs without any artificial additives, sweeteners, or preservatives.',
        answer_zh: '完全没有。我们所有的养生饮品都采用100%天然有机成分制成。我们相信传统中草药的纯净力量，不添加任何人工添加剂、甜味剂或防腐剂。',
    },
    {
        question_en: 'Can I consume your products while pregnant or breastfeeding?',
        question_zh: '怀孕或哺乳期间可以使用你们的产品吗？',
        answer_en: 'While our products contain safe, natural ingredients, we always recommend consulting with your physician before use during pregnancy or breastfeeding. Each person\'s health situation is unique, and professional medical advice is important.',
        answer_zh: '虽然我们的产品含有安全、天然的成分，但我们始终建议在怀孕或哺乳期间使用前咨询医生。每个人的健康状况都是独特的，专业的医疗建议非常重要。',
    },
    {
        question_en: 'When is the best time to drink your wellness elixirs?',
        question_zh: '什么时候饮用养生饮品最好？',
        answer_en: 'It depends on the specific blend. Generally, energizing formulas are best in the morning, calming blends in the evening, and immunity-boosting drinks can be consumed anytime. Each product comes with recommended timing based on TCM principles.',
        answer_zh: '这取决于具体的配方。一般来说，提神配方最适合早晨饮用，舒缓配方适合晚间，增强免疫力的饮品可以随时饮用。每款产品都附有基于中医原理的建议饮用时间。',
    },
    {
        question_en: 'Where do you ship? How long does delivery take?',
        question_zh: '你们发货到哪里？配送需要多长时间？',
        answer_en: 'We currently ship within the United States with free shipping on all subscription orders. Standard delivery takes 3-5 business days. We are working on expanding international shipping options soon.',
        answer_zh: '我们目前在美国境内发货，所有订阅订单均可享受免费配送。标准配送需要3-5个工作日。我们正在努力扩展国际配送选项。',
    },
    {
        question_en: 'What makes your products different from regular herbal teas?',
        question_zh: '你们的产品与普通草药茶有什么不同？',
        answer_en: 'Our formulas are crafted based on authentic TCM principles by certified practitioners. We use premium-grade ingredients in clinically-effective concentrations, not just symbolic amounts. Plus, our AI analysis helps personalize recommendations to your specific constitution.',
        answer_zh: '我们的配方由认证中医师根据正宗中医原理精心调配。我们使用临床有效浓度的优质成分，而不仅仅是象征性的用量。此外，我们的AI分析可以根据您的具体体质提供个性化建议。',
    },
    {
        question_en: 'Are your products organic and gluten-free?',
        question_zh: '你们的产品是有机的和无麸质的吗？',
        answer_en: 'Yes! All our herbal ingredients are 100% organic and certified gluten-free. We source from trusted farms that follow sustainable and ethical practices.',
        answer_zh: '是的！我们所有的草药成分都是100%有机的，并经过无麸质认证。我们从遵循可持续和道德规范的可信农场采购原料。',
    },
    {
        question_en: 'How do I use the subscription service? Can I cancel anytime?',
        question_zh: '订阅服务如何使用？可以随时取消吗？',
        answer_en: 'Simply choose your preferred products and frequency during checkout. You\'ll save 15% on every order, and you can pause, skip, or cancel your subscription anytime through your account dashboard. No commitments, full flexibility.',
        answer_zh: '只需在结账时选择您喜欢的产品和配送频率。每次订单可节省15%，您可以随时通过账户仪表板暂停、跳过或取消订阅。没有承诺，完全灵活。',
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border-b border-stone-200 last:border-none"
        >
            <button
                onClick={onToggle}
                className="w-full py-5 flex items-center justify-between text-left hover:text-emerald-600 transition-colors"
            >
                <span className="text-base md:text-lg font-medium text-stone-800 pr-4">
                    {language === 'cn' ? faq.question_zh : faq.question_en}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                >
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-emerald-600' : 'text-stone-400'}`} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-stone-600 leading-relaxed">
                            {language === 'cn' ? faq.answer_zh : faq.answer_en}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function FAQSection() {
    const { language } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 md:py-32 bg-stone-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <HelpCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
                        {language === 'cn' ? '常见问题' : 'Frequently Asked Questions'}
                    </h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        {language === 'cn'
                            ? '找到关于我们产品和服务的常见问题答案'
                            : 'Find answers to common questions about our products and services'}
                    </p>
                </motion.div>

                {/* FAQ List */}
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg shadow-stone-200/50 p-6 md:p-8">
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
                    className="text-center mt-12"
                >
                    <p className="text-stone-600">
                        {language === 'cn' ? '还有其他问题？' : 'Still have questions?'}{' '}
                        <a href="mailto:support@nourishselect.com" className="text-emerald-600 font-medium hover:underline">
                            {language === 'cn' ? '联系我们' : 'Contact us'}
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

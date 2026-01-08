'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { FAQSection } from '@/components/home/FAQSection';
import { OrganicBlobs } from '@/components/ui/FloatingParticles';
import { Mail, Phone, MapPin, Send, Leaf, Sparkles } from 'lucide-react';

export default function ContactPage() {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
            {/* Contact Form Section */}
            <div className="py-20 px-4 relative overflow-hidden">
                {/* Organic background */}
                <OrganicBlobs className="opacity-30" />

                {/* Floating decorative elements */}
                <div className="absolute top-20 left-10 animate-float z-10">
                    <Leaf className="w-8 h-8 text-emerald-500/20" />
                </div>
                <div className="absolute bottom-40 right-10 animate-float z-10" style={{ animationDelay: '2s' }}>
                    <Sparkles className="w-6 h-6 text-amber-400/20" />
                </div>

                <div className="container mx-auto max-w-2xl relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-full bg-emerald-50"
                        >
                            <Mail className="w-4 h-4" />
                            {language === 'cn' ? '联系我们' : 'Get In Touch'}
                        </motion.div>
                        <h1 className="text-4xl font-serif font-bold mb-4 text-stone-900">{t('contact.title')}</h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-amber-400 mx-auto rounded-full mb-6" />
                        <p className="text-muted-foreground">
                            {t('contact.desc')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-100 shadow-xl shadow-stone-200/30"
                    >
                        <div className="space-y-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-stone-700">{t('contact.name_label')}</Label>
                                <Input
                                    id="name"
                                    placeholder={t('contact.name_placeholder')}
                                    className="bg-white/50 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-stone-700">{t('contact.email_label')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t('contact.email_placeholder')}
                                    className="bg-white/50 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="message" className="text-stone-700">{t('contact.message_label')}</Label>
                                <Textarea
                                    id="message"
                                    placeholder={t('contact.message_placeholder')}
                                    className="bg-white/50 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all min-h-[120px]"
                                />
                            </div>
                            <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 group">
                                {t('contact.send_btn')}
                                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        <div className="mt-10 pt-8 border-t border-stone-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="p-4 rounded-xl bg-stone-50/50 hover:bg-emerald-50/50 transition-colors">
                                    <Mail className="w-5 h-5 mx-auto mb-2 text-emerald-600" />
                                    <p className="text-sm text-stone-600">support@nourishselect.co</p>
                                </div>
                                <div className="p-4 rounded-xl bg-stone-50/50 hover:bg-emerald-50/50 transition-colors">
                                    <Phone className="w-5 h-5 mx-auto mb-2 text-emerald-600" />
                                    <p className="text-sm text-stone-600">+1 (555) 000-0000</p>
                                </div>
                                <div className="p-4 rounded-xl bg-stone-50/50 hover:bg-emerald-50/50 transition-colors">
                                    <MapPin className="w-5 h-5 mx-auto mb-2 text-emerald-600" />
                                    <p className="text-sm text-stone-600">San Francisco, CA</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* FAQ Section */}
            <FAQSection />
        </div>
    );
}

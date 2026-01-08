'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { FAQSection } from '@/components/home/FAQSection';
import { Mail, Phone, MapPin, Send, Zap, MessageSquare } from 'lucide-react';

export default function ContactPage() {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen bg-stone-100 font-mono">
            {/* Contact Form Section */}
            <div className="py-24 px-4 relative overflow-hidden bg-black text-white">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:30px_30px] opacity-100 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

                <div className="container mx-auto max-w-4xl relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border-2 border-primary bg-black text-primary font-black uppercase tracking-widest shadow-stark transform -rotate-2">
                            <MessageSquare className="w-4 h-4" />
                            {language === 'cn' ? '联系我们' : 'HOTLINE BLING'}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 text-white">
                            {t('contact.title') || 'TALK TO US'}
                        </h1>
                        <p className="text-stone-400 text-xl font-bold max-w-lg mx-auto uppercase">
                            {t('contact.desc')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col lg:flex-row shadow-[12px_12px_0px_#000] border-4 border-black"
                    >
                        {/* Info Side (Left) */}
                        <div className="w-full lg:w-1/3 bg-primary p-8 flex flex-col justify-between text-black relative overflow-hidden">
                            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

                            <div className="relative z-10 space-y-8">
                                <div>
                                    <h3 className="text-2xl font-black uppercase mb-1 flex items-center gap-2">
                                        <Mail className="w-6 h-6 border-2 border-black p-0.5 rounded-full" /> Email
                                    </h3>
                                    <p className="font-bold underline">support@nourishselect.co</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase mb-1 flex items-center gap-2">
                                        <Phone className="w-6 h-6 border-2 border-black p-0.5 rounded-full" /> Phone
                                    </h3>
                                    <p className="font-bold">+1 (555) 666-PUNK</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase mb-1 flex items-center gap-2">
                                        <MapPin className="w-6 h-6 border-2 border-black p-0.5 rounded-full" /> HQ
                                    </h3>
                                    <p className="font-bold">Underground Bunker<br />San Francisco, CA</p>
                                </div>
                            </div>

                            <div className="mt-12 relative z-10">
                                <span className="text-9xl font-black opacity-10 absolute bottom-0 right-0 -mr-8 -mb-8 rotate-12">?</span>
                            </div>
                        </div>

                        {/* Form Side (Right) */}
                        <div className="w-full lg:w-2/3 bg-white p-8 lg:p-12 relative">
                            <div className="absolute top-4 right-4 animate-pulse">
                                <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                            </div>

                            <div className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-black font-black uppercase tracking-wide">{t('contact.name_label')}</Label>
                                    <Input
                                        id="name"
                                        placeholder={t('contact.name_placeholder')}
                                        className="bg-stone-100 border-2 border-black rounded-none h-12 focus:ring-0 focus:border-primary focus:bg-white transition-all font-bold placeholder:text-stone-400"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-black font-black uppercase tracking-wide">{t('contact.email_label')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t('contact.email_placeholder')}
                                        className="bg-stone-100 border-2 border-black rounded-none h-12 focus:ring-0 focus:border-primary focus:bg-white transition-all font-bold placeholder:text-stone-400"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="message" className="text-black font-black uppercase tracking-wide">{t('contact.message_label')}</Label>
                                    <Textarea
                                        id="message"
                                        placeholder={t('contact.message_placeholder')}
                                        className="bg-stone-100 border-2 border-black rounded-none min-h-[150px] focus:ring-0 focus:border-primary focus:bg-white transition-all font-bold placeholder:text-stone-400 resize-none"
                                    />
                                </div>
                                <Button className="w-full h-14 rounded-none bg-black text-white text-lg font-black uppercase tracking-widest hover:bg-primary hover:text-black border-2 border-transparent hover:border-black shadow-stark hover:shadow-stark-hover transition-all group">
                                    {t('contact.send_btn')}
                                    <Send className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
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

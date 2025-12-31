'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { FAQSection } from '@/components/home/FAQSection';

export default function ContactPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background">
            {/* Contact Form Section */}
            <div className="py-20 px-4">
                <div className="container mx-auto max-w-2xl">
                    <h1 className="text-4xl font-serif font-bold mb-8 text-center">{t('contact.title')}</h1>
                    <p className="text-center text-muted-foreground mb-12">
                        {t('contact.desc')}
                    </p>

                    <div className="grid gap-8 p-8 border rounded-xl bg-card shadow-sm">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('contact.name_label')}</Label>
                                <Input id="name" placeholder={t('contact.name_placeholder')} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('contact.email_label')}</Label>
                                <Input id="email" type="email" placeholder={t('contact.email_placeholder')} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="message">{t('contact.message_label')}</Label>
                                <Textarea id="message" placeholder={t('contact.message_placeholder')} />
                            </div>
                            <Button className="w-full">{t('contact.send_btn')}</Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground mt-8 pt-8 border-t">
                            <p>Email: hello@nourishselect.com</p>
                            <p>Phone: +1 (555) 000-0000</p>
                            <p className="mt-2">{t('contact.address_label')}: 123 Harmony Way, Kyoto, Japan</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <FAQSection />
        </div>
    );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/language-context';

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-secondary/20 backdrop-blur-sm mt-auto border-t border-border/50">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo-icon.png"
                                alt="Nourish Select"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-semibold tracking-tight">
                                Nourish<span className="text-primary font-normal">Select</span>
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t('footer.desc')}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">{t('footer.shop')}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/shop/drinks" className="hover:text-primary transition-colors">{t('nav.drinks')}</Link></li>
                            <li><Link href="/shop/foot-masks" className="hover:text-primary transition-colors">{t('nav.masks')}</Link></li>
                            <li><Link href="/analysis" className="hover:text-primary transition-colors">{t('nav.analysis')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">{t('footer.company')}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">{t('footer.our_story')}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t('footer.contact_us')}</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">{t('footer.newsletter')}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {t('footer.subscribe_desc')}
                        </p>
                        {/* Placeholder for newsletter form */}
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder={t('footer.email_placeholder')}
                                className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            <button className="h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors">
                                {t('footer.join')}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} {t('footer.rights')}
                </div>
            </div>
        </footer>
    );
}

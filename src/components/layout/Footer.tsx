'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/language-context';

export function Footer() {
    const { t } = useLanguage();

    return (
    return (
        <footer className="bg-black text-white border-t-2 border-stone-800">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-none flex items-center justify-center transform rotate-3">
                                <span className="font-black text-black">N</span>
                            </div>
                            <span className="text-2xl font-black uppercase tracking-tighter">
                                Nourish<span className="text-primary">Select</span>
                            </span>
                        </div>
                        <p className="text-sm text-stone-400 leading-relaxed font-mono">
                            {t('footer.desc')}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-black text-lg uppercase mb-6 text-white tracking-wide border-b-2 border-primary inline-block pb-1">{t('footer.shop')}</h3>
                        <ul className="space-y-3 text-sm text-stone-400 font-medium">
                            <li><Link href="/shop/drinks" className="hover:text-primary hover:translate-x-1 transition-all inline-block uppercase tracking-wider">{t('nav.drinks')}</Link></li>
                            <li><Link href="/analysis" className="hover:text-primary hover:translate-x-1 transition-all inline-block uppercase tracking-wider">{t('nav.analysis')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-lg uppercase mb-6 text-white tracking-wide border-b-2 border-primary inline-block pb-1">{t('footer.company')}</h3>
                        <ul className="space-y-3 text-sm text-stone-400 font-medium">
                            <li><Link href="/about" className="hover:text-primary hover:translate-x-1 transition-all inline-block uppercase tracking-wider">{t('footer.our_story')}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary hover:translate-x-1 transition-all inline-block uppercase tracking-wider">{t('footer.contact_us')}</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary hover:translate-x-1 transition-all inline-block uppercase tracking-wider">{t('footer.privacy')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-lg uppercase mb-6 text-white tracking-wide border-b-2 border-primary inline-block pb-1">{t('footer.newsletter')}</h3>
                        <p className="text-sm text-stone-400 mb-4 font-mono">
                            {t('footer.subscribe_desc')}
                        </p>
                        {/* Wrapper for newsletter form */}
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder={t('footer.email_placeholder')}
                                className="flex-1 h-10 rounded-none border-2 border-stone-700 bg-stone-900 px-3 py-1 text-sm shadow-none transition-colors focus-visible:outline-none focus-visible:border-primary text-white placeholder:text-stone-600 font-mono"
                            />
                            <button className="h-10 px-6 py-2 bg-primary text-black hover:bg-white hover:text-black rounded-none text-sm font-black uppercase transition-all shadow-[4px_4px_0px_#fff] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                                {t('footer.join')}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-stone-800 text-center text-xs text-stone-600 font-mono uppercase tracking-widest">
                    © {new Date().getFullYear()} {t('footer.rights')} // MADE WITH CHAOS & CODE
                </div>
            </div>
        </footer>
    );
    );
}

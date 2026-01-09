'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';
// Image import removed
import { useLanguage } from '@/context/language-context';

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-black text-white border-t-2 border-stone-800">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-0">
                            <Link href="/" className="flex items-center gap-0">
                                <span className="font-black text-2xl italic tracking-tight text-[#FF10F0] drop-shadow-[0_0_10px_#FF10F0]">Nourish</span>
                                <span className="font-black text-2xl tracking-tighter text-[#39FF14] drop-shadow-[0_0_10px_#39FF14] ml-1">SELECT</span>
                            </Link>
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
                        {/* Newsletter Form */}
                        <NewsletterForm t={t} />
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-stone-800 text-center text-xs text-stone-600 font-mono uppercase tracking-widest">
                    © {new Date().getFullYear()} {t('footer.rights')} // MADE WITH CHAOS & CODE
                </div>
            </div>
        </footer>
    );

}

function NewsletterForm({ t }: { t: any }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStatus('success');
            setEmail('');
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    if (status === 'success') {
        return (
            <div className="p-4 bg-primary/10 border-l-4 border-primary text-primary font-mono text-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 mb-1 font-black uppercase">
                    <Check className="w-4 h-4" /> You're In.
                </div>
                <p>Welcome to the resistance.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-2 text-xs underline hover:text-white"
                >
                    Add another agent
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 relative">
            <div className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.email_placeholder')}
                    disabled={status === 'loading'}
                    className="flex-1 h-10 rounded-none border-2 border-stone-700 bg-stone-900 px-3 py-1 text-sm shadow-none transition-colors focus-visible:outline-none focus-visible:border-primary text-white placeholder:text-stone-600 font-mono disabled:opacity-50"
                />
                <button
                    disabled={status === 'loading'}
                    className="h-10 px-6 py-2 bg-primary text-black hover:bg-white hover:text-black rounded-none text-sm font-black uppercase transition-all shadow-[4px_4px_0px_#fff] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                >
                    {status === 'loading' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        t('footer.join')
                    )}
                </button>
            </div>
            {status === 'error' && (
                <div className="absolute top-full left-0 mt-2 text-red-500 text-xs font-mono flex items-center gap-1 bg-black px-2 py-1 border border-red-500">
                    <AlertCircle className="w-3 h-3" />
                    {errorMessage}
                </div>
            )}
        </form>
    );
}

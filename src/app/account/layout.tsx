'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, MapPin, Package, Settings, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/context/language-context';

const sidebarItems = [
    { href: '/account', icon: User, labelKey: 'account.profile', rotate: 'rotate-1' },
    { href: '/account/addresses', icon: MapPin, labelKey: 'account.addresses', rotate: '-rotate-1' },
    { href: '/account/orders', icon: Package, labelKey: 'account.orders', rotate: 'rotate-2' },
];

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
            setLoading(false);
        };
        checkUser();
    }, [supabase, router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-100 py-12 md:py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-black mb-2 flex items-center gap-4">
                        COMMAND CENTER <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    </h1>
                    <div className="inline-block bg-black text-white px-4 py-1 font-mono text-xs uppercase transform -rotate-1 shadow-stark">
                        Logged in as: {user?.user_metadata?.first_name || user?.email}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar - Sticker Style */}
                    <aside className="w-full md:w-64 shrink-0 space-y-4">
                        <nav className="flex flex-col gap-4">
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'group relative flex items-center gap-3 px-6 py-4 border-2 border-black shadow-stark transition-all duration-300',
                                        item.rotate,
                                        pathname === item.href
                                            ? 'bg-black text-white scale-105 z-10'
                                            : 'bg-white text-black hover:bg-primary hover:text-black hover:scale-105 hover:-rotate-1 hocus:z-10'
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-primary" : "text-black")} />
                                    <span className="font-bold uppercase tracking-tight">{t(item.labelKey)}</span>
                                </Link>
                            ))}
                            <button
                                onClick={handleSignOut}
                                className="group relative flex items-center gap-3 px-6 py-4 border-2 border-black bg-stone-200 text-stone-600 shadow-stark transition-all duration-300 hover:bg-red-600 hover:text-white hover:rotate-2 mt-8"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-bold uppercase tracking-tight">{t('auth.sign_out')}</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content - Brutalist Card */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white border-2 border-black shadow-stark p-6 md:p-8 min-h-[500px] relative">
                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 w-4 h-4 bg-black" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 bg-black" />
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

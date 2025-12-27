'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, MapPin, Package, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/context/language-context';

const sidebarItems = [
    { href: '/account', icon: User, labelKey: 'account.profile' },
    { href: '/account/addresses', icon: MapPin, labelKey: 'account.addresses' },
    { href: '/account/orders', icon: Package, labelKey: 'account.orders' },
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 sticky top-24">
                            <div className="mb-6 pb-4 border-b border-stone-100">
                                <p className="text-sm text-stone-500">{t('account.welcome')}</p>
                                <p className="font-semibold text-stone-800 truncate">
                                    {user?.user_metadata?.first_name || user?.email}
                                </p>
                            </div>
                            <nav className="space-y-1">
                                {sidebarItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                            pathname === item.href
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-stone-600 hover:bg-stone-100'
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {t(item.labelKey)}
                                    </Link>
                                ))}
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {t('auth.sign_out')}
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

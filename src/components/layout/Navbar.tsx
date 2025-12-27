'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ShoppingBag, Leaf, User, Globe } from 'lucide-react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { CartSheet } from '@/components/cart/CartSheet';
import { useLanguage } from '@/context/language-context';

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [user, setUser] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const supabase = createClient();
    const { language, setLanguage, t } = useLanguage();

    const navItems = [
        { name: t('nav.analysis'), href: '/analysis' },
        { name: t('nav.drinks'), href: '/shop/drinks' },
        { name: t('nav.masks'), href: '/shop/foot-masks' },
        { name: t('nav.about'), href: '/about' },
        { name: t('nav.contact'), href: '/contact' },
    ];

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'cn' : 'en');
    };

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        // Check session immediately on mount
        const checkSession = async () => {
            setIsLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
            // Force router refresh when auth state changes
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                router.refresh();
            }
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            subscription.unsubscribe();
        };
    }, [supabase, router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <header
            className={cn(
                'fixed top-0 z-50 w-full transition-all duration-300',
                isScrolled
                    ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm'
                    : 'bg-transparent'
            )}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-primary" />
                    <span className="text-xl font-semibold tracking-tight text-foreground">
                        Nourish<span className="text-primary font-normal">Select</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-primary',
                                pathname === item.href
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions (Language / Cart / Auth / Mobile Menu) */}
                <div className="flex items-center gap-1 md:gap-2">

                    {/* Language Switcher - Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full w-10 h-10 hover:bg-stone-100/80 transition-colors"
                            >
                                <Globe className="h-5 w-5 text-stone-600" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[140px]">
                            <DropdownMenuItem
                                onClick={() => setLanguage('en')}
                                className={cn("cursor-pointer", language === 'en' && "font-semibold bg-stone-100")}
                            >
                                🇺🇸 English
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setLanguage('cn')}
                                className={cn("cursor-pointer", language === 'cn' && "font-semibold bg-stone-100")}
                            >
                                🇨🇳 中文
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <CartSheet />

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-stone-100/80 transition-colors overflow-hidden">
                                    {user.user_metadata?.avatar_url ? (
                                        <img
                                            src={user.user_metadata.avatar_url}
                                            alt="Avatar"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center rounded-full">
                                            <span className="text-sm font-semibold text-primary">
                                                {user.user_metadata?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem disabled className="font-semibold">
                                    {user.user_metadata?.first_name
                                        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
                                        : t('auth.my_account')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/account')}>
                                    {t('auth.my_account')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/account/orders')}>
                                    {t('account.orders')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                                    {t('auth.sign_out')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="ghost" size="icon" asChild className="hidden md:flex rounded-full w-10 h-10 hover:bg-stone-100/80 transition-colors">
                            <Link href="/login">
                                <User className="w-5 h-5 text-stone-600" />
                            </Link>
                        </Button>
                    )}

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="w-5 h-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-background/95 backdrop-blur-xl">
                            <div className="flex flex-col gap-2 mb-8">
                                <p className="text-xs text-muted-foreground mb-1">Language</p>
                                <div className="flex gap-2">
                                    <Button
                                        variant={language === 'en' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setLanguage('en')}
                                        className="flex-1"
                                    >
                                        🇺🇸 English
                                    </Button>
                                    <Button
                                        variant={language === 'cn' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setLanguage('cn')}
                                        className="flex-1"
                                    >
                                        🇨🇳 中文
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {!user && (
                                    <Link
                                        href="/login"
                                        className="text-lg font-medium text-primary transition-colors"
                                    >
                                        {t('auth.sign_in')}
                                    </Link>
                                )}
                                {user && (
                                    <button onClick={handleSignOut} className="text-lg font-medium text-destructive text-left">
                                        {t('auth.sign_out')}
                                    </button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

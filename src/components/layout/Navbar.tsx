'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, User, Globe, Sparkles, Wine, Footprints, Info, MessageCircle, LogIn, UserCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { CartSheet } from '@/components/cart/CartSheet';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { user, isLoading, signOut } = useAuth();

    // Navigation items with icons for mobile
    const navItems = [
        { name: t('nav.analysis'), href: '/analysis', icon: Sparkles },
        { name: t('nav.drinks'), href: '/shop/drinks', icon: Wine },
        // { name: t('nav.masks'), href: '/shop/foot-masks', icon: Footprints }, // Hidden for now - launching later
        { name: t('nav.about'), href: '/about', icon: Info },
        { name: t('nav.contact'), href: '/contact', icon: MessageCircle },
    ];

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        setIsSheetOpen(false);
        await signOut();
    };

    const handleNavClick = () => {
        setIsSheetOpen(false);
    };

    return (
        <header
            className={cn(
                'fixed top-0 z-50 w-full transition-all duration-300',
                isScrolled
                    ? 'bg-white/90 backdrop-blur-xl border-b border-stone-200 shadow-sm'
                    : 'bg-white/70 backdrop-blur-md'
            )}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Left side: Mobile Menu + Logo */}
                <div className="flex items-center gap-2">
                    {/* Mobile Menu Trigger - LEFT of logo on mobile */}
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                                <Menu className="w-5 h-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-background/98 backdrop-blur-xl w-[300px] p-0">
                            {/* Header with logo */}
                            <div className="p-6 border-b border-border/50">
                                <Link href="/" onClick={handleNavClick} className="flex items-center gap-0">
                                    <span className="font-black text-xl italic tracking-tight text-[#FF10F0] drop-shadow-[0_0_10px_#FF10F0]">Nourish</span>
                                    <span className="font-black text-xl tracking-tighter text-[#39FF14] drop-shadow-[0_0_10px_#39FF14] ml-1">SELECT</span>
                                </Link>
                            </div>

                            {/* Navigation Links - Modern Button Style */}
                            <div className="p-4 flex flex-col gap-2">
                                {navItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={handleNavClick}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200",
                                                    "hover:bg-primary/10 hover:translate-x-1",
                                                    isActive
                                                        ? "bg-primary/15 text-primary font-semibold shadow-sm"
                                                        : "text-foreground/80"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                                    isActive
                                                        ? "bg-primary text-white"
                                                        : "bg-stone-100 text-stone-500"
                                                )}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-base">{item.name}</span>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-border mx-6" />

                            {/* Language Toggle for Mobile */}
                            <div className="p-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setLanguage('en'); handleNavClick(); }}
                                        className={cn(
                                            "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                                            language === 'en'
                                                ? "bg-primary text-white"
                                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                        )}
                                    >
                                        🇺🇸 EN
                                    </button>
                                    <button
                                        onClick={() => { setLanguage('cn'); handleNavClick(); }}
                                        className={cn(
                                            "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                                            language === 'cn'
                                                ? "bg-primary text-white"
                                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                        )}
                                    >
                                        🇨🇳 中文
                                    </button>
                                    <button
                                        onClick={() => { setLanguage('jp'); handleNavClick(); }}
                                        className={cn(
                                            "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                                            language === 'jp'
                                                ? "bg-primary text-white"
                                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                        )}
                                    >
                                        🇯🇵 日本語
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-border mx-6" />

                            {/* Auth Section */}
                            <div className="p-4 flex flex-col gap-2">
                                {!user ? (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 }}
                                    >
                                        <Link
                                            href="/login"
                                            onClick={handleNavClick}
                                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                                <LogIn className="w-5 h-5" />
                                            </div>
                                            <span className="text-base font-medium">{t('auth.sign_in')}</span>
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.25 }}
                                        >
                                            <Link
                                                href="/account"
                                                onClick={handleNavClick}
                                                className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-stone-100 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden">
                                                    {user.user_metadata?.avatar_url ? (
                                                        <img
                                                            src={user.user_metadata.avatar_url}
                                                            alt="Avatar"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <UserCircle className="w-5 h-5 text-stone-500" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-medium text-foreground">
                                                        {user.user_metadata?.first_name || t('auth.my_account')}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">{t('auth.my_account')}</span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <button
                                                onClick={handleSignOut}
                                                className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-red-50 transition-all w-full text-left"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                                    <LogOut className="w-5 h-5 text-red-500" />
                                                </div>
                                                <span className="text-base font-medium text-red-600">{t('auth.sign_out')}</span>
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Logo - Desktop */}
                    <Link href="/" className="flex items-center gap-0">
                        <span className="font-black text-2xl italic tracking-tight text-[#FF10F0] drop-shadow-[0_0_10px_#FF10F0]">Nourish</span>
                        <span className="font-black text-2xl tracking-tighter text-[#39FF14] drop-shadow-[0_0_10px_#39FF14] ml-1">SELECT</span>
                    </Link>
                </div>

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

                {/* Actions (Language / Cart / Auth) */}
                <div className="flex items-center gap-1 md:gap-2">

                    {/* Language Switcher - Show on both mobile and desktop */}
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
                            <DropdownMenuItem
                                onClick={() => setLanguage('jp')}
                                className={cn("cursor-pointer", language === 'jp' && "font-semibold bg-stone-100")}
                            >
                                🇯🇵 日本語
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <CartSheet />

                    {/* User Avatar / Login - with smooth transition */}
                    <AnimatePresence mode="wait">
                        {user ? (
                            <motion.div
                                key="user-avatar"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
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
                            </motion.div>
                        ) : (
                            <motion.div
                                key="user-icon"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Button variant="ghost" size="icon" asChild className="hidden md:flex rounded-full w-10 h-10 hover:bg-stone-100/80 transition-colors">
                                    <Link href="/login">
                                        <User className="w-5 h-5 text-stone-600" />
                                    </Link>
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}

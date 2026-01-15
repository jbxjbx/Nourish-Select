'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, X, ArrowRight, UserCircle, Zap } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useLanguage } from '@/context/language-context';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

export function CartSheet() {
    const { items, removeItem, updateQuantity, cartTotal, cartCount, isOpen, setIsOpen } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const { t } = useLanguage();
    const supabase = createClient();
    const router = useRouter();

    const handleCheckout = async () => {
        setIsLoading(true);
        // Check for active session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            setIsLoading(false);
            setShowAuthDialog(true);
            return;
        }

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items, userId: session.user.id }),
            });

            const { url, error } = await response.json();
            if (url) {
                window.location.href = url;
            } else {
                console.error('Checkout error:', error);
                alert(`Checkout Failed: ${error || 'Unknown error. Please try again.'}`);
            }
        } catch (error) {
            console.error('Checkout error details:', error);
            alert('Connection failed. Please check your internet or try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        setIsOpen(false);
        setShowAuthDialog(false);
        router.push('/login');
    };

    const handleRegisterRedirect = () => {
        setIsOpen(false);
        setShowAuthDialog(false);
        router.push('/login?tab=register');
    };

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative hover:bg-black hover:text-white transition-all rounded-full w-10 h-10 border-2 border-transparent hover:border-black">
                        <ShoppingBag className="h-5 w-5" />
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    key="cart-count"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-sm bg-primary text-[10px] font-black text-black border border-black shadow-stark-sm"
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Button>
                </SheetTrigger>
                <SheetContent className="flex w-full flex-col sm:max-w-md bg-white border-l-4 border-black p-0 shadow-2xl">
                    {/* Header - Receipt Style */}
                    <div className="bg-black text-white p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
                        <SheetTitle className="text-4xl font-black uppercase italic tracking-tighter relative z-10 flex items-center gap-2">
                            {t('cart.title')} <Zap className="w-6 h-6 text-primary fill-primary animate-pulse" />
                        </SheetTitle>
                        <p className="font-mono text-xs text-stone-400 mt-1 uppercase relative z-10">
                            Transaction ID: #{Math.floor(Math.random() * 999999).toString().padStart(6, '0')}
                        </p>
                    </div>

                    {/* Dashed Sentinel */}
                    <div className="w-full h-4 bg-white relative">
                        <div className="absolute top-0 left-0 w-full border-b-2 border-dashed border-black h-0" />
                    </div>

                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 h-full space-y-6 bg-stone-50 p-8">
                            <motion.div
                                initial={{ opacity: 0, rotate: -10 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                className="w-32 h-32 flex items-center justify-center opacity-20"
                            >
                                <ShoppingBag className="w-24 h-24 text-black" />
                            </motion.div>
                            <h3 className="text-2xl font-black uppercase text-black">{t('cart.empty_title')}</h3>
                            <p className="text-stone-500 font-mono text-center max-w-xs">
                                {t('cart.empty_desc')}
                            </p>
                            <SheetClose asChild>
                                <Button className="rounded-full px-8 py-6 text-lg font-black uppercase bg-black text-white border-2 border-transparent hover:bg-primary hover:text-black hover:border-black transition-all shadow-stark hover:shadow-stark-hover">
                                    {t('cart.fill_it')}
                                </Button>
                            </SheetClose>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto px-6 space-y-6 py-4 bg-stone-50">
                                <AnimatePresence initial={false}>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 50 }}
                                            className="flex gap-4 overflow-hidden bg-white p-3 border-2 border-black shadow-stark group relative"
                                        >
                                            <div className="relative h-20 w-20 flex-shrink-0 bg-stone-200 border border-black">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start text-base text-black">
                                                        <h3 className="line-clamp-2 font-black uppercase leading-tight tracking-tight">{item.name}</h3>
                                                        <p className="ml-4 font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase bg-black text-white">{item.category}</span>
                                                        {item.isSubscription && (
                                                            <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase bg-primary text-black border border-black animate-pulse">
                                                                {t('cart.subscribed')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-2 border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-6 h-6 flex items-center justify-center hover:bg-stone-100 disabled:opacity-30 border-r border-black"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-6 text-center text-sm font-bold font-mono">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-6 h-6 flex items-center justify-center hover:bg-stone-100 border-l border-black"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-stone-400 hover:text-red-600 transition-colors p-1 hover:rotate-12 transform"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="border-t-2 border-black p-6 space-y-4 bg-white relative">
                                {/* Decor */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                    <span className="font-mono text-xs uppercase bg-black text-white px-1">{t('cart.total')}</span>
                                </div>

                                <div className="space-y-2 font-mono text-sm">
                                    <div className="flex justify-between text-stone-600">
                                        <p>{t('cart.subtotal')}</p>
                                        <p className="font-bold text-black">${cartTotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between text-xl font-black text-black border-t-2 border-dashed border-black pt-2">
                                        <p className="uppercase">{t('cart.due_amount')}</p>
                                        <p>${cartTotal.toFixed(2)}</p>
                                    </div>
                                </div>
                                <p className="text-[10px] font-mono text-center text-stone-500 uppercase">
                                    {t('cart.note')}
                                </p>
                                <Button
                                    className="w-full rounded-none h-14 text-xl font-black uppercase bg-black text-white border-2 border-transparent hover:bg-primary hover:text-black hover:border-black shadow-stark hover:shadow-stark-hover transition-all skew-x-[-2deg] hover:skew-x-0"
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="animate-pulse">{t('cart.processing')}</span>
                                    ) : (
                                        <>
                                            {t('cart.checkout')} <ArrowRight className="ml-2 w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Auth Dialog - Punk Style */}
            <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogContent className="sm:max-w-md border-4 border-black shadow-[8px_8px_0px_#000] p-0 overflow-hidden bg-white gap-0">
                    <DialogHeader className="p-6 bg-black text-white">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-black uppercase italic">
                            <UserCircle className="w-8 h-8 text-primary" />
                            {t('cart.identity_check')}
                        </DialogTitle>
                        <DialogDescription className="text-stone-400 font-mono text-xs uppercase">
                            {t('cart.identity_desc')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <p className="text-lg font-bold text-black text-center leading-tight">
                            {t('cart.identity_question')}
                        </p>
                        <DialogFooter className="flex flex-col sm:flex-row gap-3">
                            <Button variant="outline" onClick={handleLoginRedirect} className="w-full h-12 text-lg font-bold uppercase border-2 border-black shadow-stark hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                                {t('auth.login_btn')}
                            </Button>
                            <Button onClick={handleRegisterRedirect} className="w-full h-12 text-lg font-bold uppercase bg-primary text-black border-2 border-black shadow-stark hover:bg-primary/80 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                                {t('auth.register_btn')}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

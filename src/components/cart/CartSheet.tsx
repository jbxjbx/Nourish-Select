'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, X, ArrowRight, UserCircle } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
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
                body: JSON.stringify({ items }),
            });

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            } else {
                console.error('No checkout URL received');
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        setIsOpen(false); // Close cart
        setShowAuthDialog(false);
        router.push('/login');
    };

    const handleRegisterRedirect = () => {
        setIsOpen(false); // Close cart
        setShowAuthDialog(false);
        router.push('/login?tab=register'); // Assuming login page supports tab param
    };

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative hover:bg-stone-100/80 transition-colors rounded-full w-10 h-10">
                        <ShoppingBag className="h-5 w-5 text-stone-600" />
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    key="cart-count"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                    className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-semibold text-white shadow-md"
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Button>
                </SheetTrigger>
                <SheetContent className="flex w-full flex-col sm:max-w-md bg-stone-50 border-l border-stone-200 px-8">
                    <SheetHeader className="px-1 text-left mt-4">
                        <SheetTitle className="text-3xl font-serif text-stone-900 flex items-baseline gap-2">
                            {t('nav.shop') || 'Your Cart'}
                            <span className="text-lg font-sans text-stone-400 font-normal">({cartCount})</span>
                        </SheetTitle>
                    </SheetHeader>
                    <Separator className="my-6 bg-stone-200" />

                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 h-full space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center text-stone-300"
                            >
                                <ShoppingBag className="w-10 h-10" />
                            </motion.div>
                            <p className="text-stone-500 text-lg font-light">Your cart is currently empty.</p>
                            <SheetClose asChild>
                                <Button variant="outline" className="rounded-full px-8 border-stone-300 text-stone-600 hover:bg-stone-100 h-10">
                                    Start Shopping
                                </Button>
                            </SheetClose>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6 py-2">
                                <AnimatePresence initial={false}>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            transition={{ opacity: { duration: 0.2 } }}
                                            className="flex gap-4 overflow-hidden"
                                        >
                                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-stone-100 shadow-sm">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start text-base text-stone-900">
                                                        <h3 className="line-clamp-2 font-serif font-medium leading-tight">{item.name}</h3>
                                                        <p className="ml-4 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-xs text-stone-500 capitalize tracking-wide">{item.category}</p>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-3 border border-stone-200 rounded-full px-1 py-1 bg-white shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors disabled:opacity-30 text-stone-600"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="w-4 text-center text-sm font-medium text-stone-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors text-stone-600"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-stone-400 hover:text-red-500 transition-colors p-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="border-t border-stone-200 pt-6 mt-4 space-y-4 bg-stone-50">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-base text-stone-600">
                                        <p>Subtotal</p>
                                        <p>${cartTotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between text-lg font-serif font-bold text-stone-900">
                                        <p>Total</p>
                                        <p>${cartTotal.toFixed(2)}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-stone-400 text-center">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <Button
                                    className="w-full rounded-full h-14 text-lg font-medium bg-emerald-800 hover:bg-emerald-900 shadow-lg shadow-emerald-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            Checkout <ArrowRight className="ml-2 w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Auth Requirement Dialog */}
            <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserCircle className="w-6 h-6 text-stone-600" />
                            {t('auth.checkout_login_title')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('auth.checkout_login_desc')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button variant="outline" onClick={handleLoginRedirect} className="w-full sm:w-auto">
                            {t('auth.login_btn')}
                        </Button>
                        <Button onClick={handleRegisterRedirect} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
                            {t('auth.register_btn')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';

export default function SuccessPage() {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full text-center space-y-6"
            >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                <h1 className="text-4xl font-serif font-bold text-stone-800">Payment Successful</h1>
                <p className="text-stone-600 text-lg">
                    Thank you for your purchase. Your order is being processed and will be shipped soon.
                </p>

                <div className="pt-8">
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/">
                            Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

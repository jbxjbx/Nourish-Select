import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

// Create Supabase client for server-side usage
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    category?: string;
    isSubscription?: boolean;
}

// Helper to get full image URL
function getFullImageUrl(imageUrl: string | undefined, origin: string): string[] | undefined {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith('http')) return [imageUrl];
    // Convert relative path to absolute URL
    return [`${origin}${imageUrl}`];
}

export async function POST(req: Request) {
    try {
        const { items, userId } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in checkout' }, { status: 400 });
        }

        // Separate subscription items from one-time purchase items
        const subscriptionItems = items.filter((item: CartItem) => item.isSubscription);
        const oneTimeItems = items.filter((item: CartItem) => !item.isSubscription);

        const origin = req.headers.get('origin') || 'https://nourishselect.co';

        console.log('Checkout request:', {
            subscriptionCount: subscriptionItems.length,
            oneTimeCount: oneTimeItems.length,
            origin
        });

        // If we have subscription items, create a subscription checkout
        if (subscriptionItems.length > 0) {
            const lineItems = subscriptionItems.map((item: CartItem) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name.replace(' (Subscribe)', '').replace(' (订阅)', '').replace(' (定期)', ''),
                        description: 'Monthly subscription - Cancel anytime',
                        images: getFullImageUrl(item.imageUrl, origin),
                    },
                    unit_amount: Math.round(item.price * 100),
                    recurring: {
                        interval: 'month' as const,
                        interval_count: 1,
                    },
                },
                quantity: item.quantity,
            }));

            console.log('Creating subscription session with items:', JSON.stringify(lineItems, null, 2));

            const sessionConfig: Stripe.Checkout.SessionCreateParams = {
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'subscription',
                success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
                cancel_url: `${origin}/?canceled=true`,
                billing_address_collection: 'required',
                metadata: {
                    user_id: userId || '',
                    type: 'subscription',
                    items: JSON.stringify(subscriptionItems.map((i: CartItem) => ({
                        id: i.id,
                        name: i.name,
                        price: i.price,
                        quantity: i.quantity,
                    }))),
                },
                subscription_data: {
                    metadata: {
                        user_id: userId || '',
                    },
                },
            };

            if (userId) {
                sessionConfig.customer_creation = 'always';
            }

            const session = await stripe.checkout.sessions.create(sessionConfig);
            console.log('Subscription session created:', session.id);
            return NextResponse.json({ url: session.url });
        }

        // One-time purchase checkout
        const lineItems = oneTimeItems.map((item: CartItem) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: getFullImageUrl(item.imageUrl, origin),
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        console.log('Creating payment session with items:', JSON.stringify(lineItems, null, 2));

        const totalAmount = oneTimeItems.reduce((sum: number, item: CartItem) =>
            sum + (item.price * item.quantity), 0
        );

        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=payment`,
            cancel_url: `${origin}/?canceled=true`,
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'AU', 'CN', 'JP'],
            },
            metadata: {
                user_id: userId || '',
                type: 'payment',
                items: JSON.stringify(oneTimeItems.map((i: CartItem) => ({
                    id: i.id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    imageUrl: i.imageUrl,
                }))),
                total_amount: totalAmount.toString(),
            },
        };

        if (userId) {
            try {
                const { data: shippingAddr } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('type', 'shipping')
                    .eq('is_default', true)
                    .single();

                if (shippingAddr) {
                    sessionConfig.shipping_address_collection = undefined;
                    sessionConfig.shipping_options = [{
                        shipping_rate_data: {
                            type: 'fixed_amount',
                            fixed_amount: { amount: 0, currency: 'usd' },
                            display_name: 'Free Shipping',
                            delivery_estimate: {
                                minimum: { unit: 'business_day', value: 5 },
                                maximum: { unit: 'business_day', value: 7 },
                            },
                        },
                    }];
                }
            } catch (e) {
                // Ignore address lookup errors
                console.log('Address lookup skipped');
            }

            sessionConfig.customer_creation = 'always';
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);
        console.log('Payment session created:', session.id);

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err.message);
        console.error('Stripe Error Stack:', err.stack);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

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

export async function POST(req: Request) {
    try {
        const { items, userId } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in checkout' }, { status: 400 });
        }

        // Map cart items to Stripe line items
        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: item.imageUrl?.startsWith('http') ? [item.imageUrl] : undefined,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        // Calculate total for order record
        const totalAmount = items.reduce((sum: number, item: any) =>
            sum + (item.price * item.quantity), 0
        );

        // Build session config
        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/?canceled=true`,
            // Enable address collection
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'AU', 'CN'],
            },
            // Store metadata for order creation
            metadata: {
                user_id: userId || '',
                items: JSON.stringify(items.map((i: any) => ({
                    id: i.id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    imageUrl: i.imageUrl,
                }))),
                total_amount: totalAmount.toString(),
            },
        };

        // If user is logged in, try to pre-fill with saved addresses
        if (userId) {
            // Fetch user's default shipping address
            const { data: shippingAddr } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', userId)
                .eq('type', 'shipping')
                .eq('is_default', true)
                .single();

            // Fetch user profile for customer info
            const { data: profile } = await supabase
                .from('profiles')
                .select('first_name, last_name, phone')
                .eq('id', userId)
                .single();

            // Pre-fill shipping address if available
            if (shippingAddr) {
                sessionConfig.shipping_address_collection = undefined; // Don't ask again
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

            // Create or retrieve Stripe customer with pre-filled info
            if (profile) {
                const customerName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
                sessionConfig.customer_creation = 'always';

                // Pre-fill customer email (if we have it in request)
                // Note: Stripe Checkout will still allow editing
            }
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

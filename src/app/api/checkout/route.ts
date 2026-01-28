import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

// Create Supabase client for server-side usage
function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    category?: string;
    isSubscription?: boolean;
}

// Map product names to Stripe Product IDs (add more as you create them in Stripe)
const SUBSCRIPTION_PRODUCTS: { [key: string]: string } = {
    'wrecked-ralph': 'prod_Tkx2XHSptIXqmP',
    'bloated-bob': 'prod_TkxHcWyP25IVVa',
    'heavy-kev': 'prod_TkxKhzMu49QDET',
    'manic-max': 'prod_TkxKDbylNY5jcE',
};

// Helper to get full image URL
function getFullImageUrl(imageUrl: string | undefined, origin: string): string[] | undefined {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith('http')) return [imageUrl];
    return [`${origin}${imageUrl}`];
}

// Helper to get price ID from product ID
async function getPriceIdForProduct(productId: string): Promise<string | null> {
    try {
        const prices = await stripe.prices.list({
            product: productId,
            active: true,
            type: 'recurring',
            limit: 1,
        });
        if (prices.data.length > 0) {
            return prices.data[0].id;
        }
        return null;
    } catch (err) {
        console.error('Error fetching price for product:', productId, err);
        return null;
    }
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
        // One-time items will be included and charged on first payment
        if (subscriptionItems.length > 0) {
            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

            // Add subscription items
            for (const item of subscriptionItems) {
                // Extract product key from item id (e.g., "wrecked-ralph-sub" -> "wrecked-ralph")
                const productKey = item.id.replace('-sub', '');
                const stripeProductId = SUBSCRIPTION_PRODUCTS[productKey];

                if (stripeProductId) {
                    // Use pre-created Stripe product
                    const priceId = await getPriceIdForProduct(stripeProductId);
                    if (priceId) {
                        lineItems.push({
                            price: priceId,
                            quantity: item.quantity,
                        });
                        console.log(`Using existing Stripe price ${priceId} for ${productKey}`);
                    } else {
                        console.log(`No recursive price found for product ${stripeProductId}. Fallback to inline price creation.`);
                        // Fallback to inline price data attached to the existing product
                        lineItems.push({
                            price_data: {
                                currency: 'usd',
                                product: stripeProductId,
                                unit_amount: Math.round(item.price * 100),
                                recurring: { interval: 'month' },
                            },
                            quantity: item.quantity,
                        });
                    }
                } else {
                    // Fallback: create dynamic price for products not in mapping
                    console.log(`Product ${productKey} not in mapping, falling back to dynamic creation`);
                    lineItems.push({
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.name.replace(' (Subscribe)', '').replace(' (订阅)', '').replace(' (定期)', ''),
                            },
                            unit_amount: Math.round(item.price * 100),
                            recurring: { interval: 'month' },
                        },
                        quantity: item.quantity,
                    });
                }
            }

            // Add one-time items to the same session (charged on first payment only)
            for (const item of oneTimeItems) {
                lineItems.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name,
                            images: getFullImageUrl(item.imageUrl, origin),
                        },
                        unit_amount: Math.round(item.price * 100),
                        // No 'recurring' field = one-time charge
                    },
                    quantity: item.quantity,
                });
                console.log(`Adding one-time item to subscription checkout: ${item.name}`);
            }

            console.log('Creating mixed/subscription session with line items:', JSON.stringify(lineItems, null, 2));

            const sessionConfig: Stripe.Checkout.SessionCreateParams = {
                line_items: lineItems,
                mode: 'subscription',
                success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
                cancel_url: `${origin}/?canceled=true`,
                billing_address_collection: 'required',
                shipping_address_collection: {
                    allowed_countries: ['US', 'CA', 'GB', 'AU', 'CN', 'JP'],
                },
                metadata: {
                    user_id: userId || '',
                    type: oneTimeItems.length > 0 ? 'mixed' : 'subscription',
                    has_one_time_items: oneTimeItems.length > 0 ? 'true' : 'false',
                },
            };

            // Subscription mode automatically creates a customer, so we don't need 'customer_creation: always'
            // and actually it is forbidden to use it in subscription mode.

            const session = await stripe.checkout.sessions.create(sessionConfig);
            console.log('Subscription session created:', session.id);
            return NextResponse.json({ url: session.url });
        }

        // One-time purchase checkout
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = oneTimeItems.map((item: CartItem) => ({
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
                }))),
                total_amount: totalAmount.toString(),
            },
        };

        if (userId) {
            try {
                const { data: shippingAddr } = await getSupabase()
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
                console.log('Address lookup skipped');
            }

            sessionConfig.customer_creation = 'always';
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);
        console.log('Payment session created:', session.id);

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err.message);
        console.error('Stripe Error Details:', JSON.stringify(err, null, 2));
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

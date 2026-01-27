import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

// Use service role key for webhook (server-side, no user context)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        // Verify webhook signature
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (webhookSecret) {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } else {
            // For development/testing without webhook secret
            event = JSON.parse(body) as Stripe.Event;
            console.warn('⚠️ Webhook signature verification skipped (no STRIPE_WEBHOOK_SECRET)');
        }
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    console.log('📦 Received Stripe webhook:', event.type);

    // Handle different event types
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session);
                break;
            }
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                await handleInvoicePaymentSucceeded(invoice);
                break;
            }
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionChange(subscription, event.type);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Error processing webhook:', err.message);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    console.log('✅ Processing checkout.session.completed:', session.id);

    const userId = session.metadata?.user_id;
    const orderType = session.metadata?.type || 'payment';

    if (!userId) {
        console.warn('No user_id in session metadata, skipping order save');
        return;
    }

    // Retrieve line items from the session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
    });

    // Build order items array
    const items = lineItems.data.map(item => ({
        id: item.id,
        name: item.description || 'Product',
        price: (item.amount_total || 0) / 100,
        quantity: item.quantity || 1,
        price_id: item.price?.id,
        is_subscription: item.price?.type === 'recurring',
    }));

    // Create order record
    const orderData = {
        user_id: userId,
        stripe_session_id: session.id,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string | null,
        status: 'paid',
        total_amount: (session.amount_total || 0) / 100,
        currency: session.currency || 'usd',
        items: items,
        order_type: orderType,
        customer_email: session.customer_details?.email,
        shipping_address: session.shipping_details?.address ? {
            name: session.shipping_details.name,
            line1: session.shipping_details.address.line1,
            line2: session.shipping_details.address.line2,
            city: session.shipping_details.address.city,
            state: session.shipping_details.address.state,
            postal_code: session.shipping_details.address.postal_code,
            country: session.shipping_details.address.country,
        } : null,
    };

    console.log('💾 Saving order to database:', JSON.stringify(orderData, null, 2));

    const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

    if (error) {
        console.error('Failed to save order:', error);
        throw error;
    }

    console.log('✅ Order saved successfully:', data.id);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    console.log('💰 Invoice payment succeeded:', invoice.id);

    // This handles recurring subscription payments
    if (!invoice.subscription) {
        console.log('Not a subscription invoice, skipping');
        return;
    }

    // For recurring payments, we might want to create a new order record
    // or update the subscription status
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

    // Find existing orders with this subscription ID and update status
    const { data: existingOrder } = await supabase
        .from('orders')
        .select('id, user_id')
        .eq('stripe_subscription_id', invoice.subscription)
        .limit(1)
        .single();

    if (existingOrder) {
        console.log('Found existing order for subscription, renewal processed');
        // Optionally create a new order record for the renewal
    }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription, eventType: string) {
    console.log(`📋 Subscription ${eventType}:`, subscription.id);

    // Update order status based on subscription changes
    const newStatus = subscription.status === 'active' ? 'active' :
        subscription.status === 'canceled' ? 'cancelled' :
            subscription.status === 'past_due' ? 'past_due' : 'pending';

    const { error } = await supabase
        .from('orders')
        .update({
            subscription_status: newStatus,
            updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);

    if (error) {
        console.error('Failed to update subscription status:', error);
    } else {
        console.log('✅ Subscription status updated to:', newStatus);
    }
}

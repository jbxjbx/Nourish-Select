import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

// Use service role key for admin operations
function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export async function POST(req: Request) {
    try {
        const { orderId, reason } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        // Get order details
        const { data: order, error: orderError } = await getSupabase()
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.status === 'refunded') {
            return NextResponse.json({ error: 'Order already refunded' }, { status: 400 });
        }

        // Get payment intent from checkout session
        let paymentIntentId = order.stripe_payment_intent;

        // If we don't have payment_intent stored, retrieve it from the session
        if (!paymentIntentId && order.stripe_session_id) {
            try {
                const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
                paymentIntentId = session.payment_intent as string;

                // Store it for future use
                await getSupabase()
                    .from('orders')
                    .update({ stripe_payment_intent: paymentIntentId })
                    .eq('id', orderId);
            } catch (e) {
                console.error('Failed to retrieve session:', e);
            }
        }

        if (!paymentIntentId) {
            // For test orders without real payment, just update status
            await getSupabase()
                .from('orders')
                .update({
                    status: 'refunded',
                    updated_at: new Date().toISOString(),
                    notes: (order.notes || '') + '\n[Manual refund - no Stripe payment found]'
                })
                .eq('id', orderId);

            return NextResponse.json({
                success: true,
                message: 'Order marked as refunded (no Stripe payment to refund)',
                refund: null
            });
        }

        // Create Stripe refund
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            reason: reason === 'duplicate' ? 'duplicate' :
                reason === 'fraudulent' ? 'fraudulent' : 'requested_by_customer',
        });

        console.log('✅ Stripe refund created:', refund.id);

        // Update order status
        const { error: updateError } = await getSupabase()
            .from('orders')
            .update({
                status: 'refunded',
                updated_at: new Date().toISOString(),
                notes: (order.notes || '') + `\n[Refunded via Stripe: ${refund.id}]`
            })
            .eq('id', orderId);

        if (updateError) {
            console.error('Failed to update order status:', updateError);
        }

        return NextResponse.json({
            success: true,
            message: 'Refund processed successfully',
            refund: {
                id: refund.id,
                amount: refund.amount / 100,
                currency: refund.currency,
                status: refund.status
            }
        });

    } catch (error: any) {
        console.error('Refund error:', error);

        // Handle specific Stripe errors
        if (error.type === 'StripeInvalidRequestError') {
            return NextResponse.json({
                error: error.message || 'Invalid refund request'
            }, { status: 400 });
        }

        return NextResponse.json({
            error: 'Failed to process refund: ' + error.message
        }, { status: 500 });
    }
}

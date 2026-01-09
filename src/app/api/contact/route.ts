import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Check if API key is configured
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not configured');
            return NextResponse.json(
                { error: 'Email service not configured' },
                { status: 500 }
            );
        }

        // Build subject line
        const emailSubject = subject
            ? `📬 [${subject}] from ${name}`
            : `📬 New Contact from ${name}`;

        // Send email via Resend
        // NOTE: With Resend free tier using onboarding@resend.dev, you can only send to your own verified email
        const { data, error } = await resend.emails.send({
            from: 'Nourish Select Contact <onboarding@resend.dev>',
            to: process.env.CONTACT_EMAIL || 'support@nourishselect.co',
            replyTo: email,
            subject: emailSubject,
            html: `
                <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
                    <div style="background: #000; color: #39FF14; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">NEW MESSAGE</h1>
                    </div>
                    <div style="background: #fff; padding: 30px; border: 4px solid #000;">
                        <p><strong>From:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <hr style="border: 2px solid #000; margin: 20px 0;" />
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border: 2px solid #ddd;">${message}</p>
                    </div>
                    <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
                        Sent from nourishselect.co contact form
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', JSON.stringify(error, null, 2));
            return NextResponse.json(
                { error: 'Failed to send email', details: error.message || error.name },
                { status: 500 }
            );
        }

        console.log('📬 Email sent successfully:', data?.id);

        return NextResponse.json(
            { success: true, message: 'Message sent successfully!', id: data?.id },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

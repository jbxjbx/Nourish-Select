import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Send email via Resend
        const { data, error } = await resend.emails.send({
            from: 'Nourish Select Contact <onboarding@resend.dev>',
            to: process.env.CONTACT_EMAIL || 'support@nourishselect.co',
            replyTo: email,
            subject: `📬 New Contact from ${name}`,
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
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            );
        }

        console.log('📬 Email sent successfully:', data?.id);

        return NextResponse.json(
            { success: true, message: 'Message sent successfully!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}

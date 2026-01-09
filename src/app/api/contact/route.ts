import { NextRequest, NextResponse } from 'next/server';

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

        // For now, log the message (you can integrate with email service later)
        console.log('📬 New Contact Form Submission:');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);

        // TODO: Integrate with email service (e.g., Resend, SendGrid, etc.)
        // Example with Resend:
        // await resend.emails.send({
        //     from: 'Nourish Select <noreply@nourishselect.co>',
        //     to: 'support@nourishselect.co',
        //     subject: `New Contact: ${name}`,
        //     text: `From: ${name} (${email})\n\nMessage:\n${message}`
        // });

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

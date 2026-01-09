import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const apiKey = process.env.BEEHIIV_API_KEY;
    const pubId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !pubId) {
        console.error('Beehiiv configuration missing');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const response = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                email,
                reactivate_existing: false,
                send_welcome_email: true,
                utm_source: 'nourish-select-website',
                utm_medium: 'footer',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Beehiiv API Error:', errorData);
            return NextResponse.json(
                { error: errorData.message || 'Failed to subscribe' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

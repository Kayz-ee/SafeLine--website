const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const { line_items } = JSON.parse(event.body);

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.URL}/cancel.html`,
            billing_address_collection: 'required', // Collect address for shipping
            shipping_address_collection: {
                allowed_countries: ['US', 'GB', 'NG', 'DE', 'FR'], // Add countries as needed
            },
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ sessionId: session.id }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
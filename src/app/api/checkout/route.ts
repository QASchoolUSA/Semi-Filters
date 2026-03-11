import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { urlFor } from '@/sanity/lib/image';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover', // using latest or specified stable version
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        // Format line items for Stripe Checkout
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => {
            let itemImage = '';
            try {
                if (item.image) {
                    itemImage = urlFor(item.image).width(200).height(200).url();
                }
            } catch (e) {
                console.error("Failed to generate image URL mapping for stripe", e);
            }
            
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: item.partNumber ? `Part#: ${item.partNumber}` : undefined,
                        images: itemImage ? [itemImage] : undefined,
                    },
                    unit_amount: Math.round(item.price * 100), // convert to cents
                },
                quantity: item.quantity,
            };
        });

        // Calculate if we need to add a shipping fee line item. (E.g. Free shipping over $150 threshold)
        // Note: Better to handle this via Stripe Shipping Rates if you need robust logic
        // But since requirements specifically mentioned "auto shipping" logic was in frontend ($12.99 under $150),
        // we can pass it as a shipping option.
        
        // Define shipping options
        const shipping_options: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [];
        
        const totalCartPrice = items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
        
        if (totalCartPrice >= 150) {
            // Free shipping
            shipping_options.push({
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 0, currency: 'usd' },
                    display_name: 'Free Shipping',
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 3 },
                        maximum: { unit: 'business_day', value: 5 },
                    },
                },
            });
        } else {
            // Flat rate $12.99
            shipping_options.push({
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 1299, currency: 'usd' },
                    display_name: 'Standard Shipping',
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 3 },
                        maximum: { unit: 'business_day', value: 5 },
                    },
                },
            });
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            shipping_options,
            // Enable Address Collection
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB'], // Add other allowed countries
            },
            // Enable Phone Number Collection
            phone_number_collection: {
                enabled: true,
            },
            // Enable automatic tax
            automatic_tax: {
                enabled: true,
            },
            // Enable promotion codes
            allow_promotion_codes: true,
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            // Redirect cancel user back to cart preserving the state
            cancel_url: `${origin}/cart`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating Stripe Checkout Session:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

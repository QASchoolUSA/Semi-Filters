import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { urlFor } from '@/sanity/lib/image';
import {
    calculateShippingDollars,
    parseFulfillmentMethod,
    type FulfillmentMethod,
} from '@/lib/fulfillment';

function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    return new Stripe(key, {
        apiVersion: '2026-08-26.dahlia',
    });
}

export async function POST(request: Request) {
    try {
        const stripe = getStripe();
        const body = await request.json();
        const { items } = body;
        const fulfillmentMethod: FulfillmentMethod = parseFulfillmentMethod(body.fulfillmentMethod);

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

        const totalItemCount = items.reduce((total: number, item: any) => total + item.quantity, 0)
        const isPickup = fulfillmentMethod === 'pickup'

        const shipping_options: Stripe.Checkout.SessionCreateParams.ShippingOption[] = isPickup
            ? [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 0, currency: 'usd' },
                        display_name: 'Local Pickup — Sanford, FL',
                    },
                },
            ]
            : [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: Math.round(calculateShippingDollars(totalItemCount) * 100),
                            currency: 'usd',
                        },
                        display_name: 'Standard Shipping',
                        delivery_estimate: {
                            minimum: { unit: 'business_day', value: 3 },
                            maximum: { unit: 'business_day', value: 5 },
                        },
                    },
                },
            ];

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            shipping_options,
            phone_number_collection: {
                enabled: true,
            },
            automatic_tax: {
                enabled: true,
            },
            allow_promotion_codes: true,
            metadata: {
                fulfillmentMethod,
            },
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart`,
        }

        if (isPickup) {
            // Billing address required for automatic tax when no shipping address is collected
            sessionParams.billing_address_collection = 'required'
        } else {
            sessionParams.shipping_address_collection = {
                allowed_countries: ['US', 'CA', 'GB'],
            }
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating Stripe Checkout Session:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

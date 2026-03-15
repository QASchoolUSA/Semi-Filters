import React from 'react'
import type { Metadata } from 'next'

const BASE_URL = 'https://semifilters.com'

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Semi Filters terms of service. Read our terms and conditions for purchasing semi truck filters, shipping, returns, and warranty.',
    alternates: {
        canonical: `${BASE_URL}/terms`,
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function TermsPage() {
    return (
        <>
            <div className="page-header">
                <h1>Terms of Service</h1>
                <p>Last updated: March 2026</p>
            </div>
            <section className="section">
                <div className="container legal-content">
                    <h2>Agreement to Terms</h2>
                    <p>
                        By accessing and using semifilters.com, you agree to be bound by these Terms of Service. If you
                        do not agree, please do not use our website or services.
                    </p>

                    <h2>Products and Pricing</h2>
                    <p>
                        All products listed on Semi Filters are subject to availability. Prices are displayed in US
                        Dollars and may change without notice. We reserve the right to limit order quantities and to
                        refuse service at our discretion.
                    </p>
                    <p>
                        While we make every effort to display accurate product images and descriptions, slight
                        variations may occur. All filters are guaranteed to meet or exceed OEM specifications.
                    </p>

                    <h2>Orders and Payment</h2>
                    <p>
                        By placing an order, you confirm that the information provided is accurate and that you are
                        authorized to use the payment method. Orders are subject to acceptance and availability.
                        Payment is processed securely through Stripe.
                    </p>

                    <h2>Shipping</h2>
                    <p>
                        We offer same-day shipping on orders placed before 2:00 PM EST. Standard delivery takes 2–5
                        business days within the continental United States. Free shipping is available on orders over
                        $150. We also ship to Alaska, Hawaii, and Canada (additional charges may apply).
                    </p>

                    <h2>Returns and Refunds</h2>
                    <p>
                        We offer a 100% satisfaction guarantee. If you are not satisfied with your purchase, you may
                        return unused items within 30 days of delivery for a full refund. Return shipping is free.
                        Please contact support@semifilters.com to initiate a return.
                    </p>

                    <h2>Warranty</h2>
                    <p>
                        All filters sold by Semi Filters carry a manufacturer defect warranty. If you receive a
                        defective product, contact us within 30 days for a free replacement or full refund.
                    </p>

                    <h2>Limitation of Liability</h2>
                    <p>
                        Semi Filters shall not be liable for any indirect, incidental, or consequential damages arising
                        from the use of our products or services. Our total liability shall not exceed the purchase
                        price of the product in question.
                    </p>

                    <h2>Contact</h2>
                    <p>
                        Questions about these terms? Contact us at{' '}
                        <a href="mailto:support@semifilters.com">support@semifilters.com</a> or call (407) 768-1488.
                    </p>
                </div>
            </section>
        </>
    )
}

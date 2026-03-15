import React from 'react'
import type { Metadata } from 'next'

const BASE_URL = 'https://semifilters.com'

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Semi Filters privacy policy. Learn how we collect, use, and protect your personal information when you shop for semi truck filters.',
    alternates: {
        canonical: `${BASE_URL}/privacy`,
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function PrivacyPage() {
    return (
        <>
            <div className="page-header">
                <h1>Privacy Policy</h1>
                <p>Last updated: March 2026</p>
            </div>
            <section className="section">
                <div className="container legal-content">
                    <h2>Information We Collect</h2>
                    <p>
                        When you visit semifilters.com, we collect information you provide directly, such as your name,
                        email address, phone number, shipping address, and payment information when placing an order or
                        contacting us.
                    </p>
                    <p>
                        We also automatically collect certain technical data, including your IP address, browser type,
                        device information, and pages visited. This helps us improve our website and provide a better
                        shopping experience.
                    </p>

                    <h2>How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Process and fulfill your orders for semi truck filters</li>
                        <li>Communicate with you about orders, products, and promotions</li>
                        <li>Provide customer support and respond to inquiries</li>
                        <li>Improve our website, products, and services</li>
                        <li>Comply with legal obligations</li>
                    </ul>

                    <h2>Payment Security</h2>
                    <p>
                        All payment transactions are processed securely through Stripe. We do not store your full credit
                        card information on our servers. Stripe is PCI-DSS Level 1 certified, the highest level of
                        security certification.
                    </p>

                    <h2>Cookies</h2>
                    <p>
                        We use essential cookies to keep your shopping cart active and remember your preferences.
                        We may also use analytics cookies to understand how visitors interact with our website.
                    </p>

                    <h2>Third-Party Services</h2>
                    <p>
                        We may share your information with trusted third-party service providers who assist us in
                        operating our website, processing payments, and delivering orders. These providers are
                        contractually obligated to protect your data.
                    </p>

                    <h2>Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal information. You may also
                        opt out of marketing communications at any time. Contact us at support@semifilters.com to
                        exercise these rights.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        If you have questions about this privacy policy, please contact us at{' '}
                        <a href="mailto:support@semifilters.com">support@semifilters.com</a> or call (407) 768-1488.
                    </p>
                </div>
            </section>
        </>
    )
}

import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import FaqSection from '@/components/FaqSection'
import JsonLd from '@/components/JsonLd'
import { BASE_URL, breadcrumbJsonLd, faqPageJsonLd } from '@/lib/seo'
import { SITE_FAQS } from '@/lib/faqs'

export const metadata: Metadata = {
    title: 'FAQ — Semi Truck Filters, Shipping & Fitment',
    description:
        'Answers about OEM vs aftermarket filters, cross-references, shipping, returns, and fleet pricing from Semi Filters.',
    alternates: { canonical: `${BASE_URL}/faq` },
}

export default function FaqPage() {
    const crumbs = [
        { name: 'Home', href: '/' },
        { name: 'FAQ' },
    ]

    return (
        <section className="section">
            <JsonLd data={breadcrumbJsonLd(crumbs)} />
            <JsonLd data={faqPageJsonLd(SITE_FAQS)} />
            <div className="container">
                <Breadcrumbs items={crumbs} />
                <header className="landing-header">
                    <h1 className="landing-header__title">Frequently Asked Questions</h1>
                    <p className="landing-header__intro">
                        Straight answers on fitment, OEM quality, shipping, and fleet purchasing. Still stuck?{' '}
                        <Link href="/contact">Contact us</Link>.
                    </p>
                </header>
                <FaqSection title="Common questions" faqs={SITE_FAQS} id="site-faq" />
                <p className="landing-footer-links">
                    <Link href="/guides">Read maintenance guides</Link>
                    {' · '}
                    <Link href="/shop">Shop all filters</Link>
                </p>
            </div>
        </section>
    )
}

import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { HiOutlineShieldCheck, HiOutlineTruck, HiOutlineGlobe, HiOutlineHeart } from 'react-icons/hi'

const BASE_URL = 'https://semifilters.com'

export const metadata: Metadata = {
    title: 'About Us — Semi Filters | Sanford, FL',
    description: 'Learn about Semi Filters — founded by trucking industry veterans in Sanford, FL. We provide premium OEM-quality filtration solutions for semi trucks and owner-operators.',
    alternates: {
        canonical: `${BASE_URL}/about`,
    },
    openGraph: {
        title: 'About Semi Filters — Premium Truck Filtration',
        description: 'Founded by trucking industry veterans. 5+ years in business, 50K+ filters sold, 99% satisfaction rate. Sanford, FL.',
        url: `${BASE_URL}/about`,
        images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'About Semi Filters' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Semi Filters',
        description: 'Premium OEM-quality filtration solutions for semi trucks. Trusted by owner-operators across the USA.',
        images: ['/icon-512.png'],
    },
}

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/about` },
    ],
}

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What types of filters does Semi Filters sell?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Semi Filters sells premium OEM-quality oil filters, air filters, fuel filters, and cabin air filters for semi trucks including Freightliner, Peterbilt, Kenworth, Volvo, Mack, and International models.',
            },
        },
        {
            '@type': 'Question',
            name: 'Do Semi Filters products meet OEM specifications?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Every filter we sell meets or exceeds OEM specifications. Our team includes certified diesel mechanics who carefully vet every product in our catalog to ensure maximum engine protection.',
            },
        },
        {
            '@type': 'Question',
            name: 'How fast is shipping from Semi Filters?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'We offer same-day shipping on orders placed before 2 PM. Standard delivery takes 2–5 business days nationwide. Free shipping is available on orders over $150.',
            },
        },
        {
            '@type': 'Question',
            name: 'Does Semi Filters offer bulk or fleet pricing?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. We offer volume discounts, dedicated account managers, and scheduled delivery programs for fleet operators. Contact us at support@semifilters.com or call (407) 768-1488 for a custom quote.',
            },
        },
        {
            '@type': 'Question',
            name: 'What is the return policy at Semi Filters?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'We offer a 100% satisfaction guarantee on every filter. If you are not satisfied, contact our support team within 30 days for a full refund or exchange. Returns are free.',
            },
        },
        {
            '@type': 'Question',
            name: 'Where is Semi Filters located?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Semi Filters is based in Sanford, Florida (ZIP 32771). We ship to all 50 US states and Canada.',
            },
        },
    ],
}

export default function AboutPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <div className="about-hero">
                <h1>About Semi Filters</h1>
                <p>
                    Premium filtration solutions trusted by owner-operators and fleet managers across the nation.
                </p>
            </div>

            <div className="about-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">5+</div>
                        <div className="stat-label">Years in Business</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">50K+</div>
                        <div className="stat-label">Filters Sold</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">10K+</div>
                        <div className="stat-label">Happy Customers</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">99%</div>
                        <div className="stat-label">Satisfaction Rate</div>
                    </div>
                </div>

                <h2>Our Story</h2>
                <p>
                    Semi Filters was founded by a team of trucking industry veterans who saw a gap in the market:
                    owner-operators and small fleets were paying premium prices for filters that didn&apos;t always
                    meet their needs. We set out to change that.
                </p>
                <p>
                    Based in Sanford, Florida — we source and stock
                    only the highest quality filtration products. Every filter we sell meets or exceeds OEM
                    specifications, ensuring your engine gets the protection it deserves.
                </p>

                <h2>Our Mission</h2>
                <p>
                    Our mission is simple: provide every trucker with access to premium filtration at fair prices.
                    We believe that quality maintenance parts shouldn&apos;t break the bank, and that every
                    owner-operator deserves the same quality as the big fleets.
                </p>

                <h2>Why Choose Us</h2>
                <p>
                    We&apos;re not just a parts store — we&apos;re a partner in your truck&apos;s maintenance.
                    Our team includes certified diesel mechanics and supply chain experts who carefully vet every
                    product in our catalog. When you buy from Semi Filters, you&apos;re getting a filter that&apos;s
                    been tested, verified, and approved by people who understand trucks.
                </p>

                <div className="features-grid about-features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><HiOutlineShieldCheck size={28} /></div>
                        <h3 className="feature-title">Quality Guaranteed</h3>
                        <p className="feature-description">100% satisfaction guarantee on every filter we sell. Not happy? We&apos;ll make it right.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><HiOutlineTruck size={28} /></div>
                        <h3 className="feature-title">Fast Delivery</h3>
                        <p className="feature-description">Same-day shipping and free delivery on orders over $150. We know you can&apos;t wait.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><HiOutlineGlobe size={28} /></div>
                        <h3 className="feature-title">Nationwide Coverage</h3>
                        <p className="feature-description">We ship to all 50 states and Canada. Wherever your truck goes, we&apos;ve got you covered.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><HiOutlineHeart size={28} /></div>
                        <h3 className="feature-title">Expert Support</h3>
                        <p className="feature-description">Need help finding the right filter? Our team of diesel specialists is just a call away.</p>
                    </div>
                </div>

                <div className="about-cta">
                    <Link href="/shop" className="btn btn-primary btn-lg">
                        Shop Our Products
                    </Link>
                </div>
            </div>
        </>
    )
}

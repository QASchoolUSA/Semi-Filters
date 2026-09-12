import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { HiOutlineShieldCheck, HiOutlineTruck, HiOutlineGlobe, HiOutlineHeart } from 'react-icons/hi'
import Breadcrumbs from '@/components/Breadcrumbs'
import FaqSection from '@/components/FaqSection'
import JsonLd from '@/components/JsonLd'
import { BASE_URL, breadcrumbJsonLd, faqPageJsonLd } from '@/lib/seo'
import { SITE_FAQS } from '@/lib/faqs'

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

const aboutFaqs = SITE_FAQS.filter((f) =>
    [
        'What types of filters does Semi Filters sell?',
        'Do Semi Filters products meet OEM specifications?',
        'How fast is shipping from Semi Filters?',
        'Does Semi Filters offer bulk or fleet pricing?',
        'What is the return policy at Semi Filters?',
        'Where is Semi Filters located?',
    ].includes(f.question)
)

export default function AboutPage() {
    const crumbs = [
        { name: 'Home', href: '/' },
        { name: 'About' },
    ]

    return (
        <>
            <JsonLd data={breadcrumbJsonLd(crumbs)} />
            <JsonLd data={faqPageJsonLd(aboutFaqs)} />

            <div className="about-hero">
                <div className="about-hero__inner">
                    <Breadcrumbs items={crumbs} />
                    <span className="about-hero__badge">Sanford, FL — Shipping Nationwide</span>
                    <h1>About Semi Filters</h1>
                    <p>
                        Premium filtration solutions trusted by owner-operators and fleet managers across the nation.
                    </p>
                </div>
            </div>

            <section className="about-stats">
                <div className="about-stats__inner">
                    <div className="about-stat">
                        <span className="about-stat__value">5+</span>
                        <span className="about-stat__label">Years in Business</span>
                    </div>
                    <div className="about-stat">
                        <span className="about-stat__value">50K+</span>
                        <span className="about-stat__label">Filters Sold</span>
                    </div>
                    <div className="about-stat">
                        <span className="about-stat__value">10K+</span>
                        <span className="about-stat__label">Happy Customers</span>
                    </div>
                    <div className="about-stat">
                        <span className="about-stat__value">99%</span>
                        <span className="about-stat__label">Satisfaction Rate</span>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <div className="about-section__container">
                    <div className="about-cards-row">
                        <div className="about-card">
                            <div className="about-card__accent" />
                            <h2 className="about-card__heading">Our Story</h2>
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
                        </div>
                        <div className="about-card">
                            <div className="about-card__accent" />
                            <h2 className="about-card__heading">Our Mission</h2>
                            <p>
                                Our mission is simple: provide every trucker with access to premium filtration at fair prices.
                                We believe that quality maintenance parts shouldn&apos;t break the bank, and that every
                                owner-operator deserves the same quality as the big fleets.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-section about-section--alt">
                <div className="about-section__container">
                    <div className="about-section__header">
                        <h2 className="about-section__title">Why Choose Us</h2>
                        <p className="about-section__subtitle">
                            We&apos;re not just a parts store — we&apos;re a partner in your truck&apos;s maintenance.
                            Our team includes certified diesel mechanics and supply chain experts who carefully vet every
                            product in our catalog.
                        </p>
                    </div>
                    <div className="about-features">
                        <div className="about-feature">
                            <div className="about-feature__icon"><HiOutlineShieldCheck size={26} /></div>
                            <div className="about-feature__body">
                                <h3 className="about-feature__title">Quality Guaranteed</h3>
                                <p className="about-feature__desc">100% satisfaction guarantee on every filter we sell. Not happy? We&apos;ll make it right.</p>
                            </div>
                        </div>
                        <div className="about-feature">
                            <div className="about-feature__icon"><HiOutlineTruck size={26} /></div>
                            <div className="about-feature__body">
                                <h3 className="about-feature__title">Fast Delivery</h3>
                                <p className="about-feature__desc">Same-day shipping and free delivery on orders over $150. We know you can&apos;t wait.</p>
                            </div>
                        </div>
                        <div className="about-feature">
                            <div className="about-feature__icon"><HiOutlineGlobe size={26} /></div>
                            <div className="about-feature__body">
                                <h3 className="about-feature__title">Nationwide Coverage</h3>
                                <p className="about-feature__desc">We ship to all 50 states and Canada. Wherever your truck goes, we&apos;ve got you covered.</p>
                            </div>
                        </div>
                        <div className="about-feature">
                            <div className="about-feature__icon"><HiOutlineHeart size={26} /></div>
                            <div className="about-feature__body">
                                <h3 className="about-feature__title">Expert Support</h3>
                                <p className="about-feature__desc">Need help finding the right filter? Our team of diesel specialists is just a call away.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <div className="about-section__container">
                    <FaqSection title="Frequently Asked Questions" faqs={aboutFaqs} id="about-faq" />
                    <p className="landing-footer-links" style={{ marginTop: '1.5rem' }}>
                        <Link href="/faq">View all FAQs</Link>
                        {' · '}
                        <Link href="/guides">Read filter guides</Link>
                    </p>
                </div>
            </section>

            <section className="about-section">
                <div className="about-section__container">
                    <div className="about-cta-banner">
                        <h2 className="about-cta-banner__heading">Ready to Find the Right Filter?</h2>
                        <p className="about-cta-banner__text">Browse our catalog of premium OEM-quality filters for every major semi truck brand.</p>
                        <div className="about-cta-banner__actions">
                            <Link href="/shop" className="btn btn-primary btn-lg">
                                Shop Our Products
                            </Link>
                            <Link href="/contact" className="btn btn-outline btn-lg">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

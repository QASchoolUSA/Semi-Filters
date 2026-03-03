import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { HiOutlineShieldCheck, HiOutlineTruck, HiOutlineGlobe, HiOutlineHeart } from 'react-icons/hi'

export const metadata: Metadata = {
    title: 'About Us — Semi Filters',
    description: 'Learn about Semi Filters — our mission to provide premium filtration solutions for semi trucks and keep fleets running clean and efficient.',
}

export default function AboutPage() {
    return (
        <>
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
                    <Link href="/products" className="btn btn-primary btn-lg">
                        Shop Our Products
                    </Link>
                </div>
            </div>
        </>
    )
}

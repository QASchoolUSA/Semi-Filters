import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import HeroProductCarousel from './HeroProductCarousel'
import type { Banner, Product } from '@/types'

interface HeroBannerProps {
    banner?: Banner | null
    products?: Product[]
}

export default function HeroBanner({ banner, products }: HeroBannerProps) {
    return (
        <section className="hero">
            {/* Background Layer with Ken Burns Animation & Radial Backlight */}
            <div className="hero-background-wrapper">
                {banner?.image && (
                    <Image
                        src={urlFor(banner.image).width(1920).height(800).url()}
                        alt={banner.heading || 'Semi Filters'}
                        className="hero-bg-image"
                        width={1920}
                        height={800}
                        priority
                    />
                )}
                <div className="hero-overlay" />
                <div className="hero-radial-glow" />
            </div>

            {/* Content Layer — Split two-column on desktop */}
            <div className="container hero-container">
                <div className="hero-split">
                    {/* LEFT: Main Content Card */}
                    <div className="hero-content fade-in-up">
                        {banner?.discount && (
                            <div className="hero-discount-wrapper">
                                <span className="hero-discount">{banner.discount}</span>
                            </div>
                        )}
                        
                        <h1 className="hero-heading">
                            {banner?.heading || 'Premium Filters for Semi Trucks'}
                        </h1>
                        
                        <p className="hero-subheading">
                            {banner?.subheading || 'OEM-quality filtration solutions to keep your fleet running at peak performance. Trusted by owner-operators across the nation.'}
                        </p>
                        
                        <div className="hero-actions">
                            <Link
                                href={banner?.ctaLink || '/shop'}
                                className="btn btn-primary btn-lg hero-cta-primary"
                            >
                                {banner?.ctaText || 'Shop All Filters'}
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="hero-trust-indicators">
                            <div className="trust-item">
                                <span className="trust-stars">★★★★★</span>
                                <span className="trust-text">4.9/5 Average Rating</span>
                            </div>
                            <div className="trust-item">
                                <svg className="trust-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"></path></svg>
                                <span className="trust-text">Fast 3–5 Day Shipping</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: First-Time Buyer Promo Card (Desktop only) */}
                    <div className="hero-promo-card">
                        {/* Floating decorative number */}
                        <div className="hero-promo-big-number">15<span>%</span></div>

                        <div className="hero-promo-badge">🎉 First Order</div>
                        <h2 className="hero-promo-title">Exclusive Discount</h2>
                        <p className="hero-promo-desc">
                            New to Semi Filters? Save <strong>15%</strong> on your first order. Premium quality, fleet-proven performance.
                        </p>

                        <div className="hero-promo-code-wrapper">
                            <span className="hero-promo-code-label">Use code at checkout</span>
                            <div className="hero-promo-code">FIRST15</div>
                        </div>

                        <Link href="/shop" className="btn btn-primary hero-promo-cta">
                            Claim Discount →
                        </Link>

                        <p className="hero-promo-fine">Valid for new customers only. One use per account.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import type { Banner } from '@/types'

interface HeroBannerProps {
    banner?: Banner | null
}

export default function HeroBanner({ banner }: HeroBannerProps) {
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

            {/* Content Layer (Glassmorphism Card) */}
            <div className="container hero-container">
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
                        <Link href="/shop" className="btn btn-outline btn-lg hero-cta-secondary">
                            Browse Categories
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
                            <span className="trust-text">Same-Day Shipping</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll-indicator">
                <div className="mouse"></div>
            </div>
        </section>
    )
}

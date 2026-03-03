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
            <div className="hero-content">
                {banner?.discount && (
                    <span className="hero-discount">{banner.discount}</span>
                )}
                <h1 className="hero-heading">
                    {banner?.heading || 'Premium Filters for Semi Trucks'}
                </h1>
                <p className="hero-subheading">
                    {banner?.subheading || 'OEM-quality filtration solutions to keep your fleet running at peak performance. Trusted by owner-operators across the nation.'}
                </p>
                <div className="hero-actions">
                    <Link
                        href={banner?.ctaLink || '/products'}
                        className="btn btn-primary btn-lg"
                    >
                        {banner?.ctaText || 'Shop All Filters'}
                    </Link>
                    <Link href="/categories" className="btn btn-outline btn-lg">
                        Browse Categories
                    </Link>
                </div>
            </div>
        </section>
    )
}

'use client'

import React from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import TruckMakerFilters from '@/components/TruckMakerFilters'
import HeroProductCarousel from '@/components/HeroProductCarousel'
import { HiOutlineShieldCheck, HiOutlineTruck, HiOutlineClock, HiOutlineSupport } from 'react-icons/hi'
import type { Product, Category } from '@/types'

interface HomeClientProps {
    products: Product[]
    categories: Category[]
}

const features = [
    {
        icon: <HiOutlineShieldCheck size={28} />,
        title: 'OEM Quality',
        description: 'All filters meet or exceed OEM specifications for maximum engine protection.',
    },
    {
        icon: <HiOutlineTruck size={28} />,
        title: 'Fast Shipping',
        description: 'Same-day shipping on orders placed before 2 PM. Nationwide delivery in 2-5 days.',
    },
    {
        icon: <HiOutlineClock size={28} />,
        title: 'Extended Life',
        description: 'Advanced filtration media extends service intervals and reduces maintenance costs.',
    },
    {
        icon: <HiOutlineSupport size={28} />,
        title: 'Expert Support',
        description: 'Our team of diesel specialists is here to help you find the right filter for your truck.',
    },
]

export default function HomeClient({ products, categories }: HomeClientProps) {
    // Force use of real data from Sanity, without falling back to demo data.
    const displayCategories = categories || []
    const displayProducts = products || []

    return (
        <>
            {/* Truck Maker Filters Section */}
            <TruckMakerFilters categories={displayCategories} />

            {/* Featured Products */}
            <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Top Sellers</span>
                        <h2 className="section-title">Featured Products</h2>
                        <p className="section-subtitle">
                            Our most popular filters, trusted by thousands of owner-operators and fleet managers.
                        </p>
                    </div>
                    <div className="product-grid mobile-scroll-x">
                        {displayProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link href="/shop" className="btn btn-outline btn-lg">
                            View All Products →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Why Semi Filters</span>
                        <h2 className="section-title">Built for the Long Haul</h2>
                        <p className="section-subtitle">
                            We understand what it takes to keep your fleet on the road. That&apos;s why we only stock the highest quality filters.
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="section">
                <div className="container">
                    <div className="cta-banner">
                        <h2 className="cta-heading">Ready to Stock Up?</h2>
                        <p className="cta-text">
                            Shipping from $5.99. Bulk discounts available for fleet operators.
                        </p>
                        <Link href="/shop" className="btn btn-white btn-lg">
                            Shop All Filters
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

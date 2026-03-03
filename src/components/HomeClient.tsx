'use client'

import React from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import { HiOutlineShieldCheck, HiOutlineTruck, HiOutlineClock, HiOutlineSupport } from 'react-icons/hi'

interface HomeClientProps {
    products: any[]
    categories: any[]
}

const DEMO_CATEGORIES = [
    { _id: '1', name: 'Oil Filters', slug: { current: 'oil-filters' }, description: 'Premium engine oil filtration', image: null },
    { _id: '2', name: 'Air Filters', slug: { current: 'air-filters' }, description: 'Clean air for peak performance', image: null },
    { _id: '3', name: 'Fuel Filters', slug: { current: 'fuel-filters' }, description: 'Protect your fuel system', image: null },
    { _id: '4', name: 'Cabin Filters', slug: { current: 'cabin-filters' }, description: 'Breathe clean on the road', image: null },
]

const DEMO_PRODUCTS = [
    { _id: 'p1', name: 'Heavy Duty Oil Filter - HD-9001', slug: { current: 'hd-oil-filter-9001' }, price: 24.99, compareAtPrice: 34.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'HD-9001', inStock: true, featured: true, images: [] },
    { _id: 'p2', name: 'Premium Air Filter - AF-5500', slug: { current: 'premium-air-filter-5500' }, price: 39.99, category: { name: 'Air Filters', slug: { current: 'air-filters' } }, partNumber: 'AF-5500', inStock: true, featured: true, images: [] },
    { _id: 'p3', name: 'Fuel Water Separator - FW-3200', slug: { current: 'fuel-water-separator-3200' }, price: 29.99, compareAtPrice: 39.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'FW-3200', inStock: true, featured: true, images: [] },
    { _id: 'p4', name: 'Cabin Air Filter - CA-7700', slug: { current: 'cabin-air-filter-7700' }, price: 19.99, category: { name: 'Cabin Filters', slug: { current: 'cabin-filters' } }, partNumber: 'CA-7700', inStock: true, featured: true, images: [] },
    { _id: 'p5', name: 'Synthetic Oil Filter - SO-1200', slug: { current: 'synthetic-oil-filter-1200' }, price: 32.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'SO-1200', inStock: true, featured: true, images: [] },
    { _id: 'p6', name: 'High Flow Air Filter - HF-8800', slug: { current: 'high-flow-air-filter-8800' }, price: 54.99, compareAtPrice: 69.99, category: { name: 'Air Filters', slug: { current: 'air-filters' } }, partNumber: 'HF-8800', inStock: false, featured: true, images: [] },
    { _id: 'p7', name: 'Diesel Fuel Filter - DF-4400', slug: { current: 'diesel-fuel-filter-4400' }, price: 27.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'DF-4400', inStock: true, featured: true, images: [] },
    { _id: 'p8', name: 'Extended Life Oil Filter - EL-6600', slug: { current: 'extended-life-oil-filter-6600' }, price: 42.99, compareAtPrice: 54.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'EL-6600', inStock: true, featured: true, images: [] },
]

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
    const displayCategories = categories.length > 0 ? categories : DEMO_CATEGORIES
    const displayProducts = products.length > 0 ? products : DEMO_PRODUCTS

    return (
        <>
            {/* Categories Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Shop by Type</span>
                        <h2 className="section-title">Filter Categories</h2>
                        <p className="section-subtitle">
                            Find the right filter for your semi truck. We carry every type of filtration solution you need.
                        </p>
                    </div>
                    <div className="category-grid">
                        {displayCategories.map((category: any) => (
                            <CategoryCard key={category._id} category={category} />
                        ))}
                    </div>
                </div>
            </section>

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
                    <div className="product-grid">
                        {displayProducts.map((product: any) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link href="/products" className="btn btn-outline btn-lg">
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
                            Get free shipping on orders over $150. Bulk discounts available for fleet operators.
                        </p>
                        <Link href="/products" className="btn btn-white btn-lg">
                            Shop All Filters
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

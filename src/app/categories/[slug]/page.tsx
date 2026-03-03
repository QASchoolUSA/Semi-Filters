import React from 'react'
import { client } from '@/sanity/lib/client'
import { categoryBySlugQuery, productsByCategoryQuery } from '@/sanity/lib/queries'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 60

interface Props {
    params: Promise<{ slug: string }>
}

const DEMO_CATEGORY_DATA: Record<string, { category: any; products: any[] }> = {
    'oil-filters': {
        category: { _id: '1', name: 'Oil Filters', slug: { current: 'oil-filters' }, description: 'Premium engine oil filtration for maximum protection.' },
        products: [
            { _id: 'p1', name: 'Heavy Duty Oil Filter - HD-9001', slug: { current: 'hd-oil-filter-9001' }, price: 24.99, compareAtPrice: 34.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'HD-9001', inStock: true, featured: true, images: [] },
            { _id: 'p5', name: 'Synthetic Oil Filter - SO-1200', slug: { current: 'synthetic-oil-filter-1200' }, price: 32.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'SO-1200', inStock: true, featured: true, images: [] },
            { _id: 'p8', name: 'Extended Life Oil Filter - EL-6600', slug: { current: 'extended-life-oil-filter-6600' }, price: 42.99, compareAtPrice: 54.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'EL-6600', inStock: true, featured: true, images: [] },
        ],
    },
    'air-filters': {
        category: { _id: '2', name: 'Air Filters', slug: { current: 'air-filters' }, description: 'High-flow air filtration for clean combustion and peak performance.' },
        products: [
            { _id: 'p2', name: 'Premium Air Filter - AF-5500', slug: { current: 'premium-air-filter-5500' }, price: 39.99, category: { name: 'Air Filters', slug: { current: 'air-filters' } }, partNumber: 'AF-5500', inStock: true, featured: true, images: [] },
            { _id: 'p6', name: 'High Flow Air Filter - HF-8800', slug: { current: 'high-flow-air-filter-8800' }, price: 54.99, compareAtPrice: 69.99, category: { name: 'Air Filters', slug: { current: 'air-filters' } }, partNumber: 'HF-8800', inStock: false, featured: true, images: [] },
        ],
    },
    'fuel-filters': {
        category: { _id: '3', name: 'Fuel Filters', slug: { current: 'fuel-filters' }, description: 'Protect your fuel system from contaminants with our premium fuel filters.' },
        products: [
            { _id: 'p3', name: 'Fuel Water Separator - FW-3200', slug: { current: 'fuel-water-separator-3200' }, price: 29.99, compareAtPrice: 39.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'FW-3200', inStock: true, featured: true, images: [] },
            { _id: 'p7', name: 'Diesel Fuel Filter - DF-4400', slug: { current: 'diesel-fuel-filter-4400' }, price: 27.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'DF-4400', inStock: true, featured: true, images: [] },
        ],
    },
    'cabin-filters': {
        category: { _id: '4', name: 'Cabin Filters', slug: { current: 'cabin-filters' }, description: 'HEPA-grade cabin air filters for a cleaner driving experience.' },
        products: [
            { _id: 'p4', name: 'Cabin Air Filter - CA-7700', slug: { current: 'cabin-air-filter-7700' }, price: 19.99, category: { name: 'Cabin Filters', slug: { current: 'cabin-filters' } }, partNumber: 'CA-7700', inStock: true, featured: true, images: [] },
        ],
    },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const category = await client.fetch(categoryBySlugQuery, { slug }).catch(() => null)
    const cat = category || DEMO_CATEGORY_DATA[slug]?.category
    if (!cat) return { title: 'Category Not Found — Semi Filters' }
    return {
        title: `${cat.name} — Semi Filters`,
        description: cat.description || `Shop ${cat.name} at Semi Filters.`,
    }
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params
    let category = await client.fetch(categoryBySlugQuery, { slug }).catch(() => null)
    let products = await client.fetch(productsByCategoryQuery, { categorySlug: slug }).catch(() => [])

    if (!category) {
        const demo = DEMO_CATEGORY_DATA[slug]
        if (!demo) notFound()
        category = demo.category
        products = demo.products
    }

    return (
        <>
            <div className="page-header">
                <h1>{category.name}</h1>
                {category.description && <p>{category.description}</p>}
            </div>
            <section className="section">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link href="/categories">Categories</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>{category.name}</span>
                    </div>

                    {products.length > 0 ? (
                        <div className="product-grid">
                            {products.map((product: any) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="cart-empty">
                            <h2>No products yet</h2>
                            <p>Check back soon for new products in this category.</p>
                            <Link href="/products" className="btn btn-primary">Browse All Products</Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

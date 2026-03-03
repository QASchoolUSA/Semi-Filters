import React from 'react'
import { client } from '@/sanity/lib/client'
import { productBySlugQuery, featuredProductsQuery } from '@/sanity/lib/queries'
import ProductDetailClient from '@/components/ProductDetailClient'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 60

interface Props {
    params: Promise<{ slug: string }>
}

const DEMO_PRODUCTS: Record<string, any> = {
    'hd-oil-filter-9001': {
        _id: 'p1', name: 'Heavy Duty Oil Filter - HD-9001', slug: { current: 'hd-oil-filter-9001' }, price: 24.99, compareAtPrice: 34.99,
        description: 'Our Heavy Duty Oil Filter HD-9001 is engineered for semi trucks operating under extreme conditions. This premium filter features a multi-layer synthetic media that captures particles as small as 10 microns while maintaining excellent oil flow. Designed for extended drain intervals, it reduces maintenance costs while providing maximum engine protection.',
        category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'HD-9001', inStock: true, featured: true, images: [],
        specifications: [
            { label: 'Thread Size', value: '1-16 UNS' },
            { label: 'Height', value: '7.2 inches' },
            { label: 'Outer Diameter', value: '4.6 inches' },
            { label: 'Micron Rating', value: '10 microns' },
            { label: 'Max Pressure', value: '150 PSI' },
            { label: 'Flow Rate', value: '12 GPM' },
        ],
        compatibility: ['Kenworth T680', 'Peterbilt 579', 'Freightliner Cascadia', 'Volvo VNL', 'International LT'],
    },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const product = await client.fetch(productBySlugQuery, { slug }).catch(() => null)
    const p = product || DEMO_PRODUCTS[slug]
    if (!p) return { title: 'Product Not Found — Semi Filters' }
    return {
        title: `${p.name} — Semi Filters`,
        description: p.description || `Shop ${p.name} at Semi Filters. Premium filtration for semi trucks.`,
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params
    let product = await client.fetch(productBySlugQuery, { slug }).catch(() => null)
    let relatedProducts = await client.fetch(featuredProductsQuery).catch(() => [])

    // Use demo data if Sanity is not configured
    if (!product) {
        product = DEMO_PRODUCTS[slug]
        if (!product) {
            notFound()
        }
    }

    return (
        <section className="section">
            <div className="container">
                <ProductDetailClient product={product} relatedProducts={relatedProducts} />
            </div>
        </section>
    )
}

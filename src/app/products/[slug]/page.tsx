import React from 'react'
import { client } from '@/sanity/lib/client'
import { productBySlugQuery, featuredProductsQuery } from '@/sanity/lib/queries'
import ProductDetailClient from '@/components/ProductDetailClient'
import { DEMO_PRODUCT_DETAILS } from '@/lib/demo-data'
import type { Product } from '@/types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 60

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const product = await client.fetch(productBySlugQuery, { slug }).catch(() => null) as Product | null
    const p = product || DEMO_PRODUCT_DETAILS[slug]
    if (!p) return { title: 'Product Not Found — Semi Filters' }
    return {
        title: `${p.name} — Semi Filters`,
        description: p.description || `Shop ${p.name} at Semi Filters. Premium filtration for semi trucks.`,
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params
    let product = await client.fetch(productBySlugQuery, { slug }).catch(() => null) as Product | null
    const relatedProducts = await client.fetch(featuredProductsQuery).catch(() => []) as Product[]

    // Use demo data if Sanity is not configured
    if (!product) {
        product = DEMO_PRODUCT_DETAILS[slug]
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

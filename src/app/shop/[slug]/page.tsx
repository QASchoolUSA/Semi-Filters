import React from 'react'
import { client } from '@/sanity/lib/client'
import { productBySlugQuery, featuredProductsQuery } from '@/sanity/lib/queries'
import ProductDetailClient from '@/components/ProductDetailClient'
import { urlFor } from '@/sanity/lib/image'
import type { Product } from '@/types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 0

const BASE_URL = 'https://semifilters.com'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const product = await client.fetch(productBySlugQuery, { slug }).catch(() => null) as Product | null

    if (!product) return { title: 'Product Not Found | Semi Filters' }

    const productUrl = `${BASE_URL}/shop/${slug}`
    const imageUrl = product.images?.[0]
        ? urlFor(product.images[0]).width(800).height(800).url()
        : `${BASE_URL}/icon-512.png`
    const description = product.description
        ? `${product.description.slice(0, 150)}...`
        : `Shop ${product.name} at Semi Filters. OEM-quality filtration for semi trucks. Fast shipping.`

    return {
        title: product.name,
        description,
        alternates: {
            canonical: productUrl,
        },
        openGraph: {
            title: `${product.name} — Semi Filters`,
            description,
            url: productUrl,
            type: 'website',
            images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} — Semi Filters`,
            description,
            images: [imageUrl],
        },
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params
    const product = await client.fetch(productBySlugQuery, { slug }).catch(() => null) as Product | null
    const relatedProducts = await client.fetch(featuredProductsQuery).catch(() => []) as Product[]

    if (!product) {
        notFound()
    }

    const productUrl = `${BASE_URL}/shop/${slug}`
    const imageUrl = product.images?.[0]
        ? urlFor(product.images[0]).width(800).height(800).url()
        : `${BASE_URL}/icon-512.png`

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || `${product.name} — premium semi truck filter from Semi Filters.`,
        image: [imageUrl],
        url: productUrl,
        sku: product.partNumber || slug,
        mpn: product.partNumber || undefined,
        brand: {
            '@type': 'Brand',
            name: 'Semi Filters',
        },
        offers: {
            '@type': 'Offer',
            url: productUrl,
            priceCurrency: 'USD',
            price: product.price ?? 0,
            availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: 'Semi Filters',
            },
        },
        ...(product.category?.name && { category: product.category.name }),
    }

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: `${BASE_URL}/shop` },
            { '@type': 'ListItem', position: 3, name: product.name, item: productUrl },
        ],
    }

    return (
        <section className="section">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="container">
                <ProductDetailClient product={product} relatedProducts={relatedProducts} />
            </div>
        </section>
    )
}

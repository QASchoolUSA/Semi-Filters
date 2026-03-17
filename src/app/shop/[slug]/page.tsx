import React from 'react'
import { client } from '@/sanity/lib/client'
import { productBySlugQuery, featuredProductsQuery } from '@/sanity/lib/queries'
import ProductDetailClient from '@/components/ProductDetailClient'
import { urlFor } from '@/sanity/lib/image'
import type { Product } from '@/types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 60

const BASE_URL = 'https://semifilters.com'

interface Props {
    params: Promise<{ slug: string }>
}

function portableTextToPlain(blocks: unknown): string {
    if (!Array.isArray(blocks)) return ''
    return blocks
        .filter((b: Record<string, unknown>) => b._type === 'block' && Array.isArray(b.children))
        .map((b: Record<string, unknown>) =>
            (b.children as { text?: string }[]).map((c) => c.text || '').join('')
        )
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const product = await client.fetch(productBySlugQuery, { slug }).catch(() => null) as Product | null

    if (!product) return { title: 'Product Not Found | Semi Filters' }

    const productUrl = `${BASE_URL}/shop/${slug}`
    const imageUrl = product.images?.[0]
        ? urlFor(product.images[0]).width(800).height(800).url()
        : `${BASE_URL}/icon-512.png`

    const title = product.seoTitle || product.name
    const description = product.seoDescription
        || (product.description
            ? portableTextToPlain(product.description).slice(0, 155) + '...'
            : `Shop ${product.name} at Semi Filters. OEM-quality filtration for semi trucks. Fast shipping.`)

    return {
        title,
        description,
        alternates: {
            canonical: productUrl,
        },
        openGraph: {
            title: `${title} — Semi Filters`,
            description,
            url: productUrl,
            type: 'website',
            images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} — Semi Filters`,
            description,
            images: [imageUrl],
        },
        other: {
            'product:price:amount': String(product.price ?? 0),
            'product:price:currency': 'USD',
            'product:availability': product.inStock ? 'in stock' : 'out of stock',
            ...(product.partNumber ? { 'product:retailer_item_id': product.partNumber } : {}),
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

    const plainDescription = product.seoDescription
        || (product.description ? portableTextToPlain(product.description).slice(0, 200) : '')
        || `${product.name} — premium semi truck filter from Semi Filters.`

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.seoTitle || product.name,
        description: plainDescription,
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
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
                '@type': 'Organization',
                name: 'Semi Filters',
            },
            shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                    '@type': 'MonetaryAmount',
                    value: '5.99',
                    currency: 'USD',
                },
                shippingDestination: {
                    '@type': 'DefinedRegion',
                    addressCountry: 'US',
                },
                deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: {
                        '@type': 'QuantitativeValue',
                        minValue: 0,
                        maxValue: 1,
                        unitCode: 'DAY',
                    },
                    transitTime: {
                        '@type': 'QuantitativeValue',
                        minValue: 2,
                        maxValue: 5,
                        unitCode: 'DAY',
                    },
                },
            },
            hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'US',
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                merchantReturnDays: 30,
                returnMethod: 'https://schema.org/ReturnByMail',
                returnFees: 'https://schema.org/FreeReturn',
            },
        },
        ...(product.category?.name && { category: product.category.name }),
        ...(product.vehicleFit?.length && {
            additionalProperty: product.vehicleFit.map((v: string) => ({
                '@type': 'PropertyValue',
                name: 'Compatible With',
                value: v,
            })),
        }),
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

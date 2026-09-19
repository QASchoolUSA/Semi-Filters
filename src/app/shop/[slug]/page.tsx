import React from 'react'
import { getProductBySlug, getRelatedProducts } from '@/sanity/lib/fetch'
import ProductDetailClient from '@/components/ProductDetailClient'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import { urlFor } from '@/sanity/lib/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BASE_URL, breadcrumbJsonLd, faqPageJsonLd, portableTextToPlain } from '@/lib/seo'

export const revalidate = 60

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const product = await getProductBySlug(slug)

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
    const product = await getProductBySlug(slug)

    if (!product) {
        notFound()
    }

    const relatedProducts = await getRelatedProducts(product._id, product.categoryId)

    const productUrl = `${BASE_URL}/shop/${slug}`
    const imageUrl = product.images?.[0]
        ? urlFor(product.images[0]).width(800).height(800).url()
        : `${BASE_URL}/icon-512.png`

    const plainDescription = product.seoDescription
        || (product.description ? portableTextToPlain(product.description).slice(0, 200) : '')
        || `${product.name} — premium semi truck filter from Semi Filters.`

    const additionalProperty = [
        ...(product.fitmentDetails?.flatMap((row) => {
            const props = [
                {
                    '@type': 'PropertyValue' as const,
                    name: 'Compatible With',
                    value: row.brand,
                },
            ]
            if (row.models?.length) {
                props.push({
                    '@type': 'PropertyValue' as const,
                    name: `${row.brand} Models`,
                    value: row.models.join(', '),
                })
            }
            if (row.engines?.length) {
                props.push({
                    '@type': 'PropertyValue' as const,
                    name: `${row.brand} Engines`,
                    value: row.engines.join(', '),
                })
            }
            return props
        }) ?? []),
        ...(!product.fitmentDetails?.length && product.vehicleFit?.length
            ? product.vehicleFit.map((v) => ({
                '@type': 'PropertyValue' as const,
                name: 'Compatible With',
                value: v,
            }))
            : []),
    ]

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
            name: product.brand || 'Semi Filters',
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
        ...(additionalProperty.length ? { additionalProperty } : {}),
    }

    const crumbs = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        ...(product.category?.slug?.current
            ? [{ name: product.category.name, href: `/filters/${product.category.slug.current}` }]
            : []),
        { name: product.name },
    ]

    return (
        <section className="section">
            <JsonLd data={productJsonLd} />
            <JsonLd data={breadcrumbJsonLd(crumbs)} />
            {product.faqs?.length ? <JsonLd data={faqPageJsonLd(product.faqs)} /> : null}
            <div className="container">
                <Breadcrumbs items={crumbs} className="product-breadcrumbs-full" />
                {product.category?.slug?.current ? (
                    <Breadcrumbs
                        className="product-breadcrumbs-mobile"
                        linkLast
                        items={[
                            {
                                name: product.category.name,
                                href: `/filters/${product.category.slug.current}`,
                            },
                        ]}
                    />
                ) : null}
                <ProductDetailClient product={product} relatedProducts={relatedProducts} />
            </div>
        </section>
    )
}

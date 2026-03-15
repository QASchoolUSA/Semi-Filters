import React from 'react'
import { client } from '@/sanity/lib/client'
import { allProductsQuery, allCategoriesQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import ShopClient from '@/components/ShopClient'
import type { Product, Category } from '@/types'
import type { Metadata } from 'next'

const BASE_URL = 'https://semifilters.com'

export const metadata: Metadata = {
    title: 'Shop All Semi Truck Filters — Oil, Air, Fuel & Cabin',
    description: 'Browse our full catalog of premium semi truck filters. OEM-quality oil filters, air filters, fuel filters, and cabin filters. Fast shipping on every order.',
    alternates: {
        canonical: `${BASE_URL}/shop`,
    },
    openGraph: {
        title: 'Shop All Semi Truck Filters — Semi Filters',
        description: 'Browse OEM-quality oil, air, fuel, and cabin filters for semi trucks. Fast shipping. Shop the full catalog.',
        url: `${BASE_URL}/shop`,
        images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'Semi Filters Shop' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Shop All Semi Truck Filters — Semi Filters',
        description: 'OEM-quality oil, air, fuel, and cabin filters for semi trucks. Fast shipping.',
        images: ['/icon-512.png'],
    },
}

export const revalidate = 60

async function getData() {
    const [products, categories] = await Promise.all([
        client.fetch(allProductsQuery).catch(() => []) as Promise<Product[]>,
        client.fetch(allCategoriesQuery).catch(() => []) as Promise<Category[]>,
    ])
    return { products, categories }
}

function buildShopJsonLd(products: Product[]) {
    const itemList = products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE_URL}/shop/${p.slug.current}`,
        name: p.name,
        image: p.images?.[0] ? urlFor(p.images[0]).width(400).height(400).url() : undefined,
    }))

    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Shop All Semi Truck Filters',
        description: 'Browse our full catalog of premium semi truck filters.',
        url: `${BASE_URL}/shop`,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        mainEntity: {
            '@type': 'ItemList',
            name: 'All Semi Truck Filters',
            numberOfItems: products.length,
            itemListElement: itemList,
        },
    }
}

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: `${BASE_URL}/shop` },
    ],
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { products, categories } = await getData()
    const resolvedParams = await searchParams
    const initialCategory = typeof resolvedParams.category === 'string' ? resolvedParams.category : 'all'
    const shopJsonLd = buildShopJsonLd(products)

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(shopJsonLd) }}
            />
            <div className="shop-page-title-banner">
                <div className="container">
                    <h1>All Products</h1>
                    <p>Premium OEM-quality oil, air, fuel, and cabin filters for semi trucks. Find the exact filter for your Freightliner, Peterbilt, Kenworth, Volvo, or Mack truck.</p>
                </div>
            </div>
            <section className="section shop-section">
                <div className="container">
                    <ShopClient products={products} categories={categories} initialCategory={initialCategory} />
                </div>
            </section>
        </>
    )
}

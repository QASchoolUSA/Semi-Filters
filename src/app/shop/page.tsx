import React from 'react'
import { getAllProducts, getCategories, getShopFacets } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import ShopClient from '@/components/ShopClient'
import {
    buildCategoryCounts,
    collectTruckBrands,
    filterProducts,
    paginateProducts,
    parseShopFilters,
    sortProducts,
} from '@/lib/shop'
import type { Product } from '@/types'
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

function buildShopJsonLd(products: Product[], total: number) {
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
            numberOfItems: total,
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

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams
    const filters = parseShopFilters(resolvedParams)

    const [allProducts, categories, facets] = await Promise.all([
        getAllProducts(),
        getCategories(),
        getShopFacets(),
    ])

    const filtered = filterProducts(allProducts, filters, categories)
    const sorted = sortProducts(filtered, filters.sort)
    const { items, total, totalPages, page } = paginateProducts(sorted, filters.page)

    const categoryCounts = buildCategoryCounts(facets, categories, {
        truck: filters.truck,
        sort: filters.sort,
        inStockOnly: filters.inStockOnly,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
    })

    const truckBrands = collectTruckBrands(facets)
    const pricedFacets = facets.filter((p): p is typeof p & { price: number } => p.price != null)
    const priceRange = pricedFacets.length
        ? {
              min: Math.floor(Math.min(...pricedFacets.map((p) => p.price))),
              max: Math.ceil(Math.max(...pricedFacets.map((p) => p.price))),
          }
        : { min: 0, max: 0 }

    const shopJsonLd = buildShopJsonLd(items, total)

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
                    <p>
                        Premium OEM-quality oil, air, fuel, and cabin filters for semi trucks. Find
                        the exact filter for your Freightliner, Peterbilt, Kenworth, Volvo, or Mack
                        truck.
                    </p>
                </div>
            </div>
            <section className="section shop-section">
                <div className="container">
                    <ShopClient
                        products={items}
                        categories={categories}
                        filters={filters}
                        total={total}
                        totalPages={totalPages}
                        page={page}
                        categoryCounts={categoryCounts}
                        truckBrands={truckBrands}
                        priceRange={priceRange}
                    />
                </div>
            </section>
        </>
    )
}

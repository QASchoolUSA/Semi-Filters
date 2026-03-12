import React from 'react'
import { client } from '@/sanity/lib/client'
import { allProductsQuery, allCategoriesQuery } from '@/sanity/lib/queries'
import ShopClient from '@/components/ShopClient'
import type { Product, Category } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Shop All Semi Truck Filters — Oil, Air, Fuel & Cabin',
    description: 'Browse our full catalog of premium semi truck filters. OEM-quality oil filters, air filters, fuel filters, and cabin filters. Fast shipping on every order.',
    alternates: {
        canonical: 'https://semifilters.com/shop',
    },
    openGraph: {
        title: 'Shop All Semi Truck Filters — Semi Filters',
        description: 'Browse OEM-quality oil, air, fuel, and cabin filters for semi trucks. Fast shipping. Shop the full catalog.',
        url: 'https://semifilters.com/shop',
        images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'Semi Filters Shop' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Shop All Semi Truck Filters — Semi Filters',
        description: 'OEM-quality oil, air, fuel, and cabin filters for semi trucks. Fast shipping.',
        images: ['/icon-512.png'],
    },
}

export const revalidate = 0

async function getData() {
    const [products, categories] = await Promise.all([
        client.fetch(allProductsQuery).catch(() => []) as Promise<Product[]>,
        client.fetch(allCategoriesQuery).catch(() => []) as Promise<Category[]>,
    ])
    return { products, categories }
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { products, categories } = await getData()
    const resolvedParams = await searchParams
    const initialCategory = typeof resolvedParams.category === 'string' ? resolvedParams.category : 'all'

    return (
        <>
            <div className="shop-page-title-banner">
                <div className="container">
                    <h1>All Products</h1>
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

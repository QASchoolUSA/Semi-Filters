import React from 'react'
import { client } from '@/sanity/lib/client'
import { allProductsQuery, allCategoriesQuery } from '@/sanity/lib/queries'
import ShopClient from '@/components/ShopClient'
import type { Product, Category } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'All Products — Semi Filters',
    description: 'Browse our full catalog of premium semi truck filters. Oil filters, air filters, fuel filters, cabin filters and more.',
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

import React from 'react'
import { client } from '@/sanity/lib/client'
import { allProductsQuery, allCategoriesQuery } from '@/sanity/lib/queries'
import ProductsClient from '@/components/ProductsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'All Products — Semi Filters',
    description: 'Browse our full catalog of premium semi truck filters. Oil filters, air filters, fuel filters, cabin filters and more.',
}

export const revalidate = 60

async function getData() {
    const [products, categories] = await Promise.all([
        client.fetch(allProductsQuery).catch(() => []),
        client.fetch(allCategoriesQuery).catch(() => []),
    ])
    return { products, categories }
}

export default async function ProductsPage() {
    const { products, categories } = await getData()

    return (
        <>
            <div className="page-header">
                <h1>All Products</h1>
                <p>Premium filtration solutions for every semi truck</p>
            </div>
            <section className="section">
                <div className="container">
                    <ProductsClient products={products} categories={categories} />
                </div>
            </section>
        </>
    )
}

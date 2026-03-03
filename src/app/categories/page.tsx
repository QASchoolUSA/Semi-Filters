import React from 'react'
import { client } from '@/sanity/lib/client'
import { allCategoriesQuery } from '@/sanity/lib/queries'
import CategoryCard from '@/components/CategoryCard'
import type { Category } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Filter Categories — Semi Filters',
    description: 'Browse semi truck filter categories. Oil filters, air filters, fuel filters, cabin filters, and more.',
}

export const revalidate = 60

export default async function CategoriesPage() {
    const categories = await client.fetch(allCategoriesQuery).catch(() => []) as Category[]

    return (
        <>
            <div className="page-header">
                <h1>Filter Categories</h1>
                <p>Find the right filter type for your semi truck</p>
            </div>
            <section className="section">
                <div className="container">
                    <div className="category-grid">
                        {categories.map((category) => (
                            <CategoryCard key={category._id} category={category} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

import React from 'react'
import { client } from '@/sanity/lib/client'
import { allCategoriesQuery } from '@/sanity/lib/queries'
import CategoryCard from '@/components/CategoryCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Filter Categories — Semi Filters',
    description: 'Browse semi truck filter categories. Oil filters, air filters, fuel filters, cabin filters, and more.',
}

export const revalidate = 60

const DEMO_CATEGORIES = [
    { _id: '1', name: 'Oil Filters', slug: { current: 'oil-filters' }, description: 'Premium engine oil filtration for maximum protection. Designed for extended drain intervals in heavy-duty diesel engines.', image: null },
    { _id: '2', name: 'Air Filters', slug: { current: 'air-filters' }, description: 'High-flow air filtration for clean combustion. Keeps contaminants out of your engine for peak performance.', image: null },
    { _id: '3', name: 'Fuel Filters', slug: { current: 'fuel-filters' }, description: 'Protect your fuel system from contaminants. Water separators and fuel filters for all diesel engines.', image: null },
    { _id: '4', name: 'Cabin Filters', slug: { current: 'cabin-filters' }, description: 'Breathe clean air in your cab. HEPA-grade cabin air filters that remove dust, pollen, and exhaust fumes.', image: null },
]

export default async function CategoriesPage() {
    let categories = await client.fetch(allCategoriesQuery).catch(() => [])
    if (categories.length === 0) categories = DEMO_CATEGORIES

    return (
        <>
            <div className="page-header">
                <h1>Filter Categories</h1>
                <p>Find the right filter type for your semi truck</p>
            </div>
            <section className="section">
                <div className="container">
                    <div className="category-grid">
                        {categories.map((category: any) => (
                            <CategoryCard key={category._id} category={category} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

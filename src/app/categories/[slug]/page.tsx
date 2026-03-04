import React from 'react'
import { client } from '@/sanity/lib/client'
import { categoryBySlugQuery, productsByCategoryQuery } from '@/sanity/lib/queries'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Product, Category } from '@/types'

export const revalidate = 0

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const category = await client.fetch(categoryBySlugQuery, { slug }).catch(() => null) as Category | null

    if (!category) return { title: 'Category Not Found — Semi Filters' }
    return {
        title: `${category.name} — Semi Filters`,
        description: category.description || `Shop ${category.name} at Semi Filters.`,
    }
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params
    let category = await client.fetch(categoryBySlugQuery, { slug }).catch(() => null) as Category | null
    let products = await client.fetch(productsByCategoryQuery, { categorySlug: slug }).catch(() => []) as Product[]

    if (!category) {
        notFound()
    }

    return (
        <>
            <div className="page-header">
                <h1>{category.name}</h1>
                {category.description && <p>{category.description}</p>}
            </div>
            <section className="section">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link href="/categories">Categories</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>{category.name}</span>
                    </div>

                    {products.length > 0 ? (
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="cart-empty">
                            <h2>No products yet</h2>
                            <p>Check back soon for new products in this category.</p>
                            <Link href="/products" className="btn btn-primary">Browse All Products</Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

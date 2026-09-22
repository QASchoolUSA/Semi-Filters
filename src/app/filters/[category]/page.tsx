import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
    getCategoryBySlug,
    getCategories,
    getProductsByCategorySlug,
} from '@/sanity/lib/fetch'
import ProductCard from '@/components/ProductCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import { BASE_URL, breadcrumbJsonLd } from '@/lib/seo'

export const revalidate = 60

interface Props {
    params: Promise<{ category: string }>
}

export async function generateStaticParams() {
    const categories = await getCategories()
    return categories
        .filter((c) => c.slug?.current)
        .map((c) => ({ category: c.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: slug } = await params
    const category = await getCategoryBySlug(slug)
    if (!category) return { title: 'Category Not Found' }

    const title = category.seoTitle || `${category.name} for Semi Trucks`
    const description =
        category.seoDescription ||
        category.description ||
        `Shop OEM-quality ${category.name.toLowerCase()} for Class 8 trucks at Semi Filters.`

    return {
        title,
        description,
        alternates: { canonical: `${BASE_URL}/filters/${slug}` },
        openGraph: {
            title: `${title} | Semi Filters`,
            description,
            url: `${BASE_URL}/filters/${slug}`,
            images: [{ url: '/icon-512.png', width: 512, height: 512, alt: category.name }],
        },
    }
}

export default async function CategoryLandingPage({ params }: Props) {
    const { category: slug } = await params
    const [category, products] = await Promise.all([
        getCategoryBySlug(slug),
        getProductsByCategorySlug(slug),
    ])

    if (!category) notFound()

    const pageUrl = `${BASE_URL}/filters/${slug}`
    const crumbs = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: category.name },
    ]

    const collectionJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: category.seoTitle || category.name,
        description: category.seoDescription || category.description,
        url: pageUrl,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: products.length,
            itemListElement: products.slice(0, 24).map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${BASE_URL}/shop/${p.slug.current}`,
                name: p.name,
            })),
        },
    }

    return (
        <section className="section">
            <JsonLd data={breadcrumbJsonLd(crumbs)} />
            <JsonLd data={collectionJsonLd} />
            <div className="container">
                <Breadcrumbs items={crumbs} />
                <header className="landing-header">
                    <h1 className="landing-header__title">{category.name}</h1>
                    <p className="landing-header__intro">
                        {category.description ||
                            `OEM-specification ${category.name.toLowerCase()} for semi trucks. Verify fitment by OEM number, then order with fast US shipping.`}
                    </p>
                    <p className="landing-header__meta">{products.length} products</p>
                </header>

                {products.length > 0 ? (
                    <div className="product-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <p>
                        No products in this category yet.{' '}
                        <Link href="/shop">Browse the full shop</Link>.
                    </p>
                )}
            </div>
        </section>
    )
}

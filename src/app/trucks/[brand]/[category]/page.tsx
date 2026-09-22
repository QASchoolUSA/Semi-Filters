import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
    getCategories,
    getCategoryBySlug,
    getProductsByTruckBrandAndCategory,
} from '@/sanity/lib/fetch'
import ProductCard from '@/components/ProductCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import {
    BASE_URL,
    TRUCK_BRANDS,
    breadcrumbJsonLd,
    truckBrandToSlug,
    truckSlugToBrand,
} from '@/lib/seo'

export const revalidate = 60

interface Props {
    params: Promise<{ brand: string; category: string }>
}

export async function generateStaticParams() {
    const categories = await getCategories()
    const categorySlugs = categories
        .map((c) => c.slug?.current)
        .filter((slug): slug is string => Boolean(slug))

    return TRUCK_BRANDS.flatMap((brand) =>
        categorySlugs.map((category) => ({
            brand: truckBrandToSlug(brand),
            category,
        }))
    )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { brand: brandSlug, category: categorySlug } = await params
    const brand = truckSlugToBrand(brandSlug)
    if (!brand) return { title: 'Truck Brand Not Found' }

    const category = await getCategoryBySlug(categorySlug)
    if (!category) return { title: 'Category Not Found' }

    const title = `${brand} ${category.name} — Semi Truck Filters`
    const description =
        category.seoDescription ||
        `Shop ${brand} ${category.name.toLowerCase()} for Class 8 trucks. OEM crosses and fitment notes included.`
    const pageUrl = `${BASE_URL}/trucks/${brandSlug}/${categorySlug}`

    return {
        title,
        description,
        alternates: { canonical: pageUrl },
        openGraph: {
            title: `${title} | Semi Filters`,
            description,
            url: pageUrl,
            images: [{ url: '/icon-512.png', width: 512, height: 512, alt: `${brand} ${category.name}` }],
        },
    }
}

export default async function TruckCategoryLandingPage({ params }: Props) {
    const { brand: brandSlug, category: categorySlug } = await params
    const brand = truckSlugToBrand(brandSlug)
    if (!brand) notFound()

    const [category, products] = await Promise.all([
        getCategoryBySlug(categorySlug),
        getProductsByTruckBrandAndCategory(brand, categorySlug),
    ])

    if (!category) notFound()

    const pageUrl = `${BASE_URL}/trucks/${brandSlug}/${categorySlug}`
    const crumbs = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: `${brand} Filters`, href: `/trucks/${brandSlug}` },
        { name: category.name },
    ]

    const title = `${brand} ${category.name}`
    const description =
        category.description ||
        `OEM-specification ${category.name.toLowerCase()} for ${brand} semi trucks. Verify fitment by OEM number, then order with fast US shipping.`

    const collectionJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description: category.seoDescription || description,
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
                    <h1 className="landing-header__title">{title}</h1>
                    <p className="landing-header__intro">{description}</p>
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
                        No {category.name.toLowerCase()} tagged for {brand} yet.{' '}
                        <Link href={`/trucks/${brandSlug}`}>Browse all {brand} filters</Link>
                        {' · '}
                        <Link href="/shop">Shop all products</Link>.
                    </p>
                )}

                <p className="landing-footer-links">
                    <Link href={`/trucks/${brandSlug}`}>All {brand} filters</Link>
                    {' · '}
                    <Link href={`/filters/${categorySlug}`}>{category.name} (all brands)</Link>
                    {' · '}
                    <Link href="/shop">All products</Link>
                    {' · '}
                    <Link href="/guides">Maintenance Guides</Link>
                </p>
            </div>
        </section>
    )
}

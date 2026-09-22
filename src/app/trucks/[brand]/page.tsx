import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductsByTruckBrand } from '@/sanity/lib/fetch'
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
    params: Promise<{ brand: string }>
}

const brandCopy: Record<string, { intro: string; seoTitle: string; seoDescription: string }> = {
    Volvo: {
        intro:
            'OEM-specification oil, air, and fuel filters for Volvo VNL, VNM, VNR, and VHD trucks — including D11/D12/D13 applications and shared Mack platforms where verified.',
        seoTitle: 'Volvo Semi Truck Filters — VNL, D11, D13 & More',
        seoDescription:
            'Shop Volvo truck filters: oil, air, fuel, and service kits for VNL/D13 and related platforms. OEM crosses and fitment notes included.',
    },
    Freightliner: {
        intro:
            'Filters for Freightliner Cascadia, Columbia, and related Detroit- or Cummins-powered chassis. Match airbox and fuel-processor housings before you buy.',
        seoTitle: 'Freightliner Semi Truck Filters — Cascadia & More',
        seoDescription:
            'Freightliner Cascadia oil, air, and fuel filters for Detroit DD13/DD15/DD16 and Cummins X15. Fast shipping from Semi Filters.',
    },
    Kenworth: {
        intro:
            'Kenworth T680, T800, T880, and W900 filtration — including Paccar air elements and Fuel Pro water separators. Confirm OEM numbers for your airbox.',
        seoTitle: 'Kenworth Semi Truck Filters — T680, T880 & More',
        seoDescription:
            'Shop Kenworth truck filters for T680/T880 platforms: air filters, fuel/water separators, and more with clear cross-references.',
    },
    Peterbilt: {
        intro:
            'Peterbilt 567/579 and shared Paccar platform filters. Many air and fuel elements also appear on Kenworth — always verify the housing stamp.',
        seoTitle: 'Peterbilt Semi Truck Filters — 579 & Shared Paccar',
        seoDescription:
            'Peterbilt filters for 579 and related Paccar platforms. OEM-spec air and fuel filtration with interchange guidance.',
    },
    Mack: {
        intro:
            'Mack Anthem/Pinnacle and MP7/MP8 filtration, including shared Volvo platform elements where the OEM number matches.',
        seoTitle: 'Mack Semi Truck Filters — MP7, MP8 & Anthem',
        seoDescription:
            'Mack truck filters for MP7/MP8 diesels and shared Volvo applications. Verify OEM numbers before install.',
    },
    International: {
        intro:
            'International / Navistar Class 8 filtration for listed applications, including select Fuel Pro processor elements.',
        seoTitle: 'International Semi Truck Filters',
        seoDescription:
            'International truck filters for listed heavy-duty applications. Confirm housing and OEM chart before ordering.',
    },
    'Western Star': {
        intro:
            'Western Star filters for Detroit DD13/DD15/DD16 powered trucks — oil kits, fuel kits, and water separators.',
        seoTitle: 'Western Star Semi Truck Filters',
        seoDescription:
            'Western Star oil and fuel filters for Detroit diesels. OEM-spec kits and separators with fast US shipping.',
    },
    DAF: {
        intro: 'DAF heavy-duty filtration for listed applications in our catalog.',
        seoTitle: 'DAF Semi Truck Filters',
        seoDescription: 'Shop DAF truck filters available at Semi Filters. Verify OEM fitment before purchase.',
    },
}

export function generateStaticParams() {
    return TRUCK_BRANDS.map((brand) => ({ brand: truckBrandToSlug(brand) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { brand: slug } = await params
    const brand = truckSlugToBrand(slug)
    if (!brand) return { title: 'Truck Brand Not Found' }
    const copy = brandCopy[brand]
    return {
        title: copy.seoTitle,
        description: copy.seoDescription,
        alternates: { canonical: `${BASE_URL}/trucks/${slug}` },
        openGraph: {
            title: `${copy.seoTitle} | Semi Filters`,
            description: copy.seoDescription,
            url: `${BASE_URL}/trucks/${slug}`,
            images: [{ url: '/icon-512.png', width: 512, height: 512, alt: `${brand} filters` }],
        },
    }
}

export default async function TruckLandingPage({ params }: Props) {
    const { brand: slug } = await params
    const brand = truckSlugToBrand(slug)
    if (!brand) notFound()

    const products = await getProductsByTruckBrand(brand)
    const copy = brandCopy[brand]
    const pageUrl = `${BASE_URL}/trucks/${slug}`
    const crumbs = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: `${brand} Filters` },
    ]

    const collectionJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: copy.seoTitle,
        description: copy.seoDescription,
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
                    <h1 className="landing-header__title">{brand} Semi Truck Filters</h1>
                    <p className="landing-header__intro">{copy.intro}</p>
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
                        No products tagged for {brand} yet.{' '}
                        <Link href="/shop">Browse the full shop</Link>.
                    </p>
                )}

                <p className="landing-footer-links">
                    <Link href={`/trucks/${slug}/oil-filters`}>Oil Filters</Link>
                    {' · '}
                    <Link href={`/trucks/${slug}/air-filters`}>Air Filters</Link>
                    {' · '}
                    <Link href={`/trucks/${slug}/fuel-filters`}>Fuel Filters</Link>
                    {' · '}
                    <Link href="/guides">Maintenance Guides</Link>
                </p>
            </div>
        </section>
    )
}

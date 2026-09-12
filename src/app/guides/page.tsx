import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getGuides } from '@/sanity/lib/fetch'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import { BASE_URL, breadcrumbJsonLd } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = {
    title: 'Semi Truck Filter Guides — Fitment, Cross-Refs & Maintenance',
    description:
        'Practical guides for OEM filter cross-referencing, Cascadia/VNL/T680 fitment, Fuel Pro separators, and fleet stocking.',
    alternates: { canonical: `${BASE_URL}/guides` },
}

export default async function GuidesIndexPage() {
    const guides = await getGuides()
    const crumbs = [
        { name: 'Home', href: '/' },
        { name: 'Guides' },
    ]

    const itemListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Semi Truck Filter Guides',
        url: `${BASE_URL}/guides`,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: guides.length,
            itemListElement: guides.map((g, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${BASE_URL}/guides/${g.slug.current}`,
                name: g.title,
            })),
        },
    }

    return (
        <section className="section">
            <JsonLd data={breadcrumbJsonLd(crumbs)} />
            <JsonLd data={itemListJsonLd} />
            <div className="container">
                <Breadcrumbs items={crumbs} />
                <header className="landing-header">
                    <h1 className="landing-header__title">Filter Guides</h1>
                    <p className="landing-header__intro">
                        Citeable, practical articles for owner-operators and fleets — cross-references, platform fitment, and stocking strategy.
                    </p>
                </header>

                <div className="guide-card-grid">
                    {guides.map((guide) => (
                        <article key={guide._id} className="guide-card">
                            <h2 className="guide-card__title">
                                <Link href={`/guides/${guide.slug.current}`}>{guide.title}</Link>
                            </h2>
                            {guide.excerpt ? <p className="guide-card__excerpt">{guide.excerpt}</p> : null}
                            <Link href={`/guides/${guide.slug.current}`} className="guide-card__cta">
                                Read guide →
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

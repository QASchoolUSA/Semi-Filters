import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getGuideBySlug, getGuides } from '@/sanity/lib/fetch'
import Breadcrumbs from '@/components/Breadcrumbs'
import FaqSection from '@/components/FaqSection'
import JsonLd from '@/components/JsonLd'
import {
    BASE_URL,
    breadcrumbJsonLd,
    faqPageJsonLd,
    portableTextToPlain,
    truckBrandToSlug,
} from '@/lib/seo'

export const revalidate = 60

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const guides = await getGuides()
    return guides.map((g) => ({ slug: g.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const guide = await getGuideBySlug(slug)
    if (!guide) return { title: 'Guide Not Found' }

    const title = guide.seoTitle || guide.title
    const description =
        guide.seoDescription ||
        guide.excerpt ||
        portableTextToPlain(guide.body).slice(0, 155)

    return {
        title,
        description,
        alternates: { canonical: `${BASE_URL}/guides/${slug}` },
        openGraph: {
            title: `${title} | Semi Filters`,
            description,
            url: `${BASE_URL}/guides/${slug}`,
            type: 'article',
            images: [{ url: '/icon-512.png', width: 512, height: 512, alt: guide.title }],
        },
    }
}

export default async function GuidePage({ params }: Props) {
    const { slug } = await params
    const guide = await getGuideBySlug(slug)
    if (!guide) notFound()

    const pageUrl = `${BASE_URL}/guides/${slug}`
    const crumbs = [
        { name: 'Home', href: '/' },
        { name: 'Guides', href: '/guides' },
        { name: guide.title },
    ]

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.excerpt || guide.seoDescription,
        datePublished: guide.publishedAt,
        dateModified: guide.publishedAt,
        author: { '@type': 'Organization', name: 'Semi Filters' },
        publisher: {
            '@type': 'Organization',
            name: 'Semi Filters',
            logo: { '@type': 'ImageObject', url: `${BASE_URL}/icon-512.png` },
        },
        mainEntityOfPage: pageUrl,
        url: pageUrl,
    }

    return (
        <section className="section">
            <JsonLd data={breadcrumbJsonLd(crumbs)} />
            <JsonLd data={articleJsonLd} />
            {guide.faqs?.length ? <JsonLd data={faqPageJsonLd(guide.faqs)} /> : null}
            <div className="container guide-layout">
                <Breadcrumbs items={crumbs} />
                <article className="guide-article">
                    <header className="landing-header">
                        <h1 className="landing-header__title">{guide.title}</h1>
                        {guide.excerpt ? <p className="landing-header__intro">{guide.excerpt}</p> : null}
                    </header>

                    {guide.body ? (
                        <div className="portable-text guide-body">
                            <PortableText value={guide.body} />
                        </div>
                    ) : null}

                    {guide.faqs?.length ? <FaqSection faqs={guide.faqs} id="guide-faq" /> : null}

                    {guide.relatedTruckBrands?.length ? (
                        <p className="landing-footer-links">
                            Related trucks:{' '}
                            {guide.relatedTruckBrands.map((brand, i) => (
                                <span key={brand}>
                                    {i > 0 ? ' · ' : ''}
                                    <Link href={`/trucks/${truckBrandToSlug(brand)}`}>{brand}</Link>
                                </span>
                            ))}
                        </p>
                    ) : null}

                    <p className="landing-footer-links">
                        <Link href="/guides">All guides</Link>
                        {' · '}
                        <Link href="/shop">Shop filters</Link>
                        {' · '}
                        <Link href="/faq">FAQ</Link>
                    </p>
                </article>
            </div>
        </section>
    )
}

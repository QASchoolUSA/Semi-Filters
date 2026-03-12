import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

const BASE_URL = 'https://semifilters.com'

interface SanitySlug {
    slug: { current: string }
    _updatedAt: string
}

async function getProductSlugs(): Promise<SanitySlug[]> {
    return client
        .fetch(
            `*[_type == "product"] {
        slug,
        _updatedAt
      }`
        )
        .catch(() => [])
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await getProductSlugs()

    const productUrls: MetadataRoute.Sitemap = products
        .filter((p) => p.slug?.current)
        .map((p) => ({
            url: `${BASE_URL}/shop/${p.slug.current}`,
            lastModified: new Date(p._updatedAt),
            changeFrequency: 'weekly',
            priority: 0.8,
        }))

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...productUrls,
    ]
}

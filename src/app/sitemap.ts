import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { BASE_URL, TRUCK_BRANDS, truckBrandToSlug } from '@/lib/seo'

type SlugDoc = {
    slug?: { current?: string | null } | null
    _updatedAt?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [products, categories, guides] = await Promise.all([
        client
            .fetch<SlugDoc[]>(
                `*[_type == "product" && published != false && defined(slug.current)]{ slug, _updatedAt }`
            )
            .catch(() => [] as SlugDoc[]),
        client
            .fetch<SlugDoc[]>(
                `*[_type == "category" && defined(slug.current)]{ slug, _updatedAt }`
            )
            .catch(() => [] as SlugDoc[]),
        client
            .fetch<SlugDoc[]>(
                `*[_type == "guide" && published != false && defined(slug.current)]{ slug, _updatedAt }`
            )
            .catch(() => [] as SlugDoc[]),
    ])

    const productUrls: MetadataRoute.Sitemap = products
        .filter((p) => p.slug?.current)
        .map((p) => ({
            url: `${BASE_URL}/shop/${p.slug!.current}`,
            lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))

    const categoryUrls: MetadataRoute.Sitemap = categories
        .filter((c) => c.slug?.current)
        .map((c) => ({
            url: `${BASE_URL}/filters/${c.slug!.current}`,
            lastModified: c._updatedAt ? new Date(c._updatedAt) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.75,
        }))

    const guideUrls: MetadataRoute.Sitemap = guides
        .filter((g) => g.slug?.current)
        .map((g) => ({
            url: `${BASE_URL}/guides/${g.slug!.current}`,
            lastModified: g._updatedAt ? new Date(g._updatedAt) : new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }))

    const truckUrls: MetadataRoute.Sitemap = TRUCK_BRANDS.map((brand) => ({
        url: `${BASE_URL}/trucks/${truckBrandToSlug(brand)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
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
        ...categoryUrls,
        ...truckUrls,
        {
            url: `${BASE_URL}/guides`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        ...guideUrls,
        {
            url: `${BASE_URL}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.65,
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
        {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...productUrls,
    ]
}

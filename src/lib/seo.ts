export const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://semifilters.com'

export const TRUCK_BRANDS = [
    'Volvo',
    'Freightliner',
    'Kenworth',
    'Peterbilt',
    'Mack',
    'International',
    'Western Star',
    'DAF',
] as const

export type TruckBrand = (typeof TRUCK_BRANDS)[number]

export function truckBrandToSlug(brand: string): string {
    return brand.trim().toLowerCase().replace(/\s+/g, '-')
}

export function truckSlugToBrand(slug: string): string | null {
    const normalized = slug.trim().toLowerCase()
    const match = TRUCK_BRANDS.find((b) => truckBrandToSlug(b) === normalized)
    return match ?? null
}

export interface BreadcrumbItem {
    name: string
    href?: string
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            ...(item.href ? { item: item.href.startsWith('http') ? item.href : `${BASE_URL}${item.href}` } : {}),
        })),
    }
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    }
}

export function portableTextToPlain(blocks: unknown): string {
    if (!Array.isArray(blocks)) return ''
    return blocks
        .filter((b: Record<string, unknown>) => b._type === 'block' && Array.isArray(b.children))
        .map((b: Record<string, unknown>) =>
            (b.children as { text?: string }[]).map((c) => c.text || '').join('')
        )
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
}

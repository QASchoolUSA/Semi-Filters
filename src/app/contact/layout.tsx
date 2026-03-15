import type { Metadata } from 'next'

const BASE_URL = 'https://semifilters.com'

export const metadata: Metadata = {
    title: 'Contact Us — Semi Filters',
    description: 'Get in touch with Semi Filters. Questions about orders, products, or fleet pricing? Call or email our team of diesel specialists. Mon–Fri 7AM–6PM CST.',
    alternates: {
        canonical: `${BASE_URL}/contact`,
    },
    openGraph: {
        title: 'Contact Semi Filters',
        description: 'Questions about semi truck filters, orders, or fleet pricing? Our diesel specialists are ready to help.',
        url: `${BASE_URL}/contact`,
        images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'Contact Semi Filters' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Semi Filters',
        description: 'Questions about semi truck filters or fleet pricing? Get in touch with our team.',
        images: ['/icon-512.png'],
    },
}

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Contact', item: `${BASE_URL}/contact` },
    ],
}

const contactPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Semi Filters',
    description: 'Get in touch with our team of diesel specialists for questions about semi truck filters, orders, or fleet pricing.',
    url: `${BASE_URL}/contact`,
    mainEntity: {
        '@type': 'Organization',
        name: 'Semi Filters',
        telephone: '+1-407-768-1488',
        email: 'support@semifilters.com',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Sanford',
            addressRegion: 'FL',
            postalCode: '32771',
            addressCountry: 'US',
        },
    },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
            />
            {children}
        </>
    )
}

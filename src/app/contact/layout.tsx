import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Us — Semi Filters',
    description: 'Get in touch with Semi Filters. Questions about orders, products, or fleet pricing? Call or email our team of diesel specialists. Mon–Fri 7AM–6PM CST.',
    alternates: {
        canonical: 'https://semifilters.com/contact',
    },
    openGraph: {
        title: 'Contact Semi Filters',
        description: 'Questions about semi truck filters, orders, or fleet pricing? Our diesel specialists are ready to help.',
        url: 'https://semifilters.com/contact',
        images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'Contact Semi Filters' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Semi Filters',
        description: 'Questions about semi truck filters or fleet pricing? Get in touch with our team.',
        images: ['/icon-512.png'],
    },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children
}

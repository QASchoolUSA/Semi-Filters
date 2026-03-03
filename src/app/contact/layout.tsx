import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Us — Semi Filters',
    description: 'Get in touch with Semi Filters. Questions about orders, products, or fleet pricing? We\'re here to help.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children
}

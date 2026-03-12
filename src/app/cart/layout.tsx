import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Your Cart — Semi Filters',
    description: 'Review your selected semi truck filters and proceed to checkout.',
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: 'https://semifilters.com/cart',
    },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return children
}

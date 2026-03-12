import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Order Confirmed — Semi Filters',
    description: 'Your order has been confirmed. Thank you for shopping with Semi Filters.',
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: 'https://semifilters.com/success',
    },
}

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
    return children
}

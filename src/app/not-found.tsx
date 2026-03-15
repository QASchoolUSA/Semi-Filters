import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Page Not Found — Semi Filters',
    robots: {
        index: false,
        follow: true,
    },
}

export default function NotFound() {
    return (
        <>
            <div className="page-header">
                <h1>Page Not Found</h1>
                <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            </div>
            <div className="cart-empty">
                <div className="cart-empty-icon">🔍</div>
                <h2>404</h2>
                <p>Let&apos;s get you back on track.</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <Link href="/" className="btn btn-primary">
                        Go Home
                    </Link>
                    <Link href="/shop" className="btn btn-outline">
                        Browse Products
                    </Link>
                </div>
            </div>
        </>
    )
}

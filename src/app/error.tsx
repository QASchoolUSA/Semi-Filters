'use client'

import React from 'react'
import Link from 'next/link'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="cart-empty" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="cart-empty-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>We encountered an unexpected error. Please try again.</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button className="btn btn-primary" onClick={reset}>
                    Try Again
                </button>
                <Link href="/" className="btn btn-outline">
                    Go Home
                </Link>
            </div>
        </div>
    )
}

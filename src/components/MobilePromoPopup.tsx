'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'promoPopupDismissed'

export default function MobilePromoPopup() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Only show on mobile screens
        if (window.innerWidth > 768) return
        // Only show once per session
        if (sessionStorage.getItem(STORAGE_KEY)) return

        // Delay slightly so page renders first
        const timer = setTimeout(() => setVisible(true), 1500)
        return () => clearTimeout(timer)
    }, [])

    const dismiss = () => {
        sessionStorage.setItem(STORAGE_KEY, '1')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <>
            {/* Backdrop */}
            <div className="promo-popup-backdrop" onClick={dismiss} />

            {/* Popup */}
            <div className="promo-popup" role="dialog" aria-modal="true" aria-label="First order discount">
                {/* Close */}
                <button className="promo-popup__close" onClick={dismiss} aria-label="Close">✕</button>

                {/* Decorative number */}
                <div className="promo-popup__big-number">15<span>%</span></div>

                <div className="promo-popup__badge">🎉 New Customer Offer</div>
                <h2 className="promo-popup__title">Exclusive Discount</h2>
                <p className="promo-popup__desc">
                    Save <strong>15%</strong> on your first order. Premium quality, fleet-proven filters.
                </p>

                <div className="promo-popup__code-label">Use code at checkout</div>
                <div className="promo-popup__code">FIRST15</div>

                <Link href="/shop" className="btn btn-primary promo-popup__cta" onClick={dismiss}>
                    Claim Discount →
                </Link>

                <p className="promo-popup__fine">Valid for new customers only · One use per account</p>
            </div>
        </>
    )
}

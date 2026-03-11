'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { HiCheckCircle, HiOutlineShoppingBag } from 'react-icons/hi'

function SuccessContent() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const { clearCart } = useCart()
    const [cleared, setCleared] = useState(false)

    useEffect(() => {
        // Clear the cart once we reach the success page
        if (sessionId && !cleared) {
            clearCart()
            setCleared(true)
        }
    }, [sessionId, cleared, clearCart])

    return (
        <div className="section">
            <div className="container" style={{ maxWidth: '600px', textAlign: 'center', margin: '0 auto', padding: '60px 20px' }}>
                <HiCheckCircle size={80} color="var(--color-primary)" style={{ margin: '0 auto 20px' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Order Confirmed!</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', marginBottom: '32px' }}>
                    Thank you for your purchase. We have received your order and are getting it ready to be shipped. 
                    You will receive an email confirmation shortly.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="/products" className="btn btn-primary btn-lg">
                        <HiOutlineShoppingBag size={20} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}

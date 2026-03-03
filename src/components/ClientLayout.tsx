'use client'

import React from 'react'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#1a1a26',
                        color: '#f0f0f5',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                    },
                }}
            />
            <Navbar />
            <main>{children}</main>
            <Footer />
        </CartProvider>
    )
}

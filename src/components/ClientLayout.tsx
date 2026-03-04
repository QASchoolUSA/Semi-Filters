'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isStudio = pathname.startsWith('/studio')

    // Sanity Studio needs full control of the page — skip site chrome
    if (isStudio) {
        return <>{children}</>
    }

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
            <CartDrawer />
            <Navbar />
            <main>{children}</main>
            <Footer />
        </CartProvider>
    )
}



'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { HiOutlineHome, HiOutlineCollection, HiOutlineSearch, HiOutlineShoppingBag } from 'react-icons/hi'
import SearchOverlay from '@/components/SearchOverlay'

export default function MobileTabBar() {
    const pathname = usePathname()
    const { totalItems, openCart } = useCart()
    const [searchOpen, setSearchOpen] = useState(false)

    const navItems = [
        { href: '/', label: 'Home', icon: HiOutlineHome },
        { href: '/shop', label: 'Shop', icon: HiOutlineCollection },
    ]

    return (
        <>
            <div className="mobile-tab-bar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`tab-bar-item ${isActive ? 'tab-bar-item-active' : ''}`}
                        >
                            <div className="tab-bar-icon-wrapper">
                                <Icon size={24} />
                            </div>
                            <span className="tab-bar-label">{item.label}</span>
                        </Link>
                    )
                })}

                <button
                    className="tab-bar-item"
                    onClick={() => setSearchOpen(true)}
                    aria-label="Search products"
                >
                    <div className="tab-bar-icon-wrapper">
                        <HiOutlineSearch size={24} />
                    </div>
                    <span className="tab-bar-label">Search</span>
                </button>

                <button
                    className="tab-bar-item"
                    onClick={openCart}
                    aria-label="Open Cart"
                >
                    <div className="tab-bar-icon-wrapper">
                        <HiOutlineShoppingBag size={24} />
                        {totalItems > 0 && (
                            <span className="tab-bar-badge">{totalItems}</span>
                        )}
                    </div>
                    <span className="tab-bar-label">Cart</span>
                </button>
            </div>

            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    )
}

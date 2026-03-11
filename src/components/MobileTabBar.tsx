'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { HiOutlineHome, HiOutlineCollection, HiOutlineChatAlt, HiOutlineShoppingBag } from 'react-icons/hi'

export default function MobileTabBar() {
    const pathname = usePathname()
    const { totalItems, openCart } = useCart()

    const navItems = [
        { href: '/', label: 'Home', icon: HiOutlineHome },
        { href: '/shop', label: 'Shop', icon: HiOutlineCollection },
        { href: '/contact', label: 'Contact', icon: HiOutlineChatAlt },
    ]

    return (
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
    )
}

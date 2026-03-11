'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { HiOutlineShoppingBag, HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import ThemeToggle from '@/components/ThemeToggle'

export default function Navbar() {
    const { totalItems, openCart } = useCart()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileMenuOpen])

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ]

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link href="/" className="navbar-logo">
                    <div className="logo-icon">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
                            <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                            <circle cx="16" cy="16" r="5" fill="currentColor" />
                        </svg>
                    </div>
                    <span className="logo-text">
                        SEMI<span className="logo-accent">FILTERS</span>
                    </span>
                </Link>

                <div className="navbar-links-desktop">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${pathname === link.href ? 'nav-link-active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="navbar-actions">
                    <ThemeToggle />
                    <button className="cart-button" onClick={openCart} aria-label="Open cart">
                        <HiOutlineShoppingBag size={24} />
                        {totalItems > 0 && (
                            <span className="cart-badge">{totalItems}</span>
                        )}
                    </button>

                    <div className="mobile-menu-toggle" style={{ display: 'none' }}>
                        {/* Hidden on mobile because MobileTabBar handles navigation */}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`mobile-menu-backdrop ${mobileMenuOpen ? 'mobile-menu-backdrop-visible' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
                <div className="mobile-menu-inner">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`mobile-nav-link ${pathname === link.href ? 'mobile-nav-link-active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button
                        className="mobile-nav-link mobile-cart-link"
                        onClick={() => { setMobileMenuOpen(false); openCart() }}
                    >
                        <HiOutlineShoppingBag size={20} />
                        Cart {totalItems > 0 && <span className="mobile-cart-count">({totalItems})</span>}
                    </button>
                </div>
            </div>
        </nav>
    )
}

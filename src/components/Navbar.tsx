'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { HiOutlineShoppingBag, HiOutlineMenu, HiOutlineX } from 'react-icons/hi'

export default function Navbar() {
    const { totalItems } = useCart()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Products' },
        { href: '/categories', label: 'Categories' },
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
                        <Link key={link.href} href={link.href} className="nav-link">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="navbar-actions">
                    <Link href="/cart" className="cart-button">
                        <HiOutlineShoppingBag size={24} />
                        {totalItems > 0 && (
                            <span className="cart-badge">{totalItems}</span>
                        )}
                    </Link>

                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="mobile-nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    )
}

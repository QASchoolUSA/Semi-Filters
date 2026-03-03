import React from 'react'
import Link from 'next/link'
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-section">
                        <Link href="/" className="footer-logo">
                            <div className="logo-icon">
                                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                                    <circle cx="16" cy="16" r="5" fill="currentColor" />
                                </svg>
                            </div>
                            <span className="logo-text">
                                SEMI<span className="logo-accent">FILTERS</span>
                            </span>
                        </Link>
                        <p className="footer-description">
                            Premium filtration solutions for semi trucks. Keeping your fleet running clean and efficient since 2020.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3 className="footer-heading">Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link href="/products">All Products</Link></li>
                            <li><Link href="/categories">Categories</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="footer-section">
                        <h3 className="footer-heading">Filter Types</h3>
                        <ul className="footer-links">
                            <li><Link href="/categories/oil-filters">Oil Filters</Link></li>
                            <li><Link href="/categories/air-filters">Air Filters</Link></li>
                            <li><Link href="/categories/fuel-filters">Fuel Filters</Link></li>
                            <li><Link href="/categories/cabin-filters">Cabin Filters</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-section">
                        <h3 className="footer-heading">Contact Us</h3>
                        <ul className="footer-contact">
                            <li>
                                <HiOutlinePhone size={18} />
                                <span>(555) 123-4567</span>
                            </li>
                            <li>
                                <HiOutlineMail size={18} />
                                <span>contact@semifilters.com</span>
                            </li>
                            <li>
                                <HiOutlineLocationMarker size={18} />
                                <span>Sanford, FL 32771</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Semi Filters. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

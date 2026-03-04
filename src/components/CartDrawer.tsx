'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { urlFor } from '@/sanity/lib/image'
import { HiOutlineX, HiOutlineShoppingBag, HiOutlineTrash } from 'react-icons/hi'

export default function CartDrawer() {
    const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart, isCartOpen, closeCart } = useCart()

    const shipping = totalPrice >= 150 ? 0 : 12.99
    const grandTotal = totalPrice + shipping

    return (
        <>
            {/* Backdrop */}
            <div
                className={`cart-drawer-backdrop ${isCartOpen ? 'cart-drawer-backdrop-visible' : ''}`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className={`cart-drawer ${isCartOpen ? 'cart-drawer-open' : ''}`} style={isCartOpen ? { backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'rgba(18, 18, 26, 0.95)' } : {}}>
                {/* Header */}
                <div className="cart-drawer-header">
                    <h2 className="cart-drawer-title">
                        <HiOutlineShoppingBag size={22} />
                        Cart ({totalItems})
                    </h2>
                    <button className="cart-drawer-close" onClick={closeCart} aria-label="Close cart">
                        <HiOutlineX size={24} />
                    </button>
                </div>

                {/* Content */}
                {items.length === 0 ? (
                    <div className="cart-drawer-empty">
                        <div className="cart-drawer-empty-icon">🛒</div>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Your cart is empty</p>
                        <Link href="/products" className="btn btn-primary btn-lg" onClick={closeCart}>
                            Shop Filters
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Items */}
                        <div className="cart-drawer-items">
                            {items.map((item) => (
                                <div key={item._id} className="cart-drawer-item">
                                    <div className="cart-drawer-item-image">
                                        {item.image ? (
                                            <Image
                                                src={urlFor(item.image).width(120).height(120).url()}
                                                alt={item.name}
                                                width={120}
                                                height={120}
                                            />
                                        ) : (
                                            <div className="product-card-placeholder" style={{ width: '100%', height: '100%' }}>
                                                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                                                    <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.15" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="cart-drawer-item-details">
                                        <Link href={`/products/${item.slug}`} onClick={closeCart}>
                                            <h4 className="cart-drawer-item-name">{item.name}</h4>
                                        </Link>
                                        {item.partNumber && (
                                            <span className="cart-drawer-item-part">Part# {item.partNumber}</span>
                                        )}
                                        <div className="cart-drawer-item-row">
                                            <div className="cart-drawer-qty">
                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                                            </div>
                                            <span className="cart-drawer-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <button className="cart-drawer-item-remove" onClick={() => removeFromCart(item._id)} aria-label="Remove item">
                                        <HiOutlineTrash size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="cart-drawer-footer">
                            <div className="cart-drawer-summary-row">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="cart-drawer-summary-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            {shipping > 0 && (
                                <p className="cart-drawer-shipping-note">
                                    Add ${(150 - totalPrice).toFixed(2)} more for FREE shipping!
                                </p>
                            )}
                            <div className="cart-drawer-summary-row cart-drawer-total">
                                <span>Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </div>
                            <button className="btn btn-primary btn-lg cart-drawer-checkout-btn">
                                Checkout
                            </button>
                            <Link
                                href="/cart"
                                className="btn btn-outline cart-drawer-view-cart-btn"
                                onClick={closeCart}
                            >
                                View Full Cart
                            </Link>
                            <button
                                className="cart-drawer-clear"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

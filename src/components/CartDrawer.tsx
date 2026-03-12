'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { urlFor } from '@/sanity/lib/image'
import { HiOutlineX, HiOutlineShoppingBag, HiOutlineTrash, HiOutlineArrowRight } from 'react-icons/hi'

export default function CartDrawer() {
    const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart, isCartOpen, closeCart } = useCart()
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    // $5.99 base + $1 for each additional item beyond the first
    const itemQuantityCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const shipping = itemQuantityCount > 0 ? 5.99 + Math.max(0, itemQuantityCount - 1) * 1.00 : 0
    const grandTotal = totalPrice + shipping

    // Close drawer on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isCartOpen) closeCart()
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isCartOpen, closeCart])

    const handleCheckout = async () => {
        try {
            setIsCheckingOut(true)
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items }),
            })

            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                console.error(data.error)
                alert('Failed to initialize checkout.')
            }
        } catch (error) {
            console.error('Error during checkout', error)
            alert('Something went wrong during checkout.')
        } finally {
            setIsCheckingOut(false)
        }
    }

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className={`cart-overlay ${isCartOpen ? 'cart-overlay--visible' : ''}`}
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer panel */}
            <aside
                className={`cart-panel ${isCartOpen ? 'cart-panel--open' : ''}`}
                role="dialog"
                aria-label="Shopping cart"
                aria-modal="true"
            >
                {/* ─── Header ─── */}
                <header className="cart-panel__header">
                    <h2 className="cart-panel__title">
                        <HiOutlineShoppingBag size={22} />
                        <span>Cart</span>
                        {totalItems > 0 && (
                            <span className="cart-panel__count">{totalItems}</span>
                        )}
                    </h2>
                    <button
                        className="cart-panel__close"
                        onClick={closeCart}
                        aria-label="Close cart"
                    >
                        <HiOutlineX size={22} />
                    </button>
                </header>

                {/* ─── Empty State ─── */}
                {items.length === 0 ? (
                    <div className="cart-panel__empty">
                        <div className="cart-panel__empty-icon">
                            <HiOutlineShoppingBag size={56} />
                        </div>
                        <h3>Your cart is empty</h3>
                        <p>Discover our premium filter selection</p>
                        <Link
                            href="/shop"
                            className="btn btn-primary"
                            onClick={closeCart}
                        >
                            Browse Products
                            <HiOutlineArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* ─── Shipping Info ─── */}
                        <div className="cart-panel__shipping-bar">
                            <p>🚚 Shipping: <strong>${shipping.toFixed(2)}</strong></p>
                        </div>

                        {/* ─── Items List ─── */}
                        <div className="cart-panel__items">
                            {items.map((item) => (
                                <div key={item._id} className="cart-item-card">
                                    <div className="cart-item-card__image">
                                        {item.image ? (
                                            <Image
                                                src={urlFor(item.image).width(120).height(120).url()}
                                                alt={item.name}
                                                width={120}
                                                height={120}
                                            />
                                        ) : (
                                            <div className="cart-item-card__placeholder">
                                                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                                                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                                                    <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.15" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="cart-item-card__body">
                                        <Link href={`/shop/${item.slug}`} onClick={closeCart}>
                                            <h4 className="cart-item-card__name">{item.name}</h4>
                                        </Link>
                                        {item.partNumber && (
                                            <span className="cart-item-card__part">#{item.partNumber}</span>
                                        )}
                                        <div className="cart-item-card__controls">
                                            <div className="cart-item-card__qty">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="cart-item-card__price">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="cart-item-card__remove"
                                        onClick={() => removeFromCart(item._id)}
                                        aria-label={`Remove ${item.name}`}
                                    >
                                        <HiOutlineTrash size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* ─── Footer / Summary ─── */}
                        <footer className="cart-panel__footer">
                            <div className="cart-panel__summary">
                                <div className="cart-panel__row">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="cart-panel__row">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'cart-panel__free-tag' : ''}>
                                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="cart-panel__row cart-panel__row--total">
                                    <span>Total</span>
                                    <span>${grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                className="btn btn-primary cart-panel__checkout-btn"
                                onClick={handleCheckout}
                                disabled={isCheckingOut || items.length === 0}
                            >
                                {isCheckingOut ? 'Processing...' : `Checkout — $${grandTotal.toFixed(2)}`}
                            </button>

                            <Link
                                href="/cart"
                                className="cart-panel__view-cart"
                                onClick={closeCart}
                            >
                                View Full Cart
                            </Link>

                            <button
                                className="cart-panel__clear"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>
                        </footer>
                    </>
                )}
            </aside>
        </>
    )
}

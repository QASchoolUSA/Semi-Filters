'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { urlFor } from '@/sanity/lib/image'
import { HiOutlineShoppingBag } from 'react-icons/hi'

export default function CartPage() {
    const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart()
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    if (items.length === 0) {
        return (
            <>
                <div className="page-header">
                    <h1>Shopping Cart</h1>
                    <p>Your cart is empty</p>
                </div>
                <section className="section">
                    <div className="container">
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🛒</div>
                            <h2>Your Cart is Empty</h2>
                            <p>Looks like you haven&apos;t added any filters yet. Start browsing our catalog.</p>
                            <Link href="/shop" className="btn btn-primary btn-lg">
                                <HiOutlineShoppingBag size={20} />
                                Shop Filters
                            </Link>
                        </div>
                    </div>
                </section>
            </>
        )
    }

    // $5.99 base + $1 for each additional item beyond the first
    const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const shipping = totalItemCount > 0 ? 5.99 + Math.max(0, totalItemCount - 1) * 1.00 : 0
    const grandTotal = totalPrice + shipping

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
                setIsCheckingOut(false)
                alert('Failed to initialize checkout.')
            }
        } catch (error) {
            console.error('Error during checkout', error)
            setIsCheckingOut(false)
            alert('Something went wrong during checkout.')
        }
    }

    return (
        <>
            {/* Fullscreen checkout redirect overlay */}
            {isCheckingOut && (
                <div className="checkout-overlay">
                    <div className="checkout-overlay__content">
                        <div className="checkout-overlay__spinner" />
                        <div className="checkout-overlay__lock">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h2 className="checkout-overlay__title">Redirecting to Secure Checkout</h2>
                        <p className="checkout-overlay__text">
                            You&apos;re being redirected to Stripe for safe and secure payment. Please don&apos;t close this page.
                        </p>
                        <div className="checkout-overlay__stripe">
                            <span>Powered by</span>
                            <svg width="50" height="21" viewBox="0 0 50 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.8 8.4C3.8 7.8 4.3 7.5 5.1 7.5C6.2 7.5 7.6 7.9 8.7 8.5V5.3C7.5 4.8 6.3 4.6 5.1 4.6C2.1 4.6 0.2 6.1 0.2 8.6C0.2 12.4 5.5 11.8 5.5 13.5C5.5 14.2 4.9 14.5 4 14.5C2.8 14.5 1.3 14 0.1 13.3V16.6C1.4 17.2 2.7 17.4 4 17.4C7.1 17.4 9.1 16 9.1 13.4C9.1 9.3 3.8 10 3.8 8.4ZM13.4 2.2L10 3V5.2L13.4 4.5V2.2ZM10 5.1V17.2H13.4V5.1H10ZM18.4 6.5L18.2 5.1H15.2V17.2H18.6V8.5C19.4 7.4 20.8 7.2 21.3 7.2V4.6C20.1 4.6 19 5.2 18.4 6.5ZM22.2 5.1H25.6V17.2H22.2V5.1ZM25.8 2.9C25.8 1.8 24.9 1 23.9 1C22.9 1 22 1.8 22 2.9C22 4 22.9 4.8 23.9 4.8C24.9 4.8 25.8 4 25.8 2.9ZM35 4.6C33.8 4.6 33 5.2 32.5 5.6L32.3 4.8H28.9V21L32.3 20.3V17.1C32.8 17.4 33.6 17.8 34.7 17.8C37.3 17.8 39.6 15.7 39.6 11.1C39.6 6.9 37.2 4.6 35 4.6ZM34.1 14.6C33.4 14.6 33 14.4 32.6 14.1V8.8C33 8.4 33.5 8.2 34.1 8.2C35.4 8.2 36.2 9.5 36.2 11.4C36.2 13.3 35.4 14.6 34.1 14.6ZM49.8 11.2C49.8 7.4 48 4.6 44.6 4.6C41.2 4.6 39 7.4 39 11.2C39 15.7 41.6 17.8 45.1 17.8C46.8 17.8 48.1 17.4 49 16.9V14.2C48.1 14.6 47.1 14.9 45.8 14.9C44.5 14.9 43.4 14.4 43.2 12.9H49.7C49.7 12.7 49.8 11.7 49.8 11.2ZM43.1 10.3C43.1 8.9 43.9 8.2 44.6 8.2C45.3 8.2 46 8.9 46 10.3H43.1Z" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            <div className="page-header">
                <h1>Shopping Cart</h1>
                <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
            </div>
            <section className="section">
                <div className="container">
                    <div className="cart-layout">
                        {/* Cart Items */}
                        <div className="cart-items">
                            {items.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <div className="cart-item-image">
                                        {item.image ? (
                                            <Image 
                                                src={urlFor(item.image).width(200).height(200).url()} 
                                                alt={item.name}
                                                width={200}
                                                height={200}
                                            />
                                        ) : (
                                            <div className="product-card-placeholder" style={{ width: '100%', height: '100%' }}>
                                                <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                                                    <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.15" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="cart-item-info">
                                        <Link href={`/shop/${item.slug}`}>
                                            <h3 className="cart-item-name">{item.name}</h3>
                                        </Link>
                                        {item.partNumber && (
                                            <p className="cart-item-part">Part# {item.partNumber}</p>
                                        )}
                                        <div className="quantity-selector" style={{ marginBottom: 0 }}>
                                            <button className="quantity-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button className="quantity-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                        </div>
                                        <div className="cart-item-bottom" style={{ marginTop: '12px' }}>
                                            <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                            <button className="cart-item-remove" onClick={() => removeFromCart(item._id)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={clearCart}
                                style={{ alignSelf: 'flex-start' }}
                            >
                                Clear Cart
                            </button>
                        </div>

                        {/* Summary */}
                        <div className="cart-summary">
                            <h2>Order Summary</h2>
                            <div className="cart-summary-row">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>

                            <div className="cart-summary-row total">
                                <span>Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </div>
                            <button 
                                className="btn btn-primary btn-lg"
                                onClick={handleCheckout}
                                disabled={isCheckingOut || items.length === 0}
                            >
                                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                            </button>
                            <Link
                                href="/shop"
                                className="btn btn-outline"
                                style={{ width: '100%', marginTop: '8px' }}
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

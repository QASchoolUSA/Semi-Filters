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

    const shipping = totalPrice >= 150 ? 0 : 12.99
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
                                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            {shipping > 0 && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginTop: '8px' }}>
                                    Add ${(150 - totalPrice).toFixed(2)} more for FREE shipping!
                                </p>
                            )}
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

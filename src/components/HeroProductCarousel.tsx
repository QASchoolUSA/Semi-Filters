'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { useCart } from '@/context/CartContext'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import type { Product } from '@/types'

interface HeroProductCarouselProps {
    products: Product[]
}

export default function HeroProductCarousel({ products }: HeroProductCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const { addToCart } = useCart()

    const checkScroll = useCallback(() => {
        const el = scrollRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 4)
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    }, [])

    useEffect(() => {
        checkScroll()
        const el = scrollRef.current
        if (!el) return
        el.addEventListener('scroll', checkScroll, { passive: true })
        window.addEventListener('resize', checkScroll)
        return () => {
            el.removeEventListener('scroll', checkScroll)
            window.removeEventListener('resize', checkScroll)
        }
    }, [checkScroll])

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollRef.current
        if (!el) return
        const amount = el.clientWidth * 0.65
        el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
    }

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart({
            _id: product._id,
            name: product.name,
            slug: product.slug.current,
            price: product.price,
            quantity: 1,
            image: product.images?.[0],
            partNumber: product.partNumber,
        })
    }

    if (!products || products.length === 0) return null

    const displayProducts = products.slice(0, 8)

    return (
        <div className="hero-products-strip">
            <div className="hero-products-header">
                <span className="hero-products-label">Trending Now</span>
                <Link href="/shop" className="hero-products-see-all">
                    View All →
                </Link>
            </div>

            <div className="hero-carousel-wrapper">
                {canScrollLeft && (
                    <button
                        className="hero-carousel-arrow hero-carousel-arrow--left"
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>
                )}

                <div className="hero-carousel" ref={scrollRef}>
                    {displayProducts.map((product) => {
                        const discount = product.compareAtPrice
                            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                            : 0

                        return (
                            <Link
                                key={product._id}
                                href={`/shop/${product.slug.current}`}
                                className="hero-product-card"
                            >
                                <div className="hero-product-card__image">
                                    {product.images?.[0] ? (
                                        <Image
                                            src={urlFor(product.images[0]).width(240).height(240).fit('max').url()}
                                            alt={product.name}
                                            width={240}
                                            height={240}
                                            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                        />
                                    ) : (
                                        <div className="hero-product-card__placeholder">
                                            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                                                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                                                <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.2" />
                                            </svg>
                                        </div>
                                    )}
                                    {discount > 0 && (
                                        <span className="hero-product-card__badge">-{discount}%</span>
                                    )}
                                    {product.inStock !== false && (
                                        <button
                                            className="hero-product-card__add"
                                            onClick={(e) => handleAddToCart(e, product)}
                                            aria-label={`Add ${product.name} to cart`}
                                        >
                                            <HiOutlineShoppingCart size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="hero-product-card__info">
                                    {product.category && (
                                        <span className="hero-product-card__category">{product.category.name}</span>
                                    )}
                                    <span className="hero-product-card__name">{product.name}</span>
                                    <div className="hero-product-card__pricing">
                                        <span className="hero-product-card__price">${product.price.toFixed(2)}</span>
                                        {product.compareAtPrice && (
                                            <span className="hero-product-card__compare">${product.compareAtPrice.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {canScrollRight && (
                    <button
                        className="hero-carousel-arrow hero-carousel-arrow--right"
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        ›
                    </button>
                )}
            </div>
        </div>
    )
}

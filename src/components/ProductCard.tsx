'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { useCart } from '@/context/CartContext'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import type { Product } from '@/types'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart()

    const handleAddToCart = (e: React.MouseEvent) => {
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

    const discount = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0

    return (
        <div className="product-card">
            <Link href={`/products/${product.slug.current}`} className="product-card-link">
                <div className="product-card-image-wrapper">
                    {product.images?.[0] ? (
                        <Image
                            src={urlFor(product.images[0]).width(400).height(400).url()}
                            alt={product.name}
                            className="product-card-image"
                            width={400}
                            height={400}
                        />
                    ) : (
                        <div className="product-card-placeholder">
                            <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                                <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.3" />
                                <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.2" />
                            </svg>
                        </div>
                    )}
                    {discount > 0 && (
                        <span className="product-card-badge">-{discount}%</span>
                    )}
                    {!product.inStock && (
                        <span className="product-card-badge product-card-badge-oos">Out of Stock</span>
                    )}
                </div>
                <div className="product-card-info">
                    {product.category && (
                        <span className="product-card-category">{product.category.name}</span>
                    )}
                    <h3 className="product-card-name">{product.name}</h3>
                    {product.partNumber && (
                        <span className="product-card-part">Part# {product.partNumber}</span>
                    )}
                    <div className="product-card-pricing">
                        <span className="product-card-price">${product.price.toFixed(2)}</span>
                        {product.compareAtPrice && (
                            <span className="product-card-compare">${product.compareAtPrice.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </Link>
            <button
                className="product-card-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock}
            >
                <HiOutlineShoppingCart size={18} />
                {product.inStock ? 'Add to Cart' : 'Sold Out'}
            </button>
        </div>
    )
}

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { useCart } from '@/context/CartContext'
import ProductCard from '@/components/ProductCard'
import { HiOutlineShoppingCart, HiOutlineX, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineZoomIn } from 'react-icons/hi'
import { PortableText } from '@portabletext/react'
import type { Product } from '@/types'

interface ProductDetailClientProps {
    product: Product
    relatedProducts: Product[]
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)

    const imageCount = product.images?.length || 0

    const openLightbox = (index: number) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
    }

    const closeLightbox = useCallback(() => setLightboxOpen(false), [])
    const prevImage = useCallback(() => setLightboxIndex((i) => (i > 0 ? i - 1 : imageCount - 1)), [imageCount])
    const nextImage = useCallback(() => setLightboxIndex((i) => (i < imageCount - 1 ? i + 1 : 0)), [imageCount])

    useEffect(() => {
        if (!lightboxOpen) return
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox()
            if (e.key === 'ArrowLeft') prevImage()
            if (e.key === 'ArrowRight') nextImage()
        }
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleKey)
        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleKey)
        }
    }, [lightboxOpen, closeLightbox, prevImage, nextImage])

    const handleAddToCart = () => {
        addToCart({
            _id: product._id,
            name: product.name,
            slug: product.slug.current,
            price: product.price,
            quantity,
            image: product.images?.[0],
            partNumber: product.partNumber,
        })
    }

    const savings = product.compareAtPrice
        ? (product.compareAtPrice - product.price).toFixed(2)
        : null

    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link href="/">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <Link href="/products">Products</Link>
                {product.category && (
                    <>
                        <span className="breadcrumb-separator">/</span>
                        <Link href={`/categories/${product.category.slug.current}`}>{product.category.name}</Link>
                    </>
                )}
                <span className="breadcrumb-separator">/</span>
                <span>{product.name}</span>
            </div>

            <div className="product-detail">
                {/* Images */}
                <div className="product-detail-images">
                    <div className="product-detail-main-image" onClick={() => openLightbox(selectedImage)} style={{ cursor: 'pointer', position: 'relative' }}>
                        {product.images?.[selectedImage] ? (
                            <>
                                <Image
                                    src={urlFor(product.images[selectedImage]).width(600).height(600).fit('crop').url()}
                                    alt={product.name}
                                    width={600}
                                    height={600}
                                />
                                <div className="lightbox-zoom-hint">
                                    <HiOutlineZoomIn size={22} />
                                </div>
                            </>
                        ) : (
                            <div className="product-card-placeholder" style={{ aspectRatio: '1', height: '100%' }}>
                                <svg width="120" height="120" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                                    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.2" />
                                    <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.15" />
                                </svg>
                            </div>
                        )}
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="product-detail-thumbs">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    className={`product-detail-thumb ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <Image
                                        src={urlFor(img).width(100).height(100).url()}
                                        alt={`${product.name} ${index + 1}`}
                                        width={100}
                                        height={100}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="product-detail-info">
                    {product.category && (
                        <span className="product-detail-category">{product.category.name}</span>
                    )}
                    <h1 className="product-detail-name">{product.name}</h1>
                    {product.partNumber && (
                        <p className="product-detail-part">Part Number: {product.partNumber}</p>
                    )}

                    <div className="product-detail-pricing">
                        <span className="product-detail-price">${product.price.toFixed(2)}</span>
                        {product.compareAtPrice && (
                            <span className="product-detail-compare">${product.compareAtPrice.toFixed(2)}</span>
                        )}
                        {savings && (
                            <span className="product-detail-save">Save ${savings}</span>
                        )}
                    </div>

                    <div className="product-detail-stock">
                        <span className={`stock-indicator ${product.inStock !== false ? 'stock-in' : 'stock-out'}`} />
                        {product.inStock !== false ? 'In Stock — Ready to Ship' : 'Out of Stock'}
                    </div>

                    {product.description && (
                        <div className="product-detail-description portable-text">
                            {typeof product.description === 'string' ? (
                                <p>{product.description}</p>
                            ) : (
                                <PortableText value={product.description} />
                            )}
                        </div>
                    )}

                    {product.details && (
                        <div className="product-detail-more-info portable-text" style={{ marginTop: '20px' }}>
                            <h3 className="product-detail-section-title">Additional Details</h3>
                            {typeof product.details === 'string' ? (
                                <p>{product.details}</p>
                            ) : (
                                <PortableText value={product.details} />
                            )}
                        </div>
                    )}

                    {/* Quantity & Add to Cart */}
                    <div className="quantity-selector">
                        <button className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                        <span className="quantity-value">{quantity}</span>
                        <button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>

                    <div className="product-detail-actions">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleAddToCart}
                            disabled={product.inStock === false}
                        >
                            <HiOutlineShoppingCart size={20} />
                            {product.inStock !== false ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>

                    {/* Specifications */}
                    {product.specifications && product.specifications.length > 0 && (
                        <div>
                            <h3 className="product-detail-section-title">Specifications</h3>
                            <table className="specs-table">
                                <tbody>
                                    {product.specifications.map((spec, index) => (
                                        <tr key={index}>
                                            <th>{spec.label}</th>
                                            <td>{spec.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Compatibility */}
                    {product.compatibility && product.compatibility.length > 0 && (
                        <div className="product-detail-compat">
                            <h3 className="product-detail-section-title">Compatible Trucks</h3>
                            <div className="compatibility-tags">
                                {product.compatibility.map((truck, index) => (
                                    <span key={index} className="compat-tag">{truck}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="product-detail-related">
                    <div className="section-header">
                        <span className="section-label">You May Also Like</span>
                        <h2 className="section-title">Related Products</h2>
                    </div>
                    <div className="product-grid">
                        {relatedProducts.filter((p) => p._id !== product._id).slice(0, 4).map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            )}

            {/* ─── Lightbox Overlay ─── */}
            {lightboxOpen && product.images && product.images.length > 0 && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">
                        <HiOutlineX size={28} />
                    </button>

                    <div className="lightbox-counter">
                        {lightboxIndex + 1} / {imageCount}
                    </div>

                    {imageCount > 1 && (
                        <button className="lightbox-arrow lightbox-arrow--left" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Previous image">
                            <HiOutlineChevronLeft size={32} />
                        </button>
                    )}

                    <div className="lightbox-image-wrap" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={urlFor(product.images![lightboxIndex]).width(1200).height(1200).fit('max').url()}
                            alt={`${product.name} - Image ${lightboxIndex + 1}`}
                            width={1200}
                            height={1200}
                            className="lightbox-image"
                            priority
                        />
                    </div>

                    {imageCount > 1 && (
                        <button className="lightbox-arrow lightbox-arrow--right" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Next image">
                            <HiOutlineChevronRight size={32} />
                        </button>
                    )}

                    {imageCount > 1 && (
                        <div className="lightbox-thumbs" onClick={(e) => e.stopPropagation()}>
                            {product.images!.map((img, i) => (
                                <button
                                    key={i}
                                    className={`lightbox-thumb ${lightboxIndex === i ? 'lightbox-thumb--active' : ''}`}
                                    onClick={() => setLightboxIndex(i)}
                                >
                                    <Image
                                        src={urlFor(img).width(80).height(80).fit('crop').url()}
                                        alt={`Thumbnail ${i + 1}`}
                                        width={80}
                                        height={80}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}



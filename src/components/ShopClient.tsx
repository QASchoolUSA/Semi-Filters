'use client'

import React, { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product, Category } from '@/types'

interface ShopClientProps {
    products: Product[]
    categories: Category[]
    initialCategory?: string
}

export default function ShopClient({ products, categories, initialCategory = 'all' }: ShopClientProps) {
    const displayProducts = products || []
    const displayCategories = categories || []

    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
    const [sortBy, setSortBy] = useState<string>('default')
    const [inStockOnly, setInStockOnly] = useState(false)
    const [showFilters, setShowFilters] = useState(false)

    React.useEffect(() => {
        if (initialCategory) {
            setSelectedCategory(initialCategory)
        }
    }, [initialCategory])

    const filteredProducts = useMemo(() => {
        let filtered = [...displayProducts]

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(
                (p) => p.category?.slug?.current === selectedCategory
            )
        }

        if (inStockOnly) {
            filtered = filtered.filter((p) => p.inStock)
        }

        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price)
                break
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price)
                break
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
        }

        return filtered
    }, [displayProducts, selectedCategory, sortBy, inStockOnly])

    return (
        <div className="shop-layout">
            <div className="shop-results-header">
                <p className="products-count">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <button 
                    className="shop-filters-toggle btn btn-outline btn-sm"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? 'Hide Filters' : 'Filters'}
                    <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ marginLeft: '6px', transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </div>

            <div className={`shop-filters-topbar ${showFilters ? 'mobile-expanded' : ''}`}>
                <div className="shop-filter-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        className="shop-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {displayCategories.map((cat) => (
                            <option key={cat._id} value={cat.slug.current}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="shop-filter-group">
                    <label htmlFor="sort">Sort By</label>
                    <select
                        id="sort"
                        className="shop-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="default">Default</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name">Name: A to Z</option>
                    </select>
                </div>

                <div className="shop-filter-group shop-filter-checkbox">
                    <label className="filter-option">
                        <input
                            type="checkbox"
                            className="filter-checkbox"
                            checked={inStockOnly}
                            onChange={() => setInStockOnly(!inStockOnly)}
                        />
                        In Stock Only
                    </label>
                </div>
            </div>



            <div className="product-grid">
                {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            {filteredProducts.length === 0 && (
                <div className="cart-empty">
                    <h2>No products found</h2>
                    <p>Try adjusting your filters to find what you&apos;re looking for.</p>
                </div>
            )}
        </div>
    )
}

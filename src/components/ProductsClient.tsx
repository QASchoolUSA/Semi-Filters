'use client'

import React, { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product, Category } from '@/types'

interface ProductsClientProps {
    products: Product[]
    categories: Category[]
}

export default function ProductsClient({ products, categories }: ProductsClientProps) {
    const displayProducts = products || []
    const displayCategories = categories || []

    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [sortBy, setSortBy] = useState<string>('default')
    const [inStockOnly, setInStockOnly] = useState(false)

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
        <div className="products-layout">
            <aside className="filters-sidebar">
                <h3>Filters</h3>

                <div className="filter-group">
                    <h4>Category</h4>
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="category"
                            className="filter-checkbox"
                            checked={selectedCategory === 'all'}
                            onChange={() => setSelectedCategory('all')}
                        />
                        All Categories
                    </label>
                    {displayCategories.map((cat) => (
                        <label key={cat._id} className="filter-option">
                            <input
                                type="radio"
                                name="category"
                                className="filter-checkbox"
                                checked={selectedCategory === cat.slug.current}
                                onChange={() => setSelectedCategory(cat.slug.current)}
                            />
                            {cat.name}
                        </label>
                    ))}
                </div>

                <div className="filter-group">
                    <h4>Availability</h4>
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

                <div className="filter-group">
                    <h4>Sort By</h4>
                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="default">Default</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name">Name: A to Z</option>
                    </select>
                </div>
            </aside>

            <div>
                <p className="products-count">
                    Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
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
        </div>
    )
}

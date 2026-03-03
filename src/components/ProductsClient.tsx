'use client'

import React, { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'

interface ProductsClientProps {
    products: any[]
    categories: any[]
}

const DEMO_PRODUCTS = [
    { _id: 'p1', name: 'Heavy Duty Oil Filter - HD-9001', slug: { current: 'hd-oil-filter-9001' }, price: 24.99, compareAtPrice: 34.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'HD-9001', inStock: true, featured: true, images: [] },
    { _id: 'p2', name: 'Premium Air Filter - AF-5500', slug: { current: 'premium-air-filter-5500' }, price: 39.99, category: { name: 'Air Filters', slug: { current: 'air-filters' } }, partNumber: 'AF-5500', inStock: true, featured: true, images: [] },
    { _id: 'p3', name: 'Fuel Water Separator - FW-3200', slug: { current: 'fuel-water-separator-3200' }, price: 29.99, compareAtPrice: 39.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'FW-3200', inStock: true, featured: true, images: [] },
    { _id: 'p4', name: 'Cabin Air Filter - CA-7700', slug: { current: 'cabin-air-filter-7700' }, price: 19.99, category: { name: 'Cabin Filters', slug: { current: 'cabin-filters' } }, partNumber: 'CA-7700', inStock: true, featured: true, images: [] },
    { _id: 'p5', name: 'Synthetic Oil Filter - SO-1200', slug: { current: 'synthetic-oil-filter-1200' }, price: 32.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'SO-1200', inStock: true, featured: true, images: [] },
    { _id: 'p6', name: 'High Flow Air Filter - HF-8800', slug: { current: 'high-flow-air-filter-8800' }, price: 54.99, compareAtPrice: 69.99, category: { name: 'Air Filters', slug: { current: 'air-filters' } }, partNumber: 'HF-8800', inStock: false, featured: true, images: [] },
    { _id: 'p7', name: 'Diesel Fuel Filter - DF-4400', slug: { current: 'diesel-fuel-filter-4400' }, price: 27.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'DF-4400', inStock: true, featured: true, images: [] },
    { _id: 'p8', name: 'Extended Life Oil Filter - EL-6600', slug: { current: 'extended-life-oil-filter-6600' }, price: 42.99, compareAtPrice: 54.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'EL-6600', inStock: true, featured: true, images: [] },
    { _id: 'p9', name: 'Hydraulic Filter - HY-2100', slug: { current: 'hydraulic-filter-2100' }, price: 36.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'HY-2100', inStock: true, featured: false, images: [] },
    { _id: 'p10', name: 'Coolant Filter - CL-1500', slug: { current: 'coolant-filter-1500' }, price: 18.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'CL-1500', inStock: true, featured: false, images: [] },
    { _id: 'p11', name: 'Transmission Filter - TF-3300', slug: { current: 'transmission-filter-3300' }, price: 48.99, compareAtPrice: 59.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'TF-3300', inStock: true, featured: false, images: [] },
    { _id: 'p12', name: 'DEF Filter - DEF-900', slug: { current: 'def-filter-900' }, price: 22.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'DEF-900', inStock: true, featured: false, images: [] },
]

const DEMO_CATEGORIES = [
    { _id: '1', name: 'Oil Filters', slug: { current: 'oil-filters' } },
    { _id: '2', name: 'Air Filters', slug: { current: 'air-filters' } },
    { _id: '3', name: 'Fuel Filters', slug: { current: 'fuel-filters' } },
    { _id: '4', name: 'Cabin Filters', slug: { current: 'cabin-filters' } },
]

export default function ProductsClient({ products, categories }: ProductsClientProps) {
    const displayProducts = products.length > 0 ? products : DEMO_PRODUCTS
    const displayCategories = categories.length > 0 ? categories : DEMO_CATEGORIES

    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [sortBy, setSortBy] = useState<string>('default')
    const [inStockOnly, setInStockOnly] = useState(false)

    const filteredProducts = useMemo(() => {
        let filtered = [...displayProducts]

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(
                (p: any) => p.category?.slug?.current === selectedCategory
            )
        }

        if (inStockOnly) {
            filtered = filtered.filter((p: any) => p.inStock)
        }

        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a: any, b: any) => a.price - b.price)
                break
            case 'price-desc':
                filtered.sort((a: any, b: any) => b.price - a.price)
                break
            case 'name':
                filtered.sort((a: any, b: any) => a.name.localeCompare(b.name))
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
                    {displayCategories.map((cat: any) => (
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
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <div className="product-grid">
                    {filteredProducts.map((product: any) => (
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

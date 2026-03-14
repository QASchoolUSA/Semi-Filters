'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { getCategoryIcon } from '@/components/CategoryIcons'
import type { Product, Category } from '@/types'

interface ShopClientProps {
    products: Product[]
    categories: Category[]
    initialCategory?: string
}

const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
    { value: 'name', label: 'Name: A → Z' },
]

export default function ShopClient({ products, categories, initialCategory = 'all' }: ShopClientProps) {
    const displayProducts = products || []
    const displayCategories = categories || []

    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
    const [selectedTruck, setSelectedTruck] = useState<string>('all')
    const [sortBy, setSortBy] = useState<string>('default')
    const [inStockOnly, setInStockOnly] = useState(false)
    const [sortOpen, setSortOpen] = useState(false)
    const [truckOpen, setTruckOpen] = useState(false)

    const sortRef = useRef<HTMLDivElement>(null)
    const truckRef = useRef<HTMLDivElement>(null)
    const chipsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (initialCategory) setSelectedCategory(initialCategory)
    }, [initialCategory])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
            if (truckRef.current && !truckRef.current.contains(e.target as Node)) setTruckOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const activeChip = chipsRef.current?.querySelector('.shop-chip--active') as HTMLElement
        if (activeChip && chipsRef.current) {
            activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
    }, [selectedCategory])

    const truckBrands = useMemo(() => {
        const brands = new Set<string>()
        displayProducts.forEach(p => {
            p.vehicleFit?.forEach(v => {
                brands.add(v.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '))
            })
        })
        return Array.from(brands).sort()
    }, [displayProducts])

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { all: displayProducts.length }
        displayCategories.forEach(cat => {
            counts[cat.slug.current] = displayProducts.filter(
                p => p.category?.slug?.current === cat.slug.current
            ).length
        })
        return counts
    }, [displayProducts, displayCategories])

    const filteredProducts = useMemo(() => {
        let filtered = [...displayProducts]

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(
                (p) => p.category?.slug?.current === selectedCategory
            )
        }

        if (selectedTruck !== 'all') {
            const target = selectedTruck.toLowerCase()
            filtered = filtered.filter(
                (p) => p.vehicleFit?.some(v => v.toLowerCase() === target)
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
    }, [displayProducts, selectedCategory, selectedTruck, sortBy, inStockOnly])

    const activeSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'Default'
    const hasActiveFilters = selectedCategory !== 'all' || selectedTruck !== 'all' || inStockOnly || sortBy !== 'default'

    const resetFilters = () => {
        setSelectedCategory('all')
        setSelectedTruck('all')
        setInStockOnly(false)
        setSortBy('default')
    }

    return (
        <div className="shop-layout">
            {/* ── Category Chips ── */}
            <div className="shop-chips" ref={chipsRef}>
                <button
                    className={`shop-chip ${selectedCategory === 'all' ? 'shop-chip--active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                >
                    <span className="shop-chip__icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                    </span>
                    <span className="shop-chip__label">All</span>
                    <span className="shop-chip__count">{categoryCounts.all}</span>
                </button>

                {displayCategories.map((cat) => (
                    <button
                        key={cat._id}
                        className={`shop-chip ${selectedCategory === cat.slug.current ? 'shop-chip--active' : ''}`}
                        onClick={() => setSelectedCategory(cat.slug.current)}
                    >
                        <span className="shop-chip__icon">
                            {getCategoryIcon(cat.slug.current, 20)}
                        </span>
                        <span className="shop-chip__label">{cat.name}</span>
                        <span className="shop-chip__count">
                            {categoryCounts[cat.slug.current] || 0}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Toolbar: Count + Controls ── */}
            <div className="shop-toolbar">
                <div className="shop-toolbar__left">
                    <p className="shop-toolbar__count">
                        <strong>{filteredProducts.length}</strong>{' '}
                        product{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                    {hasActiveFilters && (
                        <button className="shop-toolbar__clear" onClick={resetFilters}>
                            Clear all
                        </button>
                    )}
                </div>

                <div className="shop-toolbar__right">
                    {/* Toggle: In Stock */}
                    <label className="shop-toggle">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={() => setInStockOnly(!inStockOnly)}
                        />
                        <span className="shop-toggle__track">
                            <span className="shop-toggle__thumb" />
                        </span>
                        <span className="shop-toggle__text">In Stock</span>
                    </label>

                    {/* Truck Brand Dropdown */}
                    {truckBrands.length > 0 && (
                        <div className="shop-sort" ref={truckRef}>
                            <button
                                className={`shop-sort__trigger ${selectedTruck !== 'all' ? 'shop-sort__trigger--filtered' : ''}`}
                                onClick={() => { setTruckOpen(!truckOpen); setSortOpen(false) }}
                                aria-expanded={truckOpen}
                                aria-haspopup="listbox"
                            >
                                <svg className="shop-sort__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 3h15v13H1z" />
                                    <path d="M16 8h4l3 3v5h-7V8z" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                                <span className="shop-sort__label">
                                    {selectedTruck === 'all' ? 'All Trucks' : selectedTruck}
                                </span>
                                <svg
                                    className="shop-sort__chevron"
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    style={{ transform: truckOpen ? 'rotate(180deg)' : 'none' }}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {truckOpen && (
                                <>
                                    <div className="shop-sort__backdrop" onClick={() => setTruckOpen(false)} />
                                    <div className="shop-sort__menu" role="listbox">
                                        <div className="shop-sort__menu-handle" />
                                        <button
                                            className={`shop-sort__option ${selectedTruck === 'all' ? 'shop-sort__option--active' : ''}`}
                                            role="option"
                                            aria-selected={selectedTruck === 'all'}
                                            onClick={() => { setSelectedTruck('all'); setTruckOpen(false) }}
                                        >
                                            {selectedTruck === 'all' && (
                                                <svg className="shop-sort__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                            <span>All Trucks</span>
                                        </button>
                                        {truckBrands.map((brand) => (
                                            <button
                                                key={brand}
                                                className={`shop-sort__option ${selectedTruck === brand ? 'shop-sort__option--active' : ''}`}
                                                role="option"
                                                aria-selected={selectedTruck === brand}
                                                onClick={() => { setSelectedTruck(brand); setTruckOpen(false) }}
                                            >
                                                {selectedTruck === brand && (
                                                    <svg className="shop-sort__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                                <span>{brand}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Sort Dropdown */}
                    <div className="shop-sort" ref={sortRef}>
                        <button
                            className="shop-sort__trigger"
                            onClick={() => { setSortOpen(!sortOpen); setTruckOpen(false) }}
                            aria-expanded={sortOpen}
                            aria-haspopup="listbox"
                        >
                            <svg className="shop-sort__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M6 12h12M9 18h6" />
                            </svg>
                            <span className="shop-sort__label">{activeSortLabel}</span>
                            <svg
                                className="shop-sort__chevron"
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                style={{ transform: sortOpen ? 'rotate(180deg)' : 'none' }}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {sortOpen && (
                            <>
                                <div className="shop-sort__backdrop" onClick={() => setSortOpen(false)} />
                                <div className="shop-sort__menu" role="listbox">
                                    <div className="shop-sort__menu-handle" />
                                    {sortOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            className={`shop-sort__option ${sortBy === opt.value ? 'shop-sort__option--active' : ''}`}
                                            role="option"
                                            aria-selected={sortBy === opt.value}
                                            onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                                        >
                                            {sortBy === opt.value && (
                                                <svg className="shop-sort__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                            <span>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Product Grid ── */}
            <div className="product-grid">
                {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="shop-empty">
                    <div className="shop-empty__icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    </div>
                    <h2>No products found</h2>
                    <p>Try adjusting your filters to find what you&apos;re looking for.</p>
                    <button className="btn btn-outline" onClick={resetFilters}>
                        Reset All Filters
                    </button>
                </div>
            )}
        </div>
    )
}

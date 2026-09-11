'use client'

import React, { useMemo, useRef, useEffect, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { getCategoryIcon } from '@/components/CategoryIcons'
import type { ShopFilters, ShopSort } from '@/lib/shop'
import type { Product, Category } from '@/types'

interface ShopClientProps {
    products: Product[]
    categories: Category[]
    filters: ShopFilters
    total: number
    totalPages: number
    page: number
    categoryCounts: Record<string, number>
    truckBrands: string[]
    priceRange: { min: number; max: number }
}

const sortOptions: { value: ShopSort; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
    { value: 'name', label: 'Name: A → Z' },
]

function buildShopQuery(next: Partial<ShopFilters> & { page?: number }, current: ShopFilters) {
    const merged: ShopFilters = { ...current, ...next }
    const params = new URLSearchParams()

    if (merged.category !== 'all') params.set('category', merged.category)
    if (merged.truck !== 'all') params.set('truck', merged.truck)
    if (merged.sort !== 'default') params.set('sort', merged.sort)
    if (merged.inStockOnly) params.set('inStock', '1')
    if (merged.minPrice !== null) params.set('minPrice', String(merged.minPrice))
    if (merged.maxPrice !== null) params.set('maxPrice', String(merged.maxPrice))
    if (merged.page > 1) params.set('page', String(merged.page))

    const qs = params.toString()
    return qs ? `?${qs}` : ''
}

export default function ShopClient({
    products,
    categories,
    filters,
    total,
    totalPages,
    page,
    categoryCounts,
    truckBrands,
    priceRange,
}: ShopClientProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    const [priceMin, setPriceMin] = React.useState(
        filters.minPrice !== null ? String(filters.minPrice) : ''
    )
    const [priceMax, setPriceMax] = React.useState(
        filters.maxPrice !== null ? String(filters.maxPrice) : ''
    )
    const [sortOpen, setSortOpen] = React.useState(false)
    const [truckOpen, setTruckOpen] = React.useState(false)
    const [priceOpen, setPriceOpen] = React.useState(false)

    const sortRef = useRef<HTMLDivElement>(null)
    const truckRef = useRef<HTMLDivElement>(null)
    const priceRef = useRef<HTMLDivElement>(null)
    const chipsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setPriceMin(filters.minPrice !== null ? String(filters.minPrice) : '')
        setPriceMax(filters.maxPrice !== null ? String(filters.maxPrice) : '')
    }, [filters.minPrice, filters.maxPrice])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
            if (truckRef.current && !truckRef.current.contains(e.target as Node)) setTruckOpen(false)
            if (priceRef.current && !priceRef.current.contains(e.target as Node)) setPriceOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const activeChip = chipsRef.current?.querySelector('.shop-chip--active') as HTMLElement
        if (activeChip && chipsRef.current) {
            activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
    }, [filters.category])

    const navigate = (next: Partial<ShopFilters>) => {
        const query = buildShopQuery(next, filters)
        startTransition(() => {
            router.push(`${pathname}${query}`)
        })
    }

    const hasPriceFilter = filters.minPrice !== null || filters.maxPrice !== null
    const hasActiveFilters =
        filters.category !== 'all' ||
        filters.truck !== 'all' ||
        filters.inStockOnly ||
        filters.sort !== 'default' ||
        hasPriceFilter

    const resetFilters = () => {
        setPriceMin('')
        setPriceMax('')
        startTransition(() => {
            router.push(pathname)
        })
    }

    const applyPriceFilter = () => {
        const min = priceMin === '' ? null : Number(priceMin)
        const max = priceMax === '' ? null : Number(priceMax)
        navigate({
            minPrice: min !== null && !Number.isNaN(min) ? min : null,
            maxPrice: max !== null && !Number.isNaN(max) ? max : null,
            page: 1,
        })
        setPriceOpen(false)
    }

    const activeSortLabel = sortOptions.find((o) => o.value === filters.sort)?.label || 'Default'

    const pageNumbers = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
        const pages = new Set([1, totalPages, page, page - 1, page + 1].filter((p) => p >= 1 && p <= totalPages))
        return Array.from(pages).sort((a, b) => a - b)
    }, [page, totalPages])

    return (
        <div className={`shop-layout${isPending ? ' shop-layout--pending' : ''}`}>
            <div className="shop-chips" ref={chipsRef}>
                <button
                    className={`shop-chip ${filters.category === 'all' ? 'shop-chip--active' : ''}`}
                    onClick={() => navigate({ category: 'all', page: 1 })}
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
                    <span className="shop-chip__count">{categoryCounts.all ?? 0}</span>
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        className={`shop-chip ${filters.category === cat.slug.current ? 'shop-chip--active' : ''}`}
                        onClick={() => navigate({ category: cat.slug.current, page: 1 })}
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

            <div className="shop-toolbar">
                <div className="shop-toolbar__left">
                    <p className="shop-toolbar__count">
                        <strong>{total}</strong> product{total !== 1 ? 's' : ''}
                        {totalPages > 1 && (
                            <span className="shop-toolbar__page">
                                {' '}
                                · Page {page} of {totalPages}
                            </span>
                        )}
                    </p>
                    {hasActiveFilters && (
                        <button className="shop-toolbar__clear" onClick={resetFilters}>
                            Clear all
                        </button>
                    )}
                </div>

                <div className="shop-toolbar__right">
                    <label className="shop-toggle">
                        <input
                            type="checkbox"
                            checked={filters.inStockOnly}
                            onChange={() =>
                                navigate({ inStockOnly: !filters.inStockOnly, page: 1 })
                            }
                        />
                        <span className="shop-toggle__track">
                            <span className="shop-toggle__thumb" />
                        </span>
                        <span className="shop-toggle__text">In Stock</span>
                    </label>

                    <div className="shop-sort" ref={priceRef}>
                        <button
                            className={`shop-sort__trigger ${hasPriceFilter ? 'shop-sort__trigger--filtered' : ''}`}
                            onClick={() => {
                                setPriceOpen(!priceOpen)
                                setSortOpen(false)
                                setTruckOpen(false)
                            }}
                            aria-expanded={priceOpen}
                            aria-haspopup="dialog"
                        >
                            <svg className="shop-sort__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            <span className="shop-sort__label">
                                {hasPriceFilter
                                    ? `$${filters.minPrice ?? '0'} – $${filters.maxPrice ?? '∞'}`
                                    : 'Price'}
                            </span>
                            <svg
                                className="shop-sort__chevron"
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                style={{ transform: priceOpen ? 'rotate(180deg)' : 'none' }}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {priceOpen && (
                            <>
                                <div className="shop-sort__backdrop" onClick={() => setPriceOpen(false)} />
                                <div className="shop-sort__menu shop-price-menu" role="dialog" aria-label="Price range filter">
                                    <div className="shop-sort__menu-handle" />
                                    <div className="shop-price__header">Price Range</div>
                                    <div className="shop-price__inputs">
                                        <div className="shop-price__field">
                                            <div className="shop-price__input-wrap">
                                                <span className="shop-price__currency">$</span>
                                                <input
                                                    type="number"
                                                    className="shop-price__input"
                                                    placeholder={String(priceRange.min)}
                                                    value={priceMin}
                                                    onChange={(e) => setPriceMin(e.target.value)}
                                                    min={0}
                                                    step="any"
                                                />
                                            </div>
                                            <label className="shop-price__label">Min</label>
                                        </div>
                                        <span className="shop-price__separator">–</span>
                                        <div className="shop-price__field">
                                            <div className="shop-price__input-wrap">
                                                <span className="shop-price__currency">$</span>
                                                <input
                                                    type="number"
                                                    className="shop-price__input"
                                                    placeholder={String(priceRange.max)}
                                                    value={priceMax}
                                                    onChange={(e) => setPriceMax(e.target.value)}
                                                    min={0}
                                                    step="any"
                                                />
                                            </div>
                                            <label className="shop-price__label">Max</label>
                                        </div>
                                    </div>
                                    <div className="shop-price__actions">
                                        <button
                                            className="shop-price__clear"
                                            onClick={() => {
                                                setPriceMin('')
                                                setPriceMax('')
                                                navigate({ minPrice: null, maxPrice: null, page: 1 })
                                                setPriceOpen(false)
                                            }}
                                            disabled={!hasPriceFilter && !priceMin && !priceMax}
                                        >
                                            Clear
                                        </button>
                                        <button className="shop-price__apply" onClick={applyPriceFilter}>
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {truckBrands.length > 0 && (
                        <div className="shop-sort" ref={truckRef}>
                            <button
                                className={`shop-sort__trigger ${filters.truck !== 'all' ? 'shop-sort__trigger--filtered' : ''}`}
                                onClick={() => {
                                    setTruckOpen(!truckOpen)
                                    setSortOpen(false)
                                    setPriceOpen(false)
                                }}
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
                                    {filters.truck === 'all' ? 'All Trucks' : filters.truck}
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
                                            className={`shop-sort__option ${filters.truck === 'all' ? 'shop-sort__option--active' : ''}`}
                                            role="option"
                                            aria-selected={filters.truck === 'all'}
                                            onClick={() => {
                                                navigate({ truck: 'all', page: 1 })
                                                setTruckOpen(false)
                                            }}
                                        >
                                            {filters.truck === 'all' && (
                                                <svg className="shop-sort__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                            <span>All Trucks</span>
                                        </button>
                                        {truckBrands.map((brand) => (
                                            <button
                                                key={brand}
                                                className={`shop-sort__option ${filters.truck === brand ? 'shop-sort__option--active' : ''}`}
                                                role="option"
                                                aria-selected={filters.truck === brand}
                                                onClick={() => {
                                                    navigate({ truck: brand, page: 1 })
                                                    setTruckOpen(false)
                                                }}
                                            >
                                                {filters.truck === brand && (
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

                    <div className="shop-sort" ref={sortRef}>
                        <button
                            className="shop-sort__trigger"
                            onClick={() => {
                                setSortOpen(!sortOpen)
                                setTruckOpen(false)
                                setPriceOpen(false)
                            }}
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
                                            className={`shop-sort__option ${filters.sort === opt.value ? 'shop-sort__option--active' : ''}`}
                                            role="option"
                                            aria-selected={filters.sort === opt.value}
                                            onClick={() => {
                                                navigate({ sort: opt.value, page: 1 })
                                                setSortOpen(false)
                                            }}
                                        >
                                            {filters.sort === opt.value && (
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

            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {products.length === 0 && (
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

            {totalPages > 1 && (
                <nav className="shop-pagination" aria-label="Shop pagination">
                    <button
                        className="shop-pagination__btn"
                        disabled={page <= 1}
                        onClick={() => navigate({ page: page - 1 })}
                    >
                        Previous
                    </button>
                    <div className="shop-pagination__pages">
                        {pageNumbers.map((n, i) => {
                            const prev = pageNumbers[i - 1]
                            const showEllipsis = prev !== undefined && n - prev > 1
                            return (
                                <React.Fragment key={n}>
                                    {showEllipsis && <span className="shop-pagination__ellipsis">…</span>}
                                    <button
                                        className={`shop-pagination__page${n === page ? ' shop-pagination__page--active' : ''}`}
                                        onClick={() => navigate({ page: n })}
                                        aria-current={n === page ? 'page' : undefined}
                                    >
                                        {n}
                                    </button>
                                </React.Fragment>
                            )
                        })}
                    </div>
                    <button
                        className="shop-pagination__btn"
                        disabled={page >= totalPages}
                        onClick={() => navigate({ page: page + 1 })}
                    >
                        Next
                    </button>
                </nav>
            )}
        </div>
    )
}

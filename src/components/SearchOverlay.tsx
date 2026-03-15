'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { HiOutlineSearch, HiOutlineX, HiArrowRight } from 'react-icons/hi'

interface SearchResult {
  _id: string
  name: string
  slug: { current: string }
  images?: any[]
  price: number
  compareAtPrice?: number
  category?: { name: string; slug: { current: string } }
  partNumber?: string
  inStock: boolean
}

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
      setSearched(false)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const search = useCallback(async (term: string) => {
    if (term.trim().length < 2) {
      setResults([])
      setSearched(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term.trim())}`)
      const data = await res.json()
      setResults(data.results || [])
      setSearched(true)
    } catch {
      setResults([])
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 300)
  }

  const handleResultClick = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="search-overlay">
      <div className="search-overlay__backdrop" onClick={onClose} />
      <div className="search-overlay__panel">
        <div className="search-overlay__header">
          <div className="search-overlay__input-wrap">
            <HiOutlineSearch className="search-overlay__input-icon" size={22} />
            <input
              ref={inputRef}
              type="text"
              className="search-overlay__input"
              placeholder="Search by part number, product name..."
              value={query}
              onChange={handleChange}
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                className="search-overlay__input-clear"
                onClick={() => { setQuery(''); setResults([]); setSearched(false); inputRef.current?.focus() }}
                aria-label="Clear search"
              >
                <HiOutlineX size={18} />
              </button>
            )}
          </div>
          <button className="search-overlay__close" onClick={onClose} aria-label="Close search">
            <HiOutlineX size={24} />
          </button>
        </div>

        <div className="search-overlay__body">
          {loading && (
            <div className="search-overlay__loading">
              <div className="search-overlay__spinner" />
              <span>Searching...</span>
            </div>
          )}

          {!loading && !searched && query.length < 2 && (
            <div className="search-overlay__hint">
              <HiOutlineSearch size={40} />
              <p>Enter a part number or product name to search</p>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="search-overlay__empty">
              <p>No results found for &ldquo;<strong>{query}</strong>&rdquo;</p>
              <span>Try a different part number or product name</span>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="search-overlay__count">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
              <div className="search-overlay__results">
                {results.map((product) => (
                  <Link
                    key={product._id}
                    href={`/shop/${product.slug.current}`}
                    className="search-result"
                    onClick={handleResultClick}
                  >
                    <div className="search-result__image">
                      {product.images?.[0] ? (
                        <Image
                          src={urlFor(product.images[0]).width(80).height(80).url()}
                          alt={product.name}
                          width={80}
                          height={80}
                          style={{ objectFit: 'contain' }}
                        />
                      ) : (
                        <div className="search-result__placeholder">
                          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                            <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.15" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="search-result__info">
                      <span className="search-result__name">{product.name}</span>
                      {product.partNumber && (
                        <span className="search-result__part">Part# {product.partNumber}</span>
                      )}
                      <div className="search-result__meta">
                        {product.category && (
                          <span className="search-result__category">{product.category.name}</span>
                        )}
                        {!product.inStock && (
                          <span className="search-result__oos">Out of Stock</span>
                        )}
                      </div>
                    </div>
                    <div className="search-result__right">
                      <span className="search-result__price">${product.price.toFixed(2)}</span>
                      {product.compareAtPrice && (
                        <span className="search-result__compare">${product.compareAtPrice.toFixed(2)}</span>
                      )}
                      <HiArrowRight className="search-result__arrow" size={16} />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { getCategoryIcon } from '@/components/CategoryIcons'
import { HiOutlineArrowNarrowRight, HiOutlineFilter } from 'react-icons/hi'
import { DEMO_CATEGORIES } from '@/lib/demo-data'
import type { Category } from '@/types'

interface TruckMakerFiltersProps {
    categories: Category[]
}

const truckMakers = [
    {
        name: 'Volvo',
        slug: 'Volvo',
        description: 'OEM-grade filtration systems for VNL, VNR, and VHD models with D11 & D13 engines.',
        color: '#003057',
        tagline: 'Precision Engineering'
    },
    {
        name: 'Kenworth',
        slug: 'Kenworth',
        description: 'Elite protection for heavy-duty T680, T880, and W900 PACCAR-powered trucks.',
        color: '#E31837',
        tagline: 'The World\'s Best'
    },
    {
        name: 'Freightliner',
        slug: 'Freightliner',
        description: 'Maximum efficiency filters for Cascadia, M2, and SD vocational fleet vehicles.',
        color: '#DA291C',
        tagline: 'Run Smart'
    }
]

export default function TruckMakerFilters({ categories }: TruckMakerFiltersProps) {
    const sourceCategories = (categories && categories.length > 0) ? categories : DEMO_CATEGORIES
    const priorityTerms = ['oil', 'air', 'fuel', 'cabin']
    
    let mainCategories = sourceCategories.filter(cat => {
        const slug = cat.slug?.current?.toLowerCase() || ''
        const name = cat.name?.toLowerCase() || ''
        return priorityTerms.some(term => slug.includes(term) || name.includes(term))
    })

    mainCategories.sort((a, b) => {
        const getMinIdx = (cat: Category) => {
            const slug = cat.slug?.current?.toLowerCase() || ''
            const name = cat.name?.toLowerCase() || ''
            const indices = priorityTerms.map((term, idx) => (slug.includes(term) || name.includes(term)) ? idx : 99)
            return Math.min(...indices)
        }
        return getMinIdx(a) - getMinIdx(b)
    })

    if (mainCategories.length < 4 && sourceCategories.length > 0) {
        const extras = sourceCategories.filter(c => !mainCategories.find(mc => mc._id === c._id))
        mainCategories = [...mainCategories, ...extras].slice(0, 4)
    }

    return (
        <section className="section maker-filters-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Fleet-Ready Solutions</span>
                    <h2 className="section-title">Filter by Truck Maker</h2>
                    <p className="section-subtitle">
                        Find high-performance filtration kits specifically engineered for your truck's engine architecture.
                    </p>
                </div>

                <div className="maker-grid">
                    {truckMakers.map((maker) => (
                        <div key={maker.name} className="maker-card" style={{ '--maker-color': maker.color } as React.CSSProperties}>
                            {/* --- Visual Header --- */}
                            <div className="maker-card__header">
                                <div className="maker-card__header-overlay" />
                                <div className="maker-card__header-content">
                                    <div className="maker-card__brand-wrap">
                                        <span className="maker-card__tagline">{maker.tagline}</span>
                                        <h3 className="maker-card__brand">{maker.name}</h3>
                                    </div>
                                    <p className="maker-card__desc">{maker.description}</p>
                                </div>
                                <div className="maker-card__bg-brand">{maker.name}</div>
                            </div>
                            
                            {/* --- Category Selector --- */}
                            <div className="maker-card__body">
                                <div className="maker-card__body-header">
                                    <HiOutlineFilter className="maker-card__filter-icon" />
                                    <h4 className="maker-card__subheading">Select Filter Category</h4>
                                </div>
                                
                                <div className="maker-card__category-grid">
                                    {mainCategories.map((cat) => (
                                        <Link 
                                            key={cat._id} 
                                            href={`/shop?truck=${maker.slug}&category=${cat.slug?.current || 'all'}`}
                                            className="maker-cat-box"
                                        >
                                            <div className="maker-cat-box__icon">
                                                {getCategoryIcon(cat.slug?.current || '', 32)}
                                            </div>
                                            <div className="maker-cat-box__info">
                                                <span className="maker-cat-box__name">
                                                    {cat.name.replace(' Filters', '')}
                                                </span>
                                                <span className="maker-cat-box__cta">Browse Items</span>
                                            </div>
                                            <div className="maker-cat-box__arrow">
                                                <HiOutlineArrowNarrowRight size={16} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                
                                <Link 
                                    href={`/shop?truck=${maker.slug}`}
                                    className="maker-card__footer-link"
                                >
                                    <span>Explore All {maker.name} Inventory</span>
                                    <div className="maker-card__footer-circle">
                                        <HiOutlineArrowNarrowRight size={18} />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .maker-filters-section {
                    background: var(--color-bg-primary);
                    padding-top: 80px;
                    padding-bottom: 80px;
                    position: relative;
                }

                .maker-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
                    gap: 32px;
                    margin-top: 56px;
                }

                @media (max-width: 768px) {
                    .maker-grid {
                        grid-template-columns: 1fr;
                        gap: 28px;
                    }
                    .maker-filters-section {
                        padding-top: 50px;
                        padding-bottom: 50px;
                    }
                }

                .maker-card {
                    background: var(--color-bg-secondary);
                    border-radius: 28px;
                    overflow: hidden;
                    border: 1px solid var(--color-border);
                    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                }

                .maker-card:hover {
                    transform: translateY(-12px);
                    box-shadow: 0 40px 80px rgba(0,0,0,0.12);
                    border-color: var(--maker-color);
                }

                /* --- Header Styles --- */
                .maker-card__header {
                    padding: 56px 40px;
                    background: linear-gradient(135deg, var(--maker-color), #0a0a0a);
                    color: white;
                    position: relative;
                    overflow: hidden;
                    min-height: 240px;
                    display: flex;
                    align-items: flex-end;
                }

                .maker-card__header-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 60%);
                    pointer-events: none;
                }

                .maker-card__header-content {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                }

                .maker-card__tagline {
                    display: inline-block;
                    font-size: 0.65rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    padding: 4px 12px;
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(4px);
                    border-radius: 100px;
                    margin-bottom: 12px;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .maker-card__brand {
                    font-size: 42px;
                    font-weight: 900;
                    letter-spacing: -0.04em;
                    margin-bottom: 14px;
                    text-transform: uppercase;
                    line-height: 0.9;
                }

                .maker-card__desc {
                    font-size: 0.9rem;
                    line-height: 1.6;
                    opacity: 0.8;
                    margin: 0;
                    max-width: 320px;
                }

                .maker-card__bg-brand {
                    position: absolute;
                    top: -20px;
                    right: -20px;
                    font-size: 140px;
                    font-weight: 950;
                    opacity: 0.04;
                    pointer-events: none;
                    user-select: none;
                    font-style: italic;
                    white-space: nowrap;
                }

                /* --- Body Styles --- */
                .maker-card__body {
                    padding: 40px;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }

                .maker-card__body-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 24px;
                }

                .maker-card__filter-icon {
                    color: var(--maker-color);
                    opacity: 0.7;
                }

                .maker-card__subheading {
                    font-size: 0.85rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--color-text-primary);
                    margin: 0;
                }

                .maker-card__category-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    margin-bottom: 32px;
                }

                /* --- Category Box --- */
                .maker-cat-box {
                    display: flex;
                    align-items: center;
                    padding: 18px 24px;
                    background: var(--color-bg-primary);
                    border: 1px solid var(--color-border);
                    border-radius: 20px;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    position: relative;
                    overflow: hidden;
                }

                .maker-cat-box:hover {
                    border-color: var(--maker-color);
                    background: var(--color-bg-secondary);
                    transform: translateX(6px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                }

                .maker-cat-box__icon {
                    width: 52px;
                    height: 52px;
                    background: var(--color-bg-secondary);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 20px;
                    color: var(--color-text-secondary);
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                }

                .maker-cat-box:hover .maker-cat-box__icon {
                    background: var(--maker-color);
                    color: white;
                    transform: rotate(-5deg) scale(1.1);
                }

                .maker-cat-box__info {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }

                .maker-cat-box__name {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--color-text-primary);
                    margin-bottom: 2px;
                }

                .maker-cat-box__cta {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                }

                .maker-cat-box__arrow {
                    color: var(--color-text-muted);
                    opacity: 0;
                    transform: translateX(-10px);
                    transition: all 0.3s ease;
                }

                .maker-cat-box:hover .maker-cat-box__arrow {
                    opacity: 1;
                    transform: translateX(0);
                    color: var(--maker-color);
                }

                /* --- Footer Link --- */
                .maker-card__footer-link {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 14px 14px 28px;
                    background: #1a1a1a;
                    color: white;
                    border-radius: 100px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                }

                .maker-card__footer-link:hover {
                    background: var(--maker-color);
                    padding-right: 18px;
                }

                .maker-card__footer-circle {
                    width: 44px;
                    height: 44px;
                    background: rgba(255,255,255,0.15);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .maker-card__footer-link:hover .maker-card__footer-circle {
                    background: rgba(255,255,255,0.25);
                    transform: rotate(-45deg);
                }

                [data-theme='dark'] .maker-card__footer-link {
                    background: #2a2a2a;
                }
                
                [data-theme='dark'] .maker-card__footer-link:hover {
                    background: var(--maker-color);
                }

                @media (max-width: 480px) {
                    .maker-card__header {
                        padding: 40px 24px;
                        min-height: 200px;
                    }
                    .maker-card__body {
                        padding: 24px;
                    }
                    .maker-card__brand {
                        font-size: 32px;
                    }
                    .maker-cat-box {
                        padding: 14px 18px;
                    }
                    .maker-cat-box__icon {
                        width: 44px;
                        height: 44px;
                        margin-right: 16px;
                    }
                    .maker-cat-box__name {
                        font-size: 0.95rem;
                    }
                    .maker-card__footer-link {
                        font-size: 0.85rem;
                        padding-left: 20px;
                    }
                }
            `}</style>
        </section>
    )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { getCategoryIcon } from '@/components/CategoryIcons'
import { HiOutlineArrowNarrowRight } from 'react-icons/hi'
import { DEMO_CATEGORIES } from '@/lib/demo-data'
import type { Category } from '@/types'

interface TruckMakerFiltersProps {
    categories: Category[]
}

const truckMakers = [
    {
        name: 'Volvo',
        slug: 'Volvo',
        tagline: 'VNL · VNR · VHD',
        description: 'OEM-grade filtration for D11 & D13 engines.',
        accent: '#1E5BA8',
    },
    {
        name: 'Kenworth',
        slug: 'Kenworth',
        tagline: 'T680 · T880 · W900',
        description: 'Heavy-duty protection for PACCAR-powered trucks.',
        accent: '#E31837',
    },
    {
        name: 'Freightliner',
        slug: 'Freightliner',
        tagline: 'Cascadia · M2 · SD',
        description: 'Maximum efficiency for fleet & vocational rigs.',
        accent: '#0066B2',
    },
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
                    <span className="section-label">Shop By Truck</span>
                    <h2 className="section-title">Find Filters For Your Rig</h2>
                    <p className="section-subtitle">
                        Pick your truck, then jump straight to the filter you need — engineered fits for every major make.
                    </p>
                </div>

                <div className="maker-grid">
                    {truckMakers.map((maker) => (
                        <article
                            key={maker.name}
                            className="maker-card"
                            style={{ ['--maker-accent' as string]: maker.accent } as React.CSSProperties}
                        >
                            <div className="maker-card__head">
                                <span className="maker-card__dot" aria-hidden="true" />
                                <div className="maker-card__head-text">
                                    <span className="maker-card__tagline">{maker.tagline}</span>
                                    <h3 className="maker-card__brand">{maker.name}</h3>
                                </div>
                            </div>

                            <p className="maker-card__desc">{maker.description}</p>

                            <ul className="maker-card__cats" role="list">
                                {mainCategories.map((cat) => (
                                    <li key={cat._id}>
                                        <Link
                                            href={`/shop?truck=${maker.slug}&category=${cat.slug?.current || 'all'}`}
                                            className="maker-cat"
                                        >
                                            <span className="maker-cat__icon">
                                                {getCategoryIcon(cat.slug?.current || '', 22)}
                                            </span>
                                            <span className="maker-cat__name">
                                                {cat.name.replace(' Filters', '')}
                                            </span>
                                            <HiOutlineArrowNarrowRight className="maker-cat__arrow" size={16} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={`/shop?truck=${maker.slug}`}
                                className="maker-card__cta"
                            >
                                <span>View all {maker.name} filters</span>
                                <HiOutlineArrowNarrowRight size={16} />
                            </Link>
                        </article>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .maker-filters-section {
                    background: var(--color-bg-secondary);
                    padding-top: 80px;
                    padding-bottom: 80px;
                }

                .maker-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 24px;
                    margin-top: 48px;
                }

                /* ----- Card ----- */
                .maker-card {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    background: var(--color-bg-card);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-xl);
                    padding: 28px 26px 22px;
                    transition: border-color var(--transition-base),
                                transform var(--transition-base),
                                box-shadow var(--transition-base);
                    overflow: hidden;
                }

                .maker-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: var(--maker-accent);
                    opacity: 0.85;
                }

                .maker-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--color-border-hover);
                    box-shadow: var(--shadow-lg);
                }

                /* ----- Header ----- */
                .maker-card__head {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin-bottom: 10px;
                }

                .maker-card__dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--maker-accent);
                    box-shadow: 0 0 0 4px color-mix(in srgb, var(--maker-accent) 18%, transparent);
                    flex-shrink: 0;
                }

                .maker-card__head-text {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }

                .maker-card__tagline {
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--color-text-muted);
                    line-height: 1.2;
                    margin-bottom: 4px;
                }

                .maker-card__brand {
                    font-size: 1.5rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: var(--color-text-primary);
                    line-height: 1.1;
                    margin: 0;
                }

                .maker-card__desc {
                    font-size: 0.9rem;
                    color: var(--color-text-secondary);
                    line-height: 1.55;
                    margin: 0 0 22px;
                }

                /* ----- Category list ----- */
                .maker-card__cats {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 22px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }

                .maker-cat {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 12px;
                    background: var(--color-bg-tertiary);
                    border: 1px solid transparent;
                    border-radius: var(--radius-md);
                    text-decoration: none;
                    color: var(--color-text-secondary);
                    transition: background var(--transition-fast),
                                color var(--transition-fast),
                                border-color var(--transition-fast);
                    min-height: 48px;
                }

                .maker-cat:hover,
                .maker-cat:focus-visible {
                    background: var(--color-bg-card-hover);
                    border-color: var(--color-accent);
                    color: var(--color-text-primary);
                    outline: none;
                }

                .maker-cat__icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    color: var(--color-accent);
                    flex-shrink: 0;
                }

                .maker-cat__name {
                    font-size: 0.875rem;
                    font-weight: 600;
                    flex-grow: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .maker-cat__arrow {
                    color: var(--color-text-muted);
                    opacity: 0;
                    transform: translateX(-4px);
                    transition: opacity var(--transition-fast),
                                transform var(--transition-fast),
                                color var(--transition-fast);
                    flex-shrink: 0;
                }

                .maker-cat:hover .maker-cat__arrow,
                .maker-cat:focus-visible .maker-cat__arrow {
                    opacity: 1;
                    transform: translateX(0);
                    color: var(--color-accent);
                }

                /* ----- Footer CTA ----- */
                .maker-card__cta {
                    margin-top: auto;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px 18px;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    color: var(--color-text-primary);
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: background var(--transition-base),
                                border-color var(--transition-base),
                                color var(--transition-base),
                                box-shadow var(--transition-base);
                }

                .maker-card__cta:hover,
                .maker-card__cta:focus-visible {
                    background: var(--color-accent);
                    border-color: var(--color-accent);
                    color: #fff;
                    box-shadow: var(--shadow-glow);
                    outline: none;
                }

                .maker-card__cta svg {
                    transition: transform var(--transition-base);
                }

                .maker-card__cta:hover svg {
                    transform: translateX(3px);
                }

                /* ----- Responsive ----- */
                @media (max-width: 1024px) {
                    .maker-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                        margin-top: 36px;
                    }
                    .maker-card {
                        padding: 24px 22px 20px;
                    }
                }

                @media (max-width: 768px) {
                    .maker-filters-section {
                        padding-top: 48px;
                        padding-bottom: 48px;
                    }
                    .maker-card__brand {
                        font-size: 1.35rem;
                    }
                    .maker-card__desc {
                        font-size: 0.875rem;
                        margin-bottom: 18px;
                    }
                    .maker-card__cats {
                        gap: 8px;
                        margin-bottom: 18px;
                    }
                    .maker-cat {
                        padding: 11px 12px;
                        min-height: 46px;
                    }
                    .maker-cat__name {
                        font-size: 0.8rem;
                    }
                }

                @media (max-width: 380px) {
                    .maker-card__cats {
                        grid-template-columns: 1fr;
                    }
                    .maker-cat {
                        padding: 12px 14px;
                    }
                    .maker-cat__name {
                        font-size: 0.875rem;
                    }
                }
            `}</style>
        </section>
    )
}

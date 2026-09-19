import React from 'react'
import Link from 'next/link'
import type { BreadcrumbItem } from '@/lib/seo'

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
    /** When true, the last item stays a link if it has href (useful for category-only trails). */
    linkLast?: boolean
}

export default function Breadcrumbs({ items, className, linkLast = false }: BreadcrumbsProps) {
    if (!items.length) return null

    return (
        <nav className={['breadcrumbs', className].filter(Boolean).join(' ')} aria-label="Breadcrumb">
            <ol className="breadcrumbs__list">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    const showAsLink = Boolean(item.href) && (!isLast || linkLast)
                    return (
                        <li key={`${item.name}-${index}`} className="breadcrumbs__item">
                            {showAsLink ? (
                                <Link href={item.href!} className="breadcrumbs__link">
                                    {item.name}
                                </Link>
                            ) : (
                                <span className="breadcrumbs__current" aria-current={isLast ? 'page' : undefined}>
                                    {item.name}
                                </span>
                            )}
                            {!isLast && <span className="breadcrumbs__sep" aria-hidden="true">/</span>}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

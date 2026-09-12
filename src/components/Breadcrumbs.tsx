import React from 'react'
import Link from 'next/link'
import type { BreadcrumbItem } from '@/lib/seo'

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    if (!items.length) return null

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol className="breadcrumbs__list">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    return (
                        <li key={`${item.name}-${index}`} className="breadcrumbs__item">
                            {item.href && !isLast ? (
                                <Link href={item.href} className="breadcrumbs__link">
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

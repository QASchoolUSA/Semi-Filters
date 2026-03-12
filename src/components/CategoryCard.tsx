import React from 'react'
import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryCardProps {
    category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/shop?category=${category.slug.current}`} className="category-card category-card-compact">
            <div className="category-card-content">
                <h3 className="category-card-name">{category.name}</h3>
                {category.description && (
                    <p className="category-card-description">{category.description}</p>
                )}
                <span className="category-card-cta">
                    Explore Filters <span className="category-card-cta-icon">→</span>
                </span>
            </div>
        </Link>
    )
}

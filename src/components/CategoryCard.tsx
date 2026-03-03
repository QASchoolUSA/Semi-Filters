import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import type { Category } from '@/types'

interface CategoryCardProps {
    category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/categories/${category.slug.current}`} className="category-card">
            <div className="category-card-image-wrapper">
                {category.image ? (
                    <Image
                        src={urlFor(category.image).width(600).height(400).url()}
                        alt={category.name}
                        className="category-card-image"
                        width={600}
                        height={400}
                    />
                ) : (
                    <div className="category-card-placeholder">
                        <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                            <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
                            <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.3" />
                        </svg>
                    </div>
                )}
                <div className="category-card-overlay">
                    <h3 className="category-card-name">{category.name}</h3>
                    {category.description && (
                        <p className="category-card-description">{category.description}</p>
                    )}
                    <span className="category-card-cta">Shop Now →</span>
                </div>
            </div>
        </Link>
    )
}

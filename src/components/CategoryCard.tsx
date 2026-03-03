import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { getCategoryIcon } from '@/components/CategoryIcons'
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
                        {getCategoryIcon(category.slug.current, 64)}
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

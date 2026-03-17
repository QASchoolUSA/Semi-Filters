// Centralized TypeScript types for the Semi Filters application

// ---- Sanity Helpers ----
export interface SanitySlug {
    current: string
}

export interface SanityImage {
    _type: 'image'
    asset: {
        _ref: string
        _type: 'reference'
    }
}

// ---- Core Domain Types ----
export interface Product {
    _id: string
    name: string
    slug: SanitySlug
    images?: SanityImage[]
    price: number
    compareAtPrice?: number
    description?: any // Portable Text block array
    details?: any // Portable Text block array
    category?: CategoryRef
    specifications?: Specification[]
    partNumber?: string
    crossReferences?: string[]
    vehicleFit?: string[]
    inStock: boolean
    featured?: boolean
    seoTitle?: string
    seoDescription?: string
}

export interface CategoryRef {
    name: string
    slug: SanitySlug
}

export interface Category {
    _id: string
    name: string
    slug: SanitySlug
    description?: string
    image?: SanityImage | null
}

export interface Banner {
    _id?: string
    heading: string
    subheading?: string
    image?: SanityImage
    ctaText?: string
    ctaLink?: string
    discount?: string
}

export interface Specification {
    label: string
    value: string
}

// ---- Cart ----
export interface CartItem {
    _id: string
    name: string
    slug: string
    price: number
    quantity: number
    image?: SanityImage
    partNumber?: string
}

// Centralized TypeScript types for the Semi Filters application

// ---- Sanity Helpers ----
export interface SanitySlug {
    current: string
}

export interface SanityImage {
    _type?: 'image'
    asset?: {
        _ref: string
        _type?: 'reference'
    }
    [key: string]: unknown
}

// ---- Core Domain Types ----
export interface Product {
    _id: string
    name: string
    slug: SanitySlug
    images?: SanityImage[]
    price: number
    compareAtPrice?: number
    // Portable Text blocks from Sanity (kept loose for schema drift)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    description?: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any
    category?: CategoryRef
    categoryId?: string
    specifications?: Specification[]
    partNumber?: string
    crossReferences?: string[]
    vehicleFit?: string[]
    inStock: boolean
    featured?: boolean
    brand?: string
    productType?: string
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

// ---- Store management orders ----
export type OrderStatus = 'paid' | 'ready_to_ship' | 'shipped' | 'cancelled'

export interface OrderShippingAddress {
    name?: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
}

export interface OrderLineItem {
    name?: string
    quantity?: number
    unitAmount?: number
    partNumber?: string
}

export interface OrderParcel {
    length?: number
    width?: number
    height?: number
    weight?: number
}

export interface StoreOrder {
    _id: string
    _createdAt?: string
    stripeSessionId: string
    status: OrderStatus
    customerName?: string
    customerEmail?: string
    customerPhone?: string
    shippingAddress?: OrderShippingAddress
    lineItems?: OrderLineItem[]
    subtotal?: number
    shipping?: number
    tax?: number
    total?: number
    trackingNumber?: string
    trackingUrl?: string
    carrier?: string
    servicelevel?: string
    labelUrl?: string
    shippoRateId?: string
    shippoTransactionId?: string
    shippedAt?: string
    parcel?: OrderParcel
}

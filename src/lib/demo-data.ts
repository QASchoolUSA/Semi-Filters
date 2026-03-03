// Centralized demo/fallback data — single source of truth
// Used when Sanity CMS is not configured or returns no data

import type { Product, Category } from '@/types'

// ---- Categories ----
export const DEMO_CATEGORIES: Category[] = [
    { _id: '1', name: 'Oil Filters', slug: { current: 'oil-filters' }, description: 'Premium engine oil filtration for maximum protection. Designed for extended drain intervals in heavy-duty diesel engines.', image: null },
    { _id: '2', name: 'Air Filters', slug: { current: 'air-filters' }, description: 'High-flow air filtration for clean combustion. Keeps contaminants out of your engine for peak performance.', image: null },
    { _id: '3', name: 'Fuel Filters', slug: { current: 'fuel-filters' }, description: 'Protect your fuel system from contaminants. Water separators and fuel filters for all diesel engines.', image: null },
    { _id: '4', name: 'Cabin Filters', slug: { current: 'cabin-filters' }, description: 'Breathe clean air in your cab. HEPA-grade cabin air filters that remove dust, pollen, and exhaust fumes.', image: null },
]

// ---- Products ----
export const DEMO_PRODUCTS: Product[] = [
    { _id: 'p1', name: 'Heavy Duty Oil Filter - HD-9001', slug: { current: 'hd-oil-filter-9001' }, price: 24.99, compareAtPrice: 34.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'HD-9001', inStock: true, featured: true, images: [] },
    { _id: 'p2', name: 'Premium Air Filter - AF-5500', slug: { current: 'premium-air-filter-5500' }, price: 39.99, category: { name: 'Air Filters', slug: { current: 'air-filters' } }, partNumber: 'AF-5500', inStock: true, featured: true, images: [] },
    { _id: 'p3', name: 'Fuel Water Separator - FW-3200', slug: { current: 'fuel-water-separator-3200' }, price: 29.99, compareAtPrice: 39.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'FW-3200', inStock: true, featured: true, images: [] },
    { _id: 'p4', name: 'Cabin Air Filter - CA-7700', slug: { current: 'cabin-air-filter-7700' }, price: 19.99, category: { name: 'Cabin Filters', slug: { current: 'cabin-filters' } }, partNumber: 'CA-7700', inStock: true, featured: true, images: [] },
    { _id: 'p5', name: 'Synthetic Oil Filter - SO-1200', slug: { current: 'synthetic-oil-filter-1200' }, price: 32.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'SO-1200', inStock: true, featured: true, images: [] },
    { _id: 'p6', name: 'High Flow Air Filter - HF-8800', slug: { current: 'high-flow-air-filter-8800' }, price: 54.99, compareAtPrice: 69.99, category: { name: 'Air Filters', slug: { current: 'air-filters' } }, partNumber: 'HF-8800', inStock: false, featured: true, images: [] },
    { _id: 'p7', name: 'Diesel Fuel Filter - DF-4400', slug: { current: 'diesel-fuel-filter-4400' }, price: 27.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'DF-4400', inStock: true, featured: true, images: [] },
    { _id: 'p8', name: 'Extended Life Oil Filter - EL-6600', slug: { current: 'extended-life-oil-filter-6600' }, price: 42.99, compareAtPrice: 54.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'EL-6600', inStock: true, featured: true, images: [] },
    { _id: 'p9', name: 'Hydraulic Filter - HY-2100', slug: { current: 'hydraulic-filter-2100' }, price: 36.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'HY-2100', inStock: true, featured: false, images: [] },
    { _id: 'p10', name: 'Coolant Filter - CL-1500', slug: { current: 'coolant-filter-1500' }, price: 18.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'CL-1500', inStock: true, featured: false, images: [] },
    { _id: 'p11', name: 'Transmission Filter - TF-3300', slug: { current: 'transmission-filter-3300' }, price: 48.99, compareAtPrice: 59.99, category: { name: 'Oil Filters', slug: { current: 'oil-filters' } }, partNumber: 'TF-3300', inStock: true, featured: false, images: [] },
    { _id: 'p12', name: 'DEF Filter - DEF-900', slug: { current: 'def-filter-900' }, price: 22.99, category: { name: 'Fuel Filters', slug: { current: 'fuel-filters' } }, partNumber: 'DEF-900', inStock: true, featured: false, images: [] },
]

// ---- Featured Products (subset) ----
export const DEMO_FEATURED_PRODUCTS = DEMO_PRODUCTS.filter(p => p.featured)

// ---- Product Detail (with full specs) ----
export const DEMO_PRODUCT_DETAILS: Record<string, Product> = {
    'hd-oil-filter-9001': {
        ...DEMO_PRODUCTS[0],
        description: 'Our Heavy Duty Oil Filter HD-9001 is engineered for semi trucks operating under extreme conditions. This premium filter features a multi-layer synthetic media that captures particles as small as 10 microns while maintaining excellent oil flow. Designed for extended drain intervals, it reduces maintenance costs while providing maximum engine protection.',
        specifications: [
            { label: 'Thread Size', value: '1-16 UNS' },
            { label: 'Height', value: '7.2 inches' },
            { label: 'Outer Diameter', value: '4.6 inches' },
            { label: 'Micron Rating', value: '10 microns' },
            { label: 'Max Pressure', value: '150 PSI' },
            { label: 'Flow Rate', value: '12 GPM' },
        ],
        compatibility: ['Kenworth T680', 'Peterbilt 579', 'Freightliner Cascadia', 'Volvo VNL', 'International LT'],
    },
}

// ---- Category Page Data ----
export const DEMO_CATEGORY_DATA: Record<string, { category: Category; products: Product[] }> = {
    'oil-filters': {
        category: DEMO_CATEGORIES[0],
        products: DEMO_PRODUCTS.filter(p => p.category?.slug.current === 'oil-filters'),
    },
    'air-filters': {
        category: DEMO_CATEGORIES[1],
        products: DEMO_PRODUCTS.filter(p => p.category?.slug.current === 'air-filters'),
    },
    'fuel-filters': {
        category: DEMO_CATEGORIES[2],
        products: DEMO_PRODUCTS.filter(p => p.category?.slug.current === 'fuel-filters'),
    },
    'cabin-filters': {
        category: DEMO_CATEGORIES[3],
        products: DEMO_PRODUCTS.filter(p => p.category?.slug.current === 'cabin-filters'),
    },
}

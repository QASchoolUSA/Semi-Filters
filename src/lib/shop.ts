import type { Product } from '@/types'
import type { ShopFacetQueryResult } from '@/sanity/types'

export const SHOP_PAGE_SIZE = 24

export type ShopSort = 'default' | 'price-asc' | 'price-desc' | 'name'

export type ShopFilters = {
  category: string
  truck: string
  sort: ShopSort
  inStockOnly: boolean
  minPrice: number | null
  maxPrice: number | null
  page: number
}

export type ShopFacet = ShopFacetQueryResult[number]

export function parseShopFilters(params: {
  [key: string]: string | string[] | undefined
}): ShopFilters {
  const category = typeof params.category === 'string' ? params.category : 'all'
  const truck = typeof params.truck === 'string' ? params.truck : 'all'
  const sortRaw = typeof params.sort === 'string' ? params.sort : 'default'
  const sort: ShopSort =
    sortRaw === 'price-asc' || sortRaw === 'price-desc' || sortRaw === 'name'
      ? sortRaw
      : 'default'
  const inStockOnly = params.inStock === '1' || params.inStock === 'true'
  const minPrice =
    typeof params.minPrice === 'string' && params.minPrice !== ''
      ? Number(params.minPrice)
      : null
  const maxPrice =
    typeof params.maxPrice === 'string' && params.maxPrice !== ''
      ? Number(params.maxPrice)
      : null
  const pageRaw = typeof params.page === 'string' ? Number(params.page) : 1
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1

  return {
    category,
    truck,
    sort,
    inStockOnly,
    minPrice: minPrice !== null && !Number.isNaN(minPrice) ? minPrice : null,
    maxPrice: maxPrice !== null && !Number.isNaN(maxPrice) ? maxPrice : null,
    page,
  }
}

function productName(product: Product | ShopFacet) {
  return product.name ?? ''
}

function productPrice(product: Product | ShopFacet) {
  return product.price ?? 0
}

function matchesCategory(
  product: Product | ShopFacet,
  category: string,
  categoryName?: string
) {
  if (category === 'all') return true

  const slug =
    'categorySlug' in product
      ? product.categorySlug
      : 'category' in product
        ? product.category?.slug?.current
        : null
  if (slug === category) return true

  const nameHint =
    categoryName ||
    ('categoryName' in product ? product.categoryName : null) ||
    ('category' in product ? product.category?.name : null)
  if (nameHint) {
    const needle = nameHint.toLowerCase().replace(' filters', '').trim()
    if (needle && productName(product).toLowerCase().includes(needle)) return true
  }

  return false
}

function matchesTruck(product: Product | ShopFacet, truck: string) {
  if (truck === 'all') return true
  const target = truck.toLowerCase()
  if (product.vehicleFit?.some((v) => v && v.toLowerCase().includes(target))) return true
  return productName(product).toLowerCase().includes(target)
}

export function filterProducts<T extends Product | ShopFacet>(
  products: T[],
  filters: ShopFilters,
  categories?: { slug: { current: string }; name: string }[]
): T[] {
  const categoryName =
    filters.category !== 'all'
      ? categories?.find((c) => c.slug.current === filters.category)?.name
      : undefined

  return products.filter((product) => {
    if (!matchesCategory(product, filters.category, categoryName)) return false
    if (!matchesTruck(product, filters.truck)) return false
    if (filters.inStockOnly && product.inStock === false) return false
    if (filters.minPrice !== null && productPrice(product) < filters.minPrice) return false
    if (filters.maxPrice !== null && productPrice(product) > filters.maxPrice) return false
    return true
  })
}

export function sortProducts<T extends { name?: string | null; price?: number | null }>(
  products: T[],
  sort: ShopSort
): T[] {
  const sorted = [...products]
  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
      break
    case 'price-desc':
      sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
      break
    case 'name':
      sorted.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
      break
  }
  return sorted
}

export function paginateProducts<T>(products: T[], page: number, pageSize = SHOP_PAGE_SIZE) {
  const total = products.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    items: products.slice(start, start + pageSize),
    total,
    totalPages,
    page: safePage,
  }
}

export function buildCategoryCounts(
  facets: ShopFacet[],
  categories: { slug: { current: string }; name: string }[],
  filters: Omit<ShopFilters, 'category' | 'page'>
) {
  const baseFilters: ShopFilters = { ...filters, category: 'all', page: 1 }
  const base = filterProducts(facets, baseFilters, categories)
  const counts: Record<string, number> = { all: base.length }

  for (const cat of categories) {
    counts[cat.slug.current] = filterProducts(
      facets,
      { ...filters, category: cat.slug.current, page: 1 },
      categories
    ).length
  }

  return counts
}

export function collectTruckBrands(facets: ShopFacet[]) {
  const brands = new Set<string>([
    'Volvo',
    'Kenworth',
    'Freightliner',
    'Peterbilt',
    'Mack',
    'International',
  ])

  for (const p of facets) {
    p.vehicleFit?.forEach((v) => {
      if (v) {
        const normalized = v.trim().charAt(0).toUpperCase() + v.trim().slice(1).toLowerCase()
        brands.add(normalized)
      }
    })
    const lowerName = (p.name ?? '').toLowerCase()
    if (lowerName.includes('volvo')) brands.add('Volvo')
    if (lowerName.includes('kenworth')) brands.add('Kenworth')
    if (lowerName.includes('freightliner')) brands.add('Freightliner')
  }

  return Array.from(brands).sort()
}

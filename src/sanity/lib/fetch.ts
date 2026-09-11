import { cache } from 'react'
import type { QueryParams } from 'next-sanity'
import { client } from './client'
import {
  allCategoriesQuery,
  featuredProductsQuery,
  heroBannerQuery,
  productBySlugQuery,
  relatedProductsQuery,
  shopFacetQuery,
  allProductsQuery,
} from './queries'
import type { Banner, Category, Product } from '@/types'
import type { ShopFacetQueryResult } from '@/sanity/types'

const DEFAULT_REVALIDATE = 60

type SanityFetchOptions = {
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}

export async function sanityFetch<const Q extends string>(
  query: Q,
  { params = {}, revalidate = DEFAULT_REVALIDATE, tags = [] }: SanityFetchOptions = {}
) {
  return client.fetch(query, params, {
    next: {
      revalidate: typeof revalidate === 'number' ? revalidate : 0,
      tags,
    },
  })
}

function asProduct(value: unknown): Product | null {
  if (!value || typeof value !== 'object') return null
  const product = value as Product
  if (!product._id || !product.name || !product.slug?.current) return null
  return {
    ...product,
    price: product.price ?? 0,
    inStock: product.inStock !== false,
  }
}

function asProducts(value: unknown): Product[] {
  if (!Array.isArray(value)) return []
  return value.map(asProduct).filter((p): p is Product => p !== null)
}

function asCategories(value: unknown): Category[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (c): c is Category =>
      !!c &&
      typeof c === 'object' &&
      typeof (c as Category)._id === 'string' &&
      typeof (c as Category).name === 'string' &&
      !!(c as Category).slug?.current
  )
}

function asBanner(value: unknown): Banner | null {
  if (!value || typeof value !== 'object') return null
  const banner = value as Banner
  if (!banner.heading) return null
  return banner
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  try {
    const result = await sanityFetch(productBySlugQuery, {
      params: { slug },
      tags: [`product:${slug}`],
    })
    return asProduct(result)
  } catch (error) {
    console.error('Failed to fetch product by slug:', error)
    return null
  }
})

export const getRelatedProducts = cache(
  async (productId: string, categoryId: string | undefined): Promise<Product[]> => {
    if (!categoryId) {
      try {
        return asProducts(await sanityFetch(featuredProductsQuery, { tags: ['products'] }))
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
        return []
      }
    }

    try {
      const related = asProducts(
        await sanityFetch(relatedProductsQuery, {
          params: { productId, categoryId },
          tags: ['products', `related:${productId}`],
        })
      )
      if (related.length) return related

      return asProducts(await sanityFetch(featuredProductsQuery, { tags: ['products'] }))
    } catch (error) {
      console.error('Failed to fetch related products:', error)
      return []
    }
  }
)

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  try {
    return asProducts(await sanityFetch(featuredProductsQuery, { tags: ['products'] }))
  } catch (error) {
    console.error('Failed to fetch featured products:', error)
    return []
  }
})

export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    return asCategories(await sanityFetch(allCategoriesQuery, { tags: ['categories'] }))
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
})

export const getHeroBanner = cache(async (): Promise<Banner | null> => {
  try {
    return asBanner(await sanityFetch(heroBannerQuery, { tags: ['banner'] }))
  } catch (error) {
    console.error('Failed to fetch hero banner:', error)
    return null
  }
})

export const getAllProducts = cache(async (): Promise<Product[]> => {
  try {
    return asProducts(await sanityFetch(allProductsQuery, { tags: ['products'] }))
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
})

export const getShopFacets = cache(async (): Promise<ShopFacetQueryResult> => {
  try {
    return (await sanityFetch(shopFacetQuery, { tags: ['products'] })) ?? []
  } catch (error) {
    console.error('Failed to fetch shop facets:', error)
    return []
  }
})

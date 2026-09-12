import { cache } from 'react'
import type { QueryParams } from 'next-sanity'
import { client } from './client'
import {
  allCategoriesQuery,
  allGuidesQuery,
  categoryBySlugQuery,
  featuredProductsQuery,
  guideBySlugQuery,
  heroBannerQuery,
  productBySlugQuery,
  productsByCategorySlugQuery,
  productsByTruckBrandQuery,
  relatedProductsQuery,
  shopFacetQuery,
  allProductsQuery,
} from './queries'
import type { Banner, Category, Guide, Product } from '@/types'
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

function asGuide(value: unknown): Guide | null {
  if (!value || typeof value !== 'object') return null
  const guide = value as Guide
  if (!guide._id || !guide.title || !guide.slug?.current) return null
  return guide
}

function asGuides(value: unknown): Guide[] {
  if (!Array.isArray(value)) return []
  return value.map(asGuide).filter((g): g is Guide => g !== null)
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

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  try {
    const result = await sanityFetch(categoryBySlugQuery, {
      params: { slug },
      tags: [`category:${slug}`],
    })
    if (!result || typeof result !== 'object') return null
    const category = result as Category
    if (!category._id || !category.name || !category.slug?.current) return null
    return category
  } catch (error) {
    console.error('Failed to fetch category by slug:', error)
    return null
  }
})

export const getProductsByCategorySlug = cache(async (slug: string): Promise<Product[]> => {
  try {
    return asProducts(
      await sanityFetch(productsByCategorySlugQuery, {
        params: { slug },
        tags: ['products', `category:${slug}`],
      })
    )
  } catch (error) {
    console.error('Failed to fetch products by category:', error)
    return []
  }
})

export const getProductsByTruckBrand = cache(async (brand: string): Promise<Product[]> => {
  try {
    return asProducts(
      await sanityFetch(productsByTruckBrandQuery, {
        params: { brand },
        tags: ['products', `truck:${brand}`],
      })
    )
  } catch (error) {
    console.error('Failed to fetch products by truck brand:', error)
    return []
  }
})

export const getGuides = cache(async (): Promise<Guide[]> => {
  try {
    return asGuides(await sanityFetch(allGuidesQuery, { tags: ['guides'] }))
  } catch (error) {
    console.error('Failed to fetch guides:', error)
    return []
  }
})

export const getGuideBySlug = cache(async (slug: string): Promise<Guide | null> => {
  try {
    return asGuide(
      await sanityFetch(guideBySlugQuery, {
        params: { slug },
        tags: [`guide:${slug}`],
      })
    )
  } catch (error) {
    console.error('Failed to fetch guide by slug:', error)
    return null
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

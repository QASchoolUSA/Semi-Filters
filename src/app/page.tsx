import React from 'react'
import { client } from '@/sanity/lib/client'
import { heroBannerQuery, featuredProductsQuery, allCategoriesQuery } from '@/sanity/lib/queries'
import HeroBanner from '@/components/HeroBanner'
import HomeClient from '@/components/HomeClient'
import type { Product, Category, Banner } from '@/types'

export const revalidate = 60

async function getData() {
  const [banner, products, categories] = await Promise.all([
    client.fetch(heroBannerQuery).catch(() => null) as Promise<Banner | null>,
    client.fetch(featuredProductsQuery).catch(() => []) as Promise<Product[]>,
    client.fetch(allCategoriesQuery).catch(() => []) as Promise<Category[]>,
  ])
  return { banner, products, categories }
}

export default async function HomePage() {
  const { banner, products, categories } = await getData()

  return (
    <>
      <HeroBanner banner={banner} />
      <HomeClient products={products} categories={categories} />
    </>
  )
}

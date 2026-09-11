import React from 'react'
import { getCategories, getFeaturedProducts, getHeroBanner } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import HeroBanner from '@/components/HeroBanner'
import HomeClient from '@/components/HomeClient'
import type { Product } from '@/types'

export const revalidate = 60

const BASE_URL = 'https://semifilters.com'

async function getData() {
  const [banner, products, categories] = await Promise.all([
    getHeroBanner(),
    getFeaturedProducts(),
    getCategories(),
  ])
  return { banner, products, categories }
}

function buildHomeJsonLd(products: Product[]) {
  const itemList = products.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${BASE_URL}/shop/${p.slug.current}`,
    name: p.name,
    image: p.images?.[0] ? urlFor(p.images[0]).width(400).height(400).url() : undefined,
  }))

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${BASE_URL}/#homepage`,
      name: 'Semi Filters — Premium Filtration for Semi Trucks',
      description:
        'OEM-quality oil, air, fuel, and cabin filters for semi trucks. Trusted by owner-operators and fleets across the United States.',
      url: BASE_URL,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      mainEntity: {
        '@type': 'ItemList',
        name: 'Featured Semi Truck Filters',
        numberOfItems: products.length,
        itemListElement: itemList,
      },
    },
  ]
}

export default async function HomePage() {
  const { banner, products, categories } = await getData()
  const homeJsonLd = buildHomeJsonLd(products)

  return (
    <>
      {homeJsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <HeroBanner banner={banner} products={products} />
      <HomeClient products={products} categories={categories} />
    </>
  )
}

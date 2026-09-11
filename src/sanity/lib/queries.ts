import { defineQuery } from 'next-sanity'

/** Shared product card fields — no portable text, first image only */
const productCardProjection = `{
  _id,
  name,
  slug,
  "images": images[0...1],
  price,
  compareAtPrice,
  category->{name, slug},
  partNumber,
  crossReferences,
  vehicleFit,
  inStock,
  featured,
  brand,
  productType
}`

const publishedProduct = `_type == "product" && published != false && defined(slug.current)`

export const allProductsQuery = defineQuery(`*[${publishedProduct}] | order(_createdAt desc) ${productCardProjection}`)

export const productBySlugQuery = defineQuery(`*[${publishedProduct} && slug.current == $slug][0] {
  _id,
  name,
  slug,
  images,
  price,
  compareAtPrice,
  description,
  details,
  category->{name, slug},
  "categoryId": category._ref,
  specifications,
  partNumber,
  crossReferences,
  vehicleFit,
  inStock,
  featured,
  brand,
  productType,
  seoTitle,
  seoDescription
}`)

export const featuredProductsQuery = defineQuery(`*[${publishedProduct}] | order(featured desc, _createdAt desc) [0...8] ${productCardProjection}`)

export const relatedProductsQuery = defineQuery(`*[
  ${publishedProduct}
  && _id != $productId
  && category._ref == $categoryId
] | order(_createdAt desc) [0...4] ${productCardProjection}`)

export const allCategoriesQuery = defineQuery(`*[_type == "category"] | order(order asc) {
  _id,
  name,
  slug,
  description,
  image
}`)

export const searchProductsQuery = defineQuery(`*[${publishedProduct} && (
  partNumber match $term ||
  name match $term ||
  pt::text(description) match $term ||
  $rawTerm in crossReferences ||
  count(crossReferences[@ match $term]) > 0
)] | order(_createdAt desc) [0...12] {
  _id,
  name,
  slug,
  "images": images[0...1],
  price,
  compareAtPrice,
  category->{name, slug},
  partNumber,
  crossReferences,
  inStock
}`)

export const productSlugsByIdsQuery = defineQuery(`*[${publishedProduct} && _id in $ids] {
  _id,
  "slug": slug.current
}`)

export const productSitemapQuery = defineQuery(`*[${publishedProduct}] {
  slug,
  _updatedAt
}`)

export const categorySitemapQuery = defineQuery(`*[_type == "category" && defined(slug.current)] {
  slug,
  _updatedAt
}`)

export const heroBannerQuery = defineQuery(`*[_type == "banner" && isActive == true][0] {
  _id,
  heading,
  subheading,
  image,
  ctaText,
  ctaLink,
  discount
}`)

/** Lightweight rows for shop facet counts (all published products) */
export const shopFacetQuery = defineQuery(`*[${publishedProduct}] {
  _id,
  name,
  price,
  inStock,
  vehicleFit,
  "categorySlug": category->slug.current,
  "categoryName": category->name
}`)

const orderProjection = `{
  _id,
  _createdAt,
  stripeSessionId,
  status,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  lineItems,
  subtotal,
  shipping,
  tax,
  total,
  trackingNumber,
  trackingUrl,
  carrier,
  servicelevel,
  labelUrl,
  shippoRateId,
  shippoTransactionId,
  shippedAt,
  parcel
}`

export const allOrdersQuery = defineQuery(`*[_type == "order"] | order(_createdAt desc) [0...100] ${orderProjection}`)

export const unshippedOrdersQuery = defineQuery(`*[_type == "order" && status in ["paid", "ready_to_ship"]] | order(_createdAt desc) [0...100] ${orderProjection}`)

export const orderByIdQuery = defineQuery(`*[_type == "order" && _id == $id][0] ${orderProjection}`)

export const orderByStripeSessionQuery = defineQuery(`*[_type == "order" && stripeSessionId == $sessionId][0] { _id }`)

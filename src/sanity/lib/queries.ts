// GROQ queries for fetching data from Sanity

export const allProductsQuery = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  name,
  slug,
  images,
  price,
  compareAtPrice,
  description,
  category->{name, slug},
  partNumber,
  crossReferences,
  vehicleFit,
  inStock,
  featured
}`

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  images,
  price,
  compareAtPrice,
  description,
  details,
  category->{name, slug},
  specifications,
  partNumber,
  crossReferences,
  vehicleFit,
  inStock,
  featured
}`

export const featuredProductsQuery = `*[_type == "product"] | order(featured desc, _createdAt desc) [0...8] {
  _id,
  name,
  slug,
  images,
  price,
  compareAtPrice,
  description,
  category->{name, slug},
  partNumber,
  crossReferences,
  vehicleFit,
  inStock,
  featured
}`

export const productsByCategoryQuery = `*[_type == "product" && category->slug.current == $categorySlug] | order(_createdAt desc) {
  _id,
  name,
  slug,
  images,
  price,
  compareAtPrice,
  description,
  category->{name, slug},
  partNumber,
  crossReferences,
  vehicleFit,
  inStock,
  featured
}`

export const allCategoriesQuery = `*[_type == "category"] | order(order asc) {
  _id,
  name,
  slug,
  description,
  image
}`

export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  description,
  image
}`

export const searchProductsQuery = `*[_type == "product" && (
  partNumber match $term ||
  name match $term ||
  pt::text(description) match $term ||
  $rawTerm in crossReferences ||
  count(crossReferences[@ match $term]) > 0
)] | order(_createdAt desc) [0...12] {
  _id,
  name,
  slug,
  images,
  price,
  compareAtPrice,
  category->{name, slug},
  partNumber,
  crossReferences,
  inStock
}`

export const productSlugsByIdsQuery = `*[_type == "product" && _id in $ids] {
  _id,
  "slug": slug.current
}`

export const heroBannerQuery = `*[_type == "banner" && isActive == true][0] {
  _id,
  heading,
  subheading,
  image,
  ctaText,
  ctaLink,
  discount
}`

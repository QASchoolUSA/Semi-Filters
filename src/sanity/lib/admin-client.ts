import { createClient } from 'next-sanity'
import type { QueryParams } from 'next-sanity'

/** Fresh reads for store-management (never CDN — orders must show immediately after write). */
export const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4jrvr61',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-03-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function adminFetch<const Q extends string>(
  query: Q,
  params: QueryParams = {}
) {
  return adminClient.fetch(query, params, {
    next: { revalidate: 0, tags: ['orders'] },
  })
}

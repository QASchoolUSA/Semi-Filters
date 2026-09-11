import { createClient, type QueryParams } from 'next-sanity'

/**
 * Store-management reads: API direct (no CDN) so new orders show immediately.
 *
 * Intentionally **no token**. The previous regression was attaching SANITY_API_TOKEN
 * to these reads — a rejected/expired/mismatched token returns
 * "Unauthorized - Session not found" even for public datasets. Writes still use
 * writeClient + SANITY_API_TOKEN.
 */
export const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4jrvr61',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-03-01',
  useCdn: false,
})

export async function adminFetch<const Q extends string>(
  query: Q,
  params: QueryParams = {}
) {
  return adminClient.fetch(query, params, {
    cache: 'no-store',
    next: { tags: ['orders'] },
  })
}

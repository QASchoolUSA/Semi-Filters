import { createClient } from 'next-sanity'

/** Strip Vercel/env footguns: quotes, Bearer prefix, whitespace. */
export function sanitizeSanityToken(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  let token = raw.trim()
  if (
    (token.startsWith('"') && token.endsWith('"')) ||
    (token.startsWith("'") && token.endsWith("'"))
  ) {
    token = token.slice(1, -1).trim()
  }
  if (token.toLowerCase().startsWith('bearer ')) {
    token = token.slice(7).trim()
  }
  return token || undefined
}

export function getSanityProjectId() {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4jrvr61'
}

export function getSanityDataset() {
  return process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
}

const token = sanitizeSanityToken(process.env.SANITY_API_TOKEN)

/** Mutations only (webhook upserts, label patches, GSC connection). */
export const writeClient = createClient({
  projectId: getSanityProjectId(),
  dataset: getSanityDataset(),
  apiVersion: '2025-03-01',
  useCdn: false,
  token,
})

export function hasSanityWriteToken() {
  return Boolean(token)
}

/** Live check used by GSC connect/status — does not leak the token. */
export async function probeSanityWriteAccess(): Promise<{
  ok: boolean
  projectId: string
  dataset: string
  tokenPresent: boolean
  tokenLength: number
  error?: string
}> {
  const projectId = getSanityProjectId()
  const dataset = getSanityDataset()
  const present = Boolean(token)

  if (!present) {
    return {
      ok: false,
      projectId,
      dataset,
      tokenPresent: false,
      tokenLength: 0,
      error: 'SANITY_API_TOKEN is not set',
    }
  }

  try {
    // Fresh client so we always use the sanitized token.
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2025-03-01',
      useCdn: false,
      token,
    })
    await client.fetch(`count(*[_type == "product"])`, {}, { cache: 'no-store' })
    return {
      ok: true,
      projectId,
      dataset,
      tokenPresent: true,
      tokenLength: token!.length,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      ok: false,
      projectId,
      dataset,
      tokenPresent: true,
      tokenLength: token!.length,
      error: message,
    }
  }
}

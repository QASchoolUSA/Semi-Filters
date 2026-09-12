import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'
import { google } from 'googleapis'
import type { Credentials } from 'google-auth-library'
import { adminClient } from '@/sanity/lib/admin-client'
import { writeClient } from '@/sanity/lib/write-client'

export const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'
export const GSC_CONNECTION_DOC_ID = 'gscConnection'

export type GscRangeDays = 7 | 28 | 90

export type GscMetrics = {
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export type GscDimensionRow = GscMetrics & {
  key: string
}

export type GscDateRow = GscMetrics & {
  date: string
}

export type StoredGscConnection = {
  refreshToken: string
  siteUrl: string
}

export class GscNotConnectedError extends Error {
  readonly code = 'not_connected' as const

  constructor(message = 'Google Search Console is not connected') {
    super(message)
    this.name = 'GscNotConnectedError'
  }
}

export class GscConfigError extends Error {
  readonly code = 'misconfigured' as const

  constructor(message: string) {
    super(message)
    this.name = 'GscConfigError'
  }
}

function isSanitySessionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return /session not found/i.test(message) || /SIO-401-ANF/i.test(message)
}

export function humanizeGscError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  if (isSanitySessionError(error)) {
    return 'Sanity API credentials failed (this is not the store login). Update SANITY_API_TOKEN in your env, then restart the server.'
  }
  return message || 'Failed to load Search Console data'
}

function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** GSC data typically lags ~2 days; end on UTC yesterday-minus-one. */
export function getDateRange(days: GscRangeDays): { startDate: string; endDate: string } {
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)
  end.setUTCDate(end.getUTCDate() - 2)

  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (days - 1))

  return {
    startDate: formatUtcDate(start),
    endDate: formatUtcDate(end),
  }
}

export function parseGscRange(value: string | null): GscRangeDays {
  if (value === '7' || value === '90') return Number(value) as GscRangeDays
  return 28
}

/** Public origin for OAuth redirect_uri. Prefer the live request host. */
export function resolveRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const host = forwardedHost || request.headers.get('host')?.trim()
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()

  if (host) {
    const proto =
      forwardedProto ||
      (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https')
    return `${proto}://${host}`.replace(/\/$/, '')
  }

  try {
    const fromUrl = new URL(request.url).origin
    if (fromUrl && !fromUrl.includes('localhost') && !fromUrl.includes('127.0.0.1')) {
      return fromUrl
    }
  } catch {
    // ignore
  }

  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://semifilters.com').replace(/\/$/, '')
}

export function getGscRedirectUri(origin?: string): string {
  const base = (origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://semifilters.com').replace(
    /\/$/,
    ''
  )
  return `${base}/api/store-management/gsc/callback`
}

export function isGscOAuthReady(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
}

/** Fail before Google OAuth if we cannot persist the refresh token afterward. */
export function assertGscStorageReady() {
  if (!process.env.AUTH_SECRET) {
    throw new GscConfigError(
      'AUTH_SECRET is missing on the server — cannot encrypt the Google refresh token'
    )
  }
  if (!process.env.SANITY_API_TOKEN) {
    throw new GscConfigError(
      'SANITY_API_TOKEN is missing on the server — cannot save the Search Console connection'
    )
  }
}

function getEncryptionKey() {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new GscConfigError('AUTH_SECRET is required to store Search Console credentials')
  }
  return scryptSync(secret, 'semi-filters-gsc-v1', 32)
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [
    'v1',
    iv.toString('base64url'),
    tag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join(':')
}

export function decryptSecret(payload: string): string {
  const [version, ivB64, tagB64, dataB64] = payload.split(':')
  if (version !== 'v1' || !ivB64 || !tagB64 || !dataB64) {
    throw new GscConfigError('Invalid encrypted Search Console token')
  }
  const decipher = createDecipheriv(
    'aes-256-gcm',
    getEncryptionKey(),
    Buffer.from(ivB64, 'base64url')
  )
  decipher.setAuthTag(Buffer.from(tagB64, 'base64url'))
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64url')),
    decipher.final(),
  ]).toString('utf8')
}

function getOAuth2Client(origin?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new GscConfigError('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required')
  }

  return new google.auth.OAuth2(clientId, clientSecret, getGscRedirectUri(origin))
}

export function getGscAuthUrl(origin?: string): string {
  const client = getOAuth2Client(origin)
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [GSC_SCOPE],
  })
}

export async function exchangeGscCode(code: string, origin?: string) {
  const client = getOAuth2Client(origin)
  const { tokens } = await client.getToken(code)
  return tokens
}

function preferredHostname(): string {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://semifilters.com'
    return new URL(base).hostname.replace(/^www\./, '')
  } catch {
    return 'semifilters.com'
  }
}

export async function resolveGscSiteUrl(credentials: Credentials): Promise<string> {
  const override = process.env.GSC_SITE_URL?.trim()
  if (override) return override

  const auth = getOAuth2Client()
  auth.setCredentials(credentials)
  const searchconsole = google.searchconsole({ version: 'v1', auth })
  const { data } = await searchconsole.sites.list()
  const entries = (data.siteEntry || []).filter((e) => e.siteUrl)

  if (entries.length === 0) {
    throw new GscConfigError(
      'No Search Console properties found for this Google account. Add semifilters.com in GSC first.'
    )
  }

  const host = preferredHostname()
  const match =
    entries.find((e) => e.siteUrl === `sc-domain:${host}`) ||
    entries.find((e) => e.siteUrl === `https://${host}/`) ||
    entries.find((e) => e.siteUrl === `https://www.${host}/`) ||
    entries.find((e) => e.siteUrl?.includes(host))

  if (match?.siteUrl) return match.siteUrl
  if (entries.length === 1 && entries[0].siteUrl) return entries[0].siteUrl

  throw new GscConfigError(
    `Could not pick a Search Console property for ${host}. Set GSC_SITE_URL explicitly.`
  )
}

export async function saveGscConnection(refreshToken: string, siteUrl: string) {
  assertGscStorageReady()

  try {
    await writeClient.createOrReplace({
      _id: GSC_CONNECTION_DOC_ID,
      _type: 'gscConnection',
      refreshTokenEncrypted: encryptSecret(refreshToken),
      siteUrl,
      connectedAt: new Date().toISOString(),
    })
  } catch (error) {
    if (isSanitySessionError(error)) {
      throw new GscConfigError(humanizeGscError(error))
    }
    throw new GscConfigError(
      error instanceof Error
        ? `Failed to save Search Console connection: ${error.message}`
        : 'Failed to save Search Console connection'
    )
  }

  // Confirm the published doc is readable (same path the dashboard uses).
  const stored = await getStoredGscConnection()
  if (!stored?.refreshToken || stored.siteUrl !== siteUrl) {
    throw new GscConfigError(
      'Connection was written but could not be read back. Check Sanity API permissions and try again.'
    )
  }
}

export async function clearGscConnection() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new GscConfigError('SANITY_API_TOKEN is required')
  }
  try {
    await writeClient.delete(GSC_CONNECTION_DOC_ID)
  } catch {
    // Document may not exist
  }
}

export async function getStoredGscConnection(): Promise<StoredGscConnection | null> {
  const envToken = process.env.GOOGLE_REFRESH_TOKEN?.trim()
  const envSite = process.env.GSC_SITE_URL?.trim()
  if (envToken && envSite) {
    return { refreshToken: envToken, siteUrl: envSite }
  }

  // Read without SANITY_API_TOKEN — a rejected token returns
  // "Unauthorized - Session not found" even on public datasets.
  try {
    const doc = await adminClient.fetch<{
      refreshTokenEncrypted?: string
      siteUrl?: string
    } | null>(
      `*[_id == $id][0]{ refreshTokenEncrypted, siteUrl }`,
      { id: GSC_CONNECTION_DOC_ID },
      { cache: 'no-store' }
    )

    if (!doc?.refreshTokenEncrypted || !doc.siteUrl) {
      return null
    }

    return {
      refreshToken: decryptSecret(doc.refreshTokenEncrypted),
      siteUrl: doc.siteUrl,
    }
  } catch (error) {
    if (isSanitySessionError(error)) {
      throw new GscConfigError(humanizeGscError(error))
    }
    throw error
  }
}

export async function isGscConnected(): Promise<boolean> {
  if (!isGscOAuthReady()) return false
  const connection = await getStoredGscConnection()
  return Boolean(connection?.refreshToken && connection.siteUrl)
}

async function getSearchConsole() {
  const connection = await getStoredGscConnection()
  if (!connection) {
    throw new GscNotConnectedError()
  }

  const auth = getOAuth2Client()
  auth.setCredentials({ refresh_token: connection.refreshToken })
  return {
    searchconsole: google.searchconsole({ version: 'v1', auth }),
    siteUrl: connection.siteUrl,
  }
}

type ApiRow = {
  keys?: string[] | null
  clicks?: number | null
  impressions?: number | null
  ctr?: number | null
  position?: number | null
}

function toMetrics(row: ApiRow): GscMetrics {
  return {
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  }
}

function aggregateTotals(rows: ApiRow[]): GscMetrics {
  let clicks = 0
  let impressions = 0
  let positionWeighted = 0

  for (const row of rows) {
    const c = row.clicks ?? 0
    const i = row.impressions ?? 0
    const p = row.position ?? 0
    clicks += c
    impressions += i
    positionWeighted += p * i
  }

  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    position: impressions > 0 ? positionWeighted / impressions : 0,
  }
}

async function queryDimension(
  dimensions: string[],
  days: GscRangeDays,
  rowLimit = 50
): Promise<{ rows: ApiRow[]; startDate: string; endDate: string }> {
  const { searchconsole, siteUrl } = await getSearchConsole()
  const { startDate, endDate } = getDateRange(days)

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions,
      rowLimit,
      dataState: 'final',
    },
  })

  return {
    rows: (res.data.rows || []) as ApiRow[],
    startDate,
    endDate,
  }
}

export async function fetchGscOverview(days: GscRangeDays) {
  const [byDate, byCountry, byDevice] = await Promise.all([
    queryDimension(['date'], days, 100),
    queryDimension(['country'], days, 25),
    queryDimension(['device'], days, 10),
  ])

  const series: GscDateRow[] = byDate.rows
    .map((row) => ({
      date: row.keys?.[0] || '',
      ...toMetrics(row),
    }))
    .filter((row) => row.date)
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    startDate: byDate.startDate,
    endDate: byDate.endDate,
    totals: aggregateTotals(byDate.rows),
    series,
    countries: byCountry.rows.map((row) => ({
      key: (row.keys?.[0] || '').toUpperCase(),
      ...toMetrics(row),
    })),
    devices: byDevice.rows.map((row) => ({
      key: row.keys?.[0] || '',
      ...toMetrics(row),
    })),
  }
}

export async function fetchGscQueries(days: GscRangeDays, rowLimit = 50) {
  const { rows, startDate, endDate } = await queryDimension(['query'], days, rowLimit)
  return {
    startDate,
    endDate,
    rows: rows.map((row) => ({
      key: row.keys?.[0] || '',
      ...toMetrics(row),
    })),
  }
}

export async function fetchGscPages(days: GscRangeDays, rowLimit = 50) {
  const { rows, startDate, endDate } = await queryDimension(['page'], days, rowLimit)
  return {
    startDate,
    endDate,
    rows: rows.map((row) => ({
      key: row.keys?.[0] || '',
      ...toMetrics(row),
    })),
  }
}

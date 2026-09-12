import { NextResponse } from 'next/server'
import {
  exchangeGscCode,
  GscConfigError,
  resolveGscSiteUrl,
  resolveRequestOrigin,
  saveGscConnection,
  verifyGscOAuthState,
} from '@/lib/gsc'

function redirectWithError(seoUrl: URL, message: string) {
  seoUrl.searchParams.set('error', message.slice(0, 300))
  return NextResponse.redirect(seoUrl)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const oauthError = searchParams.get('error')
  const state = searchParams.get('state')
  const origin = resolveRequestOrigin(request)
  const seoUrl = new URL('/store-management/seo', origin)

  // Never return bare JSON here — Google lands the browser on this URL.
  if (oauthError) {
    return redirectWithError(seoUrl, oauthError)
  }

  if (!code) {
    return redirectWithError(seoUrl, 'missing_code')
  }

  try {
    // Auth cookie is unreliable on the Google → app hop; signed state is the source of truth.
    verifyGscOAuthState(state)

    const tokens = await exchangeGscCode(code, origin)
    const refreshToken = tokens.refresh_token

    if (!refreshToken) {
      return redirectWithError(seoUrl, 'no_refresh_token')
    }

    const siteUrl = await resolveGscSiteUrl(tokens)
    await saveGscConnection(refreshToken, siteUrl)

    seoUrl.searchParams.set('connected', '1')
    return NextResponse.redirect(seoUrl)
  } catch (error) {
    console.error('[gsc/callback]', error)
    if (error instanceof GscConfigError) {
      return redirectWithError(seoUrl, error.message)
    }
    return redirectWithError(
      seoUrl,
      error instanceof Error ? `oauth_failed: ${error.message}` : 'oauth_failed'
    )
  }
}

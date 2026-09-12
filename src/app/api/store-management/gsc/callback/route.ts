import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  exchangeGscCode,
  GscConfigError,
  resolveGscSiteUrl,
  saveGscConnection,
} from '@/lib/gsc'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const oauthError = searchParams.get('error')
  const origin = new URL(request.url).origin
  const seoUrl = new URL('/store-management/seo', origin)

  if (oauthError) {
    seoUrl.searchParams.set('error', oauthError)
    return NextResponse.redirect(seoUrl)
  }

  if (!code) {
    seoUrl.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(seoUrl)
  }

  try {
    const tokens = await exchangeGscCode(code)
    const refreshToken = tokens.refresh_token

    if (!refreshToken) {
      seoUrl.searchParams.set('error', 'no_refresh_token')
      return NextResponse.redirect(seoUrl)
    }

    const siteUrl = await resolveGscSiteUrl(tokens)
    await saveGscConnection(refreshToken, siteUrl)

    seoUrl.searchParams.set('connected', '1')
    return NextResponse.redirect(seoUrl)
  } catch (error) {
    console.error('[gsc/callback]', error)
    if (error instanceof GscConfigError) {
      seoUrl.searchParams.set('error', error.message)
    } else {
      seoUrl.searchParams.set('error', 'oauth_failed')
    }
    return NextResponse.redirect(seoUrl)
  }
}

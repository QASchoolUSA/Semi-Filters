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
  const searchUrl = new URL('/store-management/search', origin)

  if (oauthError) {
    searchUrl.searchParams.set('error', oauthError)
    return NextResponse.redirect(searchUrl)
  }

  if (!code) {
    searchUrl.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(searchUrl)
  }

  try {
    const tokens = await exchangeGscCode(code)
    const refreshToken = tokens.refresh_token

    if (!refreshToken) {
      searchUrl.searchParams.set('error', 'no_refresh_token')
      return NextResponse.redirect(searchUrl)
    }

    const siteUrl = await resolveGscSiteUrl(tokens)
    await saveGscConnection(refreshToken, siteUrl)

    searchUrl.searchParams.set('connected', '1')
    return NextResponse.redirect(searchUrl)
  } catch (error) {
    console.error('[gsc/callback]', error)
    if (error instanceof GscConfigError) {
      searchUrl.searchParams.set('error', error.message)
    } else {
      searchUrl.searchParams.set('error', 'oauth_failed')
    }
    return NextResponse.redirect(searchUrl)
  }
}

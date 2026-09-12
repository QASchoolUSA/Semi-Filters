import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  createGscOAuthState,
  getGscAuthUrl,
  isGscOAuthReady,
  resolveRequestOrigin,
} from '@/lib/gsc'

export async function GET(request: Request) {
  const session = await auth()
  const origin = resolveRequestOrigin(request)
  const seoUrl = new URL('/store-management/seo', origin)

  if (!session?.user) {
    seoUrl.searchParams.set('error', 'sign_in_required')
    return NextResponse.redirect(seoUrl)
  }

  if (!isGscOAuthReady()) {
    seoUrl.searchParams.set('error', 'oauth_not_configured')
    return NextResponse.redirect(seoUrl)
  }

  if (!process.env.AUTH_SECRET) {
    seoUrl.searchParams.set('error', 'AUTH_SECRET is missing on the server')
    return NextResponse.redirect(seoUrl)
  }

  if (!process.env.SANITY_API_TOKEN) {
    seoUrl.searchParams.set(
      'error',
      'SANITY_API_TOKEN is missing on the server — add it in Vercel env, then reconnect'
    )
    return NextResponse.redirect(seoUrl)
  }

  try {
    const subject =
      (typeof session.user.email === 'string' && session.user.email) ||
      (typeof session.user.name === 'string' && session.user.name) ||
      'store-user'
    const state = createGscOAuthState(subject)
    const url = getGscAuthUrl(origin, state)
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('[gsc/connect]', error)
    seoUrl.searchParams.set(
      'error',
      error instanceof Error ? error.message : 'Failed to start OAuth'
    )
    return NextResponse.redirect(seoUrl)
  }
}

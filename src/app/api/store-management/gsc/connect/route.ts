import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  assertGscStorageReady,
  createGscOAuthState,
  getGscAuthUrl,
  isGscOAuthReady,
  resolveRequestOrigin,
} from '@/lib/gsc'

export async function GET(request: Request) {
  const session = await auth()
  const origin = resolveRequestOrigin(request)
  const seoUrl = new URL('/store-management/seo', origin)

  if (!session?.user?.email) {
    seoUrl.searchParams.set('error', 'sign_in_required')
    return NextResponse.redirect(seoUrl)
  }

  if (!isGscOAuthReady()) {
    seoUrl.searchParams.set('error', 'oauth_not_configured')
    return NextResponse.redirect(seoUrl)
  }

  try {
    await assertGscStorageReady()
    const state = createGscOAuthState(session.user.email)
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

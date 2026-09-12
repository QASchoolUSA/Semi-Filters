import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  createGscOAuthState,
  getGscAuthUrl,
  isGscOAuthReady,
  resolveRequestOrigin,
  assertGscStorageReady,
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

  try {
    // Validate Sanity token BEFORE sending the user to Google.
    await assertGscStorageReady()
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
      error instanceof Error ? error.message.slice(0, 400) : 'Failed to start OAuth'
    )
    return NextResponse.redirect(seoUrl)
  }
}

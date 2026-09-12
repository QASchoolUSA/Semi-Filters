import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  assertGscStorageReady,
  getGscAuthUrl,
  isGscOAuthReady,
  resolveRequestOrigin,
} from '@/lib/gsc'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const origin = resolveRequestOrigin(request)
  const seoUrl = new URL('/store-management/seo', origin)

  if (!isGscOAuthReady()) {
    seoUrl.searchParams.set('error', 'oauth_not_configured')
    return NextResponse.redirect(seoUrl)
  }

  try {
    assertGscStorageReady()
    const url = getGscAuthUrl(origin)
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

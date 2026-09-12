import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getGscAuthUrl, isGscOAuthReady, resolveRequestOrigin } from '@/lib/gsc'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isGscOAuthReady()) {
    return NextResponse.json(
      {
        error:
          'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set before connecting Search Console',
      },
      { status: 503 }
    )
  }

  try {
    const origin = resolveRequestOrigin(request)
    const url = getGscAuthUrl(origin)
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('[gsc/connect]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start OAuth' },
      { status: 500 }
    )
  }
}

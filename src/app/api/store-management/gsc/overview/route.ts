import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  fetchGscOverview,
  GscConfigError,
  GscNotConnectedError,
  isGscConnected,
  isGscOAuthReady,
  parseGscRange,
} from '@/lib/gsc'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    if (!isGscOAuthReady()) {
      return NextResponse.json(
        { status: 'misconfigured', error: 'OAuth client env vars are missing' },
        { status: 503 }
      )
    }

    if (!(await isGscConnected())) {
      return NextResponse.json({ status: 'not_connected' })
    }

    const { searchParams } = new URL(request.url)
    const range = parseGscRange(searchParams.get('range'))
    const data = await fetchGscOverview(range)
    return NextResponse.json({ status: 'ok', range, ...data })
  } catch (error) {
    if (error instanceof GscNotConnectedError) {
      return NextResponse.json({ status: 'not_connected' })
    }
    if (error instanceof GscConfigError) {
      return NextResponse.json(
        { status: 'misconfigured', error: error.message },
        { status: 503 }
      )
    }
    console.error('[gsc/overview]', error)
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to load Search Console data',
      },
      { status: 500 }
    )
  }
}

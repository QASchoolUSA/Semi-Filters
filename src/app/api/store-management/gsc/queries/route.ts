import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  fetchGscQueries,
  GscConfigError,
  GscNotConnectedError,
  humanizeGscError,
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
    const data = await fetchGscQueries(range)
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
    console.error('[gsc/queries]', error)
    return NextResponse.json(
      {
        status: 'error',
        error: humanizeGscError(error),
      },
      { status: 500 }
    )
  }
}

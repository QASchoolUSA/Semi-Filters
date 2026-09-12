import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { clearGscConnection, GscConfigError } from '@/lib/gsc'

export async function POST() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await clearGscConnection()
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    if (error instanceof GscConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }
    console.error('[gsc/disconnect]', error)
    return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isGscConnected, isGscOAuthReady } from '@/lib/gsc'
import { probeSanityWriteAccess } from '@/sanity/lib/write-client'

/** Authenticated diagnostics for GSC setup — never returns secrets. */
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sanity = await probeSanityWriteAccess()
  let connected = false
  try {
    connected = await isGscConnected()
  } catch {
    connected = false
  }

  return NextResponse.json({
    oauthReady: isGscOAuthReady(),
    authSecretPresent: Boolean(process.env.AUTH_SECRET),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
    sanity,
    connected,
  })
}

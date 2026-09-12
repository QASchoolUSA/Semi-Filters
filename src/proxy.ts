import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { truckBrandToSlug } from '@/lib/seo'

/**
 * Next.js 16 proxy (replaces middleware).
 * - Redirects legacy /shop?category=&truck= URLs to indexable landings
 * - Protects /store-management with Auth.js
 */
export default auth((req) => {
  const { pathname, searchParams } = req.nextUrl

  if (pathname === '/shop') {
    const category = searchParams.get('category')
    const truck = searchParams.get('truck')

    if (category && category !== 'all' && !truck) {
      const url = req.nextUrl.clone()
      url.pathname = `/filters/${category}`
      url.search = ''
      return NextResponse.redirect(url, 308)
    }

    if (truck && (!category || category === 'all')) {
      const url = req.nextUrl.clone()
      url.pathname = `/trucks/${truckBrandToSlug(truck)}`
      url.search = ''
      return NextResponse.redirect(url, 308)
    }

    if (truck && category && category !== 'all') {
      const url = req.nextUrl.clone()
      url.pathname = `/trucks/${truckBrandToSlug(truck)}`
      url.search = ''
      return NextResponse.redirect(url, 308)
    }

    return NextResponse.next()
  }

  const isLogin = pathname.startsWith('/store-management/login')
  const isAuthed = !!req.auth

  if (isLogin && isAuthed) {
    return NextResponse.redirect(new URL('/store-management/orders', req.nextUrl.origin))
  }

  if (!isLogin && !isAuthed) {
    const loginUrl = new URL('/store-management/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname + req.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/store-management/:path*', '/shop'],
}

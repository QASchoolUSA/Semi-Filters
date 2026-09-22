import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { truckBrandToSlug } from '@/lib/seo'

/**
 * Next.js 16 proxy (replaces middleware).
 * - Redirects /shop?category= to /filters/{category}
 * - Redirects /shop?truck=&category= to /trucks/{brand}/{category}
 * - Leaves /shop?truck= on /shop so brand filtering works on All Products
 * - Protects /store-management with Auth.js
 */
export default auth((req) => {
  const { pathname, searchParams } = req.nextUrl

  if (pathname === '/shop') {
    const category = searchParams.get('category')
    const truck = searchParams.get('truck')

    // Category-only → dedicated category landing
    if (category && category !== 'all' && (!truck || truck === 'all')) {
      const url = req.nextUrl.clone()
      url.pathname = `/filters/${category}`
      url.search = ''
      return NextResponse.redirect(url, 308)
    }

    // Brand + category → nested brand×category landing
    if (truck && truck !== 'all' && category && category !== 'all') {
      const url = req.nextUrl.clone()
      url.pathname = `/trucks/${truckBrandToSlug(truck)}/${category}`
      url.search = ''
      return NextResponse.redirect(url, 308)
    }

    // Truck-only stays on /shop so the All Products brand filter works
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

  // Legacy Search Console route
  if (pathname === '/store-management/search' || pathname.startsWith('/store-management/search/')) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace('/store-management/search', '/store-management/seo')
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/store-management/:path*', '/shop'],
}

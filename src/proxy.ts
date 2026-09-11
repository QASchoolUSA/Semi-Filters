import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl
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
  matcher: ['/store-management/:path*'],
}

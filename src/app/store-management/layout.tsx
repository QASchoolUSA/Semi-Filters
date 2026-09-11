import React from 'react'
import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { auth } from '@/auth'
import StoreNav from '@/components/store-management/StoreNav'
import { signOutAction } from './actions'

const smSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sm-sans',
  display: 'swap',
})

const smMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Store management',
    template: '%s — Store management',
  },
  robots: { index: false, follow: false },
}

export default async function StoreManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const isAuthed = !!session?.user
  const fontClass = `${smSans.variable} ${smMono.variable}`

  if (!isAuthed) {
    return (
      <div className={`sm-shell sm-shell--public ${fontClass}`}>{children}</div>
    )
  }

  return (
    <div className={`sm-shell ${fontClass}`}>
      <aside className="sm-nav">
        <div className="sm-nav__brand">
          <span className="sm-nav__mark" aria-hidden="true" />
          <div>
            <p className="sm-nav__eyebrow">Semi Filters</p>
            <p className="sm-nav__title">Ops</p>
          </div>
        </div>

        <StoreNav variant="side" />

        <div className="sm-nav__footer">
          <p className="sm-nav__user">{session.user?.email}</p>
          <form action={signOutAction}>
            <button type="submit" className="sm-nav__signout">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="sm-main">
        <header className="sm-topbar">
          <div className="sm-topbar__brand">
            <span className="sm-nav__mark" aria-hidden="true" />
            <span>Semi Filters Ops</span>
          </div>
          <StoreNav variant="top" />
          <div className="sm-topbar__user">
            <span>{session.user?.email}</span>
            <form action={signOutAction}>
              <button type="submit">Sign out</button>
            </form>
          </div>
        </header>
        <div className="sm-content">{children}</div>
      </div>
    </div>
  )
}

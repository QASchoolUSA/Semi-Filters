import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { signOutAction } from './actions'

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

  if (!isAuthed) {
    return <div className="sm-shell sm-shell--public">{children}</div>
  }

  return (
    <div className="sm-shell">
      <aside className="sm-nav">
        <div className="sm-nav__brand">
          <span className="sm-nav__mark" aria-hidden="true" />
          <div>
            <p className="sm-nav__eyebrow">Semi Filters</p>
            <p className="sm-nav__title">Store management</p>
          </div>
        </div>

        <nav className="sm-nav__links" aria-label="Store management">
          <Link href="/store-management/orders" className="sm-nav__link">
            Orders
          </Link>
          <Link href="/store-management/shipping" className="sm-nav__link">
            Shipping
          </Link>
        </nav>

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
          <nav className="sm-topbar__tabs" aria-label="Sections">
            <Link href="/store-management/orders">Orders</Link>
            <Link href="/store-management/shipping">Shipping</Link>
          </nav>
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

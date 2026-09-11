'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  {
    href: '/store-management/orders',
    label: 'Orders',
    match: (path: string) => path.startsWith('/store-management/orders'),
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: '/store-management/shipping',
    label: 'Shipping',
    match: (path: string) => path.startsWith('/store-management/shipping'),
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 7h11v10H3V7Zm11 3h4l3 3v4h-7v-7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="18.5" r="1.5" fill="currentColor" />
        <circle cx="17.5" cy="18.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
]

export default function StoreNav({
  variant = 'side',
}: {
  variant?: 'side' | 'top'
}) {
  const pathname = usePathname() || ''

  return (
    <nav
      className={variant === 'side' ? 'sm-nav__links' : 'sm-topbar__tabs'}
      aria-label="Store management"
    >
      {LINKS.map((link) => {
        const active = link.match(pathname)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${variant === 'side' ? 'sm-nav__link' : 'sm-topbar__tab'}${
              active ? ' is-active' : ''
            }`}
            aria-current={active ? 'page' : undefined}
          >
            {variant === 'side' && <span className="sm-nav__icon">{link.icon}</span>}
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

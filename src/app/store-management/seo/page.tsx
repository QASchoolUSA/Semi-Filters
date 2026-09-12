import React from 'react'
import type { Metadata } from 'next'
import SearchConsoleDashboard from '@/components/store-management/SearchConsoleDashboard'

export const metadata: Metadata = {
  title: 'SEO',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function SeoPage() {
  return (
    <div className="sm-page">
      <header className="sm-page__header">
        <div>
          <p className="sm-eyebrow">Store management</p>
          <h1>SEO</h1>
          <p className="sm-page__lede">
            Google Search Console performance — clicks, impressions, keywords, and rankings.
            Clicks are visits from Google Search, not all site traffic.
          </p>
        </div>
      </header>

      <SearchConsoleDashboard />
    </div>
  )
}

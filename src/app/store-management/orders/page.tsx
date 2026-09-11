import React from 'react'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { allOrdersQuery } from '@/sanity/lib/queries'
import OrdersTable from '@/components/store-management/OrdersTable'
import type { StoreOrder } from '@/types'

export const metadata: Metadata = {
  title: 'Orders',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const orders = ((await sanityFetch(allOrdersQuery, {
    revalidate: 0,
    tags: ['orders'],
  }).catch(() => [])) || []) as StoreOrder[]

  return (
    <div className="sm-page">
      <header className="sm-page__header">
        <div>
          <p className="sm-eyebrow">Operations</p>
          <h1>Orders</h1>
          <p className="sm-page__lede">
            Paid Stripe checkouts ready to fulfill. Search, filter, then ship.
          </p>
        </div>
        <div className="sm-page__stat">
          <span className="sm-page__stat-value">{orders.length}</span>
          <span className="sm-page__stat-label">recent</span>
        </div>
      </header>
      <OrdersTable orders={orders} />
    </div>
  )
}

import React from 'react'
import type { Metadata } from 'next'
import { adminFetch } from '@/sanity/lib/admin-client'
import { allOrdersQuery } from '@/sanity/lib/queries'
import OrdersTable from '@/components/store-management/OrdersTable'
import type { StoreOrder } from '@/types'

export const metadata: Metadata = {
  title: 'Orders',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const orders = ((await adminFetch(allOrdersQuery).catch(() => [])) || []) as StoreOrder[]

  return (
    <div className="sm-page">
      <header className="sm-page__header">
        <div>
          <p className="sm-eyebrow">Fulfillment</p>
          <h1>Orders</h1>
          <p className="sm-page__lede">
            Paid checkouts ready to pack and ship. Search, filter, then create a label.
          </p>
        </div>
        <div className="sm-stat-card">
          <span className="sm-stat-card__value">{orders.length}</span>
          <span className="sm-stat-card__label">Recent orders</span>
        </div>
      </header>
      <OrdersTable orders={orders} />
    </div>
  )
}

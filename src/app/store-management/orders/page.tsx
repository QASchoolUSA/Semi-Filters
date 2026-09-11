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
export const revalidate = 0

export default async function OrdersPage() {
  let orders: StoreOrder[] = []
  let loadError: string | null = null

  try {
    const result = await adminFetch(allOrdersQuery)
    orders = (Array.isArray(result) ? result : []) as StoreOrder[]
  } catch (err) {
    console.error('[store-management/orders] Failed to load orders:', err)
    loadError =
      err instanceof Error ? err.message : 'Failed to load orders from Sanity'
  }

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

      {loadError && (
        <p className="sm-alert sm-alert--error" role="alert">
          Could not load orders: {loadError}
        </p>
      )}

      <OrdersTable orders={orders} />
    </div>
  )
}

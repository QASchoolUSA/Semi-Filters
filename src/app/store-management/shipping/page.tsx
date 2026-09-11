import React from 'react'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { unshippedOrdersQuery } from '@/sanity/lib/queries'
import ShipOrderPanel from '@/components/store-management/ShipOrderPanel'
import type { StoreOrder } from '@/types'

export const metadata: Metadata = {
  title: 'Shipping',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function ShippingPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order: initialOrderId } = await searchParams
  const orders = ((await sanityFetch(unshippedOrdersQuery, {
    revalidate: 0,
    tags: ['orders'],
  }).catch(() => [])) || []) as StoreOrder[]

  return (
    <div className="sm-page">
      <header className="sm-page__header">
        <div>
          <p className="sm-eyebrow">Fulfillment</p>
          <h1>Shipping labels</h1>
          <p className="sm-page__lede">
            Pick an order, confirm the parcel, compare Shippo rates, then print a 4×6 label.
          </p>
        </div>
        <div className="sm-page__stat">
          <span className="sm-page__stat-value">{orders.length}</span>
          <span className="sm-page__stat-label">to ship</span>
        </div>
      </header>
      <ShipOrderPanel orders={orders} initialOrderId={initialOrderId} />
    </div>
  )
}

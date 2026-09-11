import React from 'react'
import type { Metadata } from 'next'
import { adminFetch } from '@/sanity/lib/admin-client'
import { orderByIdQuery, unshippedOrdersQuery } from '@/sanity/lib/queries'
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

  let orders = ((await adminFetch(unshippedOrdersQuery).catch(() => [])) || []) as StoreOrder[]

  if (initialOrderId && !orders.some((o) => o._id === initialOrderId)) {
    const extra = (await adminFetch(orderByIdQuery, { id: initialOrderId }).catch(
      () => null
    )) as StoreOrder | null
    if (extra) {
      orders = [extra, ...orders]
    }
  }

  return (
    <div className="sm-page">
      <header className="sm-page__header">
        <div>
          <p className="sm-eyebrow">Fulfillment</p>
          <h1>Shipping labels</h1>
          <p className="sm-page__lede">
            Choose a USPS Flat Rate box, enter weight, compare rates, then print a 4×6 label.
          </p>
        </div>
        <div className="sm-stat-card">
          <span className="sm-stat-card__value">{orders.length}</span>
          <span className="sm-stat-card__label">In queue</span>
        </div>
      </header>
      <ShipOrderPanel orders={orders} initialOrderId={initialOrderId} />
    </div>
  )
}

'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import StatusChip from './StatusChip'
import type { OrderStatus, StoreOrder } from '@/types'

function formatMoney(cents?: number) {
  if (typeof cents !== 'number') return '—'
  return `$${(cents / 100).toFixed(2)}`
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function OrdersTable({ orders }: { orders: StoreOrder[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | OrderStatus>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((order) => {
      if (status !== 'all' && order.status !== status) return false
      if (!q) return true
      const haystack = [
        order.customerName,
        order.customerEmail,
        order.stripeSessionId,
        order.trackingNumber,
        ...(order.lineItems?.map((i) => i.name) || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [orders, query, status])

  return (
    <div className="sm-orders">
      <div className="sm-toolbar">
        <input
          className="sm-search"
          type="search"
          placeholder="Search name, email, tracking…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="sm-filters" role="group" aria-label="Filter by status">
          {(['all', 'paid', 'ready_to_ship', 'shipped', 'cancelled'] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`sm-filter${status === value ? ' is-active' : ''}`}
              onClick={() => setStatus(value)}
            >
              {value === 'all'
                ? 'All'
                : value === 'ready_to_ship'
                  ? 'Ready'
                  : value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="sm-empty">
          <h2>No open orders</h2>
          <p>
            Paid Stripe checkouts appear here automatically. For local testing, seed a demo order:
          </p>
          <code className="sm-empty__code">npm run seed-demo-order</code>
          <Link href="/store-management/shipping" className="sm-btn">
            Go to shipping
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="sm-empty">
          <h2>No matching orders</h2>
          <p>Try clearing search or switching the status filter.</p>
        </div>
      ) : (
        <div className="sm-table-wrap">
          <table className="sm-table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Customer</th>
                <th>Delivery</th>
                <th>Items</th>
                <th className="sm-num">Total</th>
                <th>Status</th>
                <th className="sm-table__actions-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const itemCount =
                  order.lineItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
                const isPickup = order.fulfillmentMethod === 'pickup'
                return (
                  <tr key={order._id} className="sm-row-enter">
                    <td className="sm-cell-muted">{formatDate(order._createdAt)}</td>
                    <td>
                      <div className="sm-cell-primary">{order.customerName || 'Customer'}</div>
                      <div className="sm-cell-muted">{order.customerEmail || '—'}</div>
                    </td>
                    <td>{isPickup ? 'Pickup' : 'Shipping'}</td>
                    <td>
                      {itemCount} item{itemCount === 1 ? '' : 's'}
                    </td>
                    <td className="sm-num">{formatMoney(order.total)}</td>
                    <td>
                      <StatusChip status={order.status} />
                    </td>
                    <td className="sm-table__actions">
                      <Link
                        href={`/store-management/orders/${order._id}`}
                        className="sm-link-btn"
                      >
                        View
                      </Link>
                      {!isPickup && order.status !== 'shipped' && order.status !== 'cancelled' && (
                        <Link
                          href={`/store-management/shipping?order=${order._id}`}
                          className="sm-link-btn sm-link-btn--accent"
                        >
                          Ship
                        </Link>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

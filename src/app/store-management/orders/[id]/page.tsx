import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { adminFetch } from '@/sanity/lib/admin-client'
import { orderByIdQuery } from '@/sanity/lib/queries'
import StatusChip from '@/components/store-management/StatusChip'
import type { StoreOrder } from '@/types'

export const metadata: Metadata = {
  title: 'Order detail',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

function formatMoney(cents?: number) {
  if (typeof cents !== 'number') return '—'
  return `$${(cents / 100).toFixed(2)}`
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = (await adminFetch(orderByIdQuery, { id }).catch(() => null)) as StoreOrder | null

  if (!order) notFound()

  const address = order.shippingAddress

  return (
    <div className="sm-page">
      <header className="sm-page__header">
        <div>
          <p className="sm-eyebrow">
            <Link href="/store-management/orders" className="sm-text-link">
              ← Orders
            </Link>
          </p>
          <h1>{order.customerName || 'Order'}</h1>
          <p className="sm-page__lede">{order.customerEmail}</p>
        </div>
        <StatusChip status={order.status} />
      </header>

      <div className="sm-detail-grid">
        <div className="sm-card">
          <h3>Customer</h3>
          <dl className="sm-dl">
            <div>
              <dt>Phone</dt>
              <dd>{order.customerPhone || '—'}</dd>
            </div>
            <div>
              <dt>Stripe session</dt>
              <dd className="sm-mono">{order.stripeSessionId}</dd>
            </div>
          </dl>
        </div>

        <div className="sm-card">
          <h3>Ship to</h3>
          <pre className="sm-address">
            {[
              address?.name,
              address?.line1,
              address?.line2,
              [address?.city, address?.state, address?.postalCode].filter(Boolean).join(', '),
              address?.country,
            ]
              .filter(Boolean)
              .join('\n') || 'No address'}
          </pre>
          {order.status !== 'shipped' && order.status !== 'cancelled' && (
            <Link
              href={`/store-management/shipping?order=${order._id}`}
              className="sm-btn sm-btn--primary"
            >
              Create shipping label
            </Link>
          )}
        </div>
      </div>

      <div className="sm-card sm-card--spaced">
        <h3>Line items</h3>
        <div className="sm-table-wrap">
          <table className="sm-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th className="sm-num">Unit</th>
              </tr>
            </thead>
            <tbody>
              {(order.lineItems || []).map((item, i) => (
                <tr key={`${item.name}-${i}`}>
                  <td>
                    <div className="sm-cell-primary">{item.name}</div>
                    {item.partNumber && (
                      <div className="sm-cell-muted">Part# {item.partNumber}</div>
                    )}
                  </td>
                  <td>{item.quantity}</td>
                  <td className="sm-num">{formatMoney(item.unitAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className="sm-totals">
          <div>
            <dt>Subtotal</dt>
            <dd className="sm-num">{formatMoney(order.subtotal)}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd className="sm-num">{formatMoney(order.shipping)}</dd>
          </div>
          <div>
            <dt>Tax</dt>
            <dd className="sm-num">{formatMoney(order.tax)}</dd>
          </div>
          <div className="sm-totals__grand">
            <dt>Total</dt>
            <dd className="sm-num">{formatMoney(order.total)}</dd>
          </div>
        </dl>
      </div>

      {order.status === 'shipped' && (
        <div className="sm-success sm-card--spaced">
          <h3>Shipped</h3>
          <p>
            {order.carrier} · {order.servicelevel}
            {order.trackingNumber && (
              <>
                <br />
                Tracking:{' '}
                {order.trackingUrl ? (
                  <a href={order.trackingUrl} target="_blank" rel="noreferrer">
                    {order.trackingNumber}
                  </a>
                ) : (
                  order.trackingNumber
                )}
              </>
            )}
          </p>
          {order.labelUrl && (
            <a
              className="sm-btn sm-btn--primary"
              href={order.labelUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open label PDF
            </a>
          )}
        </div>
      )}
    </div>
  )
}

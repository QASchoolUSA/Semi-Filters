'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  DEFAULT_BOX_TOKEN,
  USPS_BOX_TEMPLATES,
  resolveBoxTemplate,
  type ShippoRateOption,
} from '@/lib/shippo'
import StatusChip from './StatusChip'
import type { OrderParcel, StoreOrder } from '@/types'

function formatMoney(cents?: number) {
  if (typeof cents !== 'number') return '—'
  return `$${(cents / 100).toFixed(2)}`
}

function formatAddress(order: StoreOrder) {
  const a = order.shippingAddress
  if (!a) return 'No shipping address'
  return [
    a.name,
    a.line1,
    a.line2,
    [a.city, a.state, a.postalCode].filter(Boolean).join(', '),
    a.country,
  ]
    .filter(Boolean)
    .join('\n')
}

function initialParcel(order?: StoreOrder | null): OrderParcel {
  const box = resolveBoxTemplate(order?.parcel?.template || DEFAULT_BOX_TOKEN)
  return {
    template: box.token,
    weight: order?.parcel?.weight ?? box.defaultWeight,
  }
}

export default function ShipOrderPanel({
  orders,
  initialOrderId,
}: {
  orders: StoreOrder[]
  initialOrderId?: string
}) {
  const [selectedId, setSelectedId] = useState(
    initialOrderId || orders[0]?._id || ''
  )
  const selected = useMemo(
    () => orders.find((o) => o._id === selectedId) || null,
    [orders, selectedId]
  )

  const [parcel, setParcel] = useState<OrderParcel>(() =>
    initialParcel(orders.find((o) => o._id === (initialOrderId || orders[0]?._id)))
  )

  const [rates, setRates] = useState<ShippoRateOption[]>([])
  const [selectedRateId, setSelectedRateId] = useState('')
  const [loadingRates, setLoadingRates] = useState(false)
  const [buying, setBuying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{
    labelUrl: string
    trackingNumber?: string
    trackingUrl?: string
  } | null>(null)

  const selectOrder = (order: StoreOrder) => {
    setSelectedId(order._id)
    setParcel(initialParcel(order))
    setRates([])
    setSelectedRateId('')
    setSuccess(null)
    setError(null)
  }

  const selectBox = (token: string) => {
    const box = resolveBoxTemplate(token)
    setParcel((prev) => ({
      template: box.token,
      weight: prev.weight ?? box.defaultWeight,
    }))
    setRates([])
    setSelectedRateId('')
    setSuccess(null)
  }

  const fetchRates = async () => {
    if (!selected) return
    setLoadingRates(true)
    setError(null)
    setSuccess(null)
    setRates([])
    setSelectedRateId('')
    try {
      const res = await fetch('/api/store-management/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selected._id, parcel }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load rates')
      setRates(data.rates || [])
      if ((data.rates || []).length === 0) {
        setError('No rates returned. Check Shippo USPS carrier setup and addresses.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load rates')
    } finally {
      setLoadingRates(false)
    }
  }

  const buyLabel = async () => {
    if (!selected || !selectedRateId) return
    const rate = rates.find((r) => r.objectId === selectedRateId)
    setBuying(true)
    setError(null)
    try {
      const res = await fetch('/api/store-management/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selected._id,
          rateId: selectedRateId,
          carrier: rate?.provider,
          servicelevel: rate?.servicelevel,
          parcel,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to buy label')
      setSuccess({
        labelUrl: data.labelUrl,
        trackingNumber: data.trackingNumber,
        trackingUrl: data.trackingUrl,
      })
      if (data.labelUrl) {
        window.open(data.labelUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to buy label')
    } finally {
      setBuying(false)
    }
  }

  if (orders.length === 0) {
    return (
      <div className="sm-empty">
        <h2>Nothing to ship</h2>
        <p>
          Paid orders waiting for labels will show here. Seed a demo order with{' '}
          <code>npm run seed-demo-order</code> or wait for a Stripe checkout.
        </p>
        <Link href="/store-management/orders" className="sm-btn">
          View all orders
        </Link>
      </div>
    )
  }

  return (
    <div className="sm-ship">
      <aside className="sm-ship__queue">
        <div className="sm-ship__queue-head">
          <h2>Queue</h2>
          <span>{orders.length}</span>
        </div>
        <ul className="sm-ship__list">
          {orders.map((order) => (
            <li key={order._id}>
              <button
                type="button"
                className={`sm-ship__queue-item${selectedId === order._id ? ' is-active' : ''}`}
                onClick={() => selectOrder(order)}
              >
                <span className="sm-cell-primary">{order.customerName || 'Customer'}</span>
                <span className="sm-cell-muted sm-num">{formatMoney(order.total)}</span>
                <StatusChip status={order.status} />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {selected && (
        <section className="sm-ship__panel sm-panel-enter">
          <header className="sm-ship__header">
            <div>
              <p className="sm-eyebrow">Fulfill</p>
              <h2>{selected.customerName || 'Customer'}</h2>
              <p className="sm-cell-muted">{selected.customerEmail}</p>
            </div>
            <StatusChip status={selected.status} />
          </header>

          <div className="sm-detail-grid">
            <div className="sm-card">
              <h3>Ship to</h3>
              <pre className="sm-address">{formatAddress(selected)}</pre>
              <Link
                href={`/store-management/orders/${selected._id}`}
                className="sm-text-link"
              >
                Open order detail
              </Link>
            </div>

            <div className="sm-card">
              <h3>Package weight</h3>
              <label className="sm-field">
                <span>Weight (lb)</span>
                <input
                  type="number"
                  min={0.1}
                  step="0.1"
                  value={parcel.weight ?? ''}
                  onChange={(e) => {
                    setParcel((prev) => ({
                      ...prev,
                      weight: e.target.value === '' ? undefined : Number(e.target.value),
                    }))
                    setRates([])
                    setSelectedRateId('')
                  }}
                />
              </label>
              <p className="sm-help">
                USPS Flat Rate boxes only need weight — dimensions come from the box type.
              </p>
            </div>
          </div>

          <div className="sm-card sm-card--spaced">
            <h3>USPS box</h3>
            <div className="sm-box-grid" role="radiogroup" aria-label="USPS box type">
              {USPS_BOX_TEMPLATES.map((box) => {
                const active = parcel.template === box.token
                return (
                  <button
                    key={box.token}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`sm-box-tile${active ? ' is-active' : ''}`}
                    onClick={() => selectBox(box.token)}
                  >
                    <span className="sm-box-tile__label">{box.label}</span>
                    <span className="sm-box-tile__hint">{box.sizeHint}</span>
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              className="sm-btn sm-btn--primary"
              onClick={fetchRates}
              disabled={loadingRates || !parcel.weight}
            >
              {loadingRates ? 'Getting rates…' : 'Get rates'}
            </button>
          </div>

          {error && (
            <p className="sm-alert sm-alert--error" role="alert">
              {error}
            </p>
          )}

          {rates.length > 0 && (
            <div className="sm-card sm-card--spaced sm-panel-enter">
              <h3>Rates</h3>
              <div className="sm-table-wrap">
                <table className="sm-table sm-table--rates">
                  <thead>
                    <tr>
                      <th>Carrier</th>
                      <th>Service</th>
                      <th>ETA</th>
                      <th className="sm-num">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((rate) => (
                      <tr
                        key={rate.objectId}
                        className={selectedRateId === rate.objectId ? 'is-selected' : undefined}
                        onClick={() => setSelectedRateId(rate.objectId)}
                      >
                        <td>
                          <strong>{rate.provider}</strong>
                        </td>
                        <td>{rate.servicelevel}</td>
                        <td className="sm-cell-muted">
                          {rate.estimatedDays != null
                            ? `${rate.estimatedDays} day${rate.estimatedDays === 1 ? '' : 's'}`
                            : rate.durationTerms || '—'}
                        </td>
                        <td className="sm-num sm-rate-price">
                          ${Number(rate.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="sm-btn sm-btn--primary"
                onClick={buyLabel}
                disabled={!selectedRateId || buying}
              >
                {buying ? 'Buying label…' : 'Buy label & print'}
              </button>
            </div>
          )}

          {success && (
            <div className="sm-success sm-card--spaced sm-panel-enter" role="status">
              <h3>Label ready</h3>
              <p>
                Tracking{' '}
                {success.trackingUrl ? (
                  <a href={success.trackingUrl} target="_blank" rel="noreferrer">
                    {success.trackingNumber}
                  </a>
                ) : (
                  success.trackingNumber
                )}
              </p>
              <a
                className="sm-btn sm-btn--primary"
                href={success.labelUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open / print PDF
              </a>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

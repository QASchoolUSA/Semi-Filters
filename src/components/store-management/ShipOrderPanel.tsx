'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { PARCEL_PRESETS, type ShippoRateOption } from '@/lib/shippo'
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

  const [parcel, setParcel] = useState<OrderParcel>(() => {
    const fromOrder = orders.find((o) => o._id === (initialOrderId || orders[0]?._id))?.parcel
    return {
      length: fromOrder?.length ?? PARCEL_PRESETS.filter_box.length,
      width: fromOrder?.width ?? PARCEL_PRESETS.filter_box.width,
      height: fromOrder?.height ?? PARCEL_PRESETS.filter_box.height,
      weight: fromOrder?.weight ?? PARCEL_PRESETS.filter_box.weight,
    }
  })

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

  const applyPreset = (key: keyof typeof PARCEL_PRESETS) => {
    const preset = PARCEL_PRESETS[key]
    setParcel({
      length: preset.length,
      width: preset.width,
      height: preset.height,
      weight: preset.weight,
    })
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
        setError('No rates returned. Check Shippo carrier accounts and address.')
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
        <p>Paid orders waiting for labels will show up in this queue.</p>
        <Link href="/store-management/orders" className="sm-link-btn">
          View all orders
        </Link>
      </div>
    )
  }

  return (
    <div className="sm-ship">
      <aside className="sm-ship__queue">
        <h2 className="sm-ship__queue-title">Queue</h2>
        <ul className="sm-ship__list">
          {orders.map((order) => (
            <li key={order._id}>
              <button
                type="button"
                className={`sm-ship__queue-item${selectedId === order._id ? ' sm-ship__queue-item--active' : ''}`}
                onClick={() => {
                  setSelectedId(order._id)
                  setRates([])
                  setSelectedRateId('')
                  setSuccess(null)
                  setError(null)
                  setParcel({
                    length: order.parcel?.length ?? PARCEL_PRESETS.filter_box.length,
                    width: order.parcel?.width ?? PARCEL_PRESETS.filter_box.width,
                    height: order.parcel?.height ?? PARCEL_PRESETS.filter_box.height,
                    weight: order.parcel?.weight ?? PARCEL_PRESETS.filter_box.weight,
                  })
                }}
              >
                <span className="sm-cell-primary">{order.customerName || 'Customer'}</span>
                <span className="sm-cell-muted">{formatMoney(order.total)}</span>
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
              <p className="sm-eyebrow">Fulfillment</p>
              <h2>{selected.customerName || 'Customer'}</h2>
              <p className="sm-cell-muted">{selected.customerEmail}</p>
            </div>
            <StatusChip status={selected.status} />
          </header>

          <div className="sm-ship__grid">
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
              <h3>Parcel</h3>
              <div className="sm-presets">
                <button type="button" className="sm-filter" onClick={() => applyPreset('filter_box')}>
                  Filter box
                </button>
                <button type="button" className="sm-filter" onClick={() => applyPreset('multi_item')}>
                  Multi-item
                </button>
              </div>
              <div className="sm-parcel-grid">
                {(['length', 'width', 'height', 'weight'] as const).map((field) => (
                  <label key={field} className="sm-login__field">
                    <span>
                      {field === 'weight' ? 'Weight (lb)' : `${field} (in)`}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={parcel[field] ?? ''}
                      onChange={(e) =>
                        setParcel((prev) => ({
                          ...prev,
                          [field]: e.target.value === '' ? undefined : Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="sm-login__submit"
                onClick={fetchRates}
                disabled={loadingRates}
              >
                {loadingRates ? 'Getting rates…' : 'Get rates'}
              </button>
            </div>
          </div>

          {error && (
            <p className="sm-login__error" role="alert">
              {error}
            </p>
          )}

          {rates.length > 0 && (
            <div className="sm-card sm-rates sm-panel-enter">
              <h3>Rates</h3>
              <ul className="sm-rate-list">
                {rates.map((rate) => (
                  <li key={rate.objectId}>
                    <button
                      type="button"
                      className={`sm-rate${selectedRateId === rate.objectId ? ' sm-rate--active' : ''}`}
                      onClick={() => setSelectedRateId(rate.objectId)}
                    >
                      <span className="sm-rate__main">
                        <strong>{rate.provider}</strong>
                        <span>{rate.servicelevel}</span>
                      </span>
                      <span className="sm-rate__meta">
                        {rate.estimatedDays != null
                          ? `${rate.estimatedDays} day${rate.estimatedDays === 1 ? '' : 's'}`
                          : rate.durationTerms || '—'}
                      </span>
                      <span className="sm-rate__price">
                        ${Number(rate.amount).toFixed(2)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="sm-login__submit"
                onClick={buyLabel}
                disabled={!selectedRateId || buying}
              >
                {buying ? 'Buying label…' : 'Buy label & print'}
              </button>
            </div>
          )}

          {success && (
            <div className="sm-success sm-panel-enter" role="status">
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
                className="sm-link-btn sm-link-btn--accent"
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

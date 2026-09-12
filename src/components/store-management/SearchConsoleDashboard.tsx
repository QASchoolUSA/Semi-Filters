'use client'

import React, { useEffect, useState } from 'react'
import type { GscDateRow, GscDimensionRow, GscMetrics, GscRangeDays } from '@/lib/gsc'

type LoadStatus = 'loading' | 'not_connected' | 'misconfigured' | 'ok' | 'error' | 'auth_required'

type OverviewPayload = {
  status: LoadStatus | string
  error?: string
  range?: GscRangeDays
  startDate?: string
  endDate?: string
  totals?: GscMetrics
  series?: GscDateRow[]
  countries?: GscDimensionRow[]
  devices?: GscDimensionRow[]
}

const RANGES: { value: GscRangeDays; label: string }[] = [
  { value: 7, label: '7 days' },
  { value: 28, label: '28 days' },
  { value: 90, label: '90 days' },
]

const SEO_PATH = '/store-management/seo'

function friendlyError(message: string) {
  if (/session not found/i.test(message)) {
    return 'Sanity API credentials failed (this is not the store login). Update SANITY_API_TOKEN in your env, then restart the server.'
  }
  return message
}

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!text.trim()) {
    throw new Error(
      res.status >= 400
        ? `Request failed (${res.status}) with an empty response`
        : 'Empty response from Search Console API'
    )
  }
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(
      res.status >= 400
        ? `Request failed (${res.status}): ${text.slice(0, 160)}`
        : 'Invalid JSON from Search Console API'
    )
  }
}

function formatInt(n: number) {
  return new Intl.NumberFormat('en-US').format(Math.round(n))
}

function formatCtr(n: number) {
  return `${(n * 100).toFixed(1)}%`
}

function formatPosition(n: number) {
  return n > 0 ? n.toFixed(1) : '—'
}

function shortPage(url: string) {
  try {
    const u = new URL(url)
    return u.pathname + u.search || '/'
  } catch {
    return url
  }
}

function TrendChart({ series }: { series: GscDateRow[] }) {
  if (series.length === 0) {
    return (
      <div className="sm-gsc-chart sm-gsc-chart--empty">
        <p>No daily data in this range yet.</p>
      </div>
    )
  }

  const width = 640
  const height = 180
  const pad = { top: 16, right: 12, bottom: 28, left: 12 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const maxClicks = Math.max(...series.map((d) => d.clicks), 1)
  const maxImpr = Math.max(...series.map((d) => d.impressions), 1)

  const xAt = (i: number) =>
    pad.left + (series.length === 1 ? innerW / 2 : (i / (series.length - 1)) * innerW)
  const yClicks = (v: number) => pad.top + innerH - (v / maxClicks) * innerH
  const yImpr = (v: number) => pad.top + innerH - (v / maxImpr) * innerH

  const clicksPath = series
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yClicks(d.clicks).toFixed(1)}`)
    .join(' ')
  const imprPath = series
    .map(
      (d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yImpr(d.impressions).toFixed(1)}`
    )
    .join(' ')

  const first = series[0]?.date
  const last = series[series.length - 1]?.date

  return (
    <div className="sm-gsc-chart">
      <div className="sm-gsc-chart__legend">
        <span className="sm-gsc-chart__swatch sm-gsc-chart__swatch--clicks" />
        Clicks
        <span className="sm-gsc-chart__swatch sm-gsc-chart__swatch--impr" />
        Impressions
      </div>
      <svg
        className="sm-gsc-chart__svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Clicks and impressions over time"
      >
        <line
          x1={pad.left}
          x2={width - pad.right}
          y1={pad.top + innerH}
          y2={pad.top + innerH}
          className="sm-gsc-chart__axis"
        />
        <path d={imprPath} className="sm-gsc-chart__line sm-gsc-chart__line--impr" fill="none" />
        <path d={clicksPath} className="sm-gsc-chart__line sm-gsc-chart__line--clicks" fill="none" />
        <text x={pad.left} y={height - 8} className="sm-gsc-chart__label">
          {first}
        </text>
        <text
          x={width - pad.right}
          y={height - 8}
          textAnchor="end"
          className="sm-gsc-chart__label"
        >
          {last}
        </text>
      </svg>
    </div>
  )
}

function MetricsTable({
  title,
  rows,
  keyLabel,
  formatKey,
}: {
  title: string
  rows: GscDimensionRow[]
  keyLabel: string
  formatKey?: (key: string) => string
}) {
  return (
    <section className="sm-gsc-section">
      <h2 className="sm-gsc-section__title">{title}</h2>
      {rows.length === 0 ? (
        <div className="sm-empty">
          <p>No rows for this range.</p>
        </div>
      ) : (
        <div className="sm-table-wrap sm-gsc-table-wrap">
          <table className="sm-table">
            <thead>
              <tr>
                <th>{keyLabel}</th>
                <th className="sm-num">Clicks</th>
                <th className="sm-num">Impr.</th>
                <th className="sm-num">CTR</th>
                <th className="sm-num">Pos.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td>
                    <span className="sm-cell-primary" title={row.key}>
                      {formatKey ? formatKey(row.key) : row.key}
                    </span>
                  </td>
                  <td className="sm-num">{formatInt(row.clicks)}</td>
                  <td className="sm-num">{formatInt(row.impressions)}</td>
                  <td className="sm-num">{formatCtr(row.ctr)}</td>
                  <td className="sm-num">{formatPosition(row.position)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default function SearchConsoleDashboard() {
  const [range, setRange] = useState<GscRangeDays>(28)
  const [reloadKey, setReloadKey] = useState(0)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [overview, setOverview] = useState<OverviewPayload | null>(null)
  const [queries, setQueries] = useState<GscDimensionRow[]>([])
  const [pages, setPages] = useState<GscDimensionRow[]>([])
  const [justConnected, setJustConnected] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('connected') === '1') {
      setJustConnected(true)
      window.history.replaceState({}, '', SEO_PATH)
    }
    const err = params.get('error')
    if (err) {
      setError(
        err === 'no_refresh_token'
          ? 'Google did not return a refresh token. Revoke app access in your Google Account and connect again with consent.'
          : err === 'oauth_failed'
            ? 'Google sign-in failed. Try connecting again.'
            : err
      )
      window.history.replaceState({}, '', SEO_PATH)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      setError((prev) => (justConnected ? prev : null))

      try {
        const [overviewRes, queriesRes, pagesRes] = await Promise.all([
          fetch(`/api/store-management/gsc/overview?range=${range}`),
          fetch(`/api/store-management/gsc/queries?range=${range}`),
          fetch(`/api/store-management/gsc/pages?range=${range}`),
        ])

        const [overviewJson, queriesJson, pagesJson] = await Promise.all([
          readJson<OverviewPayload>(overviewRes),
          readJson<{ status?: string; rows?: GscDimensionRow[]; error?: string }>(queriesRes),
          readJson<{ status?: string; rows?: GscDimensionRow[]; error?: string }>(pagesRes),
        ])

        if (cancelled) return

        if (overviewRes.status === 401 || queriesRes.status === 401 || pagesRes.status === 401) {
          setStatus('auth_required')
          setError('Your store-management session expired. Sign in again to load SEO data.')
          return
        }

        if (overviewJson.status === 'not_connected' || queriesJson.status === 'not_connected') {
          setStatus('not_connected')
          setOverview(null)
          setQueries([])
          setPages([])
          return
        }

        if (overviewJson.status === 'misconfigured') {
          setStatus('misconfigured')
          setError(friendlyError(overviewJson.error || 'Search Console is misconfigured'))
          return
        }

        if (!overviewRes.ok || overviewJson.status === 'error') {
          setStatus('error')
          setError(friendlyError(overviewJson.error || 'Failed to load Search Console data'))
          return
        }

        if (!queriesRes.ok && queriesJson.status === 'error') {
          setStatus('error')
          setError(friendlyError(queriesJson.error || 'Failed to load keyword data'))
          return
        }

        if (!pagesRes.ok && pagesJson.status === 'error') {
          setStatus('error')
          setError(friendlyError(pagesJson.error || 'Failed to load page data'))
          return
        }

        setOverview(overviewJson)
        setQueries(Array.isArray(queriesJson.rows) ? queriesJson.rows : [])
        setPages(Array.isArray(pagesJson.rows) ? pagesJson.rows : [])
        setStatus('ok')
      } catch (err) {
        if (cancelled) return
        setStatus('error')
        setError(
          friendlyError(err instanceof Error ? err.message : 'Failed to load Search Console data')
        )
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [range, justConnected, reloadKey])

  async function disconnect() {
    setDisconnecting(true)
    try {
      const res = await fetch('/api/store-management/gsc/disconnect', { method: 'POST' })
      if (!res.ok) {
        const data = await readJson<{ error?: string }>(res).catch(
          (): { error?: string } => ({})
        )
        setError(typeof data.error === 'string' ? data.error : 'Failed to disconnect')
        return
      }
      setJustConnected(false)
      setOverview(null)
      setQueries([])
      setPages([])
      setStatus('not_connected')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect')
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <div className="sm-gsc">
      {justConnected && status === 'ok' && (
        <p className="sm-alert sm-alert--success" role="status">
          Google Search Console connected. Data loads automatically from here.
        </p>
      )}

      <div className="sm-toolbar sm-gsc-toolbar">
        <div className="sm-filters" role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              className={`sm-filter${range === r.value ? ' is-active' : ''}`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="sm-gsc-toolbar__meta">
          {overview?.startDate && overview?.endDate && status === 'ok' && (
            <p className="sm-gsc-range-meta">
              {overview.startDate} → {overview.endDate}
              <span className="sm-cell-muted"> · data lags ~2 days</span>
            </p>
          )}
          {status === 'ok' && (
            <button
              type="button"
              className="sm-btn"
              onClick={disconnect}
              disabled={disconnecting}
            >
              {disconnecting ? 'Disconnecting…' : 'Disconnect'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="sm-alert sm-alert--error" role="alert">
          {error}
        </p>
      )}

      {status === 'loading' && (
        <div className="sm-empty">
          <p>Loading Search Console…</p>
        </div>
      )}

      {status === 'misconfigured' && (
        <div className="sm-empty">
          <h2>Setup needed</h2>
          <p>
            {error || (
              <>
                Set <code className="sm-empty__code">GOOGLE_CLIENT_ID</code> and{' '}
                <code className="sm-empty__code">GOOGLE_CLIENT_SECRET</code>, then reconnect.
              </>
            )}
          </p>
        </div>
      )}

      {status === 'auth_required' && (
        <div className="sm-empty">
          <h2>Sign in required</h2>
          <p>Your store-management session expired. Sign in again to view SEO data.</p>
          <p style={{ marginTop: 16 }}>
            <a className="sm-btn sm-btn--primary" href="/store-management/login">
              Sign in
            </a>
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="sm-empty">
          <h2>Couldn’t load SEO data</h2>
          <p>
            This is a Search Console / Sanity API problem — not the store login page. Fix the
            credentials above, then retry.
          </p>
          <p style={{ marginTop: 16 }}>
            <button
              type="button"
              className="sm-btn sm-btn--primary"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              Retry
            </button>
          </p>
        </div>
      )}

      {status === 'not_connected' && (
        <div className="sm-empty">
          <h2>Connect Google Search Console</h2>
          <p>
            Sign in once with the Google account that has access to the semifilters.com property.
            Connection is saved automatically — no env token paste needed.
          </p>
          <p style={{ marginTop: 16 }}>
            <a className="sm-btn sm-btn--primary" href="/api/store-management/gsc/connect">
              Connect Google
            </a>
          </p>
        </div>
      )}

      {status === 'ok' && overview?.totals && (
        <>
          <div className="sm-gsc-kpis">
            <div className="sm-stat-card">
              <span className="sm-stat-card__value">{formatInt(overview.totals.clicks)}</span>
              <span className="sm-stat-card__label">Clicks</span>
            </div>
            <div className="sm-stat-card">
              <span className="sm-stat-card__value">
                {formatInt(overview.totals.impressions)}
              </span>
              <span className="sm-stat-card__label">Impressions</span>
            </div>
            <div className="sm-stat-card">
              <span className="sm-stat-card__value">{formatCtr(overview.totals.ctr)}</span>
              <span className="sm-stat-card__label">CTR</span>
            </div>
            <div className="sm-stat-card">
              <span className="sm-stat-card__value">
                {formatPosition(overview.totals.position)}
              </span>
              <span className="sm-stat-card__label">Avg position</span>
            </div>
          </div>

          <section className="sm-gsc-section">
            <h2 className="sm-gsc-section__title">Trend</h2>
            <TrendChart series={overview.series || []} />
          </section>

          <div className="sm-gsc-grid">
            <MetricsTable title="Top keywords" rows={queries} keyLabel="Query" />
            <MetricsTable
              title="Top pages"
              rows={pages}
              keyLabel="Page"
              formatKey={shortPage}
            />
          </div>

          <div className="sm-gsc-grid">
            <MetricsTable
              title="Countries"
              rows={overview.countries || []}
              keyLabel="Country"
            />
            <MetricsTable
              title="Devices"
              rows={overview.devices || []}
              keyLabel="Device"
              formatKey={(k) => k.charAt(0).toUpperCase() + k.slice(1).toLowerCase()}
            />
          </div>
        </>
      )}
    </div>
  )
}

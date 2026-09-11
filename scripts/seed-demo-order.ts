/**
 * Seed a demo paid order in Sanity for testing store-management shipping labels.
 *
 * Usage:
 *   npx tsx scripts/seed-demo-order.ts
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and
 * SANITY_API_TOKEN (loaded from .env.local automatically).
 *
 * Tip: use a Shippo *test* API token when buying labels so you are not charged.
 */

import { createClient } from 'next-sanity'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const DEMO_SESSION_ID = 'demo_cs_test_seed'

const envPath = resolve(process.cwd(), '.env.local')
try {
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let value = trimmed.slice(eqIdx + 1).trim()
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
} catch {
  console.warn('Could not read .env.local — make sure env vars are set')
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-03-01',
  useCdn: false,
  token,
})

const demoOrder = {
  _type: 'order' as const,
  stripeSessionId: DEMO_SESSION_ID,
  status: 'paid' as const,
  customerName: 'Demo Buyer',
  customerEmail: 'demo@semifilters.com',
  customerPhone: '+14075550199',
  shippingAddress: {
    name: 'Demo Buyer',
    line1: '6000 Universal Blvd',
    line2: '',
    city: 'Orlando',
    state: 'FL',
    postalCode: '32819',
    country: 'US',
  },
  lineItems: [
    {
      name: 'Heavy Duty Oil Filter - HD-9001',
      quantity: 1,
      unitAmount: 2499,
      partNumber: 'HD-9001',
    },
    {
      name: 'Premium Air Filter - AF-5500',
      quantity: 1,
      unitAmount: 3999,
      partNumber: 'AF-5500',
    },
  ],
  subtotal: 6498,
  shipping: 699,
  tax: 0,
  total: 7197,
  parcel: {
    length: 8,
    width: 6,
    height: 4,
    weight: 1.5,
  },
}

async function main() {
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "order" && stripeSessionId == $sessionId][0]{ _id }`,
    { sessionId: DEMO_SESSION_ID }
  )

  if (existing?._id) {
    const patched = await client
      .patch(existing._id)
      .set({
        status: demoOrder.status,
        customerName: demoOrder.customerName,
        customerEmail: demoOrder.customerEmail,
        customerPhone: demoOrder.customerPhone,
        shippingAddress: demoOrder.shippingAddress,
        lineItems: demoOrder.lineItems,
        subtotal: demoOrder.subtotal,
        shipping: demoOrder.shipping,
        tax: demoOrder.tax,
        total: demoOrder.total,
        parcel: demoOrder.parcel,
      })
      .unset([
        'trackingNumber',
        'trackingUrl',
        'labelUrl',
        'shippoRateId',
        'shippoTransactionId',
        'carrier',
        'servicelevel',
        'shippedAt',
      ])
      .commit()

    console.log(`Updated demo order: ${patched._id}`)
    console.log('Open /store-management/shipping to buy a test label.')
    return
  }

  const created = await client.create(demoOrder)
  console.log(`Created demo order: ${created._id}`)
  console.log(`stripeSessionId: ${DEMO_SESSION_ID}`)
  console.log('Open /store-management/shipping to buy a test label.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

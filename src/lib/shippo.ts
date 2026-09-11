import { Shippo } from 'shippo'
import type { OrderParcel, OrderShippingAddress } from '@/types'

export type ShippoRateOption = {
  objectId: string
  amount: string
  currency: string
  provider: string
  servicelevel: string
  estimatedDays: number | null
  durationTerms: string | null
}

function getShippo() {
  const token = process.env.SHIPPO_API_TOKEN
  if (!token) {
    throw new Error('SHIPPO_API_TOKEN is not configured')
  }
  return new Shippo({ apiKeyHeader: token })
}

function getShipFromAddress() {
  const name = process.env.SHIP_FROM_NAME
  const street1 = process.env.SHIP_FROM_STREET1
  const city = process.env.SHIP_FROM_CITY
  const state = process.env.SHIP_FROM_STATE
  const zip = process.env.SHIP_FROM_ZIP
  const country = process.env.SHIP_FROM_COUNTRY || 'US'
  const phone = process.env.SHIP_FROM_PHONE

  if (!name || !street1 || !city || !state || !zip) {
    throw new Error('SHIP_FROM_* environment variables are incomplete')
  }

  return {
    name,
    street1,
    city,
    state,
    zip,
    country,
    phone: phone || undefined,
  }
}

export const PARCEL_PRESETS = {
  filter_box: { length: 8, width: 6, height: 4, weight: 1.5, label: 'Filter box' },
  multi_item: { length: 12, width: 10, height: 8, weight: 4, label: 'Multi-item' },
} as const

export function normalizeParcel(parcel: OrderParcel) {
  return {
    length: String(parcel.length ?? PARCEL_PRESETS.filter_box.length),
    width: String(parcel.width ?? PARCEL_PRESETS.filter_box.width),
    height: String(parcel.height ?? PARCEL_PRESETS.filter_box.height),
    distanceUnit: 'in' as const,
    weight: String(parcel.weight ?? PARCEL_PRESETS.filter_box.weight),
    massUnit: 'lb' as const,
  }
}

export async function getShippingRates(
  addressTo: OrderShippingAddress,
  parcel: OrderParcel
): Promise<ShippoRateOption[]> {
  if (!addressTo.line1 || !addressTo.city || !addressTo.state || !addressTo.postalCode) {
    throw new Error('Shipping address is incomplete')
  }

  const shippo = getShippo()
  const shipment = await shippo.shipments.create({
    addressFrom: getShipFromAddress(),
    addressTo: {
      name: addressTo.name || 'Customer',
      street1: addressTo.line1,
      street2: addressTo.line2 || undefined,
      city: addressTo.city,
      state: addressTo.state,
      zip: addressTo.postalCode,
      country: addressTo.country || 'US',
    },
    parcels: [normalizeParcel(parcel)],
    async: false,
  })

  const rates = (shipment.rates || [])
    .map((rate) => ({
      objectId: rate.objectId || '',
      amount: rate.amount || '0',
      currency: rate.currency || 'USD',
      provider: rate.provider || 'Carrier',
      servicelevel: rate.servicelevel?.name || rate.servicelevel?.token || 'Service',
      estimatedDays: rate.estimatedDays ?? null,
      durationTerms: rate.durationTerms || null,
    }))
    .filter((rate) => rate.objectId)
    .sort((a, b) => Number(a.amount) - Number(b.amount))

  return rates
}

export async function purchaseShippingLabel(rateObjectId: string) {
  const shippo = getShippo()
  const transaction = await shippo.transactions.create({
    rate: rateObjectId,
    labelFileType: 'PDF_4x6',
    async: false,
  })

  if (transaction.status !== 'SUCCESS') {
    throw new Error(transaction.messages?.[0]?.text || 'Shippo failed to create the label')
  }

  return {
    transactionId: transaction.objectId || '',
    labelUrl: transaction.labelUrl || '',
    trackingNumber: transaction.trackingNumber || '',
    trackingUrl: transaction.trackingUrlProvider || '',
  }
}

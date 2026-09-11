import { Shippo } from 'shippo'
import type { ParcelTemplateEnumSet } from 'shippo/models/components/parceltemplateenumset.js'
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

export type UspsBoxTemplate = {
  token: string
  label: string
  sizeHint: string
  defaultWeight: number
}

/** USPS Flat Rate / Regional Rate boxes only (no envelopes). */
export const USPS_BOX_TEMPLATES: UspsBoxTemplate[] = [
  {
    token: 'USPS_SmallFlatRateBox',
    label: 'Small Flat Rate Box',
    sizeHint: '8.69 × 5.44 × 1.75 in',
    defaultWeight: 1.5,
  },
  {
    token: 'USPS_MediumFlatRateBox1',
    label: 'Medium Flat Rate Box',
    sizeHint: '11.25 × 8.75 × 6 in · top-load',
    defaultWeight: 3,
  },
  {
    token: 'USPS_MediumFlatRateBox2',
    label: 'Medium Flat Rate Box (side)',
    sizeHint: '14 × 12 × 3.5 in · side-load',
    defaultWeight: 3,
  },
  {
    token: 'USPS_LargeFlatRateBox',
    label: 'Large Flat Rate Box',
    sizeHint: '12.25 × 12.25 × 6 in',
    defaultWeight: 5,
  },
  {
    token: 'USPS_RegionalRateBoxA1',
    label: 'Regional Rate Box A1',
    sizeHint: '10.13 × 7.13 × 5 in',
    defaultWeight: 2,
  },
  {
    token: 'USPS_RegionalRateBoxA2',
    label: 'Regional Rate Box A2',
    sizeHint: '13.06 × 11.06 × 2.5 in',
    defaultWeight: 2,
  },
  {
    token: 'USPS_RegionalRateBoxB1',
    label: 'Regional Rate Box B1',
    sizeHint: '12.25 × 10.5 × 5.5 in',
    defaultWeight: 4,
  },
  {
    token: 'USPS_RegionalRateBoxB2',
    label: 'Regional Rate Box B2',
    sizeHint: '16.25 × 14.5 × 3 in',
    defaultWeight: 4,
  },
]

export const DEFAULT_BOX_TOKEN = USPS_BOX_TEMPLATES[0].token

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

export function resolveBoxTemplate(token?: string) {
  return (
    USPS_BOX_TEMPLATES.find((t) => t.token === token) || USPS_BOX_TEMPLATES[0]
  )
}

/** Build Shippo parcel using a USPS box template + weight only. */
export function normalizeParcel(parcel: OrderParcel) {
  const box = resolveBoxTemplate(parcel.template)
  const weight = parcel.weight ?? box.defaultWeight

  return {
    template: box.token as ParcelTemplateEnumSet,
    weight: String(weight),
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

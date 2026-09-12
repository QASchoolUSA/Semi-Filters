export type FulfillmentMethod = 'shipping' | 'pickup'

export const PICKUP_LOCATION = {
  name: 'Semi Filters',
  line1: '1660 Retreat View Cir',
  city: 'Sanford',
  state: 'FL',
  postalCode: '32771',
  country: 'US',
} as const

export const PICKUP_ADDRESS_ONE_LINE =
  '1660 Retreat View Cir, Sanford, FL'

export const PICKUP_ADDRESS_MULTILINE = [
  PICKUP_LOCATION.line1,
  `${PICKUP_LOCATION.city}, ${PICKUP_LOCATION.state}`,
].join('\n')

export const PICKUP_ADDRESS_HTML =
  `${PICKUP_LOCATION.line1}<br/>${PICKUP_LOCATION.city}, ${PICKUP_LOCATION.state}`

/** $5.99 base + $1.00 per additional item beyond the first */
export function calculateShippingDollars(itemQuantityCount: number): number {
  if (itemQuantityCount <= 0) return 0
  return 5.99 + Math.max(0, itemQuantityCount - 1) * 1.0
}

export function parseFulfillmentMethod(
  value: unknown
): FulfillmentMethod {
  return value === 'pickup' ? 'pickup' : 'shipping'
}

export function fulfillmentMethodLabel(method: FulfillmentMethod): string {
  return method === 'pickup' ? 'Pickup' : 'Shipping'
}

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminFetch } from '@/sanity/lib/admin-client'
import { orderByIdQuery } from '@/sanity/lib/queries'
import { getShippingRates } from '@/lib/shippo'
import type { OrderParcel, StoreOrder } from '@/types'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const orderId = typeof body.orderId === 'string' ? body.orderId : ''
    const parcel = (body.parcel || {}) as OrderParcel

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }

    const order = (await adminFetch(orderByIdQuery, { id: orderId })) as StoreOrder | null

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.shippingAddress) {
      return NextResponse.json({ error: 'Order has no shipping address' }, { status: 400 })
    }

    const rates = await getShippingRates(order.shippingAddress, parcel)
    return NextResponse.json({ rates })
  } catch (error: any) {
    console.error('Rates error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch rates' },
      { status: 500 }
    )
  }
}

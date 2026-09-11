import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminFetch } from '@/sanity/lib/admin-client'
import { orderByIdQuery } from '@/sanity/lib/queries'
import { writeClient } from '@/sanity/lib/write-client'
import { purchaseShippingLabel, resolveBoxTemplate } from '@/lib/shippo'
import { sendEmail } from '@/lib/email'
import type { OrderParcel, StoreOrder } from '@/types'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const orderId = typeof body.orderId === 'string' ? body.orderId : ''
    const rateId = typeof body.rateId === 'string' ? body.rateId : ''
    const carrier = typeof body.carrier === 'string' ? body.carrier : undefined
    const servicelevel = typeof body.servicelevel === 'string' ? body.servicelevel : undefined
    const parcel = (body.parcel || {}) as OrderParcel

    if (!orderId || !rateId) {
      return NextResponse.json({ error: 'orderId and rateId are required' }, { status: 400 })
    }

    const order = (await adminFetch(orderByIdQuery, { id: orderId })) as StoreOrder | null

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'shipped' && order.labelUrl) {
      return NextResponse.json({
        labelUrl: order.labelUrl,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        alreadyShipped: true,
      })
    }

    const label = await purchaseShippingLabel(rateId)
    const shippedAt = new Date().toISOString()
    const box = resolveBoxTemplate(parcel.template)

    await writeClient
      .patch(orderId)
      .set({
        status: 'shipped',
        trackingNumber: label.trackingNumber,
        trackingUrl: label.trackingUrl || undefined,
        labelUrl: label.labelUrl,
        shippoRateId: rateId,
        shippoTransactionId: label.transactionId,
        carrier,
        servicelevel,
        shippedAt,
        parcel: {
          template: box.token,
          weight: parcel.weight ?? box.defaultWeight,
        },
      })
      .commit()

    if (order.customerEmail && label.trackingNumber) {
      try {
        await sendEmail({
          to: order.customerEmail,
          subject: `Your Semi Filters order has shipped`,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; max-width:600px; margin:0 auto;">
              <h1 style="font-size:22px; color:#111;">Your order is on the way</h1>
              <p style="color:#555; font-size:15px;">Hi ${order.customerName || 'there'}, your Semi Filters order has shipped.</p>
              <p style="color:#555; font-size:15px;">
                <strong>Carrier:</strong> ${carrier || 'Carrier'}<br/>
                <strong>Service:</strong> ${servicelevel || 'Standard'}<br/>
                <strong>Tracking:</strong> ${
                  label.trackingUrl
                    ? `<a href="${label.trackingUrl}">${label.trackingNumber}</a>`
                    : label.trackingNumber
                }
              </p>
              <p style="color:#999; font-size:12px; margin-top:32px;">Semi Filters — Premium Automotive Filters</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Failed to send tracking email:', emailErr)
      }
    }

    return NextResponse.json({
      labelUrl: label.labelUrl,
      trackingNumber: label.trackingNumber,
      trackingUrl: label.trackingUrl,
      carrier,
      servicelevel,
    })
  } catch (error: any) {
    console.error('Label purchase error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to purchase label' },
      { status: 500 }
    )
  }
}

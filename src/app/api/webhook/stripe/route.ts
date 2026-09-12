import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendEmail } from '@/lib/email'
import {
  PICKUP_ADDRESS_HTML,
  PICKUP_ADDRESS_ONE_LINE,
  parseFulfillmentMethod,
} from '@/lib/fulfillment'
import { upsertOrderFromStripeSession } from '@/lib/orders'
import { sendTelegramMessage } from '@/lib/telegram'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(key, {
    apiVersion: '2026-08-26.dahlia',
  })
}

export async function POST(request: Request) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'line_items.data.price.product'],
      })

      try {
        await upsertOrderFromStripeSession(fullSession)
      } catch (orderErr) {
        console.error('Failed to persist order to Sanity:', orderErr)
      }

      const fulfillmentMethod = parseFulfillmentMethod(fullSession.metadata?.fulfillmentMethod)
      const isPickup = fulfillmentMethod === 'pickup'
      const customerEmail = fullSession.customer_details?.email
      const customerName = fullSession.customer_details?.name || 'Customer'
      const customerPhone = fullSession.customer_details?.phone || '—'
      const shipping = fullSession.collected_information?.shipping_details
      const lineItems = fullSession.line_items?.data || []
      const amountTotal = ((fullSession.amount_total || 0) / 100).toFixed(2)
      const amountSubtotal = ((fullSession.amount_subtotal || 0) / 100).toFixed(2)
      const shippingCost = ((fullSession.total_details?.amount_shipping || 0) / 100).toFixed(2)
      const taxAmount = ((fullSession.total_details?.amount_tax || 0) / 100).toFixed(2)

      const itemRowsHtml = lineItems
        .map((item) => {
          const product = item.price?.product as Stripe.Product | undefined
          const name = item.description || product?.name || 'Item'
          const qty = item.quantity || 1
          const unitPrice = ((item.price?.unit_amount || 0) / 100).toFixed(2)
          const lineTotal = ((item.amount_total || 0) / 100).toFixed(2)
          return `
            <tr>
              <td style="padding:10px 12px; border-bottom:1px solid #eee;">${name}</td>
              <td style="padding:10px 12px; border-bottom:1px solid #eee; text-align:center;">${qty}</td>
              <td style="padding:10px 12px; border-bottom:1px solid #eee; text-align:right;">$${unitPrice}</td>
              <td style="padding:10px 12px; border-bottom:1px solid #eee; text-align:right;">$${lineTotal}</td>
            </tr>`
        })
        .join('')

      const shippingAddressHtml = shipping?.address
        ? `${shipping.name || ''}<br/>
           ${shipping.address.line1 || ''}${shipping.address.line2 ? '<br/>' + shipping.address.line2 : ''}<br/>
           ${shipping.address.city || ''}, ${shipping.address.state || ''} ${shipping.address.postal_code || ''}<br/>
           ${shipping.address.country || ''}`
        : 'Not provided'

      const shippingAddressText = shipping?.address
        ? [
            shipping.name,
            shipping.address.line1,
            shipping.address.line2,
            [shipping.address.city, shipping.address.state, shipping.address.postal_code]
              .filter(Boolean)
              .join(', '),
            shipping.address.country,
          ]
            .filter(Boolean)
            .join(', ')
        : 'Not provided'

      const deliveryLabel = isPickup ? 'Pickup' : 'Ship To'
      const deliveryHtml = isPickup ? PICKUP_ADDRESS_HTML : shippingAddressHtml
      const deliveryText = isPickup ? PICKUP_ADDRESS_ONE_LINE : shippingAddressText
      const deliveryMethodLabel = isPickup ? 'Local Pickup' : 'Shipping'
      const fulfillmentCostLabel = isPickup ? 'Pickup' : 'Shipping'

      const itemLinesText = lineItems
        .map((item) => {
          const product = item.price?.product as Stripe.Product | undefined
          const name = item.description || product?.name || 'Item'
          const qty = item.quantity || 1
          const lineTotal = ((item.amount_total || 0) / 100).toFixed(2)
          return `• ${qty}× ${name} — $${lineTotal}`
        })
        .join('\n')

      const orderTableHtml = `
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:10px 12px; text-align:left;">Item</th>
              <th style="padding:10px 12px; text-align:center;">Qty</th>
              <th style="padding:10px 12px; text-align:right;">Price</th>
              <th style="padding:10px 12px; text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRowsHtml}
          </tbody>
        </table>`

      const totalsHtml = `
        <table style="width:100%; max-width:280px; margin-left:auto; font-size:14px; margin-top:12px;">
          <tr>
            <td style="padding:4px 0; color:#555;">Subtotal</td>
            <td style="padding:4px 0; text-align:right;">$${amountSubtotal}</td>
          </tr>
          <tr>
            <td style="padding:4px 0; color:#555;">${fulfillmentCostLabel}</td>
            <td style="padding:4px 0; text-align:right;">$${shippingCost}</td>
          </tr>
          <tr>
            <td style="padding:4px 0; color:#555;">Tax</td>
            <td style="padding:4px 0; text-align:right;">$${taxAmount}</td>
          </tr>
          <tr style="border-top:2px solid #111;">
            <td style="padding:8px 0; font-weight:700; font-size:16px;">Total</td>
            <td style="padding:8px 0; text-align:right; font-weight:700; font-size:16px;">$${amountTotal}</td>
          </tr>
        </table>`

      await sendEmail({
        to: 'support@semifilters.com',
        subject: `New Order — ${customerName} ($${amountTotal})`,
        replyTo: customerEmail || undefined,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; max-width:600px; margin:0 auto;">
            <h2 style="margin:0 0 4px; color:#111;">New Order Received</h2>
            <p style="margin:0 0 24px; color:#666; font-size:14px;">Payment confirmed via Stripe</p>

            <table style="width:100%; border-collapse:collapse; margin-bottom:24px; font-size:14px;">
              <tr>
                <td style="padding:8px 12px; font-weight:600; color:#555; width:110px;">Customer</td>
                <td style="padding:8px 12px;">${customerName}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:8px 12px; font-weight:600; color:#555;">Email</td>
                <td style="padding:8px 12px;"><a href="mailto:${customerEmail}">${customerEmail}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 12px; font-weight:600; color:#555;">Phone</td>
                <td style="padding:8px 12px;">${customerPhone}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:8px 12px; font-weight:600; color:#555;">Delivery</td>
                <td style="padding:8px 12px;">${deliveryMethodLabel}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px; font-weight:600; color:#555;">${deliveryLabel}</td>
                <td style="padding:8px 12px;">${deliveryHtml}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:8px 12px; font-weight:600; color:#555;">Stripe ID</td>
                <td style="padding:8px 12px; font-family:monospace; font-size:13px;">${session.id}</td>
              </tr>
            </table>

            ${orderTableHtml}
            ${totalsHtml}
          </div>
        `,
      })

      try {
        await sendTelegramMessage(
          [
            `🛒 New order — $${amountTotal}`,
            '',
            `Customer: ${customerName}`,
            `Email: ${customerEmail || '—'}`,
            `Phone: ${customerPhone}`,
            `Delivery: ${deliveryMethodLabel}`,
            `${isPickup ? 'Pickup' : 'Ship to'}: ${deliveryText}`,
            '',
            itemLinesText || '• (no line items)',
            '',
            `Subtotal $${amountSubtotal} · ${fulfillmentCostLabel} $${shippingCost} · Tax $${taxAmount}`,
            `Stripe: ${session.id}`,
          ].join('\n')
        )
      } catch (telegramErr) {
        console.error('Failed to send Telegram order alert:', telegramErr)
      }

      if (customerEmail) {
        const customerFulfillmentHtml = isPickup
          ? `
              <div style="background:#f9fafb; border-radius:12px; padding:24px; margin-bottom:24px;">
                <h3 style="margin:0 0 12px; font-size:15px; color:#333;">Local Pickup</h3>
                <p style="margin:0; color:#555; font-size:14px; line-height:1.6;">${PICKUP_ADDRESS_HTML}</p>
              </div>
              <div style="text-align:center; padding:16px 0 8px;">
                <p style="margin:0 0 4px; color:#555; font-size:14px;">
                  Your order is confirmed for pickup at our Sanford location.
                </p>
                <p style="margin:0; color:#555; font-size:14px;">
                  Questions? Reply to this email or contact us at
                  <a href="mailto:support@semifilters.com" style="color:#2563eb;">support@semifilters.com</a>
                </p>
              </div>`
          : `
              <div style="background:#f9fafb; border-radius:12px; padding:24px; margin-bottom:24px;">
                <h3 style="margin:0 0 12px; font-size:15px; color:#333;">Shipping Address</h3>
                <p style="margin:0; color:#555; font-size:14px; line-height:1.6;">${shippingAddressHtml}</p>
              </div>
              <div style="text-align:center; padding:16px 0 8px;">
                <p style="margin:0 0 4px; color:#555; font-size:14px;">
                  Your order is being prepared and will ship within 1–2 business days.
                </p>
                <p style="margin:0; color:#555; font-size:14px;">
                  Questions? Reply to this email or contact us at
                  <a href="mailto:support@semifilters.com" style="color:#2563eb;">support@semifilters.com</a>
                </p>
              </div>`

        await sendEmail({
          to: customerEmail,
          subject: `Order Confirmation — Semi Filters`,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; max-width:600px; margin:0 auto;">
              <div style="text-align:center; padding:32px 0 24px;">
                <h1 style="margin:0 0 8px; color:#111; font-size:24px;">Thank You for Your Order!</h1>
                <p style="margin:0; color:#666; font-size:15px;">Hi ${customerName}, your payment has been confirmed.</p>
              </div>

              <div style="background:#f9fafb; border-radius:12px; padding:24px; margin-bottom:24px;">
                <h3 style="margin:0 0 16px; font-size:15px; color:#333;">Order Summary</h3>
                ${orderTableHtml}
                ${totalsHtml}
              </div>

              ${customerFulfillmentHtml}

              <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
              <p style="text-align:center; color:#999; font-size:12px; margin:0;">
                Semi Filters &mdash; Premium Automotive Filters
              </p>
            </div>
          `,
        })
      }
    } catch (emailErr) {
      console.error('Failed to process order webhook:', emailErr)
    }
  }

  return NextResponse.json({ received: true })
}

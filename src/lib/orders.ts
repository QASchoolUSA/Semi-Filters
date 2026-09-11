import type Stripe from 'stripe'
import { writeClient } from '@/sanity/lib/write-client'
import { orderByStripeSessionQuery } from '@/sanity/lib/queries'

export async function upsertOrderFromStripeSession(fullSession: Stripe.Checkout.Session) {
  if (!process.env.SANITY_API_TOKEN) {
    console.warn('SANITY_API_TOKEN missing — skipping order persistence')
    return null
  }

  const shipping = fullSession.collected_information?.shipping_details
  const lineItems = fullSession.line_items?.data || []

  const doc = {
    _type: 'order' as const,
    stripeSessionId: fullSession.id,
    status: 'paid' as const,
    customerName: fullSession.customer_details?.name || shipping?.name || 'Customer',
    customerEmail: fullSession.customer_details?.email || undefined,
    customerPhone: fullSession.customer_details?.phone || undefined,
    shippingAddress: shipping?.address
      ? {
          name: shipping.name || fullSession.customer_details?.name || undefined,
          line1: shipping.address.line1 || undefined,
          line2: shipping.address.line2 || undefined,
          city: shipping.address.city || undefined,
          state: shipping.address.state || undefined,
          postalCode: shipping.address.postal_code || undefined,
          country: shipping.address.country || undefined,
        }
      : undefined,
    lineItems: lineItems.map((item) => {
      const product = item.price?.product as Stripe.Product | undefined
      return {
        name: item.description || product?.name || 'Item',
        quantity: item.quantity || 1,
        unitAmount: item.price?.unit_amount || 0,
        partNumber: product?.metadata?.partNumber || undefined,
      }
    }),
    subtotal: fullSession.amount_subtotal || 0,
    shipping: fullSession.total_details?.amount_shipping || 0,
    tax: fullSession.total_details?.amount_tax || 0,
    total: fullSession.amount_total || 0,
  }

  const existing = await writeClient.fetch<{ _id: string } | null>(orderByStripeSessionQuery, {
    sessionId: fullSession.id,
  })

  if (existing?._id) {
    return writeClient
      .patch(existing._id)
      .set({
        customerName: doc.customerName,
        customerEmail: doc.customerEmail,
        customerPhone: doc.customerPhone,
        shippingAddress: doc.shippingAddress,
        lineItems: doc.lineItems,
        subtotal: doc.subtotal,
        shipping: doc.shipping,
        tax: doc.tax,
        total: doc.total,
      })
      .commit()
  }

  return writeClient.create(doc)
}

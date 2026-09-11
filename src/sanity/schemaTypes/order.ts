import { defineField, defineType } from 'sanity'

export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Paid', value: 'paid' },
          { title: 'Ready to ship', value: 'ready_to_ship' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'paid',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
    }),
    defineField({
      name: 'customerPhone',
      title: 'Customer Phone',
      type: 'string',
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'line1', type: 'string', title: 'Address line 1' },
        { name: 'line2', type: 'string', title: 'Address line 2' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State' },
        { name: 'postalCode', type: 'string', title: 'Postal code' },
        { name: 'country', type: 'string', title: 'Country' },
      ],
    }),
    defineField({
      name: 'lineItems',
      title: 'Line Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'quantity', type: 'number', title: 'Quantity' },
            { name: 'unitAmount', type: 'number', title: 'Unit amount (cents)' },
            { name: 'partNumber', type: 'string', title: 'Part number' },
          ],
        },
      ],
    }),
    defineField({
      name: 'subtotal',
      title: 'Subtotal (cents)',
      type: 'number',
    }),
    defineField({
      name: 'shipping',
      title: 'Shipping (cents)',
      type: 'number',
    }),
    defineField({
      name: 'tax',
      title: 'Tax (cents)',
      type: 'number',
    }),
    defineField({
      name: 'total',
      title: 'Total (cents)',
      type: 'number',
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
    }),
    defineField({
      name: 'trackingUrl',
      title: 'Tracking URL',
      type: 'url',
    }),
    defineField({
      name: 'carrier',
      title: 'Carrier',
      type: 'string',
    }),
    defineField({
      name: 'servicelevel',
      title: 'Service Level',
      type: 'string',
    }),
    defineField({
      name: 'labelUrl',
      title: 'Label URL',
      type: 'url',
    }),
    defineField({
      name: 'shippoRateId',
      title: 'Shippo Rate ID',
      type: 'string',
    }),
    defineField({
      name: 'shippoTransactionId',
      title: 'Shippo Transaction ID',
      type: 'string',
    }),
    defineField({
      name: 'shippedAt',
      title: 'Shipped At',
      type: 'datetime',
    }),
    defineField({
      name: 'parcel',
      title: 'Last Parcel Used',
      type: 'object',
      fields: [
        { name: 'length', type: 'number', title: 'Length (in)' },
        { name: 'width', type: 'number', title: 'Width (in)' },
        { name: 'height', type: 'number', title: 'Height (in)' },
        { name: 'weight', type: 'number', title: 'Weight (lb)' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'customerEmail',
      status: 'status',
      total: 'total',
    },
    prepare({ title, subtitle, status, total }) {
      const dollars = typeof total === 'number' ? `$${(total / 100).toFixed(2)}` : ''
      return {
        title: title || 'Order',
        subtitle: [status, dollars, subtitle].filter(Boolean).join(' · '),
      }
    },
  },
  orderings: [
    {
      title: 'Newest first',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
})

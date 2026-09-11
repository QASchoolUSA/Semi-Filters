import React from 'react'
import type { OrderStatus } from '@/types'

const LABELS: Record<OrderStatus, string> = {
  paid: 'Paid',
  ready_to_ship: 'Ready',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
}

export default function StatusChip({ status }: { status: OrderStatus }) {
  return (
    <span className={`sm-status sm-status--${status}`}>
      {LABELS[status] || status}
    </span>
  )
}

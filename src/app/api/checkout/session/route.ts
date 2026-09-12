import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { parseFulfillmentMethod } from '@/lib/fulfillment'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(key, {
    apiVersion: '2026-08-26.dahlia',
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    if (!sessionId) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const fulfillmentMethod = parseFulfillmentMethod(session.metadata?.fulfillmentMethod)

    return NextResponse.json({ fulfillmentMethod })
  } catch (error: unknown) {
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json({ error: 'Unable to load session' }, { status: 500 })
  }
}

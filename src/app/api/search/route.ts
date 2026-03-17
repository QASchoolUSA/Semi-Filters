import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { searchProductsQuery } from '@/sanity/lib/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const term = `${q}*`
    const rawTerm = q.toUpperCase()
    const results = await client.fetch(searchProductsQuery, { term, rawTerm })
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}

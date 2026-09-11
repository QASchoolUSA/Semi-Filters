import { NextResponse } from 'next/server'
import { sanityFetch } from '@/sanity/lib/fetch'
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
    const results = await sanityFetch(searchProductsQuery, {
      params: { term, rawTerm },
      revalidate: 30,
      tags: ['products', 'search'],
    })
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { productSlugsByIdsQuery } from '@/sanity/lib/queries'

export async function POST(request: Request) {
    try {
        const { ids } = await request.json()

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ slugs: {} })
        }

        const results: { _id: string; slug: string }[] = await client.fetch(
            productSlugsByIdsQuery,
            { ids }
        )

        const slugMap: Record<string, string> = {}
        for (const r of results) {
            slugMap[r._id] = r.slug
        }

        return NextResponse.json({ slugs: slugMap })
    } catch {
        return NextResponse.json({ slugs: {} })
    }
}

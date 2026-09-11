import { NextResponse } from 'next/server'
import { sanityFetch } from '@/sanity/lib/fetch'
import { productSlugsByIdsQuery } from '@/sanity/lib/queries'

export async function POST(request: Request) {
    try {
        const { ids } = await request.json()

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ slugs: {} })
        }

        const results = await sanityFetch(productSlugsByIdsQuery, {
            params: { ids },
            tags: ['products'],
        })

        const slugMap: Record<string, string> = {}
        for (const r of results ?? []) {
            if (r.slug) slugMap[r._id] = r.slug
        }

        return NextResponse.json({ slugs: slugMap })
    } catch {
        return NextResponse.json({ slugs: {} })
    }
}

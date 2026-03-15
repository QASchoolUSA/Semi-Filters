import { NextRequest, NextResponse } from 'next/server'

const INDEXNOW_KEY = '5c612e88d1cf4347927320b329235bd3'
const HOST = 'semifilters.com'

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.INDEXNOW_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: { urls?: string[] }
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const urls = body.urls
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return NextResponse.json({ error: 'urls array is required' }, { status: 400 })
    }

    const payload = {
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls.map((u) => (u.startsWith('http') ? u : `https://${HOST}${u}`)),
    }

    const endpoints = [
        'https://api.indexnow.org/indexnow',
        'https://www.bing.com/indexnow',
        'https://yandex.com/indexnow',
    ]

    const results = await Promise.allSettled(
        endpoints.map((endpoint) =>
            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(payload),
            }).then((r) => ({ endpoint, status: r.status }))
        )
    )

    return NextResponse.json({
        submitted: urls.length,
        results: results.map((r) =>
            r.status === 'fulfilled' ? r.value : { error: String(r.reason) }
        ),
    })
}

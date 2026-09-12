import { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/studio', '/api/', '/cart', '/success', '/store-management'],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    }
}

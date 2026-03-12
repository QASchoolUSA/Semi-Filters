import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/studio', '/api/', '/cart', '/success'],
            },
        ],
        sitemap: 'https://semifilters.com/sitemap.xml',
        host: 'https://semifilters.com',
    }
}

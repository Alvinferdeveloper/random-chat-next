import { MetadataRoute } from 'next'
import { APP_URL } from '@/src/app/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/chat/', '/profile/', '/rooms/favorites', '/rooms/my-rooms', '/verify-email', '/api/'],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
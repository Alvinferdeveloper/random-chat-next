import { MetadataRoute } from 'next'

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/chat/', '/profile/', '/rooms/favorites', '/rooms/my-rooms', '/verify-email'],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  }
}
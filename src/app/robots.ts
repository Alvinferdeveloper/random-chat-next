import { Metadata } from 'next'

export default function robots(): Metadata {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/chat/', '/profile/', '/verify-email/'],
    },
    sitemap: 'https://chathub.com/sitemap.xml',
  } as any
}
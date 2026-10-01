import type { MetadataRoute } from 'next';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');

// Fase 1.2: blokir crawler dari area API, admin, dan dashboard.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/dashboard/', '/login', '/signup'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

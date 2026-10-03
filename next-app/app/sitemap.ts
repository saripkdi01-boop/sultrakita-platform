import type { MetadataRoute } from 'next';
import { getServerSupabase } from '@/lib/supabase/server';
import { KENDARI_SLUGS } from '@/lib/seo/lokal-kendari';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');

// Fase 1.2: sitemap lengkap — halaman area statis + detail properti, lowongan,
// dan listing marketplace dinamis dengan lastModified asli dari database.
// T3 launch: + /launch dan halaman SEO lokal /kendari/[slug] (10 kategori).

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/beranda`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/properti`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/groups`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${siteUrl}/help-center`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${siteUrl}/bantuan/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/kontak`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${siteUrl}/security-center`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/launch`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/Business`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/Business/direktori`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/Business/daftar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/kendari`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...KENDARI_SLUGS.map((slug) => ({
      url: `${siteUrl}/kendari/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    { url: `${siteUrl}/legal/kebijakan-privasi`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/legal/syarat-ketentuan`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
  try {
    const supabase = await getServerSupabase();
    const [properties, jobs, listings] = await Promise.all([
      supabase.from('properties').select('id,created_at,updated_at').in('status', ['available', 'rented', 'sold']).order('updated_at', { ascending: false }).limit(1000),
      supabase.from('jobs').select('id,created_at,updated_at,published_at').eq('status', 'published').order('published_at', { ascending: false }).limit(1000),
      supabase.from('listings').select('id,created_at,updated_at').in('status', ['published', 'active']).or('is_demo.is.null,is_demo.eq.false').order('updated_at', { ascending: false }).limit(1000),
    ]);
    const propertyUrls = (properties.data || []).map((property) => ({
      url: `${siteUrl}/properti/${property.id}`,
      lastModified: new Date(property.updated_at || property.created_at || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    const jobUrls = (jobs.data || []).map((job) => ({
      url: `${siteUrl}/jobs/${job.id}`,
      lastModified: new Date(job.updated_at || job.published_at || job.created_at || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    // Listing marketplace dibuka lewat deep link ?listing= (QuickView) karena
    // belum ada halaman detail /marketplace/[slug] (Fase 2).
    const listingUrls = (listings.data || []).map((listing) => ({
      url: `${siteUrl}/marketplace?listing=${listing.id}`,
      lastModified: new Date(listing.updated_at || listing.created_at || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
    return [...staticRoutes, ...propertyUrls, ...jobUrls, ...listingUrls];
  } catch {
    return staticRoutes;
  }
}

import type { MetadataRoute } from 'next';
import { getServerSupabase } from '@/lib/supabase/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sultrakita-platform.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/properti`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
  ];
  try {
    const { data } = await (await getServerSupabase())
      .from('properties')
      .select('id,created_at,updated_at')
      .eq('status', 'available')
      .limit(500);
    return [...staticRoutes, ...(data || []).map(property => ({
      url: `${siteUrl}/properti/${property.id}`,
      lastModified: new Date(property.updated_at || property.created_at || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))];
  } catch {
    return staticRoutes;
  }
}

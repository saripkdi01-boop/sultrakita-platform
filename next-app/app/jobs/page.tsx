import type { Metadata } from 'next';
import { getJobs } from '@/lib/actions/jobs';
import JobsPageClient from './page-client';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');
const ogImage = `${siteUrl}/og-image.png`;

const title = 'SUKI Jobs — Lowongan Kerja Sulawesi Tenggara';
const description = 'Temukan lowongan kerja terbaru di Sulawesi Tenggara: full-time, part-time, freelance, dan remote. Lamar langsung, simpan lowongan favorit.';

// Fase 1.1: data lowongan awal di-render di server (ISR, refresh 2 menit) + metadata SEO/OG.
export const revalidate = 120;
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/jobs` },
  openGraph: { title, description, type: 'website', url: `${siteUrl}/jobs`, siteName: 'SUKI Apps', locale: 'id_ID', images: [{ url: ogImage, alt: 'SUKI Apps' }] },
  twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
};

export default async function JobsPage() {
  const result = await getJobs();
  return <JobsPageClient initialJobs={result.ok ? result.jobs : []} />;
}

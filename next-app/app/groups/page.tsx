import type { Metadata } from 'next';
import { getGroups } from '@/lib/actions/groups';
import GroupsPageClient from './page-client';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');
const ogImage = `${siteUrl}/og-image.png`;

const title = 'SUKI Groups — Komunitas Sulawesi Tenggara';
const description = 'Bergabung dengan komunitas lokal Sulawesi Tenggara: diskusi, acara, dan kolaborasi warga di SUKI Groups.';

// Fase 1.1: daftar grup awal di-render di server (ISR, refresh 2 menit) + metadata SEO/OG.
export const revalidate = 120;
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/groups` },
  openGraph: { title, description, type: 'website', url: `${siteUrl}/groups`, siteName: 'SUKI Apps', locale: 'id_ID', images: [{ url: ogImage, alt: 'SUKI Apps' }] },
  twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
};

export default async function GroupsPage() {
  const result = await getGroups('');
  return <GroupsPageClient initialGroups={result.ok ? (result.data as never[]) : []} />;
}

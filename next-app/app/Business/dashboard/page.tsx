import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireServerUser } from '@/lib/supabase/server';
import { BUSINESS_CATEGORIES, fetchOwnerBusinesses, type OwnerBusiness } from '@/lib/businesses-query';
import DashboardClient from './dashboard-client';
import type { BusinessCardData } from '../_components/BusinessCard';

export const metadata: Metadata = {
  title: 'Dashboard Bisnis — SUKI Business',
  description:
    'Kelola profil bisnis Anda di SUKI Business: ubah informasi usaha, pantau status kurasi, dan baca pertanyaan yang masuk.',
  alternates: { canonical: 'https://sukiapps.web.id/Business/dashboard' },
};

function categoryLabelFor(value: string): string {
  const raw = BUSINESS_CATEGORIES as unknown as Array<{ value?: unknown; label?: unknown }>;
  const found = raw.find((c) => String(c.value ?? '') === value);
  return found ? String(found.label ?? value) : value;
}

/** Normalisasi baris bisnis dari lib menjadi data kartu. */
function toCardData(business: OwnerBusiness): BusinessCardData {
  return {
    id: business.id,
    nama: business.name || 'Tanpa nama',
    status: business.status ?? null,
    kategoriLabel: business.category ? categoryLabelFor(business.category) : undefined,
    kota: business.city || undefined,
  };
}

export default async function BusinessDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ baru?: string }>;
}) {
  let userId: string;
  try {
    const { user } = await requireServerUser();
    userId = user.id;
  } catch {
    redirect('/login?next=/Business/dashboard');
  }

  const params = await searchParams;
  const businesses = await fetchOwnerBusinesses(userId);
  const cards = businesses.map(toCardData).filter((c) => c.id);
  const justSubmitted = params.baru === '1';

  return <DashboardClient cards={cards} justSubmitted={justSubmitted} />;
}

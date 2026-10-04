import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireServerUser } from '@/lib/supabase/server';
import { BUSINESS_CATEGORIES } from '@/lib/businesses-query';
import DaftarClient from './daftar-client';
import type { CategoryOption } from '../_components/BusinessForm';

export const metadata: Metadata = {
  title: 'Daftarkan Bisnis — SUKI Business',
  description:
    'Daftarkan usaha Anda di SUKI Business dalam empat langkah mudah. Tim kami akan mengkurasi profil Anda sebelum tayang.',
  alternates: { canonical: 'https://sukiapps.web.id/Business/daftar' },
};

function toCategoryOptions(): CategoryOption[] {
  const raw = BUSINESS_CATEGORIES as unknown as Array<{ value?: unknown; label?: unknown }>;
  return raw
    .map((c) => ({ value: String(c.value ?? ''), label: String(c.label ?? '') }))
    .filter((c) => c.value && c.label);
}

export default async function DaftarBusinessPage() {
  try {
    await requireServerUser();
  } catch {
    redirect('/login?next=/Business/daftar');
  }

  return <DaftarClient categories={toCategoryOptions()} />;
}

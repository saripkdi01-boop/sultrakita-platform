import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireServerUser } from '@/lib/supabase/server';
import { BUSINESS_CATEGORIES } from '@/lib/businesses-query';
import BusinessHeader from '../_components/BusinessHeader';
import DaftarForm from './daftar-form';
import { containerNarrow, pageKicker, pageSubtitle, pageTitle } from '../_components/formStyles';
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

  return (
    <main className="suki-business-page">
      <BusinessHeader hideCta />
      <div style={containerNarrow}>
        <p style={pageKicker}>
          <span aria-hidden="true" style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--sb-gold)' }} />
          Daftarkan bisnis
        </p>
        <h1 style={pageTitle}>Ceritakan usaha Anda</h1>
        <p style={pageSubtitle}>
          Lengkapi empat langkah berikut. Profil yang Anda kirim akan ditinjau tim SUKI sebelum tayang di direktori bisnis.
        </p>
        <DaftarForm categories={toCategoryOptions()} />
      </div>
    </main>
  );
}

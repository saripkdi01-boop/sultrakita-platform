import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireServerUser } from '@/lib/supabase/server';
import { BUSINESS_CATEGORIES, fetchOwnerBusinesses, type OwnerBusiness } from '@/lib/businesses-query';
import BusinessHeader from '../_components/BusinessHeader';
import BusinessCard, { type BusinessCardData } from '../_components/BusinessCard';
import { backLink, containerWide, pageKicker, pageSubtitle, pageTitle, successBanner } from '../_components/formStyles';

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

  return (
    <main className="suki-business-page">
      <BusinessHeader />
      <div style={containerWide}>
        <Link href="/Business" style={backLink}>
          <span aria-hidden="true">←</span> Kembali ke SUKI Business
        </Link>
        <p style={pageKicker}>
          <span aria-hidden="true" style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--sb-gold)' }} />
          Dashboard bisnis
        </p>
        <h1 style={pageTitle}>Bisnis saya</h1>
        <p style={pageSubtitle}>
          Kelola profil usaha Anda, pantau status kurasi tim SUKI, dan baca pertanyaan yang masuk dari pelanggan.
        </p>

        {justSubmitted && (
          <div role="status" style={successBanner}>
            Bisnis Anda terkirim dan menunggu kurasi tim SUKI.
          </div>
        )}

        <div style={{ marginBottom: 26 }}>
          <Link href="/Business/daftar" className="suki-business-button suki-business-button-teal">
            + Daftarkan bisnis baru
          </Link>
        </div>

        {cards.length === 0 ? (
          <div
            style={{
              border: '1px dashed var(--sb-line)',
              borderRadius: 20,
              background: '#fff',
              padding: '48px 28px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 800, color: 'var(--sb-ink)' }}>
              Belum ada bisnis terdaftar
            </p>
            <p style={{ margin: '0 0 22px', fontSize: 13, color: 'var(--sb-muted)', lineHeight: 1.7 }}>
              Daftarkan usaha pertama Anda dan biarkan warga Sulawesi Tenggara menemukan Anda.
            </p>
            <Link href="/Business/daftar" className="suki-business-button suki-business-button-dark">
              Daftarkan bisnis pertama
            </Link>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 16 }}>
            {cards.map((business) => (
              <li key={business.id}>
                <BusinessCard business={business} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

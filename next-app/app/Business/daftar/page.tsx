import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BadgeCheck, Network, Store } from 'lucide-react';
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

const VALUE_PROPS = [
  { icon: BadgeCheck, title: 'Dikurasi tim SUKI', text: 'Profil Anda ditinjau sebelum tayang di direktori.' },
  { icon: Store, title: 'Tampil di direktori', text: 'Mudah ditemukan warga di seluruh Sulawesi Tenggara.' },
  { icon: Network, title: 'Terhubung ekosistem', text: 'Satu profil untuk marketplace, properti, dan komunitas.' },
];

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

        <ul
          aria-label="Keuntungan mendaftar"
          style={{
            listStyle: 'none',
            margin: '0 0 30px',
            padding: 0,
            display: 'grid',
            gap: 10,
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          }}
        >
          {VALUE_PROPS.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                padding: '14px 15px',
                borderRadius: 16,
                border: '1px solid var(--sb-line)',
                background: 'var(--sb-surface)',
                boxShadow: 'var(--theme-shadow-sm)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 36,
                  height: 36,
                  flex: 'none',
                  borderRadius: 11,
                  background: 'var(--sb-mint)',
                  color: 'var(--sb-teal)',
                }}
              >
                <Icon size={18} />
              </span>
              <span>
                <strong style={{ display: 'block', fontSize: 13, color: 'var(--sb-ink)' }}>{title}</strong>
                <span style={{ display: 'block', marginTop: 3, fontSize: 12, lineHeight: 1.6, color: 'var(--sb-muted)' }}>
                  {text}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <DaftarForm categories={toCategoryOptions()} />
      </div>
    </main>
  );
}

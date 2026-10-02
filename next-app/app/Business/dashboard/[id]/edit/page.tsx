import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireServerUser } from '@/lib/supabase/server';
import { BUSINESS_CATEGORIES, fetchBusinessByIdForOwner, type OwnerBusiness } from '@/lib/businesses-query';
import BusinessHeader from '../../../_components/BusinessHeader';
import EditBusinessForm from './edit-form';
import { normalizeHours } from '../../../_components/HoursEditor';
import type { BusinessFormData, CategoryOption } from '../../../_components/BusinessForm';
import { backLink, containerNarrow, pageKicker, pageSubtitle, pageTitle } from '../../../_components/formStyles';

export const metadata: Metadata = {
  title: 'Ubah Bisnis — SUKI Business',
  description: 'Perbarui informasi bisnis Anda di SUKI Business.',
};

function toCategoryOptions(): CategoryOption[] {
  const raw = BUSINESS_CATEGORIES as unknown as Array<{ value?: unknown; label?: unknown }>;
  return raw
    .map((c) => ({ value: String(c.value ?? ''), label: String(c.label ?? '') }))
    .filter((c) => c.value && c.label);
}

/** Petakan baris bisnis dari lib menjadi nilai awal form. */
function toInitial(business: OwnerBusiness): BusinessFormData {
  return {
    nama: business.name,
    kategori: business.category,
    deskripsi: business.description ?? '',
    alamat: business.address ?? '',
    kota: business.city || 'Kendari',
    provinsi: business.province || 'Sulawesi Tenggara',
    telepon: business.phone ?? '',
    whatsapp: business.whatsapp ?? '',
    email: business.email ?? '',
    website: business.website ?? '',
    jam_operasional: normalizeHours(business.hours),
  };
}

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  let userId: string;
  try {
    const { user } = await requireServerUser();
    userId = user.id;
  } catch {
    redirect('/login?next=/Business/dashboard');
  }

  const { id } = await params;
  let business: OwnerBusiness | null = null;
  try {
    business = await fetchBusinessByIdForOwner(id, userId);
  } catch {
    business = null;
  }

  if (!business) {
    return (
      <main className="suki-business-page">
        <BusinessHeader />
        <div style={containerNarrow}>
          <h1 style={pageTitle}>Bisnis tidak ditemukan</h1>
          <p style={pageSubtitle}>
            Bisnis yang Anda cari tidak ada atau bukan milik akun ini.
          </p>
          <Link href="/Business/dashboard" className="suki-business-button suki-business-button-dark">
            Kembali ke dashboard
          </Link>
        </div>
      </main>
    );
  }

  const initial = toInitial(business);
  const businessName = initial.nama || 'Bisnis Anda';

  return (
    <main className="suki-business-page">
      <BusinessHeader />
      <div style={containerNarrow}>
        <Link href="/Business/dashboard" style={backLink}>
          <span aria-hidden="true">←</span> Kembali ke dashboard
        </Link>
        <p style={pageKicker}>
          <span aria-hidden="true" style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--sb-gold)' }} />
          Ubah bisnis
        </p>
        <h1 style={pageTitle}>{businessName}</h1>
        <p style={pageSubtitle}>Perbarui informasi usaha Anda. Perubahan hanya berlaku untuk bisnis milik akun ini.</p>
        <EditBusinessForm businessId={id} initial={initial} categories={toCategoryOptions()} />
      </div>
    </main>
  );
}

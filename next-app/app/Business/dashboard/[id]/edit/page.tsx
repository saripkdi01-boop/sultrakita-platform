import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireServerUser } from '@/lib/supabase/server';
import { BUSINESS_CATEGORIES, fetchBusinessByIdForOwner, type OwnerBusiness } from '@/lib/businesses-query';
import EditClient from './edit-client';
import { normalizeHours } from '../../../_components/HoursEditor';
import type { BusinessFormData, CategoryOption } from '../../../_components/BusinessForm';

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
    return <EditClient businessId={id} initial={null} categories={toCategoryOptions()} businessName="" notFound />;
  }

  const initial = toInitial(business);
  const businessName = initial.nama || 'Bisnis Anda';

  return (
    <EditClient
      businessId={id}
      initial={initial}
      categories={toCategoryOptions()}
      businessName={businessName}
      notFound={false}
    />
  );
}

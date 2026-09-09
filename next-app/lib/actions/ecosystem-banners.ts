'use server';

import { revalidatePath } from 'next/cache';
import { getServerSupabase, requireServerUser } from '@/lib/supabase/server';

export const BANNER_APPS = ['marketplace', 'jobs', 'suits'] as const;
export type BannerAppSlug = (typeof BANNER_APPS)[number];
export type BannerEventType = 'banner_view' | 'banner_cta_click' | 'banner_next' | 'banner_pause';
export type EcosystemBanner = {
  id: string;
  app_slug: BannerAppSlug;
  eyebrow: string;
  title: string;
  description: string;
  image_url: string;
  cta_label: string;
  cta_href: string;
  priority: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
export type BannerInput = Omit<EcosystemBanner, 'id' | 'created_at' | 'updated_at'>;

const fallbackBanners: Record<BannerAppSlug, EcosystemBanner[]> = {
  marketplace: [
    { id: 'fallback-marketplace-local', app_slug: 'marketplace', eyebrow: 'SUKI Marketplace · Pilihan lokal', title: 'Temukan barang yang dekat dengan kebutuhanmu.', description: 'Jelajahi produk, jasa, kuliner, dan karya lokal dari Sulawesi Tenggara.', image_url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=85', cta_label: 'Jelajahi listing', cta_href: '#listing-heading', priority: 10, starts_at: null, ends_at: null, is_active: true, created_at: '', updated_at: '' },
    { id: 'fallback-marketplace-seller', app_slug: 'marketplace', eyebrow: 'SUKI Marketplace · Seller', title: 'Bangun toko yang dipercaya warga.', description: 'Tampilkan listing dengan lebih rapi dan tumbuhkan pelanggan lokal.', image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=85', cta_label: 'Buka Seller Tools', cta_href: '/marketplace/seller-tools', priority: 9, starts_at: null, ends_at: null, is_active: true, created_at: '', updated_at: '' },
  ],
  jobs: [
    { id: 'fallback-jobs-talent', app_slug: 'jobs', eyebrow: 'SUKI Jobs · Peluang baru', title: 'Temukan pekerjaan yang membuatmu berkembang.', description: 'Cari peluang kerja berdasarkan posisi, skill, lokasi, dan sistem kerja.', image_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=85', cta_label: 'Cari lowongan', cta_href: '#jobs-results', priority: 10, starts_at: null, ends_at: null, is_active: true, created_at: '', updated_at: '' },
    { id: 'fallback-jobs-company', app_slug: 'jobs', eyebrow: 'SUKI Jobs · Perusahaan', title: 'Jangkau talenta terbaik Sulawesi Tenggara.', description: 'Terbitkan lowongan yang lebih mudah ditemukan kandidat.', image_url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85', cta_label: 'Pasang lowongan', cta_href: '/jobs/create', priority: 9, starts_at: null, ends_at: null, is_active: true, created_at: '', updated_at: '' },
  ],
  suits: [
    { id: 'fallback-suits-home', app_slug: 'suits', eyebrow: 'SUKI Suits · Hunian pilihan', title: 'Temukan hunian ideal di Sulawesi Tenggara.', description: 'Bandingkan rumah, kos, tanah, ruko, dan properti pilihan berdasarkan lokasi serta harga.', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', cta_label: 'Lihat properti', cta_href: '#property-results', priority: 10, starts_at: null, ends_at: null, is_active: true, created_at: '', updated_at: '' },
    { id: 'fallback-suits-seller', app_slug: 'suits', eyebrow: 'SUKI Suits · Seller', title: 'Pasarkan properti dengan lebih terpercaya.', description: 'Lengkapi foto, fasilitas, dokumen, dan lokasi agar calon pembeli lebih yakin.', image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=85', cta_label: 'Pasang properti', cta_href: '/properti/create', priority: 9, starts_at: null, ends_at: null, is_active: true, created_at: '', updated_at: '' },
  ],
};

function isBannerAppSlug(value: string): value is BannerAppSlug { return BANNER_APPS.includes(value as BannerAppSlug); }
function errorMessage(error: unknown) { return error instanceof Error ? error.message : 'Banner SUKI belum dapat diproses.'; }

export async function getActiveEcosystemBanners(appSlug: BannerAppSlug) {
  if (!isBannerAppSlug(appSlug)) return { ok: false as const, banners: [], error: 'Aplikasi banner tidak valid.' };
  try {
    const supabase = await getServerSupabase();
    const now = new Date().toISOString();
    const { data, error } = await supabase.from('ecosystem_banners').select('*').eq('app_slug', appSlug).eq('is_active', true).or(`starts_at.is.null,starts_at.lte.${now}`).or(`ends_at.is.null,ends_at.gt.${now}`).order('priority', { ascending: false }).order('created_at', { ascending: false }).limit(5);
    if (error) throw error;
    return { ok: true as const, banners: ((data || []) as EcosystemBanner[]).slice(0, 5), fallback: false };
  } catch (error) {
    return { ok: false as const, banners: fallbackBanners[appSlug].slice(0, 5), fallback: true, error: errorMessage(error) };
  }
}

async function requireAdmin() {
  const { supabase, user } = await requireServerUser();
  const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (error) throw error;
  if (profile?.role !== 'admin') throw new Error('Akses admin diperlukan.');
  return supabase;
}

export async function listEcosystemBanners(appSlug?: BannerAppSlug) {
  try {
    const supabase = await requireAdmin();
    let query = supabase.from('ecosystem_banners').select('*').order('app_slug').order('priority', { ascending: false }).order('created_at', { ascending: false });
    if (appSlug) query = query.eq('app_slug', appSlug);
    const { data, error } = await query;
    if (error) throw error;
    return { ok: true as const, banners: (data || []) as EcosystemBanner[] };
  } catch (error) { return { ok: false as const, banners: [] as EcosystemBanner[], error: errorMessage(error) }; }
}

export async function createEcosystemBanner(input: BannerInput) {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase.from('ecosystem_banners').insert(input).select('*').single();
    if (error) throw error;
    revalidatePath('/marketplace'); revalidatePath('/jobs'); revalidatePath('/properti'); revalidatePath('/admin/ecosystem-banners');
    return { ok: true as const, banner: data as EcosystemBanner };
  } catch (error) { return { ok: false as const, error: errorMessage(error) }; }
}

export async function updateEcosystemBanner(id: string, input: BannerInput) {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase.from('ecosystem_banners').update(input).eq('id', id).select('*').single();
    if (error) throw error;
    revalidatePath('/marketplace'); revalidatePath('/jobs'); revalidatePath('/properti'); revalidatePath('/admin/ecosystem-banners');
    return { ok: true as const, banner: data as EcosystemBanner };
  } catch (error) { return { ok: false as const, error: errorMessage(error) }; }
}

export async function deleteEcosystemBanner(id: string) {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from('ecosystem_banners').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/marketplace'); revalidatePath('/jobs'); revalidatePath('/properti'); revalidatePath('/admin/ecosystem-banners');
    return { ok: true as const };
  } catch (error) { return { ok: false as const, error: errorMessage(error) }; }
}

export async function recordEcosystemBannerEvent(input: { bannerId: string; appSlug: BannerAppSlug; eventType: BannerEventType }) {
  try {
    const supabase = await getServerSupabase();
    const { error } = await supabase.from('ecosystem_banner_events').insert({ banner_id: input.bannerId, app_slug: input.appSlug, event_type: input.eventType });
    if (error) throw error;
    return { ok: true as const };
  } catch { return { ok: false as const }; }
}

'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminUser } from '@/lib/supabase/server';
import { AD_PLACEMENT_IDS, type AdProvider, type PlacementId } from '@/lib/ads/config';

export interface AdPlacementRow {
  placement: string;
  provider: AdProvider;
  adsense_slot: string | null;
  updated_at: string;
}

export interface HouseAdRow {
  id: string;
  placement: string;
  title: string;
  image_url: string | null;
  link_url: string;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HouseAdInput {
  placement: string;
  title: string;
  image_url: string;
  link_url: string;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

function isPlacementId(value: string): value is PlacementId {
  return (AD_PLACEMENT_IDS as string[]).includes(value);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateInput(input: HouseAdInput): string | null {
  if (!isPlacementId(input.placement)) return 'Placement tidak valid.';
  if (!input.title.trim() || input.title.trim().length > 120) return 'Judul wajib diisi (maks 120 karakter).';
  if (!input.image_url.trim() || !isHttpUrl(input.image_url.trim())) return 'URL gambar wajib berupa http(s) yang valid.';
  if (!input.link_url.trim() || !isHttpUrl(input.link_url.trim())) return 'URL tujuan wajib berupa http(s) yang valid.';
  if (input.starts_at && Number.isNaN(Date.parse(input.starts_at))) return 'Tanggal mulai tidak valid.';
  if (input.ends_at && Number.isNaN(Date.parse(input.ends_at))) return 'Tanggal berakhir tidak valid.';
  if (input.starts_at && input.ends_at && Date.parse(input.ends_at) <= Date.parse(input.starts_at)) {
    return 'Tanggal berakhir harus setelah tanggal mulai.';
  }
  return null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Operasi iklan gagal diproses.';
}

function refreshAdsPaths() {
  revalidatePath('/admin/ads');
  revalidatePath('/beranda');
  revalidatePath('/marketplace');
  revalidatePath('/jobs');
  revalidatePath('/properti');
}

async function requireAdmin() {
  const { supabase } = await requireAdminUser();
  return supabase;
}

type Ok<T> = { ok: true } & T;
type OkEmpty = { ok: true };
type Fail = { ok: false; error: string };

export async function listAdPlacements(): Promise<Ok<{ placements: AdPlacementRow[] }> | Fail> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase.from('ad_placements').select('placement, provider, adsense_slot, updated_at').order('placement');
    if (error) throw error;
    const existing = new Map(((data || []) as AdPlacementRow[]).map((row) => [row.placement, row]));
    const placements = AD_PLACEMENT_IDS.map(
      (id) => existing.get(id) ?? ({ placement: id, provider: 'off' as AdProvider, adsense_slot: null, updated_at: '' } as AdPlacementRow),
    );
    return { ok: true, placements };
  } catch (error) {
    return { ok: false, error: `${errorMessage(error)} Kemungkinan migrasi 20261002081000_house_ads.sql belum dijalankan.` };
  }
}

export async function saveAdPlacement(input: { placement: string; provider: AdProvider; adsense_slot: string }): Promise<OkEmpty | Fail> {
  try {
    if (!isPlacementId(input.placement)) return { ok: false, error: 'Placement tidak valid.' };
    if (input.provider !== 'adsense' && input.provider !== 'house' && input.provider !== 'off') {
      return { ok: false, error: 'Provider harus adsense, house, atau off.' };
    }
    const slot = input.adsense_slot.trim();
    if (input.provider === 'adsense' && slot && !/^\d{5,}$/.test(slot)) {
      return { ok: false, error: 'Ad slot ID AdSense harus berupa angka.' };
    }
    const supabase = await requireAdmin();
    const { error } = await supabase.from('ad_placements').upsert(
      { placement: input.placement, provider: input.provider, adsense_slot: slot || null, updated_at: new Date().toISOString() },
      { onConflict: 'placement' },
    );
    if (error) throw error;
    refreshAdsPaths();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function listHouseAds(): Promise<Ok<{ ads: HouseAdRow[] }> | Fail> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase.from('house_ads').select('*').order('updated_at', { ascending: false });
    if (error) throw error;
    return { ok: true, ads: (data || []) as HouseAdRow[] };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

function toRow(input: HouseAdInput) {
  return {
    placement: input.placement,
    title: input.title.trim(),
    image_url: input.image_url.trim(),
    link_url: input.link_url.trim(),
    active: input.active,
    starts_at: input.starts_at || null,
    ends_at: input.ends_at || null,
    updated_at: new Date().toISOString(),
  };
}

export async function createHouseAd(input: HouseAdInput): Promise<Ok<{ ad: HouseAdRow }> | Fail> {
  try {
    const validation = validateInput(input);
    if (validation) return { ok: false, error: validation };
    const supabase = await requireAdmin();
    const { data, error } = await supabase.from('house_ads').insert(toRow(input)).select('*').single();
    if (error) throw error;
    refreshAdsPaths();
    return { ok: true, ad: data as HouseAdRow };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function updateHouseAd(id: string, input: HouseAdInput): Promise<Ok<{ ad: HouseAdRow }> | Fail> {
  try {
    const validation = validateInput(input);
    if (validation) return { ok: false, error: validation };
    const supabase = await requireAdmin();
    const { data, error } = await supabase.from('house_ads').update(toRow(input)).eq('id', id).select('*').single();
    if (error) throw error;
    refreshAdsPaths();
    return { ok: true, ad: data as HouseAdRow };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function toggleHouseAd(id: string, active: boolean): Promise<OkEmpty | Fail> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from('house_ads').update({ active, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    refreshAdsPaths();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function deleteHouseAd(id: string): Promise<OkEmpty | Fail> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from('house_ads').delete().eq('id', id);
    if (error) throw error;
    refreshAdsPaths();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

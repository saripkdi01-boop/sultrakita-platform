/**
 * SLICE-C — Kontrak entitlement (hak akses) SukiApps.
 *
 * ATURAN:
 *  - SEMUA cek entitlement WAJIB server-side. Jangan pernah mempercayai
 *    klaim plan/entitlement dari client.
 *  - `grantEntitlement` hanya dipanggil dari webhook terverifikasi (server).
 *  - `useEntitlement` menambah used_value secara atomik (validasi di SQL)
 *    agar tidak bisa double-spend oleh request paralel.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { FeatureKey, PlanId } from './plans';

export interface Entitlement {
  id: string;
  user_id: string;
  plan_id: PlanId;
  feature_key: FeatureKey;
  limit_value: number | null;
  used_value: number;
  valid_until: string | null;
  created_at: string;
}

function isExpired(validUntil: string | null): boolean {
  if (!validUntil) return false;
  return new Date(validUntil).getTime() < Date.now();
}

async function fetchEntitlement(
  supabase: SupabaseClient,
  userId: string,
  featureKey: FeatureKey,
): Promise<Entitlement | null> {
  const { data, error } = await supabase
    .from('billing_entitlements')
    .select('*')
    .eq('user_id', userId)
    .eq('feature_key', featureKey)
    .maybeSingle();
  if (error) throw error;
  const row = data as Entitlement | null;
  if (!row || isExpired(row.valid_until)) return null;
  return row;
}

/**
 * Apakah pengguna punya akses ke fitur (boolean)? Benar bila ada entitlement
 * yang belum kedaluwarsa dengan limit > 0.
 */
export async function hasEntitlement(
  supabase: SupabaseClient,
  userId: string,
  featureKey: FeatureKey,
): Promise<boolean> {
  const ent = await fetchEntitlement(supabase, userId, featureKey);
  if (!ent) return false;
  if (ent.limit_value === null) return true; // tanpa batas angka
  return ent.limit_value > 0;
}

/**
 * Cek kuota tersisa untuk fitur berlimit (mis. featured_listings).
 * Return { allowed, remaining } — remaining null berarti tak terbatas.
 */
export async function checkLimit(
  supabase: SupabaseClient,
  userId: string,
  featureKey: FeatureKey,
): Promise<{ allowed: boolean; remaining: number | null }> {
  const ent = await fetchEntitlement(supabase, userId, featureKey);
  if (!ent) return { allowed: false, remaining: 0 };
  if (ent.limit_value === null) return { allowed: true, remaining: null };
  const remaining = Math.max(0, ent.limit_value - ent.used_value);
  return { allowed: remaining > 0, remaining };
}

/**
 * Konsumsi 1 unit kuota secara aman. Mengembalikan false bila kuota habis
 * atau entitlement tidak ada/kedaluwarsa. Aman untuk request paralel:
 * UPDATE memakai kondisi used_value < limit_value.
 */
export async function useEntitlement(
  supabase: SupabaseClient,
  userId: string,
  featureKey: FeatureKey,
): Promise<boolean> {
  const { data, error } = await supabase.rpc('billing_consume_entitlement', {
    p_user_id: userId,
    p_feature_key: featureKey,
  });
  // Fungsi RPC mungkin belum diterapkan; fallback: cek lalu update dengan guard.
  if (error) {
    const ent = await fetchEntitlement(supabase, userId, featureKey);
    if (!ent || ent.limit_value === null) return ent !== null;
    if (ent.used_value >= ent.limit_value) return false;
    const { data: updated, error: updateError } = await supabase
      .from('billing_entitlements')
      .update({ used_value: ent.used_value + 1 })
      .eq('id', ent.id)
      .eq('used_value', ent.used_value) // guard race condition
      .select('id');
    if (updateError || !updated || updated.length === 0) return false;
    return true;
  }
  return Boolean(data);
}

/**
 * Berikan/perbarui entitlement untuk satu plan (dipanggil webhook setelah
 * order berstatus sandbox_paid). Berlaku 1 bulan sejak pemberian.
 * Idempoten: upsert per (user_id, feature_key).
 */
export async function grantEntitlement(
  supabase: SupabaseClient,
  userId: string,
  planId: PlanId,
  limits: Record<FeatureKey, number>,
): Promise<void> {
  const validUntil = new Date(Date.now() + 30 * 86_400_000).toISOString();
  const rows = (Object.keys(limits) as FeatureKey[]).map((featureKey) => ({
    user_id: userId,
    plan_id: planId,
    feature_key: featureKey,
    limit_value: limits[featureKey],
    used_value: 0,
    valid_until: validUntil,
  }));
  const { error } = await supabase.from('billing_entitlements').upsert(rows, {
    onConflict: 'user_id,feature_key',
  });
  if (error) throw error;
}

/**
 * Contoh nyata: batasi "featured listing".
 *
 * Pemakaian yang BENAR (di server action / route handler modul listing):
 *
 *   import { canFeatureListing } from '@/lib/billing/entitlements';
 *   import { getServerSupabase } from '@/lib/supabase/server';
 *
 *   const supabase = await getServerSupabase();
 *   const check = await canFeatureListing(supabase, user.id);
 *   if (!check.allowed) {
 *     return { ok: false, error: 'Kuota listing unggulan habis. Upgrade paket untuk menambah kuota.' };
 *   }
 *   // ... buat/aktifkan featured listing ...
 *   await useEntitlement(supabase, user.id, 'featured_listings');
 *
 * Jangan ubah modul listing tanpa koordinasi slice terkait.
 */
export async function canFeatureListing(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ allowed: boolean; remaining: number | null }> {
  return checkLimit(supabase, userId, 'featured_listings');
}

import { getServerSupabase, requireServerUser } from '@/lib/supabase/server';

// Fase 1.3: lapisan otorisasi sisi server (Data Access Layer).
// Supabase Auth tetap dipakai untuk autentikasi; modul ini menambahkan
// pemeriksaan otorisasi eksplisit (peran & kepemilikan) yang WAJIB dipanggil
// dari setiap Server Action / Route Handler sensitif. Jangan andalkan
// middleware atau RLS saja untuk keputusan otorisasi bisnis.

export type AppRole = 'merchant' | 'moderator' | 'admin';

// Peran di database: profiles.role ('warga' | 'seller' | 'admin') dan
// tabel user_roles ('buyer','seller','admin','creator','community','moderator').
// 'merchant' pada API ini dipetakan ke peran DB 'seller'.
const ROLE_ALIASES: Record<AppRole, string[]> = {
  merchant: ['seller', 'merchant'],
  moderator: ['moderator'],
  admin: ['admin', 'super_admin'],
};

export async function requireUser() {
  return requireServerUser();
}

export async function getUserRoles(userId: string): Promise<string[]> {
  const supabase = await getServerSupabase();
  const roles = new Set<string>();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  if (profile?.role) roles.add(String(profile.role));
  const { data: granted } = await supabase.from('user_roles').select('role').eq('user_id', userId).eq('is_active', true);
  for (const row of granted || []) roles.add(String((row as { role: string }).role));
  return Array.from(roles);
}

/**
 * Pastikan user login DAN memegang salah satu peran yang diminta.
 * 'admin' selalu lolos (implisit untuk semua peran).
 */
export async function requireRole(...roles: AppRole[]) {
  const { supabase, user } = await requireServerUser();
  const held = await getUserRoles(user.id);
  const wanted = roles.flatMap((role) => ROLE_ALIASES[role]);
  const ok = wanted.some((role) => held.includes(role)) || held.includes('admin') || held.includes('super_admin');
  if (!ok) throw new Error('Akses ditolak: peran tidak mencukupi.');
  return { supabase, user, roles: held };
}

/**
 * Bolehkah user mengubah/menghapus listing? Pemilik (seller_id/owner_id) atau admin.
 */
export function canEditListing(
  userId: string | null | undefined,
  listing: { seller_id?: string | number | null; owner_id?: string | number | null } | null | undefined,
  roles: string[] = [],
): boolean {
  if (!userId || !listing) return false;
  if (roles.includes('admin') || roles.includes('super_admin')) return true;
  return String(listing.seller_id || '') === userId || String(listing.owner_id || '') === userId;
}

export type GroupMembership = { role: string; status: string } | null;

/**
 * Periksa keanggotaan grup: kembalikan peran bila member aktif.
 * Admin global dianggap moderator di semua grup.
 */
export async function getGroupMembership(groupId: string, userId: string): Promise<GroupMembership> {
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from('group_members')
    .select('role,status')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .maybeSingle();
  if (data && data.status === 'active') return { role: String(data.role), status: 'active' };
  const roles = await getUserRoles(userId);
  if (roles.includes('admin') || roles.includes('super_admin')) return { role: 'admin', status: 'active' };
  return null;
}

/**
 * Bolehkah user memoderasi grup (hapus konten orang lain, pin, dsb.)?
 * Owner/moderator grup, atau admin global.
 */
export async function canModerateGroup(groupId: string, userId: string): Promise<boolean> {
  const membership = await getGroupMembership(groupId, userId);
  return !!membership && ['owner', 'moderator', 'admin'].includes(membership.role);
}

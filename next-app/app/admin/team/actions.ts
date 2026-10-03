'use server';

// FASE B5 — manajemen tim admin. KHUSUS super_admin.
// Perubahan role memakai service-role (RLS melarang admin mengubah baris
// profiles milik orang lain) dan SELALU tercatat di audit trail.

import { revalidatePath } from 'next/cache';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requireSuperAdmin } from '@/lib/admin/guards';
import { getServerSupabase } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/security/audit';

const STAFF_ROLES = ['super_admin', 'admin', 'moderator', 'support'] as const;
type StaffRole = (typeof STAFF_ROLES)[number];

function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export interface StaffRow {
  id: string;
  role: string;
  display_name: string | null;
  full_name: string | null;
  email: string | null;
  is_suspended: boolean | null;
}

export async function listStaff(): Promise<{ ok: boolean; data?: StaffRow[]; error?: string }> {
  try {
    await requireSuperAdmin();
  } catch {
    return { ok: false, error: 'Hanya super_admin.' };
  }
  try {
    const svc = getServiceClient();
    const { data, error } = await svc
      .from('profiles')
      .select('id, role, display_name, full_name, is_suspended')
      .in('role', [...STAFF_ROLES])
      .order('role')
      .limit(100);
    if (error) return { ok: false, error: error.message };
    const ids = (data ?? []).map((r) => r.id);
    let emailById: Record<string, string> = {};
    if (ids.length > 0) {
      const { data: contacts } = await svc.from('profile_contacts').select('profile_id, email').in('profile_id', ids);
      for (const c of contacts ?? []) {
        if (c.profile_id && c.email) emailById[c.profile_id] = c.email as string;
      }
    }
    return {
      ok: true,
      data: (data ?? []).map((r) => ({
        id: r.id as string,
        role: r.role as string,
        display_name: (r.display_name ?? null) as string | null,
        full_name: (r.full_name ?? null) as string | null,
        email: emailById[r.id as string] ?? null,
        is_suspended: (r.is_suspended ?? null) as boolean | null,
      })),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Gagal membaca staf.' };
  }
}

export interface FoundUser {
  id: string;
  role: string;
  display_name: string | null;
  email: string;
}

export async function findUserByEmail(email: string): Promise<{ ok: boolean; data?: FoundUser; error?: string }> {
  try {
    await requireSuperAdmin();
  } catch {
    return { ok: false, error: 'Hanya super_admin.' };
  }
  const clean = email.trim().toLowerCase();
  if (!clean || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
    return { ok: false, error: 'Format email tidak valid.' };
  }
  try {
    const svc = getServiceClient();
    const { data: contact, error: cErr } = await svc
      .from('profile_contacts')
      .select('profile_id, email')
      .ilike('email', clean)
      .limit(1)
      .maybeSingle();
    if (cErr) return { ok: false, error: cErr.message };
    if (!contact?.profile_id) return { ok: false, error: 'Email tidak ditemukan. Pengguna harus login/daftar dulu.' };
    const { data: profile, error: pErr } = await svc
      .from('profiles')
      .select('id, role, display_name')
      .eq('id', contact.profile_id)
      .maybeSingle();
    if (pErr) return { ok: false, error: pErr.message };
    if (!profile) return { ok: false, error: 'Profil tidak ditemukan.' };
    return {
      ok: true,
      data: {
        id: profile.id as string,
        role: (profile.role ?? 'user') as string,
        display_name: (profile.display_name ?? null) as string | null,
        email: contact.email as string,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Gagal mencari.' };
  }
}

export async function setUserRole(
  userId: string,
  role: string,
): Promise<{ ok: boolean; error?: string }> {
  let session;
  try {
    session = await requireSuperAdmin();
  } catch {
    return { ok: false, error: 'Hanya super_admin.' };
  }
  const target = role === 'user' ? 'user' : (STAFF_ROLES as readonly string[]).includes(role) ? (role as StaffRole) : null;
  if (!target) return { ok: false, error: 'Role tidak valid.' };
  if (userId === session.userId && target !== 'super_admin') {
    return { ok: false, error: 'Tidak bisa menurunkan role diri sendiri.' };
  }
  try {
    const svc = getServiceClient();
    const { data: before } = await svc.from('profiles').select('role').eq('id', userId).maybeSingle();
    const oldRole = (before?.role ?? 'user') as string;
    if (oldRole === target) return { ok: true };
    const { error } = await svc.from('profiles').update({ role: target }).eq('id', userId);
    if (error) return { ok: false, error: error.message };
    const supabase = await getServerSupabase();
    await logAuditEvent(supabase, {
      actorId: session.userId,
      action: target === 'user' ? 'user.role.revoke' : 'user.role.grant',
      targetType: 'profiles',
      targetId: userId,
      reason: `role ${oldRole} → ${target} via /admin/team`,
      metadata: { old_role: oldRole, new_role: target },
    });
    revalidatePath('/admin/team');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Gagal mengubah role.' };
  }
}

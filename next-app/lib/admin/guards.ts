// SLICE-B: guard peran admin + helper masking PII.
// Matriks peran (least-privilege):
// - super_admin : semua aksi, termasuk ubah role & kelola settings.
// - admin       : operasi harian (users suspend/restore, moderasi, settings).
// - moderator   : moderasi laporan (dipakai halaman /admin/moderation).
// - support     : akses baca + tiket dukungan (belum ada halaman khusus).
// super_admin diakui bila profiles.role = 'super_admin' dan otomatis lolos
// semua guard (implisit di requireRole).

import { redirect } from 'next/navigation';
import { getServerSupabase, requireServerUser } from '@/lib/supabase/server';

export type StaffRole = 'super_admin' | 'admin' | 'moderator' | 'support';

export interface StaffSession {
  userId: string;
  email: string | null;
  profileRole: string | null;
  roles: StaffRole[];
  isSuperAdmin: boolean;
}

const KNOWN_ROLES: StaffRole[] = ['super_admin', 'admin', 'moderator', 'support'];

async function resolveRoles(userId: string): Promise<StaffSession> {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Sesi login diperlukan.');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_suspended')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.is_suspended) {
    throw new Error('Akun ditangguhkan.');
  }

  const roleSet = new Set<StaffRole>();
  const profileRole = (profile?.role ?? null) as string | null;
  if (profileRole && (KNOWN_ROLES as string[]).includes(profileRole)) {
    roleSet.add(profileRole as StaffRole);
  }

  const now = new Date().toISOString();
  // Tabel user_roles TIDAK ADA di production (pola resmi = profiles.role).
  // Query dibungkus try/catch agar guard tidak pernah 500 karena tabel hilang;
  // profiles.role di atas tetap menjadi sumber kebenaran utama.
  let grants: Array<{ role: string; is_active: boolean; expires_at: string | null }> | null = null;
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role, is_active, expires_at')
      .eq('user_id', userId)
      .eq('is_active', true);
    if (!error) grants = (data ?? []) as Array<{ role: string; is_active: boolean; expires_at: string | null }>;
  } catch {
    grants = null;
  }
  for (const grant of grants ?? []) {
    if ((KNOWN_ROLES as string[]).includes(grant.role)) {
      if (!grant.expires_at || grant.expires_at > now) {
        roleSet.add(grant.role as StaffRole);
      }
    }
  }

  return {
    userId,
    email: user.email ?? null,
    profileRole,
    roles: Array.from(roleSet),
    isSuperAdmin: profileRole === 'super_admin',
  };
}

/**
 * Pastikan sesi saat ini memiliki salah satu peran yang diminta.
 * super_admin selalu lolos. Melempar bila tidak berhak — pemanggil halaman
 * menangkap dan redirect ke halaman yang sesuai.
 */
export async function requireRole(...roles: StaffRole[]): Promise<StaffSession> {
  const { user } = await requireServerUser();
  const session = await resolveRoles(user.id);
  if (session.isSuperAdmin) return session;
  const allowed = roles.some((r) => session.roles.includes(r));
  if (!allowed) {
    throw new Error('Peran tidak mencukupi untuk aksi ini.');
  }
  return session;
}

/** Varian untuk aksi sensitif yang HANYA boleh super_admin. */
export async function requireSuperAdmin(): Promise<StaffSession> {
  return requireRole('super_admin');
}

/** Redirect ke login (dipakai di layout/halaman bila guard melempar). */
export function redirectToLogin(nextPath = '/admin/dashboard'): never {
  redirect(`/login?redirect=${encodeURIComponent(nextPath)}`);
}

/** Sembunyikan sebagian PII: email -> s***@gmail.com, phone -> ****1234. */
export function maskPII(value: string | null | undefined, kind: 'email' | 'phone'): string {
  if (!value) return '—';
  const v = value.trim();
  if (!v) return '—';
  if (kind === 'email') {
    const at = v.indexOf('@');
    if (at <= 0) return '***';
    const local = v.slice(0, at);
    const domain = v.slice(at + 1);
    return `${local.slice(0, 1)}***@${domain}`;
  }
  const digits = v.replace(/\D/g, '');
  if (digits.length <= 4) return '****';
  return `****${digits.slice(-4)}`;
}

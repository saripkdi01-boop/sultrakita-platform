/**
 * lib/admin/audit-log.ts — Audit log append-only untuk API admin.
 *
 * Ditulis LANGSUNG dari route (bukan diserahkan ke bot).
 * Temuan P1 audit keamanan 8 Okt 2026: "kalau secret bocor, tak ada jejak."
 *
 * - Best-effort: kegagalan tulis log TIDAK menggagalkan aksi utama
 *   (agar admin tidak terkunci saat tabel belum di-migrate).
 * - Tidak pernah mencatat secret, token, atau body mentah.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

export type AuditEntry = {
  route: string;
  method?: string;
  actor?: string;
  action: string;
  targetTable?: string | null;
  targetId?: string | null;
  detail?: Record<string, unknown> | null;
  ip?: string | null;
  ok?: boolean;
  error?: string | null;
};

/** Tulis satu baris audit. Tidak pernah throw. */
export async function writeAuditLog(
  admin: SupabaseClient,
  entry: AuditEntry,
): Promise<void> {
  try {
    await admin.from('admin_audit_log').insert({
      route: entry.route,
      method: entry.method ?? 'POST',
      actor: entry.actor ?? 'bot',
      action: entry.action,
      target_table: entry.targetTable ?? null,
      target_id: entry.targetId ?? null,
      detail: entry.detail ?? null,
      ip: entry.ip ?? null,
      ok: entry.ok ?? true,
      error: entry.error ? String(entry.error).slice(0, 500) : null,
    });
  } catch {
    // Best-effort: jangan gagalkan aksi admin karena log.
  }
}

/** Ambil IP client dari header standar (untuk jejak, bukan untuk auth). */
export function clientIp(headers: Headers): string | null {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim().slice(0, 64);
  const real = headers.get('x-real-ip');
  if (real) return real.slice(0, 64);
  return null;
}

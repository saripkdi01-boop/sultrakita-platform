/**
 * Audit trail untuk aksi admin/moderasi (P0-3).
 *
 * KONTRAK BERSAMA — modul ini diimpor slice lain, jadi API-nya harus stabil:
 *   logAuditEvent(client, { actorId, action, targetType, targetId?, reason?, metadata? })
 *     -> Promise<{ ok: true, id?: string } | { ok: false, error?: string }>
 *
 * - `client` adalah Supabase client DENGAN hak tulis ke tabel `audit_events`.
 *   Karena RLS tabel ini tidak membuka INSERT publik, pakai service-role
 *   client (server-side saja) — lihat migrasi
 *   `supabase/migrations/20261001140001_security_audit_events.sql`.
 * - Fungsi ini TIDAK PERNAH throw: kegagalan pencatatan dikembalikan sebagai
 *   `{ ok: false }` agar aksi bisnis tidak gagal hanya karena audit gagal.
 *   Panggil di `catch`/finally atau fire-and-forget sesuai kebutuhan —
 *   tapi JANGAN jadikan kegagalan audit sebagai alasan membatalkan aksi.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuditEventInput {
  /** ID pengguna pelaku; null untuk aksi sistem. */
  actorId: string | null;
  /** Nama aksi, mis. `user.suspend`. Pakai `AUDIT_ACTIONS` bila cocok. */
  action: string;
  /** Jenis target, mis. `user`, `listing`, `report`, `settings`. */
  targetType: string;
  targetId?: string | null;
  /** Alasan aksi (wajib diisi untuk moderasi bila tersedia). */
  reason?: string | null;
  /** Data tambahan JSON-serializable. */
  metadata?: Record<string, unknown>;
}

export type AuditResult = { ok: true; id?: string } | { ok: false; error?: string };

/** Nama aksi baku agar konsisten antar modul. */
export const AUDIT_ACTIONS = {
  USER_SUSPEND: 'user.suspend',
  USER_UNSUSPEND: 'user.unsuspend',
  USER_ROLE_GRANT: 'user.role.grant',
  USER_ROLE_REVOKE: 'user.role.revoke',
  LISTING_TAKEDOWN: 'listing.takedown',
  LISTING_RESTORE: 'listing.restore',
  REPORT_RESOLVE: 'report.resolve',
  REPORT_DISMISS: 'report.dismiss',
  CONTENT_MODERATE: 'content.moderate',
  SETTINGS_UPDATE: 'settings.update',
  BANNER_PUBLISH: 'banner.publish',
  PROPERTY_VERIFY: 'property.verify',
} as const;

export async function logAuditEvent(
  client: SupabaseClient,
  event: AuditEventInput,
): Promise<AuditResult> {
  try {
    const { data, error } = await client
      .from('audit_events')
      .insert({
        actor_id: event.actorId,
        action: event.action,
        target_type: event.targetType,
        target_id: event.targetId ?? null,
        reason: event.reason ?? null,
        metadata: event.metadata ?? {},
      })
      .select('id')
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id ?? undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Gagal mencatat audit' };
  }
}

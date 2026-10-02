/**
 * Audit trail untuk aksi admin/moderasi (P0-3).
 *
 * SERVER-ONLY: modul ini memakai SUPABASE_SERVICE_ROLE_KEY (bypass RLS) dan
 * TIDAK BOLEH diimpor dari kode client. Selalu berjalan di server (server
 * actions / route handlers / server components).
 *
 * KONTRAK BERSAMA — modul ini diimpor slice lain, jadi API-nya harus stabil:
 *   logAuditEvent(client, { actorId, action, targetType, targetId?, reason?, metadata? })
 *     -> Promise<{ ok: true, id?: string } | { ok: false, error?: string }>
 *
 * - Parameter `client` dipertahankan demi kompatibilitas pemanggil lama
 *   (lib/admin/actions.ts, app/admin/billing/actions.ts), tetapi penulisan
 *   SELALU memakai client internal dari getAuditWriterClient() — service-role
 *   server-side — karena anon-key client tidak bisa INSERT ke `audit_events`
 *   (lihat migrasi `supabase/migrations/20261001140001_security_audit_events.sql`).
 * - Fungsi ini TIDAK PERNAH throw: kegagalan pencatatan dikembalikan sebagai
 *   `{ ok: false }` DAN dicatat ke console.error dengan konteks, agar aksi
 *   bisnis tidak gagal hanya karena audit gagal — tapi kegagalan TIDAK
 *   ditelan diam-diam.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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
  BUSINESS_APPROVE: 'business.approve',
  BUSINESS_REJECT: 'business.reject',
  BUSINESS_FEATURE: 'business.feature',
  BUSINESS_VERIFY: 'business.verify',
} as const;

/** Singleton client service-role untuk penulisan audit (dibuat sekali per proses). */
let cachedWriter: SupabaseClient | null = null;

export async function logAuditEvent(
  // Dipertahankan demi kompatibilitas pemanggil; penulisan selalu memakai
  // getAuditWriterClient() di bawah, bukan client ini.
  _client: SupabaseClient,
  event: AuditEventInput,
): Promise<AuditResult> {
  const context = {
    action: event.action,
    actorId: event.actorId,
    targetType: event.targetType,
    targetId: event.targetId ?? null,
  };
  try {
    const writer = getAuditWriterClient();
    const { data, error } = await writer
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
      // Keras: kegagalan audit tidak boleh hilang diam-diam.
      console.error('[audit] Gagal mencatat event audit', { ...context, error: error.message });
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id ?? undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal mencatat audit';
    console.error('[audit] Gagal mencatat event audit', { ...context, error: message });
    return { ok: false, error: message };
  }
}

/**
 * Client Supabase KHUSUS pencatatan audit: memakai SUPABASE_SERVICE_ROLE_KEY
 * (bypass RLS) sehingga INSERT ke tabel `audit_events` selalu diizinkan.
 *
 * HANYA server-side. Guard runtime menolak pemakaian dari browser; jangan
 * pernah mengimpor modul ini (atau meneruskan client ini) ke komponen client.
 */
export function getAuditWriterClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('getAuditWriterClient hanya boleh dipakai server-side.');
  }
  if (cachedWriter) return cachedWriter;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi; audit tidak dapat ditulis.');
  }
  cachedWriter = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return cachedWriter;
}

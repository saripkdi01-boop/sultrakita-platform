/**
 * FASE B1 — Penulis error terpusat (server-only).
 *
 * Dipanggil fire-and-forget dari lib/log-error.ts. Menulis ke tabel
 * `error_events` (satu baris per sidik error, di-upsert) memakai
 * SUPABASE_SERVICE_ROLE_KEY. TIDAK PERNAH throw — kegagalan (key belum
 * dipasang, tabel belum dimigrasi) diabaikan diam-diam karena error sudah
 * tercatat di console/Vercel Logs via logError().
 *
 * Kontrak keamanan: sama dengan lib/log-error.ts — tanpa PII.
 */

import { createHash } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface ErrorEventInput {
  route: string;
  requestId: string | null;
  userHash: string | null;
  errorName: string;
  errorMessage: string;
}

function getWriter(): SupabaseClient | null {
  if (typeof window !== 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function recordErrorEvent(input: ErrorEventInput): Promise<void> {
  try {
    const client = getWriter();
    if (!client) return;
    const now = new Date().toISOString();
    const fingerprint = createHash('sha256')
      .update(`suki-err:v1|${input.route}|${input.errorName}|${input.errorMessage.slice(0, 200)}`)
      .digest('hex');

    const { data: existing, error: readErr } = await client
      .from('error_events')
      .select('id, occurrence_count')
      .eq('fingerprint', fingerprint)
      .maybeSingle();
    if (readErr) return; // tabel belum dimigrasi / RLS — abaikan diam-diam.

    if (existing?.id) {
      await client
        .from('error_events')
        .update({
          occurrence_count: (existing.occurrence_count ?? 0) + 1,
          last_seen: now,
          error_message: input.errorMessage.slice(0, 500),
          request_id: input.requestId,
        })
        .eq('id', existing.id);
    } else {
      await client.from('error_events').insert({
        fingerprint,
        route: input.route.slice(0, 200),
        request_id: input.requestId,
        user_hash: input.userHash,
        error_name: input.errorName.slice(0, 80),
        error_message: input.errorMessage.slice(0, 500),
        occurrence_count: 1,
        first_seen: now,
        last_seen: now,
        resolved: false,
      });
    }
  } catch {
    // Best-effort: jangan pernah mengganggu alur utama.
  }
}

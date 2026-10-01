/**
 * T5(c): pencatatan error server-side tersentralisasi.
 *
 * KONTRAK KEAMANAN (konsisten dengan audit item 15 — "Log jangan bocor"):
 *  - TIDAK PERNAH mencatat: input/body request mentah, objek user, email,
 *    nomor telepon/WhatsApp, alamat, token/kredensial/secret, atau stack trace
 *    utuh yang dikirim ke client.
 *  - Yang dicatat: timestamp, route, requestId, HASH user id (sha256, 16 hex —
 *    bukan id mentah), nama + pesan error (dipotong 500 char), dan telemetri
 *    aman opsional (string/number/boolean/null saja).
 *  - Output: console.error terstruktur (JSON satu baris) → terbaca di
 *    Vercel Runtime Logs. Pesan generik ke client tetap ditangani oleh
 *    lib/api-error.ts / error boundaries — helper ini tidak mengubah respons.
 *
 * Pemakaian:
 *   import { logError } from '@/lib/log-error';
 *   try { ... } catch (e) { logError({ route: '/api/feed', userId: user?.id }, e); ... }
 */

import { createHash } from 'node:crypto';

export interface LogErrorContext {
  /** Route/segmen tempat error terjadi, mis. '/api/feed' atau 'app/(admin)/overview'. */
  route: string;
  /** Request ID untuk korelasi log (opsional). */
  requestId?: string;
  /** ID user — SELALU di-hash sebelum dicatat, tidak pernah mentah. */
  userId?: string | null;
  /** Telemetri aman tambahan: hanya string/number/boolean/null. TANPA PII. */
  extra?: Record<string, string | number | boolean | null>;
}

export interface LogErrorEntry {
  ts: string;
  level: 'error';
  service: 'suki-apps';
  route: string;
  request_id: string | null;
  user_hash: string | null;
  error_name: string;
  error_message: string;
  extra?: Record<string, string | number | boolean | null>;
}

/** Hash satu arah untuk user id — korelasi tanpa menyimpan identitas. */
export function hashUserIdForLog(userId: string): string {
  return createHash('sha256').update(`suki-error-log:v1:${userId}`).digest('hex').slice(0, 16);
}

function safeMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? 'unknown error');
  return raw.slice(0, 500);
}

function safeName(error: unknown): string {
  return (error instanceof Error ? error.name : 'UnknownError').slice(0, 80);
}

function safeExtra(extra: LogErrorContext['extra']): Record<string, string | number | boolean | null> | undefined {
  if (!extra || typeof extra !== 'object') return undefined;
  const out: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(extra)) {
    if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      out[String(key).slice(0, 64)] = typeof value === 'string' ? value.slice(0, 200) : value;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Catat error ke log server (JSON satu baris via console.error).
 * TIDAK PERNAH throw — kegagalan pencatatan tidak boleh mengganggu alur utama.
 */
export function logError(context: LogErrorContext, error: unknown): LogErrorEntry {
  const entry: LogErrorEntry = {
    ts: new Date().toISOString(),
    level: 'error',
    service: 'suki-apps',
    route: String(context.route ?? 'unknown').slice(0, 200),
    request_id: context.requestId?.slice(0, 64) ?? null,
    user_hash: context.userId ? hashUserIdForLog(context.userId) : null,
    error_name: safeName(error),
    error_message: safeMessage(error),
    extra: safeExtra(context.extra),
  };
  try {
    // Satu baris JSON → mudah difilter di Vercel Runtime Logs ("suki-apps" + "level":"error").
    console.error(JSON.stringify(entry));
  } catch {
    // Abaikan: pencatatan tidak boleh mematahkan request.
  }
  return entry;
}

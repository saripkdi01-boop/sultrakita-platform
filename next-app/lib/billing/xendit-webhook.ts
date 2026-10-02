/**
 * BILLING-LIVE SCAFFOLD — Verifikasi & logika webhook Xendit.
 *
 * =====================================================================
 * KEAMANAN (pelajaran dari gap kritis #1 audit 20-check):
 *  - Webhook Xendit diverifikasi via header `x-callback-token`:
 *    perbandingan timingSafeEqual terhadap XENDIT_CALLBACK_TOKEN
 *    dari dashboard Xendit (Settings -> Webhooks).
 *  - FAIL-CLOSED: bila XENDIT_CALLBACK_TOKEN kosong di env, SEMUA
 *    webhook ditolak 401. Tidak ada fallback "terima saja".
 *  - Setelah token valid, status PAID/SETTLED WAJIB dikonfirmasi ulang
 *    ke API Xendit (GET /v2/invoices/{id}) sebelum entitlement diberikan
 *    — anti-spoofing bila token bocor.
 * =====================================================================
 */

import { timingSafeEqual } from 'node:crypto';

/** Status order LIVE (lihat migrasi 20261003000000 — FILE SAJA, belum di-apply). */
export type LiveOrderStatus = 'paid' | 'failed' | 'expired';

/**
 * Verifikasi callback token Xendit. Mengembalikan false bila:
 *  - XENDIT_CALLBACK_TOKEN tidak dikonfigurasi (fail-closed), atau
 *  - token dari header kosong / tidak cocok (timing-safe compare).
 */
export function verifyXenditCallbackToken(received: string | null): boolean {
  const expected = process.env.XENDIT_CALLBACK_TOKEN;
  if (!expected || expected.trim().length === 0) return false; // fail-closed
  if (!received) return false;
  const a = Buffer.from(received, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Status invoice Xendit -> keputusan internal. */
export type XenditStatusDecision =
  | { action: 'grant'; newStatus: 'paid' }
  | { action: 'mark_failed'; newStatus: 'failed' }
  | { action: 'mark_expired'; newStatus: 'expired' }
  | { action: 'ignore'; reason: string };

/**
 * Petakan status callback Xendit ke aksi order.
 *  - PAID / SETTLED -> grant (setelah konfirmasi ulang ke API)
 *  - EXPIRED        -> tandai expired
 *  - FAILED         -> tandai failed
 *  - lainnya (PENDING dsb.) -> abaikan, tetap 200
 */
export function decideXenditStatus(status: string): XenditStatusDecision {
  const s = status.trim().toUpperCase();
  if (s === 'PAID' || s === 'SETTLED') return { action: 'grant', newStatus: 'paid' };
  if (s === 'EXPIRED') return { action: 'mark_expired', newStatus: 'expired' };
  if (s === 'FAILED') return { action: 'mark_failed', newStatus: 'failed' };
  return { action: 'ignore', reason: `status '${status}' tidak memerlukan aksi` };
}

/** Status order yang dianggap final — webhook untuk order final diabaikan. */
const TERMINAL_STATUSES = new Set(['paid', 'failed', 'expired', 'cancelled', 'sandbox_paid', 'sandbox_failed']);

export function isTerminalOrderStatus(status: string): boolean {
  return TERMINAL_STATUSES.has(status);
}

/** Kunci idempotency untuk webhook_events.event_id. */
export function xenditEventId(invoiceId: string, status: string): string {
  return `xendit:${invoiceId}:${status.trim().toUpperCase()}`;
}

/**
 * SLICE-C — Logika webhook murni (tanpa DB) untuk billing sandbox.
 *
 * Fungsi di sini deterministik dan bisa di-unit-test tanpa database:
 * diberi payload + flag apakah event sudah pernah diproses, ia me-return
 * transisi status order yang harus dilakukan route handler.
 */

export type OrderStatus = 'draft' | 'pending' | 'sandbox_paid' | 'sandbox_failed' | 'cancelled';

export interface SandboxWebhookPayload {
  eventId: string;
  orderId: string;
  outcome: 'paid' | 'failed';
  providerRef: string;
  sandbox: boolean;
  /** Unix epoch (detik) saat payload dibuat — anti-replay (toleransi ±5 menit). */
  ts: number;
  /** Nilai unik per pengiriman — anti-replay, dicek ke tabel webhook_events. */
  nonce: string;
}

export type WebhookDecision =
  | { action: 'duplicate'; reason: 'event_id sudah diproses' }
  | { action: 'grant_entitlements'; newStatus: Extract<OrderStatus, 'sandbox_paid'>; planId: string }
  | { action: 'mark_failed'; newStatus: Extract<OrderStatus, 'sandbox_failed'> }
  | { action: 'ignore_terminal'; reason: 'order sudah pada status final' }
  | { action: 'reject'; reason: string };

/**
 * Tentukan aksi webhook berdasarkan payload + status order saat ini.
 *
 * Kontrak idempotency:
 *  - alreadySeen=true  -> 'duplicate' (tidak ada perubahan DB).
 *  - outcome='paid'    -> order 'pending'/'draft' => grant entitlements.
 *  - outcome='failed'  -> order 'pending'/'draft' => tandai sandbox_failed.
 *  - order sudah final (sandbox_paid/sandbox_failed/cancelled) -> ignore.
 */
export function processWebhookEvent(
  payload: SandboxWebhookPayload,
  current: { alreadySeen: boolean; orderStatus: OrderStatus; planId: string },
): WebhookDecision {
  if (current.alreadySeen) {
    return { action: 'duplicate', reason: 'event_id sudah diproses' };
  }
  if (!payload.sandbox) {
    return { action: 'reject', reason: 'payload non-sandbox ditolak dalam mode sandbox' };
  }
  if (current.orderStatus === 'sandbox_paid' || current.orderStatus === 'sandbox_failed' || current.orderStatus === 'cancelled') {
    return { action: 'ignore_terminal', reason: 'order sudah pada status final' };
  }
  if (payload.outcome === 'paid') {
    return { action: 'grant_entitlements', newStatus: 'sandbox_paid', planId: current.planId };
  }
  if (payload.outcome === 'failed') {
    return { action: 'mark_failed', newStatus: 'sandbox_failed' };
  }
  return { action: 'reject', reason: 'outcome tidak dikenal' };
}

/**
 * SLICE-C — Adapter pembayaran SANDBOX SukiApps.
 *
 * =====================================================================
 * PERINGATAN: Ini BUKAN pembayaran nyata. Tidak ada uang yang bergerak.
 * Setiap fungsi di sini berlabel sandbox secara eksplisit. Jangan pernah
 * dipakai untuk menagih pengguna sungguhan.
 * =====================================================================
 *
 * Adapter deterministik: hasil simulasi pembayaran ditentukan oleh
 * `outcome` yang diberikan pemanggil (bukan oleh provider eksternal).
 */

export const SANDBOX_PROVIDER = 'sandbox' as const;

export interface SandboxOrderInput {
  orderId: string;
  planId: string;
  amount: number; // IDR
}

export interface SandboxCheckoutResult {
  provider: typeof SANDBOX_PROVIDER;
  checkoutUrl: '#sandbox';
  token: string; // token simulasi, format: sbx_<orderId>_<outcome>
  sandbox: true;
}

export type SandboxOutcome = 'paid' | 'failed';

function makeToken(orderId: string, outcome: SandboxOutcome): string {
  return `sbx_${orderId}_${outcome}`;
}

/**
 * Membuat sesi checkout sandbox. Tidak menghubungi provider apa pun —
 * hanya mengembalikan instruksi simulasi untuk UI.
 */
export function createSandboxCheckout(order: SandboxOrderInput): SandboxCheckoutResult {
  return {
    provider: SANDBOX_PROVIDER,
    checkoutUrl: '#sandbox',
    token: makeToken(order.orderId, 'paid'),
    sandbox: true,
  };
}

/**
 * Mensimulasikan hasil pembayaran sandbox untuk sebuah order.
 * Dipakai oleh route webhook internal / simulator — BUKAN dari provider nyata.
 */
export function simulateSandboxPayment(
  orderId: string,
  outcome: SandboxOutcome,
): { orderId: string; outcome: SandboxOutcome; providerRef: string; sandbox: true } {
  return {
    orderId,
    outcome,
    providerRef: makeToken(orderId, outcome),
    sandbox: true,
  };
}

/** Validasi format token sandbox (mencegah token palsu dari client). */
export function isValidSandboxToken(token: string, orderId: string): boolean {
  return token === makeToken(orderId, 'paid') || token === makeToken(orderId, 'failed');
}

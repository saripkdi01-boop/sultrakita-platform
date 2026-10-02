/**
 * BILLING MIDTRANS — Resolusi provider billing.
 *
 * Provider aktif ditentukan env SUKI_BILLING_PROVIDER:
 *  - 'midtrans' + MIDTRANS_SERVER_KEY terisi -> 'midtrans'
 *  - selain itu                              -> 'sandbox' (default aman)
 *
 * Aturan keras: TIDAK PERNAH diam-diam memakai provider nyata.
 * Bila SUKI_BILLING_PROVIDER='midtrans' tetapi server key kosong,
 * resolver mengembalikan 'sandbox' dengan reason jujur — pemanggil wajib
 * menampilkan state `not_configured`, bukan error samar.
 */

import { isMidtransConfigured } from './midtrans';

export type BillingProvider = 'sandbox' | 'midtrans';

export interface ProviderResolution {
  provider: BillingProvider;
  /** True bila provider nyata siap dipakai (key ada). */
  configured: boolean;
  /** Penjelasan untuk log/UI jujur. */
  reason: string;
}

export function resolveBillingProvider(): ProviderResolution {
  const requested = (process.env.SUKI_BILLING_PROVIDER ?? 'sandbox').trim().toLowerCase();
  if (requested === 'midtrans') {
    if (isMidtransConfigured()) {
      return { provider: 'midtrans', configured: true, reason: 'Midtrans aktif (MIDTRANS_SERVER_KEY terisi).' };
    }
    return {
      provider: 'sandbox',
      configured: false,
      reason: "SUKI_BILLING_PROVIDER='midtrans' tetapi MIDTRANS_SERVER_KEY kosong — fallback ke sandbox (not_configured).",
    };
  }
  return { provider: 'sandbox', configured: true, reason: 'Mode sandbox (default).' };
}

/** True bila pembayaran NYATA (non-sandbox) sedang aktif. */
export function isLiveBilling(): boolean {
  const r = resolveBillingProvider();
  return r.provider === 'midtrans' && r.configured;
}

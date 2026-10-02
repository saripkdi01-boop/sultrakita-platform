/**
 * BILLING-LIVE SCAFFOLD — Resolusi provider billing.
 *
 * Provider aktif ditentukan env SUKI_BILLING_PROVIDER:
 *  - 'xendit' + XENDIT_API_KEY terisi  -> 'xendit'
 *  - selain itu                          -> 'sandbox' (default aman)
 *
 * Aturan keras: TIDAK PERNAH diam-diam memakai provider nyata.
 * Bila SUKI_BILLING_PROVIDER='xendit' tetapi API key kosong, resolver
 * mengembalikan 'sandbox' dengan reason jujur — pemanggil wajib
 * menampilkan state `not_configured`, bukan error samar.
 */

import { isXenditConfigured } from './xendit';

export type BillingProvider = 'sandbox' | 'xendit';

export interface ProviderResolution {
  provider: BillingProvider;
  /** True bila provider nyata siap dipakai (key ada). */
  configured: boolean;
  /** Penjelasan untuk log/UI jujur. */
  reason: string;
}

export function resolveBillingProvider(): ProviderResolution {
  const requested = (process.env.SUKI_BILLING_PROVIDER ?? 'sandbox').trim().toLowerCase();
  if (requested === 'xendit') {
    if (isXenditConfigured()) {
      return { provider: 'xendit', configured: true, reason: 'Xendit aktif (XENDIT_API_KEY terisi).' };
    }
    return {
      provider: 'sandbox',
      configured: false,
      reason: "SUKI_BILLING_PROVIDER='xendit' tetapi XENDIT_API_KEY kosong — fallback ke sandbox (not_configured).",
    };
  }
  return { provider: 'sandbox', configured: true, reason: 'Mode sandbox (default).' };
}

/** True bila pembayaran NYATA (non-sandbox) sedang aktif. */
export function isLiveBilling(): boolean {
  const r = resolveBillingProvider();
  return r.provider === 'xendit' && r.configured;
}

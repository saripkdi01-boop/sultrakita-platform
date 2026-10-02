'use client';

/**
 * Klaim referral client-side (best-effort, idempoten).
 *
 * Dipakai AuthGate setelah signup email / login password berhasil.
 * Mengembalikan `true` bila cookie `sk_ref` boleh dihapus (status terminal:
 * klaim sukses, duplikat, atau kode tidak valid), `false` bila klaim perlu
 * dicoba lagi nanti (gangguan jaringan / 5xx).
 */
import { csrfFetch } from '@/lib/security/csrf-client';
import { clearReferralCookie, readReferralFromCookie } from '@/lib/referral-attribution';

const TERMINAL_STATUSES = new Set([200, 201, 400, 404, 409, 410, 422]);

export async function tryClaimReferral(): Promise<boolean> {
  if (typeof window === 'undefined') return true;
  const attribution = readReferralFromCookie();
  if (!attribution) return true;
  try {
    const response = await csrfFetch('/api/referral', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'claim',
        referral_code: attribution.code,
        source_channel: attribution.channel,
      }),
    });
    return TERMINAL_STATUSES.has(response.status);
  } catch {
    return false;
  }
}

/** Panggil tryClaimReferral lalu hapus cookie bila sudah terminal. Jangan await. */
export function claimReferralBestEffort(): void {
  void tryClaimReferral()
    .then((done) => {
      if (done) clearReferralCookie();
    })
    .catch(() => undefined);
}

// T-ADS · Consent iklan (UU PDP).
// DEFAULT: non-personalized (npa=1). Iklan personalisasi HANYA bila user
// memberikan consent eksplisit.
//
// TITIK INTEGRASI UNTUK TRACK T6 (banner consent cookie):
// Banner T6 cukup memanggil `setAdConsent('granted' | 'denied')` saat user
// memilih. Fungsi ini menyimpan ke cookie + localStorage dan memancarkan
// event `suki-consent-ads-changed` di window agar slot iklan yang sudah
// ter-render bisa menyesuaikan pada kunjungan berikutnya.
// AdSense non-personalized diaktifkan via
// `window.adsbygoogle.requestNonPersonalizedAds = 1` di AdSenseUnit.

export const AD_CONSENT_KEY = 'suki-consent-ads' as const;
export const AD_CONSENT_EVENT = 'suki-consent-ads-changed' as const;

export type AdConsent = 'granted' | 'denied' | 'unset';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
  } catch {
    return null;
  }
}

/** Baca status consent. Default 'unset' → diperlakukan sebagai non-personalized. */
export function getAdConsent(): AdConsent {
  const fromCookie = readCookie(AD_CONSENT_KEY);
  if (fromCookie === 'granted' || fromCookie === 'denied') return fromCookie;
  try {
    const fromStorage = typeof localStorage !== 'undefined' ? localStorage.getItem(AD_CONSENT_KEY) : null;
    if (fromStorage === 'granted' || fromStorage === 'denied') return fromStorage;
  } catch {
    /* abaikan */
  }
  return 'unset';
}

/** true hanya bila user eksplisit menyetujui iklan personalisasi. */
export function isPersonalizedAdsAllowed(): boolean {
  return getAdConsent() === 'granted';
}

/** Simpan pilihan consent (dipanggil banner T6 / halaman privasi). */
export function setAdConsent(value: 'granted' | 'denied'): void {
  try {
    const expires = new Date(Date.now() + 365 * 86_400_000).toUTCString();
    document.cookie = `${AD_CONSENT_KEY}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; Expires=${expires}; SameSite=Lax`;
  } catch {
    /* abaikan */
  }
  try {
    localStorage.setItem(AD_CONSENT_KEY, value);
  } catch {
    /* abaikan */
  }
  try {
    window.dispatchEvent(new CustomEvent<AdConsent>(AD_CONSENT_EVENT, { detail: value }));
  } catch {
    /* abaikan */
  }
}

/**
 * SLICE-C — Definisi paket (plan) billing SukiApps.
 *
 * Catatan jujur:
 *  - Harga adalah ASUMSI perancangan (IDR), BUKAN harga final.
 *  - Tidak ada pembayaran nyata: provider billing = 'sandbox'.
 *  - Definisi statis di sini adalah fallback; sumber kebenaran adalah
 *    tabel `billing_plans` (dikelola admin). Sinkronkan keduanya saat berubah.
 */

export const BILLING_CURRENCY = 'IDR' as const;

export type PlanId = 'free' | 'basic' | 'pro' | 'enterprise';

/** Kunci fitur yang dipakai kontrak entitlement (lihat billing_entitlements.feature_key). */
export const FEATURE_KEYS = [
  'featured_listings', // listing unggulan per bulan
  'boost_credits',     // kredit boost per bulan
  'verified_business', // lencana bisnis terverifikasi (1 = punya)
  'premium_job_posts', // posting lowongan premium per bulan
] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];

export interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number; // IDR, asumsi
  features: string[];   // kalimat tampil (Indonesia)
  limits: Record<FeatureKey, number>; // limit default entitlement (0 = tidak ada akses)
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratis',
    priceMonthly: 0,
    features: [
      'Pasang listing tanpa batas',
      '1 lowongan kerja premium per bulan',
      'Dukungan komunitas',
    ],
    limits: { featured_listings: 0, boost_credits: 0, verified_business: 0, premium_job_posts: 1 },
  },
  {
    id: 'basic',
    name: 'Basic',
    priceMonthly: 49000,
    features: [
      '4 listing unggulan (featured) per bulan',
      '10 kredit boost per bulan',
      '5 posting lowongan kerja premium per bulan',
      'Lencana bisnis terverifikasi',
    ],
    limits: { featured_listings: 4, boost_credits: 10, verified_business: 1, premium_job_posts: 5 },
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 149000,
    features: [
      '20 listing unggulan (featured) per bulan',
      '50 kredit boost per bulan',
      '20 posting lowongan kerja premium per bulan',
      'Lencana bisnis terverifikasi',
      'Prioritas dukungan',
    ],
    limits: { featured_listings: 20, boost_credits: 50, verified_business: 1, premium_job_posts: 20 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 0, // belum ditetapkan — hubungi tim SukiApps
    features: [
      'Kuota custom per kebutuhan',
      'Integrasi & onboarding khusus',
      'Dukungan prioritas',
    ],
    limits: { featured_listings: 0, boost_credits: 0, verified_business: 1, premium_job_posts: 0 },
  },
];

/** Harga format IDR, mis. "Rp49.000". */
export function formatIDR(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}

export function getPlan(planId: string): Plan | undefined {
  return PLANS.find((p) => p.id === planId);
}

/** Daftar plan aktif untuk ditampilkan. 'enterprise' disembunyikan dari daftar publik sampai harga ditetapkan. */
export function getPlans(): Plan[] {
  return PLANS.filter((p) => p.id !== 'enterprise');
}

/** Guard: planId valid untuk checkout? */
export function isCheckoutablePlan(planId: string): planId is 'basic' | 'pro' {
  return planId === 'basic' || planId === 'pro';
}

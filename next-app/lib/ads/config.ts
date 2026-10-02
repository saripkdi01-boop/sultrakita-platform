// T-ADS · Registry placement iklan SUKI Apps.
// Satu-satunya sumber kebenaran untuk slot iklan: ukuran IAB, frekuensi,
// reserve ruang (anti layout-shift), dan template house-ads yang diizinkan.
// Tidak ada secret di sini — publisher ID AdSense hanya lewat env
// NEXT_PUBLIC_ADSENSE_CLIENT_ID (baca: docs/ADS-MONETIZATION.md).

export type AdProvider = 'adsense' | 'house' | 'off';

export type PlacementId =
  | 'feed-infeed'
  | 'marketplace-leaderboard'
  | 'sidebar-desktop'
  | 'marketplace-grid'
  | 'mobile-banner'
  | 'properti-detail-sidebar'
  | 'jobs-list'
  | 'news-infeed';

export interface PlacementSpec {
  /** id unik placement */
  id: PlacementId;
  /** Nama tampilan (id-ID) untuk /admin/ads */
  title: string;
  /** Deskripsi singkat lokasi slot */
  description: string;
  /** Ukuran IAB / spesifikasi AdSense */
  sizes: string[];
  /** Frekuensi tampil */
  frequency: string;
  /** Tinggi minimum (px) yang di-reserve SEBELUM iklan load — anti CLS */
  minHeight: number;
  /** Template rasio house-ads yang diizinkan untuk placement ini */
  templates: string[];
  /** Catatan kebijakan/UX */
  policyNote: string;
}

export const AD_PLACEMENTS: Record<PlacementId, PlacementSpec> = {
  'feed-infeed': {
    id: 'feed-infeed',
    title: 'Feed In-Feed (native)',
    description: 'Iklan native di antara postingan feed /beranda.',
    sizes: ['FLUID responsif', 'AdSense data-ad-format="auto" + data-full-width-responsive="true"'],
    frequency: 'Tiap 8 postingan (~12,5% densitas)',
    minHeight: 140,
    templates: ['native-16:9', 'native-1:1'],
    policyNote: 'Native menyerupai konten; label "Iklan"/"Bersponsor" wajib.',
  },
  'marketplace-leaderboard': {
    id: 'marketplace-leaderboard',
    title: 'Marketplace Leaderboard (desktop)',
    description: 'Di atas hasil pencarian marketplace, hanya desktop ≥1024px.',
    sizes: ['728×90 (fallback 970×90)'],
    frequency: '1 slot per halaman hasil',
    minHeight: 90,
    templates: ['728×90', '970×90'],
    policyNote: 'Jangan letakkan tepat menempel tombol aksi/filter agar klik tetap valid.',
  },
  'sidebar-desktop': {
    id: 'sidebar-desktop',
    title: 'Sidebar Desktop',
    description: 'Bagian bawah sidebar desktop utama (AppLayout).',
    sizes: ['300×250 (fallback 300×600 bila sidebar tinggi)'],
    frequency: '1 slot per halaman',
    minHeight: 250,
    templates: ['300×250', '300×600'],
    policyNote: 'Hidden di bawah 1024px.',
  },
  'marketplace-grid': {
    id: 'marketplace-grid',
    title: 'Marketplace Grid (native)',
    description: 'Interstitial native menyerupai kartu listing di grid hasil.',
    sizes: ['FLUID responsif'],
    frequency: '1 slot setelah kartu ke-9',
    minHeight: 160,
    templates: ['native-16:9', 'native-1:1'],
    policyNote: 'Rasio & padding menyerupai kartu listing agar tidak merusak grid.',
  },
  'mobile-banner': {
    id: 'mobile-banner',
    title: 'Mobile Banner',
    description: 'Banner kecil di atas konten marketplace, hanya ≤780px.',
    sizes: ['320×50 (fallback 320×100)'],
    frequency: 'Maks 1 per viewport',
    minHeight: 50,
    templates: ['320×50', '320×100'],
    policyNote: 'TIDAK sticky (demi UX) dan dismissible (tombol tutup).',
  },
  'properti-detail-sidebar': {
    id: 'properti-detail-sidebar',
    title: 'Properti Detail Sidebar',
    description: 'Kolom kanan halaman detail properti, di bawah info seller/CTA.',
    sizes: ['300×250'],
    frequency: '1 slot per halaman detail',
    minHeight: 250,
    templates: ['300×250'],
    policyNote: 'Jauh dari tombol "Simpan"/kontak seller — cegah klik tidak valid.',
  },
  'jobs-list': {
    id: 'jobs-list',
    title: 'Jobs List (native)',
    description: 'Iklan native di bawah daftar lowongan /jobs.',
    sizes: ['FLUID responsif'],
    frequency: '1 slot setelah daftar lowongan',
    minHeight: 150,
    templates: ['native-16:9', 'native-1:1'],
    policyNote: 'Native; label wajib.',
  },
  'news-infeed': {
    id: 'news-infeed',
    title: 'Portal Berita In-Feed (native)',
    description: 'Iklan native di antara kartu berita Portal Berita /beranda.',
    sizes: ['FLUID responsif', 'AdSense data-ad-format="auto" + data-full-width-responsive="true"'],
    frequency: 'Tiap 6 kartu berita (~16% densitas)',
    minHeight: 140,
    templates: ['native-16:9', 'native-1:1'],
    policyNote: 'Native menyerupai konten; label "Iklan"/"Bersponsor" wajib. AdSense-ready: aktif otomatis bila placement dikonfigurasi provider=adsense di ad_placements + NEXT_PUBLIC_ADSENSE_CLIENT_ID terisi.',
  },
};

export const AD_PLACEMENT_IDS = Object.keys(AD_PLACEMENTS) as PlacementId[];

export function getPlacement(id: string): PlacementSpec | undefined {
  return (AD_PLACEMENTS as Record<string, PlacementSpec>)[id];
}

/** Publisher ID AdSense — HANYA dari env. Kosong = AdSense nonaktif total. */
export const ADSENSE_CLIENT_ID: string = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '').trim();

/** Path yang TIDAK BOLEH menampilkan iklan (kebijakan AdSense + UX). */
const EXCLUDED_PATH_PREFIXES = ['/admin', '/billing', '/checkout'];

/** true bila path tidak boleh menampilkan iklan. */
export function isExcludedAdPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const path = pathname.toLowerCase();
  return EXCLUDED_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/** Template rasio house-ads: [lebar, tinggi] atau rasio 'w:h'. */
export const AD_TEMPLATES: Record<string, { ratio: [number, number]; label: string }> = {
  '728×90': { ratio: [728, 90], label: 'Leaderboard 728×90' },
  '970×90': { ratio: [970, 90], label: 'Leaderboard besar 970×90' },
  '300×250': { ratio: [300, 250], label: 'Medium rectangle 300×250' },
  '300×600': { ratio: [300, 600], label: 'Half page 300×600' },
  '320×50': { ratio: [320, 50], label: 'Mobile banner 320×50' },
  '320×100': { ratio: [320, 100], label: 'Mobile banner besar 320×100' },
  'native-16:9': { ratio: [16, 9], label: 'Native 16:9' },
  'native-1:1': { ratio: [1, 1], label: 'Native 1:1' },
};

/**
 * Validasi rasio gambar terhadap template placement.
 * @returns null bila cocok; pesan error (id-ID) bila tidak.
 */
export function validateAdImageRatio(
  placementId: PlacementId,
  naturalWidth: number,
  naturalHeight: number,
  template: string,
): string | null {
  const spec = getPlacement(placementId);
  if (!spec) return 'Placement tidak dikenal.';
  if (!spec.templates.includes(template)) {
    return `Template ${template} tidak diizinkan untuk placement "${spec.title}". Pilih: ${spec.templates.join(', ')}.`;
  }
  const target = AD_TEMPLATES[template];
  if (!target) return `Template ${template} tidak dikenal.`;
  if (!naturalWidth || !naturalHeight) return 'Dimensi gambar tidak terbaca.';
  const actual = naturalWidth / naturalHeight;
  const expected = target.ratio[0] / target.ratio[1];
  const tolerance = 0.03; // ±3%
  if (Math.abs(actual - expected) / expected > tolerance) {
    return `Rasio gambar ${naturalWidth}×${naturalHeight} tidak cocok untuk template ${template} (rasio ${target.ratio[0]}:${target.ratio[1]}).`;
  }
  return null;
}

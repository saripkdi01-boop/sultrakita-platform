import type { PublicSeller } from '@/lib/listings-query';

// Fase 2.5: tier kepercayaan seller — DITURUNKAN dari data nyata, bukan klaim.
// - "Toko Official": terverifikasi + reputasi mapan (>= 50 ulasan)
// - "Terverifikasi": status verifikasi disetujui admin
// - null: belum ada sinyal kepercayaan yang cukup -> tidak ada badge
// Ambang 50 ulasan didokumentasikan di sini agar konsisten di semua kartu.

export type SellerTier = { label: string; kind: 'official' | 'verified' };

const OFFICIAL_REVIEW_THRESHOLD = 50;

export function sellerTier(seller?: PublicSeller | null): SellerTier | null {
  if (!seller) return null;
  if (seller.verification_status !== 'approved') return null;
  if (Number(seller.rating_count || 0) >= OFFICIAL_REVIEW_THRESHOLD) return { label: 'Toko Official', kind: 'official' };
  return { label: 'Terverifikasi', kind: 'verified' };
}

export function sellerRatingText(seller?: PublicSeller | null): string | null {
  const count = Number(seller?.rating_count || 0);
  if (count <= 0) return null;
  return `${Number(seller?.rating_average || 0).toFixed(1)} (${count})`;
}

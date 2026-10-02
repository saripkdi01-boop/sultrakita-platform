import type { PublicListing } from '@/lib/listings-query';

// Slice 1 (program 4-jam): badge promo ala Shopee/Tokopedia.
// "-X%" dihitung HANYA dari data nyata (original_price > price > 0).
// Bila kolom original_price belum ada di DB / bernilai null, kembalikan 0
// dan badge tidak dirender — tidak ada diskon palsu.
export function discountPercent(listing: PublicListing): number {
  const price = Math.trunc(Number(listing.price) || 0);
  const original = Math.trunc(Number(listing.original_price) || 0);
  if (original > price && price > 0) return Math.round((1 - price / original) * 100);
  return 0;
}

export function originalPriceValue(listing: PublicListing): number {
  return Math.trunc(Number(listing.original_price) || 0);
}

// lib/whatsapp.ts — tautan click-to-chat WhatsApp (wa.me).
//
// Tanpa API, tanpa dependensi, tanpa biaya: link wa.me langsung membuka
// chat WhatsApp ke nomor tujuan dengan pesan terisi otomatis.
//
// Nomor tujuan SUKI (WA Business resmi) dibaca dari env publik
// NEXT_PUBLIC_SUKI_WA_NUMBER bila diset, else nomor default resmi SUKI
// (lihat DEFAULT_SUKI_WA_NUMBER). Format: 62812xxxxxxx (tanpa "+").
// Prinsip jujur: helper ini TIDAK mengarang nomor — sumbernya selalu nomor
// resmi yang ditetapkan pemilik SUKI. sukiWaLink() mengembalikan null hanya
// bila tidak ada nomor valid sama sekali, dan pemanggil WAJIB menyembunyikan
// tombol dalam kasus itu.

const FALLBACK_SITE_URL = 'https://sukiapps.web.id';

// Nomor WA Business resmi SUKI (admin). Default dari kode agar tombol
// langsung berfungsi; bisa dioverride via env NEXT_PUBLIC_SUKI_WA_NUMBER
// (mis. nomor berbeda untuk staging) tanpa ubah kode.
const DEFAULT_SUKI_WA_NUMBER = '6281993532722';

/** URL kanonis situs (pola yang dipakai halaman lain di repo ini). */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, '');
}

/** Bersihkan nomor: hanya digit; awalan 0 → 62 (Indonesia). */
export function toWaDigits(raw: string | null | undefined): string {
  let digits = (raw || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`;
  return digits;
}

/** Bangun link wa.me; text di-encode otomatis. */
export function waLink(digits: string, text?: string): string {
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Nomor WA resmi SUKI: dari env bila diset, else nomor default resmi. */
export function sukiWaDigits(): string {
  return toWaDigits(process.env.NEXT_PUBLIC_SUKI_WA_NUMBER || DEFAULT_SUKI_WA_NUMBER);
}

/**
 * Link chat ke WA resmi SUKI dengan pesan terisi otomatis.
 * Mengembalikan null bila nomor belum dikonfigurasi — tombol jangan dirender.
 */
export function sukiWaLink(text: string): string | null {
  const digits = sukiWaDigits();
  return digits ? waLink(digits, text) : null;
}

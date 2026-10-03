import { z } from 'zod';

/**
 * Satu sumber kebenaran untuk form "Jual di Marketplace" (/marketplace/create)
 * dan validasi server POST /api/listings.
 *
 * Keputusan skema (diaudit 2026-10-03):
 * - Foto disimpan di kolom `listings.images` (text[]) + `thumbnail_url`; tabel
 *   `listing_media` TIDAK dipakai karena cacat skema (listing_id bigint vs
 *   listings.id uuid; kolom listing_uuid dari migrasi fase2 tidak konsisten).
 * - Kategori form memakai 11 label yang SAMA dengan filter marketplace
 *   (components/marketplace/FbmFilters); server memetakan label -> uuid via
 *   tabel categories (slug/nama), null bila tidak ada padanan — listing tetap
 *   ditemukan lewat pencarian teks & filter kota.
 * - Nomor WhatsApp opsional disimpan di kolom jsonb `specifications.whatsapp`
 *   (tidak ada kolom khusus; tanpa migrasi).
 */

export const CREATE_MAX_PHOTOS = 8;
export const CREATE_MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB per foto (server action mengizinkan 20 MB)
export const CREATE_ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

export const CREATE_CATEGORY_LABELS = [
  'Elektronik',
  'Kendaraan',
  'Properti',
  'Fashion',
  'Kuliner',
  'Furnitur',
  'Jasa',
  'Pertanian',
  'Perikanan',
  'Kecantikan',
  'Olahraga',
] as const;

export const CREATE_CONDITIONS = [
  { value: 'new', label: 'Baru' },
  { value: 'like_new', label: 'Seperti baru' },
  { value: 'good', label: 'Bekas — kondisi baik' },
  { value: 'fair', label: 'Bekas — layak pakai' },
] as const;
export type CreateCondition = (typeof CREATE_CONDITIONS)[number]['value'];

/** 17 wilayah administratif Sulawesi Tenggara (data publik). `short` dipakai
 *  sebagai nilai `district`/`city` agar konsisten dengan filter marketplace. */
export const SULTRA_REGIONS = [
  { short: 'Kendari', name: 'Kota Kendari' },
  { short: 'Baubau', name: 'Kota Baubau' },
  { short: 'Kolaka', name: 'Kabupaten Kolaka' },
  { short: 'Kolaka Utara', name: 'Kabupaten Kolaka Utara' },
  { short: 'Kolaka Timur', name: 'Kabupaten Kolaka Timur' },
  { short: 'Konawe', name: 'Kabupaten Konawe' },
  { short: 'Konawe Utara', name: 'Kabupaten Konawe Utara' },
  { short: 'Konawe Selatan', name: 'Kabupaten Konawe Selatan' },
  { short: 'Konawe Kepulauan', name: 'Kabupaten Konawe Kepulauan' },
  { short: 'Muna', name: 'Kabupaten Muna' },
  { short: 'Muna Barat', name: 'Kabupaten Muna Barat' },
  { short: 'Buton', name: 'Kabupaten Buton' },
  { short: 'Buton Selatan', name: 'Kabupaten Buton Selatan' },
  { short: 'Buton Tengah', name: 'Kabupaten Buton Tengah' },
  { short: 'Buton Utara', name: 'Kabupaten Buton Utara' },
  { short: 'Bombana', name: 'Kabupaten Bombana' },
  { short: 'Wakatobi', name: 'Kabupaten Wakatobi' },
] as const;

const CATEGORY_SET = new Set<string>(CREATE_CATEGORY_LABELS as readonly string[]);
const REGION_SET = new Set<string>(SULTRA_REGIONS.map((r) => r.short));

/** Buang karakter kontrol; untuk judul satukan spasi ganda. */
export function sanitizeText(value: string, collapseSpaces = false): string {
  const noControl = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  return collapseSpaces ? noControl.replace(/\s+/g, ' ').trim() : noControl.trim();
}

/**
 * Normalisasi nomor WhatsApp Indonesia ke format 628xx.
 * Mengembalikan null bila kosong; melempar Error berpesan Indonesia bila invalid.
 */
export function normalizeWhatsapp(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith('8')) digits = `62${digits}`;
  if (!/^62\d{9,13}$/.test(digits)) {
    throw new Error('Nomor WhatsApp tidak valid. Gunakan format 08xx atau 628xx.');
  }
  return digits;
}

const photoSchema = z.object({
  url: z
    .string()
    .url('Tautan foto tidak valid.')
    .max(500, 'Tautan foto terlalu panjang.')
    .refine((u) => u.startsWith('https://'), 'Tautan foto harus HTTPS.'),
  key: z
    .string()
    .trim()
    .min(1, 'Kunci foto tidak valid.')
    .max(500, 'Kunci foto terlalu panjang.')
    .regex(/^marketplace\//, 'Kunci foto tidak valid.'),
});

/** Payload client -> POST /api/listings. Dipakai di client (validasi awal)
 *  dan server (validasi final — jangan percaya client). */
export const createListingPayloadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, 'Judul minimal 10 karakter agar jelas.')
    .max(140, 'Judul maksimal 140 karakter.'),
  category: z.string().refine((v) => CATEGORY_SET.has(v), 'Pilih kategori yang tersedia.'),
  condition: z.enum(['new', 'like_new', 'good', 'fair'], {
    errorMap: () => ({ message: 'Pilih kondisi barang.' }),
  }),
  price: z
    .number({ invalid_type_error: 'Harga harus berupa angka.' })
    .int('Harga harus bilangan bulat.')
    .min(0, 'Harga tidak boleh negatif.')
    .max(999_999_999_999, 'Harga terlalu besar.'),
  negotiable: z.boolean().default(true),
  stock: z
    .number({ invalid_type_error: 'Stok harus berupa angka.' })
    .int('Stok harus bilangan bulat.')
    .min(1, 'Stok minimal 1.')
    .max(10000, 'Stok maksimal 10.000.')
    .default(1),
  description: z
    .string()
    .trim()
    .min(20, 'Deskripsi minimal 20 karakter. Ceritakan kondisi & kelengkapannya.')
    .max(5000, 'Deskripsi maksimal 5.000 karakter.'),
  district: z.string().refine((v) => REGION_SET.has(v), 'Pilih kota/kabupaten di Sulawesi Tenggara.'),
  whatsapp: z.string().trim().max(24, 'Nomor WhatsApp terlalu panjang.').optional().nullable(),
  photos: z.array(photoSchema).max(CREATE_MAX_PHOTOS, `Maksimal ${CREATE_MAX_PHOTOS} foto.`).default([]),
  idempotencyKey: z.string().max(120).nullish(),
});

export type CreateListingPayload = z.infer<typeof createListingPayloadSchema>;

/** Format angka ke "Rp 1.250.000". */
export function formatIDR(value: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}

/** Parse input harga ("1.250.000" / "1250000") -> number. NaN bila tak terbaca. */
export function parsePriceInput(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return NaN;
  return Number(digits);
}

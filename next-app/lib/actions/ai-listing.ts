'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export const LISTING_CATEGORIES = ['Elektronik', 'Fashion', 'Kuliner', 'Properti', 'Kendaraan', 'Jasa', 'Hobi'] as const;
export type ListingCategory = (typeof LISTING_CATEGORIES)[number];

export type ListingAiResult = {
  title: string;
  description: string;
  category: ListingCategory;
  estimated_price_min: number;
  estimated_price_max: number;
  suggested_tags: string[];
};

type Input = { imageUrl?: string; base64?: string; mimeType?: string };

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_TITLE = 60;
const MAX_DESCRIPTION = 300;

function errorResult(message: string) {
  return { ok: false as const, error: message };
}

function cleanResult(value: Partial<ListingAiResult>): ListingAiResult {
  const category = LISTING_CATEGORIES.includes(value.category as ListingCategory) ? value.category as ListingCategory : 'Hobi';
  const title = String(value.title || 'Produk pilihan Sulawesi Tenggara').trim().slice(0, MAX_TITLE);
  const description = String(value.description || 'Tambahkan detail kondisi, keunggulan, dan cara transaksi produk ini.').trim().slice(0, MAX_DESCRIPTION);
  const min = Math.max(0, Math.round(Number(value.estimated_price_min) || 0));
  const max = Math.max(min, Math.round(Number(value.estimated_price_max) || min));
  const tags = Array.isArray(value.suggested_tags)
    ? value.suggested_tags.map(tag => String(tag).trim().toLowerCase()).filter(Boolean).slice(0, 8)
    : [];
  return { title, description, category, estimated_price_min: min, estimated_price_max: max, suggested_tags: tags };
}

function decodeBase64(input: string) {
  const match = input.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) throw new Error('Format foto tidak didukung. Gunakan JPG, PNG, atau WebP.');
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error('Ukuran foto maksimal 8 MB.');
  return { data: buffer.toString('base64'), mimeType: match[1] };
}

async function fetchAllowedImage(imageUrl: string) {
  const configured = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!configured) throw new Error('Storage gambar belum dikonfigurasi.');
  const target = new URL(imageUrl);
  const allowed = new URL(configured).host;
  if (target.protocol !== 'https:' || target.host !== allowed) throw new Error('Foto harus berasal dari Supabase Storage SultraKita.');
  const response = await fetch(target, { cache: 'no-store' });
  if (!response.ok) throw new Error('Foto tidak dapat dibaca dari storage.');
  const contentType = response.headers.get('content-type') || '';
  if (!/^image\/(jpeg|png|webp)$/.test(contentType)) throw new Error('File storage bukan gambar yang didukung.');
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error('Ukuran foto maksimal 8 MB.');
  return { data: buffer.toString('base64'), mimeType: contentType };
}

export async function generateListingFromImage(input: Input) {
  try {
    if (!process.env.GEMINI_API_KEY) return errorResult('Bantuan AI belum aktif di server. Kamu tetap dapat mengisi iklan secara manual.');
    if (!input?.base64 && !input?.imageUrl) return errorResult('Pilih minimal satu foto produk terlebih dahulu.');
    const image = input.base64 ? decodeBase64(input.base64) : await fetchAllowedImage(input.imageUrl as string);
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash' });
    const prompt = `Kamu adalah asisten listing marketplace lokal Sulawesi Tenggara. Analisis foto produk secara hati-hati. Jangan mengarang merek, kondisi, ukuran, atau spesifikasi yang tidak terlihat; gunakan bahasa yang jujur dan tandai hal yang perlu dikonfirmasi seller. Pertimbangkan konteks Kendari, Buton, Konawe, Wakatobi, dan daerah Sultra untuk istilah lokal yang relevan. Perkirakan rentang harga wajar dalam Rupiah Indonesia berdasarkan visual dan kategori, bukan kepastian harga.

Kembalikan HANYA JSON valid tanpa markdown dengan keys: title (maksimal 60 karakter), description (maksimal 300 karakter), category (satu dari ${LISTING_CATEGORIES.join(', ')}), estimated_price_min (integer Rupiah), estimated_price_max (integer Rupiah), suggested_tags (array string maksimal 8).`;
    const result = await model.generateContent([{ text: prompt }, { inlineData: { data: image.data, mimeType: image.mimeType } }]);
    const raw = result.response.text().replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(raw) as Partial<ListingAiResult>;
    return { ok: true as const, data: cleanResult(parsed) };
  } catch (error) {
    console.error('generateListingFromImage failed', error);
    return errorResult(error instanceof Error ? error.message : 'AI belum dapat menganalisis foto. Silakan coba lagi atau isi manual.');
  }
}

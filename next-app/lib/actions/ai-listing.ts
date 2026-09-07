'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const LISTING_CATEGORIES = ['Elektronik', 'Fashion', 'Kuliner', 'Properti', 'Kendaraan', 'Jasa', 'Hobi'] as const;
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

type AiListingTelemetry = {
  outcome: 'success' | 'fallback';
  reason: 'none' | 'configuration' | 'invalid_input' | 'quota' | 'provider' | 'invalid_response' | 'unsupported_image';
  model: string;
  duration_ms: number;
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_TITLE = 60;
const MAX_DESCRIPTION = 300;
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

function errorResult(message: string) {
  return { ok: false as const, error: message };
}

function emitTelemetry(event: AiListingTelemetry) {
  // Do not add input, prompt, response, URL, user ID, or provider error text here.
  console.info(JSON.stringify({ event: 'ai_listing_generation', ...event }));
}

function cleanResult(value: Partial<ListingAiResult>): ListingAiResult {
  if (!value.title || !value.description || !LISTING_CATEGORIES.includes(value.category as ListingCategory)) {
    throw new Error('Respons AI belum lengkap atau kategorinya tidak valid.');
  }
  const min = Number(value.estimated_price_min);
  const max = Number(value.estimated_price_max);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < min) {
    throw new Error('Rentang harga dari AI tidak valid.');
  }
  const tags = Array.isArray(value.suggested_tags)
    ? value.suggested_tags.map(tag => String(tag).trim().toLowerCase()).filter(Boolean).slice(0, 8)
    : [];
  return {
    title: String(value.title).trim().slice(0, MAX_TITLE),
    description: String(value.description).trim().slice(0, MAX_DESCRIPTION),
    category: value.category as ListingCategory,
    estimated_price_min: Math.round(min),
    estimated_price_max: Math.round(max),
    suggested_tags: tags,
  };
}

function decodeBase64(input: string) {
  const match = input.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) throw new Error('Format foto tidak didukung. Gunakan JPG, PNG, atau WebP.');
  const mimeType = match[1];
  if (!SUPPORTED_IMAGE_TYPES.includes(mimeType as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
    throw new Error('Format foto tidak didukung. Gunakan JPG, PNG, atau WebP.');
  }
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error('Ukuran foto maksimal 8 MB.');
  return { data: buffer.toString('base64'), mimeType };
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
  if (!SUPPORTED_IMAGE_TYPES.includes(contentType as (typeof SUPPORTED_IMAGE_TYPES)[number])) throw new Error('File storage bukan gambar yang didukung.');
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error('Ukuran foto maksimal 8 MB.');
  return { data: buffer.toString('base64'), mimeType: contentType };
}

function providerErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const normalized = message.toLowerCase();
  if (/8 mb|format foto|file storage bukan gambar|storage gambar|foto tidak dapat dibaca/.test(normalized)) {
    return message;
  }
  if (/429|quota|rate.?limit|resource exhausted|too many requests/.test(normalized)) {
    return 'Kuota AI sedang habis atau batas request tercapai. Silakan isi listing secara manual dan coba lagi nanti.';
  }
  if (/401|403|api key|permission|unauthorized|forbidden/.test(normalized)) {
    return 'Bantuan AI belum dapat digunakan karena konfigurasi server belum valid. Kamu tetap dapat mengisi listing secara manual.';
  }
  if (/timeout|timed out|503|502|500|unavailable|overloaded|fetch failed/.test(normalized)) {
    return 'Layanan AI sedang tidak tersedia. Silakan isi listing secara manual atau coba lagi nanti.';
  }
  if (/respons ai|rentang harga/.test(normalized)) {
    return 'Respons AI belum lengkap. Silakan periksa dan isi listing secara manual.';
  }
  return 'AI belum dapat menganalisis foto. Silakan isi listing secara manual atau coba lagi nanti.';
}

function telemetryReason(error: unknown): AiListingTelemetry['reason'] {
  const message = (error instanceof Error ? error.message : String(error || '')).toLowerCase();
  if (/8 mb|format foto|file storage bukan gambar|storage gambar|foto tidak dapat dibaca/.test(message)) return 'unsupported_image';
  if (/respons ai|rentang harga|json|kategori/.test(message)) return 'invalid_response';
  if (/429|quota|rate.?limit|resource exhausted|too many requests/.test(message)) return 'quota';
  if (/api key|permission|unauthorized|forbidden|configuration|konfigurasi/.test(message)) return 'configuration';
  if (/foto|image|gambar|pilih minimal/.test(message)) return 'invalid_input';
  return 'provider';
}

export async function generateListingFromImage(input: Input) {
  const startedAt = Date.now();
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  try {
    if (!process.env.GEMINI_API_KEY) {
      emitTelemetry({ outcome: 'fallback', reason: 'configuration', model, duration_ms: Date.now() - startedAt });
      return errorResult('Bantuan AI belum aktif di server. Kamu tetap dapat mengisi listing secara manual.');
    }
    if (!input?.base64 && !input?.imageUrl) {
      emitTelemetry({ outcome: 'fallback', reason: 'invalid_input', model, duration_ms: Date.now() - startedAt });
      return errorResult('Pilih minimal satu foto produk terlebih dahulu.');
    }
    if (input.mimeType && !SUPPORTED_IMAGE_TYPES.includes(input.mimeType as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
      emitTelemetry({ outcome: 'fallback', reason: 'unsupported_image', model, duration_ms: Date.now() - startedAt });
      return errorResult('Format foto tidak didukung. Gunakan JPG, PNG, atau WebP.');
    }
    const image = input.base64 ? decodeBase64(input.base64) : await fetchAllowedImage(input.imageUrl as string);
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const generativeModel = client.getGenerativeModel({ model });
    const prompt = `Kamu adalah asisten listing marketplace lokal Sulawesi Tenggara. Analisis foto produk secara hati-hati. Jangan mengarang merek, kondisi, ukuran, atau spesifikasi yang tidak terlihat; gunakan bahasa yang jujur dan tandai hal yang perlu dikonfirmasi seller. Pertimbangkan konteks Kendari, Buton, Konawe, Wakatobi, dan daerah Sultra untuk istilah lokal yang relevan. Perkirakan rentang harga wajar dalam Rupiah Indonesia berdasarkan visual dan kategori, bukan kepastian harga.

Kembalikan HANYA JSON valid tanpa markdown dengan keys: title (maksimal 60 karakter), description (maksimal 300 karakter), category (satu dari ${LISTING_CATEGORIES.join(', ')}), estimated_price_min (integer Rupiah), estimated_price_max (integer Rupiah), suggested_tags (array string maksimal 8).`;
    const result = await generativeModel.generateContent([{ text: prompt }, { inlineData: { data: image.data, mimeType: image.mimeType } }]);
    const raw = result.response.text().replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(raw) as Partial<ListingAiResult>;
    const data = cleanResult(parsed);
    emitTelemetry({ outcome: 'success', reason: 'none', model, duration_ms: Date.now() - startedAt });
    return { ok: true as const, data };
  } catch (error) {
    emitTelemetry({ outcome: 'fallback', reason: telemetryReason(error), model, duration_ms: Date.now() - startedAt });
    return errorResult(providerErrorMessage(error));
  }
}

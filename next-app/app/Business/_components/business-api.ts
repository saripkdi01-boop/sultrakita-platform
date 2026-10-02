import { apiErrorMessage } from '@/lib/api-client';
import type { BusinessFormData } from './BusinessForm';

let csrfToken: string | null = null;

/** Ambil token CSRF (pola yang sama dengan lib/feed-interactions.ts). */
export async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  const response = await fetch('/api/csrf', { credentials: 'include', cache: 'no-store' });
  if (!response.ok) throw new Error('Token keamanan belum tersedia. Muat ulang halaman dan coba lagi.');
  const payload = (await response.json().catch(() => null)) as { csrfToken?: string } | null;
  if (!payload?.csrfToken) throw new Error('Token keamanan tidak valid.');
  csrfToken = payload.csrfToken;
  return csrfToken;
}

type JsonPayload = Record<string, unknown> | null;

async function readPayload(response: Response): Promise<JsonPayload> {
  return (await response.json().catch(() => null)) as JsonPayload;
}

function extractData(payload: JsonPayload): unknown {
  if (payload && typeof payload === 'object' && 'data' in payload) return (payload as { data: unknown }).data;
  return payload;
}

async function csrfHeaders(): Promise<Record<string, string>> {
  const token = await getCsrfToken();
  return { 'Content-Type': 'application/json', 'X-CSRF-Token': token };
}

/** Petakan state form (penamaan Indonesia) menjadi body JSON API (kolom English).
 *  Kolom opsional ber-regex (telepon/whatsapp/email/website) dihilangkan bila kosong
 *  karena API menolak string kosong untuk kolom tersebut. */
export function buildBusinessPayload(data: BusinessFormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: data.nama.trim(),
    category: data.kategori,
    description: data.deskripsi.trim(),
    address: data.alamat.trim(),
    city: data.kota.trim(),
    province: data.provinsi.trim(),
    hours: data.jam_operasional,
  };
  const phone = data.telepon.trim();
  const whatsapp = data.whatsapp.trim();
  const email = data.email.trim();
  let website = data.website.trim();
  if (phone) payload.phone = phone;
  if (whatsapp) payload.whatsapp = whatsapp;
  if (email) payload.email = email;
  if (website) {
    // API memakai z.string().url() → butuh protokol.
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(website)) website = `https://${website}`;
    payload.website = website;
  }
  return payload;
}

/** POST /api/businesses — daftarkan bisnis baru. */
export async function createBusiness(body: Record<string, unknown>): Promise<{ id: string; slug: string; status: string }> {
  const response = await fetch('/api/businesses', {
    method: 'POST',
    credentials: 'include',
    headers: await csrfHeaders(),
    body: JSON.stringify(body),
  });
  const payload = await readPayload(response);
  if (response.status === 403) csrfToken = null; // token basi → diambil ulang berikutnya
  if (!response.ok) throw new Error(apiErrorMessage(payload, 'Pendaftaran bisnis gagal. Silakan coba lagi.'));
  const data = extractData(payload) as { id?: unknown; slug?: unknown; status?: unknown } | null;
  return {
    id: typeof data?.id === 'string' ? data.id : '',
    slug: typeof data?.slug === 'string' ? data.slug : '',
    status: typeof data?.status === 'string' ? data.status : '',
  };
}

/** PATCH /api/businesses/[id] — ubah data bisnis milik sendiri. */
export async function updateBusiness(id: string, body: Record<string, unknown>): Promise<void> {
  const response = await fetch(`/api/businesses/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: await csrfHeaders(),
    body: JSON.stringify(body),
  });
  const payload = await readPayload(response);
  if (response.status === 403) csrfToken = null;
  if (!response.ok) throw new Error(apiErrorMessage(payload, 'Menyimpan perubahan gagal. Silakan coba lagi.'));
}

/** DELETE /api/businesses/[id] — hapus bisnis milik sendiri. */
export async function deleteBusiness(id: string): Promise<void> {
  const token = await getCsrfToken();
  const response = await fetch(`/api/businesses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'X-CSRF-Token': token },
  });
  const payload = await readPayload(response);
  if (response.status === 403) csrfToken = null;
  if (!response.ok) throw new Error(apiErrorMessage(payload, 'Menghapus bisnis gagal. Silakan coba lagi.'));
}

/** GET /api/businesses/[id]/inquiries — daftar pertanyaan masuk (pemilik/admin). */
export async function getBusinessInquiries(businessId: string): Promise<unknown[]> {
  const response = await fetch(`/api/businesses/${encodeURIComponent(businessId)}/inquiries`, {
    credentials: 'include',
    cache: 'no-store',
  });
  const payload = await readPayload(response);
  if (!response.ok) throw new Error(apiErrorMessage(payload, 'Gagal memuat pertanyaan masuk. Silakan coba lagi.'));
  const data = extractData(payload);
  return Array.isArray(data) ? data : [];
}

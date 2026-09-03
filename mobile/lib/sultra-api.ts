export type Listing = {
  id: number;
  title: string;
  description?: string;
  price?: number;
  district?: string;
  city?: string;
  image_url?: string | null;
  seller_name?: string;
  seller?: { name?: string };
};

export type ApiResult<T> = { data?: T; error?: string; offline?: boolean };

const API_BASE_URL = String(process.env.EXPO_PUBLIC_SULTRAKITA_API_URL || '').replace(/\/$/, '');

async function request<T>(path: string, options?: RequestInit): Promise<ApiResult<T>> {
  if (!API_BASE_URL) return { error: 'Belum tersambung ke ruang jual-beli SultraKita.', offline: true };
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(options?.headers || {}) },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return { error: payload?.message || 'Permintaan belum dapat diproses.' };
    return payload?.data !== undefined ? { data: payload.data } : { data: payload };
  } catch {
    return { error: 'Koneksi sedang beristirahat. Coba lagi sebentar.', offline: true };
  }
}

export async function searchListings(params: { q?: string; district?: string; category?: string }) {
  const query = new URLSearchParams({ q: params.q || '', district: params.district || '', category: params.category || '', page: '1', limit: '12' });
  return request<Listing[]>(`/api/v2/discovery/search?${query.toString()}`);
}

export async function getListing(id: number) {
  return request<Listing>(`/api/listings/${id}`);
}

export async function createListing(payload: { title: string; description: string; price: number; category_id: number; condition: 'new' | 'second'; district: string }) {
  return request<{ id: number }>('/api/listings', { method: 'POST', body: JSON.stringify(payload) });
}

export async function requestOtp(payload: { channel: 'email' | 'whatsapp'; email?: string; phone?: string }) {
  return request<{ destination: string; expires_in: number; delivered: boolean }>('/api/auth/request-otp', { method: 'POST', body: JSON.stringify(payload) });
}

export async function verifyOtp(payload: { channel: 'email' | 'whatsapp'; email?: string; phone?: string; code: string }) {
  return request<{ token: string; user: { id: number; name: string; email?: string; phone?: string } }>('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) });
}

export { API_BASE_URL };

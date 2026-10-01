import { apiErrorMessage } from './api-client';

/** Error API dengan kode mesin (mis. 'UNAUTHORIZED') agar UI bisa membedakan
 *  "belum login" dari kegagalan lain — perbaikan F7 (pesan login like). */
export class ApiRequestError extends Error {
  code?: string;
  status: number;
  constructor(message: string, opts: { code?: string; status: number }) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = opts.code;
    this.status = opts.status;
  }
}

let csrfToken: string | null = null;

async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  const response = await fetch('/api/csrf', { credentials: 'include', cache: 'no-store' });
  if (!response.ok) throw new Error('Token keamanan belum tersedia.');
  const payload = await response.json() as { csrfToken?: string };
  if (!payload.csrfToken) throw new Error('Token keamanan tidak valid.');
  csrfToken = payload.csrfToken;
  return csrfToken;
}

type Payload = Record<string, unknown> | null;

async function requestJson(url: string, init: RequestInit, fallback: string): Promise<Payload> {
  const response = await fetch(url, { credentials: 'include', ...init });
  if (response.status === 403) { csrfToken = null; } // token basi → ambil ulang berikutnya
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { error?: { code?: string } };
    throw new ApiRequestError(apiErrorMessage(payload, fallback), { code: payload?.error?.code, status: response.status });
  }
  return response.json().catch(() => null) as Promise<Payload>;
}

async function csrfHeaders(extra: Record<string, string> = {}): Promise<Record<string, string>> {
  const token = await getCsrfToken();
  return { 'X-CSRF-Token': token, ...extra };
}

function idempotencyKey(...parts: string[]) {
  return `${parts.join(':')}:${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now()}`;
}

/** Suka / batal suka — pola lama dipertahankan (kompatibel pemanggil existing). */
export async function setPostLike(postId: string, liked: boolean) {
  const headers = await csrfHeaders({ 'Content-Type': 'application/json' });
  return requestJson(
    liked ? '/api/interactions' : `/api/interactions?postId=${encodeURIComponent(postId)}`,
    liked
      ? { method: 'POST', headers, body: JSON.stringify({ action: 'like', postId, idempotencyKey: idempotencyKey(postId, 'like') }) }
      : { method: 'DELETE', headers },
    'Interaksi gagal.',
  ) as Promise<{ ok: boolean; liked: boolean }>;
}

/** Simpan / hapus simpanan postingan (server-side, tabel saved_posts). */
export async function setPostSave(postId: string, saved: boolean) {
  const headers = await csrfHeaders({ 'Content-Type': 'application/json' });
  return requestJson(
    saved ? '/api/saved' : `/api/saved?postId=${encodeURIComponent(postId)}`,
    saved
      ? { method: 'POST', headers, body: JSON.stringify({ postId, idempotencyKey: idempotencyKey(postId, 'save') }) }
      : { method: 'DELETE', headers },
    'Simpan gagal.',
  ) as Promise<{ ok: boolean; saved: boolean }>;
}

/** Ikuti / berhenti mengikuti pengguna. Idempoten di server. */
export async function toggleFollowUser(followingId: string, following: boolean) {
  const headers = await csrfHeaders({ 'Content-Type': 'application/json' });
  return requestJson(
    following ? '/api/follow' : `/api/follow?followingId=${encodeURIComponent(followingId)}`,
    following
      ? { method: 'POST', headers, body: JSON.stringify({ followingId, idempotencyKey: idempotencyKey(followingId, 'follow') }) }
      : { method: 'DELETE', headers },
    'Ikuti gagal.',
  ) as Promise<{ ok: boolean; following: boolean }>;
}

export type ApiComment = {
  id: string; post_id: string; user_id: string; content: string;
  parent_id: string | null; reply_to_name?: string | null; created_at: string;
  profiles?: { display_name?: string; username?: string; avatar_url?: string | null } | null;
};

/** Ambil halaman komentar sebuah postingan (terbaru dulu). */
export async function getComments(postId: string, cursor?: string | null, limit = 10) {
  const params = new URLSearchParams({ postId, limit: String(limit) });
  if (cursor) params.set('cursor', cursor);
  return requestJson(`/api/comments?${params}`, { headers: { Accept: 'application/json' } }, 'Komentar tidak dapat dimuat.') as Promise<{
    data: ApiComment[]; pageInfo: { endCursor: string | null; hasNextPage: boolean };
  }>;
}

/** Kirim komentar (atau balasan 1 level via parentId). Idempoten via kunci unik. */
export async function postComment(postId: string, content: string, parentId?: string | null) {
  const headers = await csrfHeaders({ 'Content-Type': 'application/json' });
  return requestJson('/api/comments', {
    method: 'POST',
    headers,
    body: JSON.stringify({ postId, content, parentId: parentId || null, idempotencyKey: idempotencyKey(postId, 'comment') }),
  }, 'Komentar gagal dikirim.') as Promise<{ ok: boolean; comment: ApiComment; deduped?: boolean }>;
}

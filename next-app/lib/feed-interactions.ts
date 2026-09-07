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

export async function setPostLike(postId: string, liked: boolean) {
  const token = await getCsrfToken();
  const response = liked
    ? await fetch('/api/interactions', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token }, body: JSON.stringify({ action: 'like', postId, idempotencyKey: `${postId}:like` }) })
    : await fetch(`/api/interactions?postId=${encodeURIComponent(postId)}`, { method: 'DELETE', credentials: 'include', headers: { 'X-CSRF-Token': token } });
  if (response.status === 403) { csrfToken = null; }
  if (!response.ok) { const payload = await response.json().catch(() => ({})) as { error?: string }; throw new Error(payload.error || 'Interaksi gagal.'); }
  return response.json() as Promise<{ ok: boolean; liked: boolean }>;
}

let csrfToken: string | null = null;

type InteractionResult = { ok: boolean; action: string; liked?: boolean; saved?: boolean; shared?: boolean; channel?: string; idempotencyKey?: string };

async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  const response = await fetch('/api/csrf', { credentials: 'include', cache: 'no-store' });
  if (!response.ok) throw new Error('Token keamanan belum tersedia.');
  const payload = await response.json() as { csrfToken?: string };
  if (!payload.csrfToken) throw new Error('Token keamanan tidak valid.');
  csrfToken = payload.csrfToken;
  return csrfToken;
}

async function interaction(body: Record<string, unknown>): Promise<InteractionResult> {
  const token = await getCsrfToken();
  const response = await fetch('/api/interactions', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token }, body: JSON.stringify(body) });
  if (response.status === 403) csrfToken = null;
  if (!response.ok) { const payload = await response.json().catch(() => ({})) as { error?: string }; throw new Error(payload.error || 'Interaksi gagal.'); }
  return response.json() as Promise<InteractionResult>;
}

export function setPostLike(postId: string, liked: boolean) {
  return liked ? interaction({ action: 'like', postId, idempotencyKey: `${postId}:like` }) : removePostInteraction(postId, 'like');
}

export function setPostSaved(postId: string, saved: boolean) {
  return saved ? interaction({ action: 'save', postId, idempotencyKey: `${postId}:save` }) : removePostInteraction(postId, 'save');
}

export function recordPostShare(postId: string, channel: 'native' | 'clipboard' | 'whatsapp', idempotencyKey = `${postId}:share:${channel}`) {
  return interaction({ action: 'share', postId, channel, idempotencyKey });
}

export async function createPostComment(postId: string, content: string, idempotencyKey = `${postId}:comment:${content.trim()}`) {
  const token = await getCsrfToken();
  const response = await fetch('/api/comments', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token }, body: JSON.stringify({ postId, content, idempotencyKey }) });
  if (response.status === 403) csrfToken = null;
  if (!response.ok) { const payload = await response.json().catch(() => ({})) as { error?: string }; throw new Error(payload.error || 'Komentar gagal.'); }
  return response.json() as Promise<{ ok: boolean; data: unknown; idempotencyKey: string }>;
}

async function removePostInteraction(postId: string, action: 'like' | 'save') {
  const token = await getCsrfToken();
  const response = await fetch(`/api/interactions?postId=${encodeURIComponent(postId)}&action=${action}`, { method: 'DELETE', credentials: 'include', headers: { 'X-CSRF-Token': token } });
  if (response.status === 403) csrfToken = null;
  if (!response.ok) { const payload = await response.json().catch(() => ({})) as { error?: string }; throw new Error(payload.error || 'Interaksi gagal.'); }
  return response.json() as Promise<InteractionResult>;
}

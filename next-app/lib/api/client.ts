export type ApiEnvelope<T> = {
  ok?: boolean;
  data?: T;
  error?: string;
  message?: string;
};

function apiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  return `${base.replace(/\/$/, '')}${path}`;
}

export async function postToApi<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null) as ApiEnvelope<TResponse> | null;
  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.error || payload?.message || `API request failed (${response.status})`);
  }
  return (payload?.data ?? payload) as TResponse;
}

export { apiUrl };

// Keep this helper server-origin agnostic: in production it points at the
// Express deployment, while local development can use a relative /api path.
// Authentication cookies are forwarded explicitly for same-origin or CORS-safe
// deployments.

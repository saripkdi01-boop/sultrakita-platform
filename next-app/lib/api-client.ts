// Helper client-side untuk membaca pesan error API (Fase 1.4).
// Mendukung format baru { error: { code, message, requestId } }
// maupun format lama { error: 'string' } / { warning: '...' }.

export function apiErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;
  const record = payload as Record<string, unknown>;
  const error = record.error;
  if (typeof error === 'string' && error) return error;
  if (error && typeof error === 'object') {
    const message = (error as Record<string, unknown>).message;
    if (typeof message === 'string' && message) return message;
  }
  if (typeof record.warning === 'string' && record.warning) return record.warning;
  return fallback;
}

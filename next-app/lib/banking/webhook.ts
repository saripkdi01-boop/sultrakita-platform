/**
 * Verifikasi signature webhook perbankan (HMAC-SHA256, fail-closed).
 * Dipisah dari route handler karena Next.js hanya mengizinkan export
 * HTTP method handlers dari file route.ts.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export interface BankingWebhookPayload {
  event_id: string;
  event_type: 'kpr.status_changed' | 'identity.verified' | string;
  application_id?: string;
  status?: string;
  timestamp?: string;
}

/**
 * Verifikasi HMAC-SHA256 dari raw body — fail closed.
 * Format header: `x-banking-signature: sha256=<hex digest>`.
 */
export function verifyBankingSignature(
  rawBody: string,
  header: string | null,
  secret: string,
): boolean {
  if (!header || !secret) return false;
  const prefix = 'sha256=';
  if (!header.startsWith(prefix)) return false;
  const provided = header.slice(prefix.length);
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(provided, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

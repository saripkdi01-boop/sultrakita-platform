import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { logError } from '@/lib/log-error';

/**
 * T5(c): endpoint penerima laporan error dari client error boundaries
 * (app/error.tsx, app/global-error.tsx).
 *
 * - Rate-limited (preset 'api') agar tidak bisa dipakai membanjiri log.
 * - Payload divalidasi zod + dipotong ketat; TIDAK menyimpan PII.
 * - Hanya mencatat ke log server via logError() — tidak menulis ke DB,
 *   tidak mengembalikan detail apa pun ke client.
 */
export const dynamic = 'force-dynamic';

const reportSchema = z.object({
  digest: z.string().max(128).nullish(),
  message: z.string().max(500).nullish(),
  path: z.string().max(200).nullish(),
});

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;

  const raw = await request.json().catch(() => ({}));
  const parsed = reportSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }

  const { digest, message, path } = parsed.data;
  const synthetic = new Error(
    `client-boundary digest=${digest ?? '-'} path=${path ?? '-'}${message ? `: ${message}` : ''}`,
  );
  synthetic.name = 'ClientErrorBoundary';
  logError(
    {
      route: '/api/log-error',
      requestId: request.headers.get('x-request-id')?.slice(0, 64) ?? undefined,
      extra: { client_path: path ?? null, digest: digest ?? null },
    },
    synthetic,
  );

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}

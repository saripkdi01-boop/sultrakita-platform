/**
 * Helper validasi input API yang konsisten (P1-4).
 *
 * `parseOr400(schema, data)` menjalankan `schema.safeParse(data)` dan
 * mengembalikan hasil ter-union:
 * - `{ ok: true, data }` bila valid,
 * - `{ ok: false, response }` — `NextResponse` 400 dengan pesan Bahasa
 *   Indonesia — bila tidak valid. Langsung `return parsed.response;`.
 */

import { NextResponse } from 'next/server';
import type { z, ZodSchema } from 'zod';

export interface ValidationIssue {
  field: string;
  message: string;
}

export type ParseResult<S extends ZodSchema> =
  | { ok: true; data: z.infer<S> }
  | { ok: false; response: NextResponse };

export function parseOr400<S extends ZodSchema>(schema: S, data: unknown): ParseResult<S> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { ok: true, data: result.data };
  }

  const errors: ValidationIssue[] = result.error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join('.') : '(data)',
    message: issue.message,
  }));
  const first = errors[0];
  const message = first
    ? `Data tidak valid pada "${first.field}": ${first.message}`
    : 'Data yang dikirim tidak valid. Periksa kembali isian Anda.';

  return {
    ok: false,
    response: NextResponse.json({ error: message, errors }, { status: 400 }),
  };
}

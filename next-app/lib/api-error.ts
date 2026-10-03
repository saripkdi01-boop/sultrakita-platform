import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { logError } from '@/lib/log-error';

// Fase 1.4: format error API yang konsisten:
//   { error: { code, message (Bahasa Indonesia, aman), requestId } }
// Pesan tidak boleh membocorkan detail internal (stack, query SQL, dsb.).

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'CSRF_FAILED'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_ERROR';

export function getRequestId(request: NextRequest): string {
  return request.headers.get('x-request-id')?.slice(0, 64) || randomUUID();
}

export function apiError(code: ApiErrorCode, message: string, status: number, request: NextRequest, extra?: Record<string, unknown>) {
  const requestId = getRequestId(request);
  return NextResponse.json(
    { error: { code, message, requestId, ...(extra || {}) } },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}

export function badRequest(request: NextRequest, message = 'Permintaan tidak valid.') {
  return apiError('BAD_REQUEST', message, 400, request);
}

export function unauthorized(request: NextRequest, message = 'Sesi login diperlukan.') {
  return apiError('UNAUTHORIZED', message, 401, request);
}

export function forbidden(request: NextRequest, message = 'Akses ditolak.') {
  return apiError('FORBIDDEN', message, 403, request);
}

export function notFound(request: NextRequest, message = 'Data tidak ditemukan.') {
  return apiError('NOT_FOUND', message, 404, request);
}

export function serviceUnavailable(request: NextRequest, message = 'Layanan sementara belum tersedia. Silakan coba lagi nanti.') {
  return apiError('SERVICE_UNAVAILABLE', message, 503, request);
}

export function internalError(request: NextRequest, message = 'Terjadi kesalahan. Silakan coba lagi nanti.', cause?: unknown) {
  // Sentralisasi error tracking (T5c): catat penyebab ke log server bila tersedia.
  // Respons ke client tetap generik — tidak membocorkan detail internal.
  if (cause !== undefined) {
    logError({ route: request.nextUrl.pathname, requestId: getRequestId(request) }, cause);
  }
  return apiError('INTERNAL_ERROR', message, 500, request);
}

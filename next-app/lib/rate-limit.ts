import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Fase 1.5: rate limiting untuk API routes publik.
// - Bila UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN diset: memakai Upstash
//   (sinkron antar instance/serverless).
// - Bila belum: fallback memori per-instance + peringatan sekali (lihat lib/env.ts).
//   Proteksi dasar tetap jalan; sinkronisasi lintas instance butuh Upstash.

export type RateLimitPreset = 'api' | 'auth' | 'upload';

const PRESETS: Record<RateLimitPreset, { limit: number; windowMs: number; label: string }> = {
  api: { limit: 60, windowMs: 60_000, label: '60x/menit' }, // API umum per user/IP
  auth: { limit: 5, windowMs: 15 * 60_000, label: '5x/15 menit' }, // endpoint auth per IP
  upload: { limit: 10, windowMs: 60 * 60_000, label: '10x/jam' }, // upload/AI per user
};

function windowToUpstash(windowMs: number): `${number} ${'s' | 'm' | 'h'}` {
  if (windowMs % 3_600_000 === 0) return `${windowMs / 3_600_000} h`;
  if (windowMs % 60_000 === 0) return `${windowMs / 60_000} m`;
  return `${Math.max(1, Math.round(windowMs / 1000))} s`;
}

let upstashLimiters: Record<RateLimitPreset, Ratelimit> | null = null;
let upstashAvailable: boolean | null = null;
let fallbackWarned = false;

function getUpstashLimiters(): Record<RateLimitPreset, Ratelimit> | null {
  if (upstashAvailable !== null) return upstashLimiters;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    upstashAvailable = false;
    return null;
  }
  try {
    const redis = new Redis({ url, token });
    upstashLimiters = {
      api: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(PRESETS.api.limit, windowToUpstash(PRESETS.api.windowMs)), prefix: 'suki:rl:api' }),
      auth: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(PRESETS.auth.limit, windowToUpstash(PRESETS.auth.windowMs)), prefix: 'suki:rl:auth' }),
      upload: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(PRESETS.upload.limit, windowToUpstash(PRESETS.upload.windowMs)), prefix: 'suki:rl:upload' }),
    };
    upstashAvailable = true;
  } catch {
    upstashAvailable = false;
  }
  return upstashLimiters;
}

// Fallback memori per-instance (sliding window sederhana).
const memoryBuckets = new Map<string, number[]>();

function memoryCheck(key: string, limit: number, windowMs: number): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (memoryBuckets.get(key) || []).filter((t) => t > now - windowMs);
  if (hits.length >= limit) {
    const retryAfter = Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000));
    memoryBuckets.set(key, hits);
    return { limited: true, retryAfter };
  }
  hits.push(now);
  memoryBuckets.set(key, hits);
  if (memoryBuckets.size > 20000) {
    const oldest = Array.from(memoryBuckets.keys()).slice(0, 5000);
    for (const k of oldest) memoryBuckets.delete(k);
  }
  return { limited: false, retryAfter: 0 };
}

export function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || 'unknown';
}

function tooMany(request: NextRequest, retryAfter: number, preset: RateLimitPreset) {
  const requestId = request.headers.get('x-request-id') || undefined;
  return NextResponse.json(
    { error: { code: 'RATE_LIMITED', message: `Terlalu banyak permintaan (${PRESETS[preset].label}). Coba lagi dalam ${retryAfter} detik.`, requestId } },
    { status: 429, headers: { 'Retry-After': String(retryAfter), 'Cache-Control': 'no-store' } },
  );
}

/**
 * Periksa rate limit. Kembalikan `null` bila lolos, atau NextResponse 429
 * (dengan header Retry-After) bila dibatasi.
 *
 * @param request NextRequest aktif
 * @param preset 'api' | 'auth' | 'upload'
 * @param key identitas pembatas — user id bila sudah login, jika tidak IP.
 *   Panggil dengan `dibatasi(request, 'api', user?.id || clientIp(request))`.
 */
export async function checkRateLimit(request: NextRequest, preset: RateLimitPreset, key?: string): Promise<NextResponse | null> {
  const bucketKey = `${preset}:${key || clientIp(request)}`;
  const { limit, windowMs } = PRESETS[preset];
  const limiters = getUpstashLimiters();
  if (limiters) {
    try {
      const { success, reset } = await limiters[preset].limit(bucketKey);
      if (!success) {
        const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
        return tooMany(request, retryAfter, preset);
      }
      return null;
    } catch {
      // Redis bermasalah: jangan matikan API, lanjut ke fallback memori.
    }
  }
  if (!fallbackWarned) {
    fallbackWarned = true;
    console.warn('[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN belum diset — memakai pembatas memori per-instance.');
  }
  const { limited, retryAfter } = memoryCheck(bucketKey, limit, windowMs);
  return limited ? tooMany(request, retryAfter, preset) : null;
}

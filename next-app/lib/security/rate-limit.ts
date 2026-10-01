/**
 * Rate limiter token-bucket in-memory — tanpa dependensi eksternal.
 *
 * Dipakai untuk perlindungan ringan anti brute-force / spam / abuse di
 * middleware (path /api/*) dan di route handler API yang mahal
 * (auth, kontak, upload, pencarian).
 *
 * Catatan desain:
 * - State disimpan di memori proses (Map). Di deployment multi-instance /
 *   serverless, batas ini bersifat best-effort per instance — cukup untuk
 *   mitigasi ringan, bukan penegakan kuota global yang presisi.
 * - Aman dipakai di Edge Runtime (tidak memakai API Node.js).
 * - Kunci (key) idealnya gabungan identitas + aksi, mis. `login:1.2.3.4`
 *   atau `api:1.2.3.4`. Jangan memakai data pribadi mentah sebagai key
 *   bila tidak perlu.
 */

export interface RateLimitOptions {
  /** Jumlah request maksimum yang diizinkan dalam satu window. */
  limit: number;
  /** Panjang window dalam milidetik. */
  windowMs: number;
}

export interface RateLimitResult {
  /** true bila request diizinkan (satu token dikonsumsi). */
  allowed: boolean;
  /** Sisa token setelah request ini (0 bila ditolak). */
  remaining: number;
  /**
   * Estimasi milidetik hingga request berikutnya kemungkinan diizinkan.
   * Bila `allowed` = false, ini dasar penghitungan header `Retry-After`.
   * Bila `allowed` = true, ini estimasi hingga bucket penuh kembali.
   */
  resetMs: number;
}

/**
 * Preset batas yang disepakati untuk SukiApps.
 * - auth: login/signup/OTP — 5/menit (anti brute-force).
 * - contact: formulir kontak & pelaporan — 10/menit (anti spam).
 * - upload: unggah berkas — 20/menit.
 * - general: pencarian & endpoint umum — 60/menit.
 */
export const RATE_LIMIT_PRESETS = {
  auth: { limit: 5, windowMs: 60_000 },
  contact: { limit: 10, windowMs: 60_000 },
  upload: { limit: 20, windowMs: 60_000 },
  general: { limit: 60, windowMs: 60_000 },
} as const;

interface Bucket {
  tokens: number;
  updatedAt: number;
  limit: number;
  windowMs: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;
const CLEANUP_EVERY_OPS = 500;
let opsSinceCleanup = 0;

function prune(now: number): void {
  // Hapus bucket yang sudah basi.
  buckets.forEach((bucket, key) => {
    if (now - bucket.updatedAt > bucket.windowMs * 2) buckets.delete(key);
  });
  // Bila masih melebihi batas, pangkas dari yang paling lama
  // (forEach Map berjalan sesuai urutan insersi).
  if (buckets.size > MAX_BUCKETS) {
    let excess = buckets.size - MAX_BUCKETS;
    buckets.forEach((_bucket, key) => {
      if (excess <= 0) return;
      buckets.delete(key);
      excess -= 1;
    });
  }
}

/**
 * Cek & konsumsi satu token untuk `key`.
 * Contoh: `checkRateLimit(`login:${ip}`, RATE_LIMIT_PRESETS.auth)`.
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const safeKey = key || 'global';
  const limit = Math.max(1, Math.floor(options.limit));
  const windowMs = Math.max(1, options.windowMs);
  const now = Date.now();

  opsSinceCleanup += 1;
  if (opsSinceCleanup >= CLEANUP_EVERY_OPS || buckets.size > MAX_BUCKETS) {
    opsSinceCleanup = 0;
    prune(now);
  }

  let bucket = buckets.get(safeKey);
  if (!bucket || bucket.limit !== limit || bucket.windowMs !== windowMs) {
    bucket = { tokens: limit, updatedAt: now, limit, windowMs };
    buckets.set(safeKey, bucket);
  } else {
    const elapsed = Math.max(0, now - bucket.updatedAt);
    bucket.tokens = Math.min(limit, bucket.tokens + (elapsed * limit) / windowMs);
    bucket.updatedAt = now;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    const remaining = Math.floor(bucket.tokens);
    const resetMs = Math.max(0, Math.ceil(((limit - bucket.tokens) * windowMs) / limit));
    return { allowed: true, remaining, resetMs };
  }

  const resetMs = Math.max(1, Math.ceil(((1 - bucket.tokens) * windowMs) / limit));
  return { allowed: false, remaining: 0, resetMs };
}

/** Ambil IP klien dari header (konvensi yang dipakai route API lain). */
export function getClientIp(request: { headers: Headers }): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Header standar `X-RateLimit-*` untuk respons API. */
export function rateLimitHeaders(result: RateLimitResult, options: RateLimitOptions): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(Math.max(1, Math.floor(options.limit))),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.max(1, Math.ceil(result.resetMs / 1000))),
  };
}

/** Nilai detik untuk header `Retry-After` saat 429. */
export function retryAfterSeconds(result: RateLimitResult): string {
  return String(Math.max(1, Math.ceil(result.resetMs / 1000)));
}

/**
 * Kosongkan seluruh state bucket. Untuk pengujian dan keperluan admin;
 * jangan dipakai di jalur request normal.
 */
export function clearRateLimitStore(): void {
  buckets.clear();
  opsSinceCleanup = 0;
}

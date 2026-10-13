import { NextResponse } from 'next/server';
import { createVerify } from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const META_API = 'https://api.meta.ai/v1/chat/completions';
const ALLOWED_MODELS = ['muse-spark-1.3', 'muse-spark-1.3-contributor'];
const MAX_MESSAGES = 50;
const MAX_CHARS_PER_MESSAGE = 8000;
const DAILY_LIMIT = 200;

const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

function getAllowedEmails(): string[] {
  return (process.env.MUSE_ALLOWED_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

// ---- Rate limit sederhana per email per hari (in-memory, cukup untuk pemakaian pribadi) ----
const rl = new Map<string, { count: number; day: string }>();
function rateLimitOk(email: string): boolean {
  const day = new Date().toISOString().slice(0, 10);
  const cur = rl.get(email);
  if (!cur || cur.day !== day) {
    rl.set(email, { count: 1, day });
    return true;
  }
  if (cur.count >= DAILY_LIMIT) return false;
  cur.count += 1;
  return true;
}

// ---- Validasi Google ID token (RS256) terhadap GOOGLE_WEB_CLIENT_ID ----
let certsCache: { keys: Array<{ kid: string; n: string; e: string }>; exp: number } | null = null;

async function getGoogleCerts() {
  const now = Date.now();
  if (certsCache && certsCache.exp > now) return certsCache.keys;
  const res = await fetch(GOOGLE_CERTS_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('cert fetch failed');
  const j = (await res.json()) as { keys: Array<{ kid: string; n: string; e: string }> };
  certsCache = { keys: j.keys, exp: now + 3600_000 };
  return j.keys;
}

function b64urlToBuffer(s: string): Buffer {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(b64, 'base64');
}

/** Kembalikan email terverifikasi dari ID token, atau null bila tidak valid. */
async function verifyGoogleIdToken(idToken: string): Promise<string | null> {
  const audience = process.env.GOOGLE_WEB_CLIENT_ID || '';
  if (!audience || !idToken) return null;
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) return null;
    const header = JSON.parse(b64urlToBuffer(parts[0]).toString('utf8')) as { alg?: string; kid?: string };
    const payload = JSON.parse(b64urlToBuffer(parts[1]).toString('utf8')) as {
      iss?: string; aud?: string; exp?: number; email?: string; email_verified?: boolean;
    };
    if (header.alg !== 'RS256' || !header.kid) return null;
    if (payload.aud !== audience) return null;
    if (payload.iss !== 'https://accounts.google.com' && payload.iss !== 'accounts.google.com') return null;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    if (!payload.email) return null;

    const keys = await getGoogleCerts();
    const key = keys.find((k) => k.kid === header.kid);
    if (!key) return null;
    const pubKey = createVerify('RSA-SHA256');
    pubKey.update(`${parts[0]}.${parts[1]}`);
    // Bangun public key dari komponen JWK (n, e).
    const jwk = { kty: 'RSA', n: key.n, e: key.e };
    const ok = pubKey.verify(
      (await import('crypto')).createPublicKey({ key: jwk, format: 'jwk' }),
      b64urlToBuffer(parts[2]),
    );
    if (!ok) return null;
    return payload.email.toLowerCase();
  } catch {
    return null;
  }
}

export async function GET() {
  const apiKey = process.env.MUSE_API_KEY || '';
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'Server belum dikonfigurasi.' }, { status: 503 });
  }
  return NextResponse.json({
    ok: true,
    models: ALLOWED_MODELS,
    auth: process.env.GOOGLE_WEB_CLIENT_ID ? 'google-id-token+allowlist' : 'allowlist',
    daily_limit: DAILY_LIMIT,
  });
}

export async function POST(req: Request) {
  const apiKey = process.env.MUSE_API_KEY || '';
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'Server belum dikonfigurasi (MUSE_API_KEY kosong).' },
      { status: 503 },
    );
  }

  let body: { email?: string; id_token?: string; messages?: ChatMessage[]; model?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid.' }, { status: 400 });
  }

  // Email terverifikasi via ID token bila disediakan; fallback ke email klaim + allowlist.
  let email = (body.email || '').trim().toLowerCase();
  let verified = false;
  if (body.id_token) {
    const vEmail = await verifyGoogleIdToken(body.id_token);
    if (vEmail) {
      email = vEmail;
      verified = true;
    }
  }

  const allowed = getAllowedEmails();
  if (!email || (allowed.length > 0 && !allowed.includes(email))) {
    return NextResponse.json({ ok: false, error: 'Email tidak diizinkan.' }, { status: 403 });
  }

  if (!rateLimitOk(email)) {
    return NextResponse.json(
      { ok: false, error: 'Batas harian tercapai. Coba lagi besok.' },
      { status: 429 },
    );
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0 || messages.length > MAX_MESSAGES) {
    return NextResponse.json({ ok: false, error: 'Jumlah pesan tidak valid.' }, { status: 400 });
  }
  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant' && m.role !== 'system')) {
      return NextResponse.json({ ok: false, error: 'Format pesan tidak valid.' }, { status: 400 });
    }
    if (typeof m.content !== 'string' || m.content.length === 0 || m.content.length > MAX_CHARS_PER_MESSAGE) {
      return NextResponse.json({ ok: false, error: 'Panjang pesan tidak valid.' }, { status: 400 });
    }
  }

  const model = ALLOWED_MODELS.includes(body.model || '') ? body.model! : 'muse-spark-1.3';

  let upstream: Response;
  try {
    upstream = await fetch(META_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, stream: true }),
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Gagal menghubungi layanan AI.' }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    const status = upstream.status === 401 ? 502 : upstream.status;
    return NextResponse.json(
      { ok: false, error: 'Layanan AI menolak permintaan.', detail: detail.slice(0, 200) },
      { status },
    );
  }

  // Teruskan stream SSE apa adanya ke aplikasi.
  const headers = new Headers({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  if (verified) headers.set('X-Auth-Verified', 'google');
  return new Response(upstream.body, { status: 200, headers });
}

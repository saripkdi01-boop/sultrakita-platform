import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const META_API = 'https://api.meta.ai/v1/chat/completions';
const ALLOWED_MODELS = ['muse-spark-1.3', 'muse-spark-1.3-contributor'];
const MAX_MESSAGES = 50;
const MAX_CHARS_PER_MESSAGE = 8000;

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

function getAllowedEmails(): string[] {
  return (process.env.MUSE_ALLOWED_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET() {
  const apiKey = process.env.MUSE_API_KEY || '';
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'Server belum dikonfigurasi.' }, { status: 503 });
  }
  return NextResponse.json({ ok: true, models: ALLOWED_MODELS });
}

export async function POST(req: Request) {
  const apiKey = process.env.MUSE_API_KEY || '';
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'Server belum dikonfigurasi (MUSE_API_KEY kosong).' },
      { status: 503 },
    );
  }

  let body: { email?: string; messages?: ChatMessage[]; model?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid.' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  const allowed = getAllowedEmails();
  if (!email || (allowed.length > 0 && !allowed.includes(email))) {
    return NextResponse.json({ ok: false, error: 'Email tidak diizinkan.' }, { status: 403 });
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
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

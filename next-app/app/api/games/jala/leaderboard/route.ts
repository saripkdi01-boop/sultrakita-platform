/**
 * GET /api/games/jala/leaderboard?limit=10
 *
 * Leaderboard JALA lintas platform (web + Telegram), diurut total_kg.
 * Publik dengan rate limit.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('JALA belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET(request: NextRequest) {
  const rl = checkRateLimit('jala-leaderboard', { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: 'Terlalu banyak permintaan.' },
      { status: 429 });
  }

  const limit = Math.min(
    Math.max(parseInt(request.nextUrl.searchParams.get('limit') || '10', 10) || 10, 1), 50);

  let admin;
  try { admin = serviceClient(); }
  catch {
    return NextResponse.json({ ok: false, error: 'JALA belum dikonfigurasi.' },
      { status: 503 });
  }

  const { data, error } = await admin
    .from('jala_players')
    .select('username, platform, total_catch, total_kg, legendary')
    .order('total_kg', { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ ok: false, error: 'Gagal mengambil leaderboard.' },
      { status: 500 });
  }
  return NextResponse.json({ ok: true, data });
}

/**
 * GET /api/games/jala/player?key=<player_key>
 * POST /api/games/jala/player { player_key, username?, platform? }
 *
 * Mengambil atau membuat profil pemain JALA. Sinkron web <-> Telegram
 * via player_key ('tg:<id>' atau 'web:<uuid>').
 *
 * GET: publik dengan rate limit (data non-sensitif untuk leaderboard/profil).
 * POST: butuh x-bot-secret (bot) atau sesi Supabase (web).
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { getServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('JALA belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

const KeySchema = z.object({
  key: z.string().min(1).max(80).regex(/^(tg|web):[A-Za-z0-9_-]+$/,
    'Format key: tg:<id> atau web:<uuid>'),
});

const UpsertSchema = z.object({
  player_key: z.string().min(1).max(80).regex(/^(tg|web):[A-Za-z0-9_-]+$/),
  username: z.string().max(64).optional(),
  platform: z.enum(['web', 'telegram']).optional(),
});

function ok(data: unknown, status = 200) { return NextResponse.json({ ok: true, data }, { status }); }
function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

async function authorized(request: NextRequest): Promise<boolean> {
  // Bot: shared secret
  const secret = process.env.SUKI_BOT_API_SECRET;
  if (secret && request.headers.get('x-bot-secret') === secret) return true;
  // Web: sesi Supabase valid
  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const q = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = KeySchema.safeParse(q);
  if (!parsed.success) return bad('player key tidak valid.', 422);

  const rl = checkRateLimit(`jala-player:${parsed.data.key}`, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return bad('Terlalu banyak permintaan.', 429);

  let admin;
  try { admin = serviceClient(); } catch { return bad('JALA belum dikonfigurasi.', 503); }

  const { data: player } = await admin
    .from('jala_players')
    .select('player_key, username, coins, total_catch, total_kg, legendary')
    .eq('player_key', parsed.data.key)
    .maybeSingle();

  if (!player) return ok({ exists: false, player_key: parsed.data.key });

  // Ambil 5 tangkapan terakhir
  const { data: catches } = await admin
    .from('jala_catches')
    .select('fish_name, rarity, kg, coins, spot, caught_at')
    .eq('player_id', (await admin.from('jala_players').select('id')
      .eq('player_key', parsed.data.key).single()).data?.id)
    .order('caught_at', { ascending: false })
    .limit(5);

  return ok({ exists: true, player, recent_catches: catches || [] });
}

export async function POST(request: NextRequest) {
  if (!(await authorized(request))) return bad('Akses ditolak.', 401);

  let body: unknown;
  try { body = await request.json(); } catch { return bad('Body JSON tidak valid.'); }
  const parsed = UpsertSchema.safeParse(body);
  if (!parsed.success) return bad('Input tidak valid.', 422);

  const { player_key, username, platform } = parsed.data;
  const plat = platform || (player_key.startsWith('tg:') ? 'telegram' : 'web');

  let admin;
  try { admin = serviceClient(); } catch { return bad('JALA belum dikonfigurasi.', 503); }

  // Insert jika belum ada; jika sudah ada, hanya update username/platform
  // (jangan sentuh coins/statistik).
  const { data: existing } = await admin
    .from('jala_players')
    .select('id')
    .eq('player_key', player_key)
    .maybeSingle();

  if (!existing) {
    const { data, error } = await admin
      .from('jala_players')
      .insert({ player_key, platform: plat, username: username || null })
      .select('player_key, username, coins, total_catch, total_kg, legendary')
      .single();
    if (error) return bad('Gagal menyimpan pemain.', 500);
    return ok({ player: data, created: true }, 201);
  }

  const { data, error } = await admin
    .from('jala_players')
    .update({ username: username || undefined, platform: plat,
      updated_at: new Date().toISOString() })
    .eq('player_key', player_key)
    .select('player_key, username, coins, total_catch, total_kg, legendary')
    .single();
  if (error) return bad('Gagal menyimpan pemain.', 500);
  return ok({ player: data, created: false });
}

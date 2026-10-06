/**
 * POST /api/games/jala/catch — Catat tangkapan ikan JALA.
 *
 * Auth: x-bot-secret (bot Telegram) atau sesi Supabase (web).
 * Body: { player_key, fish_id, fish_name, rarity, kg, coins, spot }
 *
 * Update atomik: insert catch + tambah statistik pemain.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { getServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const CatchSchema = z.object({
  player_key: z.string().min(1).max(80).regex(/^(tg|web):[A-Za-z0-9_-]+$/),
  fish_id: z.string().min(1).max(32),
  fish_name: z.string().min(1).max(80),
  rarity: z.string().min(1).max(16),
  kg: z.number().positive().max(1000),
  coins: z.number().int().min(0).max(100000),
  spot: z.string().min(1).max(32),
  username: z.string().max(64).optional(),
});

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('JALA belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function ok(data: unknown, status = 200) { return NextResponse.json({ ok: true, data }, { status }); }
function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

async function authorized(request: NextRequest): Promise<boolean> {
  const secret = process.env.SUKI_BOT_API_SECRET;
  if (secret && request.headers.get('x-bot-secret') === secret) return true;
  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!(await authorized(request))) return bad('Akses ditolak.', 401);

  let body: unknown;
  try { body = await request.json(); } catch { return bad('Body JSON tidak valid.'); }
  const parsed = CatchSchema.safeParse(body);
  if (!parsed.success) return bad('Input tidak valid.', 422);
  const c = parsed.data;

  const rl = checkRateLimit(`jala-catch:${c.player_key}`, { limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return bad('Terlalu banyak tangkapan. Slow down!', 429);

  let admin;
  try { admin = serviceClient(); } catch { return bad('JALA belum dikonfigurasi.', 503); }

  // Pastikan pemain ada
  let { data: player } = await admin
    .from('jala_players')
    .select('id, coins, total_catch, total_kg, legendary')
    .eq('player_key', c.player_key)
    .maybeSingle();

  if (!player) {
    const plat = c.player_key.startsWith('tg:') ? 'telegram' : 'web';
    const { data: created, error: ce } = await admin
      .from('jala_players')
      .insert({ player_key: c.player_key, platform: plat,
        username: c.username || null })
      .select('id, coins, total_catch, total_kg, legendary')
      .single();
    if (ce || !created) return bad('Gagal membuat pemain.', 500);
    player = created;
  }

  // Insert tangkapan
  const { error: ie } = await admin.from('jala_catches').insert({
    player_id: player.id,
    fish_id: c.fish_id,
    fish_name: c.fish_name,
    rarity: c.rarity,
    kg: c.kg,
    coins: c.coins,
    spot: c.spot,
  });
  if (ie) return bad('Gagal mencatat tangkapan.', 500);

  // Update statistik atomik
  const isLegend = c.rarity === 'legendaris' || c.rarity === 'legenda' ? 1 : 0;
  const { data: updated, error: ue } = await admin
    .from('jala_players')
    .update({
      coins: (player.coins as number) + c.coins,
      total_catch: (player.total_catch as number) + 1,
      total_kg: Number(player.total_kg) + c.kg,
      legendary: (player.legendary as number) + isLegend,
      updated_at: new Date().toISOString(),
    })
    .eq('id', player.id)
    .select('coins, total_catch, total_kg, legendary')
    .single();
  if (ue) return bad('Gagal update statistik.', 500);

  return ok({ catch: { fish: c.fish_name, kg: c.kg, coins: c.coins },
    player: updated }, 201);
}

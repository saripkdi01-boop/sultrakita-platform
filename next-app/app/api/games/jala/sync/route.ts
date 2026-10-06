/**
 * POST /api/games/jala/sync — Sinkronisasi progres game web JALA (anonim).
 *
 * Untuk game web di /games/jala yang berjalan tanpa login. Identitas pemain
 * adalah kunci perangkat acak `web:<uuid>` yang dibuat sekali di browser
 * dan disimpan di localStorage.
 *
 * Body: { player_key, username?, catches?: [{fish_id, fish_name, rarity,
 *   kg, coins, spot, caught_at?}] }
 *
 * Keamanan (tanpa sesi login, jadi pertahanan berlapis):
 * - Hanya menerima key `web:*` (key `tg:*` ditolak — itu jalur bot).
 * - Validasi Zod strict: enum ikan/rarity/spot dari server, batas angka.
 * - Rate limit ganda: per player_key (30/menit) + per IP (60/menit).
 * - Hanya insert tangkapan baru + upsert profil milik key sendiri;
 *   tidak ada endpoint untuk mengubah/menghapus data pemain lain.
 * - Coins server dihitung ulang dari berat × harga dasar server
 *   (nilai dari klien diabaikan) agar tidak bisa dikarang.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

// Harga dasar server (Rp/kg) — cermin data game, dipakai untuk hitung
// ulang coins agar klien tidak bisa mengarang nilai.
const BASE_PRICE: Record<string, number> = {
  layang: 20000,
  baronang: 35000,
  cakalang: 25000,
  kakap: 55000,
  kerapu: 60000,
  tenggiri: 50000,
  kuwe: 40000,
  tuna: 45000,
  lobster: 250000,
  legenda: 60000,
};
const FISH_IDS = Object.keys(BASE_PRICE);
const RARITIES = ['umum', 'sedang', 'langka', 'legenda'] as const;
const SPOTS = ['teluk', 'bokori', 'wakatobi'] as const;

const CatchItemSchema = z.object({
  fish_id: z.enum(FISH_IDS as [string, ...string[]]),
  fish_name: z.string().min(1).max(80),
  rarity: z.enum(RARITIES),
  kg: z.number().positive().max(200),
  // coins dari klien DIABAIKAN — server hitung ulang.
  coins: z.number().int().min(0).max(100000000).optional(),
  spot: z.enum(SPOTS),
  caught_at: z.string().datetime({ offset: true }).optional(),
});

const SyncSchema = z.object({
  player_key: z.string().min(1).max(80).regex(/^web:[A-Za-z0-9_-]+$/,
    'Format key: web:<uuid>'),
  username: z.string().trim().min(1).max(24).optional(),
  catches: z.array(CatchItemSchema).max(20).optional().default([]),
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

/** Coins = berat × harga dasar ÷ 1000, dibulatkan. Konsisten dengan Mini App. */
function serverCoins(fishId: string, kg: number): number {
  return Math.max(1, Math.round(((BASE_PRICE[fishId] || 20000) * kg) / 1000));
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return bad('Body JSON tidak valid.'); }
  const parsed = SyncSchema.safeParse(body);
  if (!parsed.success) return bad('Input tidak valid.', 422);
  const { player_key, username, catches } = parsed.data;

  // Rate limit ganda: per key + per IP
  const rlKey = checkRateLimit(`jala-sync:${player_key}`, { limit: 30, windowMs: 60_000 });
  if (!rlKey.allowed) return bad('Terlalu banyak sinkronisasi. Coba lagi sebentar.', 429);
  const rlIp = checkRateLimit(`jala-sync-ip:${getClientIp(request)}`, { limit: 60, windowMs: 60_000 });
  if (!rlIp.allowed) return bad('Terlalu banyak permintaan dari jaringan ini.', 429);

  let admin;
  try { admin = serviceClient(); } catch { return bad('JALA belum dikonfigurasi.', 503); }

  // Upsert pemain (hanya milik key sendiri)
  let { data: player } = await admin
    .from('jala_players')
    .select('id, coins, total_catch, total_kg, legendary')
    .eq('player_key', player_key)
    .maybeSingle();

  if (!player) {
    const { data: created, error: ce } = await admin
      .from('jala_players')
      .insert({ player_key, platform: 'web', username: username || null })
      .select('id, coins, total_catch, total_kg, legendary')
      .single();
    if (ce || !created) return bad('Gagal membuat pemain.', 500);
    player = created;
  } else if (username) {
    await admin.from('jala_players')
      .update({ username, updated_at: new Date().toISOString() })
      .eq('id', player.id);
  }

  // Insert tangkapan baru (maks 20 per request, coins dihitung server)
  let inserted = 0;
  let gainedCoins = 0;
  let gainedKg = 0;
  let gainedLegend = 0;
  if (catches.length > 0) {
    const rows = catches.map((c) => {
      const coins = serverCoins(c.fish_id, c.kg);
      gainedCoins += coins;
      gainedKg += c.kg;
      if (c.rarity === 'legenda') gainedLegend += 1;
      return {
        player_id: (player as { id: string }).id,
        fish_id: c.fish_id,
        fish_name: c.fish_name,
        rarity: c.rarity,
        kg: c.kg,
        coins,
        spot: c.spot,
        ...(c.caught_at ? { caught_at: c.caught_at } : {}),
      };
    });
    const { error: ie } = await admin.from('jala_catches').insert(rows);
    if (ie) return bad('Gagal mencatat tangkapan.', 500);
    inserted = rows.length;

    const p = player as { coins: number; total_catch: number; total_kg: number; legendary: number };
    const { data: updated, error: ue } = await admin
      .from('jala_players')
      .update({
        coins: p.coins + gainedCoins,
        total_catch: p.total_catch + inserted,
        total_kg: Number(p.total_kg) + gainedKg,
        legendary: p.legendary + gainedLegend,
        updated_at: new Date().toISOString(),
      })
      .eq('id', (player as { id: string }).id)
      .select('coins, total_catch, total_kg, legendary')
      .single();
    if (ue) return bad('Gagal update statistik.', 500);
    player = { ...(player as object), ...updated } as typeof player;
  }

  return ok({
    player: {
      player_key,
      coins: (player as { coins: number }).coins,
      total_catch: (player as { total_catch: number }).total_catch,
      total_kg: (player as { total_kg: number }).total_kg,
      legendary: (player as { legendary: number }).legendary,
    },
    inserted,
  });
}

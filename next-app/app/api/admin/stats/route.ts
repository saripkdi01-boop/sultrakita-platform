/**
 * GET /api/admin/stats — Dashboard statistik untuk bot Telegram superadmin.
 * Auth: x-bot-secret (SUKI_BOT_API_SECRET).
 *
 * Return: counts untuk semua tabel utama + uptime info.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const TABLES = [
  'profiles', 'listings', 'businesses',
  'jala_players', 'jala_catches', 'billing_orders',
] as const;

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase belum dikonfigurasi.');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function authorized(request: NextRequest): boolean {
  const secret = process.env.SUKI_BOT_API_SECRET;
  return !!secret && request.headers.get('x-bot-secret') === secret;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: 'Akses ditolak.' },
      { status: 401 });
  }

  let admin;
  try {
    admin = serviceClient();
  } catch {
    return NextResponse.json({ ok: false, error: 'Supabase belum dikonfigurasi.' },
      { status: 503 });
  }

  const stats: Record<string, number | string> = {};
  for (const table of TABLES) {
    try {
      const { count, error } = await admin
        .from(table)
        .select('id', { count: 'exact', head: true });
      stats[table] = error ? `ERR` : (count ?? 0);
    } catch {
      stats[table] = 'ERR';
    }
  }

  // Top 3 pemain JALA
  let topJala: unknown[] = [];
  try {
    const { data } = await admin
      .from('jala_players')
      .select('username,total_catch,total_kg')
      .order('total_kg', { ascending: false })
      .limit(3);
    topJala = data || [];
  } catch { /* abaikan */ }

  // 5 listing terbaru
  let recentListings: unknown[] = [];
  try {
    const { data } = await admin
      .from('listings')
      .select('id,title,price,status,created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    recentListings = data || [];
  } catch { /* abaikan */ }

  // 5 order terbaru
  let recentOrders: unknown[] = [];
  try {
    const { data } = await admin
      .from('billing_orders')
      .select('id,amount,status,payment_method,created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    recentOrders = data || [];
  } catch { /* abaikan */ }

  return NextResponse.json({
    ok: true,
    data: {
      stats,
      top_jala: topJala,
      recent_listings: recentListings,
      recent_orders: recentOrders,
      timestamp: new Date().toISOString(),
    },
  });
}

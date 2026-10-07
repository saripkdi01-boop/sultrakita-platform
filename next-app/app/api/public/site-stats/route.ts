/**
 * GET /api/public/site-stats — Statistik publik untuk widget homepage.
 *
 * Mengembalikan angka NYATA dari database (bukan karangan):
 * - registeredUsers: total baris di profiles
 * - active7d: profiles dengan updated_at dalam 7 hari terakhir
 * - listings: total listings
 *
 * Cache 5 menit (revalidate) agar ringan. Tidak ada data sensitif.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 300; // 5 menit

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function count(
  admin: { from: (t: string) => any },
  table: string,
  gte?: string,
): Promise<number | null> {
  try {
    let q = admin.from(table).select('id', { count: 'exact', head: true });
    if (gte) q = q.gte('updated_at', gte);
    const { count, error } = await q;
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

export async function GET() {
  const admin = serviceClient();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: 'Statistik belum tersedia.' },
      { status: 503 },
    );
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

  const [registeredUsers, active7d, listings] = await Promise.all([
    count(admin, 'profiles'),
    count(admin, 'profiles', sevenDaysAgo),
    count(admin, 'listings'),
  ]);

  return NextResponse.json({
    ok: true,
    registeredUsers,
    active7d,
    listings,
    // "live" (sedang online saat ini) butuh presence tracking yang belum ada.
    // JANGAN dikarang — kembalikan null agar UI tampil jujur ("segera").
    liveNow: null,
    updatedAt: new Date().toISOString(),
  });
}

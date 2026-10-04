import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// FASE B4 — GET /api/announcements/active
// Publik: daftar pengumuman aktif dalam rentang waktu (maks 5, terbaru dulu).
// RLS juga membatasi di DB; route ini memakai anon-key. Cache 60 detik.

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ ok: true, data: [] });
    }
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase
      .from('announcements')
      .select('id, title, body, link_url, link_label, starts_at, ends_at')
      .eq('is_active', true)
      .lte('starts_at', new Date().toISOString())
      .or('ends_at.is.null,ends_at.gt.' + new Date().toISOString())
      .order('starts_at', { ascending: false })
      .limit(5);
    if (error) {
      // Tabel belum dimigrasi → tampil apa adanya (kosong), bukan 500.
      return NextResponse.json({ ok: true, data: [] });
    }
    return NextResponse.json(
      { ok: true, data: data ?? [] },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
    );
  } catch {
    return NextResponse.json({ ok: true, data: [] });
  }
}

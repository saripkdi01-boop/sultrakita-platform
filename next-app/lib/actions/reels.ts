'use server';

import { requireServerUser, getServerSupabase } from '@/lib/supabase/server';
export type ReelRecord = { id: string; user_id: string; video_url: string; thumbnail_url: string | null; caption: string | null; district: string | null; views_count: number; likes_count: number; created_at: string };

export async function getReelsFeed(district?: string, cursor?: string) {
  try {
    const supabase = getServerSupabase();
    let query = supabase.from('reels').select('id,user_id,video_url,thumbnail_url,caption,district,views_count,likes_count,created_at').eq('is_active', true).order('created_at', { ascending: false }).order('id', { ascending: false }).limit(10);
    if (district?.trim()) query = query.eq('district', district.trim());
    if (cursor) { const decoded = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as { created_at: string; id: string }; if (decoded.created_at && decoded.id) query = query.lt('created_at', decoded.created_at); }
    const { data, error } = await query;
    if (error) throw error;
    const items = (data || []) as ReelRecord[]; const last = items.at(-1); const nextCursor = items.length === 10 && last ? Buffer.from(JSON.stringify({ created_at: last.created_at, id: last.id })).toString('base64url') : null;
    return { ok: true as const, data: items, nextCursor };
  } catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : 'Reels belum dapat dimuat.', data: [], nextCursor: null }; }
}

export async function recordReelView(reelId: string) {
  try { const supabase = getServerSupabase(); const { data } = await supabase.from('reels').select('views_count').eq('id', reelId).maybeSingle(); if (!data) return { ok: false as const, error: 'Reels tidak ditemukan.' }; const { error } = await supabase.from('reels').update({ views_count: (data.views_count || 0) + 1 }).eq('id', reelId); if (error) throw error; return { ok: true as const }; } catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : 'View belum tercatat.' }; }
}

export async function createReel(input: { video_url: string; thumbnail_url?: string; caption?: string; district?: string }) {
  try { const { supabase, user } = await requireServerUser(); if (!/^https:\/\//.test(input.video_url)) return { ok: false as const, error: 'URL video tidak valid.' }; const { data, error } = await supabase.from('reels').insert({ ...input, user_id: user.id }).select().single(); if (error) throw error; return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : 'Reels belum dapat dibuat.' }; }
}

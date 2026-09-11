'use server';

import { randomUUID } from 'node:crypto';
import { requireServerUser } from '@/lib/supabase/server';

const MAX_CONTENT = 2000;
const MAX_LOCATION = 120;
const MAX_MEDIA = 4;
const MAX_TAGS = 10;
const MAX_MOOD = 40;
const ALLOWED_TYPES = new Set(['post', 'reel', 'property']);
const ALLOWED_PRIVACY = new Set(['public', 'followers']);
const ALLOWED_MOODS = new Set(['Merayakan', 'Merasa bersyukur', 'Senang', 'Sedih', 'Bersemangat', 'Mencari rekomendasi']);

function safeError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  if (code === '23503') return 'Profil atau warga yang ditandai belum tersedia.';
  if (code === '42501') return 'Anda belum memiliki izin untuk mempublikasikan postingan.';
  if (code === '23514') return 'Jenis, privasi, mood, atau metadata postingan tidak valid.';
  if (code === '23505') return 'Postingan ini sudah terkirim. Muat ulang feed untuk melihatnya.';
  if (error instanceof Error && /network|fetch|timeout/i.test(error.message)) return 'Koneksi ke server terputus. Periksa internet lalu tekan coba lagi.';
  return 'Postingan belum dapat dipublikasikan. Coba lagi beberapa saat.';
}

function validMediaUrls(value: unknown) {
  if (!Array.isArray(value) || value.length > MAX_MEDIA) return null;
  const urls = value.filter((url): url is string => typeof url === 'string' && url.length <= 2048 && /^https:\/\//i.test(url));
  return urls.length === value.length ? urls : null;
}

function validTagIds(value: unknown) {
  if (!Array.isArray(value) || value.length > MAX_TAGS) return null;
  const ids = value.filter((id): id is string => typeof id === 'string' && /^[0-9a-f-]{36}$/i.test(id));
  return ids.length === value.length ? Array.from(new Set(ids)) : null;
}

export async function searchProfiles(query: string) {
  try {
    const { supabase } = await requireServerUser();
    const normalized = query.trim().replace(/^@+/, '').slice(0, 60);
    if (normalized.length < 2) return { ok: true as const, data: [] };
    const pattern = `%${normalized.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
    const { data, error } = await supabase.from('profiles').select('id,display_name,username,avatar_url,district').or(`display_name.ilike.${pattern},username.ilike.${pattern}`).order('display_name').limit(8);
    if (error) throw error;
    return { ok: true as const, data: data || [] };
  } catch (error) { return { ok: false as const, data: [], error: safeError(error) }; }
}

export async function createPost(input: { content: string; type?: string; privacy?: string; location?: string; mood?: string | null; taggedUserIds?: string[]; mediaUrls?: string[]; idempotencyKey?: string }) {
  try {
    const { supabase, user } = await requireServerUser();
    const content = input.content.trim();
    const type = input.type || 'post';
    const privacy = input.privacy || 'public';
    const location = input.location?.trim().slice(0, MAX_LOCATION) || null;
    const mood = input.mood?.trim().slice(0, MAX_MOOD) || null;
    const mediaUrls = validMediaUrls(input.mediaUrls || []);
    const tagIds = validTagIds(input.taggedUserIds || []);
    const idempotencyKey = input.idempotencyKey?.trim().slice(0, 120) || randomUUID();
    if (content.length < 2 && !mediaUrls?.length) return { ok: false as const, error: 'Tulis minimal 2 karakter atau tambahkan media.' };
    if (content.length > MAX_CONTENT) return { ok: false as const, error: `Postingan maksimal ${MAX_CONTENT} karakter.` };
    if (!ALLOWED_TYPES.has(type)) return { ok: false as const, error: 'Jenis postingan tidak valid.' };
    if (!ALLOWED_PRIVACY.has(privacy)) return { ok: false as const, error: 'Privasi postingan tidak valid.' };
    if (mood && !ALLOWED_MOODS.has(mood)) return { ok: false as const, error: 'Mood postingan tidak valid.' };
    if (!mediaUrls) return { ok: false as const, error: 'Media postingan tidak valid. Pilih ulang file Anda.' };
    if (!tagIds) return { ok: false as const, error: 'Tag warga tidak valid. Pilih ulang dari hasil pencarian.' };
    if (tagIds.includes(user.id)) return { ok: false as const, error: 'Anda tidak perlu menandai diri sendiri.' };
    if (type === 'reel' && !mediaUrls.some((url) => /\.(mp4|webm|mov)(\?|$)/i.test(url))) return { ok: false as const, error: 'Reel harus memiliki video.' };

    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
    if (!profile) {
      const displayName = String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Warga Sultra').slice(0, 120);
      const { error: profileError } = await supabase.from('profiles').insert({ id: user.id, display_name: displayName, full_name: displayName });
      if (profileError && profileError.code !== '23505') throw profileError;
    }
    if (tagIds.length) {
      const { data: taggedProfiles, error: taggedError } = await supabase.from('profiles').select('id').in('id', tagIds).limit(MAX_TAGS);
      if (taggedError) throw taggedError;
      if ((taggedProfiles || []).length !== tagIds.length) return { ok: false as const, error: 'Salah satu warga yang ditandai tidak ditemukan.' };
    }

    const { data: existing } = await supabase.from('posts').select('id,content,type,privacy,location,mood,tagged_user_ids,media_urls,created_at').eq('user_id', user.id).eq('idempotency_key', idempotencyKey).maybeSingle();
    if (existing) return { ok: true as const, data: existing, duplicate: true };
    const { data, error } = await supabase.from('posts').insert({ user_id: user.id, content, type, privacy, location, mood, tagged_user_ids: tagIds, status: 'published', idempotency_key: idempotencyKey, media_urls: mediaUrls }).select('id,content,type,privacy,location,mood,tagged_user_ids,media_urls,created_at').single();
    if (error) throw error;
    return { ok: true as const, data, duplicate: false };
  } catch (error) {
    return { ok: false as const, error: safeError(error) };
  }
}

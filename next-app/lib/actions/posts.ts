'use server';

import { randomUUID } from 'node:crypto';
import { requireServerUser } from '@/lib/supabase/server';

const MAX_CONTENT = 2000;
const MAX_LOCATION = 120;
const MAX_MEDIA = 4;
const ALLOWED_TYPES = new Set(['post', 'reel', 'property']);
const ALLOWED_PRIVACY = new Set(['public', 'followers']);

function safeError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  if (code === '23503') return 'Profil Anda belum siap. Muat ulang halaman lalu coba lagi.';
  if (code === '42501') return 'Anda belum memiliki izin untuk mempublikasikan postingan.';
  if (code === '23514') return 'Jenis atau privasi postingan tidak valid.';
  if (code === '23505') return 'Postingan ini sudah terkirim. Muat ulang feed untuk melihatnya.';
  if (error instanceof Error && /network|fetch|timeout/i.test(error.message)) return 'Koneksi ke server terputus. Periksa internet lalu tekan coba lagi.';
  return 'Postingan belum dapat dipublikasikan. Coba lagi beberapa saat.';
}

function validMediaUrls(value: unknown) {
  if (!Array.isArray(value) || value.length > MAX_MEDIA) return null;
  const urls = value.filter((url): url is string => typeof url === 'string' && url.length <= 2048 && /^https:\/\//i.test(url));
  return urls.length === value.length ? urls : null;
}

export async function createPost(input: { content: string; type?: string; privacy?: string; location?: string; mediaUrls?: string[]; idempotencyKey?: string }) {
  try {
    const { supabase, user } = await requireServerUser();
    const content = input.content.trim();
    const type = input.type || 'post';
    const privacy = input.privacy || 'public';
    const location = input.location?.trim().slice(0, MAX_LOCATION) || null;
    const mediaUrls = validMediaUrls(input.mediaUrls || []);
    const idempotencyKey = input.idempotencyKey?.trim().slice(0, 120) || randomUUID();
    if (content.length < 2 && !mediaUrls?.length) return { ok: false as const, error: 'Tulis minimal 2 karakter atau tambahkan media.' };
    if (content.length > MAX_CONTENT) return { ok: false as const, error: `Postingan maksimal ${MAX_CONTENT} karakter.` };
    if (!ALLOWED_TYPES.has(type)) return { ok: false as const, error: 'Jenis postingan tidak valid.' };
    if (!ALLOWED_PRIVACY.has(privacy)) return { ok: false as const, error: 'Privasi postingan tidak valid.' };
    if (!mediaUrls) return { ok: false as const, error: 'Media postingan tidak valid. Pilih ulang file Anda.' };
    if (type === 'reel' && !mediaUrls.some((url) => /\.(mp4|webm|mov)(\?|$)/i.test(url))) return { ok: false as const, error: 'Reel harus memiliki video.' };

    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
    if (!profile) {
      const displayName = String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Warga Sultra').slice(0, 120);
      const { error: profileError } = await supabase.from('profiles').insert({ id: user.id, display_name: displayName, full_name: displayName });
      if (profileError && profileError.code !== '23505') throw profileError;
    }

    const { data: existing } = await supabase.from('posts').select('id,content,type,privacy,location,media_urls,created_at').eq('user_id', user.id).eq('idempotency_key', idempotencyKey).maybeSingle();
    if (existing) return { ok: true as const, data: existing, duplicate: true };
    const { data, error } = await supabase.from('posts').insert({ user_id: user.id, content, type, privacy, location, status: 'published', idempotency_key: idempotencyKey, media_urls: mediaUrls }).select('id,content,type,privacy,location,media_urls,created_at').single();
    if (error) throw error;
    return { ok: true as const, data, duplicate: false };
  } catch (error) {
    return { ok: false as const, error: safeError(error) };
  }
}

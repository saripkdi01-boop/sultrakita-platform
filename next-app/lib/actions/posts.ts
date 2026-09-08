'use server';

import { randomUUID } from 'node:crypto';
import { requireServerUser } from '@/lib/supabase/server';

const MAX_CONTENT = 2000;
const MAX_LOCATION = 120;
const ALLOWED_TYPES = new Set(['post', 'reel', 'property']);
const ALLOWED_PRIVACY = new Set(['public', 'followers']);

function friendly(error: unknown) {
  return error instanceof Error ? error.message : 'Postingan belum dapat dibuat.';
}

export async function createPost(input: { content: string; type?: string; privacy?: string; location?: string; idempotencyKey?: string }) {
  try {
    const { supabase, user } = await requireServerUser();
    const content = input.content.trim();
    const type = input.type || 'post';
    const privacy = input.privacy || 'public';
    const location = input.location?.trim().slice(0, MAX_LOCATION) || null;
    const idempotencyKey = input.idempotencyKey?.trim().slice(0, 120) || randomUUID();

    if (content.length < 2) return { ok: false as const, error: 'Tulis minimal 2 karakter.' };
    if (content.length > MAX_CONTENT) return { ok: false as const, error: `Postingan maksimal ${MAX_CONTENT} karakter.` };
    if (!ALLOWED_TYPES.has(type)) return { ok: false as const, error: 'Jenis postingan tidak valid.' };
    if (!ALLOWED_PRIVACY.has(privacy)) return { ok: false as const, error: 'Privasi postingan tidak valid.' };

    const { data: existing } = await supabase.from('posts').select('id,content,type,privacy,location,created_at').eq('user_id', user.id).eq('idempotency_key', idempotencyKey).maybeSingle();
    if (existing) return { ok: true as const, data: existing, duplicate: true };

    const { data, error } = await supabase.from('posts').insert({ user_id: user.id, content, type, privacy, location, status: 'published', idempotency_key: idempotencyKey, media_urls: [] }).select('id,content,type,privacy,location,created_at').single();
    if (error) throw error;
    return { ok: true as const, data, duplicate: false };
  } catch (error) {
    return { ok: false as const, error: friendly(error) };
  }
}

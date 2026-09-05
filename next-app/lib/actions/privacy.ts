'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export type VisibilityLevel = 'public' | 'followers' | 'private';
export type VisibilitySettings = Record<string, VisibilityLevel>;

const defaults: VisibilitySettings = { full_name: 'public', username: 'public', bio: 'public', phone: 'followers', email: 'private', location: 'public', interests: 'public', online_status: 'followers' };

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase belum dikonfigurasi.');
  const store = cookies();
  return createServerClient(url, key, { cookies: { getAll: () => store.getAll(), setAll: () => undefined } });
}

async function userContext() {
  const supabase = getClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Sesi login diperlukan.');
  return { supabase, user };
}

export async function getVisibilitySettings() {
  try {
    const { supabase, user } = await userContext();
    const { data, error } = await supabase.from('profiles').select('visibility_settings').eq('id', user.id).maybeSingle();
    if (error) throw error;
    return { ok: true as const, data: { ...defaults, ...(data?.visibility_settings || {}) } };
  } catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : 'Pengaturan privasi belum tersedia.', data: defaults }; }
}

export async function saveVisibilitySettings(settings: VisibilitySettings) {
  try {
    const { supabase, user } = await userContext();
    const clean = Object.fromEntries(Object.entries({ ...defaults, ...settings }).map(([key, value]) => [key, ['public', 'followers', 'private'].includes(value) ? value : defaults[key]]));
    const { error } = await supabase.from('profiles').update({ visibility_settings: clean }).eq('id', user.id);
    if (error) throw error;
    return { ok: true as const, data: clean };
  } catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : 'Privasi belum dapat disimpan.' }; }
}

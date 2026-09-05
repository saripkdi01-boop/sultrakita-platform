import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase belum dikonfigurasi.');
  const store = cookies();
  return createServerClient(url, key, { cookies: { getAll: () => store.getAll(), setAll: () => undefined } });
}

export async function requireServerUser() {
  const supabase = getServerSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Sesi login diperlukan.');
  return { supabase, user };
}

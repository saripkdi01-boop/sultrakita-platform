import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase belum dikonfigurasi.');
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      // Server Components cannot mutate cookies. Route Handlers and middleware
      // provide their own response-aware client when a session must be written.
      setAll: () => undefined,
    },
  });
}

export async function requireServerUser() {
  const supabase = await getServerSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Sesi login diperlukan.');
  return { supabase, user };
}

export async function requireAdminUser() {
  const { supabase, user } = await requireServerUser();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role,display_name,full_name,avatar_url')
    .eq('id', user.id)
    .maybeSingle();
  if (error || !profile || !['admin', 'super_admin'].includes(profile.role)) {
    throw new Error('Akses admin diperlukan.');
  }
  return { supabase, user, profile };
}

'use server';

import { getServerSupabase } from '@/lib/supabase/server';

export type SukiEcosystemApp = { slug: 'suki-suits' | 'suki-marketplace'; name: string; short_name: string; route: string; icon: string; position: number };

export async function getHeaderEcosystemApps() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase.from('suki_ecosystem_apps').select('slug,name,short_name,route,icon,position').eq('is_active', true).order('position', { ascending: true });
    if (error) throw error;
    return { ok: true as const, data: (data || []) as SukiEcosystemApp[] };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : 'Registry SUKI belum tersedia.', data: [] as SukiEcosystemApp[] };
  }
}

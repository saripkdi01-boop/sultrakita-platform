'use server';

import { getServerSupabase } from '@/lib/supabase/server';

export type PropertyLocation = { regency_name: string; district_name: string; subdistrict_name: string };

export async function getPropertyLocations() {
  try {
    const { data, error } = await (await getServerSupabase())
      .from('locations')
      .select('regency_name,district_name,subdistrict_name')
      .order('regency_name')
      .order('district_name')
      .order('subdistrict_name')
      .limit(500);
    if (error) throw error;
    return { ok: true as const, data: (data || []) as PropertyLocation[] };
  } catch (error) {
    return { ok: false as const, data: [], error: error instanceof Error ? error.message : 'Lokasi belum tersedia.' };
  }
}

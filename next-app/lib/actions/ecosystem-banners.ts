'use server';

import { revalidatePath } from 'next/cache';
import { getServerSupabase, requireServerUser } from '@/lib/supabase/server';

const BANNER_APPS = ['marketplace', 'jobs', 'suits'] as const;
export type BannerAppSlug = (typeof BANNER_APPS)[number];
export type BannerEventType = 'banner_view' | 'banner_cta_click' | 'banner_next' | 'banner_pause';
export type EcosystemBanner = {
  id: string; app_slug: BannerAppSlug; eyebrow: string; title: string; description: string; image_url: string; cta_label: string; cta_href: string; priority: number; starts_at: string | null; ends_at: string | null; is_active: boolean; created_at: string; updated_at: string;
};
export type BannerInput = Omit<EcosystemBanner, 'id' | 'created_at' | 'updated_at'>;
export type BannerStatus = 'draft' | 'scheduled' | 'live' | 'expired' | 'disabled';

function isBannerAppSlug(value: string): value is BannerAppSlug { return BANNER_APPS.includes(value as BannerAppSlug); }
function errorMessage(error: unknown) { return error instanceof Error ? error.message : 'Banner SUKI belum dapat diproses.'; }
function refreshBannerPaths() { revalidatePath('/marketplace'); revalidatePath('/jobs'); revalidatePath('/properti'); revalidatePath('/admin/ecosystem-banners'); }

export async function getActiveEcosystemBanners(appSlug: BannerAppSlug) {
  if (!isBannerAppSlug(appSlug)) return { ok: false as const, banners: [], error: 'Aplikasi banner tidak valid.' };
  try {
    const supabase = await getServerSupabase(); const now = new Date().toISOString();
    const { data, error } = await supabase.from('ecosystem_banners').select('*').eq('app_slug', appSlug).eq('is_active', true).or(`starts_at.is.null,starts_at.lte.${now}`).or(`ends_at.is.null,ends_at.gt.${now}`).order('priority', { ascending: false }).order('created_at', { ascending: false }).limit(5);
    if (error) throw error;
    return { ok: true as const, banners: ((data || []) as EcosystemBanner[]).slice(0, 5), fallback: false };
  } catch (error) { return { ok: false as const, banners: [] as EcosystemBanner[], fallback: true, error: errorMessage(error) }; }
}

async function requireAdmin() {
  const { supabase, user } = await requireServerUser();
  const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (error) throw error;
  if (profile?.role !== 'admin') throw new Error('Akses admin diperlukan.');
  return supabase;
}

export async function listEcosystemBanners(appSlug?: BannerAppSlug) {
  try { const supabase = await requireAdmin(); let query = supabase.from('ecosystem_banners').select('*').order('app_slug').order('priority', { ascending: false }).order('created_at', { ascending: false }); if (appSlug) query = query.eq('app_slug', appSlug); const { data, error } = await query; if (error) throw error; return { ok: true as const, banners: (data || []) as EcosystemBanner[] }; } catch (error) { return { ok: false as const, banners: [] as EcosystemBanner[], error: errorMessage(error) }; }
}

export async function createEcosystemBanner(input: BannerInput) {
  try { const supabase = await requireAdmin(); const { data, error } = await supabase.from('ecosystem_banners').insert(input).select('*').single(); if (error) throw error; refreshBannerPaths(); return { ok: true as const, banner: data as EcosystemBanner }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; }
}
export async function updateEcosystemBanner(id: string, input: BannerInput) {
  try { const supabase = await requireAdmin(); const { data, error } = await supabase.from('ecosystem_banners').update(input).eq('id', id).select('*').single(); if (error) throw error; refreshBannerPaths(); return { ok: true as const, banner: data as EcosystemBanner }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; }
}
export async function duplicateEcosystemBanner(id: string) {
  try { const supabase = await requireAdmin(); const { data: source, error: sourceError } = await supabase.from('ecosystem_banners').select('*').eq('id', id).single(); if (sourceError || !source) throw sourceError || new Error('Banner tidak ditemukan.'); const copy = { app_slug: source.app_slug, eyebrow: source.eyebrow, title: `${source.title} (Copy)`, description: source.description, image_url: source.image_url, cta_label: source.cta_label, cta_href: source.cta_href, priority: source.priority, starts_at: source.starts_at, ends_at: source.ends_at, is_active: false }; const { data, error } = await supabase.from('ecosystem_banners').insert(copy).select('*').single(); if (error) throw error; refreshBannerPaths(); return { ok: true as const, banner: data as EcosystemBanner }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; }
}
export async function reorderEcosystemBanners(ids: string[]) {
  try { const supabase = await requireAdmin(); await Promise.all(ids.map((id, index) => supabase.from('ecosystem_banners').update({ priority: ids.length - index }).eq('id', id))); refreshBannerPaths(); return { ok: true as const }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; }
}
export async function deleteEcosystemBanner(id: string) {
  try { const supabase = await requireAdmin(); const { error } = await supabase.from('ecosystem_banners').delete().eq('id', id); if (error) throw error; refreshBannerPaths(); return { ok: true as const }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; }
}

export async function getEcosystemBannerAnalytics(days: 7 | 30 | 90 = 7) {
  try { const supabase = await requireAdmin(); const since = new Date(Date.now() - days * 86_400_000).toISOString(); const { data: events, error } = await supabase.from('ecosystem_banner_events').select('banner_id,app_slug,event_type,created_at').gte('created_at', since).order('created_at', { ascending: false }).limit(10000); if (error) throw error; const rows = (events || []) as Array<{ banner_id: string; app_slug: BannerAppSlug; event_type: BannerEventType; created_at: string }>; const byApp = Object.fromEntries(BANNER_APPS.map(app => [app, { views: 0, clicks: 0, pauses: 0, next: 0 }])) as Record<BannerAppSlug, { views: number; clicks: number; pauses: number; next: number }>; const byBanner = new Map<string, { bannerId: string; appSlug: BannerAppSlug; title: string; views: number; clicks: number }>(); for (const event of rows) { const app = byApp[event.app_slug]; if (!app) continue; if (event.event_type === 'banner_view') app.views++; if (event.event_type === 'banner_cta_click') app.clicks++; if (event.event_type === 'banner_pause') app.pauses++; if (event.event_type === 'banner_next') app.next++; const current = byBanner.get(event.banner_id) || { bannerId: event.banner_id, appSlug: event.app_slug, title: event.banner_id, views: 0, clicks: 0 }; if (event.event_type === 'banner_view') current.views++; if (event.event_type === 'banner_cta_click') current.clicks++; byBanner.set(event.banner_id, current); } const ids = Array.from(byBanner.keys()); if (ids.length) { const { data: banners } = await supabase.from('ecosystem_banners').select('id,title').in('id', ids); for (const banner of banners || []) { const row = byBanner.get(banner.id); if (row) row.title = banner.title; } } return { ok: true as const, days, byApp, topBanners: Array.from(byBanner.values()).sort((a, b) => b.views - a.views).slice(0, 5) }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; }
}

export async function recordEcosystemBannerEvent(input: { bannerId: string; appSlug: BannerAppSlug; eventType: BannerEventType }) {
  try { const supabase = await getServerSupabase(); const { error } = await supabase.from('ecosystem_banner_events').insert({ banner_id: input.bannerId, app_slug: input.appSlug, event_type: input.eventType }); if (error) throw error; return { ok: true as const }; } catch { return { ok: false as const }; }
}

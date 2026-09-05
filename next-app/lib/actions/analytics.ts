'use server';

import { requireServerUser } from '@/lib/supabase/server';

type DailyStat = { date: string; views: number; contacts: number; conversations: number };
export type SellerStats = { totalViews: number; totalContacts: number; totalConversations: number; responseRate: number; daily: DailyStat[] };

export async function getSellerStats(sellerId: string, days = 7) {
  try {
    const safeDays = days === 30 ? 30 : 7;
    const { supabase, user } = await requireServerUser();
    if (user.id !== sellerId) return { ok: false as const, error: 'Akses analytics tidak diizinkan.' };
    const since = new Date(Date.now() - safeDays * 86_400_000).toISOString();
    const { data: listings, error: listingError } = await supabase.from('listings').select('id').eq('seller_id', sellerId);
    if (listingError) throw listingError;
    const listingIds = (listings || []).map(row => row.id);
    if (!listingIds.length) return { ok: true as const, data: emptyStats(safeDays) };
    const [{ data: events, error: eventsError }, { data: conversations, error: conversationError }] = await Promise.all([
      supabase.from('listing_analytics').select('listing_id,event_type,created_at').in('listing_id', listingIds).gte('created_at', since),
      supabase.from('conversations').select('id,created_at').eq('seller_id', sellerId).gte('created_at', since),
    ]);
    if (eventsError) throw eventsError;
    if (conversationError) throw conversationError;
    const daily = emptyStats(safeDays).daily;
    const byDate = new Map(daily.map(row => [row.date, row]));
    for (const event of events || []) { const row = byDate.get(event.created_at.slice(0, 10)); if (row) row[event.event_type === 'view' ? 'views' : event.event_type === 'contact_click' ? 'contacts' : 'views'] += 1; }
    for (const conversation of conversations || []) { const row = byDate.get(conversation.created_at.slice(0, 10)); if (row) row.conversations += 1; }
    const totalViews = daily.reduce((sum, row) => sum + row.views, 0); const totalContacts = daily.reduce((sum, row) => sum + row.contacts, 0); const totalConversations = daily.reduce((sum, row) => sum + row.conversations, 0);
    return { ok: true as const, data: { totalViews, totalContacts, totalConversations, responseRate: totalConversations ? Math.round((totalContacts / totalConversations) * 100) : 0, daily } };
  } catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : 'Analytics belum dapat dimuat.' }; }
}

function emptyStats(days: number): SellerStats { const daily: DailyStat[] = []; for (let index = days - 1; index >= 0; index -= 1) { const date = new Date(Date.now() - index * 86_400_000).toISOString().slice(0, 10); daily.push({ date, views: 0, contacts: 0, conversations: 0 }); } return { totalViews: 0, totalContacts: 0, totalConversations: 0, responseRate: 0, daily }; }

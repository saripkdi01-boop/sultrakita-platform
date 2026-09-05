'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const MAX_ACTIVITY_DATA = 4000;
const ALLOWED_ACTIVITY_TYPES = ['login', 'post_created', 'profile_updated', 'setting_changed', 'security_event'] as const;

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase belum dikonfigurasi untuk fitur keamanan.');
  const cookieStore = cookies();
  return createServerClient(url, key, { cookies: { getAll: () => cookieStore.getAll(), setAll: () => undefined } });
}

async function requireUser() {
  const supabase = client();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Sesi login diperlukan untuk mengelola keamanan akun.');
  return { supabase, user };
}

function safeError(error: unknown) {
  return error instanceof Error ? error.message : 'Permintaan keamanan belum dapat diproses.';
}

export async function logActivity(activityType: string, data: Record<string, unknown> = {}) {
  try {
    if (!ALLOWED_ACTIVITY_TYPES.includes(activityType as (typeof ALLOWED_ACTIVITY_TYPES)[number])) return { ok: false as const, error: 'Jenis aktivitas tidak valid.' };
    const { supabase, user } = await requireUser();
    const payload = JSON.stringify(data).slice(0, MAX_ACTIVITY_DATA);
    const { error } = await supabase.from('activity_logs').insert({ user_id: user.id, activity_type: activityType, activity_data: JSON.parse(payload) });
    if (error) throw error;
    return { ok: true as const };
  } catch (error) { return { ok: false as const, error: safeError(error) }; }
}

export async function getActivityLogs() {
  try {
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase.from('activity_logs').select('id,activity_type,activity_data,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50);
    if (error) throw error;
    return { ok: true as const, data: data || [] };
  } catch (error) { return { ok: false as const, error: safeError(error), data: [] }; }
}

export async function blockUser(blockedUserId: string) {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(blockedUserId)) return { ok: false as const, error: 'Pengguna tidak valid.' };
    const { supabase, user } = await requireUser();
    if (blockedUserId === user.id) return { ok: false as const, error: 'Kamu tidak dapat memblokir akun sendiri.' };
    const { count } = await supabase.from('activity_logs').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('activity_type', 'security_event').gte('created_at', new Date(Date.now() - 60_000).toISOString());
    if ((count || 0) >= 10) return { ok: false as const, error: 'Terlalu banyak perubahan keamanan. Coba lagi sebentar.' };
    const { error } = await supabase.from('blocked_users').insert({ blocker_id: user.id, blocked_id: blockedUserId });
    if (error && error.code !== '23505') throw error;
    await logActivity('security_event', { action: 'block_user' });
    return { ok: true as const };
  } catch (error) { return { ok: false as const, error: safeError(error) }; }
}

export async function unblockUser(blockedUserId: string) {
  try {
    const { supabase, user } = await requireUser();
    const { error } = await supabase.from('blocked_users').delete().eq('blocker_id', user.id).eq('blocked_id', blockedUserId);
    if (error) throw error;
    await logActivity('security_event', { action: 'unblock_user' });
    return { ok: true as const };
  } catch (error) { return { ok: false as const, error: safeError(error) }; }
}

export async function getBlockedUsers() {
  try {
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase.from('blocked_users').select('id, blocked_id, created_at, profiles:blocked_id(id,full_name,username,avatar_url)').eq('blocker_id', user.id).order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    return { ok: true as const, data: data || [] };
  } catch (error) { return { ok: false as const, error: safeError(error), data: [] }; }
}

export async function getActiveSessions() {
  try {
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase.from('active_sessions').select('id,device_info,location,is_current,last_active_at,created_at,expires_at').eq('user_id', user.id).order('last_active_at', { ascending: false }).limit(25);
    if (error) throw error;
    return { ok: true as const, data: data || [] };
  } catch (error) { return { ok: false as const, error: safeError(error), data: [] }; }
}

export async function logoutSession(sessionId: string) {
  try {
    const { supabase, user } = await requireUser();
    const { error } = await supabase.from('active_sessions').delete().eq('id', sessionId).eq('user_id', user.id).eq('is_current', false);
    if (error) throw error;
    await logActivity('security_event', { action: 'logout_session' });
    return { ok: true as const };
  } catch (error) { return { ok: false as const, error: safeError(error) }; }
}

export async function logoutAllOtherSessions() {
  try {
    const { supabase, user } = await requireUser();
    const { error } = await supabase.from('active_sessions').delete().eq('user_id', user.id).eq('is_current', false);
    if (error) throw error;
    await logActivity('security_event', { action: 'logout_all_other_sessions' });
    return { ok: true as const };
  } catch (error) { return { ok: false as const, error: safeError(error) }; }
}

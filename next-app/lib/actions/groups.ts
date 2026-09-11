'use server';

import { requireServerUser } from '@/lib/supabase/server';

function message(error: unknown) { return error instanceof Error ? error.message : 'Permintaan komunitas gagal.'; }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70); }

export async function getGroups(query = '') {
  try {
    const { supabase, user } = await requireServerUser();
    let request = supabase.from('groups').select('id,owner_id,name,slug,description,category,privacy,cover_url,member_count,post_count,created_at,group_members(user_id,role,status)').order('updated_at', { ascending: false }).limit(60);
    if (query.trim()) request = request.ilike('name', `%${query.trim().slice(0, 60)}%`);
    const { data, error } = await request;
    if (error) throw error;
    return { ok: true as const, data: (data || []).map((group: any) => ({ ...group, membership: group.group_members?.find((member: any) => member.user_id === user.id) || null, group_members: undefined })) };
  } catch (error) { return { ok: false as const, data: [], error: message(error) }; }
}

export async function getGroupFeed(groupId: string) {
  try {
    const { supabase } = await requireServerUser();
    const { data, error } = await supabase.from('group_posts').select('id,group_id,author_id,body,post_type,is_pinned,created_at,profiles(display_name,username,avatar_url)').eq('group_id', groupId).order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(30);
    if (error) throw error;
    return { ok: true as const, data: data || [] };
  } catch (error) { return { ok: false as const, data: [], error: message(error) }; }
}

export async function createGroup(input: { name: string; description: string; category: string; privacy: 'public' | 'private' }) {
  try {
    const { supabase } = await requireServerUser();
    const name = input.name.trim();
    if (name.length < 3 || name.length > 80) return { ok: false as const, error: 'Nama grup harus 3–80 karakter.' };
    const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 7)}`;
    const { data, error } = await supabase.rpc('create_suki_group', { p_name: name, p_slug: slug, p_description: input.description.trim().slice(0, 500), p_category: input.category, p_privacy: input.privacy });
    if (error) throw error;
    return { ok: true as const, data };
  } catch (error) { return { ok: false as const, error: message(error) }; }
}

export async function joinGroup(groupId: string) {
  try {
    const { supabase, user } = await requireServerUser();
    const { data: group, error: groupError } = await supabase.from('groups').select('id,privacy').eq('id', groupId).maybeSingle();
    if (groupError) throw groupError;
    if (!group) return { ok: false as const, error: 'Grup tidak ditemukan.' };
    const status = group.privacy === 'private' ? 'pending' : 'active';
    const { error } = await supabase.from('group_members').upsert({ group_id: groupId, user_id: user.id, role: 'member', status }, { onConflict: 'group_id,user_id' });
    if (error) throw error;
    return { ok: true as const, status };
  } catch (error) { return { ok: false as const, error: message(error) }; }
}

export async function leaveGroup(groupId: string) {
  try {
    const { supabase, user } = await requireServerUser();
    const { error } = await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', user.id).neq('role', 'owner');
    if (error) throw error;
    return { ok: true as const };
  } catch (error) { return { ok: false as const, error: message(error) }; }
}

export async function createGroupPost(groupId: string, body: string, postType: 'discussion' | 'question' | 'announcement' = 'discussion') {
  try {
    const { supabase, user } = await requireServerUser();
    const clean = body.trim();
    if (!clean || clean.length > 4000) return { ok: false as const, error: 'Posting komunitas harus 1–4.000 karakter.' };
    const { data, error } = await supabase.from('group_posts').insert({ group_id: groupId, author_id: user.id, body: clean, post_type: postType }).select('id,group_id,author_id,body,post_type,is_pinned,created_at,profiles(display_name,username,avatar_url)').single();
    if (error) throw error;
    return { ok: true as const, data };
  } catch (error) { return { ok: false as const, error: message(error) }; }
}

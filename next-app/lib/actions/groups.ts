'use server';

import { getServerSupabase, requireServerUser } from '@/lib/supabase/server';

const REACTION_TYPES = ['like', 'support', 'insight'] as const;
type ReactionType = (typeof REACTION_TYPES)[number];

function message(error: unknown) { return error instanceof Error ? error.message : 'Permintaan komunitas gagal.'; }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70); }
function validUuid(value: string) { return /^[0-9a-f-]{20,}$/i.test(value); }
function isReactionType(value: string): value is ReactionType { return (REACTION_TYPES as readonly string[]).includes(value); }
function isMissingInteractionTable(error: any) { return error?.code === '42P01' || error?.code === 'PGRST205' || /group_post_(comments|reactions)/i.test(error?.message || ''); }

async function requireActiveGroupMember(supabase: any, groupId: string, userId: string) {
  if (!validUuid(groupId)) throw new Error('Komunitas tidak valid.');
  const { data, error } = await supabase.from('group_members').select('role,status').eq('group_id', groupId).eq('user_id', userId).maybeSingle();
  if (error) throw error;
  if (!data || data.status !== 'active') throw new Error('Kamu harus menjadi anggota aktif untuk berinteraksi di ruang ini.');
  return data;
}

export async function getGroups(query = '') {
  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    let request = supabase.from('groups').select('id,owner_id,name,slug,description,category,privacy,cover_url,member_count,post_count,created_at,group_members(user_id,role,status)').order('updated_at', { ascending: false }).limit(60);
    if (query.trim()) request = request.ilike('name', `%${query.trim().slice(0, 60)}%`);
    const { data, error } = await request;
    if (error) throw error;
    return { ok: true as const, data: (data || []).map((group: any) => ({ ...group, membership: user ? group.group_members?.find((member: any) => member.user_id === user.id) || null : null, group_members: undefined })) };
  } catch (error) { return { ok: false as const, data: [], error: message(error) }; }
}

export async function getGroupFeed(groupId: string) {
  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: posts, error } = await supabase.from('group_posts').select('id,group_id,author_id,body,post_type,is_pinned,created_at,profiles(display_name,username,avatar_url)').eq('group_id', groupId).order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(30);
    if (error) throw error;
    const ids = (posts || []).map((post: any) => post.id);
    if (!ids.length) return { ok: true as const, data: [] };
    const [{ data: comments, error: commentsError }, { data: reactions, error: reactionsError }] = await Promise.all([
      supabase.from('group_post_comments').select('id,group_id,post_id,author_id,body,created_at,profiles(display_name,username,avatar_url)').in('post_id', ids).order('created_at', { ascending: true }),
      supabase.from('group_post_reactions').select('post_id,user_id,reaction_type').in('post_id', ids),
    ]);
    if ((commentsError && !isMissingInteractionTable(commentsError)) || (reactionsError && !isMissingInteractionTable(reactionsError))) throw commentsError || reactionsError;
    return {
      ok: true as const,
      data: (posts || []).map((post: any) => {
        const postComments = (comments || []).filter((comment: any) => comment.post_id === post.id);
        const postReactions = (reactions || []).filter((reaction: any) => reaction.post_id === post.id);
        return { ...post, comments: postComments, reaction_counts: REACTION_TYPES.reduce((counts, type) => ({ ...counts, [type]: postReactions.filter((reaction: any) => reaction.reaction_type === type).length }), {} as Record<ReactionType, number>), viewer_reactions: user ? postReactions.filter((reaction: any) => reaction.user_id === user.id).map((reaction: any) => reaction.reaction_type) : [] };
      }),
    };
  } catch (error) { return { ok: false as const, data: [], error: message(error) }; }
}

export async function createGroup(input: { name: string; description: string; category: string; privacy: 'public' | 'private' }) {
  try {
    const { supabase } = await requireServerUser();
    const name = input.name.trim();
    if (name.length < 3 || name.length > 80) return { ok: false as const, error: 'Nama grup harus 3–80 karakter.' };
    if (!['umum', 'jual_beli', 'wisata', 'kuliner', 'umkm', 'hobi', 'property', 'profesi'].includes(input.category)) return { ok: false as const, error: 'Kategori komunitas tidak valid.' };
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
    await requireActiveGroupMember(supabase, groupId, user.id);
    const clean = body.trim();
    if (!clean || clean.length > 4000) return { ok: false as const, error: 'Posting komunitas harus 1–4.000 karakter.' };
    const { data, error } = await supabase.from('group_posts').insert({ group_id: groupId, author_id: user.id, body: clean, post_type: postType }).select('id,group_id,author_id,body,post_type,is_pinned,created_at,profiles(display_name,username,avatar_url)').single();
    if (error) throw error;
    return { ok: true as const, data: { ...data, comments: [], reaction_counts: { like: 0, support: 0, insight: 0 }, viewer_reactions: [] } };
  } catch (error) { return { ok: false as const, error: message(error) }; }
}

export async function createGroupComment(groupId: string, postId: string, body: string) {
  try {
    const { supabase, user } = await requireServerUser();
    await requireActiveGroupMember(supabase, groupId, user.id);
    const clean = body.trim();
    if (!validUuid(postId) || !clean || clean.length > 1000) return { ok: false as const, error: 'Komentar harus 1–1.000 karakter.' };
    const { data: post, error: postError } = await supabase.from('group_posts').select('id').eq('id', postId).eq('group_id', groupId).maybeSingle();
    if (postError) throw postError;
    if (!post) return { ok: false as const, error: 'Posting tidak ditemukan di komunitas ini.' };
    const { data, error } = await supabase.from('group_post_comments').insert({ group_id: groupId, post_id: postId, author_id: user.id, body: clean }).select('id,group_id,post_id,author_id,body,created_at,profiles(display_name,username,avatar_url)').single();
    if (error) throw error;
    return { ok: true as const, data };
  } catch (error) { return { ok: false as const, error: message(error) }; }
}

export async function toggleGroupReaction(groupId: string, postId: string, reactionType: string) {
  try {
    const { supabase, user } = await requireServerUser();
    await requireActiveGroupMember(supabase, groupId, user.id);
    if (!validUuid(postId) || !isReactionType(reactionType)) return { ok: false as const, error: 'Reaksi tidak valid.' };
    const { data: post, error: postError } = await supabase.from('group_posts').select('id').eq('id', postId).eq('group_id', groupId).maybeSingle();
    if (postError) throw postError;
    if (!post) return { ok: false as const, error: 'Posting tidak ditemukan di komunitas ini.' };
    const { data: existing, error: lookupError } = await supabase.from('group_post_reactions').select('post_id').eq('post_id', postId).eq('user_id', user.id).eq('reaction_type', reactionType).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) {
      const { error } = await supabase.from('group_post_reactions').delete().eq('post_id', postId).eq('user_id', user.id).eq('reaction_type', reactionType);
      if (error) throw error;
      return { ok: true as const, reacted: false, reaction_type: reactionType };
    }
    const { error } = await supabase.from('group_post_reactions').insert({ post_id: postId, group_id: groupId, user_id: user.id, reaction_type: reactionType });
    if (error) throw error;
    return { ok: true as const, reacted: true, reaction_type: reactionType };
  } catch (error) { return { ok: false as const, error: message(error) }; }
}

export async function deleteGroupComment(groupId: string, commentId: string) {
  try {
    const { supabase, user } = await requireServerUser();
    const membership = await requireActiveGroupMember(supabase, groupId, user.id);
    if (!validUuid(commentId)) return { ok: false as const, error: 'Komentar tidak valid.' };
    const { error } = await supabase.from('group_post_comments').delete().eq('id', commentId).eq('group_id', groupId).or(`author_id.eq.${user.id},group_id.eq.${groupId}`);
    if (error) throw error;
    return { ok: true as const, moderator: ['owner', 'moderator'].includes(membership.role) };
  } catch (error) { return { ok: false as const, error: message(error) }; }
}

'use server';

import { requireServerUser } from '@/lib/supabase/server';

const MAX_MESSAGE = 4000;
function friendly(error: unknown) { return error instanceof Error ? error.message : 'Chat belum dapat diproses.'; }

async function notifyN8n(payload: Record<string, unknown>) {
  const webhook = process.env.N8N_WHATSAPP_WEBHOOK_URL;
  if (!webhook) return;
  try { await fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json', ...(process.env.N8N_WEBHOOK_SECRET ? { 'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET } : {}) }, body: JSON.stringify(payload), signal: AbortSignal.timeout(5000), cache: 'no-store' }); } catch { /* notification failure must not block chat */ }
}

export async function startConversation(listingId: number, sellerId: string, initialMessage: string) {
  try {
    if (!Number.isInteger(listingId) || !sellerId || !initialMessage.trim()) return { ok: false as const, error: 'Listing, seller, dan pesan awal wajib diisi.' };
    const content = initialMessage.trim().slice(0, MAX_MESSAGE);
    const { supabase, user } = await requireServerUser();
    if (user.id === sellerId) return { ok: false as const, error: 'Kamu tidak dapat menghubungi diri sendiri.' };
    const { data: existing, error: findError } = await supabase.from('conversations').select('id').eq('listing_id', listingId).eq('buyer_id', user.id).eq('seller_id', sellerId).maybeSingle();
    if (findError) throw findError;
    let conversationId = existing?.id;
    if (!conversationId) {
      const { data: conversation, error } = await supabase.from('conversations').insert({ listing_id: listingId, buyer_id: user.id, seller_id: sellerId, last_message: content }).select('id').single();
      if (error) throw error;
      conversationId = conversation.id;
    }
    const { error: messageError } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: user.id, content });
    if (messageError) throw messageError;
    await supabase.from('conversations').update({ last_message: content, last_message_at: new Date().toISOString(), is_read: false }).eq('id', conversationId);
    await sendWhatsAppNotice(supabase, listingId, sellerId, content, user.id);
    return { ok: true as const, conversationId };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

export async function sendMessage(conversationId: string, content: string) {
  try {
    if (!conversationId || !content.trim()) return { ok: false as const, error: 'Pesan tidak boleh kosong.' };
    const { supabase, user } = await requireServerUser();
    const text = content.trim().slice(0, MAX_MESSAGE);
    const { data: conversation, error: conversationError } = await supabase.from('conversations').select('id,listing_id,seller_id,buyer_id').eq('id', conversationId).maybeSingle();
    if (conversationError) throw conversationError;
    if (!conversation || ![conversation.buyer_id, conversation.seller_id].includes(user.id)) return { ok: false as const, error: 'Kamu tidak memiliki akses ke percakapan ini.' };
    const { data: message, error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: user.id, content: text }).select('id,conversation_id,sender_id,content,is_read,created_at').single();
    if (error) throw error;
    await supabase.from('conversations').update({ last_message: text, last_message_at: new Date().toISOString(), is_read: false }).eq('id', conversationId);
    if (user.id !== conversation.seller_id) await sendWhatsAppNotice(supabase, conversation.listing_id, conversation.seller_id, text, user.id);
    return { ok: true as const, data: message };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

async function sendWhatsAppNotice(supabase: Awaited<ReturnType<typeof requireServerUser>>['supabase'], listingId: number, sellerId: string, content: string, buyerId: string) {
  const [{ data: listing }, { data: buyer }, { data: seller }] = await Promise.all([
    supabase.from('listings').select('title').eq('id', listingId).maybeSingle(),
    supabase.from('profiles').select('full_name').eq('id', buyerId).maybeSingle(),
    supabase.from('profiles').select('phone').eq('id', sellerId).maybeSingle(),
  ]);
  await notifyN8n({ seller_phone: seller?.phone || null, buyer_name: buyer?.full_name || 'Warga SultraKita', listing_title: listing?.title || 'Listing SultraKita', message_content: content });
}

export async function getChatInbox() {
  const { supabase, user } = await requireServerUser();
  const { data, error } = await supabase.from('conversations').select('id,type,name,avatar_url,last_message,last_message_at,updated_at,conversation_participants!inner(user_id,last_read_at,is_muted,is_archived)').eq('conversation_participants.user_id', user.id).eq('conversation_participants.is_archived', false).order('updated_at', { ascending: false }).limit(50);
  if (error) return { ok: false as const, error: friendly(error), data: [] };
  return { ok: true as const, data: data || [] };
}

export async function getChatMessages(conversationId: string, before?: string) {
  const { supabase, user } = await requireServerUser();
  const { data: member } = await supabase.from('conversation_participants').select('id').eq('conversation_id', conversationId).eq('user_id', user.id).maybeSingle();
  if (!member) return { ok: false as const, error: 'Kamu bukan anggota percakapan ini.', data: [] };
  let query = supabase.from('messages').select('id,conversation_id,sender_id,content,message_type,media_url,media_metadata,reply_to_message_id,edited,deleted,created_at').eq('conversation_id', conversationId).eq('deleted', false).order('created_at', { ascending: false }).limit(50);
  if (before) query = query.lt('created_at', before);
  const { data, error } = await query;
  if (error) return { ok: false as const, error: friendly(error), data: [] };
  return { ok: true as const, data: (data || []).reverse() };
}

export async function markChatRead(conversationId: string) {
  const { supabase, user } = await requireServerUser();
  const { error } = await supabase.from('conversation_participants').update({ last_read_at: new Date().toISOString() }).eq('conversation_id', conversationId).eq('user_id', user.id);
  return error ? { ok: false as const, error: friendly(error) } : { ok: true as const };
}

export async function setMessageReaction(messageId: string, emoji: string) {
  const { supabase, user } = await requireServerUser();
  const { data: existing } = await supabase.from('message_reactions').select('id').eq('message_id', messageId).eq('user_id', user.id).eq('emoji', emoji).maybeSingle();
  const result = existing ? await supabase.from('message_reactions').delete().eq('id', existing.id) : await supabase.from('message_reactions').insert({ message_id: messageId, user_id: user.id, emoji });
  return result.error ? { ok: false as const, error: friendly(result.error) } : { ok: true as const };
}

export async function setTyping(conversationId: string, isTyping: boolean) {
  const { supabase, user } = await requireServerUser();
  const { error } = await supabase.from('typing_indicators').upsert({ conversation_id: conversationId, user_id: user.id, is_typing: isTyping, updated_at: new Date().toISOString() }, { onConflict: 'conversation_id,user_id' });
  return error ? { ok: false as const, error: friendly(error) } : { ok: true as const };
}

export async function setPresence(isOnline: boolean) {
  const { supabase, user } = await requireServerUser();
  const now = new Date().toISOString();
  const { error } = await supabase.from('user_presence').upsert({ user_id: user.id, is_online: isOnline, last_seen: now, updated_at: now });
  return error ? { ok: false as const, error: friendly(error) } : { ok: true as const };
}

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
    const { data: existing, error: findError } = await supabase.from('suki_chat_conversations').select('id').eq('listing_id', listingId).eq('buyer_id', user.id).eq('seller_id', sellerId).maybeSingle();
    if (findError) throw findError;
    let conversationId = existing?.id;
    let wonConversationCreation = false;
    if (!conversationId) {
      const { data: conversation, error } = await supabase.from('suki_chat_conversations').insert({ listing_id: listingId, buyer_id: user.id, seller_id: sellerId, created_by: user.id, last_message: content }).select('id').single();
      if (error && error.code !== '23505') throw error;
      if (conversation?.id) { conversationId = conversation.id; wonConversationCreation = true; }
      if (!conversationId) {
        const { data: concurrent, error: concurrentError } = await supabase.from('suki_chat_conversations').select('id').eq('listing_id', listingId).eq('buyer_id', user.id).eq('seller_id', sellerId).maybeSingle();
        if (concurrentError || !concurrent?.id) throw concurrentError || new Error('Percakapan belum dapat dibuat.');
        conversationId = concurrent.id;
      }
    }
    const { error: participantError } = await supabase.from('suki_chat_participants').upsert([
      { conversation_id: conversationId, user_id: user.id, role: 'member' },
      { conversation_id: conversationId, user_id: sellerId, role: 'admin' },
    ], { onConflict: 'conversation_id,user_id' });
    if (participantError) throw participantError;
    const shouldSendInitial = wonConversationCreation || Boolean(existing?.id);
    if (shouldSendInitial) {
      const { error: messageError } = await supabase.from('suki_chat_messages').insert({ conversation_id: conversationId, sender_id: user.id, content });
      if (messageError) throw messageError;
      await supabase.from('suki_chat_conversations').update({ last_message: content, last_message_at: new Date().toISOString() }).eq('id', conversationId);
      await sendWhatsAppNotice(supabase, listingId, sellerId, content, user.id);
    }
    return { ok: true as const, conversationId };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

export async function sendMessage(conversationId: string, content: string, replyToMessageId?: string | null) {
  try {
    if (!conversationId || !content.trim()) return { ok: false as const, error: 'Pesan tidak boleh kosong.' };
    const { supabase, user } = await requireServerUser();
    const text = content.trim().slice(0, MAX_MESSAGE);
    const { data: conversation, error: conversationError } = await supabase.from('suki_chat_conversations').select('id,listing_id,seller_id,buyer_id').eq('id', conversationId).maybeSingle();
    if (conversationError) throw conversationError;
    if (!conversation || ![conversation.buyer_id, conversation.seller_id].includes(user.id)) return { ok: false as const, error: 'Kamu tidak memiliki akses ke percakapan ini.' };
    let replyTo: string | null = null;
    if (replyToMessageId) {
      const { data: target, error: targetError } = await supabase.from('suki_chat_messages').select('id,conversation_id,deleted').eq('id', replyToMessageId).maybeSingle();
      if (targetError) throw targetError;
      if (!target || target.conversation_id !== conversationId || target.deleted) return { ok: false as const, error: 'Pesan yang dibalas tidak ditemukan.' };
      replyTo = target.id;
    }
    const { data: message, error } = await supabase.from('suki_chat_messages').insert({ conversation_id: conversationId, sender_id: user.id, content: text, reply_to_message_id: replyTo }).select('id,conversation_id,sender_id,content,message_type,media_url,reply_to_message_id,edited,deleted,is_read,created_at').single();
    if (error) throw error;
    const withQuote = (await attachReplyQuotes(supabase, [message]))[0] || message;
    await supabase.from('suki_chat_conversations').update({ last_message: text, last_message_at: new Date().toISOString() }).eq('id', conversationId);
    if (user.id !== conversation.seller_id) await sendWhatsAppNotice(supabase, conversation.listing_id, conversation.seller_id, text, user.id);
    return { ok: true as const, data: withQuote };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

type ReplyQuote = { id: string; content: string | null; sender_id: string; deleted: boolean };

async function attachReplyQuotes(supabase: Awaited<ReturnType<typeof requireServerUser>>['supabase'], rows: Record<string, unknown>[]) {
  const ids = Array.from(new Set(rows.map((row) => row.reply_to_message_id).filter((value): value is string => typeof value === 'string' && value.length > 0)));
  const withQuotes: Record<string, unknown>[] = rows.map((row) => ({ ...row }));
  if (!ids.length) return withQuotes;
  const { data, error } = await supabase.from('suki_chat_messages').select('id,content,sender_id,deleted').in('id', ids);
  if (error || !data) return withQuotes;
  const quoteById = new Map(data.map((quote) => [quote.id as string, { id: quote.id as string, content: quote.content as string | null, sender_id: quote.sender_id as string, deleted: Boolean(quote.deleted) } as ReplyQuote]));
  for (const row of withQuotes) {
    row.reply_to = typeof row.reply_to_message_id === 'string' && row.reply_to_message_id ? quoteById.get(row.reply_to_message_id) || null : null;
  }
  return withQuotes;
}

export async function getMessageQuote(messageId: string) {
  const { supabase, user } = await requireServerUser();
  const { data: target, error } = await supabase.from('suki_chat_messages').select('id,conversation_id,content,sender_id,deleted').eq('id', messageId).maybeSingle();
  if (error) return { ok: false as const, error: friendly(error) };
  if (!target || target.deleted) return { ok: false as const, error: 'Pesan tidak ditemukan.' };
  const { data: member } = await supabase.from('suki_chat_participants').select('id').eq('conversation_id', target.conversation_id).eq('user_id', user.id).maybeSingle();
  if (!member) return { ok: false as const, error: 'Kamu bukan anggota percakapan ini.' };
  return { ok: true as const, data: { id: target.id, content: target.content, sender_id: target.sender_id, deleted: target.deleted } };
}

export async function getConversationPresence(conversationId: string) {
  const { supabase, user } = await requireServerUser();
  const { data: member } = await supabase.from('suki_chat_participants').select('id').eq('conversation_id', conversationId).eq('user_id', user.id).maybeSingle();
  if (!member) return { ok: false as const, error: 'Kamu bukan anggota percakapan ini.', data: [] };
  const { data: participants } = await supabase.from('suki_chat_participants').select('user_id,last_read_at').eq('conversation_id', conversationId).neq('user_id', user.id).limit(20);
  const others = participants || [];
  if (!others.length) return { ok: true as const, data: [] };
  const { data: presenceRows } = await supabase.from('suki_chat_presence').select('user_id,is_online,last_seen').in('user_id', others.map((participant) => participant.user_id));
  const presenceByUser = new Map((presenceRows || []).map((row) => [row.user_id as string, row]));
  return {
    ok: true as const,
    data: others.map((participant) => {
      const presence = presenceByUser.get(participant.user_id as string);
      return { user_id: participant.user_id as string, is_online: Boolean(presence?.is_online), last_seen: (presence?.last_seen as string) || null, last_read_at: (participant.last_read_at as string) || null };
    }),
  };
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
  const { data, error } = await supabase.from('suki_chat_conversations').select('id,type,name,avatar_url,last_message,last_message_at,updated_at,suki_chat_participants!inner(user_id,last_read_at,is_muted,is_archived)').eq('suki_chat_participants.user_id', user.id).eq('suki_chat_participants.is_archived', false).order('updated_at', { ascending: false }).limit(50);
  if (error) return { ok: false as const, error: friendly(error), data: [] };
  return { ok: true as const, data: data || [] };
}

export async function getChatMessages(conversationId: string, before?: string) {
  const { supabase, user } = await requireServerUser();
  const { data: member } = await supabase.from('suki_chat_participants').select('id').eq('conversation_id', conversationId).eq('user_id', user.id).maybeSingle();
  if (!member) return { ok: false as const, error: 'Kamu bukan anggota percakapan ini.', data: [] };
  let query = supabase.from('suki_chat_messages').select('id,conversation_id,sender_id,content,message_type,media_url,media_metadata,reply_to_message_id,edited,deleted,is_read,created_at').eq('conversation_id', conversationId).eq('deleted', false).order('created_at', { ascending: false }).limit(50);
  if (before) query = query.lt('created_at', before);
  const { data, error } = await query;
  if (error) return { ok: false as const, error: friendly(error), data: [] };
  const rows = data || [];
  const withQuotes = await attachReplyQuotes(supabase, rows as Record<string, unknown>[]);
  return { ok: true as const, data: withQuotes.reverse(), hasMore: rows.length === 50 };
}

export async function markChatRead(conversationId: string) {
  const { supabase, user } = await requireServerUser();
  const { error } = await supabase.from('suki_chat_participants').update({ last_read_at: new Date().toISOString() }).eq('conversation_id', conversationId).eq('user_id', user.id);
  if (error) return { ok: false as const, error: friendly(error) };
  // Best-effort: tandai pesan lawan bicara sebagai dibaca (RLS hanya mengizinkan bila pembaca pengirim/admin).
  // UI juga menghitung status dibaca dari last_read_at peserta lain, jadi centang biru tetap akurat.
  await supabase.from('suki_chat_messages').update({ is_read: true }).eq('conversation_id', conversationId).neq('sender_id', user.id).eq('is_read', false).eq('deleted', false);
  return { ok: true as const };
}

export async function setMessageReaction(messageId: string, emoji: string) {
  const { supabase, user } = await requireServerUser();
  const { data: existing } = await supabase.from('suki_chat_reactions').select('id').eq('message_id', messageId).eq('user_id', user.id).eq('emoji', emoji).maybeSingle();
  const result = existing ? await supabase.from('suki_chat_reactions').delete().eq('id', existing.id) : await supabase.from('suki_chat_reactions').insert({ message_id: messageId, user_id: user.id, emoji });
  return result.error ? { ok: false as const, error: friendly(result.error) } : { ok: true as const };
}

export async function setTyping(conversationId: string, isTyping: boolean) {
  const { supabase, user } = await requireServerUser();
  const { error } = await supabase.from('suki_chat_typing').upsert({ conversation_id: conversationId, user_id: user.id, is_typing: isTyping, updated_at: new Date().toISOString() }, { onConflict: 'conversation_id,user_id' });
  return error ? { ok: false as const, error: friendly(error) } : { ok: true as const };
}

export async function setPresence(isOnline: boolean) {
  const { supabase, user } = await requireServerUser();
  const now = new Date().toISOString();
  const { error } = await supabase.from('suki_chat_presence').upsert({ user_id: user.id, is_online: isOnline, last_seen: now, updated_at: now });
  return error ? { ok: false as const, error: friendly(error) } : { ok: true as const };
}


function escapeLikePattern(value: string) { return value.replace(/[\\%_]/g, (character) => `\\${character}`); }

export async function searchChatMessages(conversationId: string, query: string, limit = 25) {
  try {
    const normalized = query.trim().slice(0, 120);
    if (!conversationId || normalized.length < 2) return { ok: true as const, data: [] };
    const safeLimit = Math.min(Math.max(limit, 1), 50);
    const { supabase, user } = await requireServerUser();
    const { data: member } = await supabase.from('suki_chat_participants').select('id').eq('conversation_id', conversationId).eq('user_id', user.id).maybeSingle();
    if (!member) return { ok: false as const, error: 'Kamu bukan anggota percakapan ini.', data: [] };
    const pattern = `%${escapeLikePattern(normalized)}%`;
    const { data, error } = await supabase.from('suki_chat_messages').select('id,conversation_id,sender_id,content,message_type,media_url,reply_to_message_id,edited,deleted,is_read,created_at').eq('conversation_id', conversationId).eq('deleted', false).ilike('content', pattern).order('created_at', { ascending: false }).limit(safeLimit);
    if (error) throw error;
    return { ok: true as const, data: (data || []).reverse() };
  } catch (error) { return { ok: false as const, error: friendly(error), data: [] }; }
}

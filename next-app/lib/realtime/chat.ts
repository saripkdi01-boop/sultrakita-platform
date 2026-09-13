import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type ChatMessage = { id: string; conversation_id: string; sender_id: string; content: string | null; created_at: string; [key: string]: unknown };
type TypingRow = { user_id: string; is_typing: boolean };
export type InboxMessage = Pick<ChatMessage, 'conversation_id' | 'sender_id' | 'content' | 'created_at'>;

export function subscribeToChat(conversationId: string, handlers: { onMessage: (message: ChatMessage) => void; onTyping: (row: TypingRow) => void }) {
  if (!supabase) return null;
  const channel: RealtimeChannel = supabase.channel(`suki-chat:${conversationId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'suki_chat_messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => handlers.onMessage(payload.new as ChatMessage))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'suki_chat_typing', filter: `conversation_id=eq.${conversationId}` }, (payload) => handlers.onTyping(payload.new as TypingRow));
  void channel.subscribe();
  return channel;
}

export async function unsubscribeFromChat(channel: RealtimeChannel | null) {
  if (channel && supabase) await supabase.removeChannel(channel);
}

export function subscribeToInbox(onMessage: (message: InboxMessage) => void) {
  if (!supabase) return null;
  const channel: RealtimeChannel = supabase.channel('suki-chat:inbox')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'suki_chat_messages' }, (payload) => onMessage(payload.new as InboxMessage));
  void channel.subscribe();
  return channel;
}

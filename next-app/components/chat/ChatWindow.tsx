'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { sendMessage } from '@/lib/actions/chat';

type Message = { id: string; conversation_id: string; sender_id: string; content: string; created_at: string; is_read?: boolean };
type Props = { conversationId: string; currentUserId: string; initialMessages?: Message[] };
export function ChatWindow({ conversationId, currentUserId, initialMessages = [] }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages); const [text, setText] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const client = supabase; if (!client) return; const channel = client.channel(`chat:${conversationId}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, payload => { const message = payload.new as Message; setMessages(current => current.some(item => item.id === message.id) ? current : [...current, message]); }).subscribe(); return () => { void client.removeChannel(channel); }; }, [conversationId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!text.trim() || loading) return; const content = text.trim(); setText(''); setLoading(true); setError(''); const result = await sendMessage(conversationId, content); setLoading(false); if (!result.ok) { setText(content); setError(result.error || 'Pesan belum terkirim.'); return; } if (result.data) setMessages(current => current.some(item => item.id === result.data.id) ? current : [...current, result.data as Message]); }
  return <div className="chat-window"><div className="chat-messages" aria-live="polite">{messages.length ? messages.map(message => <div className={`chat-bubble ${message.sender_id === currentUserId ? 'mine' : 'theirs'}`} key={message.id}><span>{message.content}</span><small>{new Date(message.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</small></div>) : <div className="chat-empty">Belum ada pesan. Mulai percakapan dengan seller.</div>}<div ref={endRef}/></div>{error && <p className="chat-error" role="alert">{error}</p>}<form className="chat-composer" onSubmit={submit}><input value={text} onChange={event => setText(event.target.value)} placeholder="Tulis pesan..." aria-label="Tulis pesan" maxLength={4000}/><button disabled={loading || !text.trim()} aria-label="Kirim pesan"><Send size={16}/></button></form></div>;
}

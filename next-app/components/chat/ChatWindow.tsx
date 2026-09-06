'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, CheckCheck, FilePlus2, Heart, MoreHorizontal, Phone, Reply, Send, Smile, Video } from 'lucide-react';
import { getChatMessages, markChatRead, sendMessage, setMessageReaction, setTyping } from '@/lib/actions/chat';
import { subscribeToChat, unsubscribeFromChat } from '@/lib/realtime/chat';

type Message = { id: string; conversation_id: string; sender_id: string; content: string | null; message_type?: string; media_url?: string | null; reply_to_message_id?: string | null; edited?: boolean; deleted?: boolean; is_read?: boolean; created_at: string };
type Props = { conversationId: string; currentUserId: string; initialMessages?: Message[]; onBack?: () => void };

function messageTime(value: string) { return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }

export function ChatWindow({ conversationId, currentUserId, initialMessages = [], onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | null>(null);

  useEffect(() => { let active = true; getChatMessages(conversationId).then((result) => { if (active && result.ok) setMessages(result.data as Message[]); }); void markChatRead(conversationId); return () => { active = false; }; }, [conversationId]);
  useEffect(() => { const channel = subscribeToChat(conversationId, { onMessage: (message) => { setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message as Message]); void markChatRead(conversationId); }, onTyping: (row) => { if (row.user_id === currentUserId) return; setTypingUsers((current) => row.is_typing ? Array.from(new Set([...current, row.user_id])) : current.filter((id) => id !== row.user_id)); } }); return () => { void unsubscribeFromChat(channel); }; }, [conversationId, currentUserId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typingUsers]);

  function onTextChange(value: string) { setText(value); void setTyping(conversationId, Boolean(value.trim())); if (typingTimer.current) window.clearTimeout(typingTimer.current); typingTimer.current = window.setTimeout(() => { void setTyping(conversationId, false); }, 1500); }
  async function submit(event: React.FormEvent) { event.preventDefault(); if ((!text.trim() && !attachment) || loading) return; const content = text.trim() || `Lampiran: ${attachment?.name}`; setText(''); setAttachment(null); setLoading(true); setError(''); const result = await sendMessage(conversationId, content); setLoading(false); void setTyping(conversationId, false); if (!result.ok) { setText(content); setError(result.error || 'Pesan belum terkirim.'); return; } if (result.data) setMessages((current) => current.some((item) => item.id === result.data.id) ? current : [...current, result.data as Message]); setReplyTo(null); }

  return <div className="chat-window"><header className="chat-conversation-header"><button className="chat-back-button" onClick={onBack} aria-label="Kembali ke daftar chat"><ArrowLeft size={19} /></button><span className="chat-avatar-wrap"><span className="chat-avatar chat-avatar-fallback">SK</span><i className="chat-online-dot" /></span><div className="chat-conversation-title"><strong>Seller SultraKita</strong><span>{typingUsers.length ? 'Sedang mengetik...' : 'Aktif sekarang'}</span></div><div className="chat-conversation-actions"><button aria-label="Panggilan suara"><Phone size={17} /></button><button aria-label="Panggilan video"><Video size={18} /></button><button aria-label="Opsi percakapan"><MoreHorizontal size={18} /></button></div></header><div className="chat-day-divider"><span>Hari ini</span></div><div className="chat-messages" aria-live="polite">{messages.length ? messages.map((message) => { const mine = message.sender_id === currentUserId; return <div className={`chat-message-row ${mine ? 'mine' : 'theirs'}`} key={message.id}><div className={`chat-bubble ${mine ? 'mine' : 'theirs'}`}><span>{message.reply_to_message_id && <small className="chat-reply-label"><Reply size={11} /> Membalas pesan</small>}{message.deleted ? 'Pesan dihapus' : message.content}</span><small className="chat-message-meta">{message.edited ? 'diedit · ' : ''}{messageTime(message.created_at)} {mine && (message.is_read ? <CheckCheck size={13} /> : <Check size={13} />)}</small><span className="chat-bubble-actions"><button onClick={() => void setMessageReaction(message.id, '❤️')} aria-label="Sukai pesan"><Heart size={12} /></button><button onClick={() => setReplyTo(message)} aria-label="Balas pesan"><Reply size={12} /></button></span></div></div>; }) : <div className="chat-empty"><span>👋</span><strong>Mulai percakapan</strong><small>Jelaskan kebutuhanmu kepada seller.</small></div>}{typingUsers.length > 0 && <div className="chat-typing"><i /><i /><i /> Seller sedang mengetik</div>}<div ref={endRef} /></div>{error && <p className="chat-error" role="alert">{error}</p>}{replyTo && <div className="chat-reply-bar"><span><Reply size={13} /> Membalas: {replyTo.content}</span><button onClick={() => setReplyTo(null)} aria-label="Batalkan balasan">×</button></div>}<form className="chat-composer" onSubmit={submit}><label className="chat-attach" aria-label="Lampirkan file"><FilePlus2 size={17} /><input type="file" className="hidden" accept="image/*,video/*,audio/*,.pdf" onChange={(event) => setAttachment(event.target.files?.[0] || null)} /></label><input value={text} onChange={(event) => onTextChange(event.target.value)} placeholder={attachment ? attachment.name : 'Tulis pesan...'} aria-label="Tulis pesan" maxLength={4000} /><button type="button" className="chat-emoji" aria-label="Tambahkan emoji"><Smile size={17} /></button><button className="chat-send" disabled={loading || (!text.trim() && !attachment)} aria-label="Kirim pesan"><Send size={16} /></button></form></div>;
}

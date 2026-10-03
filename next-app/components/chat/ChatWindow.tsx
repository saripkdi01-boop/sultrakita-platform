'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, CheckCheck, FilePlus2, Heart, MoreHorizontal, Phone, Reply, Search, Send, Smile, Video, X } from 'lucide-react';
import { getChatMessages, getConversationPresence, getMessageQuote, markChatRead, searchChatMessages, sendMessage, setMessageReaction, setPresence, setTyping } from '@/lib/actions/chat';
import { subscribeToChat, unsubscribeFromChat } from '@/lib/realtime/chat';
import { usePreferences } from '@/lib/preferences';
import { dictChatNews, timeLocale } from '@/lib/i18n/dict-chatnews';

type ReplyQuote = { id: string; content: string | null; sender_id: string; deleted: boolean };
type Message = { id: string; conversation_id: string; sender_id: string; content: string | null; message_type?: string; media_url?: string | null; reply_to_message_id?: string | null; reply_to?: ReplyQuote | null; edited?: boolean; deleted?: boolean; is_read?: boolean; created_at: string };
type PresenceOther = { user_id: string; is_online: boolean; last_seen: string | null; last_read_at: string | null };
type Props = { conversationId: string; currentUserId: string; initialMessages?: Message[]; conversationName?: string; conversationAvatar?: string | null; onBack?: () => void; onConversationRead?: (conversationId: string) => void };

function messageTime(value: string, locale: string) { return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
function initials(name: string) { return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }
function timeAgoId(value: string | null, t: Record<string, string>, locale: string) {
  if (!value) return '';
  const diffMs = Date.now() - new Date(value).getTime();
  if (diffMs < 60000) return t.chatJustNow;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return t.chatMinAgo.replace('{n}', String(minutes));
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t.chatHourAgo.replace('{n}', String(hours));
  const days = Math.floor(hours / 24);
  if (days === 1) return t.chatYesterday;
  if (days < 7) return t.chatDaysAgo.replace('{n}', String(days));
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}
function highlightText(content: string, query: string) {
  const normalized = query.trim();
  if (!normalized) return content;
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = content.split(new RegExp(`(${escaped})`, 'ig'));
  return parts.map((part, index) => part.toLowerCase() === normalized.toLowerCase() ? <mark key={`${part}-${index}`}>{part}</mark> : part);
}

export function ChatWindow({ conversationId, currentUserId, initialMessages = [], conversationName, conversationAvatar, onBack, onConversationRead }: Props) {
  const { language } = usePreferences();
  const t = dictChatNews[language] ?? dictChatNews.id;
  const locale = timeLocale(language);
  const name = conversationName || t.chatPrivateConversation;
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [presenceOthers, setPresenceOthers] = useState<PresenceOther[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null);
  const [reactionMessageId, setReactionMessageId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | null>(null);

  useEffect(() => { let active = true; setSearchOpen(false); setSearchQuery(''); setSearchResults([]); setSearchError(''); setActiveSearchId(null); setHasMore(false); setReplyTo(null); setPresenceOthers([]); getChatMessages(conversationId).then((result) => { if (active && result.ok) { setMessages(result.data as Message[]); setHasMore(Boolean(result.hasMore)); } }); void markChatRead(conversationId).then((result) => { if (active && result.ok) onConversationRead?.(conversationId); }); return () => { active = false; }; }, [conversationId, onConversationRead]);

  useEffect(() => {
    const channel = subscribeToChat(conversationId, {
      onMessage: (message) => {
        const incoming = message as Message;
        setMessages((current) => {
          if (current.some((item) => item.id === incoming.id)) return current;
          const local = incoming.reply_to_message_id ? current.find((item) => item.id === incoming.reply_to_message_id) : undefined;
          const reply_to = local ? { id: local.id, content: local.content, sender_id: local.sender_id, deleted: Boolean(local.deleted) } : null;
          return [...current, { ...incoming, reply_to }];
        });
        if (incoming.reply_to_message_id) {
          void getMessageQuote(incoming.reply_to_message_id).then((result) => {
            if (result.ok && result.data) setMessages((current) => current.map((item) => item.id === incoming.id ? { ...item, reply_to: result.data as ReplyQuote } : item));
          });
        }
        void markChatRead(conversationId);
      },
      onTyping: (row) => { if (row.user_id === currentUserId) return; setTypingUsers((current) => row.is_typing ? Array.from(new Set([...current, row.user_id])) : current.filter((id) => id !== row.user_id)); },
      onMessageUpdate: (message) => {
        const updated = message as Message;
        setMessages((current) => current.map((item) => item.id === updated.id ? { ...item, is_read: updated.is_read ?? item.is_read, edited: updated.edited ?? item.edited } : item));
      },
      onReadReceipt: (row) => {
        if (row.user_id === currentUserId) return;
        setPresenceOthers((current) => current.map((item) => item.user_id === row.user_id ? { ...item, last_read_at: row.last_read_at } : item));
      },
    });
    return () => { void unsubscribeFromChat(channel); };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    let active = true;
    async function refreshPresence() {
      const result = await getConversationPresence(conversationId);
      if (active && result.ok) setPresenceOthers(result.data as PresenceOther[]);
    }
    void setPresence(true);
    void refreshPresence();
    const heartbeat = window.setInterval(() => { void setPresence(true); }, 60000);
    const poller = window.setInterval(() => { void refreshPresence(); }, 30000);
    function onVisibility() {
      if (document.hidden) { void setPresence(false); }
      else { void setPresence(true); void refreshPresence(); }
    }
    function onUnload() { void setPresence(false); }
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      active = false;
      window.clearInterval(heartbeat);
      window.clearInterval(poller);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('beforeunload', onUnload);
      void setPresence(false);
    };
  }, [conversationId]);

  useEffect(() => () => { if (typingTimer.current) window.clearTimeout(typingTimer.current); void setTyping(conversationId, false); }, [conversationId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typingUsers]);

  const other = presenceOthers.length === 1 ? presenceOthers[0] : null;
  const onlineCount = presenceOthers.filter((item) => item.is_online).length;
  let presenceText = '';
  let presenceClass = 'chat-presence-unknown';
  if (typingUsers.length) {
    presenceText = t.chatTyping;
    presenceClass = '';
  } else if (other) {
    if (other.is_online) { presenceText = t.chatOnline; presenceClass = ''; }
    else if (other.last_seen) { presenceText = `${t.chatLastActive} ${timeAgoId(other.last_seen, t, locale)}`; presenceClass = 'chat-presence-off'; }
  } else if (presenceOthers.length > 1) {
    if (onlineCount > 0) { presenceText = t.chatOnlineCount.replace('{n}', String(onlineCount)); presenceClass = ''; }
    else { presenceText = ''; presenceClass = 'chat-presence-off'; }
  }

  function isMessageRead(message: Message) {
    if (message.sender_id !== currentUserId) return false;
    if (message.is_read) return true;
    const otherReadAt = other?.last_read_at;
    if (!otherReadAt) return false;
    return new Date(otherReadAt).getTime() >= new Date(message.created_at).getTime();
  }

  function onTextChange(value: string) { setText(value); void setTyping(conversationId, Boolean(value.trim())); if (typingTimer.current) window.clearTimeout(typingTimer.current); typingTimer.current = window.setTimeout(() => { void setTyping(conversationId, false); }, 1500); }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if ((!text.trim() && !attachment) || loading) return;
    const content = text.trim() || `${t.chatAttachment}: ${attachment?.name}`;
    const currentReplyTo = replyTo;
    setText(''); setAttachment(null); setReplyTo(null); setLoading(true); setError('');
    const result = await sendMessage(conversationId, content, currentReplyTo?.id ?? null);
    setLoading(false); void setTyping(conversationId, false);
    if (!result.ok) { setText(content); setReplyTo(currentReplyTo); setError(result.error || t.chatSendFailed); return; }
    if (result.data) setMessages((current) => current.some((item) => item.id === result.data.id) ? current : [...current, result.data as Message]);
  }
  async function loadOlder() { if (loadingOlder || !hasMore || !messages.length) return; setLoadingOlder(true); const oldest = messages[0].created_at; const result = await getChatMessages(conversationId, oldest); setLoadingOlder(false); if (!result.ok) { setError(result.error || t.chatHistoryLoadFailed); return; } const older = result.data as Message[]; setMessages((current) => [...older, ...current.filter((item) => !older.some((row) => row.id === item.id))]); setHasMore(Boolean(result.hasMore)); }
  async function runSearch(event: React.FormEvent) { event.preventDefault(); const query = searchQuery.trim(); if (query.length < 2) { setSearchResults([]); setSearchError(query ? t.chatSearchMinChars : ''); return; } setSearchLoading(true); setSearchError(''); const result = await searchChatMessages(conversationId, query); setSearchLoading(false); if (!result.ok) { setSearchResults([]); setSearchError(result.error || t.chatSearchUnavailable); return; } const found = result.data as Message[]; setSearchResults(found); setMessages((current) => [...current, ...found.filter((item) => !current.some((existing) => existing.id === item.id))].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())); }
  function jumpToMessage(message: Message) { setActiveSearchId(message.id); window.requestAnimationFrame(() => document.getElementById(`chat-message-${message.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })); window.setTimeout(() => setActiveSearchId(null), 1600); }
  function closeSearch() { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); setSearchError(''); setActiveSearchId(null); }
  function showNotice(message: string) { setNotice(message); window.setTimeout(() => setNotice(''), 2600); }
  async function reactToMessage(messageId: string, emoji = '❤️') { setReactionMessageId(messageId); const result = await setMessageReaction(messageId, emoji); setReactionMessageId(null); showNotice(result.ok ? t.chatReacted.replace('{emoji}', emoji) : (result.error || t.chatReactionFailed)); }
  function insertEmoji(emoji: string) { setText((value) => `${value}${emoji}`); setNotice(t.chatEmojiAdded); window.setTimeout(() => setNotice(''), 1600); }

  return (
    <div className="chat-window">
      <header className="chat-conversation-header">
        <button className="chat-back-button" onClick={onBack} aria-label={t.chatBackToList}><ArrowLeft size={19} /></button>
        <span className="chat-avatar-wrap">
          {conversationAvatar ? <img className="chat-avatar" src={conversationAvatar} alt="" /> : <span className="chat-avatar chat-avatar-fallback">{initials(name)}</span>}
          {other?.is_online && <i className="chat-online-dot" aria-label={t.chatOnline} />}
        </span>
        <div className="chat-conversation-title">
          <strong>{name}</strong>
          <span className={presenceClass}>{presenceText}</span>
        </div>
        <div className="chat-conversation-actions">
          <button aria-label={t.chatSearchMessages} aria-pressed={searchOpen} onClick={() => setSearchOpen((value) => !value)}><Search size={17} /></button>
          <button aria-label={t.chatVoiceCall} onClick={() => showNotice(t.chatVoiceCallSoon)}><Phone size={17} /></button>
          <button aria-label={t.chatVideoCall} onClick={() => showNotice(t.chatVideoCallSoon)}><Video size={18} /></button>
          <button aria-label={t.chatConversationOptions} onClick={() => showNotice(t.chatManageHint)}><MoreHorizontal size={18} /></button>
        </div>
      </header>
      {searchOpen && (
        <section className="chat-message-search" aria-label={t.chatSearchInConversation}>
          <form onSubmit={runSearch}>
            <Search size={16} />
            <input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t.chatSearchInConversation} aria-label={t.chatSearchInConversation} />
            <button type="button" onClick={closeSearch} aria-label={t.chatCloseMessageSearch}><X size={15} /></button>
            <button className="chat-message-search-submit" type="submit" disabled={searchLoading} aria-label={t.chatRunSearch}><Search size={14} /></button>
          </form>
          {searchError && <p className="chat-message-search-error" role="alert">{searchError}</p>}
          {searchResults.length > 0 && (
            <div className="chat-message-search-results" role="listbox">
              <div className="chat-message-search-summary">{t.chatResultsFound.replace('{n}', String(searchResults.length))}</div>
              {searchResults.map((message) => (
                <button type="button" role="option" key={message.id} onClick={() => jumpToMessage(message)}>
                  <span>{highlightText(message.content || t.chatAttachment, searchQuery)}</span>
                  <time>{messageTime(message.created_at, locale)}</time>
                </button>
              ))}
            </div>
          )}
          {!searchLoading && searchQuery.trim().length >= 2 && !searchResults.length && !searchError && <p className="chat-message-search-empty">{t.chatNoMessageMatch}</p>}
        </section>
      )}
      {hasMore && <button type="button" className="chat-load-older" onClick={() => void loadOlder()} disabled={loadingOlder}>{loadingOlder ? t.chatLoadingHistory : t.chatLoadOlder}</button>}
      <div className="chat-day-divider"><span>{t.chatToday}</span></div>
      <div className="chat-messages" aria-live="polite">
        {messages.length ? messages.map((message) => {
          const mine = message.sender_id === currentUserId;
          const read = isMessageRead(message);
          return (
            <div id={`chat-message-${message.id}`} className={`chat-message-row ${mine ? 'mine' : 'theirs'} ${activeSearchId === message.id ? 'chat-message-search-hit' : ''}`} key={message.id}>
              <div className={`chat-bubble ${mine ? 'mine' : 'theirs'}`}>
                {message.reply_to && (
                  <span className="chat-reply-quote">
                    <strong><Reply size={10} /> {message.reply_to.sender_id === currentUserId ? t.chatYou : name}</strong>
                    <p>{message.reply_to.deleted ? t.chatMessageDeleted : (message.reply_to.content || t.chatAttachment)}</p>
                  </span>
                )}
                <span>{message.deleted ? t.chatMessageDeleted : highlightText(message.content || '', searchQuery)}</span>
                <small className="chat-message-meta">
                  {message.edited ? `${t.chatEdited} · ` : ''}{messageTime(message.created_at, locale)}{' '}
                  {mine && (read
                    ? <CheckCheck size={13} className="chat-tick-read" aria-label={t.chatRead} />
                    : <Check size={13} className="chat-tick-sent" aria-label={t.chatSent} />)}
                  <button type="button" className="chat-reply-touch" onClick={() => setReplyTo(message)} aria-label={t.chatReply}><Reply size={12} /></button>
                </small>
                <span className="chat-bubble-actions">
                  <button onClick={() => void reactToMessage(message.id)} disabled={reactionMessageId === message.id} aria-label={t.chatLikeMessage}><Heart size={12} /></button>
                  <button onClick={() => setReplyTo(message)} aria-label={t.chatReply}><Reply size={12} /></button>
                </span>
              </div>
            </div>
          );
        }) : (
          <div className="chat-empty"><span>👋</span><strong>{t.chatStartConversation}</strong><small>{t.chatDescribeNeed}</small></div>
        )}
        {typingUsers.length > 0 && <div className="chat-typing"><i /><i /><i /> {t.chatTypingShort}</div>}
        <div ref={endRef} />
      </div>
      {notice && <p className="chat-notice" role="status">{notice}</p>}
      {error && <p className="chat-error" role="alert">{error}</p>}
      {replyTo && (
        <div className="chat-reply-bar">
          <span><Reply size={13} /> {t.chatReplying}: {(replyTo.deleted ? t.chatMessageDeleted : (replyTo.content || t.chatAttachment)).slice(0, 90)}</span>
          <button onClick={() => setReplyTo(null)} aria-label={t.chatCancelReply}>×</button>
        </div>
      )}
      <form className="chat-composer" onSubmit={submit}>
        <label className="chat-attach" aria-label={t.chatAttachFile}><FilePlus2 size={17} /><input type="file" className="hidden" accept="image/*,video/*,audio/*,.pdf" onChange={(event) => setAttachment(event.target.files?.[0] || null)} /></label>
        <input value={text} onChange={(event) => onTextChange(event.target.value)} placeholder={attachment ? attachment.name : t.chatWriteMessage} aria-label={t.chatWriteMessage} maxLength={4000} />
        <button type="button" className="chat-emoji" aria-label={t.chatAddEmoji} onClick={() => insertEmoji('😊')}><Smile size={17} /></button>
        <div className="chat-quick-emojis" aria-label={t.chatAddEmoji}>
          <button type="button" onClick={() => insertEmoji('👍')} aria-label={t.chatAddThumbsUp}>👍</button>
          <button type="button" onClick={() => insertEmoji('❤️')} aria-label={t.chatAddHeart}>❤️</button>
          <button type="button" onClick={() => insertEmoji('🙏')} aria-label={t.chatAddThanks}>🙏</button>
        </div>
        <button className="chat-send" disabled={loading || (!text.trim() && !attachment)} aria-label={t.chatSendMessage}><Send size={16} /></button>
      </form>
    </div>
  );
}

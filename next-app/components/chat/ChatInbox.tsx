'use client';

import { CheckCheck, Filter, MessageCircle, MoreHorizontal, Plus, Search, Settings2, Users, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getChatInbox, setPresence } from '@/lib/actions/chat';
import { subscribeToInbox, unsubscribeFromChat } from '@/lib/realtime/chat';
import { usePreferences } from '@/lib/preferences';
import { dictChatNews, timeLocale } from '@/lib/i18n/dict-chatnews';
import { ChatWindow } from './ChatWindow';

type Participant = { user_id: string; last_read_at?: string | null; is_muted?: boolean; is_archived?: boolean };
type Conversation = { id: string; type: 'private' | 'group'; name?: string | null; avatar_url?: string | null; last_message?: string | null; last_message_at?: string; updated_at?: string; conversation_participants?: Participant[] };
type InboxFilter = 'all' | 'unread' | 'groups';

function initials(name: string) { return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }
function timeLabel(value: string | undefined, locale: string) { if (!value) return ''; return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
function isUnread(item: Conversation, userId: string) { const participant = item.conversation_participants?.find((row) => row.user_id === userId); return Boolean(item.last_message_at && (!participant?.last_read_at || new Date(item.last_message_at) > new Date(participant.last_read_at))); }
function fallbackName(type: Conversation['type'], t: Record<string, string>) { return type === 'group' ? t.chatGroupSultra : t.chatPrivateConversation; }

export function ChatInbox({ onUnreadCountChange }: { onUnreadCountChange?: (count: number) => void }) {
  const { language } = usePreferences();
  const t = dictChatNews[language] ?? dictChatNews.id;
  const locale = timeLocale(language);
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<InboxFilter>('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const client = supabase;
    if (!client) { setError(t.chatErrorNoSupabase); setLoading(false); return; }
    client.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      if (!data.user) { setError(t.chatErrorLoginRequired); setLoading(false); return; }
      setUserId(data.user.id);
      await setPresence(true);
      const result = await getChatInbox();
      if (!active) return;
      if (result.ok) setItems(result.data as Conversation[]); else setError(result.error);
      setLoading(false);
    }).catch(() => { if (active) { setError(t.chatErrorLoadFailed); setLoading(false); } });
    return () => { active = false; void setPresence(false).catch(() => undefined); };
  }, [t]);

  useEffect(() => {
    if (!userId) return;
    const channel = subscribeToInbox((message) => {
      setItems((current) => {
        const existing = current.find((item) => item.id === message.conversation_id);
        if (!existing) return current;
        const readAt = selected === message.conversation_id ? message.created_at : undefined;
        const updated = { ...existing, last_message: message.content, last_message_at: message.created_at, updated_at: message.created_at, conversation_participants: existing.conversation_participants?.map((participant) => participant.user_id === userId && readAt ? { ...participant, last_read_at: readAt } : participant) };
        return [updated, ...current.filter((item) => item.id !== message.conversation_id)];
      });
    });
    return () => { void unsubscribeFromChat(channel); };
  }, [selected, userId]);

  const unreadCount = useMemo(() => items.filter((item) => isUnread(item, userId)).length, [items, userId]);
  useEffect(() => { onUnreadCountChange?.(unreadCount); }, [onUnreadCountChange, unreadCount]);
  const filteredItems = useMemo(() => items.filter((item) => {
    const name = item.name || fallbackName(item.type, t);
    const matchesQuery = `${name} ${item.last_message || ''}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'groups' ? item.type === 'group' : isUnread(item, userId));
    return matchesQuery && matchesFilter;
  }), [items, query, filter, userId, t]);
  const selectedConversation = items.find((item) => item.id === selected);
  const handleConversationRead = useCallback((conversationId: string) => {
    setItems((current) => current.map((item) => item.id === conversationId ? { ...item, conversation_participants: item.conversation_participants?.map((participant) => participant.user_id === userId ? { ...participant, last_read_at: item.last_message_at || new Date().toISOString() } : participant) } : item));
  }, [userId]);

  return <section className="chat-shell">
    <aside className={`chat-inbox ${selected ? 'chat-inbox-hidden-mobile' : ''}`}>
      <header className="chat-inbox-header"><div className="chat-brand"><span className="chat-brand-mark"><MessageCircle size={19} /></span><div><h1>SUKI Chat</h1><p>{t.chatLocalSubtitle}</p></div></div><div className="chat-header-actions"><button aria-label={t.chatNewConversation} title={t.chatNewConversation}><Plus size={17} /></button><button aria-label={t.chatSettings}><Settings2 size={17} /></button><button aria-label={t.chatOptions}><MoreHorizontal size={18} /></button></div></header>
      <div className="chat-stories" aria-label={t.chatActiveStories}><button className="chat-story"><span className="chat-story-avatar chat-story-own"><Users size={19} /><i><Plus size={11} /></i></span><span>{t.chatYourStory}</span></button>{['Wa Ode', 'La Ode', 'Rina', 'Budi', 'Siti'].map((name, index) => <button className="chat-story" key={name}><span className={`chat-story-avatar chat-story-${index + 1}`}>{name.slice(0, 1)}<i /></span><span>{name}</span></button>)}</div>
      <div className="chat-inbox-title"><div><span className="eyebrow">{t.chatLocalMessenger}</span><h2>{t.chatMessagesTitle}</h2></div><span className="chat-online-pill"><i /> {t.chatActive}</span></div>
      <label className="chat-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.chatSearchConversations} aria-label={t.chatSearchConversations} />{query && <button type="button" aria-label={t.chatClearSearch} onClick={() => setQuery('')}><X size={14} /></button>}</label>
      <div className="chat-filter-row" role="tablist" aria-label={t.chatFilterConversations}>{([['all', t.chatFilterAll], ['unread', `${t.chatFilterUnread}${unreadCount ? ` · ${unreadCount}` : ''}`], ['groups', t.chatFilterGroups]] as const).map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={filter === value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{value === 'unread' && <span className="chat-filter-dot" />}{value === 'groups' && <Users size={12} />}{label}</button>)}</div>
      {error && <p className="chat-error chat-inbox-error" role="alert">{error}</p>}
      <div className="chat-list" aria-label={t.chatContactList}>
        {loading ? <div className="chat-list-empty"><span className="chat-loading-dot" /><p>{t.chatLoadingConversations}</p></div> : filteredItems.length ? filteredItems.map((item) => {
          const name = item.name || fallbackName(item.type, t);
          const unread = isUnread(item, userId);
          return <button key={item.id} onClick={() => setSelected(item.id)} className={`chat-list-item ${selected === item.id ? 'selected' : ''} ${unread ? 'unread' : ''}`}><span className="chat-avatar-wrap">{item.avatar_url ? <img className="chat-avatar" src={item.avatar_url} alt="" /> : <span className="chat-avatar chat-avatar-fallback">{initials(name)}</span>}<i className="chat-online-dot" /></span><span className="chat-list-copy"><span className="chat-list-top"><strong>{name}</strong><time>{timeLabel(item.last_message_at, locale)}</time></span><span className="chat-list-bottom"><span>{item.last_message || t.chatNoMessages}</span>{unread ? <b className="chat-unread-dot" aria-label={t.chatFilterUnread} /> : item.type === 'group' ? <Users size={12} /> : <CheckCheck className="chat-delivered-icon" size={12} />}</span></span></button>;
        }) : <div className="chat-list-empty"><Filter size={30} /><p>{query ? t.chatNoResults : filter === 'unread' ? t.chatNoUnread : filter === 'groups' ? t.chatNoGroups : t.chatNoConversations}</p><small>{query ? t.chatTryOtherKeyword : t.chatStartFromMarketplace}</small></div>}
      </div>
    </aside>
    <div className={`chat-stage ${selected ? 'chat-stage-active-mobile' : ''}`}>{selected && userId ? <ChatWindow conversationId={selected} currentUserId={userId} conversationName={selectedConversation?.name || fallbackName(selectedConversation?.type ?? 'private', t)} conversationAvatar={selectedConversation?.avatar_url} onBack={() => setSelected(null)} onConversationRead={handleConversationRead} /> : <div className="chat-stage-empty"><span className="chat-empty-orb"><MessageCircle size={30} /></span><h2>{t.chatSelectConversation}</h2><p>{t.chatRealtimeHint}</p></div>}</div>
  </section>;
}

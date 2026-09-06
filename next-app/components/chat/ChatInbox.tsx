'use client';

import { MessageCircle, MoreHorizontal, Plus, Search, Settings2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getChatInbox, setPresence } from '@/lib/actions/chat';
import { ChatWindow } from './ChatWindow';

type Conversation = { id: string; type: 'private' | 'group'; name?: string | null; avatar_url?: string | null; last_message?: string | null; last_message_at?: string; conversation_participants?: Array<{ user_id: string; last_read_at?: string }> };

function initials(name: string) { return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }
function timeLabel(value?: string) { if (!value) return ''; return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }

export function ChatInbox() {
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const client = supabase;
    if (!client) { setError('Supabase belum dikonfigurasi.'); setLoading(false); return; }
    client.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      if (!data.user) { setError('Login diperlukan untuk membuka SUKI Chat.'); setLoading(false); return; }
      setUserId(data.user.id);
      await setPresence(true);
      const result = await getChatInbox();
      if (!active) return;
      if (result.ok) setItems(result.data as Conversation[]); else setError(result.error);
      setLoading(false);
    }).catch(() => { if (active) { setError('Percakapan belum dapat dimuat.'); setLoading(false); } });
    return () => { active = false; void setPresence(false).catch(() => undefined); };
  }, []);

  const filteredItems = useMemo(() => items.filter((item) => {
    const name = item.name || (item.type === 'group' ? 'Grup Sultra' : 'Percakapan pribadi');
    return `${name} ${item.last_message || ''}`.toLowerCase().includes(query.toLowerCase());
  }), [items, query]);

  return <section className="chat-shell">
    <aside className={`chat-inbox ${selected ? 'chat-inbox-hidden-mobile' : ''}`}>
      <header className="chat-inbox-header"><div className="chat-brand"><span className="chat-brand-mark"><MessageCircle size={19} /></span><div><h1>SUKI Chat</h1><p>Pesan warga Sultra</p></div></div><div className="chat-header-actions"><button aria-label="Pengaturan chat"><Settings2 size={17} /></button><button aria-label="Opsi chat"><MoreHorizontal size={18} /></button></div></header>
      <div className="chat-stories" aria-label="Cerita aktif"><button className="chat-story"><span className="chat-story-avatar chat-story-own"><Users size={19} /><i><Plus size={11} /></i></span><span>Cerita Anda</span></button>{['Wa Ode', 'La Ode', 'Rina', 'Budi', 'Siti'].map((name, index) => <button className="chat-story" key={name}><span className={`chat-story-avatar chat-story-${index + 1}`}>{name.slice(0, 1)}<i /></span><span>{name}</span></button>)}</div>
      <div className="chat-inbox-title"><div><span className="eyebrow">Messenger lokal</span><h2>Pesan</h2></div><span className="chat-online-pill"><i /> Aktif</span></div>
      <label className="chat-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari percakapan" aria-label="Cari percakapan" /></label>
      {error && <p className="chat-error chat-inbox-error" role="alert">{error}</p>}
      <div className="chat-list" aria-label="Daftar percakapan">
        {loading ? <div className="chat-list-empty"><span className="chat-loading-dot" /><p>Memuat percakapan...</p></div> : filteredItems.length ? filteredItems.map((item) => {
          const name = item.name || (item.type === 'group' ? 'Grup Sultra' : 'Percakapan pribadi');
          return <button key={item.id} onClick={() => setSelected(item.id)} className={`chat-list-item ${selected === item.id ? 'selected' : ''}`}><span className="chat-avatar-wrap">{item.avatar_url ? <img className="chat-avatar" src={item.avatar_url} alt="" /> : <span className="chat-avatar chat-avatar-fallback">{initials(name)}</span>}<i className="chat-online-dot" /></span><span className="chat-list-copy"><span className="chat-list-top"><strong>{name}</strong><time>{timeLabel(item.last_message_at)}</time></span><span className="chat-list-bottom"><span>{item.last_message || 'Belum ada pesan'}</span>{item.type === 'group' && <Users size={12} />}</span></span></button>;
        }) : <div className="chat-list-empty"><MessageCircle size={34} /><p>{query ? 'Percakapan tidak ditemukan' : 'Belum ada percakapan'}</p><small>{query ? 'Coba kata kunci lain.' : 'Hubungi seller dari Marketplace untuk memulai.'}</small></div>}
      </div>
    </aside>
    <div className={`chat-stage ${selected ? 'chat-stage-active-mobile' : ''}`}>{selected && userId ? <ChatWindow conversationId={selected} currentUserId={userId} onBack={() => setSelected(null)} /> : <div className="chat-stage-empty"><span className="chat-empty-orb"><MessageCircle size={30} /></span><h2>Pilih percakapan</h2><p>Pesan baru dengan seller dan warga akan muncul secara realtime.</p></div>}</div>
  </section>;
}

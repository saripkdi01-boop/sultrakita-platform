'use client';

import { Bell, BellRing, CheckCheck, ChevronRight, Heart, MessageCircle, Settings, ShoppingBag, UserPlus, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type NotificationKind = 'social' | 'marketplace' | 'property' | 'system' | 'activity';
type NotificationRow = { id: string; type: string | null; title: string; body: string | null; link: string | null; is_read: boolean; created_at: string };
type NotificationItem = NotificationRow & { kind: NotificationKind; time: string; href: string; unread: boolean; Icon: typeof Heart; tone: string };

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'Baru saja';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
  if (seconds < 172800) return 'Kemarin';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}
function present(row: NotificationRow): NotificationItem {
  const kind = (row.type || 'activity').toLowerCase() as NotificationKind;
  const visual = kind === 'social'
    ? { Icon: Heart, tone: 'notification-tone-coral' }
    : kind === 'marketplace'
      ? { Icon: ShoppingBag, tone: 'notification-tone-gold' }
      : kind === 'property'
        ? { Icon: BellRing, tone: 'notification-tone-teal' }
        : kind === 'system' || row.title.toLowerCase().includes('profil')
          ? { Icon: UserPlus, tone: 'notification-tone-purple' }
          : { Icon: MessageCircle, tone: 'notification-tone-teal' };
  return { ...row, kind, time: formatTime(row.created_at), href: row.link?.startsWith('/') ? row.link : '/beranda', unread: !row.is_read, ...visual };
}

export function NotificationCenter() {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const unreadCount = notifications.filter((item) => item.unread).length;
  const visibleNotifications = useMemo(() => filter === 'unread' ? notifications.filter((item) => item.unread) : notifications, [filter, notifications]);

  async function load(userIdOverride?: string) {
    if (!supabase) { setUserId(null); setNotifications([]); return; }
    const { data: auth } = await supabase.auth.getUser();
    const id = userIdOverride || auth.user?.id || null;
    setUserId(id);
    if (!id) { setNotifications([]); return; }
    const { data, error } = await supabase.from('notifications').select('id,type,title,body,link,is_read,created_at').eq('user_id', id).order('created_at', { ascending: false }).limit(30);
    if (!error) setNotifications(((data || []) as NotificationRow[]).map(present));
  }

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const client = supabase;
    void client.auth.getUser().then(({ data }) => { if (active) void load(data.user?.id); });
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => { void load(session?.user?.id); });
    return () => { active = false; listener.subscription.unsubscribe(); if (channelRef.current) client.removeChannel(channelRef.current); };
  }, []);

  useEffect(() => {
    if (!supabase || !userId) return;
    const client = supabase;
    if (channelRef.current) client.removeChannel(channelRef.current);
    channelRef.current = client.channel(`notifications:${userId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => { void load(userId); }).subscribe();
    return () => { if (channelRef.current) { client.removeChannel(channelRef.current); channelRef.current = null; } };
  }, [userId]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const handlePointerDown = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); document.removeEventListener('pointerdown', handlePointerDown); };
  }, [open]);

  async function markRead(ids: string[]) {
    if (!supabase || !userId || !ids.length) return;
    setNotifications((current) => current.map((item) => ids.includes(item.id) ? { ...item, unread: false, is_read: true } : item));
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).in('id', ids);
  }
  function openNotification(item: NotificationItem) { void markRead([item.id]); setOpen(false); if (item.href !== pathname) router.push(item.href); }
  function markAllAsRead() { void markRead(notifications.filter((item) => item.unread).map((item) => item.id)); }

  return <div className="notification-center" ref={rootRef}>
    <button type="button" className={`header-icon notification-trigger ${open ? 'is-open' : ''}`} aria-label={`Notifikasi${unreadCount ? `, ${unreadCount} belum dibaca` : ''}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((value) => !value)}><Bell size={19} aria-hidden="true" />{unreadCount > 0 && <i aria-label={`${unreadCount} notifikasi belum dibaca`}>{unreadCount > 9 ? '9+' : unreadCount}</i>}</button>
    {open && <section className="notification-panel" role="dialog" aria-label="Pusat notifikasi">
      <header className="notification-panel-header"><div><span className="eyebrow">SUKI Updates</span><h2>Notifikasi</h2></div><button type="button" className="notification-close" aria-label="Tutup notifikasi" onClick={() => setOpen(false)}><X size={17} /></button></header>
      <div className="notification-toolbar"><div className="notification-tabs" role="tablist" aria-label="Filter notifikasi"><button type="button" role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Semua</button><button type="button" role="tab" aria-selected={filter === 'unread'} className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Belum dibaca{unreadCount > 0 && <span>{unreadCount}</span>}</button></div>{unreadCount > 0 && <button type="button" className="notification-mark-all" onClick={markAllAsRead}><CheckCheck size={14} /> Tandai dibaca</button>}</div>
      <div className="notification-list">{visibleNotifications.length ? visibleNotifications.map((item) => <button type="button" key={item.id} className={`notification-item ${item.unread ? 'is-unread' : ''}`} onClick={() => openNotification(item)}><span className={`notification-item-icon ${item.tone}`}><item.Icon size={17} aria-hidden="true" /></span><span className="notification-item-content"><strong>{item.title}</strong><span>{item.body || 'Ada aktivitas baru di akun SultraKita.'}</span><small>{item.time}</small></span>{item.unread && <i className="notification-unread-dot" aria-label="Belum dibaca" />}</button>) : <div className="notification-empty"><CheckCheck size={24} /><strong>Belum ada notifikasi</strong><span>Aktivitas akunmu akan muncul di sini.</span></div>}</div>
      <footer className="notification-panel-footer"><button type="button" onClick={() => { setOpen(false); router.push('/marketplace/profile'); }}><Settings size={15} /> Pengaturan notifikasi <ChevronRight size={15} /></button></footer>
    </section>}
  </div>;
}

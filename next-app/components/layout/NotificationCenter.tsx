'use client';

import { Bell, BellRing, CheckCheck, ChevronRight, Heart, MessageCircle, Settings, ShoppingBag, UserPlus, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

type NotificationKind = 'social' | 'marketplace' | 'property' | 'system';
type NotificationItem = { id: string; kind: NotificationKind; title: string; body: string; time: string; href: string; unread: boolean; Icon: typeof Heart; tone: string };

const initialNotifications: NotificationItem[] = [
  { id: 'n-1', kind: 'social', title: 'Ayu Rahma menyukai cerita Anda', body: 'Lihat interaksi terbaru di Ruang Warga.', time: '5 menit lalu', href: '/beranda', unread: true, Icon: Heart, tone: 'notification-tone-coral' },
  { id: 'n-2', kind: 'social', title: 'Fajar Kendari mengomentari postingan Anda', body: '“Informasinya sangat membantu, terima kasih!”', time: '18 menit lalu', href: '/beranda', unread: true, Icon: MessageCircle, tone: 'notification-tone-teal' },
  { id: 'n-3', kind: 'marketplace', title: 'Pesan baru dari calon pembeli', body: 'Ada pertanyaan tentang listing marketplace Anda.', time: '1 jam lalu', href: '/marketplace/seller-tools', unread: true, Icon: ShoppingBag, tone: 'notification-tone-gold' },
  { id: 'n-4', kind: 'property', title: 'Properti Anda mendapat inquiry baru', body: 'Buka kotak masuk untuk melihat detail calon pembeli.', time: '3 jam lalu', href: '/dashboard/inquiries', unread: false, Icon: BellRing, tone: 'notification-tone-teal' },
  { id: 'n-5', kind: 'system', title: 'Lengkapi profil SUKI Anda', body: 'Tambahkan bio dan foto agar lebih mudah dikenal warga.', time: 'Kemarin', href: '/beranda', unread: false, Icon: UserPlus, tone: 'notification-tone-purple' },
];

export function NotificationCenter() {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((item) => item.unread).length;
  const visibleNotifications = useMemo(() => filter === 'unread' ? notifications.filter((item) => item.unread) : notifications, [filter, notifications]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const handlePointerDown = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); document.removeEventListener('pointerdown', handlePointerDown); };
  }, [open]);

  function openNotification(item: NotificationItem) {
    setNotifications((current) => current.map((entry) => entry.id === item.id ? { ...entry, unread: false } : entry));
    setOpen(false);
    if (item.href !== pathname) router.push(item.href);
  }

  function markAllAsRead() { setNotifications((current) => current.map((item) => ({ ...item, unread: false }))); }

  return <div className="notification-center" ref={rootRef}>
    <button type="button" className={`header-icon notification-trigger ${open ? 'is-open' : ''}`} aria-label={`Notifikasi${unreadCount ? `, ${unreadCount} belum dibaca` : ''}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      <Bell size={19} aria-hidden="true" />
      {unreadCount > 0 && <i aria-label={`${unreadCount} notifikasi belum dibaca`}>{unreadCount > 9 ? '9+' : unreadCount}</i>}
    </button>
    {open && <section className="notification-panel" role="dialog" aria-label="Pusat notifikasi">
      <header className="notification-panel-header"><div><span className="eyebrow">SUKI Updates</span><h2>Notifikasi</h2></div><button type="button" className="notification-close" aria-label="Tutup notifikasi" onClick={() => setOpen(false)}><X size={17} /></button></header>
      <div className="notification-toolbar"><div className="notification-tabs" role="tablist" aria-label="Filter notifikasi"><button type="button" role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Semua</button><button type="button" role="tab" aria-selected={filter === 'unread'} className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Belum dibaca{unreadCount > 0 && <span>{unreadCount}</span>}</button></div>{unreadCount > 0 && <button type="button" className="notification-mark-all" onClick={markAllAsRead}><CheckCheck size={14} /> Tandai dibaca</button>}</div>
      <div className="notification-list">{visibleNotifications.length ? visibleNotifications.map((item) => <button type="button" key={item.id} className={`notification-item ${item.unread ? 'is-unread' : ''}`} onClick={() => openNotification(item)}><span className={`notification-item-icon ${item.tone}`}><item.Icon size={17} aria-hidden="true" /></span><span className="notification-item-content"><strong>{item.title}</strong><span>{item.body}</span><small>{item.time}</small></span>{item.unread && <i className="notification-unread-dot" aria-label="Belum dibaca" />}</button>) : <div className="notification-empty"><CheckCheck size={24} /><strong>Semua sudah dibaca</strong><span>Notifikasi baru akan muncul di sini.</span></div>}</div>
      <footer className="notification-panel-footer"><button type="button" onClick={() => { setOpen(false); router.push('/marketplace/profile'); }}><Settings size={15} /> Pengaturan notifikasi <ChevronRight size={15} /></button></footer>
    </section>}
  </div>;
}

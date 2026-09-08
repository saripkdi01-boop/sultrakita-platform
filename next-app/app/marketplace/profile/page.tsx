'use client';

import { Bookmark, Bell, ChevronRight, Clock3, Heart, MapPin, MessageCircle, Settings, ShieldCheck, Star, Store, UserRound, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MarketplaceTopNav } from '@/components/marketplace/MarketplaceTopNav';
import { SavedSearches } from '@/components/marketplace/SavedSearches';
import { supabase } from '@/lib/supabase/client';
import { useProfileStore } from '@/store/profile';

type Action = { label: string; description: string; Icon: typeof Bookmark; href: string };
const actions: Action[] = [{ label: 'Item tersimpan', description: 'Listing favoritmu', Icon: Bookmark, href: '#saved' }, { label: 'Kotak masuk', description: 'Pesan dari pembeli', Icon: MessageCircle, href: '/chat' }, { label: 'Ulasan', description: 'Reputasi penjual', Icon: Star, href: '#reviews' }, { label: 'Baru saja dilihat', description: 'Riwayat listing', Icon: Clock3, href: '#recent' }];
const selling = [{ label: 'Tawaran Anda', meta: 'Kelola penawaran yang masuk', count: '20+', Icon: Store }, { label: 'Tindakan cepat', meta: 'Optimalkan listing yang aktif', Icon: Heart }, { label: 'Pengikut Marketplace', meta: 'Orang yang mengikuti tokomu', Icon: UsersRound }, { label: 'Semua aktivitas berjualan', meta: 'Lihat ringkasan aktivitas', Icon: ShieldCheck }];
const account = [{ label: 'Akses Marketplace', meta: 'Atur preferensi belanja dan jualan', Icon: Store }, { label: 'Lokasi', meta: 'Sulawesi Tenggara', Icon: MapPin }, { label: 'Notifikasi', meta: 'Aktif untuk pesan penting', Icon: Bell }, { label: 'Pengaturan', meta: 'Kelola pengalaman Marketplace', Icon: Settings }];

export default function MarketplaceProfilePage() {
  const [name, setName] = useState('Warga Sultra'); const [email, setEmail] = useState('');
  const avatarUrl = useProfileStore((state) => state.profile.avatar_url);
  useEffect(() => { void supabase?.auth.getUser().then(result => { const user = result.data.user; if (user) { setName(String(user.user_metadata?.full_name || user.user_metadata?.username || user.email?.split('@')[0] || 'Warga Sultra')); setEmail(user.email || ''); } }); }, []);
  return <><MarketplaceTopNav /><main className="marketplace-profile-page"><Link href="/marketplace" className="marketplace-back-link">← Kembali ke Marketplace</Link><section className="marketplace-profile-hero"><div className="marketplace-profile-avatar-large">{avatarUrl ? <img src={avatarUrl} alt="" /> : name.slice(0, 2).toUpperCase()}</div><div><span className="marketplace-kicker">Profil Marketplace</span><h1>{name}<ShieldCheck size={20} aria-label="Profil terverifikasi" /></h1><p>{email || 'Atur aktivitas jual beli lokalmu dengan lebih mudah.'}</p><button className="marketplace-profile-view">Lihat profil publik <ChevronRight size={15} /></button></div></section><section className="marketplace-quick-actions"><h2>Akses cepat</h2><div className="marketplace-action-grid">{actions.map(({ label, description, Icon, href }) => <Link href={href} key={label}><span className="marketplace-action-icon"><Icon size={19} /></span><span><b>{label}</b><small>{description}</small></span><ChevronRight size={15} /></Link>)}</div></section><SavedSearches /><div className="marketplace-profile-columns"><ProfileSection title="Jual di Marketplace" items={selling} /><ProfileSection title="Preferensi & akun" items={account} /></div></main></>;
}
function ProfileSection({ title, items }: { title: string; items: { label: string; meta: string; count?: string; Icon: typeof Store }[] }) { return <section className="marketplace-profile-section"><div className="marketplace-profile-section-title"><h2>{title}</h2><button aria-label={`Info ${title}`}><UserRound size={15} /></button></div><div className="marketplace-profile-list">{items.map(({ label, meta, count, Icon }) => <button key={label}><span className="marketplace-list-icon"><Icon size={17} /></span><span><b>{label}</b><small>{meta}</small></span>{count && <em>{count}</em>}<ChevronRight size={16} /></button>)}</div></section>; }

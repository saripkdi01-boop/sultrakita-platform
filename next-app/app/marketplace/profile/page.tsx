'use client';

import { Bookmark, Bell, ChevronRight, Clock3, Heart, MapPin, MessageCircle, Settings, ShieldCheck, Star, Store, UserRound, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { QuickNavBar, type QuickNavKey } from '@/components/layout/QuickNavBar';
import { SavedSearches } from '@/components/marketplace/SavedSearches';
import { useSessionProfile } from '@/hooks/useSessionProfile';

type Action = { label: string; description: string; Icon: typeof Bookmark; href: string };
const actions: Action[] = [{ label: 'Item tersimpan', description: 'Listing favoritmu', Icon: Bookmark, href: '#saved' }, { label: 'Kotak masuk', description: 'Pesan dari pembeli', Icon: MessageCircle, href: '/chat' }, { label: 'Ulasan', description: 'Reputasi penjual', Icon: Star, href: '#reviews' }, { label: 'Baru saja dilihat', description: 'Riwayat listing', Icon: Clock3, href: '#recent' }];
const selling = [{ label: 'Tawaran Anda', meta: 'Kelola penawaran yang masuk', count: '20+', Icon: Store }, { label: 'Tindakan cepat', meta: 'Optimalkan listing yang aktif', Icon: Heart }, { label: 'Pengikut Marketplace', meta: 'Orang yang mengikuti tokomu', Icon: UsersRound }, { label: 'Semua aktivitas berjualan', meta: 'Lihat ringkasan aktivitas', Icon: ShieldCheck }];
const account = [{ label: 'Akses Marketplace', meta: 'Atur preferensi belanja dan jualan', Icon: Store }, { label: 'Lokasi', meta: 'Sulawesi Tenggara', Icon: MapPin }, { label: 'Notifikasi', meta: 'Aktif untuk pesan penting', Icon: Bell }, { label: 'Pengaturan', meta: 'Kelola pengalaman Marketplace', Icon: Settings }];

export default function MarketplaceProfilePage() {
  const { user, profile } = useSessionProfile();
  const name = profile?.full_name || user?.email?.split('@')[0] || 'Warga SultraKita';
  const email = user?.email || '';
  const location = profile?.headline || 'Atur aktivitas jual beli lokalmu dengan lebih mudah.';
  const initials = name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const navigate = (key: QuickNavKey) => { const routes: Partial<Record<QuickNavKey, string>> = { home: '/beranda', chat: '/chat', groups: '/groups', market: '/jobs', suits: '/properti' }; if (routes[key]) window.location.href = routes[key]; };
  return <><Header /><QuickNavBar active="marketplace" onNavigate={navigate} /><main className="marketplace-profile-page"><Link href="/marketplace" className="marketplace-back-link">← Kembali ke Marketplace</Link><section className="marketplace-profile-hero"><div className="marketplace-profile-avatar-large">{profile?.avatar_url ? <img src={profile.avatar_url} alt={`Avatar ${name}`} /> : initials}</div><div><span className="marketplace-kicker">Profil Marketplace</span><h1>{name}{profile?.headline?.toLowerCase().includes('verifikasi') && <ShieldCheck size={20} aria-label="Profil terverifikasi" />}</h1><p>{email || location}</p><button className="marketplace-profile-view">Lihat profil publik <ChevronRight size={15} /></button></div></section><section className="marketplace-quick-actions"><h2>Akses cepat</h2><div className="marketplace-action-grid">{actions.map(({ label, description, Icon, href }) => <Link href={href} key={label}><span className="marketplace-action-icon"><Icon size={19} /></span><span><b>{label}</b><small>{description}</small></span><ChevronRight size={15} /></Link>)}</div></section><SavedSearches /><div className="marketplace-profile-columns"><ProfileSection title="Jual di Marketplace" items={selling} /><ProfileSection title="Preferensi & akun" items={account} /></div></main></>;
}
function ProfileSection({ title, items }: { title: string; items: { label: string; meta: string; count?: string; Icon: typeof Store }[] }) { return <section className="marketplace-profile-section"><div className="marketplace-profile-section-title"><h2>{title}</h2><button aria-label={`Info ${title}`}><UserRound size={15} /></button></div><div className="marketplace-profile-list">{items.map(({ label, meta, count, Icon }) => <button key={label}><span className="marketplace-list-icon"><Icon size={17} /></span><span><b>{label}</b><small>{meta}</small></span>{count && <em>{count}</em>}<ChevronRight size={16} /></button>)}</div></section>; }

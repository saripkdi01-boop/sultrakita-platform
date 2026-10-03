'use client';

import { Bookmark, Bell, ChevronRight, Clock3, Heart, MapPin, Settings, ShieldCheck, Star, Store, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { SavedSearches } from '@/components/marketplace/SavedSearches';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';

type Action = { label: string; description: string; Icon: typeof Bookmark; href: string };
// Fase 0: aksi 'Kotak masuk' (/chat) disembunyikan sementara. Kembalikan saat chat aktif.
const actions: Action[] = [{ label: 'Item tersimpan', description: 'Listing favoritmu', Icon: Bookmark, href: '#saved' }, { label: 'Ulasan', description: 'Reputasi penjual', Icon: Star, href: '#reviews' }, { label: 'Baru saja dilihat', description: 'Riwayat listing', Icon: Clock3, href: '#recent' }];
// CATATAN: baris "Jual di Marketplace" belum punya tujuan nyata (tidak ada
// halaman kelola listing/penawaran marketplace) — dirender sebagai baris info
// non-interaktif yang jujur, bukan tombol mati. Jangan tambah angka palsu.
const selling = [{ label: 'Tawaran Anda', meta: 'Kelola penawaran yang masuk', Icon: Store }, { label: 'Tindakan cepat', meta: 'Optimalkan listing yang aktif', Icon: Heart }, { label: 'Pengikut Marketplace', meta: 'Orang yang mengikuti tokomu', Icon: UsersRound }, { label: 'Semua aktivitas berjualan', meta: 'Lihat ringkasan aktivitas', Icon: ShieldCheck }];
const account = [{ label: 'Akses Marketplace', meta: 'Atur preferensi belanja dan jualan', Icon: Store, href: '/settings/seller' }, { label: 'Lokasi', meta: 'Sulawesi Tenggara', Icon: MapPin, href: '/settings/account' }, { label: 'Notifikasi', meta: 'Aktif untuk pesan penting', Icon: Bell, href: '/settings/notifications' }, { label: 'Pengaturan', meta: 'Kelola pengalaman Marketplace', Icon: Settings, href: '/settings/account' }];

export default function MarketplaceProfilePage() {
  const { user, profile } = useSessionProfile();
  const name = getProfileNickname(user, profile);
  const email = user?.email || '';
  const location = profile?.bio || 'Atur aktivitas jual beli lokalmu dengan lebih mudah.';
  const initials = name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const publicProfileHref = profile?.username ? `/profile/${profile.username}` : '/settings/account';
  return <AppLayout><main className="marketplace-profile-page"><Link href="/marketplace" className="marketplace-back-link">← Kembali ke Marketplace</Link><section className="marketplace-profile-hero"><div className="marketplace-profile-avatar-large">{profile?.avatar_url ? <img src={profile.avatar_url} alt={`Avatar ${name}`} /> : initials}</div><div><span className="marketplace-kicker">Profil Marketplace</span><h1>{name}{profile?.bio?.toLowerCase().includes('verifikasi') && <ShieldCheck size={20} aria-label="Profil terverifikasi" />}</h1><p>{email || location}</p><Link href={publicProfileHref} className="marketplace-profile-view">Lihat profil publik <ChevronRight size={15} /></Link></div></section><section className="marketplace-quick-actions"><h2>Akses cepat</h2><div className="marketplace-action-grid">{actions.map(({ label, description, Icon, href }) => <Link href={href} key={label}><span className="marketplace-action-icon"><Icon size={19} /></span><span><b>{label}</b><small>{description}</small></span><ChevronRight size={15} /></Link>)}</div></section><SavedSearches /><div className="marketplace-profile-columns"><ProfileSection title="Jual di Marketplace" items={selling} /><ProfileSection title="Preferensi & akun" items={account} /></div></main></AppLayout>;
}
function ProfileSection({ title, items }: { title: string; items: { label: string; meta: string; count?: string; Icon: typeof Store; href?: string }[] }) { return <section className="marketplace-profile-section"><div className="marketplace-profile-section-title"><h2>{title}</h2></div><div className="marketplace-profile-list">{items.map(({ label, meta, count, Icon, href }) => href ? <Link key={label} href={href} className="marketplace-list-link"><span className="marketplace-list-icon"><Icon size={17} /></span><span><b>{label}</b><small>{meta}</small></span>{count && <em>{count}</em>}<ChevronRight size={16} /></Link> : <div key={label} className="marketplace-list-row"><span className="marketplace-list-icon"><Icon size={17} /></span><span><b>{label}</b><small>{meta}</small></span><small className="marketplace-list-soon">Segera hadir</small></div>)}</div></section>; }

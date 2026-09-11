'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { categories, SettingContent } from '@/components/profile/ProfileHub';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';
import { SettingTab } from '@/store/profile';

type AccountCenterPageProps = { activeTab: SettingTab };

export function AccountCenterPage({ activeTab }: AccountCenterPageProps) {
  const active = categories.find((item) => item.id === activeTab) || categories[0];
  const { user, profile } = useSessionProfile();
  const displayName = getProfileNickname(user, profile);

  return <AppLayout active="home"><main className="settings-page-shell"><div className="settings-page-topbar"><Link className="settings-page-back" href="/beranda"><ArrowLeft size={16} /> Kembali ke Beranda</Link><span className="settings-page-kicker">Account Center</span></div><section className="settings-page-hero"><div><span className="eyebrow">Ruang kendali akun</span><h1>Pengaturan SultraKita</h1><p>Kelola identitas, privasi, keamanan, notifikasi, dan pengalaman SUKI dari satu halaman yang aman.</p></div><div className="settings-page-identity"><span className="avatar large">{profile?.avatar_url ? <img src={profile.avatar_url} alt={displayName} /> : displayName.slice(0, 2).toUpperCase()}</span><div><strong>{displayName}</strong><small>{profile?.district || 'Warga Sultra'}</small></div></div></section><div className="settings-page-layout"><nav className="settings-page-nav" aria-label="Kategori pengaturan"><div className="settings-page-nav-heading"><strong>Pengaturan</strong><small>{categories.length} kategori</small></div>{categories.map((item) => { const Icon = item.icon; return <Link key={item.id} href={`/settings/${item.id}`} className={item.id === active.id ? 'active' : ''} aria-current={item.id === active.id ? 'page' : undefined}><Icon size={18} /><span><b>{item.label}</b><small>{item.description}</small></span><ChevronRight size={15} /></Link>; })}</nav><section className="settings-page-content" aria-labelledby="settings-page-title"><div className="settings-page-content-head"><div><span className="eyebrow">{active.label}</span><h2 id="settings-page-title">{active.label}</h2><p>{active.description}</p></div><span className="settings-page-route">/settings/{active.id}</span></div><div className="settings-page-setting"><SettingContent tab={active.id} userId={user?.id} /></div></section></div></main></AppLayout>;
}

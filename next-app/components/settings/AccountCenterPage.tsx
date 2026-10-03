'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight, Eye, ShieldCheck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getCategories, SettingContent } from '@/components/profile/ProfileHub';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';
import { SettingTab } from '@/store/profile';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { mergeLabels } from '@/lib/i18n/dict-authprofile';

type AccountCenterPageProps = { activeTab: SettingTab };

function getGroups(t: Record<string, string>): { label: string; tabs: SettingTab[] }[] {
  return [
    { label: t.settingsGroupIdentity, tabs: ['account', 'appearance', 'notifications'] },
    { label: t.settingsGroupPrivacy, tabs: ['privacy', 'security', 'activity', 'blocked'] },
    { label: t.settingsGroupGrowth, tabs: ['seller', 'help'] },
  ];
}

export function AccountCenterPage({ activeTab }: AccountCenterPageProps) {
  const { language } = usePreferences(); const t = mergeLabels(getCoreLabels(language), language);
  const categories = getCategories(t);
  const groups = getGroups(t);
  const active = categories.find((item) => item.id === activeTab) || categories[0];
  const { user, profile } = useSessionProfile();
  const displayName = getProfileNickname(user, profile);
  const completionFields = [profile?.full_name, profile?.username, profile?.bio, profile?.district, profile?.avatar_url];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);
  const publicProfileHref = profile?.username ? `/profile/${profile.username}` : '/settings/account';

  return <AppLayout active="home"><main className="settings-page-shell"><div className="settings-page-topbar"><Link className="settings-page-back" href="/beranda"><ArrowLeft size={16} aria-hidden="true" /> {t.settingsBackBeranda}</Link><span className="settings-page-kicker">Account Center</span></div><section className="settings-page-hero"><div><span className="eyebrow">{t.settingsHeroEyebrow}</span><h1>{t.settingsHeroTitle}</h1><p>{t.settingsHeroDesc}</p><div className="settings-page-hero-actions"><Link className="soft-btn" href={publicProfileHref}><Eye size={16} aria-hidden="true" /> {profile?.username ? t.settingsViewPublic : t.settingsCompletePublic}</Link><Link className="text-link" href="/settings/privacy"><ShieldCheck size={16} aria-hidden="true" /> {t.settingsCheckPrivacy}</Link></div></div><div className="settings-page-identity"><span className="avatar large">{profile?.avatar_url ? <img src={profile.avatar_url} alt={t.settingsPhotoAlt.replace('{name}', displayName)} /> : displayName.slice(0, 2).toUpperCase()}</span><div><strong>{displayName}</strong><small>{profile?.district || profile?.city || t.settingsDefaultLocation}</small><span className="profile-completion"><i style={{ width: `${completion}%` }} /> <b>{t.settingsProfileReady.replace('{n}', String(completion))}</b></span></div></div></section><div className="settings-page-layout"><nav className="settings-page-nav" aria-label={t.settingsNavAria}><div className="settings-page-nav-heading"><strong>Account Center</strong><small>{t.settingsAreaCount.replace('{n}', String(categories.length))}</small></div>{groups.map((group) => <div className="settings-nav-group" key={group.label}><span>{group.label}</span>{group.tabs.map((tab) => { const item = categories.find((candidate) => candidate.id === tab); if (!item) return null; const Icon = item.icon; return <Link key={item.id} href={`/settings/${item.id}`} className={item.id === active.id ? 'active' : ''} aria-current={item.id === active.id ? 'page' : undefined}><Icon size={18} aria-hidden="true" /><span><b>{item.label}</b><small>{item.description}</small></span><ChevronRight size={15} aria-hidden="true" /></Link>; })}</div>)}</nav><section className="settings-page-content" aria-labelledby="settings-page-title"><div className="settings-page-content-head"><div><span className="eyebrow">{active.label}</span><h2 id="settings-page-title">{active.label}</h2><p>{active.description}</p></div><span className="settings-page-route">/settings/{active.id}</span></div><div className="settings-page-setting"><div className="settings-sync-note" role="note"><CheckCircle2 size={16} aria-hidden="true" /><span>{t.settingsSyncNote}</span></div><SettingContent tab={active.id} userId={user?.id} /></div></section></div></main></AppLayout>;
}

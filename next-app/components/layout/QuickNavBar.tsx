'use client';
import { BriefcaseBusiness, Building2, Home, Sparkles, Store, UserPlus, Users } from 'lucide-react';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { getNavLabels } from '@/lib/i18n/navigation';
export type QuickNavKey = 'home' | 'campaigns' | 'groups' | 'market' | 'suits' | 'marketplace' | 'referral';
type QuickNavBarProps = { active?: QuickNavKey; onNavigate?: (key: QuickNavKey) => void; onCreate?: (type?: 'post' | 'reel') => void; communityCount?: number };
const getItems = (t: Record<string, string>): Array<{ key: QuickNavKey; label: string; Icon: typeof Home; badge?: string }> => [{ key: 'home', label: t.home, Icon: Home }, { key: 'campaigns', label: t.campaignHub, Icon: Sparkles }, { key: 'groups', label: t.groups, Icon: Users }, { key: 'market', label: t.sukiJobs, Icon: BriefcaseBusiness, badge: 'NEW' }, { key: 'suits', label: t.sukiSuits, Icon: Building2, badge: 'NEW' }, { key: 'marketplace', label: t.sukiMarketplace, Icon: Store }, { key: 'referral', label: t.inviteFriends, Icon: UserPlus, badge: 'NEW' }];
export function QuickNavBar({ active = 'home', onNavigate, communityCount = 0 }: QuickNavBarProps) {
  const { language } = usePreferences();
  const t: Record<string, string> = { ...getCoreLabels(language), ...getNavLabels(language) };
  const items = getItems(t);
  return <nav className="quick-nav" aria-label={t.quickNavigation}><div className="quick-nav-inner">{items.map(({ key, label, Icon, badge }) => { const count = key === 'groups' ? communityCount : 0; const isActive = active === key; return <button type="button" key={key} title={label} onClick={() => onNavigate?.(key)} className={`quick-nav-item quick-nav-item-${key} relative ${isActive ? 'is-active' : ''}`} aria-label={label} aria-current={isActive ? 'page' : undefined} aria-pressed={isActive}><span className="quick-nav-icon-wrap"><span className="quick-nav-icon-3d"><Icon aria-hidden="true" size={20} /></span>{badge && <span className="quick-nav-badge">{badge}</span>}{count > 0 && <span className="quick-nav-badge quick-nav-count" aria-label={`${count} ${t.newMembers}`}>{count}</span>}</span><span className="quick-nav-label">{label}</span></button>; })}</div></nav>; }

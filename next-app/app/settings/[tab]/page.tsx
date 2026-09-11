import { notFound } from 'next/navigation';
import { AccountCenterPage } from '@/components/settings/AccountCenterPage';
import type { SettingTab } from '@/store/profile';

const settingTabs: SettingTab[] = ['account', 'privacy', 'notifications', 'security', 'activity', 'blocked', 'appearance', 'seller', 'help'];
type SettingsTabPageProps = { params: Promise<{ tab: string }> };

export function generateStaticParams() {
  return settingTabs.map((tab) => ({ tab }));
}

export default async function SettingsTabPage({ params }: SettingsTabPageProps) {
  const { tab } = await params;
  const activeTab = settingTabs.includes(tab as SettingTab) ? tab as SettingTab : null;
  if (!activeTab) notFound();
  return <AccountCenterPage activeTab={activeTab} />;
}

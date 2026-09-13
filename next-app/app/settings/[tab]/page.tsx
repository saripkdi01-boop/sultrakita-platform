import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { AccountCenterPage } from '@/components/settings/AccountCenterPage';
import type { SettingTab } from '@/store/profile';
import { getServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const settingTabs: SettingTab[] = ['account', 'privacy', 'notifications', 'security', 'activity', 'blocked', 'appearance', 'seller', 'help'];
type SettingsTabPageProps = { params: Promise<{ tab: string }> };

export function generateStaticParams() {
  return settingTabs.map((tab) => ({ tab }));
}

export default async function SettingsTabPage({ params }: SettingsTabPageProps) {
  const { tab } = await params;
  const activeTab = settingTabs.includes(tab as SettingTab) ? tab as SettingTab : null;
  if (!activeTab) notFound();
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent(`/settings/${activeTab}`)}`);
  return <AccountCenterPage activeTab={activeTab} />;
}

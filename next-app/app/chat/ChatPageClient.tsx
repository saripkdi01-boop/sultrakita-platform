'use client';

import { ChatInbox } from '@/components/chat/ChatInbox';
import { Header } from '@/components/layout/Header';
import { QuickNavBar, type QuickNavKey } from '@/components/layout/QuickNavBar';
import { SidebarMobileDrawer } from '@/components/layout/SidebarMobileDrawer';
import { useUIStore } from '@/store/ui';
import { useState } from 'react';

export default function ChatPageClient() {
  const { mobileOpen } = useUIStore();
  const [unreadCount, setUnreadCount] = useState(0);
  function navigate(key: QuickNavKey) {
    const routes: Record<QuickNavKey, string> = { home: '/beranda', chat: '/chat', campaigns: '/campaigns', groups: '/groups', market: '/jobs', suits: '/properti', marketplace: '/marketplace' };
    if (key !== 'chat') window.location.assign(routes[key]);
  }
  return <><Header /><QuickNavBar active="chat" chatCount={unreadCount} onNavigate={navigate} /><SidebarMobileDrawer open={mobileOpen} /><main className="chat-route-main"><ChatInbox onUnreadCountChange={setUnreadCount} /></main></>;
}

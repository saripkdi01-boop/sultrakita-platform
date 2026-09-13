'use client';

import { ChatInbox } from '@/components/chat/ChatInbox';
import { Header } from '@/components/layout/Header';
import { QuickNavBar, type QuickNavKey } from '@/components/layout/QuickNavBar';

export default function ChatPage() {
  function navigate(key: QuickNavKey) {
    const routes: Record<QuickNavKey, string> = { home: '/beranda', chat: '/chat', groups: '/groups', market: '/jobs', suits: '/properti', marketplace: '/marketplace' };
    if (key !== 'chat') window.location.assign(routes[key]);
  }
  return <><Header /><QuickNavBar active="chat" onNavigate={navigate} /><main className="chat-route-main"><ChatInbox /></main></>;
}

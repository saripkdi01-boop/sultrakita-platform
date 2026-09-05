'use client';

import { TopNavigationBar } from './TopNavigationBar';

export function Header({ onCreate }: { onCreate?: () => void }) {
  return <TopNavigationBar onCreate={onCreate} onSearch={query => { window.location.hash = `search=${encodeURIComponent(query)}`; }} onChat={() => { window.location.href = '/chat'; }} onNotifications={() => { window.location.hash = 'notifications'; }} />;
}

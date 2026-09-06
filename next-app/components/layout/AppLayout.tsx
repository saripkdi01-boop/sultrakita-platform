'use client';
import { Header } from './Header';
import { QuickNavBar } from './QuickNavBar';
import { SidebarDesktop } from './SidebarDesktop';
import { SidebarMobileDrawer } from './SidebarMobileDrawer';
import { useUIStore } from '@/store/ui';
export function AppLayout({ children, onCreate, active = 'home' }: { children: React.ReactNode; onCreate?: () => void; active?: 'home' | 'reels' | 'groups' | 'market' | 'chat' | 'menu' }) { const { mobileOpen } = useUIStore(); return <><Header onCreate={onCreate}/><QuickNavBar active={active} onNavigate={key => { if (key === 'menu') return; if (key === 'chat') { window.location.href = '/chat'; return; } window.location.hash = key === 'home' ? '' : key; }}/><div className="app-frame"><SidebarDesktop/><SidebarMobileDrawer open={mobileOpen}/><div className="content-wrap">{children}</div></div></>; }

'use client';
import { Header } from './Header';
import { QuickNavBar } from './QuickNavBar';
import { SidebarDesktop } from './SidebarDesktop';
import { SidebarMobileDrawer } from './SidebarMobileDrawer';
import { useUIStore } from '@/store/ui';
export function AppLayout({ children, onCreate }: { children: React.ReactNode; onCreate?: () => void }) { const { mobileOpen } = useUIStore(); return <><Header onCreate={onCreate}/><QuickNavBar active="home" onNavigate={key => { if (key === 'menu') return; window.location.hash = key === 'home' ? '' : key; }}/><div className="app-frame"><SidebarDesktop/><SidebarMobileDrawer open={mobileOpen}/><div className="content-wrap">{children}</div></div></>; }

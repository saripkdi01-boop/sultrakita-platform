'use client';
import { Header } from './Header';
import { QuickNavBar } from './QuickNavBar';
import { LeftSidebar } from './LeftSidebar';
import { BottomNavigation } from './BottomNavigation';
import { SidebarMobileDrawer } from './SidebarMobileDrawer';
import { useUIStore } from '@/store/ui';
export function AppLayout({ children, onCreate }: { children: React.ReactNode; onCreate?: () => void }) { const { mobileOpen } = useUIStore(); return <><Header onCreate={onCreate}/><QuickNavBar active="home" onNavigate={key => { if (key === 'menu') return; window.location.hash = key === 'home' ? '' : key; }}/><div className="app-frame"><LeftSidebar/><SidebarMobileDrawer open={mobileOpen}/><div className="content-wrap pb-16 md:pb-0">{children}</div></div><BottomNavigation onCreate={onCreate} onNavigate={key => { window.location.hash = key === 'home' ? '' : key; }}/></>; }

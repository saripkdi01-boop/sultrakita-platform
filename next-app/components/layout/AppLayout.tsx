'use client';
import { Header } from './Header';
import { LeftSidebar } from './LeftSidebar';
import { BottomNavigation } from './BottomNavigation';
import { SidebarMobileDrawer } from './SidebarMobileDrawer';
import { useUIStore } from '@/store/ui';
export function AppLayout({ children, onCreate }: { children: React.ReactNode; onCreate?: () => void }) { const { mobileOpen, toggleMobile } = useUIStore(); const navigate = (key: 'home' | 'groups' | 'market' | 'reels' | 'menu') => { if (key === 'menu') return toggleMobile(); window.location.href = key === 'home' ? '/' : key === 'groups' ? '/groups' : key === 'market' ? '/marketplace' : '/reels'; }; return <><Header onCreate={onCreate}/><div className="app-frame"><LeftSidebar/><SidebarMobileDrawer open={mobileOpen}/><div className="content-wrap pb-16 md:pb-0">{children}</div></div><BottomNavigation onNavigate={navigate}/></>; }

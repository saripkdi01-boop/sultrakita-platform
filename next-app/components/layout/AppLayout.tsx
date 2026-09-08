'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { QuickNavBar, type QuickNavKey } from './QuickNavBar';
import { SidebarDesktop } from './SidebarDesktop';
import { SidebarMobileDrawer } from './SidebarMobileDrawer';
import { getHeaderEcosystemApps } from '@/lib/actions/ecosystem';
import { useUIStore } from '@/store/ui';
const fallbackRoutes = { suits: '/properti', marketplace: '/marketplace' };
export function AppLayout({ children, onCreate, active = 'home' }: { children: React.ReactNode; onCreate?: (type?: 'post' | 'reel') => void; active?: QuickNavKey }) {
  const { mobileOpen } = useUIStore(); const pathname = usePathname(); const [routes, setRoutes] = useState(fallbackRoutes);
  const routeActive: QuickNavKey = pathname.startsWith('/properti') || pathname.startsWith('/dashboard/properties') || pathname.startsWith('/dashboard/inquiries') || pathname.startsWith('/admin/property-verification') ? 'suits' : pathname.startsWith('/marketplace') ? 'marketplace' : pathname.startsWith('/jobs') ? 'market' : pathname.startsWith('/chat') ? 'chat' : pathname.startsWith('/groups') ? 'groups' : active;
  useEffect(() => { void getHeaderEcosystemApps().then((result) => { if (result.ok) { const suits = result.data.find((item) => item.slug === 'suki-suits')?.route; setRoutes({ suits: suits || fallbackRoutes.suits, marketplace: fallbackRoutes.marketplace }); } }); }, []);
  const navigate = (key: QuickNavKey) => { if (key === 'suits') { window.location.href = routes.suits; return; } if (key === 'marketplace') { window.location.href = routes.marketplace; return; } if (key === 'market') { window.location.href = '/jobs'; return; } if (key === 'chat') { window.location.href = '/chat'; return; } if (key === 'home') { window.location.href = '/beranda'; return; } window.location.hash = key; };
  return <><Header onCreate={onCreate}/><QuickNavBar active={routeActive} onNavigate={navigate}/><div className="app-frame"><SidebarDesktop/><SidebarMobileDrawer open={mobileOpen}/><div className="content-wrap">{children}</div></div></>;
}

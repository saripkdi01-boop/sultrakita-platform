'use client';
import { useEffect, useState } from 'react';
import { Header } from './Header';
import { QuickNavBar, type QuickNavKey } from './QuickNavBar';
import { SidebarDesktop } from './SidebarDesktop';
import { SidebarMobileDrawer } from './SidebarMobileDrawer';
import { getHeaderEcosystemApps } from '@/lib/actions/ecosystem';
import { useUIStore } from '@/store/ui';

const fallbackRoutes = { suits: '/dashboard', marketplace: '/marketplace' };
export function AppLayout({ children, onCreate, active = 'home' }: { children: React.ReactNode; onCreate?: () => void; active?: QuickNavKey }) {
  const { mobileOpen } = useUIStore();
  const [routes, setRoutes] = useState(fallbackRoutes);
  useEffect(() => { void getHeaderEcosystemApps().then((result) => { if (result.ok) { const suits = result.data.find((item) => item.slug === 'suki-suits')?.route; const marketplace = result.data.find((item) => item.slug === 'suki-marketplace')?.route; setRoutes({ suits: suits || fallbackRoutes.suits, marketplace: marketplace || fallbackRoutes.marketplace }); } }); }, []);
  const navigate = (key: QuickNavKey) => { if (key === 'suits') { window.location.href = routes.suits; return; } if (key === 'marketplace' || key === 'market') { window.location.href = routes.marketplace; return; } if (key === 'home') { window.location.hash = ''; return; } window.location.hash = key; };
  return <><Header onCreate={onCreate}/><QuickNavBar active={active} onNavigate={navigate}/><div className="app-frame"><SidebarDesktop/><SidebarMobileDrawer open={mobileOpen}/><div className="content-wrap">{children}</div></div></>;
}

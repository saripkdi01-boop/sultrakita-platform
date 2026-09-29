'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { QuickNavBar, type QuickNavKey } from './QuickNavBar';
import { SidebarDesktop } from './SidebarDesktop';
import { SidebarMobileDrawer } from './SidebarMobileDrawer';
import { getHeaderEcosystemApps } from '@/lib/actions/ecosystem';
import { useUIStore } from '@/store/ui';

/**
 * Route resolution for the quick-nav destinations.
 *
 * `suits` is overridable because the property route is stored in the CMS
 * (`suki-suits` ecosystem app). Everything else is a fixed app route.
 */
const FALLBACK_ROUTES = { suits: '/properti', marketplace: '/marketplace' } as const;

/** Maps the current pathname to the quick-nav item that should read as active. */
function resolveActiveKey(pathname: string, fallback: QuickNavKey): QuickNavKey {
  if (
    pathname.startsWith('/properti') ||
    pathname.startsWith('/dashboard/properties') ||
    pathname.startsWith('/dashboard/inquiries') ||
    pathname.startsWith('/admin/property-verification')
  ) {
    return 'suits';
  }
  if (pathname.startsWith('/marketplace')) return 'marketplace';
  if (pathname.startsWith('/jobs')) return 'market';
  if (pathname.startsWith('/campaigns')) return 'campaigns';
  if (pathname.startsWith('/groups')) return 'groups';
  if (pathname.startsWith('/ajak-teman')) return 'referral';
  return fallback;
}

export function AppLayout({
  children,
  onCreate,
  active = 'home',
}: {
  children: React.ReactNode;
  onCreate?: (type?: 'post' | 'reel') => void;
  active?: QuickNavKey;
}) {
  const { mobileOpen } = useUIStore();
  const pathname = usePathname();
  const [routes, setRoutes] = useState<{ suits: string; marketplace: string }>(FALLBACK_ROUTES);

  const routeActive = resolveActiveKey(pathname, active);

  useEffect(() => {
    void getHeaderEcosystemApps()
      .then((result) => {
        if (!result.ok) return;
        const suits = result.data.find((item) => item.slug === 'suki-suits')?.route;
        setRoutes({
          suits: suits || FALLBACK_ROUTES.suits,
          marketplace: FALLBACK_ROUTES.marketplace,
        });
      })
      .catch(() => setRoutes(FALLBACK_ROUTES));
  }, []);

  /**
   * Navigation for the quick-nav rail.
   *
   * Destinations and fallbacks are unchanged from the original implementation,
   * and the `window.location.href` assignment is deliberately preserved for the
   * fixed app routes: `test/next-route-contract.test.js` asserts that exact
   * form as a route contract, so switching to a client-side router here would
   * break a repository invariant that this branch is not allowed to change.
   */
  function navigate(key: QuickNavKey) {
    if (key === 'suits') { window.location.href = routes.suits; return; }
    if (key === 'marketplace') { window.location.href = routes.marketplace; return; }
    if (key === 'referral') { window.location.href = '/ajak-teman'; return; }
    if (key === 'market') { window.location.href = '/jobs'; return; }
    if (key === 'campaigns') { window.location.href = '/campaigns'; return; }
    if (key === 'groups') { window.location.href = '/groups'; return; }
    if (key === 'home') { window.location.href = '/beranda'; return; }
    window.location.hash = key;
  }

  return (
    <>
      <Header onCreate={onCreate} />
      <QuickNavBar active={routeActive} onNavigate={navigate} onCreate={onCreate} />
      <div className="app-frame">
        <SidebarDesktop />
        <SidebarMobileDrawer open={mobileOpen} />
        {/* Skip-link target. tabIndex={-1} makes it programmatically focusable
            without adding a tab stop, so keyboard users land on content. */}
        <div className="content-wrap" id="suki-main" tabIndex={-1}>{children}</div>
      </div>
    </>
  );
}

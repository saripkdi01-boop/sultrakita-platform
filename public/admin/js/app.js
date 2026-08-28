(() => {
  'use strict';
  const state = window.AdminState;
  const nav = [
    ['dashboard', 'Dashboard', '/admin/dashboard.html', 'view_dashboard'], ['users', 'Users', '/admin/users.html', 'manage_users'], ['listings', 'Listings', '/admin/listings.html', 'manage_listings'], ['categories', 'Categories', '/admin/categories.html', 'manage_categories'], ['donations', 'Donations', '/admin/donations.html', 'manage_donations'], ['reports', 'Reports', '/admin/reports.html', 'moderate_reports'], ['verifications', 'Verify', '/admin/verifications.html', 'verify_sellers'], ['analytics', 'Analytics', '/admin/analytics.html', 'view_analytics'], ['settings', 'Settings', '/admin/settings.html', 'manage_settings'], ['broadcasts', 'Broadcasts', '/admin/broadcasts.html', 'manage_content'], ['audit', 'Audit Logs', '/admin/audit-logs.html', 'view_audit_log'], ['roles', 'Roles', '/admin/roles.html', 'manage_roles'], ['webhooks', 'Webhooks', '/admin/webhooks.html', 'view_audit_log'], ['profile', 'Profile', '/admin/profile.html', 'view_dashboard']
  ];
  const has = permission => Boolean(state?.me?.permissions?.includes('*') || state?.me?.permissions?.includes(permission));
  function theme() { const saved = localStorage.getItem('sultra-admin-dark'); const dark = saved === null ? true : saved === 'true'; document.documentElement.classList.toggle('admin-dark', dark); }
  function shell() {
    const page = document.body.dataset.adminPage || 'dashboard';
    document.body.insertAdjacentHTML('afterbegin', '<a class="skip-link" href="#admin-main">Lewati ke konten utama</a>');
    const navItems = nav.filter(([, , , permission]) => has(permission));
    const items = document.getElementById('admin-nav-items');
    if (items) items.innerHTML = navItems.map(([key, label, href]) => `<a href="${href}" ${page === key ? 'aria-current="page"' : ''}>${label}</a>`).join('') || '<span style="padding:.75rem;color:var(--admin-text-muted);font-size:.8rem">Akses dashboard belum tersedia.</span>';
    document.querySelector('[data-menu-toggle]')?.addEventListener('click', () => document.getElementById('admin-sidebar').classList.toggle('is-open'));
    document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => { const dark = !document.documentElement.classList.contains('admin-dark'); localStorage.setItem('sultra-admin-dark', String(dark)); theme(); });
    document.querySelector('[data-logout]')?.addEventListener('click', () => window.AdminAuth.logout());
    document.querySelector('[data-global-search]')?.addEventListener('keydown', event => { if (event.key !== 'Enter') return; const term = event.currentTarget.value.trim(); if (term) window.location.href = `/admin/users.html?search=${encodeURIComponent(term)}`; });
  }
  function layout() { const main = document.querySelector('#admin-main'); if (!main) return; const content = main.innerHTML; const me = state?.me || {}; const role = String(me.role || 'guest').toUpperCase(); main.outerHTML = `<div class="admin-shell"><aside class="admin-sidebar" id="admin-sidebar"><a class="admin-brand" href="/admin/dashboard.html"><span class="admin-mark">S</span><span>SultraKita Admin</span></a><nav class="admin-nav" aria-label="Navigasi admin"><div class="admin-nav-section">Workspace</div><div id="admin-nav-items"></div></nav></aside><main id="admin-main" class="admin-content" tabindex="-1"><header class="admin-topbar"><div class="admin-topbar-inner"><button class="admin-button secondary admin-mobile-toggle" type="button" data-menu-toggle aria-label="Buka navigasi">Menu</button><div><h1>${document.body.dataset.adminTitle || 'Admin Dashboard'}</h1><p>${document.body.dataset.adminSubtitle || 'Operations center SultraKita.'}</p></div></div><div class="admin-actions"><label class="admin-topbar-search"><span aria-hidden="true">⌕</span><input type="search" data-global-search placeholder="Cari pengguna…" aria-label="Cari pengguna"></label><span class="admin-profile-chip"><span class="admin-avatar">${role.slice(0,1)}</span>${role}</span><button class="admin-button ghost" type="button" data-theme-toggle>Mode</button><button class="admin-button secondary" type="button" data-logout>Keluar</button></div></header>${content}</main></div>`; }
  async function init() { theme(); try { await window.AdminAuth.loadMe(); layout(); shell(); document.dispatchEvent(new CustomEvent('admin:layout-ready')); } catch (error) { layout(); shell(); window.AdminUi.setStatus(error.message, true); } }
  document.addEventListener('DOMContentLoaded', init);
})();

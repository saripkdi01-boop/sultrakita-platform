(() => {
  'use strict';
  const state = window.AdminState;
  const nav = [
    ['dashboard', 'Ringkasan', '/admin/dashboard.html', 'view_dashboard'],
    ['users', 'Pengguna', '/admin/users.html', 'manage_users'],
    ['listings', 'Listing', '/admin/listings.html', 'manage_listings'],
    ['reports', 'Laporan', '/admin/reports.html', 'moderate_reports'],
    ['verifications', 'Verifikasi', '/admin/verifications.html', 'verify_sellers'],
    ['analytics', 'Analitik', '/admin/analytics.html', 'view_analytics'],
    ['donations', 'Donasi', '/admin/donations.html', 'manage_donations'],
    ['content', 'Konten & Broadcast', '/admin/broadcasts.html', 'manage_content'],
    ['audit', 'Audit trail', '/admin/audit-logs.html', 'view_audit_log'],
    ['settings', 'Settings', '/admin/settings.html', 'manage_settings'],
    ['roles', 'Role management', '/admin/roles.html', 'manage_roles'],
    ['webhooks', 'Webhook logs', '/admin/webhooks.html', 'view_audit_log'],
  ];
  const has = permission => Boolean(state?.me?.permissions?.includes('*') || state?.me?.permissions?.includes(permission));
  function theme() { const dark = localStorage.getItem('sultra-admin-dark') === 'true'; document.documentElement.classList.toggle('admin-dark', dark); }
  function shell() {
    const page = document.body.dataset.adminPage || 'dashboard';
    document.body.insertAdjacentHTML('afterbegin', '<a class="skip-link" href="#admin-main">Lewati ke konten utama</a>');
    const navItems = nav.filter(([, , , permission]) => has(permission));
    document.getElementById('admin-nav-items').innerHTML = navItems.map(([key, label, href]) => `<a href="${href}" ${page === key ? 'aria-current="page"' : ''}>${label}</a>`).join('') || '<span style="padding:.75rem;color:#cfe3d7;font-size:.8rem">Akses dashboard belum tersedia.</span>';
    document.querySelector('[data-menu-toggle]')?.addEventListener('click', () => document.getElementById('admin-sidebar').classList.toggle('is-open'));
    document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => { const dark = !document.documentElement.classList.contains('admin-dark'); localStorage.setItem('sultra-admin-dark', String(dark)); theme(); });
    document.querySelector('[data-logout]')?.addEventListener('click', () => window.AdminAuth.logout());
  }
  function layout() { const main = document.querySelector('#admin-main'); if (!main) return; const content = main.innerHTML; main.outerHTML = `<div class="admin-shell"><aside class="admin-sidebar" id="admin-sidebar"><a class="admin-brand" href="/admin/dashboard.html"><span class="admin-mark">S</span><span>SultraKita Admin</span></a><nav class="admin-nav" aria-label="Navigasi admin"><div class="admin-nav-section">Workspace</div><div id="admin-nav-items"></div></nav></aside><main id="admin-main" class="admin-content" tabindex="-1"><header class="admin-topbar"><div><button class="admin-button secondary admin-mobile-toggle" type="button" data-menu-toggle aria-label="Buka navigasi">Menu</button><h1>${document.body.dataset.adminTitle || 'Admin Dashboard'}</h1><p>${document.body.dataset.adminSubtitle || 'Operations center SultraKita.'}</p></div><div class="admin-actions"><button class="admin-button ghost" type="button" data-theme-toggle>Mode gelap</button><button class="admin-button secondary" type="button" data-logout>Keluar</button></div></header>${content}</main></div>`; }
  async function init() { theme(); try { await window.AdminAuth.loadMe(); layout(); shell(); document.dispatchEvent(new CustomEvent('admin:layout-ready')); } catch (error) { layout(); shell(); window.AdminUi.setStatus(error.message, true); } }
  document.addEventListener('DOMContentLoaded', init);
})();

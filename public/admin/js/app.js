(() => {
  'use strict';

  const state = window.AdminState;
  const nav = [
    { section: 'Workspace', items: [
      ['dashboard', 'Dashboard', '/admin/dashboard.html', 'view_dashboard', 'grid'],
      ['analytics', 'Analytics', '/admin/analytics.html', 'view_analytics', 'chart'],
      ['listings', 'Kelola listing', '/admin/listings.html', 'manage_listings', 'tag'],
      ['categories', 'Kategori', '/admin/categories.html', 'manage_categories', 'folder'],
    ] },
    { section: 'Transaksi', items: [
      ['donations', 'Donasi', '/admin/donations.html', 'manage_donations', 'heart'],
      ['webhooks', 'Webhook monitor', '/admin/webhooks.html', 'view_audit_log', 'pulse'],
    ] },
    { section: 'Komunitas', items: [
      ['users', 'Pengguna', '/admin/users.html', 'manage_users', 'users'],
      ['verifications', 'Verifikasi seller', '/admin/verifications.html', 'verify_sellers', 'check'],
      ['reports', 'Laporan', '/admin/reports.html', 'moderate_reports', 'flag'],
      ['broadcasts', 'Broadcasts', '/admin/broadcasts.html', 'manage_content', 'megaphone'],
    ] },
    { section: 'Sistem', items: [
      ['audit', 'Audit logs', '/admin/audit-logs.html', 'view_audit_log', 'list'],
      ['roles', 'Roles', '/admin/roles.html', 'manage_roles', 'shield'],
      ['settings', 'Pengaturan', '/admin/settings.html', 'manage_settings', 'settings'],
      ['profile', 'Profil', '/admin/profile.html', 'view_dashboard', 'user'],
    ] },
  ];

  const icons = {
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
    chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-6M20 16v-9"/></svg>',
    tag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12l8 8-8 8-8-8z"/><circle cx="8" cy="8" r="1"/></svg>',
    folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5A1.5 1.5 0 0 1 5.5 5H10l2 2h6.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.3-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8.8 1.8Z"/></svg>',
    pulse: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 3.7a3.5 3.5 0 0 1 0 6.8M17 14.5h.5a4 4 0 0 1 4 4V20"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/><circle cx="12" cy="12" r="9"/></svg>',
    flag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4m0 0c4-3 6 3 10 0 1.5-1.1 2.6-1.1 4-1v9c-1.4-.1-2.5-.1-4 1-4 3-6-3-10 0"/></svg>',
    megaphone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 13 12 5V6L4 11zM4 13v3a2 2 0 0 0 2 2h1l2-4M19 9a3 3 0 0 1 0 6"/></svg>',
    list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.6 2.8 8.3 7 10 4.2-1.7 7-5.4 7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.2a2 2 0 0 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1A2 2 0 0 1 3 15.1l.1-.1A2 2 0 0 0 1.7 11.6h-.2a2 2 0 0 1 0-4h.2A2 2 0 0 0 3 4.2l-.1-.1A2 2 0 0 1 5.7 1.3l.1.1A2 2 0 0 0 9.2 0h.2a2 2 0 0 1 4 0h.2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a2 2 0 0 0 1.4 3.4h.2a2 2 0 0 1 0 4H21a2 2 0 0 0-1.6 3.4Z" transform="translate(1 2) scale(.88)"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>',
  };

  const has = permission => Boolean(window.AdminAuth?.hasPermission(permission));
  function theme() { const saved = localStorage.getItem('sultra-admin-dark'); const dark = saved === null ? false : saved === 'true'; document.documentElement.classList.toggle('admin-dark', dark); }
  function applyPermissionVisibility() { document.querySelectorAll('[data-permission]').forEach(element => { const [resource, action] = String(element.dataset.permission || '').split(':'); element.hidden = !window.AdminAuth.hasPermission(resource, action); }); }
  function renderNav(page) {
    return nav.map(group => {
      const items = group.items.filter(([, , , permission]) => has(permission));
      if (!items.length) return '';
      return `<div class="admin-nav-section">${window.AdminUi.esc(group.section)}</div>${items.map(([key, label, href, , icon]) => `<a href="${href}" ${page === key ? 'aria-current="page"' : ''}><span class="admin-nav-icon">${icons[icon] || icons.grid}</span><span class="admin-nav-label">${window.AdminUi.esc(label)}</span></a>`).join('')}`;
    }).join('');
  }
  function shell() {
    const page = document.body.dataset.adminPage || 'dashboard';
    document.body.insertAdjacentHTML('afterbegin', '<a class="skip-link" href="#admin-main">Lewati ke konten utama</a>');
    const items = document.getElementById('admin-nav-items');
    if (items) items.innerHTML = renderNav(page) || '<span style="padding:.75rem;color:var(--admin-text-muted);font-size:.8rem">Tidak ada akses backoffice.</span>';
    document.querySelector('[data-menu-toggle]')?.addEventListener('click', () => document.getElementById('admin-sidebar').classList.toggle('is-open'));
    document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => { const dark = !document.documentElement.classList.contains('admin-dark'); localStorage.setItem('sultra-admin-dark', String(dark)); theme(); });
    document.querySelector('[data-logout]')?.addEventListener('click', () => window.AdminAuth.adminLogout());
    document.querySelector('[data-global-search]')?.addEventListener('keydown', event => { if (event.key === 'Enter' && event.currentTarget.value.trim()) window.location.href = `/admin/users.html?search=${encodeURIComponent(event.currentTarget.value.trim())}`; });
    applyPermissionVisibility();
  }
  function layout(auth) {
    const main = document.querySelector('#admin-main');
    if (!main) return;
    const content = main.innerHTML;
    const role = String(auth?.role || 'guest').toUpperCase();
    const name = auth?.user?.name || auth?.user?.email || 'Admin';
    main.outerHTML = `<div class="admin-shell"><aside class="admin-sidebar" id="admin-sidebar"><a class="admin-brand" href="/admin/dashboard.html"><span class="admin-mark">S</span><span>SultraKita Admin<small>Operations center</small></span></a><nav class="admin-nav" aria-label="Navigasi admin"><div id="admin-nav-items"></div></nav><div class="admin-sidebar-footer"><div class="admin-profile-chip"><span class="admin-avatar">${window.AdminUi.esc(role.slice(0, 1))}</span><span><strong id="admin-name">${window.AdminUi.esc(name)}</strong><br><small id="admin-role">${window.AdminUi.esc(role)}</small></span></div><a href="/">← Kembali ke marketplace</a></div></aside><main id="admin-main" class="admin-content" tabindex="-1"><header class="admin-topbar"><div class="admin-topbar-inner"><button class="admin-button secondary admin-mobile-toggle" type="button" data-menu-toggle aria-label="Buka navigasi">Menu</button><div><h1>${window.AdminUi.esc(document.body.dataset.adminTitle || 'Admin Dashboard')}</h1><p>${window.AdminUi.esc(document.body.dataset.adminSubtitle || 'Operations center SultraKita.')}</p></div></div><div class="admin-actions"><label class="admin-topbar-search"><span aria-hidden="true">⌕</span><input type="search" data-global-search placeholder="Cari pengguna atau listing…" aria-label="Cari pengguna atau listing"></label><span class="admin-profile-chip"><span class="admin-avatar">${window.AdminUi.esc(role.slice(0, 1))}</span><span>${window.AdminUi.esc(role)}</span></span><button class="admin-button ghost" type="button" data-theme-toggle>Mode</button><button class="admin-button secondary" type="button" data-logout>Keluar</button></div></header>${content}</main></div>`;
  }
  async function init() { theme(); const auth = await window.AdminAuth.checkAdminAuth(); if (!auth) return; layout(auth); shell(); document.dispatchEvent(new CustomEvent('admin:layout-ready', { detail: auth })); }
  document.addEventListener('DOMContentLoaded', init);
})();

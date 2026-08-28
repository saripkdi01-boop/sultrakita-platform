(() => {
  'use strict';

  const ui = window.AdminUi;
  const api = window.AdminApi;
  const utils = window.AdminUtils;
  const root = () => document.querySelector('[data-page-content]');
  const esc = value => ui.esc(value);
  const number = value => value === null || value === undefined || value === '' ? '—' : ui.formatNumber(value);
  const currency = value => value === null || value === undefined || value === '' ? '—' : `Rp ${ui.formatNumber(value)}`;
  const statusBadge = value => ui.badge(value || '-', ['pending', 'open', 'reviewing'].includes(value) ? 'warn' : ['rejected', 'archived'].includes(value) ? 'danger' : '');
  const action = (label, url, body) => `<button class="admin-button secondary" data-action-url="${esc(url)}" data-action-method="PATCH" data-action-body='${JSON.stringify(body)}'>${esc(label)}</button>`;

  const icons = {
    listing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5z"/><path d="m4 7.5 8 4 8-4M12 11.5V20"/></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 3.7a3.5 3.5 0 0 1 0 6.8M17 14.5h.5a4 4 0 0 1 4 4V20"/></svg>',
    growth: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16 5-5 4 3 7-8"/><path d="M15 6h5v5"/></svg>',
    queue: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3.7 7.5v9L12 21l8.3-4.5v-9z"/><path d="M8 12h8M8 15h5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.7-4L4 9"/><path d="M4 4v5h5M4 13a8 8 0 0 0 14.7 4L20 15"/><path d="M20 20v-5h-5"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>',
    pulse: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>',
  };

  function base(title, copy, content) {
    root().innerHTML = `<article class="admin-card admin-span-12"><h2>${esc(title)}</h2><p>${esc(copy)}</p><p class="admin-status" data-status></p>${content}</article>`;
  }

  function dashboardMetric(label, value, icon, accent, footnote, tone = '') {
    return `<article class="admin-card admin-metric admin-span-3" style="--metric-accent:${accent}">
      <div class="metric-top"><span class="metric-icon">${icons[icon] || icons.listing}</span><span class="metric-footnote ${tone}">${esc(footnote || 'Data server')}</span></div>
      <small>${esc(label)}</small><strong>${number(value)}</strong>
    </article>`;
  }

  function dashboardCard(title, copy, content, linkLabel = '', linkHref = '') {
    const link = linkLabel && linkHref ? `<a class="dashboard-card-link" href="${esc(linkHref)}">${esc(linkLabel)} ${icons.arrow}</a>` : '';
    return `<article class="admin-card dashboard-card admin-span-6"><header class="dashboard-card-head"><div><h3>${esc(title)}</h3><p>${esc(copy)}</p></div>${link}</header><div class="dashboard-card-body">${content}</div></article>`;
  }

  function activityRows(summary) {
    const rows = [
      ['Event platform', summary?.events, '#0d5c4b'],
      ['Listing baru', summary?.new_listings, '#168269'],
      ['Pengguna baru', summary?.new_users, '#087f9d'],
      ['Laporan baru', summary?.new_reports, '#ee8765'],
    ];
    const values = rows.map(([, value]) => Number(value || 0));
    const max = Math.max(1, ...values);
    return `<div class="activity-list">${rows.map(([label, value, color]) => `<div class="activity-row"><span class="activity-label">${esc(label)}</span><span class="activity-track"><span class="activity-fill" style="--bar-color:${color};width:${Math.max(3, Math.round(Number(value || 0) / max * 100))}%"></span></span><strong class="activity-value">${number(value)}</strong></div>`).join('')}</div>`;
  }

  function donationChart(daily) {
    const rows = Array.isArray(daily) ? daily.slice(-7) : [];
    if (!rows.length) return '<div class="donation-empty">Belum ada transaksi donasi pada periode ini.</div>';
    const values = rows.map(row => Number(row.net_amount || 0));
    const max = Math.max(1, ...values);
    return `<div class="donation-chart" style="--chart-count:${rows.length}" role="img" aria-label="Donasi bersih tujuh hari terakhir">${rows.map(row => {
      const day = String(row.date || '').slice(5) || '—';
      const height = Math.max(4, Math.round(Number(row.net_amount || 0) / max * 100));
      return `<div class="donation-column" title="${esc(`${day}: ${currency(row.net_amount)}`)}"><div class="donation-bar-wrap"><span class="donation-bar" style="height:${height}%"></span></div><span class="donation-date">${esc(day)}</span></div>`;
    }).join('')}</div>`;
  }

  function listingRows(rows) {
    if (!rows.length) return '<div class="admin-empty">Belum ada listing terbaru.</div>';
    return `<div class="dashboard-list">${rows.slice(0, 5).map(row => `<div class="dashboard-list-item"><div class="dashboard-list-item-main"><span class="listing-thumb">${esc(String(row.title || 'L').trim().slice(0, 1).toUpperCase())}</span><span><strong title="${esc(row.title)}">${esc(row.title || 'Listing tanpa judul')}</strong><small>${esc(row.seller_name || 'Seller belum diketahui')} · ${statusBadge(row.status)}</small></span></div><span class="dashboard-list-item-value">${currency(row.price)}</span></div>`).join('')}</div>`;
  }

  function queueRows(verifications, reports) {
    const queue = [
      ...verifications.slice(0, 3).map(row => ({ ...row, queue: 'Verifikasi seller', sub: row.name || row.document_type || 'Dokumen seller', tone: '' })),
      ...reports.filter(row => ['open', 'reviewing'].includes(String(row.status || '').toLowerCase())).slice(0, 3).map(row => ({ ...row, queue: 'Laporan komunitas', sub: row.listing_title || row.reason || 'Laporan listing', tone: 'report' })),
    ].slice(0, 5);
    if (!queue.length) return '<div class="admin-empty">Antrean moderasi kosong.</div>';
    return `<div class="dashboard-list">${queue.map(row => `<div class="dashboard-list-item queue-item"><div class="dashboard-list-item-main"><span class="listing-thumb ${row.tone}">${row.tone === 'report' ? '!' : '✓'}</span><span><strong>${esc(row.queue)}</strong><small title="${esc(row.sub)}">${esc(row.sub)}</small>${statusBadge(row.status)}</span></div><a class="dashboard-card-link" href="${row.tone === 'report' ? '/admin/reports.html' : '/admin/verifications.html'}" aria-label="Buka ${esc(row.queue)}">${icons.arrow}</a></div>`).join('')}</div>`;
  }

  async function exportAnalytics() {
    const state = api.state || {};
    const headers = { ...(state.session ? { authorization: `Bearer ${state.session}` } : {}), ...(state.adminToken ? { 'x-admin-token': state.adminToken } : {}) };
    const response = await fetch('/api/admin/v2/analytics/export?days=30', { headers, cache: 'no-store' });
    if (!response.ok) throw new Error('Ekspor analytics gagal.');
    const blob = await response.blob();
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = 'sultrakita-analytics-30d.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(href);
  }

  async function dashboard() {
    const results = await Promise.allSettled([
      api.request('/api/admin/v2/dashboard/overview'),
      api.request('/api/admin/v2/listings?limit=5'),
      api.request('/api/admin/v2/reports?limit=10'),
      api.request('/api/admin/v2/verifications?status=pending&limit=10'),
      api.request('/api/admin/v2/analytics?days=7'),
      api.request('/api/admin/donations/analytics?days=7'),
    ]);
    const value = (index, fallback) => results[index].status === 'fulfilled' ? results[index].value : fallback;
    const overview = value(0, {});
    const listings = value(1, []);
    const reports = value(2, []);
    const verifications = value(3, []);
    const analytics = value(4, {});
    const donationAnalytics = value(5, {});
    const summary = analytics.summary || {};
    const totals = donationAnalytics.totals || {};
    const failed = results.filter(result => result.status === 'rejected').length;
    const openReports = reports.filter(row => ['open', 'reviewing'].includes(String(row.status || '').toLowerCase())).length;
    const pendingVerifications = verifications.length;
    const queueTotal = Number(overview.pending_verifications ?? pendingVerifications) + Number(overview.open_reports ?? openReports);
    const healthTitle = failed ? 'Sebagian data perlu diperiksa' : 'Semua layanan operasional';
    const healthCopy = failed ? `${failed} sumber data tidak merespons. Kartu yang tersedia tetap ditampilkan tanpa angka sintetis.` : 'Dashboard terhubung ke endpoint server dan siap dipantau.';
    const trendCopy = analytics.days ? `${analytics.days} hari terakhir` : 'Periode analytics';
    const netAmount = totals.net_amount;

    root().innerHTML = `<div class="admin-grid admin-dashboard-grid">
      <div class="admin-span-12">
        <section class="dashboard-intro">
          <div class="dashboard-intro-copy"><p class="dashboard-kicker">Operations center</p><h2>Ringkasan hari ini</h2><p>Pantau marketplace, trust seller, dan aktivitas komunitas SultraKita dari satu ruang kerja.</p></div>
          <div class="dashboard-actions"><button class="admin-button secondary" type="button" data-dashboard-export data-permission="analytics:export">${icons.download} Ekspor CSV</button><button class="admin-button" type="button" data-dashboard-refresh>${icons.refresh} Refresh</button></div>
        </section>
      </div>
      <div class="admin-span-12">
        <section class="dashboard-health"><div class="dashboard-health-main"><span class="health-pulse">${icons.pulse}</span><span><strong>${healthTitle}</strong><small>${esc(healthCopy)}</small></span></div><div class="dashboard-health-meta"><span class="health-stat"><strong>${number(summary.events)}</strong><span>event · ${esc(trendCopy)}</span></span><span class="health-stat"><strong>${number(queueTotal)}</strong><span>item perlu perhatian</span></span></div></section>
      </div>
      ${dashboardMetric('Listing aktif', overview.active_listings, 'listing', '#0d5c4b', 'Marketplace')}
      ${dashboardMetric('Total pengguna', overview.total_users, 'users', '#087f9d', 'Semua akun')}
      ${dashboardMetric('Pengguna baru', summary.new_users, 'growth', '#168269', trendCopy)}
      ${dashboardMetric('Antrean moderasi', queueTotal, 'queue', '#ee8765', queueTotal ? 'Perlu ditinjau' : 'Tidak ada antrean', queueTotal ? 'warning' : 'positive')}
      ${dashboardCard('Aktivitas platform', 'Sinyal operasional dari server, tanpa angka buatan.', `${activityRows(summary)}<div class="activity-footnote"><span>Periode data</span><strong>${esc(trendCopy)}</strong></div>`, 'Lihat analytics', '/admin/analytics.html')}
      ${dashboardCard('Donasi bersih', 'Performa transaksi yang berhasil setelah refund.', `<div class="chart-summary"><strong>${currency(netAmount)}</strong><span>${number(totals.successful)} transaksi sukses</span></div>${donationChart(donationAnalytics.daily)}`, 'Kelola donasi', '/admin/donations.html')}
      ${dashboardCard('Listing terbaru', 'Listing yang paling baru masuk ke marketplace.', listingRows(Array.isArray(listings) ? listings : []), 'Buka semua', '/admin/listings.html')}
      ${dashboardCard('Antrean moderasi', 'Verifikasi seller dan laporan komunitas yang menunggu tindakan.', queueRows(Array.isArray(verifications) ? verifications : [], Array.isArray(reports) ? reports : []), 'Buka antrean', '/admin/verifications.html')}
      <div class="admin-span-12"><p class="admin-status" data-status>${failed ? `${failed} sumber data tidak tersedia saat ini.` : `Terakhir dimuat: ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())}`}</p></div>
    </div>`;

    document.querySelector('[data-dashboard-refresh]')?.addEventListener('click', async event => {
      const button = event.currentTarget;
      button.disabled = true;
      button.innerHTML = `${icons.refresh} Memuat…`;
      try { await dashboard(); } catch (error) { ui.setStatus(error.message, true); button.disabled = false; }
    });
    document.querySelector('[data-dashboard-export]')?.addEventListener('click', async event => {
      const button = event.currentTarget;
      button.disabled = true;
      try { await exportAnalytics(); ui.setStatus('CSV analytics berhasil disiapkan.'); } catch (error) { ui.setStatus(error.message, true); } finally { button.disabled = false; }
    });
  }

  async function users() {
    base('Pengguna', 'Cari dan filter pengguna. PII hanya dikirim bila permission server mengizinkan.', '<form id="filter-form" class="admin-toolbar"><div class="admin-toolbar-group"><input class="admin-input" name="search" placeholder="Cari nama atau email" aria-label="Cari pengguna"><select class="admin-select" name="role" aria-label="Filter role"><option value="">Semua role</option><option value="buyer">Buyer</option><option value="seller">Seller</option><option value="admin">Admin</option></select><button class="admin-button" type="submit">Cari</button></div></form><div id="data-table" class="admin-empty">Memuat…</div>');
    const load = async (search = '', role = '') => { const data = await api.request(`/api/admin/v2/users?${utils.query({ search, role, limit: 100 })}`); ui.table('#data-table', [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Nama' }, { key: 'email', label: 'Email / Telepon', render: row => esc(row.email || row.phone || '—') }, { key: 'role', label: 'Role', render: row => ui.badge(row.role) }, { key: 'verification_status', label: 'Verifikasi' }, { key: 'created_at', label: 'Bergabung', render: row => utils.date(row.created_at) }], data, 'Pengguna tidak ditemukan.'); };
    document.querySelector('#filter-form').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.currentTarget); load(form.get('search'), form.get('role')).catch(error => ui.setStatus(error.message, true)); });
    await load();
  }

  async function listings() {
    base('Listings', 'Moderasi listing dengan status allowlist dan actions berbasis RBAC.', '<div class="admin-toolbar"><select id="status-filter" class="admin-select" aria-label="Filter status"><option value="">Semua status</option><option>active</option><option>sold</option><option>archived</option></select><button id="reload" class="admin-button secondary">Muat ulang</button></div><div id="data-table" class="admin-empty">Memuat…</div>');
    const load = async status => { const data = await api.request(`/api/admin/v2/listings?${utils.query({ status, limit: 100 })}`); ui.table('#data-table', [{ key: 'id', label: 'ID' }, { key: 'title', label: 'Judul' }, { key: 'seller_name', label: 'Seller' }, { key: 'price', label: 'Harga', render: row => currency(row.price) }, { key: 'status', label: 'Status', render: row => statusBadge(row.status) }, { key: 'created_at', label: 'Dibuat', render: row => utils.date(row.created_at) }, { key: 'actions', label: 'Aksi', render: row => action('Arsipkan', `/api/admin/v2/listings/${row.id}/status`, { status: 'archived' }) }], data, 'Belum ada listing.'); };
    document.querySelector('#status-filter').addEventListener('change', event => load(event.target.value).catch(error => ui.setStatus(error.message, true))); document.querySelector('#reload').addEventListener('click', () => load(document.querySelector('#status-filter').value).catch(error => ui.setStatus(error.message, true))); await load('');
  }

  async function reports() { base('Laporan', 'Moderasi laporan komunitas dan resolusi terukur.', '<div id="data-table" class="admin-empty">Memuat…</div>'); const data = await api.request('/api/admin/v2/reports?limit=100'); ui.table('#data-table', [{ key: 'id', label: 'ID' }, { key: 'listing_title', label: 'Listing' }, { key: 'reason', label: 'Alasan' }, { key: 'status', label: 'Status', render: row => statusBadge(row.status) }, { key: 'created_at', label: 'Dibuat', render: row => utils.date(row.created_at) }, { key: 'actions', label: 'Aksi', render: row => row.status === 'resolved' ? '—' : action('Selesaikan', `/api/admin/v2/reports/${row.id}`, { status: 'resolved' }) }], data, 'Tidak ada laporan.'); }
  async function verifications() { base('Verifikasi seller', 'Review antrean KTP/NIB dengan prinsip minimal-data.', '<div id="data-table" class="admin-empty">Memuat…</div>'); const data = await api.request('/api/admin/v2/verifications?status=pending&limit=100'); ui.table('#data-table', [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Nama' }, { key: 'document_type', label: 'Dokumen' }, { key: 'district', label: 'Wilayah' }, { key: 'created_at', label: 'Dikirim', render: row => utils.date(row.created_at) }, { key: 'actions', label: 'Aksi', render: row => `${action('Setujui', `/api/admin/v2/verifications/${row.id}`, { status: 'approved' })} ${action('Tolak', `/api/admin/v2/verifications/${row.id}`, { status: 'rejected' })}` }], data, 'Tidak ada antrean verifikasi.'); }
  async function analytics() { base('Analytics', 'Ringkasan event dan ekspor data.', '<div id="data-table" class="admin-empty">Memuat…</div>'); const data = await api.request('/api/admin/v2/analytics?days=30'); root().querySelector('#data-table').innerHTML = `<div class="admin-grid" style="padding:0">${Object.entries(data.summary || {}).map(([key, value]) => ui.metric(key.replaceAll('_', ' '), value)).join('')}</div><p style="margin-top:1rem"><a class="admin-button" href="/api/admin/v2/analytics/export?days=30">Export CSV 30 hari</a></p>`; }
  async function audit() { base('Audit logs', 'Riwayat tindakan administratif.', '<div id="data-table" class="admin-empty">Memuat…</div>'); const data = await api.request('/api/admin/v2/audit-logs?limit=100'); ui.table('#data-table', [{ key: 'created_at', label: 'Waktu', render: row => utils.date(row.created_at) }, { key: 'action', label: 'Aksi' }, { key: 'entity_type', label: 'Resource' }, { key: 'entity_id', label: 'Resource ID' }, { key: 'actor_id', label: 'Admin' }], data, 'Audit log masih kosong.'); }
  async function settings() { base('Settings', 'Konfigurasi platform hanya untuk Super Admin.', '<div data-permission="settings:manage"><div id="data-table" class="admin-empty">Memuat…</div></div>'); const data = await api.request('/api/admin/v2/settings'); ui.table('#data-table', [{ key: 'setting_key', label: 'Key' }, { key: 'setting_group', label: 'Group' }, { key: 'setting_value', label: 'Value', render: row => `<code>${esc(JSON.stringify(row.setting_value))}</code>` }, { key: 'updated_at', label: 'Updated', render: row => utils.date(row.updated_at) }], data, 'Settings belum tersedia.'); }
  async function roles() { base('Roles', 'Permission matrix dan role hierarchy.', '<div data-permission="roles:manage"><div id="data-table" class="admin-empty">Memuat…</div></div>'); const data = await api.request('/api/admin/system/roles'); ui.table('#data-table', [{ key: 'role_key', label: 'Role' }, { key: 'level', label: 'Level' }, { key: 'description', label: 'Description' }, { key: 'permissions', label: 'Permissions', render: row => esc((row.permissions || []).join(', ')) }], data, 'Role belum tersedia.'); }
  async function categories() { base('Categories', 'CRUD kategori dengan perlindungan terhadap kategori yang masih dipakai.', '<form id="category-form" class="admin-toolbar" data-permission="categories:manage"><input class="admin-input" name="name" placeholder="Nama kategori" aria-label="Nama kategori" required><input class="admin-input" name="icon" value="tag" aria-label="Icon kategori"><button class="admin-button" type="submit">Tambah kategori</button></form><div id="data-table" class="admin-empty">Memuat…</div>'); const load = async () => { const data = await api.request('/api/admin/v2/categories'); ui.table('#data-table', [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' }, { key: 'icon', label: 'Icon' }, { key: 'listing_count', label: 'Listings' }], data, 'Belum ada kategori.'); }; document.querySelector('#category-form').addEventListener('submit', async event => { event.preventDefault(); const form = new FormData(event.currentTarget); try { await api.request('/api/admin/v2/categories', { method: 'POST', body: JSON.stringify({ name: form.get('name'), icon: form.get('icon') }) }); event.currentTarget.reset(); await load(); } catch (error) { ui.setStatus(error.message, true); } }); await load(); }
  async function broadcasts() { base('Broadcasts', 'Buat banner atau announcement untuk target audience.', '<form id="content-form" class="admin-form-grid" data-permission="content:manage"><div class="admin-field"><label for="content-title">Judul</label><input id="content-title" class="admin-input" required></div><div class="admin-field"><label for="content-type">Tipe</label><select id="content-type" class="admin-select"><option value="banner">Banner</option><option value="announcement">Announcement</option><option value="popup">Popup</option></select></div><div class="admin-field full"><label for="content-body">Isi</label><textarea id="content-body" class="admin-textarea"></textarea></div><div class="admin-field full"><button class="admin-button" type="submit">Publikasikan</button></div></form><div id="data-table" class="admin-empty">Memuat…</div>'); const load = async () => { const data = await api.request('/api/admin/v2/content'); ui.table('#data-table', [{ key: 'title', label: 'Title' }, { key: 'content_type', label: 'Type' }, { key: 'target_audience', label: 'Audience' }, { key: 'is_active', label: 'Active' }, { key: 'created_at', label: 'Created', render: row => utils.date(row.created_at) }], data, 'Belum ada broadcast.'); }; document.querySelector('#content-form').addEventListener('submit', async event => { event.preventDefault(); try { await api.request('/api/admin/v2/content', { method: 'POST', body: JSON.stringify({ title: document.querySelector('#content-title').value, content_type: document.querySelector('#content-type').value, body: document.querySelector('#content-body').value }) }); event.currentTarget.reset(); await load(); } catch (error) { ui.setStatus(error.message, true); } }); await load(); }
  async function donations() { base('Donasi', 'Campaign dan transaction monitoring.', '<div id="donation-summary" class="admin-note">Memuat ringkasan…</div><div id="data-table" class="admin-empty">Memuat transaksi…</div>'); const [summary, data] = await Promise.all([api.request('/api/admin/donations/analytics?days=30'), api.request('/api/admin/v2/donations?limit=100')]); document.querySelector('#donation-summary').textContent = `Attempts: ${ui.formatNumber(summary.totals?.attempts)} · Successful: ${ui.formatNumber(summary.totals?.successful)} · Net: Rp ${ui.formatNumber(summary.totals?.net_amount)}`; ui.table('#data-table', [{ key: 'transaction_id', label: 'Transaction' }, { key: 'name', label: 'Donor' }, { key: 'amount', label: 'Amount', render: row => currency(row.amount) }, { key: 'payment_status', label: 'Payment', render: row => statusBadge(row.payment_status) }, { key: 'created_at', label: 'Created', render: row => utils.date(row.created_at) }], data, 'Belum ada transaksi.'); }
  async function webhooks() { base('Webhooks', 'Webhook delivery logs read-only.', '<div id="data-table" class="admin-empty">Memuat…</div>'); const data = await api.request('/api/admin/webhook-logs?limit=100'); ui.table('#data-table', [{ key: 'created_at', label: 'Time', render: row => utils.date(row.created_at) }, { key: 'provider', label: 'Provider' }, { key: 'transaction_id', label: 'Transaction' }, { key: 'event_status', label: 'Status' }, { key: 'http_status', label: 'HTTP' }, { key: 'signature_valid', label: 'Signature' }], data, 'Belum ada webhook.'); }

  const unsupported = (title, copy) => base(title, copy, '<div class="admin-note">Modul UI tersedia; operasi khusus belum diaktifkan karena memerlukan kontrak schema/API tambahan.</div>');
  const views = { dashboard, users, listings, categories, donations, reports, verifications, analytics, settings, broadcasts, audit, roles, webhooks, profile: () => unsupported('Admin profile', 'Profil mengikuti session bearer existing.') };

  document.addEventListener('admin:layout-ready', async () => {
    try { await (views[document.body.dataset.adminPage] || views.dashboard)(); window.AdminRbac?.apply(); }
    catch (error) { ui.setStatus(error.message, true); }
  });

  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-action-url]');
    if (!button) return;
    button.disabled = true;
    try { await api.request(button.dataset.actionUrl, { method: button.dataset.actionMethod, body: button.dataset.actionBody }); window.location.reload(); }
    catch (error) { ui.setStatus(error.message, true); button.disabled = false; }
  });
})();

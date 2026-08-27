'use strict';

// UI is intentionally conservative: it only improves discoverability; every API still enforces RBAC server-side.
(() => {
  const byId = id => document.getElementById(id);
  const tokenHeaders = () => ({ authorization: `Bearer ${byId('session')?.value.trim() || ''}`, 'x-admin-token': byId('token')?.value.trim() || '' });
  const panelByHeading = heading => [...document.querySelectorAll('section, article')].find(node => node.querySelector('h2')?.textContent.trim() === heading);
  const permissionsByPanel = [
    ['Marketplace pulse', 'view_analytics'],
    ['Seller verification', 'verify_sellers'],
    ['Reports moderation', 'moderate_reports'],
    ['Tambahkan kategori lowongan via URL', 'manage_content'],
    ['Tambah kartu marketplace dari link', 'manage_content']
  ];

  function mount() {
    const authBox = document.querySelector('.auth-box');
    if (!authBox || byId('rbac-status')) return;
    const panel = document.createElement('section');
    panel.id = 'rbac-status';
    panel.className = 'panel';
    panel.setAttribute('aria-live', 'polite');
    panel.style.margin = '0 0 15px';
    panel.innerHTML = '<h2>Akses akun</h2><p id="rbac-copy" class="muted">Role dan permission dimuat setelah autentikasi.</p><div id="rbac-permissions" class="muted"></div><div id="rbac-role-management" hidden style="margin-top:12px;padding-top:12px;border-top:1px solid var(--line)"><strong>Manajemen role</strong><p class="muted">Hanya Super Admin yang dapat mengubah assignment role.</p><form id="rbac-role-form" style="display:flex;gap:8px;flex-wrap:wrap;align-items:end"><label class="muted">ID pengguna<input id="rbac-user-id" type="number" min="1" required style="display:block;width:130px;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink)"></label><label class="muted">Role<select id="rbac-role" required style="display:block;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink)"><option value="user">USER</option><option value="seller">SELLER</option><option value="moderator">MODERATOR</option><option value="support">SUPPORT</option><option value="analyst">ANALYST</option><option value="admin">ADMIN</option><option value="super_admin">SUPER_ADMIN</option></select></label><button class="action" type="submit">Simpan role</button></form><p id="rbac-role-message" class="muted" role="status"></p></div>';
    authBox.insertAdjacentElement('afterend', panel);
    applyVisibility([]);
  }

  function applyVisibility(permissions) {
    const allowed = new Set(permissions || []);
    const roleManagement = byId('rbac-role-management');
    if (roleManagement) roleManagement.hidden = !allowed.has('manage_roles');
    for (const [heading, permission] of permissionsByPanel) {
      const panel = panelByHeading(heading);
      if (panel) panel.hidden = !allowed.has(permission);
    }
  }

  async function refresh() {
    mount();
    const copy = byId('rbac-copy');
    const list = byId('rbac-permissions');
    if (!copy) return;
    try {
      const response = await fetch('/api/admin/rbac/me', { headers: tokenHeaders(), cache: 'no-store' });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        applyVisibility([]);
        copy.textContent = 'Akses operasional belum terverifikasi. Panel sensitif disembunyikan.';
        list.textContent = '';
        return;
      }
      const data = body.data || {};
      const permissions = Array.isArray(data.permissions) ? data.permissions : [];
      copy.textContent = `Role efektif: ${String(data.role || 'user').toUpperCase()} · Level ${Number(data.level || 1)}`;
      list.textContent = permissions.length ? `Permission: ${permissions.join(', ')}` : 'Tidak ada permission backoffice.';
      applyVisibility(permissions);
    } catch {
      applyVisibility([]);
      copy.textContent = 'Akses operasional belum dapat diverifikasi. Panel sensitif disembunyikan.';
      list.textContent = '';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    mount();
    byId('load')?.addEventListener('click', refresh);
    byId('rbac-role-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const message = byId('rbac-role-message');
      try {
        const userId = Number(byId('rbac-user-id').value);
        const role = byId('rbac-role').value;
        const response = await fetch(`/api/admin/rbac/assignments/${userId}`, { method: 'PUT', headers: { ...tokenHeaders(), 'content-type': 'application/json' }, body: JSON.stringify({ role }) });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || 'Assignment role gagal disimpan.');
        message.textContent = `Role ${role} untuk pengguna ${userId} berhasil disimpan.`;
      } catch (error) { message.textContent = error.message; }
    });
  });
})();

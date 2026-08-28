(() => {
  'use strict';
  const state = window.AdminState;
  const nextPath = () => { const path = `${window.location.pathname}${window.location.search}`; return path.startsWith('/admin/') && path !== '/admin/index.html' ? path : '/admin/dashboard.html'; };
  function redirectToLogin() { const target = nextPath(); window.location.replace(`/admin/index.html?next=${encodeURIComponent(target)}`); }
  async function checkAdminAuth(options = {}) {
    const shouldRedirect = options.redirect !== false;
    if (!state?.session || !state.adminToken) { if (shouldRedirect) redirectToLogin(); return null; }
    try {
      const me = await window.AdminApi.request('/api/admin/v2/');
      if (!me?.role || !Array.isArray(me.permissions) || !Number.isInteger(Number(me.level))) throw new Error('Dokumen akses admin tidak lengkap.');
      state.me = me;
      sessionStorage.setItem('admin_role', me.role);
      sessionStorage.setItem('admin_level', String(me.level));
      sessionStorage.setItem('admin_name', me.name || me.email || me.role);
      document.dispatchEvent(new CustomEvent('admin:ready', { detail: me }));
      return { user: { id: me.user_id, email: me.email, name: me.name }, role: me.role, level: Number(me.level), permissions: me.permissions };
    } catch (error) {
      window.AdminApi.clearCredentials();
      if (shouldRedirect) redirectToLogin();
      return null;
    }
  }
  const loadMe = checkAdminAuth;
  const permissionAliases = Object.freeze({
    'dashboard:view': 'view_dashboard', 'users:view': 'manage_users', 'users:manage': 'manage_users', 'users:ban': 'ban_users', 'users:pii': 'view_user_pii',
    'admins:manage': 'manage_admins', 'roles:manage': 'manage_roles', 'listings:view': 'manage_listings', 'listings:manage': 'manage_listings', 'listings:approve': 'approve_listings', 'listings:feature': 'feature_listings', 'listings:delete': 'delete_any_listing',
    'categories:manage': 'manage_categories', 'reports:moderate': 'moderate_reports', 'verifications:manage': 'verify_sellers', 'donations:manage': 'manage_donations', 'content:manage': 'manage_content', 'analytics:view': 'view_analytics', 'analytics:export': 'export_data', 'audit:view': 'view_audit_log', 'settings:manage': 'manage_settings', 'payments:manage': 'manage_payment_config', 'notifications:send': 'send_notifications',
  });
  function permissionKey(resource, action) { if (action === undefined) return String(resource || ''); const pair = `${resource}:${action}`.toLowerCase(); return permissionAliases[pair] || `${String(resource).toLowerCase()}_${String(action).toLowerCase()}`; }
  function hasPermission(resource, action) { const key = permissionKey(resource, action); return Boolean(state?.me?.permissions?.includes('*') || state?.me?.permissions?.includes(key)); }
  async function adminLogout() { const token = state?.session; try { if (token) await fetch('/api/auth/logout', { method: 'POST', headers: { authorization: `Bearer ${token}` }, cache: 'no-store', keepalive: true }); } finally { window.AdminApi.clearCredentials(); sessionStorage.removeItem('admin_role'); sessionStorage.removeItem('admin_level'); sessionStorage.removeItem('admin_name'); window.location.replace('/admin/index.html'); } }
  const logout = adminLogout;
  window.AdminAuth = { checkAdminAuth, loadMe, hasPermission, permissionKey, adminLogout, logout, redirectToLogin };
})();

(() => {
  'use strict';
  const state = window.AdminState;
  async function loadMe() {
    if (!state?.session || !state.adminToken) throw new Error('Masukkan session bearer dan admin token.');
    const me = await window.AdminApi.request('/api/admin/v2/');
    state.me = me;
    document.dispatchEvent(new CustomEvent('admin:ready', { detail: me }));
    return me;
  }
  function logout() { window.AdminApi.clearCredentials(); window.location.href = '/admin'; }
  function requirePermission(permission) { return Boolean(state?.me?.permissions?.includes('*') || state?.me?.permissions?.includes(permission)); }
  window.AdminAuth = { loadMe, logout, requirePermission };
})();

(() => {
  'use strict';
  const state = window.AdminState = window.AdminState || { session: sessionStorage.getItem('sultra-admin-session') || '', adminToken: sessionStorage.getItem('sultra-admin-token') || '', me: null };
  const headers = (extra = {}) => ({ ...(state.session ? { authorization: `Bearer ${state.session}` } : {}), ...(state.adminToken ? { 'x-admin-token': state.adminToken } : {}), ...extra });
  async function request(url, options = {}) {
    const response = await fetch(url, { ...options, cache: 'no-store', headers: headers({ ...(options.body ? { 'content-type': 'application/json' } : {}), ...(options.headers || {}) }) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { const error = new Error(body.error || 'Permintaan admin gagal.'); error.status = response.status; error.body = body; throw error; }
    return body.data ?? body;
  }
  function setCredentials(session, adminToken) { state.session = String(session || '').trim(); state.adminToken = String(adminToken || '').trim(); sessionStorage.setItem('sultra-admin-session', state.session); sessionStorage.setItem('sultra-admin-token', state.adminToken); }
  function clearCredentials() { state.session = ''; state.adminToken = ''; state.me = null; sessionStorage.removeItem('sultra-admin-session'); sessionStorage.removeItem('sultra-admin-token'); }
  window.AdminApi = { request, setCredentials, clearCredentials, get state() { return state; } };
})();

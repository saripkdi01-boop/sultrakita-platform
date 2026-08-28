const crypto = require('node:crypto');

const normalizeAdminEmail = value => {
  const email = String(value || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254 ? email : null;
};

// The operations center is intentionally restricted to one human owner account.
// GOOGLE_ADMIN_EMAIL_ALLOWLIST remains documented for migration compatibility but is intentionally ignored;
// accepting an environment-provided list would violate the single-account requirement.
const ADMIN_GOOGLE_EMAIL = 'sultrakitaplatform@gmail.com';
const adminEmailAllowlist = () => new Set([ADMIN_GOOGLE_EMAIL]);

// Reuse the standard callback by default so Google Cloud needs only one production redirect URI.
// A dedicated admin callback remains supported when explicitly configured.
const adminGoogleRedirectUri = siteUrl => process.env.GOOGLE_ADMIN_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI || `${siteUrl}/api/auth/google/callback`;
const adminGoogleConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && adminEmailAllowlist().has(ADMIN_GOOGLE_EMAIL));
const createState = () => crypto.randomBytes(32).toString('hex');
const createExchangeCode = () => crypto.randomBytes(32).toString('hex');
const hashExchangeCode = code => crypto.createHash('sha256').update(code).digest('hex');

const safeAdminNext = value => {
  const next = String(value || '');
  return next.startsWith('/admin/') && !next.startsWith('//') && next !== '/admin/index.html' ? next : '/admin/dashboard.html';
};

const parseCookie = (header, name) => {
  const prefix = `${name}=`;
  const pair = String(header || '').split(';').map(item => item.trim()).find(item => item.startsWith(prefix));
  if (!pair) return null;
  try { return decodeURIComponent(pair.slice(prefix.length)); } catch { return null; }
};

const setAdminOAuthCookies = (res, state, next) => {
  const common = 'Max-Age=600; Path=/api/auth/google; HttpOnly; Secure; SameSite=Lax';
  res.setHeader('Set-Cookie', [`google_admin_oauth_state=${encodeURIComponent(state)}; ${common}`, `google_admin_oauth_next=${encodeURIComponent(safeAdminNext(next))}; ${common}`]);
};

const clearAdminOAuthCookies = res => {
  const common = 'Max-Age=0; Path=/api/auth/google; HttpOnly; Secure; SameSite=Lax';
  res.setHeader('Set-Cookie', [`google_admin_oauth_state=; ${common}`, `google_admin_oauth_next=; ${common}`]);
};

const googleAuthorizationUrl = (redirectUri, state) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

async function fetchVerifiedGoogleProfile(code, redirectUri) {
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: String(code),
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  const tokenPayload = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !tokenPayload.access_token) {
    const error = new Error('Login Google tidak dapat diselesaikan.');
    error.code = 'GOOGLE_TOKEN_EXCHANGE_FAILED';
    error.status = 502;
    error.providerError = String(tokenPayload.error || 'unknown').slice(0, 80);
    error.providerDescription = String(tokenPayload.error_description || '').slice(0, 240);
    console.error('[google-admin-token-exchange]', { status: tokenResponse.status, error: error.providerError, description: error.providerDescription, redirect_uri: redirectUri });
    throw error;
  }

  const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { authorization: `Bearer ${tokenPayload.access_token}` },
  });
  const profile = await profileResponse.json().catch(() => ({}));
  const email = normalizeAdminEmail(profile.email);
  if (!profileResponse.ok || !profile.sub || !email || profile.email_verified !== true) {
    const error = new Error('Profil Google tidak dapat diverifikasi.');
    error.code = 'GOOGLE_PROFILE_INVALID';
    error.status = 401;
    throw error;
  }
  return { ...profile, email };
}

module.exports = {
  normalizeAdminEmail,
  adminEmailAllowlist,
  adminGoogleRedirectUri,
  adminGoogleConfigured,
  createState,
  createExchangeCode,
  hashExchangeCode,
  safeAdminNext,
  parseCookie,
  setAdminOAuthCookies,
  clearAdminOAuthCookies,
  googleAuthorizationUrl,
  fetchVerifiedGoogleProfile,
};

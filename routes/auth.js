'use strict';

// Router autentikasi: OTP (WhatsApp/email), Google OAuth (user + admin SSO),
// verifikasi OTP, logout, dan MCP token exchange.
// Diekstrak dari server.js tanpa perubahan perilaku; dipasang di /api/auth (+ /api/mcp).
const express = require('express');
const crypto = require('node:crypto');
const { query, run } = require('../database');
const { authenticate: _authenticate, requireAuth, revokeToken, getSessionToken } = require('../auth');
const { normalizeRole } = require('../rbac');
const { ok, fail, failCode, setSessionResponse, clearSessionCookie } = require('../lib/http');
const { positiveInt, normalizeEmail, maskEmail, parseCookies } = require('../lib/validation');
const { sha256Hex, randomHex, safeEqual: _safeEqual } = require('../lib/crypto');
const { rateLimit } = require('../lib/rate-limit');
const { currentUser: _currentUser, issueSession } = require('../lib/sessions');
const { sendOtp, otpDestinationHash, otpDestinationCooldownSeconds } = require('../lib/otp');
const { ensureAuthSchema } = require('../lib/schema');
const { googleRedirectUri, googleConfigured } = require('../lib/orders');
const {
  adminEmailAllowlist: _adminEmailAllowlist, adminGoogleRedirectUri, adminGoogleConfigured,
  createAdminState, verifyAdminState, createExchangeCode, hashExchangeCode,
  safeAdminNext, parseCookie, setAdminOAuthCookies, clearAdminOAuthCookies,
  googleAuthorizationUrl, fetchVerifiedGoogleProfile,
} = require('../google-admin-sso');
const { SITE_URL } = require('../seo');
const { ALL_DISTRICTS } = require('../shared/taxonomy');

const router = express.Router();
const districts = ALL_DISTRICTS;
const otpRateLimit = rateLimit(5 * 60_000, 10);

router.post('/auth/request-otp', otpRateLimit, async (req, res, next) => {
  try {
    await ensureAuthSchema();
    const channel = req.body?.channel === 'email' ? 'email' : 'whatsapp';
    const phone = channel === 'whatsapp' ? String(req.body?.phone || '').trim() : null;
    const email = channel === 'email' ? normalizeEmail(req.body?.email) : null;
    if (channel === 'whatsapp' && !/^08\d{8,13}$/.test(phone || '')) return fail(res, 422, 'Nomor WhatsApp Indonesia belum valid');
    if (channel === 'email' && !email) return fail(res, 422, 'Alamat email belum valid');
    const destination = channel === 'email' ? email : phone;
    const destinationHash = otpDestinationHash(channel, destination);
    const cooldown = otpDestinationCooldownSeconds();
    const recentChallenge = await query(
      'SELECT id FROM auth_otp_challenges WHERE channel = ? AND destination_hash = ? AND consumed_at IS NULL AND created_at > now() - (? * interval \'1 second\') LIMIT 1',
      [channel, destinationHash, cooldown]
    );
    if (recentChallenge.length) {
      res.setHeader('Retry-After', String(cooldown));
      return failCode(res, 429, 'OTP_COOLDOWN', `Permintaan OTP untuk tujuan ini dapat dilakukan lagi dalam ${cooldown} detik.`);
    }
    const code = String(crypto.randomInt(100000, 1000000));
    const codeHash = sha256Hex(code);
    await run('DELETE FROM auth_otp_challenges WHERE (channel = ? AND destination_hash = ?) OR expires_at < now()', [channel, destinationHash]);
    await run("INSERT INTO auth_otp_challenges (channel, destination_hash, code_hash, expires_at) VALUES (?, ?, ?, now() + interval '5 minutes')", [channel, destinationHash, codeHash]);
    let delivered = false;
    try { delivered = await sendOtp(channel, destination, code); }
    catch (error) {
      console.error(`[otp-${channel}]`, error.message);
      if (process.env.OTP_DEV_MODE !== 'true') {
        await run('DELETE FROM auth_otp_challenges WHERE channel = ? AND destination_hash = ? AND consumed_at IS NULL', [channel, destinationHash]);
        return failCode(res, 503, 'OTP_PROVIDER_UNAVAILABLE', `OTP ${channel} sedang tidak tersedia. Coba lagi nanti.`);
      }
    }
    if (!delivered && process.env.OTP_DEV_MODE !== 'true') {
      await run('DELETE FROM auth_otp_challenges WHERE channel = ? AND destination_hash = ? AND consumed_at IS NULL', [channel, destinationHash]);
      return failCode(res, 503, 'OTP_NOT_CONFIGURED', `OTP ${channel} belum dikonfigurasi.`);
    }
    const response = {
      channel,
      destination: channel === 'email' ? maskEmail(email) : phone,
      expires_in: 300,
      delivered,
      message: delivered ? `Kode OTP telah dikirim melalui ${channel === 'email' ? 'email' : 'WhatsApp'}.` : 'Mode demo lokal aktif; gunakan kode yang ditampilkan.',
    };
    if (process.env.OTP_DEV_MODE === 'true') response.dev_code = code;
    ok(res, response);
  } catch (error) { next(error); }
});

router.post('/auth/verify-otp', otpRateLimit, async (req, res, next) => {
  try {
    await ensureAuthSchema();
    const channel = req.body?.channel === 'email' ? 'email' : 'whatsapp';
    const phone = channel === 'whatsapp' ? String(req.body?.phone || '').trim() : null;
    const email = channel === 'email' ? normalizeEmail(req.body?.email) : null;
    const code = String(req.body?.code || '').trim();
    const name = String(req.body?.name || 'Pengguna SultraKita');
    const role = req.body?.role || 'buyer';
    const district = req.body?.district || 'Kendari';
    if ((channel === 'whatsapp' && !/^08\d{8,13}$/.test(phone || '')) || (channel === 'email' && !email) || !/^\d{6}$/.test(code)) {
      return fail(res, 422, 'Tujuan atau kode OTP belum valid');
    }
    const destination = channel === 'email' ? email : phone;
    const destinationHash = otpDestinationHash(channel, destination);
    const [challenge] = await query(
      'SELECT id, code_hash, attempts FROM auth_otp_challenges WHERE channel = ? AND destination_hash = ? AND consumed_at IS NULL AND expires_at > now() AND attempts < 5 ORDER BY id DESC LIMIT 1',
      [channel, destinationHash]
    );
    if (!challenge) return fail(res, 401, 'OTP sudah kedaluwarsa atau tidak ditemukan');
    const hash = sha256Hex(code);
    const matches = hash.length === challenge.code_hash.length && crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(challenge.code_hash));
    if (!matches) {
      await run('UPDATE auth_otp_challenges SET attempts = attempts + 1 WHERE id = ?', [challenge.id]);
      return fail(res, 401, 'Kode OTP salah');
    }
    let [user] = await query(
      channel === 'email' ? 'SELECT * FROM users WHERE lower(email) = lower(?) LIMIT 1' : 'SELECT * FROM users WHERE phone = ? LIMIT 1',
      [destination]
    );
    if (!user) {
      const created = await run(
        'INSERT INTO users (name, phone, email, role, district, phone_verified, email_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name.trim().slice(0, 80), phone, email, ['buyer', 'seller'].includes(role) ? role : 'buyer', districts.includes(district) ? district : 'Kendari', channel === 'whatsapp', channel === 'email']
      );
      [user] = await query('SELECT * FROM users WHERE id = ?', [created.id]);
    } else {
      await run(`UPDATE users SET ${channel === 'email' ? 'email_verified' : 'phone_verified'} = true WHERE id = ?`, [user.id]);
      user = { ...user, ...(channel === 'email' ? { email_verified: true } : { phone_verified: true }) };
    }
    await run('UPDATE auth_otp_challenges SET consumed_at = now() WHERE id = ?', [challenge.id]);
    const token = await issueSession(user.id);
    setSessionResponse(res, token);
    ok(res, {
      token,
      user: {
        id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, district: user.district,
        phone_verified: Boolean(user.phone_verified) || channel === 'whatsapp',
        email_verified: Boolean(user.email_verified) || channel === 'email',
        verification_status: user.verification_status || 'unverified',
      },
    });
  } catch (error) { next(error); }
});

router.post('/auth/logout', requireAuth, async (req, res, next) => {
  try {
    await revokeToken(getSessionToken(req));
    res.setHeader('Set-Cookie', clearSessionCookie);
    res.setHeader('Cache-Control', 'no-store');
    ok(res, { logged_out: true });
  } catch (error) { next(error); }
});

router.post('/mcp/exchange', async (req, res, next) => {
  try {
    await ensureAuthSchema();
    const sourceToken = String((req.get('authorization') || '').replace(/^Bearer\s+/i, '') || req.body?.session_token || '').trim();
    if (!/^[A-Za-z0-9_-]{40,}$/.test(sourceToken)) return failCode(res, 401, 'MCP_EXCHANGE_UNAUTHENTICATED', 'Session SultraKita yang valid diperlukan.');
    const tokenHash = sha256Hex(sourceToken);
    const [sessionUser] = await query(
      'SELECT u.id, u.name, u.email, COALESCE(ara.role, u.role) AS role, u.district FROM sessions s JOIN users u ON u.id = s.user_id LEFT JOIN admin_role_assignments ara ON ara.user_id = u.id WHERE s.token_hash = ? AND s.expires_at > ? LIMIT 1',
      [tokenHash, Date.now()]
    );
    if (!sessionUser) return failCode(res, 401, 'MCP_EXCHANGE_UNAUTHENTICATED', 'Session SultraKita kedaluwarsa atau tidak valid.');
    const mcpToken = await issueSession(sessionUser.id, 15 * 60 * 1000);
    ok(res, {
      token: mcpToken, token_type: 'Bearer', expires_in: 900, scope: ['mcp:read', 'mcp:write'],
      user: { id: sessionUser.id, name: sessionUser.name, email: sessionUser.email, role: normalizeRole(sessionUser.role), district: sessionUser.district },
    });
  } catch (error) { next(error); }
});

// --- Google OAuth: admin SSO ---
router.get('/auth/google/admin/start', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  if (!adminGoogleConfigured()) return failCode(res, 503, 'GOOGLE_ADMIN_SSO_NOT_CONFIGURED', 'Google SSO admin belum dikonfigurasi oleh operator.');
  const next = safeAdminNext(req.query.next);
  const state = createAdminState(next);
  setAdminOAuthCookies(res, state, next);
  res.redirect(googleAuthorizationUrl(adminGoogleRedirectUri(SITE_URL), state));
});

router.get('/auth/google/admin/callback', async (req, res, next) => {
  try {
    await ensureAuthSchema();
    if (!adminGoogleConfigured()) return failCode(res, 503, 'GOOGLE_ADMIN_SSO_NOT_CONFIGURED', 'Google SSO admin belum dikonfigurasi oleh operator.');
    const signedState = verifyAdminState(req.query.state);
    const cookieState = parseCookie(req.headers.cookie, 'sultra_admin_oauth_state') || parseCookie(req.headers.cookie, 'google_admin_oauth_state');
    const state = signedState ? String(req.query.state) : cookieState;
    const nextPath = signedState?.next || safeAdminNext(parseCookie(req.headers.cookie, 'sultra_admin_oauth_next') || parseCookie(req.headers.cookie, 'google_admin_oauth_next'));
    if (!req.query.code || !req.query.state || (!signedState && (!state || state !== String(req.query.state)))) {
      clearAdminOAuthCookies(res);
      return failCode(res, 400, 'GOOGLE_ADMIN_OAUTH_STATE_INVALID', 'Sesi login Google admin tidak valid. Silakan ulangi.');
    }
    const profile = await fetchVerifiedGoogleProfile(req.query.code, adminGoogleRedirectUri(SITE_URL));
    const allowlist = require('../google-admin-sso').adminEmailAllowlist();
    if (!allowlist.has(profile.email)) {
      clearAdminOAuthCookies(res);
      return failCode(res, 403, 'GOOGLE_ADMIN_NOT_ALLOWLISTED', 'Akun Google ini tidak diizinkan untuk SSO admin.');
    }
    const [user] = await query(
      'SELECT u.id, u.name, u.email, COALESCE(ara.role, u.role) AS role FROM users u LEFT JOIN admin_role_assignments ara ON ara.user_id = u.id WHERE u.google_sub = ? OR lower(u.email) = lower(?) LIMIT 1',
      [profile.sub, profile.email]
    );
    if (!user) {
      clearAdminOAuthCookies(res);
      return failCode(res, 403, 'GOOGLE_ADMIN_PROVISIONING_REQUIRED', 'Identitas Google terverifikasi, tetapi user marketplace belum diprovisioning oleh operator.');
    }
    const effectiveRole = normalizeRole(user.role);
    if (!['admin', 'super_admin'].includes(effectiveRole)) {
      clearAdminOAuthCookies(res);
      return failCode(res, 403, 'GOOGLE_ADMIN_ROLE_REQUIRED', 'User Google belum memiliki role backoffice admin.');
    }
    await run('UPDATE users SET google_sub = ?, google_picture_url = ?, email = ?, email_verified = true, last_login_at = now() WHERE id = ?',
      [profile.sub, profile.picture || null, profile.email, user.id]);
    const exchangeCode = createExchangeCode();
    await run('INSERT INTO auth_login_exchanges (code_hash, user_id, expires_at) VALUES (?, ?, now() + interval \'2 minutes\')',
      [hashExchangeCode(exchangeCode), user.id]);
    clearAdminOAuthCookies(res);
    return res.redirect(`/admin/index.html?google_admin_code=${encodeURIComponent(exchangeCode)}&next=${encodeURIComponent(nextPath)}`);
  } catch (error) { clearAdminOAuthCookies(res); return next(error); }
});

router.post('/auth/google/admin/exchange', async (req, res, next) => {
  try {
    await ensureAuthSchema();
    const code = String(req.body?.code || '');
    if (!/^[a-f0-9]{64}$/.test(code)) return fail(res, 422, 'Kode Google SSO admin belum valid');
    const hash = hashExchangeCode(code);
    const [exchange] = await query('SELECT id, user_id FROM auth_login_exchanges WHERE code_hash = ? AND consumed_at IS NULL AND expires_at > now() LIMIT 1', [hash]);
    if (!exchange) return fail(res, 401, 'Kode Google SSO admin kedaluwarsa atau sudah digunakan');
    const [user] = await query('SELECT u.id, u.name, u.email, COALESCE(ara.role, u.role) AS role FROM users u LEFT JOIN admin_role_assignments ara ON ara.user_id = u.id WHERE u.id = ? LIMIT 1', [exchange.user_id]);
    const effectiveRole = normalizeRole(user?.role);
    if (!user || !['admin', 'super_admin'].includes(effectiveRole)) return fail(res, 403, 'Role admin Google tidak lagi aktif');
    const consumed = await run('UPDATE auth_login_exchanges SET consumed_at = now() WHERE id = ? AND consumed_at IS NULL', [exchange.id]);
    if (!consumed.rowCount) return fail(res, 401, 'Kode Google SSO admin sudah digunakan');
    const token = await issueSession(user.id);
    await run('UPDATE users SET last_login_at = now() WHERE id = ?', [user.id]);
    res.setHeader('Set-Cookie', `sultra_admin_session=${encodeURIComponent(token)}; Max-Age=86400; Path=/; HttpOnly; Secure; SameSite=Lax`);
    return ok(res, { token, user: { id: user.id, name: user.name, email: user.email, role: effectiveRole }, next: safeAdminNext(req.body?.next) });
  } catch (error) { return next(error); }
});

// --- Google OAuth: user marketplace ---
router.get('/auth/google/start', (_req, res) => {
  if (!googleConfigured()) return failCode(res, 503, 'GOOGLE_OAUTH_NOT_CONFIGURED', 'Login Google belum dikonfigurasi.');
  const state = randomHex(24);
  res.setHeader('Set-Cookie', `google_oauth_state=${state}; Max-Age=600; Path=/api/auth/google; HttpOnly; Secure; SameSite=Lax`);
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: googleRedirectUri(SITE_URL),
    response_type: 'code', scope: 'openid email profile', state, access_type: 'online', prompt: 'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get('/auth/google/callback', async (req, res, next) => {
  try {
    await ensureAuthSchema();
    if (!googleConfigured()) return failCode(res, 503, 'GOOGLE_OAUTH_NOT_CONFIGURED', 'Login Google belum dikonfigurasi.');
    const cookies = parseCookies(req.headers.cookie);
    if (req.query.code && req.query.state && (verifyAdminState(req.query.state) || cookies.sultra_admin_oauth_state === req.query.state || cookies.google_admin_oauth_state === req.query.state)) {
      return res.redirect(`/api/auth/google/admin/callback?code=${encodeURIComponent(String(req.query.code))}&state=${encodeURIComponent(String(req.query.state))}`);
    }
    if (!req.query.code || !req.query.state || cookies.google_oauth_state !== req.query.state) {
      return failCode(res, 400, 'GOOGLE_OAUTH_STATE_INVALID', 'Sesi login Google tidak valid. Silakan ulangi.');
    }
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(req.query.code), client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: googleRedirectUri(SITE_URL), grant_type: 'authorization_code',
      }),
    });
    const tokenPayload = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok || !tokenPayload.access_token) {
      const providerError = String(tokenPayload.error || 'unknown').slice(0, 80);
      const providerDescription = String(tokenPayload.error_description || '').slice(0, 240);
      console.error('[google-token-exchange]', { status: tokenResponse.status, error: providerError, description: providerDescription, redirect_uri: googleRedirectUri(SITE_URL) });
      return failCode(res, 502, 'GOOGLE_TOKEN_EXCHANGE_FAILED', 'Login Google tidak dapat diselesaikan.', { provider_error: providerError, provider_error_description: providerDescription || null });
    }
    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { authorization: `Bearer ${tokenPayload.access_token}` } });
    const profile = await profileResponse.json().catch(() => ({}));
    if (!profileResponse.ok || !profile.sub || !profile.email || profile.email_verified === false) {
      return failCode(res, 401, 'GOOGLE_PROFILE_INVALID', 'Profil Google tidak dapat diverifikasi.');
    }
    let [user] = await query('SELECT * FROM users WHERE google_sub = ? OR lower(email) = lower(?) LIMIT 1', [profile.sub, normalizeEmail(profile.email)]);
    if (user) {
      await run('UPDATE users SET google_sub = ?, google_picture_url = ?, email = ?, email_verified = true, last_login_at = now() WHERE id = ?',
        [profile.sub, profile.picture || null, normalizeEmail(profile.email), user.id]);
    } else {
      const created = await run(
        'INSERT INTO users (name, phone, email, role, district, email_verified, google_sub, google_picture_url, last_login_at) VALUES (?, ?, ?, ?, ?, true, ?, ?, now())',
        [String(profile.name || profile.email.split('@')[0]).slice(0, 80), null, normalizeEmail(profile.email), 'buyer', 'Kendari', profile.sub, profile.picture || null]
      );
      user = { id: created.id };
    }
    const exchangeCode = randomHex(32);
    const exchangeHash = sha256Hex(exchangeCode);
    await run('INSERT INTO auth_login_exchanges (code_hash, user_id, expires_at) VALUES (?, ?, now() + interval \'2 minutes\')', [exchangeHash, user.id]);
    res.setHeader('Set-Cookie', 'google_oauth_state=; Max-Age=0; Path=/api/auth/google; HttpOnly; Secure; SameSite=Lax');
    res.redirect(`/account.html?google_code=${encodeURIComponent(exchangeCode)}`);
  } catch (error) { next(error); }
});

router.post('/auth/google/exchange', async (req, res, next) => {
  try {
    await ensureAuthSchema();
    const code = String(req.body?.code || '');
    if (!/^[a-f0-9]{64}$/.test(code)) return fail(res, 422, 'Kode login Google belum valid');
    const hash = sha256Hex(code);
    const [exchange] = await query('SELECT id, user_id FROM auth_login_exchanges WHERE code_hash = ? AND consumed_at IS NULL AND expires_at > now() LIMIT 1', [hash]);
    if (!exchange) return fail(res, 401, 'Kode login Google kedaluwarsa atau sudah digunakan');
    const consumed = await run('UPDATE auth_login_exchanges SET consumed_at = now() WHERE id = ? AND consumed_at IS NULL', [exchange.id]);
    if (!consumed.rowCount) return fail(res, 401, 'Kode login Google sudah digunakan');
    const token = await issueSession(exchange.user_id);
    await run('UPDATE users SET last_login_at = now() WHERE id = ?', [exchange.user_id]);
    setSessionResponse(res, token);
    const [user] = await query('SELECT id, name, phone, email, role, district, phone_verified, email_verified, verification_status FROM users WHERE id = ?', [exchange.user_id]);
    ok(res, { token, user });
  } catch (error) { next(error); }
});

// Registrasi user dasar + profil publik + pengajuan verifikasi seller.
router.post('/users', async (req, res, next) => {
  try {
    const { name, phone, role = 'seller', district = 'Kendari' } = req.body || {};
    if (!name || name.trim().length < 2 || !phone || !/^08\d{8,13}$/.test(phone)) {
      return fail(res, 422, 'name minimal 2 karakter dan phone harus nomor Indonesia yang valid');
    }
    if (!['buyer', 'seller'].includes(role) || !districts.includes(district)) return fail(res, 422, 'role atau district tidak valid');
    const result = await run('INSERT INTO users (name, phone, role, district) VALUES (?, ?, ?, ?)', [name.trim(), phone, role, district]);
    const [user] = await query('SELECT id, name, phone, role, district, is_verified, created_at FROM users WHERE id = ?', [result.id]);
    res.status(201);
    ok(res, user);
  } catch (error) {
    if (String(error.message).includes('UNIQUE constraint failed')) return fail(res, 409, 'Nomor telepon sudah terdaftar');
    next(error);
  }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const [user] = await query(
      'SELECT id, name, role, district, phone_verified, verification_status, verification_note, created_at FROM users WHERE id = ?',
      [Number(req.params.id)]
    );
    if (!user) return fail(res, 404, 'Pengguna tidak ditemukan');
    ok(res, user);
  } catch (error) { next(error); }
});

router.post('/seller-verifications', async (req, res, next) => {
  try {
    const { user_id, document_type, document_reference = null } = req.body || {};
    if (!positiveInt(user_id) || !['ktp', 'nib', 'other'].includes(document_type)) return fail(res, 422, 'user_id atau document_type belum valid');
    if (!req.user) return fail(res, 401, 'Autentikasi diperlukan');
    if (Number(req.user.id) !== Number(user_id) && !['admin', 'super_admin'].includes(normalizeRole(req.user.role))) {
      return fail(res, 403, 'Identitas user tidak sesuai session');
    }
    const result = await run('INSERT INTO seller_verifications (user_id, document_type, document_reference) VALUES (?, ?, ?)',
      [Number(user_id), document_type, document_reference]);
    await run("UPDATE users SET verification_status = 'pending' WHERE id = ?", [Number(user_id)]);
    res.status(201);
    ok(res, { id: result.id, status: 'pending', message: 'Pengajuan verifikasi seller diterima untuk ditinjau admin.' });
  } catch (error) { next(error); }
});

module.exports = router;

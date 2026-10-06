'use strict';

// SultraKita API — titik masuk aplikasi (hasil refactor monolit 184 KB).
//
// Struktur:
//   server.js          -> wiring tipis: middleware global, static, mount router, listen (file ini)
//   lib/               -> utilitas bersama (http, validasi, sesi, otp, storage, pembayaran, ...)
//   routes/            -> router per domain (auth, listings, admin, donations, commerce, ...)
//   api/               -> router mandiri yang sudah ada sebelumnya (admin v2, v2, promo, ...)
//   auth.js rbac.js ...-> fondasi yang tidak berubah
//
// Urutan middleware dipertahankan persis dari versi monolit agar perilaku identik:
// header keamanan -> CORS -> raw body Aulaa -> JSON -> authenticate -> static ->
// rate limit /api -> router api/... -> router domain -> 404 -> error handler.

const express = require('express');
const path = require('node:path');
const cors = require('cors');
const dotenv = require('dotenv');
const { run } = require('./database');
const { authenticate } = require('./auth');
const { notFoundHandler, errorHandler } = require('./lib/http');
const { rateLimit } = require('./lib/rate-limit');

// Router mandiri yang sudah ada (tidak diubah).
const adminApiV2 = require('./api/admin');
const { createWhatsAppWebhookRouter } = require('./api/whatsapp-webhook');
const { createAccountSettingsRouter } = require('./api/account-settings');
const { createSettingsRouter } = require('./api/settings');
const v2Api = require('./api/v2');
const { router: promoApi } = require('./api/promo');
const { router: referralApi } = require('./api/referral');
const taskAutomationApi = require('./api/task-automation');

// Router hasil ekstraksi monolit.
const seoRoutes = require('./routes/seo');
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const onboardingRoutes = require('./routes/onboarding');
const uploadRoutes = require('./routes/uploads');
const listingRoutes = require('./routes/listings');
const conversationRoutes = require('./routes/conversations');
const commerceRoutes = require('./routes/commerce');
const donationRoutes = require('./routes/donations');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  res.setHeader('Content-Security-Policy', "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self' https:");
  next();
});

const PORT = Number(process.env.PORT || 3000);

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'https://sukiapps.web.id')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin tidak diizinkan'));
  },
  credentials: true,
}));

// Webhook Aulaa butuh body mentah untuk verifikasi HMAC — dipasang sebelum express.json.
app.use('/api/donation/webhook/aulaa', express.raw({ type: 'application/json', limit: '256kb' }));
app.use(express.json({ limit: '3mb', verify: (req, _res, buffer) => { req.rawBody = Buffer.from(buffer); } }));
app.use(authenticate);

// Pembersihan retensi harian: analitik, sesi kedaluwarsa, tantangan OTP, kode exchange.
const retentionDays = Math.min(730, Math.max(7, Number(process.env.ANALYTICS_RETENTION_DAYS || 90)));
setInterval(() => {
  run("DELETE FROM analytics_events WHERE created_at < now() - (? * interval '1 day')", [retentionDays]).catch(() => {});
  run('DELETE FROM sessions WHERE expires_at <= ?', [Date.now()]).catch(() => {});
  run('DELETE FROM auth_otp_challenges WHERE expires_at < now()').catch(() => {});
  run('DELETE FROM auth_login_exchanges WHERE expires_at < now() OR consumed_at IS NOT NULL').catch(() => {});
}, 24 * 60 * 60 * 1000).unref();

// Halaman SEO server-rendered (root).
app.use('/', seoRoutes);

// Shell HTML statis: admin, settings, promo, referral, automation, MCP playground.
const sendAdminShell = (_req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  return res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
};
app.get(['/admin', '/admin/', '/admin/login', '/admin/dashboard'], sendAdminShell);
app.get(['/automation', '/automation.html'], (_req, res) => res.sendFile(path.join(__dirname, 'public', 'automation.html')));

const sendSettingsShell = (_req, res) => res.sendFile(path.join(__dirname, 'public', 'settings.html'));
const sendPromoShell = (_req, res) => res.sendFile(path.join(__dirname, 'public', 'promo', 'index.html'));
const sendReferralShell = (_req, res) => res.sendFile(path.join(__dirname, 'public', 'referral', 'index.html'));

app.get('/dev/mcp-playground.html', (req, res) => {
  const expected = String(process.env.MCP_PLAYGROUND_BASIC_AUTH || '');
  if (!expected) return res.status(404).send('Not found');
  if (req.get('authorization') !== `Basic ${expected}`) {
    res.setHeader('WWW-Authenticate', 'Basic realm="SultraKita MCP Playground"');
    return res.status(401).send('Authentication required');
  }
  return res.sendFile(path.join(__dirname, 'public', 'dev', 'mcp-playground.html'));
});
app.get(['/settings.html', '/settings', '/settings/account', '/settings/preferences', '/settings/notifications', '/settings/privacy', '/settings/privacy/checkup', '/settings/security', '/settings/devices', '/settings/time', '/settings/promotions', '/settings/link-history', '/settings/activity', '/settings/orders', '/settings/payments', '/settings/data', '/settings/data/export'], sendSettingsShell);
app.get(['/promo', '/promo/'], sendPromoShell);
app.get(['/ajak-teman', '/ajak-teman/'], sendReferralShell);

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.includes(`${path.sep}public${path.sep}admin${path.sep}`) && filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      return;
    }
    if (filePath.endsWith('sw.js') || filePath.endsWith('index.html')) return;
    if (/\.(?:js|css|woff2?|png|jpe?g|webp|avif|svg|ico|webmanifest)$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));

// Rate limit global untuk seluruh /api.
app.use('/api', rateLimit());

// Router mandiri (urutan dipertahankan dari monolit).
const { query } = require('./database');
app.use('/api/admin/v2', adminApiV2);
app.use('/api/webhooks', createWhatsAppWebhookRouter({ query, run }));
app.use('/api/account', createAccountSettingsRouter());
app.use('/api/settings', createSettingsRouter());
app.use('/api/v2', v2Api);
app.use('/api/automation', taskAutomationApi);
app.use('/api/v2/promo', promoApi);
app.use('/api/referral', referralApi);

// Router domain hasil ekstraksi (urutan dipertahankan dari monolit).
app.use('/api', publicRoutes);
app.use('/api', authRoutes);
app.use('/api/seller/onboarding', onboardingRoutes);
app.use('/api', uploadRoutes);
app.use('/api', listingRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api', commerceRoutes);
app.use('/api', donationRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) app.listen(PORT, () => console.log(`SultraKita API berjalan pada port ${PORT}`));

module.exports = app;

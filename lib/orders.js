'use strict';

// Helper marketplace: order, notifikasi, estimasi logistik — diekstrak dari server.js tanpa perubahan perilaku.
const crypto = require('node:crypto');
const { run } = require('../database');
const { positiveInt, safeText } = require('./validation');

const orderNumber = () =>
  `SK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

const createNotification = async ({ userId, type, title, body, link = null }) => {
  if (!positiveInt(userId)) return;
  await run(
    'INSERT INTO notifications (user_id, type, title, body, link) VALUES (?, ?, ?, ?, ?)',
    [userId, safeText(type, 60), safeText(title, 160), safeText(body, 500), link ? safeText(link, 300) : null]
  );
};

const shippingProviders = [
  { provider: 'jne', service_code: 'REG', service_name: 'JNE Regular', base: 18000, etd: '2-4 hari' },
  { provider: 'jnt', service_code: 'EZ', service_name: 'J&T EZ', base: 16000, etd: '2-4 hari' },
  { provider: 'gosend', service_code: 'INSTANT', service_name: 'GoSend Instant', base: 12000, etd: 'Hari yang sama' },
];

const googleRedirectUri = siteUrl => process.env.GOOGLE_REDIRECT_URI || `${siteUrl}/api/auth/google/callback`;

const googleConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

module.exports = { orderNumber, createNotification, shippingProviders, googleRedirectUri, googleConfigured };

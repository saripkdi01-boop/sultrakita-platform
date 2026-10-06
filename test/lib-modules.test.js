'use strict';

// Test unit modul lib/ hasil refactor server.js — tanpa DB, tanpa kredensial, tanpa jaringan.
// Memverifikasi kontrak tiap modul: validasi, kripto, http, whatsapp, storage,
// images, external-feeds, link-import, payments (pure), telegram, onboarding, orders.

const test = require('node:test');
const assert = require('node:assert/strict');

const validation = require('../lib/validation');
const cryptoLib = require('../lib/crypto');
const http = require('../lib/http');
const whatsapp = require('../lib/whatsapp');
const storage = require('../lib/storage');
const images = require('../lib/images');
const feeds = require('../lib/external-feeds');
const linkImport = require('../lib/link-import');
const payments = require('../lib/payments');
const telegram = require('../lib/telegram');
const onboarding = require('../lib/onboarding');
const orders = require('../lib/orders');
const schema = require('../lib/schema');

test('validation: positiveInt, safeText, email, JSON, cookies, XML', () => {
  assert.equal(validation.positiveInt(5), true);
  assert.equal(validation.positiveInt('7'), true);
  assert.equal(validation.positiveInt(0), false);
  assert.equal(validation.positiveInt(-3), false);
  assert.equal(validation.positiveInt('x'), false);
  assert.equal(validation.positiveInt(2.5), false);
  assert.equal(validation.safeText('  halo  ', 10), 'halo');
  assert.equal(validation.safeText('abcdef', 3), 'abc');
  assert.equal(validation.safeText(null, 5), '');
  assert.equal(validation.boundedText('abcdef', 3), 'abc');
  assert.equal(validation.normalizeEmail('User@Example.COM '), 'user@example.com');
  assert.equal(validation.normalizeEmail('bukan-email'), null);
  assert.equal(validation.normalizeEmail('a@b.c'), null);
  assert.equal(validation.maskEmail('pengguna@contoh.id'), 'pe***@contoh.id');
  assert.equal(validation.maskEmail('rusak'), 'email tersamarkan');
  assert.deepEqual(validation.parseJsonObject('{"a":1}'), { a: 1 });
  assert.deepEqual(validation.parseJsonObject('rusak'), {});
  assert.deepEqual(validation.parseJsonObject('[1]'), {});
  assert.deepEqual(validation.parseJsonArray('[1,2]'), [1, 2]);
  assert.deepEqual(validation.parseJsonArray('{"a":1}'), []);
  assert.deepEqual(validation.parseCookies('a=1; b=dua'), { a: '1', b: 'dua' });
  assert.equal(validation.escapeXml('<a href="x">&\'y\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&apos;y&apos;&lt;/a&gt;');
});

test('crypto: safeEqual timing-safe, sha256, randomHex', () => {
  assert.equal(cryptoLib.safeEqual('rahasia', 'rahasia'), true);
  assert.equal(cryptoLib.safeEqual('rahasia', 'salah'), false);
  assert.equal(cryptoLib.safeEqual('pendek', 'jauh-lebih-panjang'), false);
  assert.equal(cryptoLib.sha256Hex('abc').length, 64);
  assert.equal(cryptoLib.sha256Hex('abc'), cryptoLib.sha256Hex('abc'));
  assert.notEqual(cryptoLib.sha256Hex('abc'), cryptoLib.sha256Hex('abd'));
  assert.match(cryptoLib.randomHex(24), /^[a-f0-9]{48}$/);
  assert.notEqual(cryptoLib.randomHex(16), cryptoLib.randomHex(16));
});

test('http: kontrak respons ok/fail/failCode + handler 404/500', () => {
  const capture = () => {
    const res = { statusCode: 200, body: null };
    res.status = code => { res.statusCode = code; return res; };
    res.json = payload => { res.body = payload; return res; };
    return res;
  };
  let res = capture();
  http.ok(res, { a: 1 }, { page: 1 });
  assert.deepEqual(res.body, { success: true, data: { a: 1 }, meta: { page: 1 } });
  res = capture();
  http.fail(res, 422, 'tidak valid', ['e1']);
  assert.deepEqual(res.body, { success: false, error: 'tidak valid', details: ['e1'] });
  assert.equal(res.statusCode, 422);
  res = capture();
  http.failCode(res, 429, 'OTP_COOLDOWN', 'tunggu');
  assert.deepEqual(res.body, { success: false, code: 'OTP_COOLDOWN', error: 'tunggu' });
  res = capture();
  http.notFoundHandler({}, res);
  assert.equal(res.statusCode, 404);
  assert.equal(res.body.success, false);
  // Error handler: status kustom diteruskan, 500 disamarkan.
  res = capture();
  const custom = new Error('kustom');
  custom.statusCode = 422;
  http.errorHandler(custom, {}, res, () => {});
  assert.equal(res.statusCode, 422);
  assert.equal(res.body.error, 'kustom');
  res = capture();
  http.errorHandler(new Error('rahasia-db'), {}, res, () => {});
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.error, 'Terjadi kesalahan pada server');
});

test('whatsapp: normalisasi nomor Indonesia', () => {
  assert.equal(whatsapp.normalizeWhatsAppPhone('081234567890'), '6281234567890');
  assert.equal(whatsapp.normalizeWhatsAppPhone('81234567890'), '6281234567890');
  assert.equal(whatsapp.normalizeWhatsAppPhone('6281234567890'), '6281234567890');
  assert.equal(whatsapp.normalizeWhatsAppPhone('+62 812-3456-7890'), '6281234567890');
  assert.equal(whatsapp.normalizeWhatsAppPhone('123'), null);
  assert.equal(whatsapp.normalizeWhatsAppPhone(''), null);
});

test('whatsapp: kirim tanpa konfigurasi mengembalikan not_configured (tanpa throw)', async () => {
  const text = await whatsapp.sendWhatsAppText('081234567890', 'halo');
  assert.equal(text.sent, false);
  const tpl = await whatsapp.sendWhatsAppTemplate('081234567890', { a: 'b' });
  assert.equal(tpl.sent, false);
  // notifySeller tanpa phone: no-op.
  await whatsapp.notifySellerWhatsApp({ phone: null });
});

test('storage: status konfigurasi jujur saat env kosong', () => {
  assert.equal(typeof storage.nativeR2Configured(), 'boolean');
  assert.equal(typeof storage.objectStorageConfigured(), 'boolean');
  assert.equal(typeof storage.presignStorageConfigured(), 'boolean');
  const key = storage.objectKey({ originalname: 'Foto.JPG' });
  assert.match(key, /^\d+-[a-f0-9]{16}\.jpg$/);
  assert.equal(storage.publicObjectUrl('abc.jpg'), '/abc.jpg');
});

test('images: validasi magic bytes JPEG/PNG/WebP', async () => {
  const jpeg = { mimetype: 'image/jpeg', buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0]) };
  const png = { mimetype: 'image/png', buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) };
  const webp = { mimetype: 'image/webp', buffer: Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP')]) };
  const fake = { mimetype: 'image/jpeg', buffer: Buffer.from('bukan-gambar-sama-sekali') };
  assert.equal(await images.hasValidImageSignature(jpeg), true);
  assert.equal(await images.hasValidImageSignature(png), true);
  assert.equal(await images.hasValidImageSignature(webp), true);
  assert.equal(await images.hasValidImageSignature(fake), false);
  // GIF tidak divalidasi (perilaku asli: endpoint avatar melewati GIF).
  assert.equal(await images.hasValidImageSignature({ mimetype: 'image/gif', buffer: Buffer.alloc(10) }), false);
});

test('images: parse bounding box Gemini', () => {
  const payload = { candidates: [{ content: { parts: [{ text: 'hasil {"x":100,"y":100,"width":400,"height":400} selesai' }] } }] };
  assert.deepEqual(images.parseGeminiBox(payload), { x: 100, y: 100, width: 400, height: 400 });
  assert.equal(images.parseGeminiBox({}), null);
  assert.equal(images.parseGeminiBox({ candidates: [{ content: { parts: [{ text: 'tanpa json' }] } }] }), null);
  // Kotak terlalu kecil ditolak.
  assert.equal(images.parseGeminiBox({ candidates: [{ content: { parts: [{ text: '{"x":1,"y":1,"width":5,"height":5}' }] } }] }), null);
});

test('external-feeds: konfigurasi, kategori, region', () => {
  assert.deepEqual(feeds.parseFeedConfig('bukan-json'), []);
  assert.deepEqual(feeds.parseFeedConfig(JSON.stringify([{ id: 'a', url: 'http://insecure/x' }])), []);
  const ok = feeds.parseFeedConfig(JSON.stringify([{ id: 'a', url: 'https://contoh.id/feed' }]));
  assert.equal(ok.length, 1);
  assert.equal(feeds.inferLinkCategory('lowongan kerja admin', ''), 'lowongan');
  assert.equal(feeds.inferLinkCategory('dijual avanza bekas', ''), 'kendaraan');
  assert.equal(feeds.inferLinkCategory('ikan cupang hias', ''), 'hobi');
  assert.equal(feeds.inferLinkCategory('barang aneh xyz', ''), 'lainnya');
  assert.equal(feeds.inferLinkCategory('apapun', 'kuliner'), 'kuliner');
  assert.equal(feeds.regionMatches({ city: 'Kendari' }, {}, false), true);
  assert.equal(feeds.regionMatches({ city: 'Jakarta' }, {}, false), false);
  assert.equal(feeds.regionMatches({}, {}, true), true);
  assert.equal(feeds.regionMatches({}, {}, false), false);
  // Normalisasi menolak item tanpa judul/URL HTTPS.
  assert.equal(feeds.normalizeExternalItem({ id: 'f' }, { title: 'x' }), null);
  assert.equal(feeds.normalizeExternalItem({ id: 'f' }, { title: 'x', url: 'http://a/b' }), null);
  const item = feeds.normalizeExternalItem({ id: 'f', label: 'Partner' }, { title: 'Kopi', url: 'https://a.id/kopi', price: '25000' });
  assert.equal(item.title, 'Kopi');
  assert.equal(item.province, 'Sulawesi Tenggara');
  assert.equal(item.is_demo, false);
});

test('link-import: allowlist host + SSRF guard', () => {
  assert.equal(linkImport.hostnameAllowedForJob('www.tokopedia.com'), true);
  assert.equal(linkImport.hostnameAllowedForJob('tokopedia.com'), true);
  assert.equal(linkImport.hostnameAllowedForJob('evil-tokopedia.com'), false);
  assert.equal(linkImport.hostnameAllowedForJob('localhost'), false);
  assert.equal(linkImport.hostnameAllowedForJob('127.0.0.1'), false);
  assert.equal(linkImport.hostnameAllowedForJob('192.168.1.1'), false);
  assert.equal(linkImport.hostnameAllowedForJob('10.0.0.5'), false);
  assert.equal(linkImport.hostnameAllowedForJob('172.20.0.1'), false);
  assert.equal(linkImport.hostnameAllowedForJob('internal.svc.internal'), false);
  assert.equal(linkImport.hostnameAllowedForJob('contoh-acak.id'), false);
  assert.equal(linkImport.decodeHtml('A &amp; B &#65; &lt;x&gt;'), 'A & B A <x>');
  assert.equal(linkImport.extractMeta('<meta property="og:title" content="Judul"/>', 'og:title'), 'Judul');
  assert.equal(linkImport.extractTagText('<title>Halo <b>Dunia</b></title>', 'title'), 'Halo Dunia');
});

test('link-import: fetch metadata menolak URL tidak valid tanpa jaringan', async () => {
  await assert.rejects(() => linkImport.fetchJobUrlMetadata('bukan-url'), /URL lowongan tidak valid/);
  await assert.rejects(() => linkImport.fetchJobUrlMetadata('http://tokopedia.com/x'), /harus HTTPS/);
  await assert.rejects(() => linkImport.fetchJobUrlMetadata('https://evil.example/x'), /portal lowongan yang diizinkan/);
  await assert.rejects(() => linkImport.fetchJobUrlMetadata('https://localhost/x'), /portal lowongan yang diizinkan/);
});

test('payments: utilitas murni + guard signature', () => {
  assert.match(payments.paymentOrderId(), /^SK-\d+-[A-F0-9]{10}$/);
  assert.equal(payments.configuredPaymentProvider(), null);
  assert.equal(payments.isSuccessfulPayment('settlement', 'accept'), true);
  assert.equal(payments.isSuccessfulPayment('capture', null), true);
  assert.equal(payments.isSuccessfulPayment('pending', null), false);
  assert.equal(payments.isSuccessfulPayment('deny', null), false);
  assert.equal(payments.verifyMidtransSignature({ order_id: 'a', status_code: '200', gross_amount: '100', signature_key: 'x' }), false);
  assert.equal(payments.verifyAulaaSignature(Buffer.from('x'), 'sig'), false);
  assert.equal(payments.verifyAulaaSignature(Buffer.from('x'), null), false);
  return assert.rejects(() => payments.createPaymentUrl({ provider: 'midtrans', transactionId: 't', amount: 1, name: 'n', paymentMethod: 'tunai' }), /belum didukung/);
});

test('telegram: guard admin + format status', () => {
  assert.equal(typeof telegram.telegramConfigured(), 'boolean');
  assert.equal(telegram.telegramAdminAllowed(null), false);
  assert.equal(telegram.telegramAdminAllowed({}), false);
  assert.equal(telegram.telegramText({ message: { text: '  /help ' } }), '/help');
  assert.equal(telegram.telegramText({}), '');
  assert.equal(telegram.formatDonationStatus(null), 'Transaksi tidak ditemukan.');
  const formatted = telegram.formatDonationStatus({ transaction_id: 'SK-1', payment_status: 'success', amount: 50000, payment_method: 'qris', created_at: '2026-01-01' });
  assert.match(formatted, /SK-1/);
  assert.match(formatted, /success/);
});

test('onboarding: sanitasi data + saran lokal tanpa AI', async () => {
  const data = onboarding.onboardingData({ store_name: '  Toko ', price: 5000, photo_names: ['a.jpg', 'b.jpg'], extra: 'x'.repeat(500) }, onboarding.onboardingFields.store);
  assert.equal(data.store_name, 'Toko');
  assert.deepEqual(Object.keys(data).sort(), ['district', 'store_category', 'store_description', 'store_name']);
  const suggestion = await onboarding.localListingSuggestion({ category_id: 999, photo_names: ['kopi-robusta.jpg'], price: 25000 });
  assert.match(suggestion.title, /kopi robusta/i);
  assert.equal(suggestion.price, 25000);
  assert.equal(suggestion.source, 'local_fallback');
  // aiListingSuggestion tanpa OPENAI_API_KEY mengembalikan fallback lokal.
  // Hermetik: kunci API dihapus sementara agar tidak ada panggilan jaringan.
  const savedKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const ai = await onboarding.aiListingSuggestion({ category_id: 0, photo_names: [], price: 0 });
    assert.equal(ai.source, 'local_fallback');
  } finally {
    if (savedKey !== undefined) process.env.OPENAI_API_KEY = savedKey;
  }
});

test('orders: nomor order, shipping, google config', () => {
  assert.match(orders.orderNumber(), /^SK-\d{8}-[A-F0-9]{8}$/);
  assert.equal(orders.shippingProviders.length, 3);
  assert.equal(orders.shippingProviders[0].provider, 'jne');
  assert.equal(orders.googleConfigured(), false);
  assert.equal(orders.googleRedirectUri('https://x.id'), 'https://x.id/api/auth/google/callback');
});

test('schema: 32 statement DDL idempoten', () => {
  const statements = schema.AUTH_SCHEMA_STATEMENTS.split(';').map(s => s.trim()).filter(Boolean);
  assert.equal(statements.length, 32);
  assert.match(schema.AUTH_SCHEMA_STATEMENTS, /CREATE TABLE IF NOT EXISTS auth_otp_challenges/);
  assert.match(schema.AUTH_SCHEMA_STATEMENTS, /CREATE TABLE IF NOT EXISTS seller_onboarding_progress/);
  assert.match(schema.AUTH_SCHEMA_STATEMENTS, /CREATE TABLE IF NOT EXISTS external_listings/);
  assert.match(schema.AUTH_SCHEMA_STATEMENTS, /CREATE TABLE IF NOT EXISTS telegram_admin_audit/);
});

test('otp: hash destinasi + cooldown', () => {
  const { otpDestinationHash, otpDestinationCooldownSeconds } = require('../lib/otp');
  assert.equal(otpDestinationHash('email', 'a@b.id').length, 64);
  assert.notEqual(otpDestinationHash('email', 'a@b.id'), otpDestinationHash('whatsapp', 'a@b.id'));
  const cooldown = otpDestinationCooldownSeconds();
  assert.ok(cooldown >= 30 && cooldown <= 300);
});

test('sessions: guard admin menolak tanpa allowlist', () => {
  const { adminOnly, currentUser } = require('../lib/sessions');
  assert.equal(currentUser({ user: { id: '42' } }), 42);
  assert.equal(currentUser({}), 0);
  const res = { statusCode: 200, body: null };
  res.status = code => { res.statusCode = code; return res; };
  res.json = payload => { res.body = payload; return res; };
  let nextCalled = false;
  adminOnly({ user: { email: 'bukan-admin@contoh.id' } }, res, () => { nextCalled = true; });
  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
});

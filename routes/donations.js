'use strict';

// Router donasi: kampanye, transaksi, webhook provider (Midtrans/Xendit/Aulaa),
// dan bot admin Telegram. Diekstrak dari server.js.
// PERBAIKAN BUG LATEN: webhook Midtrans/Xendit asli memanggil database.run/
// database.exec/persist yang tidak ada di database.js Postgres saat ini
// (getDb mengembalikan pg Pool). Ditulis ulang memakai withTransaction
// dengan semantik identik: idempoten, hanya increment kampanye sekali.
const express = require('express');
const { query, run, withTransaction } = require('../database');
const { normalizeRole: _normalizeRole } = require('../rbac');
const { ok, fail } = require('../lib/http');
const { positiveInt, safeText } = require('../lib/validation');
const { safeEqual } = require('../lib/crypto');
const {
  paymentOrderId, configuredPaymentProvider, createPaymentUrl,
  verifyMidtransSignature, verifyAulaaSignature, isSuccessfulPayment, recordWebhook,
} = require('../lib/payments');
const { ensureAuthSchema } = require('../lib/schema');
const { telegramAdminAllowed, telegramText, telegramSend, formatDonationStatus } = require('../lib/telegram');

const router = express.Router();

router.get('/donation/campaigns', async (_req, res, next) => {
  try {
    ok(res, await query("SELECT id, title, description, target_amount, current_amount, status, created_at FROM donation_campaigns WHERE status = 'active' ORDER BY id LIMIT 20"));
  } catch (error) { next(error); }
});

router.get('/donation/stats', async (req, res, next) => {
  try {
    const campaignId = positiveInt(req.query.campaign_id) ? Number(req.query.campaign_id) : 1;
    const [campaign] = await query('SELECT id, title, description, target_amount, current_amount, status FROM donation_campaigns WHERE id = ?', [campaignId]);
    if (!campaign) return fail(res, 404, 'Kampanye donasi tidak ditemukan');
    const [supporters] = await query("SELECT COUNT(*) AS total FROM donations WHERE campaign_id = ? AND payment_status = 'success'", [campaign.id]);
    ok(res, {
      campaign: {
        ...campaign,
        target_amount: Number(campaign.target_amount),
        current_amount: Number(campaign.current_amount),
        progress_percent: Math.min(100, Number(campaign.current_amount) / Number(campaign.target_amount) * 100),
      },
      supporters: Number(supporters.total),
    });
  } catch (error) { next(error); }
});

router.post('/donations', async (req, res, next) => {
  try {
    const { campaign_id = 1, name = 'Hamba Allah', email = null, amount, message = null, payment_method = 'qris' } = req.body || {};
    const numericAmount = Number(amount);
    if (!positiveInt(campaign_id) || !Number.isSafeInteger(numericAmount) || numericAmount < 10000 || numericAmount > 100000000) {
      return fail(res, 422, 'Kampanye atau jumlah donasi belum valid. Minimal Rp10.000.');
    }
    if (safeText(name, 100).length < 2 || (email && !/^\S+@\S+\.\S+$/.test(String(email))) || safeText(message, 500).length > 500) {
      return fail(res, 422, 'Data donatur belum valid');
    }
    const [campaign] = await query("SELECT id, status FROM donation_campaigns WHERE id = ? AND status = 'active'", [Number(campaign_id)]);
    if (!campaign) return fail(res, 404, 'Kampanye donasi tidak aktif');
    const transactionId = paymentOrderId();
    const selectedMethod = ['qris', 'virtual_account'].includes(payment_method) ? payment_method : 'qris';
    const result = await run(
      'INSERT INTO donations (campaign_id, name, email, amount, message, transaction_id, payment_method, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, \'pending\')',
      [campaign.id, safeText(name, 100) || 'Hamba Allah', email ? safeText(email, 160) : null, numericAmount, safeText(message, 500) || null, transactionId, selectedMethod]
    );
    const provider = configuredPaymentProvider();
    let payment = { provider: 'not_configured', payment_url: null, provider_reference: null };
    if (provider) {
      try {
        payment = await createPaymentUrl({
          provider, transactionId, amount: numericAmount,
          name: safeText(name, 100) || 'Hamba Allah', email: email ? safeText(email, 160) : null, paymentMethod: selectedMethod,
        });
        await run('UPDATE donations SET payment_provider = ?, provider_reference = ? WHERE id = ?', [payment.provider, payment.provider_reference, result.id]);
      } catch (error) {
        await run("UPDATE donations SET payment_status = 'failed' WHERE id = ?", [result.id]);
        return fail(res, 502, 'Payment provider tidak dapat membuat halaman pembayaran', { transaction_id: transactionId });
      }
    }
    const data = {
      donation_id: result.id, transaction_id: transactionId, payment_status: 'pending',
      payment_url: payment.payment_url, provider: payment.provider,
      message: payment.payment_url ? 'Halaman pembayaran berhasil dibuat.' : 'Donasi tercatat dan menunggu pembayaran. Provider pembayaran belum dikonfigurasi.',
    };
    res.status(201);
    ok(res, data);
  } catch (error) { next(error); }
});

router.get('/donations/:transaction_id', async (req, res, next) => {
  try {
    const transactionId = safeText(req.params.transaction_id, 100);
    if (!transactionId) return fail(res, 422, 'ID transaksi belum valid');
    const [donation] = await query('SELECT transaction_id, amount, payment_method, payment_status, created_at FROM donations WHERE transaction_id = ?', [transactionId]);
    if (!donation) return fail(res, 404, 'Transaksi donasi tidak ditemukan');
    ok(res, { ...donation, amount: Number(donation.amount) });
  } catch (error) { next(error); }
});

router.post('/donation/webhook', async (req, res, next) => {
  try {
    const payload = req.body || {};
    const midtransValid = verifyMidtransSignature(payload);
    const callbackToken = req.get('x-callback-token');
    const xenditValid = Boolean(process.env.XENDIT_CALLBACK_TOKEN && callbackToken && safeEqual(process.env.XENDIT_CALLBACK_TOKEN, callbackToken));
    const webhookProvider = midtransValid ? 'midtrans' : 'xendit';
    if (!midtransValid && !xenditValid) {
      await recordWebhook({ provider: 'unknown', transactionId: payload.order_id || payload.external_id || payload.id, eventStatus: payload.transaction_status || payload.status, httpStatus: 401, signatureValid: false, payload });
      return fail(res, 401, 'Signature webhook tidak valid');
    }
    const transactionId = safeText(payload.order_id || payload.external_id || payload.id, 100);
    const status = midtransValid
      ? (isSuccessfulPayment(payload.transaction_status, payload.fraud_status) ? 'success' : ['expire'].includes(payload.transaction_status) ? 'expired' : ['deny', 'cancel'].includes(payload.transaction_status) ? 'failed' : 'pending')
      : (['PAID', 'SETTLED'].includes(String(payload.status).toUpperCase()) ? 'success' : ['EXPIRED'].includes(String(payload.status).toUpperCase()) ? 'expired' : 'pending');
    if (!transactionId) {
      await recordWebhook({ provider: webhookProvider, eventStatus: payload.transaction_status || payload.status, httpStatus: 422, signatureValid: true, payload });
      return fail(res, 422, 'ID transaksi tidak ditemukan');
    }
    const outcome = await withTransaction(async database => {
      const [donation] = await database.query('SELECT id, campaign_id, amount, payment_status FROM donations WHERE transaction_id = ? FOR UPDATE', [transactionId]);
      if (!donation) return { missing: true };
      const previousStatus = donation.payment_status;
      if (status === 'success' && previousStatus !== 'success') {
        await database.run("UPDATE donations SET payment_status = 'success', status = 'confirmed' WHERE id = ?", [donation.id]);
        await database.run('UPDATE donation_campaigns SET current_amount = current_amount + ? WHERE id = ?', [donation.amount, donation.campaign_id]);
      } else if (previousStatus !== 'success') {
        await database.run('UPDATE donations SET payment_status = ? WHERE id = ?', [status, donation.id]);
      }
      return { previousStatus };
    });
    if (outcome.missing) {
      await recordWebhook({ provider: webhookProvider, transactionId, eventStatus: status, httpStatus: 404, signatureValid: true, payload });
      return fail(res, 404, 'Transaksi donasi tidak ditemukan');
    }
    await recordWebhook({ provider: webhookProvider, transactionId, eventStatus: status, httpStatus: 200, signatureValid: true, payload });
    ok(res, { received: true, transaction_id: transactionId, payment_status: status, idempotent: outcome.previousStatus === status });
  } catch (error) { next(error); }
});

router.post('/donation/webhook/aulaa', async (req, res, next) => {
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from('');
  const signature = req.get('x-webhook-signature');
  if (!verifyAulaaSignature(rawBody, signature)) {
    await recordWebhook({ provider: 'aulaa', httpStatus: 401, signatureValid: false, payload: { error: 'invalid_signature' } });
    return res.status(401).json({ error: 'Invalid signature' });
  }
  let payload;
  try { payload = JSON.parse(rawBody.toString('utf8')); }
  catch {
    await recordWebhook({ provider: 'aulaa', httpStatus: 400, signatureValid: true, payload: { error: 'invalid_json' } });
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  const transactionId = safeText(payload.order_id, 100);
  const amount = Number(payload.amount);
  const rawStatus = String(payload.status || '').toLowerCase();
  const status = rawStatus === 'paid' ? 'success' : rawStatus === 'expired' ? 'expired' : rawStatus === 'cancelled' ? 'failed' : rawStatus === 'failed' ? 'failed' : 'pending';
  if (!transactionId || !Number.isSafeInteger(amount)) {
    await recordWebhook({ provider: 'aulaa', transactionId, eventStatus: rawStatus, httpStatus: 422, signatureValid: true, payload });
    return res.status(422).json({ error: 'Invalid payment payload' });
  }
  try {
    const result = await withTransaction(async database => {
      const [donation] = await database.query('SELECT id, campaign_id, amount, payment_status FROM donations WHERE transaction_id = ? FOR UPDATE', [transactionId]);
      if (!donation) return { missing: true };
      if (Number(donation.amount) !== amount) return { amountMismatch: true, donation };
      const previousStatus = donation.payment_status;
      if (status === 'success' && previousStatus !== 'success') {
        await database.run("UPDATE donations SET payment_status = 'success', status = 'confirmed', provider_reference = COALESCE(provider_reference, ?) WHERE id = ?", [payload.id || transactionId, donation.id]);
        await database.run('UPDATE donation_campaigns SET current_amount = current_amount + ? WHERE id = ?', [amount, donation.campaign_id]);
      } else if (previousStatus !== 'success' && status !== 'pending') {
        await database.run('UPDATE donations SET payment_status = ? WHERE id = ?', [status, donation.id]);
      }
      return { transactionId, status, previousStatus, idempotent: previousStatus === status };
    });
    if (result.missing) {
      await recordWebhook({ provider: 'aulaa', transactionId, eventStatus: status, httpStatus: 404, signatureValid: true, payload });
      return res.status(404).json({ error: 'Donation not found' });
    }
    if (result.amountMismatch) {
      await recordWebhook({ provider: 'aulaa', transactionId, eventStatus: status, httpStatus: 422, signatureValid: true, payload, errorMessage: 'amount mismatch' });
      return res.status(422).json({ error: 'Amount mismatch' });
    }
    await recordWebhook({ provider: 'aulaa', transactionId, eventStatus: status, httpStatus: 200, signatureValid: true, payload });
    if (status === 'success') {
      telegramSend(process.env.TELEGRAM_ADMIN_CHAT_ID, `Donasi lunas via Aulaa\n${transactionId}\nNominal: Rp${amount.toLocaleString('id-ID')}`)
        .catch(error => console.error('[telegram-notify]', error.message));
    }
    return res.status(200).json({ received: true, transaction_id: transactionId, payment_status: status, idempotent: result.idempotent });
  } catch (error) { next(error); }
});

router.post('/telegram/webhook', async (req, res, next) => {
  if (!process.env.TELEGRAM_WEBHOOK_SECRET || !safeEqual(process.env.TELEGRAM_WEBHOOK_SECRET, req.get('x-telegram-bot-api-secret-token'))) {
    return res.status(401).json({ error: 'Invalid Telegram webhook secret' });
  }
  if (!telegramAdminAllowed(req.body)) return res.status(403).json({ error: 'Telegram admin tidak diizinkan' });
  const chatId = String(req.body.message?.chat?.id || req.body.channel_post?.chat?.id);
  const userId = String(req.body.message?.from?.id || req.body.channel_post?.from?.id || '');
  const text = telegramText(req.body);
  try {
    await ensureAuthSchema();
    const updateId = Number(req.body?.update_id);
    if (Number.isSafeInteger(updateId)) {
      const audit = await run(
        'INSERT INTO telegram_admin_audit (update_id, chat_id, user_id, command, outcome) VALUES (?, ?, ?, ?, ?) ON CONFLICT (update_id) DO NOTHING RETURNING id',
        [updateId, chatId, userId || null, text.slice(0, 120) || null, 'received']
      );
      if (!audit.rowCount) return ok(res, { handled: true, duplicate: true });
    }
    if (text === '/start' || text === '/help') {
      return ok(res, await telegramSend(chatId,
        'SultraKita Admin Bot\n/overview — ringkasan platform\n/status TX — cek transaksi\n/donasi — ringkasan donasi 7 hari\n/verifikasi — antrean seller\n/setujui ID — setujui seller\n/laporan — laporan terbuka\n/selesaikan-laporan ID — tutup laporan\n/webhook — webhook terbaru\n/help — bantuan'));
    }
    if (text.startsWith('/status ')) {
      const transactionId = safeText(text.slice(8), 100);
      const [donation] = await query('SELECT transaction_id, amount, payment_method, payment_status, created_at FROM donations WHERE transaction_id = ?', [transactionId]);
      await telegramSend(chatId, formatDonationStatus(donation));
      return ok(res, { handled: true });
    }
    if (text === '/overview') {
      const [summary] = await query(
        "SELECT (SELECT COUNT(*) FROM users)::int AS users, (SELECT COUNT(*) FROM listings WHERE status = 'active')::int AS listings, (SELECT COUNT(*) FROM seller_verifications WHERE status = 'pending')::int AS pending_sellers, (SELECT COUNT(*) FROM reports WHERE status IN ('open','reviewing'))::int AS open_reports"
      );
      await telegramSend(chatId, `Overview SultraKita\nPengguna: ${summary.users}\nListing aktif: ${summary.listings}\nSeller menunggu: ${summary.pending_sellers}\nLaporan terbuka: ${summary.open_reports}`);
      return ok(res, { handled: true });
    }
    if (text === '/donasi') {
      const [summary] = await query(
        "SELECT COUNT(*)::int AS attempts, COUNT(*) FILTER (WHERE payment_status = 'success')::int AS successful, COALESCE(SUM(amount) FILTER (WHERE payment_status = 'success'),0)::bigint AS total FROM donations WHERE created_at >= now() - interval '7 days'"
      );
      await telegramSend(chatId, `Ringkasan 7 hari\nPercobaan: ${summary.attempts}\nBerhasil: ${summary.successful}\nTotal: Rp${Number(summary.total).toLocaleString('id-ID')}`);
      return ok(res, { handled: true });
    }
    if (text === '/verifikasi') {
      const rows = await query(
        "SELECT v.id, u.name, u.phone, u.district FROM seller_verifications v JOIN users u ON u.id = v.user_id WHERE v.status = 'pending' ORDER BY v.created_at ASC LIMIT 10"
      );
      await telegramSend(chatId, rows.map(row => `#${row.id} ${row.name || '-'} · ${row.phone || '-'} · ${row.district || '-'}`).join('\n') || 'Tidak ada antrean verifikasi.');
      return ok(res, { handled: true });
    }
    if (text.startsWith('/setujui ')) {
      const verificationId = Number(text.slice(9).trim());
      if (!Number.isSafeInteger(verificationId) || verificationId < 1) {
        await telegramSend(chatId, 'ID verifikasi tidak valid.');
        return ok(res, { handled: false });
      }
      const rows = await query('SELECT user_id FROM seller_verifications WHERE id = ? AND status = \'pending\'', [verificationId]);
      if (!rows.length) {
        await telegramSend(chatId, 'Pengajuan tidak ditemukan atau sudah diproses.');
        return ok(res, { handled: false });
      }
      await run("UPDATE seller_verifications SET status = 'approved', reviewed_at = CURRENT_TIMESTAMP WHERE id = ?", [verificationId]);
      await run("UPDATE users SET verification_status = 'approved', is_verified = TRUE WHERE id = ?", [rows[0].user_id]);
      await telegramSend(chatId, `Seller #${verificationId} disetujui.`);
      return ok(res, { handled: true });
    }
    if (text === '/laporan') {
      const rows = await query("SELECT id, reason, status, created_at FROM reports WHERE status IN ('open','reviewing') ORDER BY created_at ASC LIMIT 10");
      await telegramSend(chatId, rows.map(row => `#${row.id} [${row.status}] ${String(row.reason || '').slice(0, 120)}`).join('\n') || 'Tidak ada laporan terbuka.');
      return ok(res, { handled: true });
    }
    if (text.startsWith('/selesaikan-laporan ')) {
      const reportId = Number(text.slice(21).trim());
      if (!Number.isSafeInteger(reportId) || reportId < 1) {
        await telegramSend(chatId, 'ID laporan tidak valid.');
        return ok(res, { handled: false });
      }
      const result = await run("UPDATE reports SET status = 'resolved' WHERE id = ? AND status IN ('open','reviewing')", [reportId]);
      await telegramSend(chatId, result.rowCount ? `Laporan #${reportId} diselesaikan.` : 'Laporan tidak ditemukan atau sudah ditutup.');
      return ok(res, { handled: Boolean(result.rowCount) });
    }
    if (text === '/webhook') {
      const rows = await query('SELECT provider, transaction_id, event_status, http_status, signature_valid, created_at FROM webhook_logs ORDER BY id DESC LIMIT 5');
      await telegramSend(chatId, rows.map(row => `${row.provider} ${row.transaction_id || '-'} ${row.event_status || '-'} HTTP ${row.http_status}`).join('\n') || 'Belum ada webhook.');
      return ok(res, { handled: true });
    }
    await telegramSend(chatId, 'Perintah tidak dikenal. Gunakan /help.');
    return ok(res, { handled: false });
  } catch (error) { next(error); }
});

module.exports = router;

'use strict';

// Router admin backoffice: RBAC, system settings, feature flags, overview,
// verifikasi seller, impor URL, laporan, analitik donasi, webhook logs.
// Diekstrak dari server.js tanpa perubahan perilaku; dipasang di /api/admin.
// Catatan: guard = requirePermission(...) + adminOnly (allowlist email owner).
const express = require('express');
const { query, run, withTransaction } = require('../database');
const { normalizeRole, ROLE_LEVELS, permissionList, roleSummary, requirePermission } = require('../rbac');
const { ok, fail, failCode } = require('../lib/http');
const { positiveInt, safeText } = require('../lib/validation');
const { adminOnly, auditAdminAction } = require('../lib/sessions');
const { persistExternalListing, persistExternalJob, summarizeLinkCard, universalLinkRow, fetchJobUrlMetadata } = require('../lib/link-import');
const { paymentOperation } = require('../lib/payments');
const { telegramConfigured, telegramSend: _telegramSend } = require('../lib/telegram');
const { SITE_URL } = require('../seo');

const router = express.Router();

router.get('/rbac/me', requirePermission('view_dashboard'), adminOnly, async (req, res) => {
  const role = normalizeRole(req.user.role);
  return ok(res, { role, level: ROLE_LEVELS[role], permissions: permissionList(role) });
});

router.get('/rbac/roles', requirePermission('manage_roles'), adminOnly, async (_req, res) => ok(res, roleSummary()));

router.get('/system/roles', requirePermission('manage_roles'), adminOnly, async (_req, res, next) => {
  try {
    ok(res, await query('SELECT id, role_key, role_name, level, description, permissions, is_system, is_active FROM admin_roles ORDER BY level DESC, role_key LIMIT 50'));
  } catch (error) { next(error); }
});

router.get('/system/settings', requirePermission('manage_settings'), adminOnly, async (_req, res, next) => {
  try {
    ok(res, await query('SELECT setting_key, setting_value, setting_group, description, is_public, updated_at FROM platform_settings ORDER BY setting_group, setting_key LIMIT 200'));
  } catch (error) { next(error); }
});

router.patch('/system/settings/:key', requirePermission('manage_settings'), adminOnly, async (req, res, next) => {
  try {
    const key = String(req.params.key || '').trim();
    if (!/^[a-z][a-z0-9_]{1,99}$/.test(key) || !Object.prototype.hasOwnProperty.call(req.body || {}, 'setting_value')) {
      return fail(res, 422, 'setting key atau setting_value tidak valid');
    }
    const serialized = JSON.stringify(req.body.setting_value);
    if (serialized === undefined || serialized.length > 16000) return fail(res, 422, 'setting_value terlalu besar atau tidak serializable');
    const rows = await query(
      'UPDATE platform_settings SET setting_value = ?::jsonb, updated_at = now() WHERE setting_key = ? RETURNING setting_key, setting_value, setting_group, description, is_public, updated_at',
      [serialized, key]
    );
    if (!rows.length) return fail(res, 404, 'Platform setting tidak ditemukan');
    await auditAdminAction({ run }, req, 'platform_setting_updated', 'platform_setting', key, { setting_group: rows[0].setting_group });
    ok(res, rows[0]);
  } catch (error) { next(error); }
});

router.get('/rbac/assignments', requirePermission('manage_roles'), adminOnly, async (_req, res, next) => {
  try {
    const rows = await query(
      'SELECT ara.user_id, u.name, u.email, u.role AS legacy_role, ara.role, ara.assigned_by, ara.created_at, ara.updated_at FROM admin_role_assignments ara JOIN users u ON u.id = ara.user_id ORDER BY ara.updated_at DESC LIMIT 200'
    );
    ok(res, rows);
  } catch (error) { next(error); }
});

router.put('/rbac/assignments/:userId', requirePermission('manage_roles'), adminOnly, async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const role = String(req.body?.role || '').trim().toLowerCase();
    const allowedRoles = ['user', 'seller', 'moderator', 'support', 'analyst', 'admin', 'super_admin'];
    if (!positiveInt(userId) || !allowedRoles.includes(role)) return fail(res, 422, 'userId atau role tidak valid');
    if (Number(req.user.id) === userId && role !== 'super_admin') return fail(res, 409, 'Super Admin tidak dapat menurunkan role dirinya sendiri');
    const result = await withTransaction(async ({ query: txQuery, run: txRun }) => {
      const [target] = await txQuery('SELECT id, role FROM users WHERE id = ?', [userId]);
      if (!target) return null;
      if (['user', 'seller'].includes(role)) {
        await txRun('DELETE FROM admin_role_assignments WHERE user_id = ?', [userId]);
        await txRun('UPDATE users SET role = ? WHERE id = ?', [role === 'user' ? 'buyer' : 'seller', userId]);
      } else {
        await txRun(
          'INSERT INTO admin_role_assignments (user_id, role, assigned_by) VALUES (?, ?, ?) ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role, assigned_by = EXCLUDED.assigned_by, updated_at = now()',
          [userId, role, req.user.id]
        );
      }
      await auditAdminAction({ run: txRun }, req, 'role_assigned', 'user', userId, { previous_legacy_role: target.role, assigned_role: role });
      return { user_id: userId, role };
    });
    if (!result) return fail(res, 404, 'Pengguna tidak ditemukan');
    ok(res, result);
  } catch (error) { next(error); }
});

router.delete('/rbac/assignments/:userId', requirePermission('manage_roles'), adminOnly, async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (!positiveInt(userId)) return fail(res, 422, 'userId tidak valid');
    if (Number(req.user.id) === userId) return fail(res, 409, 'Super Admin tidak dapat menghapus assignment dirinya sendiri');
    const result = await withTransaction(async ({ query: txQuery, run: txRun }) => {
      const [target] = await txQuery('SELECT id, role FROM users WHERE id = ?', [userId]);
      if (!target) return null;
      await txRun('DELETE FROM admin_role_assignments WHERE user_id = ?', [userId]);
      await auditAdminAction({ run: txRun }, req, 'role_assignment_removed', 'user', userId, { restored_legacy_role: target.role });
      return { user_id: userId, role: normalizeRole(target.role) };
    });
    if (!result) return fail(res, 404, 'Pengguna tidak ditemukan');
    ok(res, result);
  } catch (error) { next(error); }
});

router.get('/audit-logs', requirePermission('view_audit_log'), adminOnly, async (req, res, next) => {
  try {
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    ok(res, await query('SELECT id, actor_id, action, entity_type, entity_id, metadata, ip_address, user_agent, created_at FROM audit_logs ORDER BY id DESC LIMIT ?', [limit]));
  } catch (error) { next(error); }
});

router.get('/feature-flags', requirePermission('manage_settings'), adminOnly, async (_req, res, next) => {
  try { ok(res, await query('SELECT key, enabled, config, updated_at FROM feature_flags ORDER BY key')); }
  catch (error) { next(error); }
});

router.patch('/feature-flags/:key', requirePermission('manage_settings'), adminOnly, async (req, res, next) => {
  try {
    if (!/^[a-z0-9_]{2,60}$/.test(req.params.key) || typeof req.body?.enabled !== 'boolean') {
      return fail(res, 422, 'Feature flag atau enabled belum valid');
    }
    const rows = await query('UPDATE feature_flags SET enabled = ?, updated_at = now() WHERE key = ? RETURNING key, enabled, config, updated_at',
      [req.body.enabled, req.params.key]);
    if (!rows.length) return fail(res, 404, 'Feature flag tidak ditemukan');
    await run('INSERT INTO audit_logs (actor_id, action, entity_type, metadata) VALUES (?, ?, ?, ?::jsonb)',
      [req.user.id, req.body.enabled ? 'feature_enabled' : 'feature_disabled', 'feature_flag', JSON.stringify({ key: req.params.key })]);
    ok(res, rows[0]);
  } catch (error) { next(error); }
});

router.get('/overview', requirePermission('view_dashboard'), adminOnly, async (_req, res, next) => {
  try {
    const [users] = await query('SELECT COUNT(*) AS total FROM users');
    const [sellers] = await query("SELECT COUNT(*) AS total FROM users WHERE verification_status = 'pending'");
    const [reports] = await query("SELECT COUNT(*) AS total FROM reports WHERE status IN ('open','reviewing')");
    const [suggestions] = await query("SELECT COUNT(*) AS total FROM suggestions WHERE status IN ('new','reviewing')");
    ok(res, {
      users: Number(users.total), pending_sellers: Number(sellers.total),
      open_reports: Number(reports.total), pending_suggestions: Number(suggestions.total),
    });
  } catch (error) { next(error); }
});

router.get('/verifications', requirePermission('verify_sellers'), adminOnly, async (req, res, next) => {
  try {
    ok(res, await query(
      'SELECT v.*, u.name, u.phone, u.district FROM seller_verifications v JOIN users u ON u.id = v.user_id WHERE v.status = ? ORDER BY v.created_at DESC',
      [req.query.status || 'pending']
    ));
  } catch (error) { next(error); }
});

router.patch('/verifications/:id', requirePermission('verify_sellers'), adminOnly, async (req, res, next) => {
  try {
    const status = req.body?.status;
    if (!['approved', 'rejected', 'pending'].includes(status)) return fail(res, 422, 'Status verifikasi tidak valid');
    const rows = await query('SELECT user_id FROM seller_verifications WHERE id = ?', [Number(req.params.id)]);
    if (!rows.length) return fail(res, 404, 'Pengajuan verifikasi tidak ditemukan');
    await run('UPDATE seller_verifications SET status = ?, note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.body.note || null, Number(req.params.id)]);
    await run('UPDATE users SET verification_status = ?, verification_note = ? WHERE id = ?',
      [status, req.body.note || null, rows[0].user_id]);
    ok(res, { id: Number(req.params.id), status });
  } catch (error) { next(error); }
});

router.post('/external-jobs/import-url', requirePermission('manage_content'), adminOnly, async (req, res, next) => {
  try {
    const row = await summarizeLinkCard(await fetchJobUrlMetadata(req.body?.url));
    await persistExternalJob(row);
    ok(res, row);
  } catch (error) {
    if (error.code?.startsWith('JOB_')) return failCode(res, error.statusCode || 422, error.code, error.message);
    next(error);
  }
});

router.post('/external-jobs/import-urls', requirePermission('manage_content'), adminOnly, async (req, res, next) => {
  try {
    const urls = [...new Set((Array.isArray(req.body?.urls) ? req.body.urls : String(req.body?.urls || '').split(/\s+/))
      .map(url => String(url).trim()).filter(Boolean))].slice(0, 20);
    if (!urls.length) return fail(res, 422, 'Minimal satu URL lowongan diperlukan.');
    const results = [];
    for (const url of urls) {
      try {
        const row = await summarizeLinkCard(await fetchJobUrlMetadata(url));
        await persistExternalJob(row);
        results.push({ ok: true, ...row });
      } catch (error) {
        results.push({ ok: false, url, code: error.code || 'JOB_IMPORT_FAILED', error: error.message });
      }
    }
    ok(res, { imported: results.filter(row => row.ok).length, failed: results.filter(row => !row.ok).length, results });
  } catch (error) { next(error); }
});

router.post('/catalog/import-url', requirePermission('manage_content'), adminOnly, async (req, res, next) => {
  try {
    const draft = await universalLinkRow(req.body?.url, req.body?.category);
    const row = await summarizeLinkCard(draft);
    if (row.item_type === 'job') {
      await persistExternalJob({ ...row, company: row.source_label, employment_type: 'Lihat sumber', salary_text: '', posted_at: null, expires_at: null, category: 'Lowongan Kerja' });
    } else {
      await persistExternalListing(row);
    }
    ok(res, { ...row, category_slug: row.category });
  } catch (error) {
    if (error.code?.startsWith('JOB_')) return failCode(res, error.statusCode || 422, error.code, error.message);
    next(error);
  }
});

router.post('/catalog/import-urls', requirePermission('manage_content'), adminOnly, async (req, res, next) => {
  try {
    const urls = [...new Set((Array.isArray(req.body?.urls) ? req.body.urls : String(req.body?.urls || '').split(/\s+/))
      .map(url => String(url).trim()).filter(Boolean))].slice(0, 20);
    const category = String(req.body?.category || '').slice(0, 50);
    if (!urls.length) return fail(res, 422, 'Minimal satu URL diperlukan.');
    const results = [];
    for (const url of urls) {
      try {
        const draft = await universalLinkRow(url, category);
        const row = await summarizeLinkCard(draft);
        if (row.item_type === 'job') {
          await persistExternalJob({ ...row, company: row.source_label, employment_type: 'Lihat sumber', salary_text: '', posted_at: null, expires_at: null, category: 'Lowongan Kerja' });
        } else {
          await persistExternalListing(row);
        }
        results.push({ ok: true, ...row, category_slug: row.category });
      } catch (error) {
        results.push({ ok: false, url, code: error.code || 'LINK_IMPORT_FAILED', error: error.message });
      }
    }
    ok(res, { imported: results.filter(row => row.ok).length, failed: results.filter(row => !row.ok).length, results });
  } catch (error) { next(error); }
});

router.get('/reports', requirePermission('moderate_reports'), adminOnly, async (req, res, next) => {
  try {
    ok(res, await query(
      'SELECT r.*, l.title FROM reports r LEFT JOIN listings l ON l.id = r.listing_id WHERE r.status = ? ORDER BY r.created_at DESC',
      [req.query.status || 'open']
    ));
  } catch (error) { next(error); }
});

router.patch('/reports/:id', requirePermission('moderate_reports'), adminOnly, async (req, res, next) => {
  try {
    const status = req.body?.status;
    if (!['open', 'reviewing', 'resolved', 'rejected'].includes(status)) return fail(res, 422, 'Status laporan tidak valid');
    await run('UPDATE reports SET status = ? WHERE id = ?', [status, Number(req.params.id)]);
    ok(res, { id: Number(req.params.id), status });
  } catch (error) { next(error); }
});

router.post('/telegram/set-webhook', requirePermission('manage_settings'), adminOnly, async (_req, res, next) => {
  try {
    if (!telegramConfigured()) return failCode(res, 503, 'TELEGRAM_NOT_CONFIGURED', 'Telegram bot belum dikonfigurasi lengkap.');
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        url: `${SITE_URL}/api/telegram/webhook`,
        secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
        allowed_updates: ['message', 'channel_post'],
      }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.ok === false) return fail(res, 502, body.description || 'Telegram menolak webhook.');
    ok(res, { configured: true, url: `${SITE_URL}/api/telegram/webhook` });
  } catch (error) { next(error); }
});

router.get('/donations/analytics', requirePermission('manage_donations'), adminOnly, async (req, res, next) => {
  try {
    const days = Math.min(90, Math.max(1, Number(req.query.days) || 30));
    const [totals] = await query(
      `SELECT COUNT(*)::int AS attempts,
        COUNT(*) FILTER (WHERE payment_status = 'success')::int AS successful,
        COUNT(*) FILTER (WHERE payment_status IN ('failed','expired'))::int AS failed,
        COALESCE(SUM(CASE WHEN payment_status = 'success' THEN amount - refunded_amount ELSE 0 END), 0)::bigint AS net_amount
       FROM donations WHERE created_at >= now() - (? * interval '1 day')`,
      [`-${days} days`]
    );
    const daily = await query(
      `SELECT created_at::date AS date, COUNT(*)::int AS attempts,
        COUNT(*) FILTER (WHERE payment_status = 'success')::int AS successful,
        COUNT(*) FILTER (WHERE payment_status IN ('failed','expired'))::int AS failed,
        COALESCE(SUM(CASE WHEN payment_status = 'success' THEN amount - refunded_amount ELSE 0 END), 0)::bigint AS net_amount
       FROM donations WHERE created_at >= now() - (? * interval '1 day') GROUP BY created_at::date ORDER BY date ASC`,
      [`-${days} days`]
    );
    const successRate = Number(totals.attempts) ? Number((Number(totals.successful) / Number(totals.attempts) * 100).toFixed(2)) : 0;
    ok(res, { days, totals: { ...totals, success_rate: successRate }, daily });
  } catch (error) { next(error); }
});

router.get('/webhook-logs', requirePermission('view_audit_log'), adminOnly, async (req, res, next) => {
  try {
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    ok(res, await query('SELECT id, provider, transaction_id, event_status, http_status, signature_valid, error_message, created_at FROM webhook_logs ORDER BY id DESC LIMIT ?', [limit]));
  } catch (error) { next(error); }
});

router.get('/webhook-logs/stream', requirePermission('view_audit_log'), adminOnly, async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  let lastId = Number(req.query.after || 0);
  const emit = async () => {
    const rows = await query('SELECT id, provider, transaction_id, event_status, http_status, signature_valid, error_message, created_at FROM webhook_logs WHERE id > ? ORDER BY id ASC LIMIT 100', [lastId]);
    for (const row of rows) {
      lastId = row.id;
      res.write(`data: ${JSON.stringify(row)}\n\n`);
    }
  };
  await emit();
  const timer = setInterval(() => emit().catch(() => {}), 2000);
  req.on('close', () => clearInterval(timer));
});

router.post('/donations/:transaction_id/:operation', requirePermission('manage_donations'), adminOnly, async (req, res, next) => {
  try {
    const operation = req.params.operation;
    if (!['refund', 'cancel'].includes(operation)) return fail(res, 422, 'Operasi harus refund atau cancel');
    const transactionId = safeText(req.params.transaction_id, 100);
    const [donation] = await query('SELECT * FROM donations WHERE transaction_id = ?', [transactionId]);
    if (!donation) return fail(res, 404, 'Transaksi donasi tidak ditemukan');
    if (operation === 'refund' && donation.payment_status !== 'success') return fail(res, 409, 'Hanya donasi sukses yang dapat direfund');
    if (operation === 'cancel' && donation.payment_status !== 'pending') return fail(res, 409, 'Hanya donasi pending yang dapat dibatalkan');
    const provider = donation.payment_provider || process.env.PAYMENT_PROVIDER;
    const amount = Math.max(0, Number(donation.amount) - Number(donation.refunded_amount || 0));
    if (!provider) return fail(res, 409, 'Provider pembayaran transaksi tidak diketahui');
    if (operation === 'refund' && provider === 'aulaa') {
      return fail(res, 409, 'Refund Aulaa diproses melalui dashboard Aulaa sampai endpoint refund resmi tersedia.');
    }
    const result = await paymentOperation({
      provider, transactionId, providerReference: donation.provider_reference,
      operation, amount, reason: safeText(req.body?.reason, 250),
    });
    if (operation === 'cancel') {
      await run("UPDATE donations SET payment_status = 'expired', status = 'cancelled' WHERE id = ?", [donation.id]);
    } else {
      await run('INSERT INTO donation_refunds (transaction_id, amount, reason, provider, provider_reference, status) VALUES (?, ?, ?, ?, ?, ?)',
        [transactionId, amount, safeText(req.body?.reason, 250) || 'Donasi dikembalikan', provider, result.reference, 'success']);
      await run('UPDATE donations SET refunded_amount = refunded_amount + ? WHERE id = ?', [amount, donation.id]);
      await run('UPDATE donation_campaigns SET current_amount = MAX(0, current_amount - ?) WHERE id = ?', [amount, donation.campaign_id]);
    }
    ok(res, {
      transaction_id: transactionId, operation, provider, amount,
      status: operation === 'refund' ? 'success' : 'expired', provider_reference: result.reference,
    });
  } catch (error) { next(error); }
});

module.exports = router;

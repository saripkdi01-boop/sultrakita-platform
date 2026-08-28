'use strict';

/**
 * Section 4 admin API adapter.
 *
 * The repository is deployed as one Express handler (server.js), so this router
 * is mounted under /api/admin/v2 instead of replacing the existing /api/admin
 * routes. It deliberately reuses the existing bearer session, PostgreSQL
 * helpers, RBAC matrix, and ADMIN_TOKEN second gate; the pasted JWT/cookie
 * implementation would create a second incompatible authentication system.
 */
const express = require('express');
const { query, run } = require('../../database');
const { requireAuth } = require('../../auth');
const { hasPermission, normalizeRole, permissionList, ROLE_LEVELS, requirePermission } = require('../../rbac');
const OWNER_ADMIN_EMAIL = 'sultrakitaplatform@gmail.com';

const router = express.Router();

const ok = (res, data, meta) => res.json({ success: true, data, ...(meta ? { meta } : {}) });
const fail = (res, status, error, details) => res.status(status).json({ success: false, error, ...(details ? { details } : {}) });
const adminToken = (req, res, next) => {
  // The v2 dashboard is owner-only; a token header can never substitute for Google SSO.
  const sessionEmail = String(req.user?.email || '').trim().toLowerCase();
  if (sessionEmail !== OWNER_ADMIN_EMAIL) return fail(res, 401, 'Akses admin hanya tersedia untuk akun Google owner yang diizinkan');
  return next();
};
const guarded = permission => [requireAuth, requirePermission(permission), adminToken];
const boundedInt = (value, fallback, min, max) => {
  const number = Number(value);
  return Number.isInteger(number) ? Math.min(max, Math.max(min, number)) : fallback;
};
const positiveId = value => Number.isSafeInteger(Number(value)) && Number(value) > 0;
const text = (value, max) => String(value ?? '').trim().slice(0, max);
const ipAddress = req => text(req.ip || req.get('x-forwarded-for') || '', 100) || null;

async function audit(req, action, entityType, entityId, metadata = {}) {
  try {
    await run('INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata, ip_address, user_agent) VALUES (?, ?, ?, ?, ?::jsonb, ?, ?)', [
      req.user?.id || null,
      action,
      entityType,
      entityId == null ? null : String(entityId),
      JSON.stringify(metadata),
      ipAddress(req),
      text(req.get('user-agent'), 300) || null,
    ]);
  } catch (error) {
    // Audit failure is observable but must not turn an already completed safe mutation into a false 500.
    console.error('[admin-api-audit]', error.message);
  }
}

const canSeePii = req => hasPermission(normalizeRole(req.user?.role), 'view_user_pii');
const serializeUser = (row, includePii) => ({
  id: row.id,
  name: row.name,
  role: normalizeRole(row.role),
  legacy_role: row.legacy_role || row.role,
  district: row.district,
  verification_status: row.verification_status,
  is_verified: Boolean(Number(row.is_verified || 0)),
  created_at: row.created_at,
  ...(includePii ? { email: row.email || null, phone: row.phone || null } : {}),
});

router.get('/', ...guarded('view_dashboard'), async (req, res, next) => {
  try {
    ok(res, { version: 'v2', user_id: req.user.id, name: req.user.name || null, email: req.user.email || null, role: normalizeRole(req.user.role), level: ROLE_LEVELS[normalizeRole(req.user.role)], permissions: permissionList(req.user.role), server_enforced: true });
  } catch (error) { next(error); }
});

router.get('/dashboard/overview', ...guarded('view_dashboard'), async (_req, res, next) => {
  try {
    const [summary] = await query(`SELECT
      (SELECT COUNT(*) FROM users)::int AS total_users,
      (SELECT COUNT(*) FROM listings)::int AS total_listings,
      (SELECT COUNT(*) FROM listings WHERE status = 'active')::int AS active_listings,
      (SELECT COUNT(*) FROM reports WHERE status IN ('open', 'reviewing'))::int AS open_reports,
      (SELECT COUNT(*) FROM seller_verifications WHERE status = 'pending')::int AS pending_verifications,
      (SELECT COUNT(*) FROM donations WHERE payment_status = 'success')::int AS successful_donations`);
    ok(res, summary || {});
  } catch (error) { next(error); }
});

router.get('/users', ...guarded('manage_users'), async (req, res, next) => {
  try {
    const page = boundedInt(req.query.page, 1, 1, 100000);
    const limit = boundedInt(req.query.limit, 20, 1, 100);
    const offset = (page - 1) * limit;
    const values = [];
    const where = [];
    const search = text(req.query.search, 100);
    if (search) {
      values.push(`%${search}%`, `%${search}%`);
      where.push(`(u.name ILIKE ? OR u.email ILIKE ?)`);
    }
    const legacyRole = text(req.query.role, 20).toLowerCase();
    if (['buyer', 'seller', 'admin'].includes(legacyRole)) { values.push(legacyRole); where.push('u.role = ?'); }
    values.push(limit, offset);
    const rows = await query(`SELECT u.id, u.name, u.email, u.phone, u.role, u.role AS legacy_role, u.district, u.is_verified, u.verification_status, u.created_at
      FROM users u ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY u.id DESC LIMIT ? OFFSET ?`, values);
    const [total] = await query(`SELECT COUNT(*)::int AS total FROM users u ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`, values.slice(0, -2));
    ok(res, rows.map(row => serializeUser(row, canSeePii(req))), { page, limit, total: Number(total?.total || 0) });
  } catch (error) { next(error); }
});

router.get('/stats', ...guarded('view_dashboard'), async (_req, res, next) => {
  try {
    const [summary] = await query(`SELECT
      (SELECT COUNT(*) FROM users)::int AS total_users,
      (SELECT COUNT(*) FROM listings)::int AS total_listings,
      (SELECT COUNT(*) FROM listings WHERE status = 'active')::int AS active_listings,
      (SELECT COUNT(*) FROM reports WHERE status IN ('open', 'reviewing'))::int AS open_reports,
      (SELECT COUNT(*) FROM seller_verifications WHERE status = 'pending')::int AS pending_verifications,
      (SELECT COUNT(*) FROM donations WHERE payment_status = 'success')::int AS successful_donations`);
    ok(res, summary || {});
  } catch (error) { next(error); }
});

router.patch('/users/:id/ban', ...guarded('ban_users'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID pengguna tidak valid');
    const banned = req.body?.banned === undefined ? true : Boolean(req.body.banned);
    const reason = text(req.body?.reason, 500) || null;
    const [target] = await query('SELECT id, name, role FROM users WHERE id = ?', [Number(req.params.id)]);
    if (!target) return fail(res, 404, 'Pengguna tidak ditemukan');
    if (Number(req.user.id) === Number(target.id)) return fail(res, 409, 'Admin tidak dapat membekukan akunnya sendiri');
    // The legacy schema has no is_banned column. A ban is represented by a reversible role-safe status note.
    // This additive adapter refuses to invent a column or mutate role, so deployments without the dedicated
    // moderation field remain safe rather than falsely claiming that a ban was persisted.
    return fail(res, 409, 'Kolom ban user belum tersedia pada schema existing; gunakan migration moderation resmi terlebih dahulu', { user_id: target.id, requested_banned: banned, reason });
  } catch (error) { next(error); }
});

router.get('/users/:id', ...guarded('manage_users'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID pengguna tidak valid');
    const [user] = await query('SELECT id, name, email, phone, role, role AS legacy_role, district, is_verified, verification_status, created_at FROM users WHERE id = ?', [Number(req.params.id)]);
    if (!user) return fail(res, 404, 'Pengguna tidak ditemukan');
    const [listingCount] = await query('SELECT COUNT(*)::int AS total FROM listings WHERE seller_id = ?', [user.id]);
    ok(res, { ...serializeUser(user, canSeePii(req)), listing_count: Number(listingCount?.total || 0) });
  } catch (error) { next(error); }
});

router.put('/users/:id', ...guarded('manage_users'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID pengguna tidak valid');
    if (Object.prototype.hasOwnProperty.call(req.body || {}, 'role')) return fail(res, 403, 'Perubahan role harus melalui endpoint role assignment Super Admin');
    const body = req.body || {};
    const name = body.name === undefined ? null : text(body.name, 80);
    const email = body.email === undefined ? null : text(body.email, 254).toLowerCase();
    const district = body.district === undefined ? null : text(body.district, 80);
    if (name !== null && name.length < 2) return fail(res, 422, 'Nama minimal 2 karakter');
    if (email !== null && email && !/^\S+@\S+\.\S{2,}$/.test(email)) return fail(res, 422, 'Email belum valid');
    if (district !== null && !district) return fail(res, 422, 'Wilayah tidak valid');
    const rows = await query('UPDATE users SET name = COALESCE(?, name), email = CASE WHEN ? IS NULL THEN email ELSE ? END, district = COALESCE(?, district) WHERE id = ? RETURNING id, name, email, phone, role, role AS legacy_role, district, is_verified, verification_status, created_at', [name, email, email, district, Number(req.params.id)]);
    if (!rows.length) return fail(res, 404, 'Pengguna tidak ditemukan');
    await audit(req, 'admin_user_updated', 'user', req.params.id, { changed_fields: Object.keys(body).filter(key => ['name', 'email', 'district'].includes(key)) });
    ok(res, serializeUser(rows[0], canSeePii(req)));
  } catch (error) { next(error); }
});

router.get('/listings', ...guarded('manage_listings'), async (req, res, next) => {
  try {
    const page = boundedInt(req.query.page, 1, 1, 100000);
    const limit = boundedInt(req.query.limit, 20, 1, 100);
    const offset = (page - 1) * limit;
    const values = [];
    const where = [];
    const status = text(req.query.status, 20).toLowerCase();
    if (['active', 'sold', 'archived'].includes(status)) { values.push(status); where.push('l.status = ?'); }
    if (positiveId(req.query.category_id)) { values.push(Number(req.query.category_id)); where.push('l.category_id = ?'); }
    const district = text(req.query.district, 80);
    if (district) { values.push(district); where.push('LOWER(l.district) = LOWER(?)'); }
    const search = text(req.query.search, 100);
    if (search) { values.push(`%${search}%`, `%${search}%`); where.push('(l.title ILIKE ? OR l.description ILIKE ?)'); }
    values.push(limit, offset);
    const rows = await query(`SELECT l.id, l.title, l.description, l.price, l.status, l.moderation_status, l.is_featured, l.is_promoted, l.district, l.city, l.seller_id, u.name AS seller_name, l.created_at, l.updated_at
      FROM listings l LEFT JOIN users u ON u.id = l.seller_id ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY l.id DESC LIMIT ? OFFSET ?`, values);
    const [total] = await query(`SELECT COUNT(*)::int AS total FROM listings l ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`, values.slice(0, -2));
    ok(res, rows, { page, limit, total: Number(total?.total || 0) });
  } catch (error) { next(error); }
});

router.patch('/listings/:id/status', ...guarded('approve_listings'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID listing tidak valid');
    const requested = text(req.body?.status, 20).toLowerCase();
    if (!['active', 'sold', 'archived'].includes(requested)) return fail(res, 422, 'Status listing harus active, sold, atau archived');
    const moderation = requested === 'active' ? 'approved' : requested === 'archived' ? 'rejected' : 'approved';
    const rows = await query('UPDATE listings SET status = ?, moderation_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, title, status, moderation_status, updated_at', [requested, moderation, Number(req.params.id)]);
    if (!rows.length) return fail(res, 404, 'Listing tidak ditemukan');
    await audit(req, `listing_${moderation}`, 'listing', req.params.id, { status: requested, note: text(req.body?.reason, 500) || null });
    ok(res, rows[0]);
  } catch (error) { next(error); }
});

router.delete('/listings/:id', ...guarded('delete_any_listing'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID listing tidak valid');
    const result = await run('DELETE FROM listings WHERE id = ?', [Number(req.params.id)]);
    if (!result.rowCount) return fail(res, 404, 'Listing tidak ditemukan');
    await audit(req, 'listing_deleted', 'listing', req.params.id, { reason: text(req.body?.reason, 500) || null });
    ok(res, { deleted: true, id: Number(req.params.id) });
  } catch (error) { next(error); }
});

router.post('/listings/:id/feature', ...guarded('feature_listings'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID listing tidak valid');
    const featured = req.body?.featured === false ? false : true;
    const rows = await query('UPDATE listings SET is_featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, title, is_featured', [featured, Number(req.params.id)]);
    if (!rows.length) return fail(res, 404, 'Listing tidak ditemukan');
    await audit(req, featured ? 'listing_featured' : 'listing_unfeatured', 'listing', req.params.id);
    ok(res, rows[0]);
  } catch (error) { next(error); }
});

router.get('/reports', ...guarded('moderate_reports'), async (req, res, next) => {
  try {
    const page = boundedInt(req.query.page, 1, 1, 100000);
    const limit = boundedInt(req.query.limit, 20, 1, 100);
    const offset = (page - 1) * limit;
    const values = [];
    const where = [];
    const status = text(req.query.status, 20).toLowerCase();
    if (['open', 'reviewing', 'resolved', 'rejected'].includes(status)) { values.push(status); where.push('r.status = ?'); }
    values.push(limit, offset);
    const rows = await query(`SELECT r.id, r.listing_id, r.reporter_name, r.reason, r.status, r.created_at, l.title AS listing_title
      FROM reports r LEFT JOIN listings l ON l.id = r.listing_id ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY r.id DESC LIMIT ? OFFSET ?`, values);
    const [total] = await query(`SELECT COUNT(*)::int AS total FROM reports r ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`, values.slice(0, -2));
    ok(res, rows, { page, limit, total: Number(total?.total || 0) });
  } catch (error) { next(error); }
});

router.patch('/reports/:id', ...guarded('moderate_reports'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID laporan tidak valid');
    const status = text(req.body?.status, 20).toLowerCase();
    if (!['open', 'reviewing', 'resolved', 'rejected'].includes(status)) return fail(res, 422, 'Status laporan tidak valid');
    const rows = await query('UPDATE reports SET status = ? WHERE id = ? RETURNING id, listing_id, reporter_name, reason, status, created_at', [status, Number(req.params.id)]);
    if (!rows.length) return fail(res, 404, 'Laporan tidak ditemukan');
    await audit(req, 'report_status_updated', 'report', req.params.id, { status, note: text(req.body?.resolution_notes, 500) || null });
    ok(res, rows[0]);
  } catch (error) { next(error); }
});

router.get('/verifications', ...guarded('verify_sellers'), async (req, res, next) => {
  try {
    const status = ['pending', 'approved', 'rejected'].includes(text(req.query.status, 20).toLowerCase()) ? text(req.query.status, 20).toLowerCase() : 'pending';
    const limit = boundedInt(req.query.limit, 50, 1, 100);
    const rows = await query(`SELECT v.id, v.user_id, v.document_type, v.status, v.note, v.created_at, v.reviewed_at, u.name, u.email, u.phone, u.district
      FROM seller_verifications v JOIN users u ON u.id = v.user_id WHERE v.status = ? ORDER BY v.id DESC LIMIT ?`, [status, limit]);
    ok(res, rows.map(row => ({ ...row, ...(canSeePii(req) ? {} : { email: undefined, phone: undefined }) })));
  } catch (error) { next(error); }
});

router.patch('/verifications/:id', ...guarded('verify_sellers'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID verifikasi tidak valid');
    const status = text(req.body?.status, 20).toLowerCase();
    if (!['approved', 'rejected'].includes(status)) return fail(res, 422, 'Status verifikasi harus approved atau rejected');
    const rows = await query('UPDATE seller_verifications SET status = ?, note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, user_id, document_type, status, note, reviewed_at', [status, text(req.body?.notes, 1000) || null, Number(req.params.id)]);
    if (!rows.length) return fail(res, 404, 'Verifikasi seller tidak ditemukan');
    if (status === 'approved') await run("UPDATE users SET verification_status = 'approved', is_verified = 1 WHERE id = ?", [rows[0].user_id]);
    await audit(req, `seller_verification_${status}`, 'seller_verification', req.params.id, { user_id: rows[0].user_id });
    ok(res, rows[0]);
  } catch (error) { next(error); }
});

router.get('/analytics', ...guarded('view_analytics'), async (req, res, next) => {
  try {
    const days = boundedInt(req.query.days, 30, 1, 365);
    const [summary] = await query(`SELECT
      (SELECT COUNT(*)::int FROM analytics_events WHERE created_at >= now() - (? * interval '1 day')) AS events,
      (SELECT COUNT(*)::int FROM listings WHERE created_at >= now() - (? * interval '1 day')) AS new_listings,
      (SELECT COUNT(*)::int FROM users WHERE created_at >= now() - (? * interval '1 day')) AS new_users,
      (SELECT COUNT(*)::int FROM reports WHERE created_at >= now() - (? * interval '1 day')) AS new_reports`, [days, days, days, days]);
    ok(res, { days, summary: summary || {} });
  } catch (error) { next(error); }
});

router.get('/analytics/export', ...guarded('export_data'), async (req, res, next) => {
  try {
    const days = boundedInt(req.query.days, 30, 1, 365);
    const rows = await query(`SELECT created_at::date AS date, event_name, COUNT(*)::int AS total
      FROM analytics_events WHERE created_at >= now() - (? * interval '1 day') GROUP BY created_at::date, event_name ORDER BY date ASC, event_name ASC`, [days]);
    const csv = ['date,event_name,total', ...rows.map(row => [row.date, row.event_name, row.total].map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="sultrakita-analytics-${days}d.csv"`);
    res.send(csv);
  } catch (error) { next(error); }
});

router.get('/audit-logs', ...guarded('view_audit_log'), async (req, res, next) => {
  try {
    const limit = boundedInt(req.query.limit, 50, 1, 200);
    const rows = await query('SELECT id, actor_id, action, entity_type, entity_id, metadata, ip_address, user_agent, created_at FROM audit_logs ORDER BY id DESC LIMIT ?', [limit]);
    ok(res, rows);
  } catch (error) { next(error); }
});

router.get('/settings', ...guarded('manage_settings'), async (_req, res, next) => {
  try { ok(res, await query('SELECT setting_key, setting_value, setting_group, description, is_public, updated_at FROM platform_settings ORDER BY setting_group, setting_key LIMIT 200')); } catch (error) { next(error); }
});

router.patch('/settings/:key', ...guarded('manage_settings'), async (req, res, next) => {
  try {
    const key = text(req.params.key, 100);
    if (!/^[a-z][a-z0-9_]{1,99}$/.test(key) || !Object.prototype.hasOwnProperty.call(req.body || {}, 'setting_value')) return fail(res, 422, 'setting key atau setting_value tidak valid');
    const serialized = JSON.stringify(req.body.setting_value);
    if (serialized === undefined || serialized.length > 16000) return fail(res, 422, 'setting_value terlalu besar atau tidak serializable');
    const rows = await query('UPDATE platform_settings SET setting_value = ?::jsonb, updated_at = now() WHERE setting_key = ? RETURNING setting_key, setting_value, setting_group, description, is_public, updated_at', [serialized, key]);
    if (!rows.length) return fail(res, 404, 'Platform setting tidak ditemukan');
    await audit(req, 'platform_setting_updated', 'platform_setting', key, { setting_group: rows[0].setting_group });
    ok(res, rows[0]);
  } catch (error) { next(error); }
});

router.get('/categories', ...guarded('manage_categories'), async (_req, res, next) => {
  try {
    const rows = await query(`SELECT c.id, c.name, c.slug, c.icon, c.created_at,
      (SELECT COUNT(*)::int FROM listings l WHERE l.category_id = c.id) AS listing_count
      FROM categories c ORDER BY c.name ASC LIMIT 200`);
    ok(res, rows);
  } catch (error) { next(error); }
});

router.post('/categories', ...guarded('manage_categories'), async (req, res, next) => {
  try {
    const name = text(req.body?.name, 80);
    const slug = text(req.body?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), 80).replace(/^-|-$/g, '');
    const icon = text(req.body?.icon || 'tag', 40) || 'tag';
    if (name.length < 2 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return fail(res, 422, 'Nama atau slug kategori belum valid');
    const created = await run('INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?) RETURNING id', [name, slug, icon]);
    await audit(req, 'category_created', 'category', created.id, { name, slug });
    ok(res, { id: created.id, name, slug, icon });
  } catch (error) { if (error.code === '23505') return fail(res, 409, 'Slug kategori sudah digunakan'); next(error); }
});

router.patch('/categories/:id', ...guarded('manage_categories'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID kategori tidak valid');
    const name = text(req.body?.name, 80);
    const slug = text(req.body?.slug, 80);
    const icon = text(req.body?.icon, 40);
    if (name && name.length < 2 || slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return fail(res, 422, 'Nama atau slug kategori belum valid');
    const rows = await query('UPDATE categories SET name = COALESCE(?, name), slug = COALESCE(?, slug), icon = COALESCE(?, icon) WHERE id = ? RETURNING id, name, slug, icon, created_at', [name || null, slug || null, icon || null, Number(req.params.id)]);
    if (!rows.length) return fail(res, 404, 'Kategori tidak ditemukan');
    await audit(req, 'category_updated', 'category', req.params.id, { changed_fields: Object.keys(req.body || {}) });
    ok(res, rows[0]);
  } catch (error) { if (error.code === '23505') return fail(res, 409, 'Slug kategori sudah digunakan'); next(error); }
});

router.delete('/categories/:id', ...guarded('manage_categories'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID kategori tidak valid');
    const [usage] = await query('SELECT COUNT(*)::int AS total FROM listings WHERE category_id = ?', [Number(req.params.id)]);
    if (Number(usage?.total || 0) > 0) return fail(res, 409, 'Kategori masih dipakai listing dan tidak dapat dihapus');
    const result = await run('DELETE FROM categories WHERE id = ?', [Number(req.params.id)]);
    if (!result.rowCount) return fail(res, 404, 'Kategori tidak ditemukan');
    await audit(req, 'category_deleted', 'category', req.params.id);
    ok(res, { deleted: true, id: Number(req.params.id) });
  } catch (error) { next(error); }
});

router.get('/content', ...guarded('manage_content'), async (req, res, next) => {
  try {
    const limit = boundedInt(req.query.limit, 100, 1, 200);
    ok(res, await query('SELECT id, content_type, title, body, image_url, link_url, position, priority, is_active, starts_at, ends_at, target_audience, target_region, metadata, created_at, updated_at FROM admin_content ORDER BY priority DESC, created_at DESC LIMIT ?', [limit]));
  } catch (error) { next(error); }
});

router.post('/content', ...guarded('manage_content'), async (req, res, next) => {
  try {
    const contentType = text(req.body?.content_type || 'announcement', 50).toLowerCase();
    const title = text(req.body?.title, 255);
    const body = text(req.body?.body, 5000) || null;
    const position = text(req.body?.position || 'banner', 50) || 'banner';
    const audience = text(req.body?.target_audience || 'all', 50) || 'all';
    const active = req.body?.is_active !== false;
    if (!['banner', 'announcement', 'popup', 'promo', 'featured_section'].includes(contentType) || title.length < 2) return fail(res, 422, 'Tipe atau judul content belum valid');
    const created = await run(`INSERT INTO admin_content (content_type, title, body, image_url, link_url, position, priority, is_active, starts_at, ends_at, target_audience, target_region, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb) RETURNING id`, [contentType, title, body, text(req.body?.image_url, 1000) || null, text(req.body?.link_url, 1000) || null, position, Number.isInteger(Number(req.body?.priority)) ? Number(req.body.priority) : 0, active, req.body?.starts_at || null, req.body?.ends_at || null, audience, text(req.body?.target_region, 100) || null, JSON.stringify(req.body?.metadata && typeof req.body.metadata === 'object' ? req.body.metadata : {})]);
    await audit(req, 'admin_content_created', 'admin_content', created.id, { content_type: contentType, target_audience: audience });
    ok(res, { id: created.id, content_type: contentType, title, is_active: active });
  } catch (error) { next(error); }
});

router.patch('/content/:id', ...guarded('manage_content'), async (req, res, next) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(String(req.params.id))) return fail(res, 422, 'ID content tidak valid');
    const active = req.body?.is_active === undefined ? null : Boolean(req.body.is_active);
    const title = req.body?.title === undefined ? null : text(req.body.title, 255);
    if (title !== null && title.length < 2) return fail(res, 422, 'Judul content belum valid');
    const rows = await query('UPDATE admin_content SET title = COALESCE(?, title), body = COALESCE(?, body), is_active = COALESCE(?, is_active), updated_at = now() WHERE id = ? RETURNING id, content_type, title, body, is_active, updated_at', [title, req.body?.body === undefined ? null : text(req.body.body, 5000), active, req.params.id]);
    if (!rows.length) return fail(res, 404, 'Content tidak ditemukan');
    await audit(req, 'admin_content_updated', 'admin_content', req.params.id, { changed_fields: Object.keys(req.body || {}) });
    ok(res, rows[0]);
  } catch (error) { next(error); }
});

router.get('/donations', ...guarded('manage_donations'), async (req, res, next) => {
  try {
    const limit = boundedInt(req.query.limit, 100, 1, 200);
    ok(res, await query('SELECT id, campaign_id, name, email, amount, transaction_id, payment_method, payment_provider, payment_status, status, created_at FROM donations ORDER BY id DESC LIMIT ?', [limit]));
  } catch (error) { next(error); }
});

module.exports = router;

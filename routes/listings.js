'use strict';

// Router marketplace inti: listing, seller, favorit, komentar, saran, riwayat pencarian.
// Diekstrak dari server.js tanpa perubahan perilaku; dipasang di /api.
const express = require('express');
const { query, run } = require('../database');
const { requireAuth } = require('../auth');
const { normalizeRole } = require('../rbac');
const { ok, fail } = require('../lib/http');
const { positiveInt, safeText } = require('../lib/validation');
const { currentUser } = require('../lib/sessions');
const { notifySellerWhatsApp } = require('../lib/whatsapp');
const { ALL_DISTRICTS } = require('../shared/taxonomy');

const router = express.Router();
const districts = ALL_DISTRICTS;

// Cast ke teks agar nilai legacy bigint 0/1 dan boolean modern sama-sama didukung.
const sellerVerifiedSql = "CASE WHEN COALESCE(u.verification_status, 'unverified') = 'approved' THEN 1 ELSE 0 END";

router.get('/sellers/:id', async (req, res, next) => {
  try {
    const sellerId = Number(req.params.id);
    if (!positiveInt(sellerId)) return fail(res, 400, 'ID seller tidak valid');
    const [seller] = await query('SELECT id, name, district, bio, rating_average, rating_count, verification_status, created_at FROM users WHERE id = ?', [sellerId]);
    if (!seller) return fail(res, 404, 'Seller tidak ditemukan');
    const listings = await query(
      "SELECT l.id, l.title, l.price, l.district, l.city, l.image_url, l.created_at, c.name AS category_name, c.slug AS category_slug FROM listings l LEFT JOIN categories c ON c.id = l.category_id WHERE l.seller_id = ? AND l.status = 'active' ORDER BY l.created_at DESC LIMIT 6",
      [sellerId]
    );
    const [sold] = await query("SELECT COUNT(*)::int AS sold_count FROM listings WHERE seller_id = ? AND status = 'sold'", [sellerId]);
    ok(res, {
      seller: {
        id: seller.id, name: seller.name, district: seller.district, bio: seller.bio,
        rating_average: Number(seller.rating_average || 0), rating_count: Number(seller.rating_count || 0),
        verified: seller.verification_status === 'approved', joined_at: seller.created_at, sold_count: Number(sold?.sold_count || 0),
      },
      listings,
    });
  } catch (error) { next(error); }
});

router.get('/stats', async (_req, res, next) => {
  try {
    const [summary] = await query(
      `SELECT COUNT(*)::int AS total_listings,
        COUNT(*) FILTER (WHERE status = 'active')::int AS active_listings,
        COUNT(DISTINCT district) FILTER (WHERE status = 'active')::int AS covered_districts,
        COUNT(*) FILTER (WHERE status = 'active' AND CASE WHEN created_at::text ~ '^\\d{4}-' THEN created_at::timestamptz ELSE NULL END >= now() - interval '7 days')::int AS weekly_new_listings
       FROM listings`
    );
    const popular = await query(
      `SELECT c.name AS category, COUNT(l.id) AS total FROM categories c
       LEFT JOIN listings l ON l.category_id = c.id AND l.status = 'active'
       GROUP BY c.id ORDER BY total DESC, c.name LIMIT 5`
    );
    ok(res, { summary, popular_categories: popular });
  } catch (error) { next(error); }
});

router.get('/listings', async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit || '12', 10)));
    const offset = (page - 1) * limit;
    const params = [];
    const filters = ['l.status = ?'];
    params.push('active');
    if (req.query.q) {
      filters.push('(LOWER(l.title) LIKE LOWER(?) OR LOWER(l.description) LIKE LOWER(?) OR LOWER(l.city) LIKE LOWER(?))');
      const q = `%${req.query.q}%`;
      params.push(q, q, q);
    }
    if (req.query.category) { filters.push('c.slug = ?'); params.push(req.query.category); }
    if (req.query.district) { filters.push('l.district = ?'); params.push(req.query.district); }
    if (req.query.condition) { filters.push('l.condition = ?'); params.push(req.query.condition); }
    if (positiveInt(req.query.min_price)) { filters.push('l.price >= ?'); params.push(Number(req.query.min_price)); }
    if (positiveInt(req.query.max_price)) { filters.push('l.price <= ?'); params.push(Number(req.query.max_price)); }
    const allowedSort = { newest: 'l.created_at DESC', cheapest: 'l.price ASC', expensive: 'l.price DESC', popular: 'l.views DESC' };
    const order = allowedSort[req.query.sort] || allowedSort.newest;
    const where = filters.join(' AND ');
    const items = await query(
      `SELECT l.*, c.name AS category_name, c.slug AS category_slug, u.name AS seller_name, u.phone AS seller_phone,
        ${sellerVerifiedSql} AS seller_verified,
        COALESCE(u.rating_average, l.seller_rating, 0) AS seller_rating,
        COALESCE(u.rating_count, 0) AS seller_review_count,
        (SELECT COUNT(*) FROM comments cm WHERE cm.listing_id = l.id AND cm.status = 'visible') AS comment_count
       FROM listings l JOIN categories c ON c.id = l.category_id LEFT JOIN users u ON u.id = l.seller_id
       WHERE ${where} ORDER BY ${order} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [{ total }] = await query(`SELECT COUNT(*) AS total FROM listings l JOIN categories c ON c.id = l.category_id WHERE ${where}`, params);
    const publicItems = items.map(item => { const safe = { ...item }; delete safe.seller_phone; return safe; });
    ok(res, publicItems, { page, limit, total: Number(total), total_pages: Math.ceil(Number(total) / limit), location: 'Kendari, Sulawesi Tenggara' });
  } catch (error) {
    console.error('[listings-fallback]', error.message);
    ok(res, [], { page: 1, limit: 0, total: 0, total_pages: 0, source: 'degraded', notice: 'Listing sementara belum tersedia. Silakan coba lagi.' });
  }
});

router.get('/listings/:id', async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID listing tidak valid');
    const rows = await query(
      `SELECT l.*, c.name AS category_name, c.slug AS category_slug, u.name AS seller_name, u.phone AS seller_phone,
        ${sellerVerifiedSql} AS seller_verified,
        COALESCE(u.rating_average, l.seller_rating, 0) AS seller_rating,
        COALESCE(u.rating_count, 0) AS seller_review_count,
        (SELECT COUNT(*) FROM comments cm WHERE cm.listing_id = l.id AND cm.status = 'visible') AS comment_count,
        u.district AS seller_district
       FROM listings l JOIN categories c ON c.id = l.category_id LEFT JOIN users u ON u.id = l.seller_id
       WHERE l.id = ? AND l.status = 'active'`,
      [Number(req.params.id)]
    );
    if (!rows.length) return fail(res, 404, 'Listing tidak ditemukan');
    await run('UPDATE listings SET views = views + 1, views_count = COALESCE(views_count, 0) + 1 WHERE id = ?', [Number(req.params.id)]);
    const forwardedIp = String(req.get('x-forwarded-for') || '').split(',')[0].trim();
    const clientIp = /^[0-9a-f:.]+$/i.test(forwardedIp) ? forwardedIp : null;
    await run('INSERT INTO listing_views (listing_id, user_id, ip_address, user_agent) VALUES (?, ?, ?, ?)',
      [Number(req.params.id), req.user?.id || null, clientIp, req.get('user-agent')?.slice(0, 300) || null]);
    const publicListing = {
      ...rows[0],
      seller_rating: Number(rows[0].seller_rating || 0),
      seller_review_count: Number(rows[0].seller_review_count || 0),
      comment_count: Number(rows[0].comment_count || 0),
    };
    delete publicListing.seller_phone;
    ok(res, publicListing);
  } catch (error) { next(error); }
});

router.post('/listings', async (req, res, next) => {
  try {
    const { title, description, price, category_id, condition = 'new', district = 'Kendari' } = req.body || {};
    const errors = [];
    if (!title || title.trim().length < 5 || title.trim().length > 120) errors.push('title wajib 5-120 karakter');
    if (!description || description.trim().length < 10) errors.push('description wajib minimal 10 karakter');
    if (!positiveInt(category_id)) errors.push('category_id wajib berupa ID positif');
    if (!Number.isInteger(Number(price)) || Number(price) < 0) errors.push('price wajib berupa angka >= 0');
    if (!['new', 'second'].includes(condition)) errors.push('condition harus new atau second');
    if (!districts.includes(district)) errors.push('district belum didukung');
    if (errors.length) return fail(res, 422, 'Data listing belum valid', errors);
    if (!req.user) return fail(res, 401, 'Autentikasi diperlukan');
    if (!['seller', 'admin', 'super_admin'].includes(normalizeRole(req.user.role))) return fail(res, 403, 'Akun belum memiliki hak seller');
    const result = await run(
      'INSERT INTO listings (seller_id, category_id, title, description, price, condition, district, city, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, Number(category_id), title.trim(), description.trim(), Number(price), condition, district, 'Kendari', null]
    );
    const [listing] = await query('SELECT * FROM listings WHERE id = ?', [result.id]);
    res.status(201);
    ok(res, listing);
  } catch (error) { next(error); }
});

router.put('/listings/:id', async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID listing tidak valid');
    if (!req.user) return fail(res, 401, 'Autentikasi diperlukan');
    const { title, description, price, category_id, condition = 'new', district = 'Kendari' } = req.body || {};
    if (!title || title.trim().length < 5 || title.trim().length > 120 || !description || description.trim().length < 10
      || !positiveInt(category_id) || !Number.isInteger(Number(price)) || Number(price) < 0
      || !['new', 'second'].includes(condition) || !districts.includes(district)) {
      return fail(res, 422, 'Data listing belum valid');
    }
    const owned = await query('SELECT id FROM listings WHERE id = ? AND seller_id = ?', [Number(req.params.id), Number(req.user.id)]);
    if (!owned.length && !['admin', 'super_admin'].includes(normalizeRole(req.user.role))) return fail(res, 403, 'Akses tidak diizinkan');
    await run(
      'UPDATE listings SET title = ?, description = ?, price = ?, category_id = ?, condition = ?, district = ?, city = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title.trim(), description.trim(), Number(price), Number(category_id), condition, district, 'Kendari', Number(req.params.id)]
    );
    const [listing] = await query('SELECT * FROM listings WHERE id = ?', [Number(req.params.id)]);
    ok(res, listing);
  } catch (error) { next(error); }
});

router.patch('/listings/:id/status', requireAuth, async (req, res, next) => {
  try {
    const status = ['active', 'sold', 'archived'].includes(req.body?.status) ? req.body.status : null;
    if (!status) return fail(res, 422, 'Status listing tidak valid');
    const [owned] = await query('SELECT id FROM listings WHERE id = ? AND (seller_id = ? OR ? = \'admin\')',
      [Number(req.params.id), currentUser(req), req.user.role]);
    if (!owned) return fail(res, 403, 'Akses tidak diizinkan');
    await run('UPDATE listings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, Number(req.params.id)]);
    ok(res, { id: Number(req.params.id), status });
  } catch (error) { next(error); }
});

router.post('/listings/:id/promote', requireAuth, async (req, res, next) => {
  try {
    const [owned] = await query('SELECT id FROM listings WHERE id = ? AND (seller_id = ? OR ? = \'admin\')',
      [Number(req.params.id), currentUser(req), req.user.role]);
    if (!owned) return fail(res, 403, 'Akses tidak diizinkan');
    await run("UPDATE listings SET is_promoted = TRUE, promoted_until = (CURRENT_TIMESTAMP + interval '7 days'), updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'active'", [Number(req.params.id)]);
    ok(res, { id: Number(req.params.id), is_promoted: true, duration_days: 7, message: 'Promosi beta aktif selama 7 hari.' });
  } catch (error) { next(error); }
});

router.delete('/listings/:id', async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID listing tidak valid');
    if (!req.user) return fail(res, 401, 'Autentikasi diperlukan');
    const owned = await query('SELECT id FROM listings WHERE id = ? AND seller_id = ?', [Number(req.params.id), Number(req.user.id)]);
    if (!owned.length && !['admin', 'super_admin'].includes(normalizeRole(req.user.role))) return fail(res, 403, 'Akses tidak diizinkan');
    await run("UPDATE listings SET status = 'archived' WHERE id = ?", [Number(req.params.id)]);
    ok(res, { id: Number(req.params.id), status: 'archived' });
  } catch (error) { next(error); }
});

router.post('/favorites', async (req, res, next) => {
  try {
    const { user_id, listing_id } = req.body || {};
    if (!positiveInt(user_id) || !positiveInt(listing_id)) return fail(res, 422, 'user_id dan listing_id wajib berupa ID positif');
    if (!req.user) return fail(res, 401, 'Autentikasi diperlukan');
    if (Number(req.user.id) !== Number(user_id)) return fail(res, 403, 'Identitas user tidak sesuai session');
    const listing = await query("SELECT id FROM listings WHERE id = ? AND status = 'active'", [Number(listing_id)]);
    if (!listing.length) return fail(res, 404, 'Listing tidak ditemukan');
    const inserted = await run('INSERT INTO favorites (user_id, listing_id) VALUES (?, ?) ON CONFLICT (user_id, listing_id) DO NOTHING',
      [Number(req.user.id), Number(listing_id)]);
    await run('UPDATE listings SET favorites_count = (SELECT COUNT(*) FROM favorites WHERE listing_id = ?) WHERE id = ?',
      [Number(listing_id), Number(listing_id)]);
    ok(res, { user_id: Number(req.user.id), listing_id: Number(listing_id), favorited: true, changed: Boolean(inserted.rowCount) });
  } catch (error) { next(error); }
});

router.delete('/favorites', async (req, res, next) => {
  try {
    const { user_id, listing_id } = req.body || {};
    if (!positiveInt(user_id) || !positiveInt(listing_id)) return fail(res, 422, 'user_id dan listing_id wajib diisi');
    if (!req.user) return fail(res, 401, 'Autentikasi diperlukan');
    if (Number(req.user.id) !== Number(user_id)) return fail(res, 403, 'Identitas user tidak sesuai session');
    await run('DELETE FROM favorites WHERE user_id = ? AND listing_id = ?', [Number(req.user.id), Number(listing_id)]);
    await run('UPDATE listings SET favorites_count = (SELECT COUNT(*) FROM favorites WHERE listing_id = ?) WHERE id = ?',
      [Number(listing_id), Number(listing_id)]);
    ok(res, { user_id: Number(req.user.id), listing_id: Number(listing_id), favorited: false });
  } catch (error) { next(error); }
});

router.get('/listings/:id/comments', async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID listing tidak valid');
    ok(res, await query(
      "SELECT id, listing_id, author_name, body, created_at FROM comments WHERE listing_id = ? AND status = 'visible' ORDER BY created_at DESC",
      [Number(req.params.id)]
    ));
  } catch (error) { next(error); }
});

router.post('/comments', async (req, res, next) => {
  try {
    const { listing_id, user_id = null, author_name, body } = req.body || {};
    if (!positiveInt(listing_id) || !author_name || author_name.trim().length < 2 || !body || body.trim().length < 3 || body.trim().length > 1000) {
      return fail(res, 422, 'listing_id, author_name, dan body komentar belum valid');
    }
    if (!req.user) return fail(res, 401, 'Autentikasi diperlukan');
    if (user_id && Number(req.user.id) !== Number(user_id)) return fail(res, 403, 'Identitas user tidak sesuai session');
    const listing = await query('SELECT id FROM listings WHERE id = ?', [Number(listing_id)]);
    if (!listing.length) return fail(res, 404, 'Listing tidak ditemukan');
    const result = await run('INSERT INTO comments (listing_id, user_id, author_name, body) VALUES (?, ?, ?, ?)',
      [Number(listing_id), req.user.id, req.user.name || author_name.trim(), body.trim()]);
    const [comment] = await query('SELECT id, listing_id, author_name, body, status, created_at FROM comments WHERE id = ?', [result.id]);
    const [seller] = await query(
      'SELECT u.name AS seller_name, u.phone AS seller_phone, l.title AS listing_title FROM listings l LEFT JOIN users u ON u.id = l.seller_id WHERE l.id = ?',
      [Number(listing_id)]
    );
    if (seller?.seller_phone) {
      void notifySellerWhatsApp({
        phone: seller.seller_phone, sellerName: seller.seller_name, listingTitle: seller.listing_title,
        senderName: comment.author_name, message: comment.body,
      });
    }
    res.status(201);
    ok(res, comment);
  } catch (error) { next(error); }
});

router.post('/suggestions', async (req, res, next) => {
  try {
    const { user_id = null, name, email = null, body } = req.body || {};
    if (!name || name.trim().length < 2 || !body || body.trim().length < 5 || body.trim().length > 2000) {
      return fail(res, 422, 'name dan body saran belum valid');
    }
    if (user_id && (!req.user || Number(req.user.id) !== Number(user_id))) return fail(res, 403, 'Identitas user tidak sesuai session');
    const actorUserId = req.user?.id || null;
    const result = await run('INSERT INTO suggestions (user_id, name, email, body) VALUES (?, ?, ?, ?)',
      [actorUserId, req.user?.name || name.trim(), email, body.trim()]);
    res.status(201);
    ok(res, { id: result.id, message: 'Saran berhasil diterima dan akan ditinjau tim SultraKita.' });
  } catch (error) { next(error); }
});

router.post('/reports', async (req, res, next) => {
  try {
    const { listing_id, reporter_name, reason } = req.body || {};
    if (!positiveInt(listing_id) || !reporter_name || reporter_name.trim().length < 2 || !reason || reason.trim().length < 5) {
      return fail(res, 422, 'Data laporan belum valid');
    }
    if (!req.user) return fail(res, 401, 'Autentikasi diperlukan');
    const listing = await query('SELECT id FROM listings WHERE id = ?', [Number(listing_id)]);
    if (!listing.length) return fail(res, 404, 'Listing tidak ditemukan');
    const result = await run('INSERT INTO reports (listing_id, reporter_name, reason) VALUES (?, ?, ?)',
      [Number(listing_id), req.user.name || reporter_name.trim(), reason.trim()]);
    res.status(201);
    ok(res, { id: result.id, message: 'Laporan diterima untuk moderasi.' });
  } catch (error) { next(error); }
});

router.post('/search-history', async (req, res, next) => {
  try {
    const term = safeText(req.body?.query, 160);
    const resultsCount = Math.max(0, Math.min(1000000, Number(req.body?.results_count || 0)));
    if (term.length < 2) return fail(res, 422, 'Query pencarian minimal 2 karakter');
    if (!req.user) return ok(res, { stored: false, scope: 'local', message: 'Riwayat anonim disimpan di perangkat.' });
    await run('INSERT INTO search_history (user_id, query, results_count) VALUES (?, ?, ?)',
      [currentUser(req), term, Number.isSafeInteger(resultsCount) ? resultsCount : 0]);
    ok(res, { stored: true, scope: 'account', query: term });
  } catch (error) { next(error); }
});

router.get('/search-history', requireAuth, async (req, res, next) => {
  try {
    ok(res, await query('SELECT id, query, results_count, created_at FROM search_history WHERE user_id = ? ORDER BY id DESC LIMIT 20', [currentUser(req)]));
  } catch (error) { next(error); }
});

router.delete('/search-history', requireAuth, async (req, res, next) => {
  try {
    await run('DELETE FROM search_history WHERE user_id = ?', [currentUser(req)]);
    ok(res, { deleted: true });
  } catch (error) { next(error); }
});

router.get('/community/summary', async (_req, res, next) => {
  try {
    const [comments] = await query("SELECT COUNT(*) AS total FROM comments WHERE status = 'visible'");
    const [suggestions] = await query('SELECT COUNT(*) AS total FROM suggestions');
    const [supporters] = await query("SELECT COUNT(*) AS total FROM donations WHERE status != 'cancelled'");
    ok(res, { comments: Number(comments.total), suggestions: Number(suggestions.total), supporters: Number(supporters.total) });
  } catch (error) { next(error); }
});

module.exports = router;

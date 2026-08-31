'use strict';

const express = require('express');
const crypto = require('node:crypto');
const { query, run, withTransaction } = require('../database');
const { requireAuth } = require('../auth');

const router = express.Router();

const ok = (res, data, meta) => res.json({ success: true, data, ...(meta ? { meta } : {}) });
const fail = (res, status, message, details) => res.status(status).json({ success: false, error: message, ...(details ? { details } : {}) });
const positiveInt = value => Number.isInteger(Number(value)) && Number(value) > 0;
const text = (value, max) => String(value ?? '').trim().slice(0, max);
const boundedLimit = value => Math.min(50, Math.max(1, Number(value) || 20));
const pageValue = value => Math.min(1000, Math.max(1, Number(value) || 1));
const pageOffset = (page, limit) => (page - 1) * limit;
const inviteCode = () => crypto.randomBytes(9).toString('base64url');

function userId(req) {
  return Number(req.user?.id);
}

function parseJson(value) {
  if (value && typeof value === 'object') return value;
  try { return JSON.parse(value || '{}'); } catch { return {}; }
}

async function awardPoints(targetUserId, amount, reason, referenceType, referenceId) {
  if (!positiveInt(targetUserId) || !Number.isInteger(amount) || amount === 0) return null;
  try {
    const [row] = await query('SELECT * FROM award_sultrakita_points(?, ?, ?, ?, ?)', [targetUserId, amount, reason, referenceType || null, referenceId == null ? null : String(referenceId)]);
    if (row) await refreshBadges(targetUserId, Number(row.total_points || 0));
    return row || null;
  } catch (error) {
    if (error.code !== '42P01' && error.code !== '42883') console.warn('[v2-points-degraded]', error.message);
    return null;
  }
}

async function refreshBadges(targetUserId, totalPoints) {
  try {
    const badges = await query('SELECT id, criteria_points FROM badges WHERE criteria_points <= ? ORDER BY criteria_points ASC', [totalPoints]);
    for (const badge of badges) {
      await run('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?) ON CONFLICT (user_id, badge_id) DO NOTHING', [targetUserId, badge.id]);
    }
  } catch (error) {
    if (error.code !== '42P01') console.warn('[v2-badges-degraded]', error.message);
  }
}

async function collectionAccess(collectionId, targetUserId, write = false) {
  const [collection] = await query('SELECT id, owner_id, name, description, is_shared, invite_code, created_at, updated_at FROM collections WHERE id = ?', [collectionId]);
  if (!collection) return { collection: null, allowed: false };
  const owner = Number(collection.owner_id) === Number(targetUserId);
  return { collection, owner, allowed: owner || (!write && Boolean(collection.is_shared)) || (write && Boolean(collection.is_shared) && positiveInt(targetUserId)) };
}

async function collectionPayload(collection) {
  const [items, counts] = await Promise.all([
    query(`SELECT ci.id, ci.listing_id, ci.added_by, ci.note, ci.created_at,
                  l.title, l.price, l.district, l.image_url, l.status,
                  c.name AS category_name, c.slug AS category_slug,
                  COALESCE((SELECT COUNT(*) FROM collection_item_votes civ WHERE civ.collection_item_id = ci.id), 0) AS vote_count
           FROM collection_items ci
           JOIN listings l ON l.id = ci.listing_id
           LEFT JOIN categories c ON c.id = l.category_id
           WHERE ci.collection_id = ?
           ORDER BY ci.created_at DESC
           LIMIT 100`, [collection.id]),
    query('SELECT COUNT(*) AS total FROM collection_items WHERE collection_id = ?', [collection.id]),
  ]);
  return { ...collection, is_shared: Boolean(collection.is_shared), item_count: Number(counts[0]?.total || 0), items };
}

// GET /api/v2/discovery/search?q=&district=&category=&sort=&page=&limit=
router.get('/discovery/search', async (req, res, next) => {
  try {
    const q = text(req.query.q, 160);
    const district = text(req.query.district, 80);
    const category = text(req.query.category, 80).toLowerCase();
    const sort = ['newest', 'cheapest', 'expensive', 'relevant'].includes(String(req.query.sort)) ? String(req.query.sort) : 'relevant';
    const limit = boundedLimit(req.query.limit);
    const page = pageValue(req.query.page);
    const params = [];
    const clauses = ["l.status = 'active'"];
    if (q) {
      clauses.push("(to_tsvector('simple', coalesce(l.title, '') || ' ' || coalesce(l.description, '')) @@ plainto_tsquery('simple', ?) OR l.title ILIKE ? OR l.description ILIKE ?)");
      params.push(q, `%${q}%`, `%${q}%`);
    }
    if (district) { clauses.push('lower(l.district) = lower(?)'); params.push(district); }
    if (category) { clauses.push('lower(c.slug) = lower(?)'); params.push(category); }
    if (req.query.min_price !== undefined && Number.isFinite(Number(req.query.min_price))) { clauses.push('l.price >= ?'); params.push(Math.max(0, Number(req.query.min_price))); }
    if (req.query.max_price !== undefined && Number.isFinite(Number(req.query.max_price))) { clauses.push('l.price <= ?'); params.push(Math.max(0, Number(req.query.max_price))); }
    const where = clauses.join(' AND ');
    const order = sort === 'cheapest'
      ? 'l.price ASC, l.created_at DESC'
      : sort === 'expensive'
        ? 'l.price DESC, l.created_at DESC'
        : sort === 'newest'
          ? 'l.created_at DESC'
          : "CASE WHEN ? <> '' THEN ts_rank_cd(to_tsvector('simple', coalesce(l.title, '') || ' ' || coalesce(l.description, '')), plainto_tsquery('simple', ?)) ELSE 0 END DESC, COALESCE(l.is_promoted, false) DESC, COALESCE(l.is_featured, false) DESC, l.created_at DESC";
    const itemParams = [...params];
    if (sort === 'relevant') itemParams.push(q, q);
    itemParams.push(limit, pageOffset(page, limit));
    const items = await query(`SELECT l.id, l.title, l.description, l.price, l.condition, l.status, l.district, l.city,
                                      l.image_url, l.created_at, l.updated_at, COALESCE(l.views_count, l.views, 0) AS views_count,
                                      COALESCE(l.favorites_count, 0) AS favorites_count, c.name AS category_name, c.slug AS category_slug,
                                      u.id AS seller_id, u.name AS seller_name, u.rating_average AS seller_rating,
                                      CASE WHEN COALESCE(u.verification_status, 'unverified') = 'approved' OR LOWER(COALESCE(u.is_verified::text, 'false')) IN ('1', 'true', 't', 'yes', 'y') THEN 1 ELSE 0 END AS seller_verified
                               FROM listings l JOIN categories c ON c.id = l.category_id LEFT JOIN users u ON u.id = l.seller_id
                               WHERE ${where} ORDER BY ${order} LIMIT ? OFFSET ?`, itemParams);
    const [{ total }] = await query(`SELECT COUNT(*) AS total FROM listings l JOIN categories c ON c.id = l.category_id WHERE ${where}`, params);
    const totalNumber = Number(total || 0);
    ok(res, items, { page, limit, total: totalNumber, total_pages: Math.ceil(totalNumber / limit), query: q, district: district || null, category: category || null, engine: 'postgres-full-text-hyperlocal' });
  } catch (error) { next(error); }
});

router.get('/discovery/recommendations', async (req, res, next) => {
  try {
    const district = text(req.query.district || req.user?.district, 80);
    const limit = boundedLimit(req.query.limit);
    const params = [];
    const locality = district ? 'AND lower(l.district) = lower(?)' : '';
    if (district) params.push(district);
    params.push(limit);
    const items = await query(`SELECT l.id, l.title, l.description, l.price, l.district, l.city, l.image_url, l.created_at,
                                      c.name AS category_name, c.slug AS category_slug, u.name AS seller_name,
                                      COALESCE(l.is_promoted, false) AS is_promoted
                               FROM listings l JOIN categories c ON c.id = l.category_id LEFT JOIN users u ON u.id = l.seller_id
                               WHERE l.status = 'active' ${locality}
                               ORDER BY COALESCE(l.is_promoted, false) DESC, COALESCE(l.is_featured, false) DESC, l.created_at DESC
                               LIMIT ?`, params);
    ok(res, items, { district: district || null, personalized: Boolean(req.user), engine: 'hyperlocal-fallback' });
  } catch (error) { next(error); }
});

router.get('/discovery/price-insights', async (req, res, next) => {
  try {
    const category = text(req.query.category, 80).toLowerCase();
    const district = text(req.query.district, 80);
    const clauses = ["l.status = 'active'", 'l.price > 0'];
    const params = [];
    if (category) { clauses.push('lower(c.slug) = lower(?)'); params.push(category); }
    if (district) { clauses.push('lower(l.district) = lower(?)'); params.push(district); }
    const [row] = await query(`SELECT COUNT(*) AS sample_size, ROUND(AVG(l.price)) AS average_price,
                                      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY l.price) AS median_price,
                                      MIN(l.price) AS min_price, MAX(l.price) AS max_price
                               FROM listings l JOIN categories c ON c.id = l.category_id WHERE ${clauses.join(' AND ')}`, params);
    ok(res, { sample_size: Number(row?.sample_size || 0), average_price: Number(row?.average_price || 0), median_price: Number(row?.median_price || 0), min_price: Number(row?.min_price || 0), max_price: Number(row?.max_price || 0), category: category || null, district: district || null }, { disclaimer: 'Statistik indikatif dari listing aktif; bukan penilaian appraisal.' });
  } catch (error) { next(error); }
});

router.get('/collections', requireAuth, async (req, res, next) => {
  try {
    const rows = await query(`SELECT c.id, c.owner_id, c.name, c.description, c.is_shared, c.invite_code, c.created_at, c.updated_at,
                                     COUNT(ci.id)::integer AS item_count
                              FROM collections c LEFT JOIN collection_items ci ON ci.collection_id = c.id
                              WHERE c.owner_id = ? GROUP BY c.id ORDER BY c.updated_at DESC LIMIT 50`, [userId(req)]);
    ok(res, rows.map(row => ({ ...row, is_shared: Boolean(row.is_shared), item_count: Number(row.item_count || 0) })));
  } catch (error) { next(error); }
});

router.post('/collections', requireAuth, async (req, res, next) => {
  try {
    const name = text(req.body?.name, 120);
    const description = text(req.body?.description, 500) || null;
    if (name.length < 1) return fail(res, 422, 'Nama koleksi wajib diisi');
    const shared = Boolean(req.body?.is_shared);
    const result = await run('INSERT INTO collections (owner_id, name, description, is_shared, invite_code) VALUES (?, ?, ?, ?, ?)', [userId(req), name, description, shared, shared ? inviteCode() : null]);
    const [collection] = await query('SELECT id, owner_id, name, description, is_shared, invite_code, created_at, updated_at FROM collections WHERE id = ?', [result.id]);
    await awardPoints(userId(req), 5, 'Membuat koleksi listing', 'collection', result.id);
    res.status(201); ok(res, { ...collection, is_shared: Boolean(collection.is_shared), item_count: 0 });
  } catch (error) { next(error); }
});

router.get('/collections/:id', async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID koleksi tidak valid');
    const access = await collectionAccess(Number(req.params.id), req.user?.id, false);
    if (!access.collection) return fail(res, 404, 'Koleksi tidak ditemukan');
    if (!access.allowed) return fail(res, 403, 'Koleksi ini bersifat privat');
    ok(res, await collectionPayload(access.collection));
  } catch (error) { next(error); }
});

router.post('/collections/:id/invite', requireAuth, async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID koleksi tidak valid');
    const [collection] = await query('SELECT id, owner_id, name, is_shared, invite_code FROM collections WHERE id = ?', [Number(req.params.id)]);
    if (!collection) return fail(res, 404, 'Koleksi tidak ditemukan');
    if (Number(collection.owner_id) !== userId(req)) return fail(res, 403, 'Hanya pemilik yang dapat membuat undangan');
    const code = collection.invite_code || inviteCode();
    await run('UPDATE collections SET is_shared = true, invite_code = ?, updated_at = now() WHERE id = ?', [code, collection.id]);
    ok(res, { collection_id: collection.id, invite_code: code, invite_url: `/koleksi/${collection.id}?invite=${encodeURIComponent(code)}`, is_shared: true });
  } catch (error) { next(error); }
});

router.post('/collections/:id/items', requireAuth, async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id) || !positiveInt(req.body?.listing_id)) return fail(res, 422, 'ID koleksi dan listing wajib valid');
    const collectionId = Number(req.params.id);
    const listingId = Number(req.body.listing_id);
    const access = await collectionAccess(collectionId, userId(req), true);
    if (!access.collection || !access.allowed) return fail(res, access.collection ? 403 : 404, access.collection ? 'Tidak dapat menambah ke koleksi ini' : 'Koleksi tidak ditemukan');
    const [listing] = await query("SELECT id, title FROM listings WHERE id = ? AND status = 'active'", [listingId]);
    if (!listing) return fail(res, 404, 'Listing aktif tidak ditemukan');
    const note = text(req.body?.note, 500) || null;
    const result = await run('INSERT INTO collection_items (collection_id, listing_id, added_by, note) VALUES (?, ?, ?, ?) ON CONFLICT (collection_id, listing_id) DO UPDATE SET note = EXCLUDED.note', [collectionId, listingId, userId(req), note]);
    await run('UPDATE collections SET updated_at = now() WHERE id = ?', [collectionId]);
    if (result.rowCount) await awardPoints(userId(req), 2, 'Menambahkan listing ke koleksi', 'collection_item', result.id || `${collectionId}:${listingId}`);
    const [item] = await query('SELECT id, collection_id, listing_id, added_by, note, created_at FROM collection_items WHERE collection_id = ? AND listing_id = ?', [collectionId, listingId]);
    res.status(201); ok(res, item);
  } catch (error) { next(error); }
});

router.delete('/collections/:id/items/:listingId', requireAuth, async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id) || !positiveInt(req.params.listingId)) return fail(res, 400, 'ID koleksi atau listing tidak valid');
    const [collection] = await query('SELECT owner_id FROM collections WHERE id = ?', [Number(req.params.id)]);
    if (!collection) return fail(res, 404, 'Koleksi tidak ditemukan');
    if (Number(collection.owner_id) !== userId(req)) return fail(res, 403, 'Hanya pemilik yang dapat menghapus item');
    await run('DELETE FROM collection_items WHERE collection_id = ? AND listing_id = ?', [Number(req.params.id), Number(req.params.listingId)]);
    await run('UPDATE collections SET updated_at = now() WHERE id = ?', [Number(req.params.id)]);
    ok(res, { deleted: true, collection_id: Number(req.params.id), listing_id: Number(req.params.listingId) });
  } catch (error) { next(error); }
});

router.post('/collections/:id/items/:itemId/vote', requireAuth, async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id) || !positiveInt(req.params.itemId)) return fail(res, 400, 'ID koleksi atau item tidak valid');
    const access = await collectionAccess(Number(req.params.id), userId(req), false);
    if (!access.collection || !access.allowed) return fail(res, access.collection ? 403 : 404, access.collection ? 'Koleksi ini bersifat privat' : 'Koleksi tidak ditemukan');
    const [item] = await query('SELECT id FROM collection_items WHERE id = ? AND collection_id = ?', [Number(req.params.itemId), Number(req.params.id)]);
    if (!item) return fail(res, 404, 'Item koleksi tidak ditemukan');
    const result = await run('INSERT INTO collection_item_votes (collection_item_id, user_id) VALUES (?, ?) ON CONFLICT (collection_item_id, user_id) DO NOTHING', [item.id, userId(req)]);
    if (result.rowCount) await awardPoints(userId(req), 1, 'Memberi suara pada koleksi bersama', 'collection_vote', item.id);
    const [votes] = await query('SELECT COUNT(*) AS total FROM collection_item_votes WHERE collection_item_id = ?', [item.id]);
    ok(res, { collection_id: Number(req.params.id), item_id: item.id, voted: true, vote_count: Number(votes.total || 0) });
  } catch (error) { next(error); }
});

router.get('/gamification/me', requireAuth, async (req, res, next) => {
  try {
    const [points] = await query('SELECT user_id, total_points, lifetime_points, updated_at FROM user_points WHERE user_id = ?', [userId(req)]);
    const [badges, transactions] = await Promise.all([
      query(`SELECT b.badge_key, b.name, b.description, b.icon, ub.earned_at
             FROM user_badges ub JOIN badges b ON b.id = ub.badge_id WHERE ub.user_id = ? ORDER BY b.criteria_points ASC`, [userId(req)]),
      query('SELECT amount, reason, reference_type, reference_id, created_at FROM point_transactions WHERE user_id = ? ORDER BY id DESC LIMIT 10', [userId(req)]),
    ]);
    ok(res, { points: { total_points: Number(points?.total_points || 0), lifetime_points: Number(points?.lifetime_points || 0), updated_at: points?.updated_at || null }, badges, recent_transactions: transactions });
  } catch (error) { next(error); }
});

router.get('/gamification/leaderboard', async (req, res, next) => {
  try {
    const district = text(req.query.district, 80);
    const category = text(req.query.category, 80).toLowerCase();
    const limit = boundedLimit(req.query.limit);
    const params = [];
    const clauses = [];
    if (district) { clauses.push('lower(u.district) = lower(?)'); params.push(district); }
    if (category) { clauses.push("EXISTS (SELECT 1 FROM listings lx JOIN categories cx ON cx.id = lx.category_id WHERE lx.seller_id = u.id AND lx.status = 'active' AND lower(cx.slug) = lower(?))"); params.push(category); }
    params.push(limit);
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const rows = await query(`SELECT ROW_NUMBER() OVER (ORDER BY COALESCE(up.total_points, 0) DESC, u.id ASC)::integer AS rank,
                                     u.id AS user_id, u.name, u.district, COALESCE(up.total_points, 0)::integer AS total_points,
                                     COALESCE(up.lifetime_points, 0)::integer AS lifetime_points
                              FROM users u LEFT JOIN user_points up ON up.user_id = u.id ${where}
                              ORDER BY total_points DESC, u.id ASC LIMIT ?`, params);
    ok(res, rows, { district: district || null, category: category || null });
  } catch (error) { next(error); }
});

router.post('/safety/reports', requireAuth, async (req, res, next) => {
  try {
    const listingId = positiveInt(req.body?.listing_id) ? Number(req.body.listing_id) : null;
    const reason = text(req.body?.reason, 500);
    if (!reason || reason.length < 5) return fail(res, 422, 'Alasan laporan minimal 5 karakter');
    if (listingId) {
      const [listing] = await query('SELECT id FROM listings WHERE id = ?', [listingId]);
      if (!listing) return fail(res, 404, 'Listing tidak ditemukan');
    }
    const result = await run('INSERT INTO reports (listing_id, reporter_name, reason) VALUES (?, ?, ?)', [listingId, text(req.user.name, 120) || 'Warga Sultra', reason]);
    ok(res, { id: result.id, status: 'open', message: 'Laporan diterima untuk ditinjau moderator.' });
  } catch (error) { next(error); }
});

router.get('/health', async (_req, res) => ok(res, { api: 'v2', status: 'ok', capabilities: ['discovery', 'collections', 'gamification', 'safety-reports'] }));

module.exports = router;

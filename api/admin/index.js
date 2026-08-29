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
const crypto = require('node:crypto');
const { query, run, withTransaction } = require('../../database');
const { CATEGORIES, ALL_DISTRICTS } = require('../../shared/taxonomy');
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
const PRODUCT_HOSTS = new Set(['facebook.com', 'www.facebook.com', 'm.facebook.com', 'tokopedia.com', 'www.tokopedia.com', 'shopee.co.id', 'www.shopee.co.id', 'id.shp.ee', 'shp.ee', 'olx.co.id', 'www.olx.co.id']);
// Production categories use a stable database taxonomy that differs from the legacy UI taxonomy IDs.
const PRODUCT_CATEGORY_IDS = Object.freeze({ properti: 1, elektronik: 2, kendaraan: 3, fashion: 4, perabotan: 5, jasa: 6, kuliner: 7, 'hobi-koleksi': 8, 'lowongan-kerja': 9, lainnya: 10 });
const PRODUCT_CATEGORY_ALIASES = Object.freeze({ 'rumah-tangga': 'perabotan', hobi: 'hobi-koleksi', lowongan: 'lowongan-kerja', gratis: 'lainnya' });
const categoryIdForSlug = slug => PRODUCT_CATEGORY_IDS[PRODUCT_CATEGORY_ALIASES[slug] || slug] || PRODUCT_CATEGORY_IDS.lainnya;
const decodeHtml = value => String(value || '').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#039;/gi, "'").replace(/&#x27;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code))).replace(/\\s+/g, ' ').trim();
const metaValue = (source, key) => { const pattern = new RegExp(`<meta[^>]+(?:property|name)=["']${key.replace(':', '\\\\:')}["'][^>]*>`, 'i'); const tag = source.match(pattern)?.[0] || ''; return decodeHtml(tag.match(/content=["']([^"']*)["']/i)?.[1] || ''); };
const productHost = hostname => { const host = String(hostname || '').toLowerCase(); return [...PRODUCT_HOSTS].some(domain => host === domain || host.endsWith(`.${domain}`)); };
const sourcePlatform = hostname => { const host = String(hostname || '').toLowerCase(); if (host.includes('facebook')) return 'Facebook Marketplace'; if (host.includes('tokopedia')) return 'Tokopedia'; if (host.includes('shopee') || host.endsWith('.shp.ee') || host === 'shp.ee') return 'Shopee'; if (host.includes('olx')) return 'OLX'; return host.replace(/^www\\./, ''); };
const sourceUrl = raw => { let parsed; try { parsed = new URL(String(raw || '').trim()); } catch { throw Object.assign(new Error('Tautan produk tidak valid.'), { statusCode: 422, code: 'PRODUCT_URL_INVALID' }); } if (parsed.protocol !== 'https:' || !productHost(parsed.hostname)) throw Object.assign(new Error('Gunakan tautan HTTPS Facebook, Tokopedia, OLX, atau Shopee.'), { statusCode: 422, code: 'PRODUCT_URL_NOT_ALLOWED' }); return parsed; };
const jsonLdImages = source => { const images = []; for (const block of source.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) { try { const data = JSON.parse(block[1]); const visit = value => { if (!value || images.length >= 8) return; if (typeof value === 'string' && /^https:\/\//i.test(value)) images.push(value); else if (Array.isArray(value)) value.forEach(visit); else if (typeof value === 'object') Object.values(value).forEach(visit); }; visit(data?.image); } catch { /* malformed structured data is ignored */ } } return images; };
const productPathTitle = parsed => decodeURIComponent(parsed.pathname.split('/').filter(Boolean).pop() || parsed.hostname).replace(/[-_]+/g, ' ').replace(/\\b\\w/g, letter => letter.toUpperCase()).slice(0, 160);
const fetchProductResponse = async (rawUrl, signal) => { let current = new URL(rawUrl); for (let attempt = 0; attempt < 4; attempt += 1) { const response = await fetch(current.href, { headers: { accept: 'text/html,application/xhtml+xml', 'user-agent': 'SultraKitaAdminMetadata/1.0 (+https://sultrakita-platform.vercel.app)' }, redirect: 'manual', signal }); if (![301, 302, 303, 307, 308].includes(response.status)) return response; const location = response.headers.get('location'); if (!location) return response; const next = new URL(location, current); if (next.protocol !== 'https:' || !productHost(next.hostname)) return new Response(null, { status: 400 }); current = next; } return new Response(null, { status: 508 }); };
const fetchProductMetadata = async raw => { const parsed = sourceUrl(raw); const platform = sourcePlatform(parsed.hostname); const fallback = { source_url: parsed.href, source_platform: platform, source_title: productPathTitle(parsed), source_description: '', image_urls: [], price: 0, metadata_note: 'Sumber tidak menyediakan metadata publik yang dapat dibaca; lengkapi draft secara manual.' }; const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 8000); try { const response = await fetchProductResponse(parsed.href, controller.signal); if (!response.ok || (response.status >= 300 && response.status < 400)) return { ...fallback, metadata_note: `Metadata sumber tidak dapat dibaca (HTTP ${response.status}); gunakan tautan sebagai referensi dan lengkapi data sebelum publikasi.` }; const source = (await response.text()).slice(0, 1_500_000); const imageUrls = [...new Set([metaValue(source, 'og:image'), metaValue(source, 'og:image:url'), metaValue(source, 'twitter:image'), ...jsonLdImages(source)].filter(image => /^https:\/\//i.test(image)))].slice(0, 5); const amount = Number(metaValue(source, 'product:price:amount').replace(/[^0-9.]/g, '')); return { source_url: parsed.href, source_platform: platform, source_title: text(metaValue(source, 'og:title') || metaValue(source, 'twitter:title') || source.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || fallback.source_title, 180), source_description: text(metaValue(source, 'og:description') || metaValue(source, 'description') || '', 1500), image_urls: imageUrls, price: Number.isSafeInteger(amount) && amount >= 0 ? amount : 0, metadata_note: imageUrls.length ? 'Metadata publik berhasil dibaca. Pastikan foto memiliki izin penggunaan sebelum publikasi.' : 'Metadata terbaca, tetapi sumber tidak menyediakan foto publik; unggah foto berizin atau lengkapi manual.' };   } catch (error) {
    const reason = error?.name === 'AbortError' ? 'timeout' : 'sumber tidak merespons';
    return { ...fallback, metadata_note: `Metadata sumber tidak dapat dibaca (${reason}); gunakan tautan sebagai referensi dan lengkapi draft secara manual.` };
  } finally { clearTimeout(timer); } };
const inferCategoryId = value => { const haystack = String(value || '').toLowerCase(); const rules = [['elektronik', /handphone|smartphone|iphone|samsung|laptop|tablet|kamera|monitor|elektronik/], ['kendaraan', /mobil|motor|sepeda|avanza|yamaha|honda|kendaraan/], ['properti', /rumah|tanah|apartemen|kos|ruko|properti/], ['fashion', /baju|sepatu|tas|fashion|jaket|dress/], ['rumah-tangga', /sofa|meja|kursi|lemari|furniture|perabot/], ['hobi', /ikan|kucing|game|olahraga|hobi/], ['kuliner', /makanan|minuman|kue|kuliner/], ['jasa', /jasa|service|les|tukang|freelance/], ['hasil-laut', /ikan laut|udang|kepiting|hasil laut/], ['pertanian', /bibit|pupuk|sayur|pertanian|perkebunan/]]; const slug = rules.find(([, pattern]) => pattern.test(haystack))?.[0] || 'lainnya'; return categoryIdForSlug(slug); };
const localProductDraft = (metadata, input = {}) => { const title = text(input.title || metadata.source_title || 'Produk pilihan SultraKita', 120); const sourceDescription = text(input.description || metadata.source_description, 1500); const description = text(sourceDescription ? `${sourceDescription}\\n\\nProduk ini dikurasi admin SultraKita dari ${metadata.source_platform}. Periksa kondisi, varian, stok, lokasi, dan metode pengiriman sebelum dipublikasikan.` : `Produk ini dikurasi admin SultraKita dari ${metadata.source_platform}. Lengkapi kondisi, varian, stok, lokasi, dan metode pengiriman sebelum dipublikasikan.`, 2000); const categoryId = positiveId(input.category_id) ? Number(input.category_id) : inferCategoryId(`${title} ${sourceDescription}`); const district = ALL_DISTRICTS.includes(text(input.district, 80)) ? text(input.district, 80) : 'Kendari'; const condition = ['new', 'second'].includes(input.condition) ? input.condition : 'new'; const price = Number.isSafeInteger(Number(input.price)) && Number(input.price) >= 0 ? Number(input.price) : Number(metadata.price || 0); return { ...metadata, draft_title: title, draft_description: description, price, category_id: categoryId, condition, district, ai_source: 'local_rules', status: 'draft' }; };
const serializeImportDraft = row => ({ ...row, image_urls: Array.isArray(row.image_urls) ? row.image_urls : [], price: Number(row.price || 0), category_id: Number(row.category_id || 0) });

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

router.get('/listing-imports', ...guarded('manage_listings'), async (req, res, next) => {
  try {
    const status = ['draft', 'published', 'discarded'].includes(text(req.query.status, 20)) ? text(req.query.status, 20) : 'draft';
    const limit = boundedInt(req.query.limit, 30, 1, 100);
    const rows = await query('SELECT id, source_url, source_platform, source_title, image_urls, draft_title, draft_description, price, category_id, condition, district, status, published_listing_id, created_at, updated_at FROM admin_listing_import_drafts WHERE admin_id = ? AND status = ? ORDER BY updated_at DESC LIMIT ?', [req.user.id, status, limit]);
    ok(res, rows.map(serializeImportDraft));
  } catch (error) { next(error); }
});

router.post('/listing-imports/preview', ...guarded('manage_listings'), async (req, res, next) => {
  try {
    const metadata = await fetchProductMetadata(req.body?.source_url || req.body?.url);
    const draft = localProductDraft(metadata, req.body || {});
    let existing = (await query('SELECT id FROM admin_listing_import_drafts WHERE admin_id = ? AND source_url = ? AND status = \'draft\' ORDER BY id DESC LIMIT 1', [req.user.id, draft.source_url]))[0];
    if (existing) {
      await query(`UPDATE admin_listing_import_drafts SET source_platform = ?, source_title = ?, source_description = ?, image_urls = ?::jsonb, draft_title = ?, draft_description = ?, price = ?, category_id = ?, condition = ?, district = ?, updated_at = now() WHERE id = ? RETURNING id`, [draft.source_platform, draft.source_title, draft.source_description, JSON.stringify(draft.image_urls), draft.draft_title, draft.draft_description, draft.price, draft.category_id, draft.condition, draft.district, existing.id]);
    } else {
      const created = await run('INSERT INTO admin_listing_import_drafts (admin_id, source_url, source_platform, source_title, source_description, image_urls, draft_title, draft_description, price, category_id, condition, district) VALUES (?, ?, ?, ?, ?, ?::jsonb, ?, ?, ?, ?, ?, ?)', [req.user.id, draft.source_url, draft.source_platform, draft.source_title, draft.source_description, JSON.stringify(draft.image_urls), draft.draft_title, draft.draft_description, draft.price, draft.category_id, draft.condition, draft.district]);
      existing = { id: created.id };
    }
    const [row] = await query('SELECT id, source_url, source_platform, source_title, source_description, image_urls, draft_title, draft_description, price, category_id, condition, district, status, published_listing_id, created_at, updated_at FROM admin_listing_import_drafts WHERE id = ?', [existing.id]);
    await audit(req, 'listing_import_draft_created', 'admin_listing_import_draft', existing.id, { source_platform: draft.source_platform, image_count: draft.image_urls.length, ai_source: draft.ai_source });
    ok(res, { ...serializeImportDraft(row), metadata_note: draft.metadata_note, ai_source: draft.ai_source });
  } catch (error) { if (error.code?.startsWith('PRODUCT_URL_')) return fail(res, error.statusCode || 422, error.message); next(error); }
});

router.post('/listing-imports/:id/publish', ...guarded('approve_listings'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID draft tidak valid');
    const [draft] = await query('SELECT id, admin_id, source_url, source_platform, image_urls, draft_title, draft_description, price, category_id, condition, district, status FROM admin_listing_import_drafts WHERE id = ? AND admin_id = ?', [Number(req.params.id), req.user.id]);
    if (!draft) return fail(res, 404, 'Draft impor tidak ditemukan');
    if (draft.status !== 'draft') return fail(res, 409, 'Draft ini sudah diproses dan tidak dapat dipublikasikan ulang');
    const title = text(req.body?.title || draft.draft_title, 120);
    const description = text(req.body?.description || draft.draft_description, 2000);
    const price = Number(req.body?.price ?? draft.price);
    const categoryId = positiveId(req.body?.category_id) ? Number(req.body.category_id) : Number(draft.category_id);
    const condition = ['new', 'second'].includes(req.body?.condition) ? req.body.condition : draft.condition;
    const district = ALL_DISTRICTS.includes(text(req.body?.district || draft.district, 80)) ? text(req.body?.district || draft.district, 80) : 'Kendari';
    if (title.length < 5 || description.length < 10 || !Number.isSafeInteger(price) || price < 0 || !CATEGORIES.some(category => Number(category.id) === categoryId)) return fail(res, 422, 'Judul, deskripsi, harga, dan kategori belum valid');
    const availableImages = Array.isArray(draft.image_urls) ? draft.image_urls.filter(image => /^https:\/\//i.test(String(image))) : [];
    const requestedImages = Array.isArray(req.body?.image_urls) ? req.body.image_urls.map(image => String(image)) : availableImages;
    const images = [...new Set(requestedImages.filter(image => availableImages.includes(image)))].slice(0, 5);
    const result = await withTransaction(async ({ query: txQuery, run: txRun }) => {
      const listingResult = await txRun(`INSERT INTO listings (seller_id, category_id, title, description, price, condition, status, moderation_status, district, city, image_url, source_url, source_platform, provenance, imported_by, imported_at) VALUES (?, ?, ?, ?, ?, ?, 'active', 'approved', ?, 'Kendari', ?, ?, ?, 'admin_imported_reviewed', ?, now())`, [req.user.id, categoryId, title, description, price, condition, district, images[0] || null, draft.source_url, draft.source_platform, req.user.id]);
      for (const [index, image] of images.entries()) await txRun('INSERT INTO listing_images (listing_id, file_url, sort_order) VALUES (?, ?, ?)', [listingResult.id, image, index]);
      await txRun("UPDATE admin_listing_import_drafts SET status = 'published', published_listing_id = ?, draft_title = ?, draft_description = ?, price = ?, category_id = ?, condition = ?, district = ?, updated_at = now() WHERE id = ?", [listingResult.id, title, description, price, categoryId, condition, district, draft.id]);
      return { listing_id: listingResult.id, images };
    });
    await audit(req, 'listing_import_published', 'listing', result.listing_id, { draft_id: draft.id, source_platform: draft.source_platform, source_url: draft.source_url, image_count: result.images.length });
    const [listing] = await query('SELECT id, title, description, price, category_id, condition, status, moderation_status, district, city, image_url, source_url, source_platform, provenance, imported_at FROM listings WHERE id = ?', [result.listing_id]);
    res.status(201); ok(res, { listing, images: result.images });
  } catch (error) { next(error); }
});

router.post('/listing-imports/:id/discard', ...guarded('manage_listings'), async (req, res, next) => {
  try {
    if (!positiveId(req.params.id)) return fail(res, 422, 'ID draft tidak valid');
    const rows = await query("UPDATE admin_listing_import_drafts SET status = 'discarded', updated_at = now() WHERE id = ? AND admin_id = ? AND status = 'draft' RETURNING id, status, updated_at", [Number(req.params.id), req.user.id]);
    if (!rows.length) return fail(res, 404, 'Draft impor tidak ditemukan atau sudah diproses');
    await audit(req, 'listing_import_discarded', 'admin_listing_import_draft', req.params.id);
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

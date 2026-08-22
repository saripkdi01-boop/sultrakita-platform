const express = require('express');
const path = require('node:path');
const cors = require('cors');
const dotenv = require('dotenv');
const { query, run } = require('./database');

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 3000);
const districts = ['Kendari', 'Mandonga', 'Baruga', 'Poasia', 'Kadia', 'Kambu', 'Wua-Wua', 'Abeli', 'Puuwatu', 'Pondambea', 'Baito', 'Bau-Bau', 'Kolaka', 'Konawe', 'Muna', 'Wakatobi'];

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const ok = (res, data, meta) => res.json({ success: true, data, ...(meta ? { meta } : {}) });
const fail = (res, status, message, details) => res.status(status).json({ success: false, error: message, ...(details ? { details } : {}) });
const positiveInt = value => Number.isInteger(Number(value)) && Number(value) > 0;

app.get('/api/health', async (_req, res) => {
  try { await query('SELECT 1 AS ok'); ok(res, { status: 'healthy', service: 'sultrakita-api' }); }
  catch (error) { fail(res, 503, 'Database tidak tersedia', error.message); }
});

app.get('/api/categories', async (_req, res, next) => {
  try { ok(res, await query('SELECT id, name, slug, icon FROM categories ORDER BY name')); } catch (error) { next(error); }
});

app.get('/api/locations', (_req, res) => ok(res, { province: 'Sulawesi Tenggara', city: 'Kendari', districts }));

app.post('/api/users', async (req, res, next) => {
  try {
    const { name, phone, role = 'seller', district = 'Kendari' } = req.body || {};
    if (!name || name.trim().length < 2 || !phone || !/^08\d{8,13}$/.test(phone)) return fail(res, 422, 'name minimal 2 karakter dan phone harus nomor Indonesia yang valid');
    if (!['buyer', 'seller'].includes(role) || !districts.includes(district)) return fail(res, 422, 'role atau district tidak valid');
    const result = await run('INSERT INTO users (name, phone, role, district) VALUES (?, ?, ?, ?)', [name.trim(), phone, role, district]);
    const [user] = await query('SELECT id, name, phone, role, district, is_verified, created_at FROM users WHERE id = ?', [result.id]);
    res.status(201); ok(res, user);
  } catch (error) {
    if (String(error.message).includes('UNIQUE constraint failed')) return fail(res, 409, 'Nomor telepon sudah terdaftar');
    next(error);
  }
});

app.get('/api/stats', async (_req, res, next) => {
  try {
    const [summary] = await query(`SELECT COUNT(*) AS total_listings, COALESCE(SUM(status = 'active'), 0) AS active_listings, COUNT(DISTINCT district) AS covered_districts FROM listings`);
    const popular = await query(`SELECT c.name AS category, COUNT(l.id) AS total FROM categories c LEFT JOIN listings l ON l.category_id = c.id AND l.status = 'active' GROUP BY c.id ORDER BY total DESC, c.name LIMIT 5`);
    ok(res, { summary, popular_categories: popular });
  } catch (error) { next(error); }
});

app.get('/api/listings', async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit || '12', 10)));
    const offset = (page - 1) * limit;
    const params = [];
    const filters = ['l.status = ?']; params.push(req.query.status || 'active');
    if (req.query.q) { filters.push('(LOWER(l.title) LIKE LOWER(?) OR LOWER(l.description) LIKE LOWER(?) OR LOWER(l.city) LIKE LOWER(?))'); const q = `%${req.query.q}%`; params.push(q, q, q); }
    if (req.query.category) { filters.push('c.slug = ?'); params.push(req.query.category); }
    if (req.query.district) { filters.push('l.district = ?'); params.push(req.query.district); }
    if (req.query.condition) { filters.push('l.condition = ?'); params.push(req.query.condition); }
    if (positiveInt(req.query.min_price)) { filters.push('l.price >= ?'); params.push(Number(req.query.min_price)); }
    if (positiveInt(req.query.max_price)) { filters.push('l.price <= ?'); params.push(Number(req.query.max_price)); }
    const allowedSort = { newest: 'l.created_at DESC', cheapest: 'l.price ASC', expensive: 'l.price DESC', popular: 'l.views DESC' };
    const order = allowedSort[req.query.sort] || allowedSort.newest;
    const where = filters.join(' AND ');
    const items = await query(`SELECT l.*, c.name AS category_name, c.slug AS category_slug, u.name AS seller_name, u.is_verified AS seller_verified FROM listings l JOIN categories c ON c.id = l.category_id LEFT JOIN users u ON u.id = l.seller_id WHERE ${where} ORDER BY ${order} LIMIT ? OFFSET ?`, [...params, limit, offset]);
    const [{ total }] = await query(`SELECT COUNT(*) AS total FROM listings l JOIN categories c ON c.id = l.category_id WHERE ${where}`, params);
    ok(res, items, { page, limit, total: Number(total), total_pages: Math.ceil(Number(total) / limit), location: 'Kendari, Sulawesi Tenggara' });
  } catch (error) { next(error); }
});

app.get('/api/listings/:id', async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID listing tidak valid');
    const rows = await query(`SELECT l.*, c.name AS category_name, c.slug AS category_slug, u.name AS seller_name, u.phone AS seller_phone, u.is_verified AS seller_verified, u.district AS seller_district FROM listings l JOIN categories c ON c.id = l.category_id LEFT JOIN users u ON u.id = l.seller_id WHERE l.id = ?`, [Number(req.params.id)]);
    if (!rows.length) return fail(res, 404, 'Listing tidak ditemukan');
    await run('UPDATE listings SET views = views + 1 WHERE id = ?', [Number(req.params.id)]);
    ok(res, rows[0]);
  } catch (error) { next(error); }
});

app.post('/api/listings', async (req, res, next) => {
  try {
    const { title, description, price, category_id, seller_id, condition = 'new', district = 'Kendari', city = 'Kendari', image_url = null } = req.body || {};
    const errors = [];
    if (!title || title.trim().length < 5 || title.trim().length > 120) errors.push('title wajib 5-120 karakter');
    if (!description || description.trim().length < 10) errors.push('description wajib minimal 10 karakter');
    if (!positiveInt(category_id)) errors.push('category_id wajib berupa ID positif');
    if (!Number.isInteger(Number(price)) || Number(price) < 0) errors.push('price wajib berupa angka >= 0');
    if (!['new', 'second'].includes(condition)) errors.push('condition harus new atau second');
    if (!districts.includes(district)) errors.push('district belum didukung');
    if (errors.length) return fail(res, 422, 'Data listing belum valid', errors);
    const result = await run(`INSERT INTO listings (seller_id, category_id, title, description, price, condition, district, city, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [seller_id || null, Number(category_id), title.trim(), description.trim(), Number(price), condition, district, city, image_url]);
    const [listing] = await query('SELECT * FROM listings WHERE id = ?', [result.id]);
    res.status(201); ok(res, listing);
  } catch (error) { next(error); }
});

app.post('/api/favorites', async (req, res, next) => {
  try {
    const { user_id, listing_id } = req.body || {};
    if (!positiveInt(user_id) || !positiveInt(listing_id)) return fail(res, 422, 'user_id dan listing_id wajib berupa ID positif');
    await run('INSERT OR IGNORE INTO favorites (user_id, listing_id) VALUES (?, ?)', [Number(user_id), Number(listing_id)]);
    ok(res, { user_id: Number(user_id), listing_id: Number(listing_id), favorited: true });
  } catch (error) { next(error); }
});

app.get('/api/listings/:id/comments', async (req, res, next) => {
  try { if (!positiveInt(req.params.id)) return fail(res, 400, 'ID listing tidak valid'); ok(res, await query('SELECT id, listing_id, author_name, body, created_at FROM comments WHERE listing_id = ? AND status = \'visible\' ORDER BY created_at DESC', [Number(req.params.id)])); } catch (error) { next(error); }
});

app.post('/api/comments', async (req, res, next) => {
  try {
    const { listing_id, user_id = null, author_name, body } = req.body || {};
    if (!positiveInt(listing_id) || !author_name || author_name.trim().length < 2 || !body || body.trim().length < 3 || body.trim().length > 1000) return fail(res, 422, 'listing_id, author_name, dan body komentar belum valid');
    const listing = await query('SELECT id FROM listings WHERE id = ?', [Number(listing_id)]); if (!listing.length) return fail(res, 404, 'Listing tidak ditemukan');
    const result = await run('INSERT INTO comments (listing_id, user_id, author_name, body) VALUES (?, ?, ?, ?)', [Number(listing_id), user_id || null, author_name.trim(), body.trim()]);
    const [comment] = await query('SELECT id, listing_id, author_name, body, status, created_at FROM comments WHERE id = ?', [result.id]); res.status(201); ok(res, comment);
  } catch (error) { next(error); }
});

app.post('/api/suggestions', async (req, res, next) => {
  try { const { user_id = null, name, email = null, body } = req.body || {}; if (!name || name.trim().length < 2 || !body || body.trim().length < 5 || body.trim().length > 2000) return fail(res, 422, 'name dan body saran belum valid'); const result = await run('INSERT INTO suggestions (user_id, name, email, body) VALUES (?, ?, ?, ?)', [user_id || null, name.trim(), email, body.trim()]); res.status(201); ok(res, { id: result.id, message: 'Saran berhasil diterima dan akan ditinjau tim SultraKita.' }); } catch (error) { next(error); }
});

app.post('/api/donations', async (req, res, next) => {
  try { const { name, email = null, amount, message = null } = req.body || {}; if (!name || name.trim().length < 2 || !Number.isInteger(Number(amount)) || Number(amount) < 1000) return fail(res, 422, 'name wajib diisi dan amount minimal Rp1.000'); const result = await run('INSERT INTO donations (name, email, amount, message) VALUES (?, ?, ?, ?)', [name.trim(), email, Number(amount), message]); res.status(201); ok(res, { id: result.id, status: 'pledged', message: 'Dukungan tercatat. Integrasi pembayaran dapat diaktifkan setelah rekening atau provider resmi dikonfigurasi.' }); } catch (error) { next(error); }
});

app.post('/api/reports', async (req, res, next) => {
  try { const { listing_id, reporter_name, reason } = req.body || {}; if (!positiveInt(listing_id) || !reporter_name || reporter_name.trim().length < 2 || !reason || reason.trim().length < 5) return fail(res, 422, 'Data laporan belum valid'); const result = await run('INSERT INTO reports (listing_id, reporter_name, reason) VALUES (?, ?, ?)', [Number(listing_id), reporter_name.trim(), reason.trim()]); res.status(201); ok(res, { id: result.id, message: 'Laporan diterima untuk moderasi.' }); } catch (error) { next(error); }
});

app.get('/api/community/summary', async (_req, res, next) => {
  try { const [comments] = await query("SELECT COUNT(*) AS total FROM comments WHERE status = 'visible'"); const [suggestions] = await query('SELECT COUNT(*) AS total FROM suggestions'); const [supporters] = await query("SELECT COUNT(*) AS total FROM donations WHERE status != 'cancelled'"); ok(res, { comments: Number(comments.total), suggestions: Number(suggestions.total), supporters: Number(supporters.total) }); } catch (error) { next(error); }
});

app.delete('/api/favorites', async (req, res, next) => {
  try {
    const { user_id, listing_id } = req.body || {};
    if (!positiveInt(user_id) || !positiveInt(listing_id)) return fail(res, 422, 'user_id dan listing_id wajib diisi');
    await run('DELETE FROM favorites WHERE user_id = ? AND listing_id = ?', [Number(user_id), Number(listing_id)]);
    ok(res, { user_id: Number(user_id), listing_id: Number(listing_id), favorited: false });
  } catch (error) { next(error); }
});

app.use((_req, res) => fail(res, 404, 'Endpoint tidak ditemukan'));
app.use((error, _req, res, _next) => { console.error(error); fail(res, 500, 'Terjadi kesalahan pada server'); });

if (require.main === module) app.listen(PORT, () => console.log(`SultraKita API berjalan pada port ${PORT}`));
module.exports = app;

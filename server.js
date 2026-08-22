const express = require('express');
const path = require('node:path');
const crypto = require('node:crypto');
const fs = require('node:fs');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const { query, run } = require('./database');

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 3000);
const districts = ['Kendari', 'Mandonga', 'Baruga', 'Poasia', 'Kadia', 'Kambu', 'Wua-Wua', 'Abeli', 'Puuwatu', 'Pondambea', 'Baito', 'Bau-Bau', 'Kolaka', 'Konawe', 'Muna', 'Wakatobi'];

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));
const uploadDir = path.join(__dirname, 'uploads'); fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ storage: multer.diskStorage({ destination: uploadDir, filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname).toLowerCase()}`) }), limits: { fileSize: 5 * 1024 * 1024, files: 5 }, fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) });
const requestHits = new Map();
const rateLimit = (windowMs = 60_000, max = 60) => (req, res, next) => { const key = `${req.ip}:${req.path}`; const now = Date.now(); const recent = (requestHits.get(key) || []).filter(timestamp => now - timestamp < windowMs); if (recent.length >= max) return fail(res, 429, 'Terlalu banyak permintaan. Silakan coba lagi nanti.'); recent.push(now); requestHits.set(key, recent); next(); };
setInterval(() => { const now = Date.now(); for (const [key, timestamps] of requestHits) if (!timestamps.some(timestamp => now - timestamp < 60_000)) requestHits.delete(key); }, 60_000).unref();
const retentionDays = Math.min(730, Math.max(7, Number(process.env.ANALYTICS_RETENTION_DAYS || 90)));
setInterval(() => { run('DELETE FROM analytics_events WHERE created_at < datetime(\'now\', ?)', [`-${retentionDays} days`]).catch(() => {}); }, 24 * 60 * 60 * 1000).unref();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', rateLimit());

const ok = (res, data, meta) => res.json({ success: true, data, ...(meta ? { meta } : {}) });
const fail = (res, status, message, details) => res.status(status).json({ success: false, error: message, ...(details ? { details } : {}) });
const positiveInt = value => Number.isInteger(Number(value)) && Number(value) > 0;
const adminOnly = (req, res, next) => { if (!process.env.ADMIN_TOKEN || req.get('x-admin-token') !== process.env.ADMIN_TOKEN) return fail(res, 401, 'Akses admin tidak sah'); next(); };
const analyticsRateLimit = rateLimit(60_000, Number(process.env.ANALYTICS_TRACK_PER_MINUTE || 120));
const sendOtp = async (phone, code) => { if (!process.env.OTP_PROVIDER_URL) return false; const response = await fetch(process.env.OTP_PROVIDER_URL, { method:'POST', headers:{ 'content-type':'application/json', ...(process.env.OTP_PROVIDER_TOKEN ? { authorization:`Bearer ${process.env.OTP_PROVIDER_TOKEN}` } : {}) }, body:JSON.stringify({ phone, code, channel:process.env.OTP_PROVIDER_CHANNEL || 'sms' }) }); if (!response.ok) throw new Error('Provider OTP gagal mengirim kode'); return true; };
const normalizeWhatsAppPhone = phone => { const digits = String(phone || '').replace(/\D/g, ''); if (digits.startsWith('08')) return `62${digits.slice(1)}`; if (digits.startsWith('8')) return `62${digits}`; if (digits.startsWith('62')) return digits; return null; };
const sendWhatsAppText = async (phone, body) => { const to = normalizeWhatsAppPhone(phone); if (!to || !process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) return { sent:false, reason:'not_configured' }; const version = process.env.WHATSAPP_API_VERSION || 'v23.0'; const response = await fetch(`https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, { method:'POST', headers:{ authorization:`Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, 'content-type':'application/json' }, body:JSON.stringify({ messaging_product:'whatsapp', recipient_type:'individual', to, type:'text', text:{ preview_url:false, body:String(body).slice(0, 3500) } }) }); if (!response.ok) { const detail = await response.text().catch(()=>''); throw new Error(`WhatsApp provider gagal mengirim notifikasi (${response.status}): ${detail.slice(0, 200)}`); } return { sent:true }; };
const sendWhatsAppTemplate = async (phone, variables) => { const to = normalizeWhatsAppPhone(phone); if (!to || !process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_TEMPLATE_NAME) return { sent:false, reason:'template_not_configured' }; const version = process.env.WHATSAPP_API_VERSION || 'v23.0'; const components = [{ type:'body', parameters:Object.values(variables).slice(0, 4).map(value => ({ type:'text', text:String(value ?? '-').slice(0, 900) })) }]; const response = await fetch(`https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, { method:'POST', headers:{ authorization:`Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, 'content-type':'application/json' }, body:JSON.stringify({ messaging_product:'whatsapp', recipient_type:'individual', to, type:'template', template:{ name:process.env.WHATSAPP_TEMPLATE_NAME, language:{ code:process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'id' }, components } }) }); if (!response.ok) { const detail = await response.text().catch(()=>''); throw new Error(`Template WhatsApp gagal dikirim (${response.status}): ${detail.slice(0, 200)}`); } return { sent:true }; };
const notifySellerWhatsApp = async ({ phone, sellerName, listingTitle, senderName, message, channel='pertanyaan' }) => { if (!phone) return; try { const result = await sendWhatsAppTemplate(phone, { sellerName, listingTitle, senderName, message }); if (result.reason === 'template_not_configured') console.info('[whatsapp-notification] template belum dikonfigurasi; notifikasi dilewati'); } catch (error) { console.error('[whatsapp-notification]', error.message); } };

app.get('/api/health', async (_req, res) => {
  try { await query('SELECT 1 AS ok'); ok(res, { status: 'healthy', service: 'sultrakita-api' }); }
  catch (_error) { fail(res, 503, 'Database tidak tersedia'); }
});

app.get('/api/categories', async (_req, res, next) => {
  try { ok(res, await query('SELECT id, name, slug, icon FROM categories ORDER BY name')); } catch (error) { next(error); }
});

app.get('/api/locations', (_req, res) => ok(res, { province: 'Sulawesi Tenggara', city: 'Kendari', districts }));

app.post('/api/auth/request-otp', async (req, res, next) => {
  try {
    const { phone } = req.body || {};
    if (!/^08\d{8,13}$/.test(phone || '')) return fail(res, 422, 'Nomor telepon Indonesia belum valid');
    const code = String(crypto.randomInt(100000, 1000000)); const hash = crypto.createHash('sha256').update(code).digest('hex'); const expires = Date.now() + 5 * 60 * 1000;
    await run('DELETE FROM otp_challenges WHERE phone = ? OR expires_at < ?', [phone, Date.now()]); await run('INSERT INTO otp_challenges (phone, code_hash, expires_at) VALUES (?, ?, ?)', [phone, hash, expires]);
    const delivered = await sendOtp(phone, code); const response = { phone, expires_in: 300, delivered, message: delivered ? 'Kode OTP telah dikirim melalui provider terkonfigurasi.' : 'Provider OTP belum dikonfigurasi; aktifkan OTP_DEV_MODE hanya untuk demo lokal.' };
    if (process.env.OTP_DEV_MODE === 'true') response.dev_code = code;
    ok(res, response);
  } catch (error) { next(error); }
});

app.post('/api/auth/verify-otp', async (req, res, next) => {
  try {
    const { phone, code, name = 'Pengguna SultraKita', role = 'buyer', district = 'Kendari' } = req.body || {};
    if (!/^08\d{8,13}$/.test(phone || '') || !/^\d{6}$/.test(code || '')) return fail(res, 422, 'Nomor telepon atau kode OTP belum valid');
    const [challenge] = await query('SELECT * FROM otp_challenges WHERE phone = ? AND consumed_at IS NULL AND expires_at > ? AND attempts < 5 ORDER BY id DESC LIMIT 1', [phone, Date.now()]);
    if (!challenge) return fail(res, 401, 'OTP sudah kedaluwarsa atau tidak ditemukan');
    const hash = crypto.createHash('sha256').update(code).digest('hex'); if (hash !== challenge.code_hash) { await run('UPDATE otp_challenges SET attempts = attempts + 1 WHERE id = ?', [challenge.id]); return fail(res, 401, 'Kode OTP salah'); }
    let [user] = await query('SELECT * FROM users WHERE phone = ?', [phone]);
    if (!user) { const created = await run('INSERT INTO users (name, phone, role, district, phone_verified) VALUES (?, ?, ?, ?, 1)', [name.trim().slice(0, 80), phone, ['buyer','seller'].includes(role) ? role : 'buyer', districts.includes(district) ? district : 'Kendari']); [user] = await query('SELECT * FROM users WHERE id = ?', [created.id]); } else await run('UPDATE users SET phone_verified = 1 WHERE id = ?', [user.id]);
    await run('UPDATE otp_challenges SET consumed_at = ? WHERE id = ?', [Date.now(), challenge.id]); const token = crypto.randomBytes(32).toString('hex'); const tokenHash = crypto.createHash('sha256').update(token).digest('hex'); await run('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)', [tokenHash, user.id, Date.now() + 30 * 24 * 60 * 60 * 1000]);
    ok(res, { token, user: { id: user.id, name: user.name, phone: user.phone, role: user.role, district: user.district, phone_verified: 1, verification_status: user.verification_status || 'unverified' } });
  } catch (error) { next(error); }
});

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

app.get('/api/users/:id', async (req, res, next) => { try { const [user] = await query('SELECT id, name, phone, role, district, phone_verified, verification_status, verification_note, created_at FROM users WHERE id = ?', [Number(req.params.id)]); if (!user) return fail(res, 404, 'Pengguna tidak ditemukan'); ok(res, user); } catch (error) { next(error); } });

app.post('/api/seller-verifications', async (req, res, next) => { try { const { user_id, document_type, document_reference = null } = req.body || {}; if (!positiveInt(user_id) || !['ktp','nib','other'].includes(document_type)) return fail(res, 422, 'user_id atau document_type belum valid'); const result = await run('INSERT INTO seller_verifications (user_id, document_type, document_reference) VALUES (?, ?, ?)', [Number(user_id), document_type, document_reference]); await run("UPDATE users SET verification_status = 'pending' WHERE id = ?", [Number(user_id)]); res.status(201); ok(res, { id: result.id, status: 'pending', message: 'Pengajuan verifikasi seller diterima untuk ditinjau admin.' }); } catch (error) { next(error); } });

app.post('/api/listings/:id/images', upload.array('images', 5), async (req, res, next) => { try { if (!positiveInt(req.params.id)) return fail(res, 400, 'ID listing tidak valid'); if (!req.files?.length) return fail(res, 422, 'Minimal satu foto JPG, PNG, atau WEBP diperlukan'); const listing = await query('SELECT id FROM listings WHERE id = ?', [Number(req.params.id)]); if (!listing.length) return fail(res, 404, 'Listing tidak ditemukan'); const existing = await query('SELECT COUNT(*) AS total FROM listing_images WHERE listing_id = ?', [Number(req.params.id)]); const images = []; for (const [index, file] of req.files.entries()) { let fileUrl = `/uploads/${file.filename}`; if (process.env.R2_UPLOAD_URL && process.env.R2_UPLOAD_TOKEN) { const payload = await fs.promises.readFile(file.path); const remote = await fetch(`${process.env.R2_UPLOAD_URL}/${file.filename}`, { method:'PUT', headers:{ authorization:`Bearer ${process.env.R2_UPLOAD_TOKEN}`, 'content-type':file.mimetype }, body:payload }); if (!remote.ok) throw new Error('Upload object storage gagal'); fileUrl = `${process.env.R2_PUBLIC_BASE_URL || process.env.R2_UPLOAD_URL}/${file.filename}`; await fs.promises.unlink(file.path).catch(() => {}); } await run('INSERT INTO listing_images (listing_id, file_url, sort_order) VALUES (?, ?, ?)', [Number(req.params.id), fileUrl, Number(existing[0].total) + index]); images.push(fileUrl); } ok(res, images); } catch (error) { next(error); } });

app.get('/api/listings/:id/images', async (req, res, next) => { try { ok(res, await query('SELECT id, file_url, sort_order, created_at FROM listing_images WHERE listing_id = ? ORDER BY sort_order', [Number(req.params.id)])); } catch (error) { next(error); } });

app.get('/api/admin/overview', adminOnly, async (_req, res, next) => { try { const [users] = await query('SELECT COUNT(*) AS total FROM users'); const [sellers] = await query("SELECT COUNT(*) AS total FROM users WHERE verification_status = 'pending'"); const [reports] = await query("SELECT COUNT(*) AS total FROM reports WHERE status IN ('open','reviewing')"); const [suggestions] = await query("SELECT COUNT(*) AS total FROM suggestions WHERE status IN ('new','reviewing')"); ok(res, { users: Number(users.total), pending_sellers: Number(sellers.total), open_reports: Number(reports.total), pending_suggestions: Number(suggestions.total) }); } catch (error) { next(error); } });
app.get('/api/admin/verifications', adminOnly, async (req, res, next) => { try { ok(res, await query('SELECT v.*, u.name, u.phone, u.district FROM seller_verifications v JOIN users u ON u.id = v.user_id WHERE v.status = ? ORDER BY v.created_at DESC', [req.query.status || 'pending'])); } catch (error) { next(error); } });
app.patch('/api/admin/verifications/:id', adminOnly, async (req, res, next) => { try { const status = req.body?.status; if (!['approved','rejected','pending'].includes(status)) return fail(res, 422, 'Status verifikasi tidak valid'); const rows = await query('SELECT user_id FROM seller_verifications WHERE id = ?', [Number(req.params.id)]); if (!rows.length) return fail(res, 404, 'Pengajuan verifikasi tidak ditemukan'); await run('UPDATE seller_verifications SET status = ?, note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?', [status, req.body.note || null, Number(req.params.id)]); await run('UPDATE users SET verification_status = ?, verification_note = ? WHERE id = ?', [status, req.body.note || null, rows[0].user_id]); ok(res, { id:Number(req.params.id), status }); } catch (error) { next(error); } });
app.get('/api/admin/reports', adminOnly, async (req, res, next) => { try { ok(res, await query("SELECT r.*, l.title FROM reports r LEFT JOIN listings l ON l.id = r.listing_id WHERE r.status = ? ORDER BY r.created_at DESC", [req.query.status || 'open'])); } catch (error) { next(error); } });
app.patch('/api/admin/reports/:id', adminOnly, async (req, res, next) => { try { const status = req.body?.status; if (!['open','reviewing','resolved','rejected'].includes(status)) return fail(res, 422, 'Status laporan tidak valid'); await run('UPDATE reports SET status = ? WHERE id = ?', [status, Number(req.params.id)]); ok(res, { id:Number(req.params.id), status }); } catch (error) { next(error); } });

app.post('/api/conversations', async (req, res, next) => { try { const { listing_id, buyer_id, seller_id } = req.body || {}; if (!positiveInt(buyer_id) || !positiveInt(seller_id)) return fail(res, 422, 'buyer_id dan seller_id wajib valid'); const existing = await query('SELECT * FROM conversations WHERE listing_id IS ? AND buyer_id = ? AND seller_id = ?', [listing_id || null, Number(buyer_id), Number(seller_id)]); if (existing.length) return ok(res, existing[0]); const created = await run('INSERT INTO conversations (listing_id, buyer_id, seller_id) VALUES (?, ?, ?)', [listing_id || null, Number(buyer_id), Number(seller_id)]); const [conversation] = await query('SELECT * FROM conversations WHERE id = ?', [created.id]); res.status(201); ok(res, conversation); } catch (error) { next(error); } });
app.get('/api/conversations/:id/messages', async (req, res, next) => { try { if (!positiveInt(req.params.id)) return fail(res, 400, 'ID percakapan tidak valid'); ok(res, await query('SELECT m.*, u.name AS sender_name FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.conversation_id = ? ORDER BY m.created_at ASC', [Number(req.params.id)])); } catch (error) { next(error); } });
app.post('/api/conversations/:id/messages', async (req, res, next) => { try { const { sender_id, body } = req.body || {}; if (!positiveInt(sender_id) || !body || body.trim().length < 1 || body.trim().length > 2000) return fail(res, 422, 'sender_id dan pesan belum valid'); const conversations = await query('SELECT c.*, l.title AS listing_title, seller.name AS seller_name, seller.phone AS seller_phone FROM conversations c LEFT JOIN listings l ON l.id = c.listing_id LEFT JOIN users seller ON seller.id = c.seller_id WHERE c.id = ?', [Number(req.params.id)]); if (!conversations.length) return fail(res, 404, 'Percakapan tidak ditemukan'); const conversation = conversations[0]; const created = await run('INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)', [Number(req.params.id), Number(sender_id), body.trim()]); await run('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [Number(req.params.id)]); const [message] = await query('SELECT m.*, u.name AS sender_name FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.id = ?', [created.id]); if (Number(sender_id) === Number(conversation.buyer_id)) void notifySellerWhatsApp({ phone:conversation.seller_phone, sellerName:conversation.seller_name, listingTitle:conversation.listing_title, senderName:message.sender_name, message:message.body, channel:'pesan pembeli' }); res.status(201); ok(res, message); } catch (error) { next(error); } });
app.get('/api/conversations/:id/stream', async (req, res) => { if (!positiveInt(req.params.id)) return res.status(400).end(); res.setHeader('Content-Type', 'text/event-stream'); res.setHeader('Cache-Control', 'no-cache'); res.setHeader('Connection', 'keep-alive'); let lastId = Number(req.query.after || 0); const timer = setInterval(async () => { try { const rows = await query('SELECT m.*, u.name AS sender_name FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.conversation_id = ? AND m.id > ? ORDER BY m.id ASC', [Number(req.params.id), lastId]); for (const message of rows) { lastId = message.id; res.write(`data: ${JSON.stringify(message)}\\n\\n`); } } catch { clearInterval(timer); res.end(); } }, 2000); req.on('close', () => clearInterval(timer)); });

app.post('/api/dev/whatsapp-webhook', async (req, res, next) => { try { const expected = process.env.SIMULATION_TOKEN || 'local-only'; if (process.env.NODE_ENV === 'production' || req.get('x-simulation-token') !== expected) return fail(res, 404, 'Not found'); const payload = req.body || {}; if (payload.event !== 'messages.upserted' || !payload.message?.body || !payload.seller?.phone) return fail(res, 422, 'Payload simulasi webhook belum valid'); console.info('[whatsapp-simulation]', { message_id:payload.message.id, seller_phone_last4:String(payload.seller.phone).slice(-4), listing_id:payload.listing?.id }); ok(res, { simulated:true, would_notify:payload.seller.phone, provider_called:false, message_id:payload.message.id }); } catch (error) { next(error); } });

app.post('/api/analytics/track', analyticsRateLimit, async (req, res, next) => { try { const { event_name, path: pagePath = '/', listing_id = null, category_slug = null, district = null, referrer = null } = req.body || {}; const allowed = ['page_view','listing_view','search','listing_contact']; if (!allowed.includes(event_name)) return fail(res, 422, 'event_name analitik tidak valid'); await run('INSERT INTO analytics_events (event_name, path, listing_id, category_slug, district, referrer, user_agent, country_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [event_name, String(pagePath).slice(0, 300), positiveInt(listing_id) ? Number(listing_id) : null, category_slug ? String(category_slug).slice(0, 80) : null, district ? String(district).slice(0, 80) : null, referrer ? String(referrer).slice(0, 300) : null, req.get('user-agent')?.slice(0, 300) || null, req.get('cf-ipcountry') || null]); res.status(202); ok(res, { tracked: true }); } catch (error) { next(error); } });
app.get('/api/analytics/summary', adminOnly, async (req, res, next) => { try { const days = Math.min(90, Math.max(1, Number(req.query.days) || 7)); const [totals] = await query("SELECT COUNT(*) AS events, SUM(event_name = 'page_view') AS page_views, SUM(event_name = 'listing_view') AS listing_views, SUM(event_name = 'search') AS searches, SUM(event_name = 'listing_contact') AS contacts FROM analytics_events WHERE created_at >= datetime('now', ?)", [`-${days} days`]); const topListings = await query("SELECT l.id, l.title, l.views, COUNT(a.id) AS tracked_views FROM listings l LEFT JOIN analytics_events a ON a.listing_id = l.id AND a.event_name = 'listing_view' AND a.created_at >= datetime('now', ?) GROUP BY l.id ORDER BY tracked_views DESC, l.views DESC LIMIT 10", [`-${days} days`]); const daily = await query("SELECT date(created_at) AS date, COUNT(*) AS events, SUM(event_name = 'page_view') AS page_views, SUM(event_name = 'listing_view') AS listing_views FROM analytics_events WHERE created_at >= datetime('now', ?) GROUP BY date(created_at) ORDER BY date ASC", [`-${days} days`]); ok(res, { days, totals, top_listings: topListings, daily }); } catch (error) { next(error); } });

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
    const items = await query(`SELECT l.*, c.name AS category_name, c.slug AS category_slug, u.name AS seller_name, CASE WHEN COALESCE(u.verification_status, 'unverified') = 'approved' OR COALESCE(u.is_verified, 0) = 1 THEN 1 ELSE 0 END AS seller_verified FROM listings l JOIN categories c ON c.id = l.category_id LEFT JOIN users u ON u.id = l.seller_id WHERE ${where} ORDER BY ${order} LIMIT ? OFFSET ?`, [...params, limit, offset]);
    const [{ total }] = await query(`SELECT COUNT(*) AS total FROM listings l JOIN categories c ON c.id = l.category_id WHERE ${where}`, params);
    ok(res, items, { page, limit, total: Number(total), total_pages: Math.ceil(Number(total) / limit), location: 'Kendari, Sulawesi Tenggara' });
  } catch (error) { next(error); }
});

app.get('/api/listings/:id', async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID listing tidak valid');
    const rows = await query(`SELECT l.*, c.name AS category_name, c.slug AS category_slug, u.name AS seller_name, u.phone AS seller_phone, CASE WHEN COALESCE(u.verification_status, 'unverified') = 'approved' OR COALESCE(u.is_verified, 0) = 1 THEN 1 ELSE 0 END AS seller_verified, u.district AS seller_district FROM listings l JOIN categories c ON c.id = l.category_id LEFT JOIN users u ON u.id = l.seller_id WHERE l.id = ?`, [Number(req.params.id)]);
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
    const [comment] = await query('SELECT id, listing_id, author_name, body, status, created_at FROM comments WHERE id = ?', [result.id]);
    const [seller] = await query('SELECT u.name AS seller_name, u.phone AS seller_phone, l.title AS listing_title FROM listings l LEFT JOIN users u ON u.id = l.seller_id WHERE l.id = ?', [Number(listing_id)]);
    if (seller?.seller_phone) void notifySellerWhatsApp({ phone:seller.seller_phone, sellerName:seller.seller_name, listingTitle:seller.listing_title, senderName:comment.author_name, message:comment.body });
    res.status(201); ok(res, comment);
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

app.use('/uploads', express.static(uploadDir));
app.use((_req, res) => fail(res, 404, 'Endpoint tidak ditemukan'));
app.use((error, _req, res, _next) => { console.error(error); fail(res, 500, 'Terjadi kesalahan pada server'); });

if (require.main === module) app.listen(PORT, () => console.log(`SultraKita API berjalan pada port ${PORT}`));
module.exports = app;

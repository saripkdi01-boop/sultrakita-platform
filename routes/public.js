'use strict';

// Router publik: health, broadcast, kategori, feed eksternal, lokasi,
// analytics, konfigurasi publik, asisten AI listing, dan webhook simulasi dev.
// Diekstrak dari server.js tanpa perubahan perilaku; dipasang di /api.
const express = require('express');
const { query, run } = require('../database');
const { requirePermission } = require('../rbac');
const { ok, fail } = require('../lib/http');
const { positiveInt } = require('../lib/validation');
const { adminOnly } = require('../lib/sessions');
const { rateLimit } = require('../lib/rate-limit');
const { loadExternalListings, loadExternalJobs, inferLinkCategory } = require('../lib/external-feeds');
const { CATEGORIES, REGIONS, ALL_DISTRICTS } = require('../shared/taxonomy');

const router = express.Router();
const districts = ALL_DISTRICTS;
const analyticsRateLimit = rateLimit(60_000, Number(process.env.ANALYTICS_TRACK_PER_MINUTE || 120));

// Endpoint asisten AI listing vanilla (MVP aditif): degradasi anggun ke
// fallback lokal saat Gemini tidak dikonfigurasi; kontrak API tetap stabil.
router.post('/ai/listing-assist', async (req, res) => {
  const title = String(req.body?.title || '').trim().slice(0, 140);
  const category = String(req.body?.category || 'produk lokal').trim().slice(0, 80);
  const district = String(req.body?.district || 'Sulawesi Tenggara').trim().slice(0, 80);
  const existing = String(req.body?.description || '').trim().slice(0, 800);
  if (title.length < 3) return res.status(422).json({ success: false, error: 'Judul listing belum valid' });
  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      success: true,
      data: {
        description: `${title} pilihan warga ${district}. Produk ${category} dengan kualitas baik dan siap dipertimbangkan. Hubungi penjual untuk detail, stok, dan kesepakatan COD.${existing ? ` ${existing}` : ''}`.slice(0, 900),
        provider: 'local-fallback',
      },
    });
  }
  try {
    const prompt = `Tulis deskripsi marketplace dalam Bahasa Indonesia untuk listing berikut. Maksimal 3 kalimat, jujur, tidak mengarang spesifikasi, dan ajak pembeli menghubungi seller. Judul: ${title}. Kategori: ${category}. Lokasi: ${district}. Catatan pengguna: ${existing || '(tidak ada)'}`;
    const geminiBase = String(process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
    const geminiModel = String(process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
    const response = await fetch(
      `${geminiBase}/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: AbortSignal.timeout(9000),
      }
    );
    const body = await response.json().catch(() => ({}));
    const description = body?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
    if (!response.ok || !description) throw new Error('AI response tidak valid');
    return res.json({ success: true, data: { description: description.slice(0, 900), provider: 'gemini' } });
  } catch (error) {
    console.warn('[listing-assist-fallback]', error.message);
    return res.json({
      success: true,
      data: {
        description: `${title} pilihan warga ${district}. Produk ${category} yang cocok untuk kebutuhan harian. Hubungi penjual untuk detail, stok, dan kesepakatan COD.`,
        provider: 'local-fallback',
      },
    });
  }
});

router.get('/health', async (_req, res) => {
  const { objectStorageConfigured, presignStorageConfigured } = require('../lib/storage');
  let db = 'down';
  try { await query('SELECT 1 AS ok'); db = 'up'; } catch (error) { console.error('[health-db]', error.message); }
  res.status(200).json({
    success: true,
    data: {
      api: 'up',
      db,
      db_driver: process.env.DATABASE_URL || process.env.SUPABASE_DB_URL ? 'postgres' : 'unconfigured',
      storage: (objectStorageConfigured() || presignStorageConfigured()) ? 'configured' : 'down',
      build: process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_SHA || 'local',
      time: new Date().toISOString(),
    },
  });
});

router.get('/broadcasts', async (req, res, next) => {
  try {
    const limit = Math.min(10, Math.max(1, Number(req.query.limit) || 5));
    const rows = await query(
      'SELECT id, type, title, content, image_url, cta_url, cta_text, starts_at, ends_at, is_urgent FROM broadcasts WHERE is_active = TRUE AND (starts_at IS NULL OR starts_at <= CURRENT_TIMESTAMP) AND (ends_at IS NULL OR ends_at >= CURRENT_TIMESTAMP) ORDER BY is_urgent DESC, starts_at DESC NULLS LAST, id DESC LIMIT ?',
      [limit]
    );
    ok(res, rows);
  } catch (error) {
    console.warn('[broadcasts] feed unavailable:', error.message);
    return ok(res, [], { source: 'empty' });
  }
});

router.get('/categories', async (_req, res) => {
  try {
    const rows = await query('SELECT id, name, slug, icon FROM categories ORDER BY name');
    if (rows.length) return ok(res, rows, { source: 'db' });
  } catch (error) { console.error('[categories-fallback]', error.message); }
  return ok(res, CATEGORIES, { source: 'fallback' });
});

router.get('/external-listings', async (_req, res, next) => {
  try {
    const result = await loadExternalListings();
    ok(res, result.data, result.meta);
  } catch (error) { next(error); }
});

router.get('/external-jobs', async (_req, res, next) => {
  try {
    const result = await loadExternalJobs();
    ok(res, result.data, result.meta);
  } catch (error) { next(error); }
});

router.get('/external-cards', async (req, res) => {
  try {
    const [products, jobs] = await Promise.all([loadExternalListings(), loadExternalJobs()]);
    const productCards = products.data.map(row => {
      const categorySlug = CATEGORIES.some(category => category.slug === row.category)
        ? row.category
        : inferLinkCategory(`${row.title || ''} ${row.category || ''} ${row.description || ''}`, row.category || '');
      const categoryName = CATEGORIES.find(category => category.slug === categorySlug)?.name || row.category || 'Lainnya';
      return { ...row, category_slug: categorySlug, category_name: categoryName, item_type: row.item_type || 'product', source_type: 'external_product' };
    });
    const jobCards = jobs.data.map(row => ({ ...row, category_slug: 'lowongan', category_name: 'Lowongan Kerja', item_type: 'job', source_type: 'external_job' }));
    const q = String(req.query.q || '').trim().toLowerCase();
    const category = String(req.query.category || '').trim().toLowerCase();
    const district = String(req.query.district || '').trim().toLowerCase();
    const cards = [...productCards, ...jobCards]
      .filter(row =>
        (!category || row.category_slug === category)
        && (!district || String(row.city || '').toLowerCase().includes(district))
        && (!q || `${row.title} ${row.description || ''} ${row.company || ''} ${row.source_label || ''}`.toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.observed_at || 0) - new Date(a.observed_at || 0))
      .slice(0, 100);
    ok(res, cards, { total: cards.length, products: productCards.length, jobs: jobCards.length, source: 'universal_external_cards' });
  } catch (error) {
    console.error('[external-cards]', error.message);
    ok(res, [], { total: 0, source: 'degraded', notice: 'Kartu eksternal sementara belum tersedia.' });
  }
});

router.get('/locations', (_req, res) => ok(res, { province: 'Sulawesi Tenggara', city: 'Kendari', regions: REGIONS, districts }, { source: 'static' }));

router.post('/dev/whatsapp-webhook', async (req, res, next) => {
  try {
    const expected = process.env.SIMULATION_TOKEN || 'local-only';
    if (process.env.NODE_ENV === 'production' || req.get('x-simulation-token') !== expected) return fail(res, 404, 'Not found');
    const payload = req.body || {};
    if (payload.event !== 'messages.upserted' || !payload.message?.body || !payload.seller?.phone) {
      return fail(res, 422, 'Payload simulasi webhook belum valid');
    }
    console.info('[whatsapp-simulation]', {
      message_id: payload.message.id,
      seller_phone_last4: String(payload.seller.phone).slice(-4),
      listing_id: payload.listing?.id,
    });
    ok(res, { simulated: true, would_notify: payload.seller.phone, provider_called: false, message_id: payload.message.id });
  } catch (error) { next(error); }
});

router.post('/analytics/track', analyticsRateLimit, async (req, res, next) => {
  try {
    const { event_name, path: pagePath = '/', listing_id = null, category_slug = null, district = null, referrer = null } = req.body || {};
    const allowed = ['page_view', 'listing_view', 'search', 'listing_contact'];
    if (!allowed.includes(event_name)) return fail(res, 422, 'event_name analitik tidak valid');
    await run(
      'INSERT INTO analytics_events (event_name, path, listing_id, category_slug, district, referrer, user_agent, country_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [event_name, String(pagePath).slice(0, 300), positiveInt(listing_id) ? Number(listing_id) : null,
        category_slug ? String(category_slug).slice(0, 80) : null, district ? String(district).slice(0, 80) : null,
        referrer ? String(referrer).slice(0, 300) : null, req.get('user-agent')?.slice(0, 300) || null, req.get('cf-ipcountry') || null]
    );
    res.status(202);
    ok(res, { tracked: true });
  } catch (error) { next(error); }
});

router.get('/analytics/summary', requirePermission('view_analytics'), adminOnly, async (req, res, next) => {
  try {
    const days = Math.min(90, Math.max(1, Number(req.query.days) || 7));
    const [totals] = await query(
      `SELECT COUNT(*) AS events,
        COUNT(*) FILTER (WHERE event_name = 'page_view') AS page_views,
        COUNT(*) FILTER (WHERE event_name = 'listing_view') AS listing_views,
        COUNT(*) FILTER (WHERE event_name = 'search') AS searches,
        COUNT(*) FILTER (WHERE event_name = 'listing_contact') AS contacts
       FROM analytics_events WHERE created_at >= now() - (? * interval '1 day')`,
      [`-${days} days`]
    );
    const topListings = await query(
      `SELECT l.id, l.title, l.views, COUNT(a.id) AS tracked_views FROM listings l
       LEFT JOIN analytics_events a ON a.listing_id = l.id AND a.event_name = 'listing_view' AND a.created_at >= now() - (? * interval '1 day')
       GROUP BY l.id ORDER BY tracked_views DESC, l.views DESC LIMIT 10`,
      [`-${days} days`]
    );
    const daily = await query(
      `SELECT created_at::date AS date, COUNT(*)::int AS events,
        COUNT(*) FILTER (WHERE event_name = 'page_view')::int AS page_views,
        COUNT(*) FILTER (WHERE event_name = 'listing_view')::int AS listing_views
       FROM analytics_events WHERE created_at >= now() - (? * interval '1 day') GROUP BY created_at::date ORDER BY date ASC`,
      [`-${days} days`]
    );
    ok(res, { days, totals, top_listings: topListings, daily });
  } catch (error) { next(error); }
});

router.get('/public-config', (_req, res) => ok(res, {
  supabase_url: process.env.SUPABASE_URL || null,
  supabase_anon_key: process.env.SUPABASE_ANON_KEY || null,
}));

module.exports = router;

'use strict';

// Agregator feed eksternal (produk + lowongan) — diekstrak dari server.js tanpa perubahan perilaku.
// Sumber: feed JSON partner resmi (env) + URL yang diimpor admin (DB). Tanpa feed
// terkonfigurasi, endpoint mengembalikan data impor admin + notice jujur (bukan data palsu).
const crypto = require('node:crypto');
const { query, run } = require('../database');
const { boundedText } = require('./validation');
const { parseJsonObject } = require('./validation');
const { ensureAuthSchema } = require('./schema');

const externalFeedCache = new Map();

const parseFeedConfig = raw => {
  try {
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed.filter(feed => feed && feed.id && /^https:\/\//.test(feed.url)).slice(0, 10) : [];
  } catch { return []; }
};

const pickPath = (value, pathText) =>
  String(pathText || '').split('.').filter(Boolean).reduce((current, key) => current && current[key], value);

const inferLinkCategory = (value, override = '') => {
  const text = `${override} ${value || ''}`.toLowerCase();
  const rules = [
    ['lowongan', /lowongan|loker|job|karir|career|rekrut/],
    ['elektronik', /handphone|smartphone|iphone|samsung|xiaomi|oppo|vivo|laptop|tablet|kamera|elektronik/],
    ['kendaraan', /mobil|motor|sepeda|avanza|yamaha|honda|kendaraan/],
    ['properti', /rumah|tanah|apartemen|kos|ruko|properti|sewa/],
    ['fashion', /baju|sepatu|tas|fashion|jaket|dress/],
    ['rumah-tangga', /sofa|meja|kursi|lemari|furniture|perabot/],
    ['hobi', /ikan|kucing|hewan|game|olahraga|hobi/],
    ['kuliner', /makanan|minuman|kue|kuliner/],
    ['jasa', /jasa|service|les|tukang|freelance/],
  ];
  return rules.find(([, pattern]) => pattern.test(text))?.[0] || 'lainnya';
};

const normalizeExternalItem = (feed, item) => {
  const row = item || {};
  const title = row.title || row.name || row.product_name;
  const url = row.url || row.link || row.product_url;
  if (!title || !url || !/^https:\/\//.test(String(url))) return null;
  return {
    external_id: String(row.id || row.external_id || crypto.createHash('sha256').update(`${feed.id}:${title}:${url}`).digest('hex').slice(0, 20)),
    source: feed.id,
    source_label: feed.label || feed.id,
    title: String(title).slice(0, 180),
    category: inferLinkCategory(`${row.title || ''} ${row.category || ''}`, feed.category || ''),
    item_type: 'product',
    description: String(row.description || row.summary || '').slice(0, 1000),
    summary_source: row.summary_source || 'feed',
    city: String(row.city || row.location || 'Kendari').slice(0, 80),
    province: 'Sulawesi Tenggara',
    price: Number.isFinite(Number(row.price)) ? Number(row.price) : null,
    image_url: /^https:\/\//.test(String(row.image_url || row.image || '')) ? String(row.image_url || row.image).slice(0, 500) : null,
    is_demo: false,
    provenance: 'partner_api_or_feed',
    observed_at: new Date().toISOString(),
    url: String(url).slice(0, 1000),
  };
};

const REGION_TERMS = ['kendari', 'sulawesi tenggara', 'sultra', 'konawe', 'kolaka', 'muna', 'bau-bau', 'baubau', 'buton', 'bombana', 'wakatobi', 'konsel', 'konawe selatan', 'konawe utara', 'kolaka timur', 'kolaka utara', 'buton selatan', 'buton tengah', 'buton utara'];

const regionMatches = (row, feed = {}, includeUnknown = false) => {
  const terms = Array.isArray(feed.region_terms) && feed.region_terms.length ? feed.region_terms : REGION_TERMS;
  const location = [row.city, row.location, row.district, row.province, row.region, feed.region_label].filter(Boolean).join(' ').toLowerCase();
  return terms.some(term => location.includes(String(term).toLowerCase())) || (includeUnknown && !location);
};

const externalHeaders = feed => ({
  accept: 'application/json',
  ...(feed.auth_env && process.env[feed.auth_env]
    ? { [feed.auth_header || 'authorization']: feed.auth_header?.toLowerCase() === 'authorization' ? `Bearer ${process.env[feed.auth_env]}` : process.env[feed.auth_env] }
    : {}),
});

const fetchJsonFeed = async feed => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(feed.url, { headers: externalHeaders(feed), signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally { clearTimeout(timer); }
};

const feedItems = (payload, feed) => {
  const items = pickPath(payload, feed.items_path || 'items');
  return (Array.isArray(items) ? items : []).slice(0, Number(feed.max_items || 100));
};

const persistExternalListing = async row => {
  try {
    await run(
      `INSERT INTO external_listings (external_id, source, source_label, title, category, city, province, price, image_url, url, item_type, description, summary_source, is_demo, provenance, observed_at, raw_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb)
       ON CONFLICT (source, external_id) DO UPDATE SET source_label = EXCLUDED.source_label, title = EXCLUDED.title, category = EXCLUDED.category, city = EXCLUDED.city, province = EXCLUDED.province, price = EXCLUDED.price, image_url = EXCLUDED.image_url, url = EXCLUDED.url, item_type = EXCLUDED.item_type, description = EXCLUDED.description, summary_source = EXCLUDED.summary_source, is_demo = EXCLUDED.is_demo, provenance = EXCLUDED.provenance, observed_at = EXCLUDED.observed_at, raw_json = EXCLUDED.raw_json`,
      [row.external_id, row.source, row.source_label, row.title, row.category, row.city, row.province, row.price, row.image_url, row.url, row.item_type || 'product', row.description || null, row.summary_source || 'metadata_fallback', Boolean(row.is_demo), row.provenance, row.observed_at, JSON.stringify(row)]
    );
  } catch (error) { console.error('[external-listing-persist]', error.message); }
};

const loadExternalListings = async () => {
  const feeds = parseFeedConfig(process.env.EXTERNAL_MARKETPLACE_FEEDS_JSON);
  let stored = [];
  try {
    await ensureAuthSchema();
    stored = await query('SELECT external_id, source, source_label, title, category, city, province, price, image_url, url, item_type, description, summary_source, is_demo, provenance, observed_at FROM external_listings ORDER BY observed_at DESC LIMIT 100');
  } catch (error) { console.error('[external-listing-read]', error.message); }
  if (!feeds.length) {
    return {
      data: stored,
      meta: {
        live_sync: false, configured_feeds: 0, imported_urls: stored.length,
        notice: stored.length ? 'Menampilkan kartu dari URL yang telah diimpor admin.' : 'Belum ada feed produk resmi yang dikonfigurasi.',
      },
    };
  }
  const all = [...stored];
  const statuses = [];
  for (const feed of feeds) {
    const cached = externalFeedCache.get(`products:${feed.id}`);
    if (cached && cached.expires > Date.now()) {
      all.push(...cached.data);
      statuses.push({ id: feed.id, status: 'cache', count: cached.data.length });
      continue;
    }
    try {
      const payload = await fetchJsonFeed(feed);
      const rows = feedItems(payload, feed)
        .filter(item => feed.region_filter === true ? regionMatches(item, feed, feed.include_unknown === true) : true)
        .map(item => normalizeExternalItem(feed, item))
        .filter(Boolean)
        .slice(0, 100);
      await Promise.all(rows.map(persistExternalListing));
      externalFeedCache.set(`products:${feed.id}`, { data: rows, expires: Date.now() + Number(feed.cache_seconds || 300) * 1000 });
      all.push(...rows);
      statuses.push({ id: feed.id, status: 'ok', count: rows.length, region_filter: feed.region_filter === true });
    } catch (error) {
      statuses.push({ id: feed.id, status: 'error', message: error.name === 'AbortError' ? 'timeout' : 'unavailable' });
    }
  }
  const unique = [...new Map(all.map(row => [`${row.source}:${row.external_id}`, row])).values()];
  return { data: unique.slice(0, 100), meta: { live_sync: true, configured_feeds: feeds.length, imported_urls: stored.length, feeds: statuses } };
};

const normalizeExternalJob = (feed, item) => {
  const row = item || {};
  const title = row.title || row.name || row.position || row.job_title;
  const url = row.url || row.link || row.apply_url;
  if (!title || !url || !/^https:\/\//.test(String(url))) return null;
  return {
    external_id: String(row.id || row.external_id || crypto.createHash('sha256').update(`${feed.id}:${title}:${url}`).digest('hex').slice(0, 20)),
    source: feed.id,
    source_label: feed.label || feed.id,
    title: String(title).slice(0, 180),
    company: String(row.company || row.company_name || row.employer || 'Perusahaan lokal').slice(0, 140),
    city: String(row.city || row.location || row.district || '').slice(0, 80),
    province: String(row.province || 'Sulawesi Tenggara').slice(0, 80),
    category: String(row.category || row.job_category || 'Umum').slice(0, 80),
    employment_type: String(row.employment_type || row.type || 'Tidak disebutkan').slice(0, 60),
    salary_text: String(row.salary || row.salary_text || '').slice(0, 120),
    description: String(row.description || row.summary || '').slice(0, 1000),
    image_url: /^https:\/\//.test(String(row.image_url || row.image || '')) ? String(row.image_url || row.image).slice(0, 1000) : null,
    posted_at: row.posted_at || row.published_at || null,
    expires_at: row.expires_at || row.deadline || null,
    observed_at: new Date().toISOString(),
    url: String(url).slice(0, 1000),
    provenance: feed.provenance || 'authorized_partner_feed',
  };
};

const persistExternalJob = async row => {
  try {
    await run(
      `INSERT INTO external_jobs (external_id, source, source_label, title, company, city, province, category, employment_type, salary_text, description, url, image_url, posted_at, expires_at, observed_at, provenance, raw_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb)
       ON CONFLICT (source, external_id) DO UPDATE SET source_label = EXCLUDED.source_label, title = EXCLUDED.title, company = EXCLUDED.company, city = EXCLUDED.city, province = EXCLUDED.province, category = EXCLUDED.category, employment_type = EXCLUDED.employment_type, salary_text = EXCLUDED.salary_text, description = EXCLUDED.description, url = EXCLUDED.url, image_url = EXCLUDED.image_url, posted_at = EXCLUDED.posted_at, expires_at = EXCLUDED.expires_at, observed_at = EXCLUDED.observed_at, provenance = EXCLUDED.provenance, raw_json = EXCLUDED.raw_json`,
      [row.external_id, row.source, row.source_label, row.title, row.company, row.city, row.province, row.category, row.employment_type, row.salary_text, row.description, row.url, row.image_url || null, row.posted_at, row.expires_at, row.observed_at, row.provenance, JSON.stringify(row)]
    );
  } catch (error) { console.error('[external-job-persist]', error.message); }
};

const loadExternalJobs = async () => {
  const feeds = parseFeedConfig(process.env.EXTERNAL_JOB_FEEDS_JSON);
  let stored = [];
  try {
    await ensureAuthSchema();
    stored = await query('SELECT external_id, source, source_label, title, company, city, province, category, employment_type, salary_text, description, url, image_url, posted_at, expires_at, observed_at, provenance FROM external_jobs ORDER BY observed_at DESC LIMIT 100');
  } catch (error) { console.error('[external-job-read]', error.message); }
  if (!feeds.length) {
    return {
      data: stored,
      meta: {
        live_sync: false, configured_feeds: 0, imported_urls: stored.length,
        notice: stored.length ? 'Menampilkan lowongan dari URL yang telah diimpor admin.' : 'Belum ada feed atau URL lowongan resmi yang dikonfigurasi.',
      },
    };
  }
  const all = [...stored];
  const statuses = [];
  for (const feed of feeds) {
    const cached = externalFeedCache.get(`jobs:${feed.id}`);
    if (cached && cached.expires > Date.now()) {
      all.push(...cached.data);
      statuses.push({ id: feed.id, status: 'cache', count: cached.data.length });
      continue;
    }
    try {
      const payload = await fetchJsonFeed(feed);
      const rows = feedItems(payload, feed)
        .filter(item => regionMatches(item, feed, feed.include_unknown === true))
        .map(item => normalizeExternalJob(feed, item))
        .filter(Boolean)
        .slice(0, 100);
      await Promise.all(rows.map(persistExternalJob));
      externalFeedCache.set(`jobs:${feed.id}`, { data: rows, expires: Date.now() + Number(feed.cache_seconds || 300) * 1000 });
      all.push(...rows);
      statuses.push({ id: feed.id, status: 'ok', count: rows.length, region_filter: true });
    } catch (error) {
      statuses.push({ id: feed.id, status: 'error', message: error.name === 'AbortError' ? 'timeout' : 'unavailable' });
    }
  }
  const unique = [...new Map(all.map(row => [`${row.source}:${row.external_id}`, row])).values()];
  return { data: unique.slice(0, 100), meta: { live_sync: true, configured_feeds: feeds.length, imported_urls: stored.length, feeds: statuses } };
};

module.exports = {
  externalFeedCache, parseFeedConfig, pickPath, inferLinkCategory, normalizeExternalItem,
  REGION_TERMS, regionMatches, externalHeaders, fetchJsonFeed, feedItems,
  persistExternalListing, loadExternalListings, normalizeExternalJob, persistExternalJob, loadExternalJobs,
};

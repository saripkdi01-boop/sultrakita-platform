'use strict';

const express = require('express');
const crypto = require('node:crypto');
const { query, run, withTransaction } = require('../database');
const { requireAuth } = require('../auth');
const { normalizeRole } = require('../rbac');
const { SITE_URL, slugify } = require('../seo');

const router = express.Router();

const OBJECTIVES = new Set(['awareness', 'traffic', 'leads', 'sales', 'engagement', 'retention']);
const CHANNELS = ['sultrakita', 'facebook', 'instagram', 'tiktok', 'google', 'whatsapp'];
const CHANNEL_SET = new Set(CHANNELS);
const EVENT_NAMES = new Set(['impression', 'view', 'click', 'lead', 'whatsapp_conversation', 'listing_view', 'favorite', 'order']);
const CAMPAIGN_STATES = new Set(['DRAFT', 'AWAITING_APPROVAL', 'READY', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'MANUAL_ACTION_REQUIRED', 'CANCELLED']);
const MAX_TEXT = 5000;

const ok = (res, data, meta) => res.json({ success: true, data, ...(meta ? { meta } : {}) });
const fail = (res, status, message, details) => res.status(status).json({ success: false, error: message, ...(details ? { details } : {}) });
const positiveInt = value => Number.isInteger(Number(value)) && Number(value) > 0;
const text = (value, max = MAX_TEXT) => String(value ?? '').trim().slice(0, max);
const userId = req => Number(req.user?.id);
const isAdmin = req => ['admin', 'super_admin'].includes(normalizeRole(req.user?.role));
const jsonObject = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const arrayOfText = (value, maxItems = 12, maxLength = 160) => Array.isArray(value) ? [...new Set(value.map(item => text(item, maxLength)).filter(Boolean))].slice(0, maxItems) : [];
const nowIso = () => new Date().toISOString();

function parseArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.replace(/[{}]/g, '').split(',').map(item => item.trim()).filter(Boolean);
  return [];
}

function normalizeChannels(value) {
  const requested = arrayOfText(value, CHANNELS.length, 30).map(channel => channel.toLowerCase());
  const channels = [...new Set(requested.filter(channel => CHANNEL_SET.has(channel)))];
  return channels.length ? channels : ['sultrakita'];
}

function campaignPayload(row) {
  if (!row) return null;
  return {
    ...row,
    channels: parseArray(row.channels),
    media_asset_ids: parseArray(row.media_asset_ids),
    audience_filter: typeof row.audience_filter === 'string' ? (() => { try { return JSON.parse(row.audience_filter); } catch { return {}; } })() : (row.audience_filter || {}),
    budget: row.budget == null ? null : Number(row.budget),
  };
}

function channelPayload(row) {
  if (!row) return null;
  return { ...row, id: Number(row.id), campaign_id: Number(row.campaign_id) };
}

function buildListingUrl(listing) {
  return `${SITE_URL}/listing/${slugify(listing.title)}-${listing.id}`;
}

function buildUtm(campaign, channel, destinationUrl) {
  const params = new URLSearchParams({
    utm_source: channel.channel,
    utm_medium: channel.channel === 'sultrakita' ? 'organic_marketplace' : 'manual_export',
    utm_campaign: slugify(campaign.name) || `campaign-${campaign.id}`,
    utm_content: `campaign-${campaign.id}-${channel.channel}`,
  });
  if (campaign.location) params.set('utm_term', slugify(campaign.location));
  return {
    destination_url: `${destinationUrl}${destinationUrl.includes('?') ? '&' : '?'}${params.toString()}`,
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term'),
  };
}

function buildExportPackage(campaign, listing, channel, utm) {
  const price = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(listing.price || 0));
  const image = listing.image_url || null;
  const copy = `${listing.title} tersedia di ${listing.district || 'Sulawesi Tenggara'}. Harga ${price}. ${listing.description}`;
  return {
    kind: 'SUKI_PROMO_HUB_P0_MANUAL_EXPORT',
    disclaimer: 'Paket ini hanya menyiapkan materi untuk publikasi manual. Tidak ada publikasi pihak ketiga yang diklaim berhasil.',
    campaign: { id: Number(campaign.id), name: campaign.name, objective: campaign.objective, cta: campaign.cta, location: campaign.location || null },
    listing: { id: Number(listing.id), title: listing.title, description: listing.description, price: Number(listing.price || 0), price_display: price, district: listing.district, city: listing.city, image_url: image, verified_destination: buildListingUrl(listing) },
    channel: { name: channel.channel, state: 'MANUAL_ACTION_REQUIRED', next_action: 'Salin materi, buka aplikasi resmi channel, tinjau, lalu publikasikan secara manual.' },
    content: { headline: listing.title, primary_copy: copy, short_copy: `${listing.title} · ${price} · ${listing.district || 'Sultra'}`, cta: campaign.cta, hashtags: ['#SultraKita', '#UMKMSultra', `#${slugify(listing.district || 'SulawesiTenggara')}`] },
    tracking: utm,
    generated_at: nowIso(),
  };
}

async function getOwnedCampaign(campaignId, req, forUpdate = false, db = { query }) {
  const sql = `SELECT c.id, c.owner_id, c.seller_id, c.listing_id, c.name, c.objective, c.audience_filter, c.location, c.budget, c.start_at, c.end_at, c.channels, c.media_asset_ids, c.cta, c.status, c.idempotency_key, c.created_at, c.updated_at, c.approved_at, c.published_at,
                      l.title AS listing_title, l.description AS listing_description, l.price AS listing_price, l.district AS listing_district, l.city AS listing_city, l.image_url AS listing_image_url, l.status AS listing_status,
                      u.name AS seller_name
               FROM promo_campaigns c JOIN listings l ON l.id = c.listing_id JOIN users u ON u.id = c.seller_id
               WHERE c.id = ? ${isAdmin(req) ? '' : 'AND c.owner_id = ?'} ${forUpdate ? 'FOR UPDATE' : ''}`;
  const params = isAdmin(req) ? [campaignId] : [campaignId, userId(req)];
  const [row] = await db.query(sql, params);
  return row ? campaignPayload(row) : null;
}

async function getChannelRows(campaignId, db = { query }) {
  return (await db.query('SELECT id, campaign_id, channel, state, provider_reference, error_code, error_message, idempotency_key, state_changed_at, published_at, manual_completed_at, created_at, updated_at FROM promo_channels WHERE campaign_id = ? ORDER BY id', [campaignId])).map(channelPayload);
}

async function recordTransition(db, { campaignId, channelId, actorId, fromState, toState, providerReference = null, errorCode = null, metadata = {} }) {
  await db.run('INSERT INTO promo_channel_events (campaign_id, channel_id, actor_id, from_state, to_state, provider_reference, error_code, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?::jsonb)', [campaignId, channelId, actorId || null, fromState || null, toState, providerReference, errorCode, JSON.stringify(metadata)]);
}

async function setChannelState(db, channel, toState, req, metadata = {}) {
  const fromState = channel.state;
  if (fromState === toState) return channel;
  await db.run('UPDATE promo_channels SET state = ?, state_changed_at = now(), updated_at = now() WHERE id = ?', [toState, channel.id]);
  await recordTransition(db, { campaignId: channel.campaign_id, channelId: channel.id, actorId: userId(req) || null, fromState, toState, metadata });
  return { ...channel, state: toState };
}

async function ensureChannels(db, campaignId, channels) {
  for (const channel of channels) {
    const initialState = channel === 'sultrakita' ? 'READY' : 'NOT_CONNECTED';
    await db.run('INSERT INTO promo_channels (campaign_id, channel, state) VALUES (?, ?, ?) ON CONFLICT (campaign_id, channel) DO NOTHING', [campaignId, channel, initialState]);
  }
  await db.run('DELETE FROM promo_channels WHERE campaign_id = ? AND channel <> ALL(?)', [campaignId, channels]);
}

async function ensureUtmLinks(db, campaign, channelRows) {
  const destinationUrl = buildListingUrl({ id: campaign.listing_id, title: campaign.listing_title });
  for (const channel of channelRows) {
    const utm = buildUtm(campaign, channel, destinationUrl);
    await db.run(`INSERT INTO promo_utm_links (campaign_id, channel_id, destination_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                  ON CONFLICT (campaign_id, channel_id) DO UPDATE SET destination_url = EXCLUDED.destination_url, utm_source = EXCLUDED.utm_source, utm_medium = EXCLUDED.utm_medium, utm_campaign = EXCLUDED.utm_campaign, utm_content = EXCLUDED.utm_content, utm_term = EXCLUDED.utm_term`, [campaign.id, channel.id, utm.destination_url, utm.utm_source, utm.utm_medium, utm.utm_campaign, utm.utm_content, utm.utm_term]);
  }
}

function validateCampaignInput(body, partial = false) {
  const errors = [];
  if (!partial || body.name !== undefined) { const value = text(body.name, 120); if (value.length < 1) errors.push('name wajib diisi'); }
  if (!partial || body.objective !== undefined) { if (!OBJECTIVES.has(text(body.objective, 30).toLowerCase())) errors.push('objective tidak valid'); }
  if (!partial || body.listing_id !== undefined) { if (!positiveInt(body.listing_id)) errors.push('listing_id wajib valid'); }
  if (body.budget !== undefined && body.budget !== null && (!Number.isSafeInteger(Number(body.budget)) || Number(body.budget) < 0)) errors.push('budget harus berupa angka >= 0');
  if (body.start_at && Number.isNaN(Date.parse(body.start_at))) errors.push('start_at tidak valid');
  if (body.end_at && Number.isNaN(Date.parse(body.end_at))) errors.push('end_at tidak valid');
  if (body.start_at && body.end_at && Date.parse(body.end_at) < Date.parse(body.start_at)) errors.push('end_at tidak boleh sebelum start_at');
  if (body.channels !== undefined && !normalizeChannels(body.channels).length) errors.push('channels tidak valid');
  return errors;
}

router.get('/health', (_req, res) => ok(res, {
  module: 'suki-promo-hub',
  phase: 'P0',
  capabilities: {
    campaign_draft: true,
    listing_binding: true,
    channel_state_machine: true,
    utm: true,
    native_sultrakita_marketplace: true,
    manual_export: true,
    external_provider_publish: false,
    ai_generation: false,
  },
  external_channels: Object.fromEntries(CHANNELS.filter(channel => channel !== 'sultrakita').map(channel => [channel, { state: 'NOT_CONNECTED', direct_publish: false, fallback: 'MANUAL_ACTION_REQUIRED' }])),
}));

router.get('/listings', requireAuth, async (req, res, next) => {
  try {
    if (!['seller', 'admin', 'super_admin'].includes(normalizeRole(req.user?.role))) return fail(res, 403, 'Akun belum memiliki hak seller');
    const rows = await query(`SELECT l.id, l.title, l.description, l.price, l.district, l.city, l.image_url, l.status, l.created_at,
                                     c.name AS category_name, c.slug AS category_slug
                              FROM listings l LEFT JOIN categories c ON c.id = l.category_id
                              WHERE l.seller_id = ? AND l.status = 'active'
                              ORDER BY l.updated_at DESC NULLS LAST, l.created_at DESC LIMIT 100`, [userId(req)]);
    ok(res, rows.map(row => ({ ...row, id: Number(row.id), price: Number(row.price || 0) })));
  } catch (error) { next(error); }
});

router.get('/campaigns', requireAuth, async (req, res, next) => {
  try {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const offset = Math.max(0, (Number(req.query.page) - 1 || 0) * limit);
    const params = isAdmin(req) ? [limit, offset] : [userId(req), limit, offset];
    const ownerClause = isAdmin(req) ? '' : 'WHERE c.owner_id = ?';
    const rows = await query(`SELECT c.id, c.owner_id, c.seller_id, c.listing_id, c.name, c.objective, c.audience_filter, c.location, c.budget, c.start_at, c.end_at, c.channels, c.media_asset_ids, c.cta, c.status, c.created_at, c.updated_at, c.approved_at, c.published_at,
                                     l.title AS listing_title, l.image_url AS listing_image_url,
                                     (SELECT COUNT(*) FROM promo_channels pc WHERE pc.campaign_id = c.id) AS channel_count,
                                     (SELECT COUNT(*) FROM promo_channels pc WHERE pc.campaign_id = c.id AND pc.state = 'PUBLISHED') AS published_channel_count
                              FROM promo_campaigns c JOIN listings l ON l.id = c.listing_id ${ownerClause} ORDER BY c.updated_at DESC LIMIT ? OFFSET ?`, params);
    ok(res, rows.map(row => ({ ...campaignPayload(row), channel_count: Number(row.channel_count || 0), published_channel_count: Number(row.published_channel_count || 0) })));
  } catch (error) { next(error); }
});

router.post('/campaigns', requireAuth, async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = validateCampaignInput(body);
    if (errors.length) return fail(res, 422, 'Data kampanye belum valid', errors);
    if (!['seller', 'admin', 'super_admin'].includes(normalizeRole(req.user?.role))) return fail(res, 403, 'Akun belum memiliki hak seller');
    const listingId = Number(body.listing_id);
    const [listing] = await query('SELECT id, seller_id, title, description, price, district, city, image_url, status FROM listings WHERE id = ?', [listingId]);
    if (!listing) return fail(res, 404, 'Listing tidak ditemukan');
    if (!isAdmin(req) && Number(listing.seller_id) !== userId(req)) return fail(res, 403, 'Campaign hanya dapat dibuat untuk listing milik session');
    if (listing.status !== 'active') return fail(res, 409, 'Listing harus aktif untuk dipromosikan');
    const channels = normalizeChannels(body.channels);
    const idempotencyKey = text(req.get('idempotency-key') || body.idempotency_key, 160) || null;
    if (idempotencyKey) {
      const [existing] = await query('SELECT id FROM promo_campaigns WHERE owner_id = ? AND idempotency_key = ?', [userId(req), idempotencyKey]);
      if (existing) { const campaign = await getOwnedCampaign(existing.id, req); return ok(res, { ...campaign, channels: await getChannelRows(existing.id) }, { idempotent: true }); }
    }
    const created = await withTransaction(async db => {
      const result = await db.run(`INSERT INTO promo_campaigns (owner_id, seller_id, listing_id, name, objective, audience_filter, location, budget, start_at, end_at, channels, media_asset_ids, cta, idempotency_key)
                                   VALUES (?, ?, ?, ?, ?, ?::jsonb, ?, ?, ?, ?, ?, ?, ?, ?)`, [userId(req), listing.seller_id, listingId, text(body.name, 120), text(body.objective, 30).toLowerCase(), JSON.stringify(jsonObject(body.audience_filter)), text(body.location, 120) || listing.district || null, body.budget == null ? null : Number(body.budget), body.start_at || null, body.end_at || null, channels, arrayOfText(body.media_asset_ids, 10, 200), text(body.cta, 160) || 'Lihat listing', idempotencyKey]);
      const [campaign] = await db.query(`SELECT c.*, l.title AS listing_title, l.description AS listing_description, l.price AS listing_price, l.district AS listing_district, l.city AS listing_city, l.image_url AS listing_image_url, l.status AS listing_status, u.name AS seller_name FROM promo_campaigns c JOIN listings l ON l.id = c.listing_id JOIN users u ON u.id = c.seller_id WHERE c.id = ?`, [result.id]);
      await ensureChannels(db, result.id, channels);
      const channelRows = await getChannelRows(result.id, db);
      await ensureUtmLinks(db, campaignPayload(campaign), channelRows);
      await db.run('INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?::jsonb)', [userId(req), 'promo_campaign_created', 'promo_campaign', String(result.id), JSON.stringify({ listing_id: listingId, seller_id: listing.seller_id, channels })]);
      return { campaign: campaignPayload(campaign), channels: await getChannelRows(result.id, db) };
    });
    res.status(201); return ok(res, created);
  } catch (error) {
    if (error.code === '23505') return fail(res, 409, 'Campaign dengan idempotency key tersebut sudah ada');
    next(error);
  }
});

router.get('/campaigns/:id', requireAuth, async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID campaign tidak valid');
    const campaign = await getOwnedCampaign(Number(req.params.id), req);
    if (!campaign) return fail(res, 404, 'Campaign tidak ditemukan');
    const channels = await getChannelRows(campaign.id);
    const links = await query('SELECT id, campaign_id, channel_id, destination_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term, created_at FROM promo_utm_links WHERE campaign_id = ? ORDER BY id', [campaign.id]);
    ok(res, { campaign, channels, utm_links: links });
  } catch (error) { next(error); }
});

router.patch('/campaigns/:id', requireAuth, async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID campaign tidak valid');
    const campaign = await getOwnedCampaign(Number(req.params.id), req);
    if (!campaign) return fail(res, 404, 'Campaign tidak ditemukan');
    if (!['DRAFT', 'AWAITING_APPROVAL'].includes(campaign.status)) return fail(res, 409, 'Campaign hanya dapat diedit sebelum publish');
    const errors = validateCampaignInput(req.body || {}, true);
    if (errors.length) return fail(res, 422, 'Data kampanye belum valid', errors);
    const body = req.body || {};
    if (body.listing_id !== undefined && Number(body.listing_id) !== Number(campaign.listing_id)) return fail(res, 422, 'P0 tidak mengizinkan mengganti listing setelah campaign dibuat');
    const fields = [];
    const params = [];
    const add = (sql, value) => { fields.push(sql); params.push(value); };
    if (body.name !== undefined) add('name = ?', text(body.name, 120));
    if (body.objective !== undefined) add('objective = ?', text(body.objective, 30).toLowerCase());
    if (body.audience_filter !== undefined) { fields.push('audience_filter = ?::jsonb'); params.push(JSON.stringify(jsonObject(body.audience_filter))); }
    if (body.location !== undefined) add('location = ?', text(body.location, 120) || null);
    if (body.budget !== undefined) add('budget = ?', body.budget == null ? null : Number(body.budget));
    if (body.start_at !== undefined) add('start_at = ?', body.start_at || null);
    if (body.end_at !== undefined) add('end_at = ?', body.end_at || null);
    if (body.media_asset_ids !== undefined) add('media_asset_ids = ?', arrayOfText(body.media_asset_ids, 10, 200));
    if (body.cta !== undefined) add('cta = ?', text(body.cta, 160) || 'Lihat listing');
    const channels = body.channels === undefined ? campaign.channels : normalizeChannels(body.channels);
    fields.push('channels = ?', 'updated_at = now()'); params.push(channels);
    await withTransaction(async db => {
      if (fields.length) await db.run(`UPDATE promo_campaigns SET ${fields.join(', ')} WHERE id = ?`, [...params, campaign.id]);
      await ensureChannels(db, campaign.id, channels);
      const latest = await getOwnedCampaign(campaign.id, req, false, db);
      const channelRows = await getChannelRows(campaign.id, db);
      await ensureUtmLinks(db, latest, channelRows);
      await db.run('INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?::jsonb)', [userId(req), 'promo_campaign_updated', 'promo_campaign', String(campaign.id), JSON.stringify({ fields: Object.keys(body).filter(key => key !== 'idempotency_key'), channels })]);
    });
    const updated = await getOwnedCampaign(campaign.id, req);
    ok(res, { campaign: updated, channels: await getChannelRows(campaign.id) });
  } catch (error) { next(error); }
});

router.post('/campaigns/:id/approve', requireAuth, async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID campaign tidak valid');
    const campaign = await getOwnedCampaign(Number(req.params.id), req);
    if (!campaign) return fail(res, 404, 'Campaign tidak ditemukan');
    if (!['DRAFT', 'AWAITING_APPROVAL'].includes(campaign.status)) return fail(res, 409, 'Campaign tidak berada pada tahap approval');
    const channels = await getChannelRows(campaign.id);
    if (!channels.length) return fail(res, 409, 'Campaign belum memiliki channel');
    await withTransaction(async db => {
      await db.run('UPDATE promo_campaigns SET status = ?, approved_at = now(), updated_at = now() WHERE id = ?', ['READY', campaign.id]);
      for (const channel of channels) {
        const target = channel.channel === 'sultrakita' ? 'READY' : 'NOT_CONNECTED';
        await setChannelState(db, channel, target, req, { reason: 'campaign_approved' });
      }
      await db.run('INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?::jsonb)', [userId(req), 'promo_campaign_approved', 'promo_campaign', String(campaign.id), JSON.stringify({ channels: channels.map(channel => channel.channel) })]);
    });
    ok(res, { campaign_id: campaign.id, status: 'READY', channels: await getChannelRows(campaign.id), approved_at: nowIso() });
  } catch (error) { next(error); }
});

router.post('/campaigns/:id/export', requireAuth, async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID campaign tidak valid');
    const campaign = await getOwnedCampaign(Number(req.params.id), req);
    if (!campaign) return fail(res, 404, 'Campaign tidak ditemukan');
    if (!['READY', 'SCHEDULED', 'MANUAL_ACTION_REQUIRED', 'PUBLISHED'].includes(campaign.status)) return fail(res, 409, 'Campaign harus disetujui sebelum materi export dibuat');
    const requestedChannel = text(req.body?.channel || req.query?.channel, 30).toLowerCase();
    const channels = await getChannelRows(campaign.id);
    const channel = channels.find(row => row.channel === requestedChannel) || channels.find(row => row.channel !== 'sultrakita') || channels[0];
    if (!channel) return fail(res, 409, 'Campaign belum memiliki channel');
    if (channel.channel === 'sultrakita' && requestedChannel === 'sultrakita') return fail(res, 409, 'SultraKita memiliki publish native; gunakan export hanya untuk channel manual');
    const [listing] = await query('SELECT id, title, description, price, district, city, image_url, status FROM listings WHERE id = ? AND seller_id = ?', [campaign.listing_id, campaign.seller_id]);
    if (!listing) return fail(res, 404, 'Listing terikat tidak ditemukan');
    const [link] = await query('SELECT destination_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term FROM promo_utm_links WHERE campaign_id = ? AND channel_id = ?', [campaign.id, channel.id]);
    const utm = link || buildUtm(campaign, channel, buildListingUrl(listing));
    const format = req.body?.format === 'text' ? 'text' : 'json';
    const packageData = buildExportPackage(campaign, listing, channel, utm);
    await withTransaction(async db => {
      await db.run('INSERT INTO promo_exports (campaign_id, channel_id, actor_id, format, package) VALUES (?, ?, ?, ?, ?::jsonb)', [campaign.id, channel.id, userId(req), format, JSON.stringify(packageData)]);
      await db.run('UPDATE promo_channels SET state = ?, manual_completed_at = NULL, updated_at = now() WHERE id = ?', ['MANUAL_ACTION_REQUIRED', channel.id]);
      await recordTransition(db, { campaignId: campaign.id, channelId: channel.id, actorId: userId(req), fromState: channel.state, toState: 'MANUAL_ACTION_REQUIRED', metadata: { format, export_created: true } });
      await db.run("UPDATE promo_campaigns SET status = CASE WHEN status IN ('DRAFT','AWAITING_APPROVAL','READY') THEN 'MANUAL_ACTION_REQUIRED' ELSE status END, updated_at = now() WHERE id = ?", [campaign.id]);
      await db.run('INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?::jsonb)', [userId(req), 'promo_manual_export_created', 'promo_campaign', String(campaign.id), JSON.stringify({ channel: channel.channel, format })]);
    });
    ok(res, { campaign_id: campaign.id, channel: channel.channel, state: 'MANUAL_ACTION_REQUIRED', format, package: format === 'text' ? JSON.stringify(packageData, null, 2) : packageData, disclaimer: packageData.disclaimer });
  } catch (error) { next(error); }
});

router.post('/campaigns/:id/publish/sultrakita', requireAuth, async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID campaign tidak valid');
    const campaign = await getOwnedCampaign(Number(req.params.id), req);
    if (!campaign) return fail(res, 404, 'Campaign tidak ditemukan');
    if (!campaign.channels.includes('sultrakita')) return fail(res, 409, 'Channel SultraKita belum dipilih');
    if (!['READY', 'SCHEDULED', 'MANUAL_ACTION_REQUIRED'].includes(campaign.status)) return fail(res, 409, 'Campaign harus disetujui sebelum publish');
    const idempotencyKey = text(req.get('idempotency-key') || req.body?.idempotency_key, 160) || `promo-${campaign.id}-sultrakita`;
    const result = await withTransaction(async db => {
      const [lockedCampaign] = await db.query('SELECT id, status, listing_id, seller_id FROM promo_campaigns WHERE id = ? FOR UPDATE', [campaign.id]);
      const [channel] = await db.query("SELECT id, campaign_id, channel, state, idempotency_key, provider_reference, published_at FROM promo_channels WHERE campaign_id = ? AND channel = 'sultrakita' FOR UPDATE", [campaign.id]);
      if (!channel) throw Object.assign(new Error('Channel SultraKita tidak ditemukan'), { statusCode: 409 });
      if (channel.state === 'PUBLISHED') return { idempotent: true, channel, campaignStatus: lockedCampaign.status };
      if (channel.idempotency_key && channel.idempotency_key === idempotencyKey) return { idempotent: true, channel, campaignStatus: lockedCampaign.status };
      const [listing] = await db.query("SELECT id, seller_id, title, status, is_promoted, promoted_until, boost_until FROM listings WHERE id = ? AND seller_id = ? FOR UPDATE", [lockedCampaign.listing_id, lockedCampaign.seller_id]);
      if (!listing) throw Object.assign(new Error('Listing tidak dimiliki seller campaign'), { statusCode: 403 });
      if (listing.status !== 'active') throw Object.assign(new Error('Listing harus aktif untuk publish native'), { statusCode: 409 });
      const [updated] = await db.query("UPDATE listings SET is_promoted = TRUE, promoted_until = (CURRENT_TIMESTAMP + interval '7 days'), boost_until = (CURRENT_TIMESTAMP + interval '7 days'), updated_at = CURRENT_TIMESTAMP WHERE id = ? AND seller_id = ? AND status = 'active' RETURNING id, is_promoted, promoted_until, boost_until", [listing.id, lockedCampaign.seller_id]);
      if (!updated) throw Object.assign(new Error('Native publish tidak mengubah listing'), { statusCode: 409 });
      await db.run('UPDATE promo_channels SET state = ?, idempotency_key = ?, provider_reference = ?, published_at = now(), state_changed_at = now(), updated_at = now() WHERE id = ?', ['PUBLISHED', idempotencyKey, `sultrakita-listing-${listing.id}`, channel.id]);
      await recordTransition(db, { campaignId: campaign.id, channelId: channel.id, actorId: userId(req), fromState: channel.state, toState: 'PUBLISHED', providerReference: `sultrakita-listing-${listing.id}`, metadata: { target: 'marketplace', listing_id: listing.id, idempotency_key: idempotencyKey } });
      const [remaining] = await db.query("SELECT COUNT(*)::int AS total FROM promo_channels WHERE campaign_id = ? AND state NOT IN ('PUBLISHED')", [campaign.id]);
      const nextCampaignStatus = Number(remaining?.total || 0) === 0 ? 'PUBLISHED' : 'MANUAL_ACTION_REQUIRED';
      await db.run('UPDATE promo_campaigns SET status = ?, published_at = CASE WHEN ? = \'PUBLISHED\' THEN now() ELSE published_at END, updated_at = now() WHERE id = ?', [nextCampaignStatus, nextCampaignStatus, campaign.id]);
      await db.run('INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?::jsonb)', [userId(req), 'promo_native_sultrakita_published', 'promo_campaign', String(campaign.id), JSON.stringify({ listing_id: listing.id, provider_reference: `sultrakita-listing-${listing.id}`, idempotency_key: idempotencyKey })]);
      return { idempotent: false, channel: { ...channel, state: 'PUBLISHED', provider_reference: `sultrakita-listing-${listing.id}` }, campaignStatus: nextCampaignStatus, listing: updated };
    });
    ok(res, { campaign_id: campaign.id, channel: 'sultrakita', state: 'PUBLISHED', campaign_status: result.campaignStatus, provider_reference: result.channel.provider_reference || `sultrakita-listing-${campaign.listing_id}`, listing: result.listing || null, idempotent: result.idempotent, message: 'Listing berhasil dipromosikan pada marketplace SultraKita. Ini bukan publikasi ke platform pihak ketiga.' });
  } catch (error) {
    if (error.statusCode) return fail(res, error.statusCode, error.message);
    if (error.code === '23505') return fail(res, 409, 'Publish dengan idempotency key tersebut sudah diproses');
    next(error);
  }
});

router.get('/utm/:id', requireAuth, async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID campaign tidak valid');
    const campaign = await getOwnedCampaign(Number(req.params.id), req);
    if (!campaign) return fail(res, 404, 'Campaign tidak ditemukan');
    const links = await query('SELECT id, campaign_id, channel_id, destination_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term, created_at FROM promo_utm_links WHERE campaign_id = ? ORDER BY id', [campaign.id]);
    ok(res, links);
  } catch (error) { next(error); }
});

router.post('/events', async (req, res, next) => {
  try {
    const body = req.body || {};
    const eventName = text(body.event_name, 40).toLowerCase();
    if (!EVENT_NAMES.has(eventName)) return fail(res, 422, 'event_name tidak valid');
    if (!positiveInt(body.campaign_id) || !positiveInt(body.channel_id)) return fail(res, 422, 'campaign_id dan channel_id wajib valid');
    const eventKey = text(body.event_key || req.get('idempotency-key'), 180);
    if (eventKey.length < 8) return fail(res, 422, 'event_key/idempotency-key wajib diisi');
    const [channel] = await query('SELECT id, campaign_id, channel FROM promo_channels WHERE id = ? AND campaign_id = ?', [Number(body.channel_id), Number(body.campaign_id)]);
    if (!channel) return fail(res, 404, 'Channel campaign tidak ditemukan');
    const value = jsonObject(body.value);
    const result = await run('INSERT INTO promo_events (campaign_id, channel_id, event_name, event_key, value) VALUES (?, ?, ?, ?, ?::jsonb) ON CONFLICT (event_key) DO NOTHING', [Number(body.campaign_id), Number(body.channel_id), eventName, eventKey, JSON.stringify(value)]);
    ok(res, { accepted: Boolean(result.rowCount), duplicate: !result.rowCount, event_name: eventName, campaign_id: Number(body.campaign_id), channel_id: Number(body.channel_id) });
  } catch (error) { next(error); }
});

router.get('/analytics', requireAuth, async (req, res, next) => {
  try {
    const campaignId = positiveInt(req.query.campaign_id) ? Number(req.query.campaign_id) : null;
    if (campaignId) {
      const campaign = await getOwnedCampaign(campaignId, req);
      if (!campaign) return fail(res, 404, 'Campaign tidak ditemukan');
    }
    const campaignClause = isAdmin(req) ? (campaignId ? 'WHERE pe.campaign_id = ?' : '') : (campaignId ? 'WHERE pc.owner_id = ? AND pe.campaign_id = ?' : 'WHERE pc.owner_id = ?');
    const params = isAdmin(req) ? (campaignId ? [campaignId] : []) : (campaignId ? [userId(req), campaignId] : [userId(req)]);
    const rows = await query(`SELECT pe.event_name, pc.channel, COUNT(*)::int AS total FROM promo_events pe JOIN promo_campaigns pc ON pc.id = pe.campaign_id ${campaignClause} GROUP BY pe.event_name, pc.channel ORDER BY total DESC, pe.event_name`, params);
    const totals = Object.fromEntries(rows.map(row => [`${row.channel}:${row.event_name}`, Number(row.total)]));
    const totalEvents = rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
    ok(res, { campaign_id: campaignId, totals, rows, insufficient_data: totalEvents < 1, note: totalEvents < 1 ? 'Belum ada event yang diterima; rekomendasi performa belum dapat dibuat.' : 'Metrik hanya mencerminkan event yang diterima dan deduplikasi event_key.' });
  } catch (error) { next(error); }
});

router.get('/connections', requireAuth, (_req, res) => ok(res, CHANNELS.map(channel => ({ channel, state: channel === 'sultrakita' ? 'CONNECTED' : 'NOT_CONNECTED', direct_publish: channel === 'sultrakita', official_api_configured: channel === 'sultrakita', manual_fallback: channel !== 'sultrakita', permission_scope: [], token_expiry: null }))));

module.exports = { router, buildUtm, buildExportPackage, normalizeChannels, CAMPAIGN_STATES };

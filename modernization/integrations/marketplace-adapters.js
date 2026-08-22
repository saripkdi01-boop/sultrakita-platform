/**
 * Authorized adapter boundary for external marketplace catalogs.
 * This module never scrapes marketplace pages. Each adapter must be backed by
 * an approved API, seller authorization, or an explicitly permitted feed.
 */

export const SOURCE = Object.freeze({
  META_MARKETPLACE: 'facebook_marketplace',
  SHOPEE: 'shopee',
  TOKOPEDIA: 'tokopedia',
  PARTNER_FEED: 'partner_feed',
});

export function normalizeExternalListing(raw, source) {
  if (!raw || !raw.external_id || !raw.title || !raw.url) {
    throw new Error('External listing payload is incomplete');
  }
  return {
    source,
    external_id: String(raw.external_id).slice(0, 160),
    title: String(raw.title).trim().slice(0, 180),
    description: String(raw.description || '').trim().slice(0, 2000),
    price: Number.isFinite(Number(raw.price)) ? Number(raw.price) : null,
    currency: String(raw.currency || 'IDR').slice(0, 3),
    category: String(raw.category || 'lainnya').slice(0, 80),
    city: String(raw.city || 'Kendari').slice(0, 80),
    province: String(raw.province || 'Sulawesi Tenggara').slice(0, 80),
    url: String(raw.url).slice(0, 1000),
    thumbnail_url: raw.thumbnail_url ? String(raw.thumbnail_url).slice(0, 1000) : null,
    seller_name: raw.seller_name ? String(raw.seller_name).slice(0, 160) : null,
    is_demo: Boolean(raw.is_demo),
    observed_at: raw.observed_at || new Date().toISOString(),
    provenance: raw.provenance || 'authorized_feed',
  };
}

export function adapterConfig(source, env = {}) {
  const configs = {
    [SOURCE.META_MARKETPLACE]: { enabled: env.META_CONTENT_LIBRARY_ENABLED === 'true', requiresApproval: true, token: env.META_CONTENT_LIBRARY_TOKEN },
    [SOURCE.SHOPEE]: { enabled: env.SHOPEE_SYNC_ENABLED === 'true', requiresApproval: true, token: env.SHOPEE_PARTNER_TOKEN },
    [SOURCE.TOKOPEDIA]: { enabled: env.TOKOPEDIA_SYNC_ENABLED === 'true', requiresApproval: true, token: env.TOKOPEDIA_PARTNER_TOKEN },
    [SOURCE.PARTNER_FEED]: { enabled: env.PARTNER_FEED_ENABLED === 'true', requiresApproval: true, token: env.PARTNER_FEED_TOKEN },
  };
  return configs[source] || { enabled: false, requiresApproval: true, token: null };
}

export async function fetchAuthorizedListings(source, options = {}) {
  const { baseUrl, token, query = 'Kendari Sulawesi Tenggara' } = options;
  if (!baseUrl || !token) throw new Error(`${source} adapter requires an approved base URL and token`);
  const response = await fetch(`${baseUrl}?q=${encodeURIComponent(query)}&city=Kendari&province=Sulawesi%20Tenggara`, {
    headers: { authorization: `Bearer ${token}`, accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`${source} adapter failed with HTTP ${response.status}`);
  const payload = await response.json();
  const rows = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [];
  return rows.map((row) => normalizeExternalListing(row, source));
}

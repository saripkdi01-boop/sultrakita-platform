-- SUKI PROMO HUB P0
-- Additive and idempotent. Runtime IDs stay BIGINT to match the legacy Express/PostgreSQL schema.
-- Provider publishing is intentionally not represented as success here; external channels remain explicit fallbacks until P2.

CREATE TABLE IF NOT EXISTS promo_campaigns (
  id BIGSERIAL PRIMARY KEY,
  owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 120),
  objective TEXT NOT NULL CHECK (objective IN ('awareness','traffic','leads','sales','engagement','retention')),
  audience_filter JSONB NOT NULL DEFAULT '{}'::jsonb,
  location TEXT,
  budget BIGINT CHECK (budget IS NULL OR budget >= 0),
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  channels TEXT[] NOT NULL DEFAULT ARRAY['sultrakita']::TEXT[],
  media_asset_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  cta TEXT NOT NULL DEFAULT 'Lihat listing',
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','AWAITING_APPROVAL','READY','SCHEDULED','PUBLISHED','FAILED','MANUAL_ACTION_REQUIRED','CANCELLED')),
  idempotency_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  UNIQUE(owner_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS promo_channels (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES promo_campaigns(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('sultrakita','facebook','instagram','tiktok','google','whatsapp')),
  state TEXT NOT NULL DEFAULT 'NOT_CONNECTED' CHECK (state IN ('CONNECTED','NOT_CONNECTED','READY','AWAITING_APPROVAL','PUBLISHED','FAILED','MANUAL_ACTION_REQUIRED')),
  provider_reference TEXT,
  error_code TEXT,
  error_message TEXT,
  idempotency_key TEXT,
  state_changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  manual_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, channel),
  UNIQUE(idempotency_key)
);

CREATE TABLE IF NOT EXISTS promo_channel_events (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES promo_campaigns(id) ON DELETE CASCADE,
  channel_id BIGINT REFERENCES promo_channels(id) ON DELETE SET NULL,
  actor_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  from_state TEXT,
  to_state TEXT NOT NULL,
  provider_reference TEXT,
  error_code TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promo_utm_links (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES promo_campaigns(id) ON DELETE CASCADE,
  channel_id BIGINT REFERENCES promo_channels(id) ON DELETE CASCADE,
  destination_url TEXT NOT NULL,
  utm_source TEXT NOT NULL,
  utm_medium TEXT NOT NULL,
  utm_campaign TEXT NOT NULL,
  utm_content TEXT NOT NULL,
  utm_term TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, channel_id),
  UNIQUE(destination_url)
);

CREATE TABLE IF NOT EXISTS promo_exports (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES promo_campaigns(id) ON DELETE CASCADE,
  channel_id BIGINT REFERENCES promo_channels(id) ON DELETE SET NULL,
  actor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  format TEXT NOT NULL DEFAULT 'json' CHECK (format IN ('json','text')),
  package JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promo_events (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT REFERENCES promo_campaigns(id) ON DELETE CASCADE,
  channel_id BIGINT REFERENCES promo_channels(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL CHECK (event_name IN ('impression','view','click','lead','whatsapp_conversation','listing_view','favorite','order')),
  event_key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_key)
);

CREATE INDEX IF NOT EXISTS promo_campaigns_owner_updated_idx ON promo_campaigns(owner_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS promo_campaigns_listing_idx ON promo_campaigns(listing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS promo_campaigns_status_idx ON promo_campaigns(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS promo_channels_campaign_state_idx ON promo_channels(campaign_id, state, updated_at DESC);
CREATE INDEX IF NOT EXISTS promo_channel_events_campaign_created_idx ON promo_channel_events(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS promo_utm_links_campaign_idx ON promo_utm_links(campaign_id, channel_id);
CREATE INDEX IF NOT EXISTS promo_exports_campaign_created_idx ON promo_exports(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS promo_events_campaign_created_idx ON promo_events(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS promo_events_channel_created_idx ON promo_events(channel_id, created_at DESC);

ALTER TABLE promo_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_channel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_utm_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS promo_campaigns_no_client_access ON promo_campaigns;
CREATE POLICY promo_campaigns_no_client_access ON promo_campaigns FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS promo_channels_no_client_access ON promo_channels;
CREATE POLICY promo_channels_no_client_access ON promo_channels FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS promo_channel_events_no_client_access ON promo_channel_events;
CREATE POLICY promo_channel_events_no_client_access ON promo_channel_events FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS promo_utm_links_no_client_access ON promo_utm_links;
CREATE POLICY promo_utm_links_no_client_access ON promo_utm_links FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS promo_exports_no_client_access ON promo_exports;
CREATE POLICY promo_exports_no_client_access ON promo_exports FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS promo_events_no_client_access ON promo_events;
CREATE POLICY promo_events_no_client_access ON promo_events FOR ALL USING (false) WITH CHECK (false);

-- No destructive rollback is included in the forward migration. A corrective migration may drop
-- these tables only after an export and an explicit production rollback decision.
COMMENT ON TABLE promo_campaigns IS 'P0 campaign drafts bound to an existing seller-owned listing; server identity is authoritative.';
COMMENT ON TABLE promo_channels IS 'Explicit per-channel state machine. External provider states never imply a successful publish.';
COMMENT ON TABLE promo_utm_links IS 'Unique campaign/channel attribution links generated server-side.';
COMMENT ON TABLE promo_events IS 'Only events accepted by the API are stored; event_key prevents replay duplication.';

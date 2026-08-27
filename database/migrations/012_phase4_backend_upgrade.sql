-- SultraKita Phase 4 backend upgrade.
-- Additive only: preserve existing BIGINT runtime IDs and existing marketplace tables.

ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS views_count BIGINT NOT NULL DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS favorites_count BIGINT NOT NULL DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS promoted_until TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS seller_rating NUMERIC(3,2) NOT NULL DEFAULT 0;

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS listing_views (
  id BIGSERIAL PRIMARY KEY,
  listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS search_history (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL CHECK (char_length(query) BETWEEN 2 AND 160),
  results_count INTEGER NOT NULL DEFAULT 0 CHECK (results_count >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_listings_category_phase4 ON listings(category_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_location_phase4 ON listings(district, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_price_phase4 ON listings(price, status);
CREATE INDEX IF NOT EXISTS idx_listings_featured_phase4 ON listings(is_featured, created_at DESC) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_listings_promoted_phase4 ON listings(is_promoted, promoted_until, created_at DESC) WHERE is_promoted = TRUE;
CREATE INDEX IF NOT EXISTS idx_favorites_user_phase4 ON favorites(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_phase4 ON favorites(listing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread_phase4 ON notifications(user_id, created_at DESC) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_listing_views_listing_phase4 ON listing_views(listing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listing_views_created_phase4 ON listing_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_user_phase4 ON search_history(user_id, created_at DESC);

UPDATE listings SET views_count = views WHERE COALESCE(views_count, 0) = 0 AND COALESCE(views, 0) > 0;

-- Admin product import provenance and review metadata.
ALTER TABLE listings ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS source_platform TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS provenance TEXT NOT NULL DEFAULT 'seller_submitted';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS imported_by BIGINT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS imported_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_listings_source_url ON listings(source_url) WHERE source_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_provenance ON listings(provenance, created_at DESC);

CREATE TABLE IF NOT EXISTS admin_listing_import_drafts (
  id BIGSERIAL PRIMARY KEY,
  admin_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  source_platform TEXT NOT NULL,
  source_title TEXT,
  source_description TEXT,
  image_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  draft_title TEXT NOT NULL,
  draft_description TEXT NOT NULL,
  price BIGINT NOT NULL DEFAULT 0 CHECK(price >= 0),
  category_id BIGINT NOT NULL REFERENCES categories(id),
  condition TEXT NOT NULL DEFAULT 'new' CHECK(condition IN ('new','second')),
  district TEXT NOT NULL DEFAULT 'Kendari',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','discarded')),
  published_listing_id BIGINT REFERENCES listings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_import_drafts_admin_status ON admin_listing_import_drafts(admin_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_import_drafts_source ON admin_listing_import_drafts(source_url);

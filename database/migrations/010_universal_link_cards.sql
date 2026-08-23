ALTER TABLE external_listings ADD COLUMN IF NOT EXISTS item_type TEXT NOT NULL DEFAULT 'product';
ALTER TABLE external_listings ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE external_listings ADD COLUMN IF NOT EXISTS summary_source TEXT NOT NULL DEFAULT 'metadata_fallback';
CREATE INDEX IF NOT EXISTS idx_external_listings_item_category ON external_listings(item_type, category, observed_at DESC);

UPDATE external_listings SET item_type = 'product' WHERE item_type IS NULL OR item_type = '';
UPDATE external_listings SET summary_source = 'metadata_fallback' WHERE summary_source IS NULL OR summary_source = '';

ALTER TABLE external_jobs ADD COLUMN IF NOT EXISTS image_url TEXT;
CREATE INDEX IF NOT EXISTS idx_external_jobs_source_observed ON external_jobs(source, observed_at DESC);

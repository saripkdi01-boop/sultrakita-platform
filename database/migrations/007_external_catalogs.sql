CREATE TABLE IF NOT EXISTS external_listings (
  id BIGSERIAL PRIMARY KEY,
  external_id TEXT NOT NULL,
  source TEXT NOT NULL,
  source_label TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  city TEXT,
  province TEXT,
  price BIGINT,
  image_url TEXT,
  url TEXT NOT NULL,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  provenance TEXT NOT NULL DEFAULT 'authorized_partner_feed',
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(source, external_id)
);

CREATE INDEX IF NOT EXISTS idx_external_listings_region ON external_listings(province, city, category);
CREATE INDEX IF NOT EXISTS idx_external_listings_observed ON external_listings(observed_at DESC);

CREATE TABLE IF NOT EXISTS external_jobs (
  id BIGSERIAL PRIMARY KEY,
  external_id TEXT NOT NULL,
  source TEXT NOT NULL,
  source_label TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  city TEXT,
  province TEXT,
  category TEXT,
  employment_type TEXT,
  salary_text TEXT,
  description TEXT,
  url TEXT NOT NULL,
  posted_at TEXT,
  expires_at TEXT,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  provenance TEXT NOT NULL DEFAULT 'authorized_partner_feed',
  raw_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(source, external_id)
);

CREATE INDEX IF NOT EXISTS idx_external_jobs_region ON external_jobs(province, city, category);
CREATE INDEX IF NOT EXISTS idx_external_jobs_observed ON external_jobs(observed_at DESC);

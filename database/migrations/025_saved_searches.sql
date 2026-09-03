-- Persistent saved marketplace searches. Additive and safe to rerun.
CREATE TABLE IF NOT EXISTS saved_searches (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  query TEXT NOT NULL DEFAULT '' CHECK (char_length(query) <= 160),
  category TEXT CHECK (category IS NULL OR char_length(category) <= 80),
  district TEXT CHECK (district IS NULL OR char_length(district) <= 80),
  min_price INTEGER CHECK (min_price IS NULL OR min_price >= 0),
  max_price INTEGER CHECK (max_price IS NULL OR max_price >= 0),
  sort TEXT NOT NULL DEFAULT 'newest' CHECK (sort IN ('newest', 'price_asc', 'price_desc')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_updated ON saved_searches(user_id, updated_at DESC);

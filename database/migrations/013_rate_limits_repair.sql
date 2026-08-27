-- Additive repair: the API rate limiter already expects this table.
-- Keep the table contract compatible with server.js and make the migration idempotent.
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL,
  hit_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_window
  ON rate_limits(window_started_at);

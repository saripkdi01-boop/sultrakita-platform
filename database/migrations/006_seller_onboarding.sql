CREATE TABLE IF NOT EXISTS seller_onboarding_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 4),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  account_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  store_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  product_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_seller_onboarding_status ON seller_onboarding_progress(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_seller_onboarding_updated ON seller_onboarding_progress(updated_at DESC);

-- Launch campaign: Ajak Teman, Tumbuh Bersama
-- Additive only. Apply through the approved migration workflow after schema review.
CREATE TABLE IF NOT EXISTS referral_profiles (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS referral_events (
  id BIGSERIAL PRIMARY KEY,
  referrer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('link_visit','signup','qualified')),
  source_channel TEXT,
  event_key TEXT NOT NULL UNIQUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS point_redemptions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL CHECK (points > 0),
  rupiah_amount INTEGER NOT NULL CHECK (rupiah_amount > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','paid','rejected')),
  payout_method TEXT,
  payout_account_masked TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_referral_events_referrer_created ON referral_events(referrer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_events_code_created ON referral_events(referral_code, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_point_redemptions_user_created ON point_redemptions(user_id, created_at DESC);
ALTER TABLE referral_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_redemptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS referral_profiles_no_client_access ON referral_profiles;
CREATE POLICY referral_profiles_no_client_access ON referral_profiles FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS referral_events_no_client_access ON referral_events;
CREATE POLICY referral_events_no_client_access ON referral_events FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS point_redemptions_no_client_access ON point_redemptions;
CREATE POLICY point_redemptions_no_client_access ON point_redemptions FOR ALL USING (false) WITH CHECK (false);
COMMENT ON TABLE referral_profiles IS 'Server-owned referral identity for the launch campaign.';
COMMENT ON TABLE point_redemptions IS 'Review queue; no automatic cash payout is implied by point balance.';

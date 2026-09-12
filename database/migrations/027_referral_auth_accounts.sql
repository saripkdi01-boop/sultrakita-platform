-- Next/Supabase Auth-native referral accounts.
-- Complements 026 for the UUID-based production runtime.
-- Bare PostgreSQL CI does not provide auth.users, so this migration is a no-op there.
DO $migration$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL THEN
    EXECUTE $sql$
      CREATE TABLE IF NOT EXISTS referral_accounts (
        auth_user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        referral_code TEXT NOT NULL UNIQUE,
        referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        total_points INTEGER NOT NULL DEFAULT 0 CHECK (total_points >= 0),
        lifetime_points INTEGER NOT NULL DEFAULT 0 CHECK (lifetime_points >= 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS referral_account_events (
        id BIGSERIAL PRIMARY KEY,
        referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        referral_code TEXT NOT NULL,
        event_type TEXT NOT NULL CHECK (event_type IN ('link_visit','signup','qualified')),
        source_channel TEXT,
        event_key TEXT NOT NULL UNIQUE,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS referral_account_redemptions (
        id BIGSERIAL PRIMARY KEY,
        auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        points INTEGER NOT NULL CHECK (points > 0),
        rupiah_amount INTEGER NOT NULL CHECK (rupiah_amount > 0),
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','paid','rejected')),
        payout_method TEXT,
        payout_account_masked TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        reviewed_at TIMESTAMPTZ
      );
      CREATE INDEX IF NOT EXISTS referral_account_events_referrer_created_idx ON referral_account_events(referrer_id, created_at DESC);
      CREATE INDEX IF NOT EXISTS referral_account_redemptions_user_created_idx ON referral_account_redemptions(auth_user_id, created_at DESC);
      ALTER TABLE referral_accounts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE referral_account_events ENABLE ROW LEVEL SECURITY;
      ALTER TABLE referral_account_redemptions ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS referral_accounts_no_client_access ON referral_accounts;
      CREATE POLICY referral_accounts_no_client_access ON referral_accounts FOR ALL USING (false) WITH CHECK (false);
      DROP POLICY IF EXISTS referral_account_events_no_client_access ON referral_account_events;
      CREATE POLICY referral_account_events_no_client_access ON referral_account_events FOR ALL USING (false) WITH CHECK (false);
      DROP POLICY IF EXISTS referral_account_redemptions_no_client_access ON referral_account_redemptions;
      CREATE POLICY referral_account_redemptions_no_client_access ON referral_account_redemptions FOR ALL USING (false) WITH CHECK (false);
    $sql$;
  END IF;
END
$migration$;

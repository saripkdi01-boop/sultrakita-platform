CREATE TABLE IF NOT EXISTS auth_otp_challenges (
  id BIGSERIAL PRIMARY KEY,
  channel TEXT NOT NULL CHECK(channel IN ('whatsapp','email')),
  destination_hash TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts >= 0),
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auth_otp_destination_idx ON auth_otp_challenges(channel, destination_hash, expires_at DESC);
CREATE INDEX IF NOT EXISTS auth_otp_expiry_idx ON auth_otp_challenges(expires_at) WHERE consumed_at IS NULL;

CREATE TABLE IF NOT EXISTS auth_login_exchanges (
  id BIGSERIAL PRIMARY KEY,
  code_hash TEXT NOT NULL UNIQUE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auth_login_exchange_expiry_idx ON auth_login_exchanges(expires_at) WHERE consumed_at IS NULL;

ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_picture_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub) WHERE google_sub IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email, email_verified) WHERE email IS NOT NULL;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'otp_challenges_channel_check') THEN
    ALTER TABLE otp_challenges ADD CONSTRAINT otp_challenges_channel_check CHECK (channel IN ('whatsapp', 'email'));
  END IF;
END $$;

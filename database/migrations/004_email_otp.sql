ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE otp_challenges ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE otp_challenges ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE otp_challenges ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'whatsapp';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'otp_challenges_destination_check') THEN
    ALTER TABLE otp_challenges ADD CONSTRAINT otp_challenges_destination_check CHECK (phone IS NOT NULL OR email IS NOT NULL);
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_otp_email_expiry ON otp_challenges(email, expires_at DESC) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_otp_channel_expiry ON otp_challenges(channel, expires_at DESC);

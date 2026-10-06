'use strict';

// Skema auth & feed aditif (idempoten) — diekstrak dari server.js tanpa perubahan SQL.
// Dijalankan lazy + memoized: sekali per proses, gagal -> boleh dicoba lagi.
const { query } = require('../database');

const AUTH_SCHEMA_STATEMENTS = `
  ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS google_picture_url TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
  ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;
  ALTER TABLE otp_challenges ADD COLUMN IF NOT EXISTS email TEXT;
  ALTER TABLE otp_challenges ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'whatsapp';
  ALTER TABLE otp_challenges ALTER COLUMN phone DROP NOT NULL;
  CREATE INDEX IF NOT EXISTS idx_otp_email_expiry ON otp_challenges(email, expires_at DESC) WHERE email IS NOT NULL;
  CREATE INDEX IF NOT EXISTS idx_otp_channel_expiry ON otp_challenges(channel, expires_at DESC);
  CREATE TABLE IF NOT EXISTS auth_otp_challenges (id BIGSERIAL PRIMARY KEY, channel TEXT NOT NULL CHECK(channel IN ('whatsapp','email')), destination_hash TEXT NOT NULL, code_hash TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts >= 0), expires_at TIMESTAMPTZ NOT NULL, consumed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
  CREATE INDEX IF NOT EXISTS auth_otp_destination_idx ON auth_otp_challenges(channel, destination_hash, expires_at DESC);
  CREATE INDEX IF NOT EXISTS auth_otp_expiry_idx ON auth_otp_challenges(expires_at) WHERE consumed_at IS NULL;
  CREATE TABLE IF NOT EXISTS auth_login_exchanges (id BIGSERIAL PRIMARY KEY, code_hash TEXT NOT NULL UNIQUE, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at TIMESTAMPTZ NOT NULL, consumed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
  CREATE INDEX IF NOT EXISTS auth_login_exchange_expiry_idx ON auth_login_exchanges(expires_at) WHERE consumed_at IS NULL;
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub) WHERE google_sub IS NOT NULL;
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email)) WHERE email IS NOT NULL;
  CREATE TABLE IF NOT EXISTS seller_onboarding_progress (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 4), status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')), account_data JSONB NOT NULL DEFAULT '{}'::jsonb, store_data JSONB NOT NULL DEFAULT '{}'::jsonb, product_data JSONB NOT NULL DEFAULT '{}'::jsonb, completed_steps JSONB NOT NULL DEFAULT '[]'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), completed_at TIMESTAMPTZ);
  CREATE INDEX IF NOT EXISTS idx_seller_onboarding_status ON seller_onboarding_progress(status, updated_at DESC);
  CREATE TABLE IF NOT EXISTS external_listings (id BIGSERIAL PRIMARY KEY, external_id TEXT NOT NULL, source TEXT NOT NULL, source_label TEXT NOT NULL, title TEXT NOT NULL, category TEXT, city TEXT, province TEXT, price BIGINT, image_url TEXT, url TEXT NOT NULL, item_type TEXT NOT NULL DEFAULT 'product', description TEXT, summary_source TEXT NOT NULL DEFAULT 'metadata_fallback', is_demo BOOLEAN NOT NULL DEFAULT FALSE, provenance TEXT NOT NULL DEFAULT 'authorized_partner_feed', observed_at TIMESTAMPTZ NOT NULL DEFAULT now(), raw_json JSONB NOT NULL DEFAULT '{}'::jsonb, UNIQUE(source, external_id));
  ALTER TABLE external_listings ADD COLUMN IF NOT EXISTS item_type TEXT NOT NULL DEFAULT 'product';
  ALTER TABLE external_listings ADD COLUMN IF NOT EXISTS description TEXT;
  ALTER TABLE external_listings ADD COLUMN IF NOT EXISTS summary_source TEXT NOT NULL DEFAULT 'metadata_fallback';
  CREATE INDEX IF NOT EXISTS idx_external_listings_region ON external_listings(province, city, category);
  CREATE INDEX IF NOT EXISTS idx_external_listings_observed ON external_listings(observed_at DESC);
  CREATE TABLE IF NOT EXISTS external_jobs (id BIGSERIAL PRIMARY KEY, external_id TEXT NOT NULL, source TEXT NOT NULL, source_label TEXT NOT NULL, title TEXT NOT NULL, company TEXT NOT NULL, city TEXT, province TEXT, category TEXT, employment_type TEXT, salary_text TEXT, description TEXT, url TEXT NOT NULL, image_url TEXT, posted_at TEXT, expires_at TEXT, observed_at TIMESTAMPTZ NOT NULL DEFAULT now(), provenance TEXT NOT NULL DEFAULT 'authorized_partner_feed', raw_json JSONB NOT NULL DEFAULT '{}'::jsonb, UNIQUE(source, external_id));
  ALTER TABLE external_jobs ADD COLUMN IF NOT EXISTS image_url TEXT;
  CREATE INDEX IF NOT EXISTS idx_external_jobs_region ON external_jobs(province, city, category);
  CREATE INDEX IF NOT EXISTS idx_external_jobs_observed ON external_jobs(observed_at DESC);
  CREATE TABLE IF NOT EXISTS telegram_admin_audit (id BIGSERIAL PRIMARY KEY, update_id BIGINT NOT NULL UNIQUE, chat_id TEXT NOT NULL, user_id TEXT, command TEXT, outcome TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
  CREATE INDEX IF NOT EXISTS idx_telegram_admin_audit_created ON telegram_admin_audit(created_at DESC);
`;

let authSchemaPromise;
const ensureAuthSchema = () => {
  if (authSchemaPromise === undefined || authSchemaPromise === null) {
    authSchemaPromise = query(AUTH_SCHEMA_STATEMENTS).catch(error => { authSchemaPromise = null; throw error; });
  }
  return authSchemaPromise;
};

module.exports = { ensureAuthSchema, AUTH_SCHEMA_STATEMENTS };

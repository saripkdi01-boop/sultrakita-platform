  CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'tag',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'buyer' CHECK(role IN ('buyer','seller','admin')),
    district TEXT NOT NULL DEFAULT 'Kendari',
    is_verified BIGINT NOT NULL DEFAULT 0,
    phone_verified BIGINT NOT NULL DEFAULT 0,
    verification_status TEXT NOT NULL DEFAULT 'unverified',
    verification_note TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS listings (
    id BIGSERIAL PRIMARY KEY,
    seller_id BIGINT,
    category_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price BIGINT NOT NULL CHECK(price >= 0),
    condition TEXT NOT NULL DEFAULT 'new' CHECK(condition IN ('new','second')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','sold','archived')),
    district TEXT NOT NULL DEFAULT 'Kendari',
    city TEXT NOT NULL DEFAULT 'Kendari',
    province TEXT NOT NULL DEFAULT 'Sulawesi Tenggara',
    image_url TEXT,
    views BIGINT NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );
  CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    listing_id BIGINT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_listings_search ON listings(status, category_id, district, price);
  CREATE INDEX IF NOT EXISTS idx_listings_created ON listings(created_at DESC);
  CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT,
    user_id BIGINT,
    author_name TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'visible' CHECK(status IN ('visible','pending','hidden')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );
  CREATE TABLE IF NOT EXISTS suggestions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    name TEXT NOT NULL,
    email TEXT,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','planned','done','dismissed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );
  CREATE TABLE IF NOT EXISTS donation_campaigns (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    target_amount BIGINT NOT NULL CHECK(target_amount > 0),
    current_amount BIGINT NOT NULL DEFAULT 0 CHECK(current_amount >= 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed','paused')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS donations (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT,
    name TEXT NOT NULL,
    email TEXT,
    amount BIGINT NOT NULL CHECK(amount > 0),
    message TEXT,
    transaction_id TEXT UNIQUE,
    payment_method TEXT,
    payment_provider TEXT,
    provider_reference TEXT,
    refunded_amount BIGINT NOT NULL DEFAULT 0 CHECK(refunded_amount >= 0),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK(payment_status IN ('pending','success','failed','expired')),
    status TEXT NOT NULL DEFAULT 'pledged' CHECK(status IN ('pledged','confirmed','cancelled')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(campaign_id) REFERENCES donation_campaigns(id) ON DELETE SET NULL
  );
  CREATE INDEX IF NOT EXISTS idx_donations_campaign_status ON donations(campaign_id, payment_status);
  CREATE TABLE IF NOT EXISTS donation_refunds (
    id BIGSERIAL PRIMARY KEY,
    transaction_id TEXT NOT NULL UNIQUE,
    amount BIGINT NOT NULL CHECK(amount > 0),
    reason TEXT,
    provider TEXT NOT NULL,
    provider_reference TEXT,
    status TEXT NOT NULL DEFAULT 'requested' CHECK(status IN ('requested','success','failed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS webhook_logs (
    id BIGSERIAL PRIMARY KEY,
    provider TEXT NOT NULL,
    transaction_id TEXT,
    event_status TEXT,
    http_status BIGINT NOT NULL,
    signature_valid BIGINT NOT NULL DEFAULT 0,
    payload TEXT NOT NULL,
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_webhook_logs_created ON webhook_logs(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_webhook_logs_transaction ON webhook_logs(transaction_id, created_at DESC);
  CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT,
    reporter_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','reviewing','resolved','rejected')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_comments_listing ON comments(listing_id, status, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status, created_at DESC);
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    expires_at BIGINT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS otp_challenges (
    id BIGSERIAL PRIMARY KEY,
    phone TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    attempts BIGINT NOT NULL DEFAULT 0,
    expires_at BIGINT NOT NULL,
    consumed_at BIGINT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS seller_verifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    document_type TEXT NOT NULL CHECK(document_type IN ('ktp','nib','other')),
    document_reference TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
    note TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    event_name TEXT NOT NULL CHECK(event_name IN ('page_view','listing_view','search','listing_contact')),
    path TEXT,
    listing_id BIGINT,
    category_slug TEXT,
    district TEXT,
    referrer TEXT,
    user_agent TEXT,
    country_code TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE SET NULL
  );
  CREATE INDEX IF NOT EXISTS idx_analytics_event_time ON analytics_events(event_name, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_analytics_listing ON analytics_events(listing_id, event_name, created_at DESC);
  CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT,
    buyer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','closed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(listing_id, buyer_id, seller_id),
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE SET NULL,
    FOREIGN KEY(buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    body TEXT NOT NULL,
    read_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at ASC);
  CREATE INDEX IF NOT EXISTS idx_verifications_status ON seller_verifications(status, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at DESC);
  CREATE TABLE IF NOT EXISTS listing_images (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    sort_order BIGINT NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE CASCADE
  );

-- SultraKita production hardening: migration 001 additions
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'approved';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS boost_until TIMESTAMPTZ;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE listing_images ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS store_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS store_description TEXT;

UPDATE listings SET slug = regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g') WHERE slug IS NULL;
UPDATE listings SET slug = trim(both '-' from slug) WHERE slug IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_listings_slug_id ON listings(slug, id);
CREATE INDEX IF NOT EXISTS idx_listings_status_created ON listings(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_category_district ON listings(category_id, district, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_boost ON listings(boost_until DESC) WHERE boost_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reports_status_created ON reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read_at, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_phone_expiry ON otp_challenges(phone, expires_at DESC);

CREATE OR REPLACE FUNCTION listings_search_vector_update() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', coalesce(NEW.title, '') || ' ' || coalesce(NEW.description, ''));
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS listings_search_vector_trigger ON listings;
CREATE TRIGGER listings_search_vector_trigger BEFORE INSERT OR UPDATE OF title, description ON listings FOR EACH ROW EXECUTE FUNCTION listings_search_vector_update();
UPDATE listings SET search_vector = to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''));
CREATE INDEX IF NOT EXISTS idx_listings_search_vector ON listings USING GIN(search_vector);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL,
  hit_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_id BIGINT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id BIGINT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO feature_flags(key, enabled, config) VALUES
 ('boost_listing', false, '{"durations":[3,7,30],"prices":{"3":15000,"7":30000,"30":90000}}'),
 ('store_subscription', false, '{"monthly_price":99000}'),
 ('paid_verification', false, '{"price":25000}'),
 ('paid_jobs', false, '{"price":35000}'),
 ('escrow_commission', false, '{"rate":0.02}')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE users ADD COLUMN IF NOT EXISTS rating_average NUMERIC(3,2) NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating_count INTEGER NOT NULL DEFAULT 0;
INSERT INTO categories (name, slug, icon) VALUES ('Properti', 'properti', 'home'), ('Elektronik', 'elektronik', 'smartphone'), ('Kendaraan', 'kendaraan', 'car'), ('Fashion', 'fashion', 'shirt'), ('Perabotan', 'perabotan', 'sofa'), ('Jasa', 'jasa', 'briefcase'), ('Kuliner', 'kuliner', 'utensils'), ('Hobi & Koleksi', 'hobi-koleksi', 'camera'), ('Lowongan Kerja', 'lowongan-kerja', 'job'), ('Lainnya', 'lainnya', 'tag') ON CONFLICT (slug) DO NOTHING;
INSERT INTO donation_campaigns (title, description, target_amount) SELECT 'Dukung SultraKita', 'Bantu biaya operasional marketplace lokal Sulawesi Tenggara.', 50000000 WHERE NOT EXISTS (SELECT 1 FROM donation_campaigns);

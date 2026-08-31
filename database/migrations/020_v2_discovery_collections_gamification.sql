-- SultraKita v2 MVP: hyperlocal discovery, shared collections, and gamification.
-- Additive migration. Existing contracts remain unchanged.

CREATE TABLE IF NOT EXISTS collections (
  id BIGSERIAL PRIMARY KEY,
  owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 120),
  description TEXT CHECK (description IS NULL OR char_length(description) <= 500),
  is_shared BOOLEAN NOT NULL DEFAULT FALSE,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collection_items (
  id BIGSERIAL PRIMARY KEY,
  collection_id BIGINT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  added_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note TEXT CHECK (note IS NULL OR char_length(note) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (collection_id, listing_id)
);

CREATE TABLE IF NOT EXISTS collection_item_votes (
  id BIGSERIAL PRIMARY KEY,
  collection_item_id BIGINT NOT NULL REFERENCES collection_items(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (collection_item_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_points (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0 CHECK (total_points >= 0),
  lifetime_points INTEGER NOT NULL DEFAULT 0 CHECK (lifetime_points >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS point_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount <> 0),
  reason TEXT NOT NULL CHECK (char_length(trim(reason)) BETWEEN 1 AND 120),
  reference_type TEXT,
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS badges (
  id BIGSERIAL PRIMARY KEY,
  badge_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '✦',
  criteria_points INTEGER NOT NULL DEFAULT 0 CHECK (criteria_points >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id BIGINT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_collections_owner_updated ON collections(owner_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_collections_invite_code ON collections(invite_code) WHERE invite_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items(collection_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collection_items_listing ON collection_items(listing_id);
CREATE INDEX IF NOT EXISTS idx_collection_votes_item ON collection_item_votes(collection_item_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_created ON point_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_points_leaderboard ON user_points(total_points DESC, user_id);

INSERT INTO badges (badge_key, name, description, icon, criteria_points) VALUES
  ('rookie_warga', 'Rookie Warga', 'Mulai berkontribusi di SultraKita.', '✦', 10),
  ('warga_aktif', 'Warga Aktif', 'Aktif membantu dan berinteraksi di marketplace.', '◆', 50),
  ('community_champion', 'Community Champion', 'Menjadi salah satu kontributor komunitas paling aktif.', '★', 150)
ON CONFLICT (badge_key) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon, criteria_points = EXCLUDED.criteria_points;

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_item_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- The application uses the existing server-side PostgreSQL connection and BIGINT user IDs.
-- Keep these tables inaccessible to direct browser clients; the Express API enforces ownership.
DROP POLICY IF EXISTS collections_no_client_access ON collections;
CREATE POLICY collections_no_client_access ON collections FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS collection_items_no_client_access ON collection_items;
CREATE POLICY collection_items_no_client_access ON collection_items FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS collection_votes_no_client_access ON collection_item_votes;
CREATE POLICY collection_votes_no_client_access ON collection_item_votes FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS user_points_no_client_access ON user_points;
CREATE POLICY user_points_no_client_access ON user_points FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS point_transactions_no_client_access ON point_transactions;
CREATE POLICY point_transactions_no_client_access ON point_transactions FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS badges_public_read ON badges;
CREATE POLICY badges_public_read ON badges FOR SELECT USING (true);
DROP POLICY IF EXISTS user_badges_public_read ON user_badges;
CREATE POLICY user_badges_public_read ON user_badges FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION award_sultrakita_points(
  p_user_id BIGINT,
  p_amount INTEGER,
  p_reason TEXT,
  p_reference_type TEXT DEFAULT NULL,
  p_reference_id TEXT DEFAULT NULL
) RETURNS TABLE (total_points INTEGER, lifetime_points INTEGER)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF p_user_id IS NULL OR p_amount = 0 THEN
    RAISE EXCEPTION 'user_id dan amount wajib valid';
  END IF;
  IF p_amount < 0 AND NOT EXISTS (
    SELECT 1 FROM user_points WHERE user_id = p_user_id AND total_points + p_amount >= 0
  ) THEN
    RAISE EXCEPTION 'saldo poin tidak mencukupi';
  END IF;
  INSERT INTO user_points(user_id, total_points, lifetime_points)
  VALUES (p_user_id, GREATEST(0, p_amount), GREATEST(0, p_amount))
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = GREATEST(0, user_points.total_points + EXCLUDED.total_points),
    lifetime_points = user_points.lifetime_points + CASE WHEN p_amount > 0 THEN p_amount ELSE 0 END,
    updated_at = now();
  INSERT INTO point_transactions(user_id, amount, reason, reference_type, reference_id)
  VALUES (p_user_id, p_amount, trim(p_reason), p_reference_type, p_reference_id);
  RETURN QUERY SELECT up.total_points, up.lifetime_points FROM user_points up WHERE up.user_id = p_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION award_sultrakita_points(BIGINT, INTEGER, TEXT, TEXT, TEXT) TO service_role;

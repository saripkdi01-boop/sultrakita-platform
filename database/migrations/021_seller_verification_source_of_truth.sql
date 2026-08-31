-- Seller verification hardening: verification_status is canonical.
-- is_verified remains as a synchronized compatibility field for legacy consumers.

UPDATE users
SET verification_status = 'approved'
WHERE LOWER(COALESCE(is_verified::text, 'false')) IN ('1', 'true', 't', 'yes', 'y')
  AND COALESCE(verification_status, 'unverified') <> 'approved';

CREATE OR REPLACE FUNCTION sync_seller_verification_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF COALESCE(NEW.verification_status, 'unverified') = 'unverified' AND LOWER(COALESCE(NEW.is_verified::text, 'false')) IN ('1', 'true', 't', 'yes', 'y') THEN
      NEW.verification_status := 'approved';
    END IF;
    RETURN NEW;
  END IF;

  -- When both fields are sent, the semantic status wins. Legacy boolean-only writes
  -- are translated to a safe approved/unverified status without assuming the legacy
  -- column has boolean type; production currently uses BIGINT while clean CI uses boolean.
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
    RETURN NEW;
  ELSIF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    NEW.verification_status := CASE WHEN LOWER(COALESCE(NEW.is_verified::text, 'false')) IN ('1', 'true', 't', 'yes', 'y') THEN 'approved' ELSE 'unverified' END;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_verification_sync ON users;
CREATE TRIGGER users_verification_sync
BEFORE INSERT OR UPDATE OF is_verified, verification_status ON users
FOR EACH ROW EXECUTE FUNCTION sync_seller_verification_fields();

CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status, role);
CREATE INDEX IF NOT EXISTS idx_listings_discovery_filters ON listings(status, district, category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_seller_status_created ON listings(seller_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_listing_created ON comments(listing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status_created ON reports(status, created_at DESC);

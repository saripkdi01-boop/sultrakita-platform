-- Align production listings with the admin moderation contract used by publish and list endpoints.
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'pending';

UPDATE listings
SET moderation_status = CASE
  WHEN status = 'active' THEN 'approved'
  WHEN status = 'archived' THEN 'rejected'
  ELSE 'pending'
END
WHERE moderation_status = 'pending';

CREATE INDEX IF NOT EXISTS idx_listings_moderation_status
  ON listings(moderation_status, updated_at DESC);

ALTER TABLE listings
  DROP CONSTRAINT IF EXISTS listings_moderation_status_check;

ALTER TABLE listings
  ADD CONSTRAINT listings_moderation_status_check
  CHECK (moderation_status IN ('pending', 'approved', 'rejected'));

COMMENT ON COLUMN listings.moderation_status IS 'Admin moderation state used by the admin API and publish workflow.';

-- Keep the migration safe to re-run when the constraint already exists.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'listings_moderation_status_check'
      AND conrelid = 'public.listings'::regclass
  ) THEN
    ALTER TABLE listings
      ADD CONSTRAINT listings_moderation_status_check
      CHECK (moderation_status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Normalize legacy SQLite-compatible columns for PostgreSQL runtime.
DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type IN ('text', 'character varying')
      AND column_name IN ('created_at', 'updated_at', 'read_at', 'reviewed_at', 'expires_at', 'last_event_at', 'responded_at', 'last_seen_at')
  LOOP
    EXECUTE format(
      'ALTER TABLE %I ALTER COLUMN %I TYPE timestamptz USING NULLIF(%I, '''')::timestamptz',
      item.table_name, item.column_name, item.column_name
    );
  END LOOP;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_verified' AND data_type <> 'boolean') THEN
    ALTER TABLE users ALTER COLUMN is_verified TYPE boolean USING (is_verified <> 0);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'phone_verified' AND data_type <> 'boolean') THEN
    ALTER TABLE users ALTER COLUMN phone_verified TYPE boolean USING (phone_verified <> 0);
  END IF;
END $$;

ALTER TABLE users ALTER COLUMN is_verified SET DEFAULT false;
ALTER TABLE users ALTER COLUMN phone_verified SET DEFAULT false;

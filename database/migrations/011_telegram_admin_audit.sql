CREATE TABLE IF NOT EXISTS telegram_admin_audit (
  id BIGSERIAL PRIMARY KEY,
  update_id BIGINT NOT NULL UNIQUE,
  chat_id TEXT NOT NULL,
  user_id TEXT,
  command TEXT,
  outcome TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_telegram_admin_audit_created ON telegram_admin_audit(created_at DESC);

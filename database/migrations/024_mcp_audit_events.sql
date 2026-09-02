-- MCP observability only. No payloads, secrets, or raw tokens are persisted.
CREATE TABLE IF NOT EXISTS mcp_audit_events (
  id BIGSERIAL PRIMARY KEY,
  tool_name TEXT NOT NULL CHECK (char_length(tool_name) BETWEEN 1 AND 120),
  outcome TEXT NOT NULL CHECK (outcome IN ('started', 'success', 'error', 'denied')),
  actor_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  request_id TEXT,
  http_status INTEGER,
  error_code TEXT,
  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mcp_audit_events_created ON mcp_audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mcp_audit_events_tool ON mcp_audit_events(tool_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mcp_audit_events_actor ON mcp_audit_events(actor_user_id, created_at DESC);

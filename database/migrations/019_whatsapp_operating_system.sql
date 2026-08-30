-- Additive WhatsApp operating system foundation. No production rows are modified.
CREATE TABLE IF NOT EXISTS whatsapp_events (
  id BIGSERIAL PRIMARY KEY,
  provider_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  processing_status TEXT NOT NULL DEFAULT 'received' CHECK (processing_status IN ('received','processed','duplicate','failed')),
  received_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS whatsapp_contacts (
  id BIGSERIAL PRIMARY KEY,
  wa_id TEXT NOT NULL UNIQUE,
  display_name TEXT,
  phone_last4 TEXT,
  consent_state TEXT NOT NULL DEFAULT 'unknown' CHECK (consent_state IN ('unknown','opted_in','opted_out')),
  last_inbound_at TIMESTAMPTZ,
  last_outbound_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id BIGSERIAL PRIMARY KEY,
  provider_message_id TEXT NOT NULL UNIQUE,
  event_id BIGINT REFERENCES whatsapp_events(id) ON DELETE SET NULL,
  wa_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  message_type TEXT NOT NULL,
  body TEXT,
  payload_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  received_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whatsapp_leads (
  id BIGSERIAL PRIMARY KEY,
  wa_id TEXT NOT NULL,
  conversation_id BIGINT REFERENCES conversations(id) ON DELETE SET NULL,
  listing_id BIGINT REFERENCES listings(id) ON DELETE SET NULL,
  intent TEXT NOT NULL DEFAULT 'unknown',
  stage TEXT NOT NULL DEFAULT 'new',
  score INTEGER NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  owner TEXT,
  handoff_reason TEXT,
  next_action_at TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'whatsapp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_events_status ON whatsapp_events(processing_status, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_wa_id ON whatsapp_messages(wa_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_leads_stage ON whatsapp_leads(stage, next_action_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_leads_wa_id ON whatsapp_leads(wa_id, updated_at DESC);

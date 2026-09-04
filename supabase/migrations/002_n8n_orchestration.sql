-- SultraKita n8n orchestration foundation
-- Additive migration: does not drop or rewrite legacy tables.

create extension if not exists pgcrypto;

create table if not exists public.workflow_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  event_type text not null,
  event_version integer not null default 1,
  aggregate_type text not null,
  aggregate_id uuid,
  actor_user_id uuid references auth.users(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'QUEUED' check (status in ('QUEUED','PROCESSING','SUCCEEDED','FAILED','DEAD_LETTER')),
  attempt_count integer not null default 0,
  n8n_execution_id text,
  request_id text,
  last_error_code text,
  last_error_message text,
  available_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workflow_events_status_available_idx
  on public.workflow_events (status, available_at);
create index if not exists workflow_events_aggregate_idx
  on public.workflow_events (aggregate_type, aggregate_id);

create table if not exists public.otp_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  destination_hash text not null,
  otp_hash text not null,
  purpose text not null check (purpose in ('REGISTRATION','LOGIN','PHONE_VERIFICATION','PASSWORD_RESET')),
  status text not null default 'ISSUED' check (status in ('ISSUED','SENT','VERIFIED','EXPIRED','LOCKED')),
  attempt_count integer not null default 0,
  max_attempts integer not null default 5,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  provider_message_id text,
  n8n_execution_id text,
  created_at timestamptz not null default now()
);

create index if not exists otp_challenges_destination_idx
  on public.otp_challenges (destination_hash, purpose, created_at desc);
create index if not exists otp_challenges_expiry_idx
  on public.otp_challenges (expires_at) where status in ('ISSUED','SENT');

create table if not exists public.listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id bigint not null references public.listings(id) on delete cascade,
  owner_user_id uuid references auth.users(id) on delete set null,
  object_key text not null unique,
  content_type text not null,
  byte_size bigint not null check (byte_size > 0),
  sha256 text,
  processing_status text not null default 'UPLOADED' check (processing_status in ('PRESIGNED','UPLOADED','PROCESSING','READY','FAILED','DELETED')),
  variants jsonb not null default '[]'::jsonb,
  n8n_execution_id text,
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listing_media_listing_idx
  on public.listing_media (listing_id, created_at);

create table if not exists public.seller_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id) on delete cascade,
  verification_type text not null check (verification_type in ('KTP','NIB','SELFIE','BUSINESS_LICENSE','OTHER')),
  document_key text not null,
  document_sha256 text,
  status text not null default 'DRAFT' check (status in ('DRAFT','SUBMITTED','IN_REVIEW','APPROVED','REJECTED')),
  workflow_status text not null default 'QUEUED' check (workflow_status in ('QUEUED','NOTIFYING_ADMIN','AWAITING_REVIEW','SUCCEEDED','FAILED','DEAD_LETTER')),
  rejection_reason text,
  reviewed_by bigint references public.users(id) on delete set null,
  reviewed_at timestamptz,
  n8n_execution_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists seller_verifications_workflow_idx
  on public.seller_verifications (workflow_status, status, created_at);

create table if not exists public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  channel text not null check (channel in ('WHATSAPP','SMS','TELEGRAM','EMAIL')),
  destination text not null,
  template_key text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'QUEUED' check (status in ('QUEUED','PROCESSING','SENT','FAILED','DEAD_LETTER')),
  attempt_count integer not null default 0,
  provider_message_id text,
  n8n_execution_id text,
  last_error_message text,
  available_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists notification_outbox_idempotency_idx
  on public.notification_outbox (event_id, channel, destination, template_key);

alter table public.workflow_events enable row level security;
alter table public.otp_challenges enable row level security;
alter table public.listing_media enable row level security;
alter table public.seller_verifications enable row level security;
alter table public.notification_outbox enable row level security;

-- Service-role/n8n access is server-side. User-facing access is intentionally narrow.
create policy workflow_events_owner_read on public.workflow_events
  for select to authenticated
  using (actor_user_id = auth.uid());

create policy otp_challenges_owner_read on public.otp_challenges
  for select to authenticated
  using (user_id = auth.uid());

create policy listing_media_owner_read on public.listing_media
  for select to authenticated
  using (owner_user_id = auth.uid());

-- Legacy users are bigint-backed and authenticated through the existing Express session.
-- Keep direct client reads disabled; the Express API performs ownership checks.
create policy seller_verifications_no_client_access on public.seller_verifications
  for all to authenticated
  using (false)
  with check (false);

create policy notification_outbox_no_client_access on public.notification_outbox
  for all to authenticated
  using (false)
  with check (false);

comment on table public.workflow_events is 'Canonical event outbox and n8n execution state.';
comment on table public.listing_media is 'R2 object metadata and media processing state; binaries remain in R2.';
comment on table public.seller_verifications is 'Private seller documents referenced by R2 object key, never public URL.';

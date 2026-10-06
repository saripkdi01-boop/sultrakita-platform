-- FASE B1 (2026-10-03): pipeline error terpusat — tabel error_events.
--
-- CARA PAKAI: jalankan di Supabase Dashboard → SQL Editor (idempoten).
-- Penulisan HANYA via service-role dari server (lib/server/error-events.ts);
-- tidak ada policy INSERT/UPDATE publik. SELECT hanya admin/super_admin.
--
-- Kontrak keamanan (konsisten dengan lib/log-error.ts):
--   TIDAK PERNAH menyimpan PII: user hanya sebagai hash sha256 16-hex,
--   pesan error dipotong 500 char, tanpa body request / token / stack utuh.

create table if not exists public.error_events (
  id uuid primary key default gen_random_uuid(),
  fingerprint text not null,
  route text not null,
  request_id text null,
  user_hash text null,
  error_name text not null,
  error_message text not null,
  occurrence_count integer not null default 1,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  resolved boolean not null default false,
  resolved_at timestamptz null,
  resolved_by uuid null,
  created_at timestamptz not null default now()
);

-- Satu baris per sidik error; kemunculan berulang di-upsert (lihat
-- lib/server/error-events.ts: ON CONFLICT (fingerprint) DO UPDATE).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'error_events_fingerprint_key'
  ) then
    alter table public.error_events add constraint error_events_fingerprint_key unique (fingerprint);
  end if;
end
$$;

create index if not exists error_events_last_seen_idx on public.error_events (last_seen desc);
create index if not exists error_events_resolved_idx on public.error_events (resolved, last_seen desc);
create index if not exists error_events_route_idx on public.error_events (route, last_seen desc);

alter table public.error_events enable row level security;

-- SELECT: hanya admin / super_admin (cek mandiri, tanpa bergantung migrasi lain).
drop policy if exists error_events_admin_select on public.error_events;
create policy error_events_admin_select
  on public.error_events
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );

-- UPDATE (tandai resolved): hanya admin / super_admin.
drop policy if exists error_events_admin_update on public.error_events;
create policy error_events_admin_update
  on public.error_events
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );

-- Catatan: tanpa policy INSERT/DELETE → hanya service_role yang menulis/menghapus.

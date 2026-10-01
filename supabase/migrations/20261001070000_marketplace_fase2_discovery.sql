-- Fase 2 (2026-10-01): Marketplace menjadi mesin discovery.
-- 1) saved_searches: pencarian tersimpan milik user + alert listing baru (dicocokkan cron).
-- 2) listing_media: tambah kolom listing_uuid agar bisa merujuk public.listings(id bigint).
--    (kolom listing_id bigint adalah warisan skema lama dan tetap dipertahankan.)
-- File migrasi saja — JANGAN dijalankan manual ke DB remote tanpa review.

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  filters jsonb not null default '{}'::jsonb,
  alert_enabled boolean not null default true,
  last_notified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists saved_searches_user_idx
  on public.saved_searches (user_id, created_at desc);

alter table public.saved_searches enable row level security;

drop policy if exists saved_searches_owner on public.saved_searches;
create policy saved_searches_owner on public.saved_searches
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- listing_media.listing_uuid: relasi yang benar ke listings(id bigint).
alter table public.listing_media
  add column if not exists listing_uuid bigint references public.listings(id) on delete cascade;

create index if not exists listing_media_uuid_idx
  on public.listing_media (listing_uuid, created_at);

-- Pemilik boleh mendaftarkan media miliknya (select owner-only sudah ada dari migrasi lama).
drop policy if exists listing_media_owner_insert on public.listing_media;
create policy listing_media_owner_insert on public.listing_media
  for insert to authenticated
  with check (owner_user_id = auth.uid());

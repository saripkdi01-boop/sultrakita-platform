-- T-ADS (2026-10-02): infrastruktur space iklan untuk monetisasi.
-- FILE-ONLY — BELUM dijalankan ke Supabase. Jalankan manual via SQL editor
-- dashboard Supabase (atau supabase db push) sebelum mengaktifkan iklan.
--
-- Isi:
--   1. public.house_ads   — kreatif sponsor langsung (UMKM lokal, margin lebih tinggi).
--   2. public.ad_placements — konfigurasi provider per placement (adsense/house/off)
--      + ad slot ID AdSense per placement.
--
-- RLS:
--   - house_ads: publik HANYA baca baris active & dalam periode tayang.
--   - ad_placements: publik boleh baca (tidak ada secret di sini — publisher ID
--     hanya lewat env NEXT_PUBLIC_ADSENSE_CLIENT_ID; slot ID bersifat publik).
--   - Tulis (INSERT/UPDATE/DELETE) kedua tabel: admin/super_admin saja.

create table if not exists public.house_ads (
  id uuid primary key default gen_random_uuid(),
  placement text not null,
  title text not null,
  image_url text,
  link_url text not null,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists house_ads_placement_active_idx
  on public.house_ads (placement, active);

alter table public.house_ads enable row level security;

drop policy if exists house_ads_public_read on public.house_ads;
create policy house_ads_public_read on public.house_ads
  for select to anon, authenticated
  using (
    active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now())
  );

drop policy if exists house_ads_admin_write on public.house_ads;
create policy house_ads_admin_write on public.house_ads
  for all to authenticated
  using (public.suki_is_admin())
  with check (public.suki_is_admin());

create table if not exists public.ad_placements (
  placement text primary key,
  provider text not null default 'off'
    check (provider in ('adsense', 'house', 'off')),
  adsense_slot text,
  updated_at timestamptz not null default now()
);

alter table public.ad_placements enable row level security;

drop policy if exists ad_placements_public_read on public.ad_placements;
create policy ad_placements_public_read on public.ad_placements
  for select to anon, authenticated
  using (true);

drop policy if exists ad_placements_admin_write on public.ad_placements;
create policy ad_placements_admin_write on public.ad_placements
  for all to authenticated
  using (public.suki_is_admin())
  with check (public.suki_is_admin());

-- Seed konfigurasi awal: semua placement NONAKTIF ('off') sampai admin
-- mengaktifkannya di /admin/ads. Idempotent.
insert into public.ad_placements (placement, provider, adsense_slot) values
  ('feed-infeed', 'off', null),
  ('marketplace-leaderboard', 'off', null),
  ('sidebar-desktop', 'off', null),
  ('marketplace-grid', 'off', null),
  ('mobile-banner', 'off', null),
  ('properti-detail-sidebar', 'off', null),
  ('jobs-list', 'off', null)
on conflict (placement) do nothing;

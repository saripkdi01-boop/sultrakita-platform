-- T-ADS popup beranda (2026-10-05): slot popup interstitial di /beranda.
-- FILE-ONLY — BELUM dijalankan ke Supabase. Jalankan manual via SQL editor
-- dashboard Supabase sebelum mengaktifkan popup di /admin/ads.
--
-- Isi:
--   1. Kolom public.house_ads.html_snippet — kode HTML/JS mentah dari jaringan
--      iklan manapun (MGID, Adsterra, dsb). Bila diisi, menggantikan
--      gambar+link (kolom link_url dibuat nullable agar kreatif snippet-only valid).
--   2. Seed placement 'beranda-popup' (default 'off').
--   3. Seed placement 'news-infeed' — terlewat di migrasi 20261002081000_house_ads.sql.
--
-- Idempotent: aman dijalankan berulang.

alter table public.house_ads
  add column if not exists html_snippet text;

alter table public.house_ads
  alter column link_url drop not null;

insert into public.ad_placements (placement, provider, adsense_slot) values
  ('news-infeed', 'off', null),
  ('beranda-popup', 'off', null)
on conflict (placement) do nothing;

-- ============================================================================
-- UPGRADE TOTAL /marketplace/create — kolom listings yang hilang di production
-- Tanggal: 2026-10-03
--
-- KONTEKS
--   Skema production tabel public.listings saat ini TIDAK memiliki kolom yang
--   dibutuhkan fitur ini (dan sebagian sudah diasumsikan kode yang ada):
--     - images          (galeri foto, dipakai SELECT di lib/listings-query.ts
--                        -> tanpanya GET /api/listings = 503 di production)
--     - thumbnail_url   (sampul listing, dipakai POST /api/listings)
--     - specifications  (jsonb; dipakai POST untuk kontak WhatsApp penjual)
--     - owner_id        (uuid pemilik; dipakai POST + kebijakan RLS pemilik)
--   Migrasi 20260905230000_marketplace_next_generation.sql yang
--   memperkenalkan kolom-kolom ini TIDAK PERNAH di-apply ke production,
--   sehingga tabel production masih berwujud legacy (id integer, dst).
--
-- IDEMPOTEN: aman dijalankan berulang (IF NOT EXISTS di semua pernyataan).
-- TANPA perubahan data: hanya ADD COLUMN + INDEX + POLICY.
-- RLS: tanpa auth.uid() = owner_id, insert terautentikasi tidak bisa
--      dibatasi ke pemiliknya. Pola di bawah TIDAK memakai subquery ke tabel
--      yang sama (menghindari preseden rekursi RLS 42P17 di grup).
-- ============================================================================

-- 1. Kolom galeri & sampul ----------------------------------------------------
alter table public.listings
  add column if not exists images text[] not null default '{}';

alter table public.listings
  add column if not exists thumbnail_url text;

-- 2. Spesifikasi fleksibel (WhatsApp penjual, dst.) -----------------------------
alter table public.listings
  add column if not exists specifications jsonb not null default '{}'::jsonb;

-- 3. Pemilik listing (akun Supabase Auth) --------------------------------------
alter table public.listings
  add column if not exists owner_id uuid references auth.users(id) on delete set null;

-- 4. Index untuk query yang dipakai --------------------------------------------
--    - by seller  : dashboard "listing saya" memfilter owner_id
--    - by status  : daftar publik memfilter status + urut created_at
create index if not exists listings_owner_id_idx
  on public.listings (owner_id);

create index if not exists listings_status_created_idx
  on public.listings (status, created_at desc);

-- 5. RLS: publik baca listing aktif, pemilik kelola miliknya --------------------
alter table public.listings enable row level security;

drop policy if exists "published listings public read" on public.listings;
create policy "published listings public read" on public.listings
  for select using (status in ('published', 'active'));

drop policy if exists "owners manage listings" on public.listings;
create policy "owners manage listings" on public.listings
  for all using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

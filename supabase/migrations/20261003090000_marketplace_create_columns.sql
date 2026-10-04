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
-- TAMBAHAN 2026-10-04 (fitur "Jual + auto-approve"):
--   - moderation_status diperluas: 'auto_approved' (posting yang lolos
--     prosedur ketentuan form -> disetujui otomatis, langsung tayang tanpa
--     persetujuan manual admin)
--   - approved_at / approved_by / rejection_reason: jejak audit moderasi
--     yang tampil di halaman admin /admin/listings ("Listing").
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

-- 6. Jejak auto-approve & moderasi admin (fitur "Jual + auto-approve") ----------
--    Prosedur: POST /api/listings hanya menyetujui otomatis bila SEMUA
--    ketentuan form lolos (rate limit, CSRF, login, validasi zod, sanitasi).
--    Admin meninjau belakangan via /admin/listings: tarik (rejected) atau
--    pulihkan (approved). Kolom ini opsional bagi kode (probe di
--    lib/listings-query.ts) sehingga aman sebelum/sesudah migrasi jalan.
alter table public.listings
  add column if not exists approved_at timestamptz;

alter table public.listings
  add column if not exists approved_by text;

alter table public.listings
  add column if not exists rejection_reason text;

-- Perluas nilai moderation_status: 'auto_approved' =
-- disetujui otomatis sistem karena lolos seluruh ketentuan form.
alter table public.listings
  drop constraint if exists listings_moderation_status_check;

alter table public.listings
  add constraint listings_moderation_status_check
  check (moderation_status in ('pending', 'approved', 'auto_approved', 'rejected'));

create index if not exists listings_moderation_approved_idx
  on public.listings (moderation_status, created_at desc);

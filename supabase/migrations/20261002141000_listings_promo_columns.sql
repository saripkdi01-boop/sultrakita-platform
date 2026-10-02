-- Slice 1 program upgrade otonom 4-jam (2026-10-02): kolom promo marketplace.
--
-- KONTEKS: file repo supabase/migrations/20260905230000_marketplace_next_generation.sql
-- sudah mendeklarasikan kedua kolom ini, tetapi pengecekan REST langsung ke
-- production (2026-10-02 14:25 WITA) membuktikan kolomnya BELUM ADA di database
-- produksi — migrasi lama tampaknya tidak pernah diterapkan. File ini
-- menulis ulang ALTER yang sama secara idempoten (add column if not exists)
-- agar bisa diterapkan kapan pun dengan aman.
--
-- STATUS: BELUM DITERAPKAN ke production. Penerapan migrasi database butuh
-- persetujuan eksplisit Sarip. Kode aplikasi (lib/listings-query.ts) sudah
-- siap: kolom dibaca hanya bila tersedia (probe sekali per instance server),
-- badge "-X%" dan stok jujur muncul otomatis setelah migrasi jalan.
--
-- Additive-only: tidak ada DROP/ALTER destruktif.

alter table public.listings add column if not exists original_price numeric;
alter table public.listings add column if not exists stock_quantity integer not null default 1;

comment on column public.listings.original_price is
  'Harga coret (sebelum diskon) dalam IDR. Badge promo "-X%" dihitung dari price/original_price; NULL = tidak ada promo.';
comment on column public.listings.stock_quantity is
  'Jumlah stok tersedia. 0 = habis. Ditampilkan apa adanya di quick view (tanpa klaim "tersedia" bila data tidak ada).';

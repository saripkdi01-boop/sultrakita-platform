-- SUKI Apps LAUNCH — rekonsiliasi kolom public.profiles (tambahan).
--
-- TEMUAN (diverifikasi via Supabase REST API production, 2026-10-02):
--   Migrasi 20260909000000_auth_profiles.sql & 20260913000000_beranda_social_feed.sql
--   TIDAK PERNAH teraplikasi ke production, sehingga 5 kolom yang dipakai
--   halaman /admin/users (list + detail) HILANG:
--     is_active, is_verified, city, province, last_login_at
--   Dampak: halaman detail user admin melempar HTTP 400 (42703) saat dibuka.
--
-- PERBAIKAN: tambah kolom secara IDEMPOTEN dengan definisi PERSIS seperti
-- di 20260909000000_auth_profiles.sql (default yang sama). Murni aditif —
-- tidak mengubah/menghapus data atau kolom yang sudah ada.
-- Eksekusi: 1 chunk via dashboard SQL editor (atau sertakan di batch migrasi).

alter table public.profiles
  add column if not exists is_active boolean not null default true,
  add column if not exists is_verified boolean not null default false,
  add column if not exists city text default 'Kendari',
  add column if not exists province text default 'Sulawesi Tenggara',
  add column if not exists last_login_at timestamptz;

comment on column public.profiles.is_active is
  'Akun aktif/nonaktif (soft-disable). Dipakai filter status di /admin/users.';
comment on column public.profiles.is_verified is
  'Lencana terverifikasi. Ditampilkan di /admin/users/[id].';
comment on column public.profiles.last_login_at is
  'Waktu login terakhir. Diisi aplikasi saat login; ditampilkan di /admin/users/[id].';

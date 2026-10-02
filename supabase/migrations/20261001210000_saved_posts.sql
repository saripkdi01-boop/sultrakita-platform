-- SUKI Apps /beranda: tabel simpanan (saved_posts) + kolom pendukung komentar.
--
-- STATUS EKSEKUSI (catatan jujur, 2026-10-02):
--   ✅ Bagian 1 (saved_posts) TERAPLIKASI ke production via dashboard SQL editor
--      (statement 1–5 sukses; tabel + RLS + policy terverifikasi live via REST).
--   ⛔ Bagian 2 & 3 (kolom comments.parent_id / idempotency_key) TIDAK DIJALANKAN
--      dan SUPERSEDED oleh migrasi 20261002080000_launch_schema_reconciliation.sql:
--      public.comments di production ternyata LEGACY (bigint, 0 baris, tak
--      direferensikan kode) sehingga di-REBUILD total sebagai tabel uuid baru
--      yang SUDAH mencakup parent_id + idempotency_key. Menjalankan Bagian 2/3
--      dari file ini sekarang akan GAGAL (kolom target tidak ada) — biarkan
--      tetap terkomen sebagai arsip niat awal.
--
-- File ini dipertahankan sebagai catatan apa yang benar-benar teraplikasi.
-- JANGAN dijalankan ulang untuk Bagian 2/3.

-- ---------------------------------------------------------------------------
-- 1. saved_posts — ✅ TERAPLIKASI 2026-10-02
-- ---------------------------------------------------------------------------
create table if not exists public.saved_posts (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists saved_posts_user_idx
  on public.saved_posts(user_id, created_at desc);

alter table public.saved_posts enable row level security;

-- Pemilik penuh (baca/tulis/hapus milik sendiri). Tidak ada akses anon:
-- daftar simpanan adalah data privat pengguna.
drop policy if exists saved_posts_owner_all on public.saved_posts;
create policy saved_posts_owner_all on public.saved_posts
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 2. comments.parent_id — ⛔ SUPERSEDED (lihat header). Diarsipkan di bawah.
-- ---------------------------------------------------------------------------
-- KOREKSI 2026-10-02 (awal): public.comments(id) bertipe bigint (bukan uuid),
-- ditemukan saat eksekusi — parent_id disesuaikan menjadi bigint.
-- KOREKSI FINAL 2026-10-02: public.comments di-REBUILD total oleh
-- 20261002080000_launch_schema_reconciliation.sql (0 baris, legacy, tak
-- direferensikan). Tabel baru sudah punya parent_id uuid. Bagian ini usang.
--
-- alter table public.comments
--   add column if not exists parent_id bigint references public.comments(id) on delete cascade;
-- create index if not exists comments_parent_idx on public.comments(parent_id);

-- ---------------------------------------------------------------------------
-- 3. comments.idempotency_key — ⛔ SUPERSEDED (lihat header). Diarsipkan.
-- ---------------------------------------------------------------------------
-- Tabel comments baru (20261002080000) sudah mencakup kolom idempotency_key
-- + unique index comments_user_idem_uniq. Bagian ini usang.
--
-- alter table public.comments
--   add column if not exists idempotency_key text;
-- create unique index if not exists comments_user_idem_uniq
--   on public.comments(user_id, idempotency_key)
--   where idempotency_key is not null;

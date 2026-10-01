-- SUKI Apps /beranda: tabel simpanan (saved_posts) + kolom pendukung komentar.
-- ADDITIVE & IDEMPOTEN: aman dijalankan ulang. JANGAN dijalankan otomatis oleh
-- agen — file ini hanya definisi; eksekusi dilakukan terpisah oleh operator
-- dengan akses Supabase (service role / dashboard SQL editor).
--
-- Isi:
--   1. public.saved_posts — bookmark postingan per pengguna (menggantikan
--      localStorage 'suki-saved-posts' yang tidak sinkron antar perangkat).
--   2. public.comments.parent_id — balasan 1 level untuk thread komentar.
--   3. public.comments.idempotency_key — dedup kirim komentar ganda
--      (double-tap / retry jaringan), pola sama seperti posts.idempotency_key.

-- ---------------------------------------------------------------------------
-- 1. saved_posts
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
-- 2. comments.parent_id (balasan 1 level)
-- ---------------------------------------------------------------------------
alter table public.comments
  add column if not exists parent_id uuid references public.comments(id) on delete cascade;

create index if not exists comments_parent_idx on public.comments(parent_id);

-- ---------------------------------------------------------------------------
-- 3. comments.idempotency_key (dedup kirim ganda)
-- ---------------------------------------------------------------------------
alter table public.comments
  add column if not exists idempotency_key text;

-- Unik per pengguna bila diisi; NULL (klien lama) tetap diizinkan ganda.
create unique index if not exists comments_user_idem_uniq
  on public.comments(user_id, idempotency_key)
  where idempotency_key is not null;

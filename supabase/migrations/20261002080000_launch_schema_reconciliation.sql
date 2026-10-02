-- SUKI Apps LAUNCH — rekonsiliasi skema production vs ekspektasi kode.
--
-- TEMUAN (diverifikasi via Supabase REST API production, 2026-10-02):
--   1. public.comments di production = LEGACY (id bigint, listing_id bigint,
--      user_id bigint, author_name, body, status, created_at text), ISI 0 BARIS.
--      Kode baru /api/comments mengharapkan skema uuid (post_id, content,
--      parent_id, idempotency_key). Grep repo: TIDAK ADA kode yang mereferensikan
--      kolom legacy (listing_id/author_name/body). → REBUILD di bawah.
--   2. public.follows TIDAK ADA di production (REST: PGRST205), padahal dipakai
--      /api/follow dan /api/feed. → CREATE di bawah.
--   3. public.likes, public.posts, public.saved_posts, public.profiles di
--      production SUDAH cocok dengan kode (kolom privacy/mood/tagged_user_ids/
--      status/visibility_settings terkonfirmasi ada). → TIDAK DIUTAK-ATIK.
--   4. public.notifications di production memakai bentuk 001_suki_core
--      (id, user_id, title, body, is_read, created_at, +type/link/read_at) —
--      SUDAH cocok dengan satu-satunya pemakai kode
--      (lib/saved-search-matcher.ts insert {user_id,title,body}). → TIDAK DIUBAH.
--      (Definisi recipient_id/actor_id di 20260829100000_social_beta.sql tidak
--      pernah teraplikasi karena tabel sudah ada — hanya catatan.)
--
-- IDEMPOTEN: aman dijalankan ulang. JANGAN dijalankan otomatis oleh agen —
-- eksekusi manual oleh operator via dashboard SQL editor, dalam CHUNK KECIL
-- (pengalaman 2026-10-01: paste >25KB sekaligus membuat editor macet).
-- Urutan eksekusi: Bagian 1 (comments rebuild), lalu Bagian 2 (follows).
-- Verifikasi pasca-eksekusi: jalankan scripts/verify-db-schema.js
--   (butuh env SUPABASE_URL + SUPABASE_ANON_KEY).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Bagian 1: REBUILD public.comments (legacy → skema uuid sesuai /api/comments)
-- ---------------------------------------------------------------------------
-- Guard: DROP hanya bila tabel KOSONG. Bila ada baris (tak terduga), migrasi
-- GAGAL dengan pesan jelas — operator harus meninjau manual, bukan lanjut.
do $$
begin
  if (select count(*) from public.comments) = 0 then
    drop table public.comments;
    raise notice 'public.comments (legacy, kosong) di-drop untuk rebuild.';
  else
    raise exception 'ABORT: public.comments tidak kosong — rebuild dibatalkan demi keamanan data.';
  end if;
end $$;

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  -- CATATAN DESAIN (deviasi sadar dari draf awal yang mengusulkan auth.users):
  -- user_id → public.profiles(id), SAMA seperti posts.user_id, agar embed
  -- PostgREST `profiles(display_name,username,avatar_url)` di /api/comments
  -- berfungsi (butuh FK langsung comments→profiles). RLS auth.uid()=user_id
  -- tetap valid karena profiles.id = auth.users.id. Insert user.id tetap sah.
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0),
  parent_id uuid references public.comments(id) on delete cascade,
  idempotency_key text,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments(post_id, created_at asc);
create index if not exists comments_parent_idx on public.comments(parent_id);
create unique index if not exists comments_user_idem_uniq
  on public.comments(user_id, idempotency_key)
  where idempotency_key is not null;

alter table public.comments enable row level security;

drop policy if exists comments_public_read on public.comments;
create policy comments_public_read on public.comments
  for select to anon, authenticated using (true);

drop policy if exists comments_owner_write on public.comments;
create policy comments_owner_write on public.comments
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

do $$
begin
  alter publication supabase_realtime add table public.comments;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Bagian 2: CREATE public.follows (hilang di production)
-- ---------------------------------------------------------------------------
-- Definisi persis 20260829100000_social_beta.sql (satu-satunya sumber definisi).
create table if not exists public.follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint follows_not_self check (follower_id <> following_id)
);

create index if not exists follows_following_id_idx on public.follows (following_id, created_at desc);

alter table public.follows enable row level security;

drop policy if exists follows_public_read on public.follows;
create policy follows_public_read on public.follows for select using (true);

drop policy if exists follows_owner_write on public.follows;
create policy follows_owner_write on public.follows for insert with check (auth.uid() = follower_id);

drop policy if exists follows_owner_delete on public.follows;
create policy follows_owner_delete on public.follows for delete using (auth.uid() = follower_id);

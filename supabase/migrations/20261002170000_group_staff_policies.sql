-- Slice 4 (program 4-jam): moderasi komunitas — pin posting, roster anggota, FK profil.
-- ADDITIVE-ONLY: hanya menambah 2 policy RLS + 3 FK (NOT VALID), tanpa mengubah
-- policy/data yang ada.
-- Butuh persetujuan Sarip sebelum diterapkan ke Supabase production.
-- Setelah diterapkan: admin grup (owner/moderator/admin) bisa sematkan postingan
-- orang lain, anggota aktif grup privat bisa melihat daftar anggota, dan embed
-- profiles() pada tabel komunitas berfungsi native (kode sudah punya fallback
-- two-step sehingga berjalan juga sebelum migrasi).

-- 1) Admin grup boleh UPDATE is_pinned pada postingan grupnya.
--    (kode server hanya menulis kolom is_pinned; otorisasi peran juga dicek di
--    server action toggleGroupPostPin via canModerateGroup.)
drop policy if exists group_posts_moderate_pin_update on public.group_posts;
create policy group_posts_moderate_pin_update on public.group_posts for update
using (
  exists (
    select 1 from public.group_members gm
    where gm.group_id = group_posts.group_id
      and gm.user_id = auth.uid()
      and gm.status = 'active'
      and gm.role in ('owner', 'moderator', 'admin')
  )
);

-- 2) Anggota aktif boleh membaca daftar anggota grupnya (roster).
drop policy if exists group_members_roster_read on public.group_members;
create policy group_members_roster_read on public.group_members for select
using (
  exists (
    select 1 from public.group_members gm
    where gm.group_id = group_members.group_id
      and gm.user_id = auth.uid()
      and gm.status = 'active'
  )
);

-- 3) FK langsung ke public.profiles agar embed PostgREST
--    `profiles(display_name,username,avatar_url)` berfungsi pada tabel komunitas
--    (sama seperti pola tabel comments di migrasi 20261002080000).
--    NOT VALID: tanpa validasi data lama & tanpa lock lama; jalankan
--    `validate constraint` terpisah setelah memastikan tidak ada orphan.
do $$ begin
  alter table public.group_posts add constraint group_posts_author_id_profiles_fkey
    foreign key (author_id) references public.profiles(id) on delete cascade not valid;
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.group_post_comments add constraint group_post_comments_author_id_profiles_fkey
    foreign key (author_id) references public.profiles(id) on delete cascade not valid;
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.group_members add constraint group_members_user_id_profiles_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade not valid;
exception when duplicate_object then null; end $$;

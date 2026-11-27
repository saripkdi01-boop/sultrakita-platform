-- Perbaiki rekursi RLS komunitas (groups ↔ group_members).
--
-- MASALAH (production, terlihat di beranda: angka "Komunitas" jatuh ke [CONTOH]):
--   * groups_public_read (groups)          → subquery ke group_members
--   * group_members_read (group_members)   → subquery ke groups
--   * group_members_roster_read            → subquery ke group_members SENDIRI
--   Postgres menolak siklus ini saat menyusun query:
--     ERROR 42P17: infinite recursion detected in policy for relation "groups"/"group_members"
--   Akibatnya SEMUA select ke groups/group_members (termasuk anon untuk grup publik)
--   gagal, dan policy tabel lain yang merujuk keduanya ikut gagal.
--
-- PERBAIKAN: cek keanggotaan/privasi/kepemilikan dipindah ke fungsi SECURITY DEFINER
-- (pola yang sama dengan public.is_conversation_member di 20260905220000_realtime_chat).
-- Fungsi dimiliki pemilik tabel sehingga membaca tanpa memicu RLS → siklus putus.
-- ATURAN AKSES TIDAK BERUBAH: setiap policy di bawah memakai kondisi yang identik
-- dengan versi lamanya, hanya cara mengeceknya yang berbeda.
--
-- Fungsi TIDAK menerima parameter user: selalu memakai auth.uid() pemanggil, sehingga
-- tidak bisa dipakai untuk mengintip keanggotaan orang lain lewat RPC.
-- Idempoten: aman dijalankan ulang.

create or replace function public.suki_is_active_group_member(p_group_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = auth.uid() and status = 'active'
  );
$$;

create or replace function public.suki_is_public_group(p_group_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.groups where id = p_group_id and privacy = 'public');
$$;

create or replace function public.suki_is_group_owner(p_group_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.groups where id = p_group_id and owner_id = auth.uid());
$$;

-- groups: publik ATAU anggota aktif (sebelumnya: subquery group_members).
drop policy if exists groups_public_read on public.groups;
create policy groups_public_read on public.groups for select
  using (privacy = 'public' or public.suki_is_active_group_member(id));

-- group_members: baris sendiri ATAU anggota grup publik (sebelumnya: subquery groups).
drop policy if exists group_members_read on public.group_members;
create policy group_members_read on public.group_members for select
  using (auth.uid() = user_id or public.suki_is_public_group(group_id));

-- group_members: anggota aktif boleh melihat roster grupnya (sebelumnya: subquery ke tabel sendiri).
drop policy if exists group_members_roster_read on public.group_members;
create policy group_members_roster_read on public.group_members for select
  using (public.suki_is_active_group_member(group_id));

-- group_members: pemilik grup boleh memoderasi (sebelumnya: subquery groups).
drop policy if exists group_members_moderate on public.group_members;
create policy group_members_moderate on public.group_members for update
  using (public.suki_is_group_owner(group_id)) with check (true);

-- ---------------------------------------------------------------------------
-- CELAH KEDUA yang selama ini tertutup error rekursi di atas:
-- di policy lama, `group_id` tanpa kualifikasi di dalam subquery yang memuat
-- `group_members gm` mengacu ke gm.group_id (scope terdalam), BUKAN ke baris
-- posting/komentar/reaksi. Akibatnya bila rekursi diperbaiki sendirian:
--   * pengunjung tidak bisa melihat posting grup publik (selalu false), dan
--   * anggota aktif grup MANA PUN bisa membaca posting grup privat lain serta
--     memposting/berkomentar/bereaksi ke grup mana pun (selalu true).
-- Semua referensi kini dikualifikasi nama tabel + memakai helper di atas.
-- ---------------------------------------------------------------------------

create or replace function public.suki_is_group_moderator(p_group_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = auth.uid() and status = 'active'
      and role in ('owner', 'moderator')
  );
$$;

drop policy if exists group_posts_read on public.group_posts;
create policy group_posts_read on public.group_posts for select
  using (public.suki_is_public_group(group_posts.group_id) or public.suki_is_active_group_member(group_posts.group_id));

drop policy if exists group_posts_member_insert on public.group_posts;
create policy group_posts_member_insert on public.group_posts for insert
  with check (auth.uid() = author_id and public.suki_is_active_group_member(group_posts.group_id));

-- Komentar/reaksi menyimpan group_id sendiri; pastikan juga cocok dengan grup
-- postingannya supaya tidak bisa "menitipkan" komentar ke posting grup lain.
drop policy if exists group_post_comments_read on public.group_post_comments;
create policy group_post_comments_read on public.group_post_comments for select
  using (public.suki_is_public_group(group_post_comments.group_id) or public.suki_is_active_group_member(group_post_comments.group_id));

drop policy if exists group_post_comments_insert on public.group_post_comments;
create policy group_post_comments_insert on public.group_post_comments for insert
  with check (
    auth.uid() = author_id
    and public.suki_is_active_group_member(group_post_comments.group_id)
    and exists (select 1 from public.group_posts p where p.id = group_post_comments.post_id and p.group_id = group_post_comments.group_id)
  );

drop policy if exists group_post_comments_moderate_delete on public.group_post_comments;
create policy group_post_comments_moderate_delete on public.group_post_comments for delete
  using (auth.uid() = author_id or public.suki_is_group_moderator(group_post_comments.group_id));

drop policy if exists group_post_reactions_read on public.group_post_reactions;
create policy group_post_reactions_read on public.group_post_reactions for select
  using (public.suki_is_public_group(group_post_reactions.group_id) or public.suki_is_active_group_member(group_post_reactions.group_id));

drop policy if exists group_post_reactions_insert on public.group_post_reactions;
create policy group_post_reactions_insert on public.group_post_reactions for insert
  with check (
    auth.uid() = user_id
    and public.suki_is_active_group_member(group_post_reactions.group_id)
    and exists (select 1 from public.group_posts p where p.id = group_post_reactions.post_id and p.group_id = group_post_reactions.group_id)
  );

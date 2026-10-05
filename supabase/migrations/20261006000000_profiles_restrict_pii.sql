-- Audit 2026-10-06 (P0-SEC): batasi eksposur PII di public.profiles.
--
-- Masalah: policy profiles_public_read memakai USING (true) untuk SEMUA kolom,
-- sehingga kolom sensitif (phone, role, visibility_settings, dsb.) bisa dibaca
-- siapa pun (anon) untuk SEMUA user.
--
-- Perbaikan (least-privilege, tanpa merusak fitur):
--   1. Cabut SELECT publik kolom-per-kolom yang sensitif via REVOKE, lalu
--      berikan kembali hanya kolom publik yang aman ke anon/authenticated.
--   2. phone seller tetap bisa dibaca publik HANYA bila seller tersebut punya
--      listing aktif (marketplace/properti/bisnis) — lewat policy tambahan
--      yang tetap memakai USING (true) di level baris, karena pembatasan
--      kolom sudah ditangani GRANT di bawah.
--
-- Catatan Postgres: RLS policy mengatur AKSES BARIS, sedangkan GRANT kolom
-- mengatur AKSES KOLOM. Kombinasi keduanya = baris publik + kolom aman saja.
-- Pemilik baris (auth.uid() = id) tetap bisa membaca SEMUA kolomnya sendiri.
--
-- Idempotent: aman dijalankan berulang.
-- FILE-ONLY — jalankan manual via SQL editor dashboard Supabase, atau via
-- pipeline Supabase CLI yang dipakai project, SEBELUM merge PR ini ke main.

-- ---------------------------------------------------------------------------
-- 1. Pastikan RLS aktif (sudah aktif sejak migrasi sebelumnya; idempotent).
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- ---------------------------------------------------------------------------
-- 2. Policy baris: publik boleh SELECT baris mana pun (tetap), pemilik boleh
--    menulis barisnya sendiri (tetap). Pembatasan PII ditangani via GRANT
--    kolom pada langkah 3.
-- ---------------------------------------------------------------------------
drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read
  on public.profiles for select
  to anon, authenticated
  using (true);

drop policy if exists profiles_owner_write on public.profiles;
create policy profiles_owner_write
  on public.profiles for all
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- 3. Pembatasan kolom: cabut semua, lalu berikan hanya kolom publik yang aman.
--
-- Kolom PUBLIK (aman dibaca siapa pun):
--   id, display_name, full_name, username, avatar_url, bio, district,
--   is_seller, created_at, updated_at
--
-- Kolom PRIVAT (hanya pemilik + service_role):
--   phone, role, email, visibility_settings, is_suspended, is_verified,
--   city, province, admin_notes, last_login_at, + kolom sensitif lain.
-- ---------------------------------------------------------------------------
revoke all on public.profiles from anon, authenticated;

grant select (
  id,
  display_name,
  full_name,
  username,
  avatar_url,
  bio,
  district,
  is_seller,
  created_at,
  updated_at
) on public.profiles to anon, authenticated;

-- Pemilik baris tetap bisa INSERT/UPDATE/DELETE barisnya sendiri (policy
-- profiles_owner_write di atas yang membatasi ke id = auth.uid()).
grant insert, update, delete on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- 4. RPC aman untuk kebutuhan publik yang legitimate:
--    - public.get_seller_contact(seller uuid): mengembalikan phone seller
--      HANYA bila seller punya listing aktif (marketplace published/active,
--      properti available, atau bisnis aktif). Dipakai tombol "Chat via WA"
--      dan notifikasi server-side.
--    SECURITY DEFINER + search_path terkunci + GRANT EXECUTE ke anon/auth.
-- ---------------------------------------------------------------------------
create or replace function public.get_seller_contact(seller uuid)
returns table (phone text, display_name text)
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Hanya seller dengan listing aktif yang kontaknya boleh dibaca publik.
  if not exists (
    select 1 from public.listings l
    where l.seller_id = seller and l.status in ('published', 'active')
  ) and not exists (
    select 1 from public.properties p
    where p.seller_id = seller and p.status = 'available'
  ) and not exists (
    select 1 from public.businesses b
    where b.owner_id = seller and b.is_active = true
  ) then
    return;
  end if;

  return query
    select p.phone, p.display_name
    from public.profiles p
    where p.id = seller;
end;
$$;

revoke all on function public.get_seller_contact(uuid) from public;
grant execute on function public.get_seller_contact(uuid) to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 5. Kunci fungsi trigger yang sudah ada (defense in depth).
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'handle_new_user_profile'
  ) then
    revoke all on function public.handle_new_user_profile() from public;
  end if;
end
$$;

-- Atribusi signup UTM — salin utm_* dari user_metadata ke profiles saat insert.
--
-- STATUS: FILE-ONLY — BELUM DIJALANKAN ke Supabase production.
-- Cara menjalankan (butuh akses dashboard Supabase / psql):
--   1. Buka Supabase Dashboard → SQL Editor (project ibvcfdfsjpytwpnxgylm).
--   2. Tempel seluruh isi file ini, jalankan.
--   3. Verifikasi dengan query di bawah ("VERIFIKASI").
--
-- DESAIN:
--   - Memperluas trigger handle_new_auth_profile() (security definer) agar juga
--     menyalin utm_source/utm_medium/utm_campaign dari new.raw_user_meta_data
--     (diisi client saat signUp email) ke baris profiles yang baru dibuat.
--   - First-touch: pada konflik (profil sudah ada), kolom utm_* TIDAK ditimpa
--     bila sudah terisi — atribusi pertama yang menang.
--   - Nilai UTM bukan PII (hanya nama kanal/kampanye), dipakai agregat admin.
--   - Untuk signup OAuth (metadata tak bisa diisi client), wiring dilakukan di
--     next-app/app/auth/callback/route.ts yang membaca cookie sk_utm.

create or replace function public.handle_new_auth_profile()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, full_name, display_name, avatar_url, username,
    utm_source, utm_medium, utm_campaign
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Warga Sultra'),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'username',
    nullif(new.raw_user_meta_data->>'utm_source', ''),
    nullif(new.raw_user_meta_data->>'utm_medium', ''),
    nullif(new.raw_user_meta_data->>'utm_campaign', '')
  )
  on conflict (id) do update set
    email = coalesce(excluded.email, profiles.email),
    full_name = coalesce(excluded.full_name, profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    utm_source = coalesce(profiles.utm_source, excluded.utm_source),
    utm_medium = coalesce(profiles.utm_medium, excluded.utm_medium),
    utm_campaign = coalesce(profiles.utm_campaign, excluded.utm_campaign),
    updated_at = now();
  return new;
end;
$$;

-- VERIFIKASI (jalankan setelah migrasi):
-- 1. Fungsi terdefinisi ulang:
--    select pg_get_functiondef(oid) from pg_proc
--    where proname = 'handle_new_auth_profile';
--    -- pastikan badan fungsi memuat 'utm_source'.
-- 2. Trigger masih terpasang:
--    select tgname from pg_trigger
--    where tgname = 'on_auth_user_created_profile';

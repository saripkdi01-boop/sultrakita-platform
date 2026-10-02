-- UTM wiring — perbaiki fungsi trigger yang BENAR-BENAR dipakai production.
--
-- TEMUAN (2026-10-02): trigger live di production adalah
--   on_auth_user_profile_created ON auth.users → handle_new_user_profile()
-- sedangkan migrasi 20261002203100 memperbarui handle_new_auth_profile()
-- yang trigger-nya (on_auth_user_created_profile) TIDAK ADA di production.
-- Akibatnya penyalinan UTM tidak akan pernah fire.
--
-- Migrasi ini menerapkan logika UTM first-touch yang SAMA ke
-- handle_new_user_profile() — fungsi yang benar-benar dipicu trigger live.
-- Additive: tidak mengubah perilaku existing, hanya menambah kolom utm_*
-- dengan semantik first-touch (tidak menimpa nilai yang sudah ada).

create or replace function public.handle_new_user_profile()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, display_name, full_name, username,
    utm_source, utm_medium, utm_campaign
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Warga Sultra'),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'username',
    nullif(new.raw_user_meta_data->>'utm_source', ''),
    nullif(new.raw_user_meta_data->>'utm_medium', ''),
    nullif(new.raw_user_meta_data->>'utm_campaign', '')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    display_name = excluded.display_name,
    username = coalesce(excluded.username, profiles.username),
    utm_source = coalesce(profiles.utm_source, excluded.utm_source),
    utm_medium = coalesce(profiles.utm_medium, excluded.utm_medium),
    utm_campaign = coalesce(profiles.utm_campaign, excluded.utm_campaign),
    updated_at = now();
  insert into public.profile_contacts (profile_id, email)
  values (new.id, new.email)
  on conflict (profile_id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

-- VERIFIKASI (harus true):
-- select prosrc like '%utm_source%' as has_utm_copy from pg_proc
-- where proname = 'handle_new_user_profile';

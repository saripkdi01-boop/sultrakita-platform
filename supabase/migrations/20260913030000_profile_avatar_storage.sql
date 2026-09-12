-- Public profile avatars: bounded image storage with owner-managed writes.
alter table public.profiles
  add column if not exists visibility_settings jsonb not null default '{"full_name":"public","username":"public","bio":"public","phone":"followers","email":"private","location":"public","interests":"public","online_status":"followers","avatar":"public"}'::jsonb;

alter table public.profiles
  alter column visibility_settings set default '{"full_name":"public","username":"public","bio":"public","phone":"followers","email":"private","location":"public","interests":"public","online_status":"followers","avatar":"public"}'::jsonb;

update public.profiles
set visibility_settings = coalesce(visibility_settings, '{}'::jsonb) || '{"avatar":"public"}'::jsonb
where visibility_settings is null or not (visibility_settings ? 'avatar');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[])
on conflict (id) do update set
  name = excluded.name,
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists avatars_public_read on storage.objects;
create policy avatars_public_read
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

drop policy if exists avatars_owner_insert on storage.objects;
create policy avatars_owner_insert
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists avatars_owner_update on storage.objects;
create policy avatars_owner_update
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text))
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists avatars_owner_delete on storage.objects;
create policy avatars_owner_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

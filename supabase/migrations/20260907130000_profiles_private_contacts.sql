-- Profile recipient foundation for seller notifications.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Warga Sultra',
  full_name text,
  username text unique,
  avatar_url text,
  bio text,
  district text,
  phone text,
  role text not null default 'user',
  is_seller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles add column if not exists is_seller boolean not null default false;

create table if not exists public.profile_contacts (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  email text not null,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.profile_contacts enable row level security;
drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read on public.profiles for select to anon, authenticated using (true);
drop policy if exists profiles_owner_write on public.profiles;
create policy profiles_owner_write on public.profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user_profile()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, full_name, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Warga Sultra'), new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username')
  on conflict (id) do update set full_name = excluded.full_name, display_name = excluded.display_name, username = coalesce(excluded.username, profiles.username), updated_at = now();
  insert into public.profile_contacts (profile_id, email)
  values (new.id, new.email)
  on conflict (profile_id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_profile_created on auth.users;
create trigger on_auth_user_profile_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_new_user_profile();

insert into public.profiles (id, display_name, full_name, username)
select id, coalesce(raw_user_meta_data->>'full_name', 'Warga Sultra'), raw_user_meta_data->>'full_name', raw_user_meta_data->>'username'
from auth.users
on conflict (id) do nothing;
insert into public.profile_contacts (profile_id, email)
select id, email from auth.users where email is not null
on conflict (profile_id) do update set email = excluded.email, updated_at = now();

-- SultraKita Auth Profiles: additive migration for existing social profiles.
create extension if not exists pgcrypto;
alter table if exists public.profiles add column if not exists full_name text;
alter table if exists public.profiles add column if not exists email text;
alter table if exists public.profiles add column if not exists phone text;
alter table if exists public.profiles add column if not exists phone_verified boolean not null default false;
alter table if exists public.profiles add column if not exists email_verified boolean not null default false;
alter table if exists public.profiles add column if not exists city text default 'Kendari';
alter table if exists public.profiles add column if not exists province text default 'Sulawesi Tenggara';
alter table if exists public.profiles add column if not exists role text default 'buyer';
alter table if exists public.profiles add column if not exists is_verified boolean not null default false;
alter table if exists public.profiles add column if not exists is_active boolean not null default true;
alter table if exists public.profiles add column if not exists language text not null default 'id';
alter table if exists public.profiles add column if not exists currency text not null default 'IDR';
alter table if exists public.profiles add column if not exists timezone text not null default 'Asia/Makassar';
alter table if exists public.profiles add column if not exists google_id text;
alter table if exists public.profiles add column if not exists facebook_id text;
alter table if exists public.profiles add column if not exists two_factor_enabled boolean not null default false;
alter table if exists public.profiles add column if not exists last_login_at timestamptz;
alter table if exists public.profiles add column if not exists login_count integer not null default 0;
alter table if exists public.profiles add column if not exists updated_at timestamptz not null default now();
create unique index if not exists profiles_google_id_uidx on public.profiles(google_id) where google_id is not null;
create unique index if not exists profiles_facebook_id_uidx on public.profiles(facebook_id) where facebook_id is not null;
create index if not exists profiles_role_idx on public.profiles(role);

create table if not exists public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, role text not null check (role in ('buyer','seller','admin','creator','community','moderator')), granted_at timestamptz not null default now(), granted_by uuid references auth.users(id), expires_at timestamptz, is_active boolean not null default true, unique(user_id, role));
create table if not exists public.login_history (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, login_method text not null check (login_method in ('google','facebook','email','phone')), ip_address inet, user_agent text, device_info jsonb, location text, is_successful boolean not null default true, failure_reason text, created_at timestamptz not null default now());
create index if not exists user_roles_user_idx on public.user_roles(user_id);
create index if not exists login_history_user_idx on public.login_history(user_id, created_at desc);
alter table public.user_roles enable row level security; alter table public.login_history enable row level security;
drop policy if exists user_roles_owner_read on public.user_roles; create policy user_roles_owner_read on public.user_roles for select to authenticated using (auth.uid() = user_id);
drop policy if exists login_history_owner_read on public.login_history; create policy login_history_owner_read on public.login_history for select to authenticated using (auth.uid() = user_id);

create or replace function public.handle_new_auth_profile() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, email, full_name, display_name, avatar_url, username) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Warga Sultra'), new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'username') on conflict (id) do update set email = coalesce(excluded.email, profiles.email), full_name = coalesce(excluded.full_name, profiles.full_name), avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url), updated_at = now(); return new; end; $$;
drop trigger if exists on_auth_user_created_profile on auth.users; create trigger on_auth_user_created_profile after insert on auth.users for each row execute function public.handle_new_auth_profile();

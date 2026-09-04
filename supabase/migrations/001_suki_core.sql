create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'buyer' check (role in ('buyer','seller','admin')),
  headline text default 'Pencari ruang baru',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_menu_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  collapsed boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  title text not null,
  location text not null,
  price numeric not null check (price >= 0),
  currency text not null default 'IDR',
  mode text not null default 'sale' check (mode in ('sale','rent')),
  status text not null default 'draft' check (status in ('draft','pending','published','archived')),
  verification_status text not null default 'unverified' check (verification_status in ('unverified','verified','select')),
  sikumbang_id text,
  units_remaining integer check (units_remaining is null or units_remaining >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  amount numeric not null check (amount > 0),
  note text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.partnerships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  organization text not null,
  status text not null default 'pending' check (status in ('pending','contacted','closed')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_menu_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.listings enable row level security;
alter table public.donations enable row level security;
alter table public.partnerships enable row level security;

drop policy if exists "profiles own read" on public.profiles;
create policy "profiles own read" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "menu preferences own all" on public.user_menu_preferences;
create policy "menu preferences own all" on public.user_menu_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "notifications own read" on public.notifications;
create policy "notifications own read" on public.notifications for select using (auth.uid() = user_id);
drop policy if exists "notifications own update" on public.notifications;
create policy "notifications own update" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "published listings public read" on public.listings;
create policy "published listings public read" on public.listings for select using (status = 'published');
drop policy if exists "owners manage listings" on public.listings;
create policy "owners manage listings" on public.listings for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "support insert" on public.donations;
create policy "support insert" on public.donations for insert with check (user_id = auth.uid() or user_id is null);
drop policy if exists "partnership insert" on public.partnerships;
create policy "partnership insert" on public.partnerships for insert with check (user_id = auth.uid() or user_id is null);

create index if not exists notifications_user_unread_idx on public.notifications(user_id, is_read, created_at desc);
create index if not exists listings_status_created_idx on public.listings(status, created_at desc);

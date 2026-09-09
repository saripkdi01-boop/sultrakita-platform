-- CMS-driven SUKI ecosystem banners and privacy-safe interaction analytics.
create extension if not exists pgcrypto;

create table if not exists public.ecosystem_banners (
  id uuid primary key default gen_random_uuid(),
  app_slug text not null check (app_slug in ('marketplace', 'jobs', 'suits')),
  eyebrow text not null check (char_length(trim(eyebrow)) between 1 and 120),
  title text not null check (char_length(trim(title)) between 1 and 180),
  description text not null default '' check (char_length(description) <= 500),
  image_url text not null check (char_length(trim(image_url)) between 1 and 2000),
  cta_label text not null check (char_length(trim(cta_label)) between 1 and 80),
  cta_href text not null check (char_length(trim(cta_href)) between 1 and 1000),
  priority integer not null default 0 check (priority between -9999 and 9999),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create index if not exists ecosystem_banners_public_idx
  on public.ecosystem_banners(app_slug, is_active, priority desc, starts_at, ends_at);

create table if not exists public.ecosystem_banner_events (
  id uuid primary key default gen_random_uuid(),
  banner_id uuid not null references public.ecosystem_banners(id) on delete cascade,
  app_slug text not null check (app_slug in ('marketplace', 'jobs', 'suits')),
  event_type text not null check (event_type in ('banner_view', 'banner_cta_click', 'banner_next', 'banner_pause')),
  created_at timestamptz not null default now()
);

create index if not exists ecosystem_banner_events_lookup_idx
  on public.ecosystem_banner_events(app_slug, event_type, created_at desc);

alter table public.ecosystem_banners enable row level security;
alter table public.ecosystem_banner_events enable row level security;

drop policy if exists ecosystem_banners_public_read on public.ecosystem_banners;
create policy ecosystem_banners_public_read on public.ecosystem_banners
  for select to anon, authenticated
  using (is_active = true and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()));

drop policy if exists ecosystem_banners_admin_read on public.ecosystem_banners;
create policy ecosystem_banners_admin_read on public.ecosystem_banners
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists ecosystem_banners_admin_insert on public.ecosystem_banners;
create policy ecosystem_banners_admin_insert on public.ecosystem_banners
  for insert to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists ecosystem_banners_admin_update on public.ecosystem_banners;
create policy ecosystem_banners_admin_update on public.ecosystem_banners
  for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists ecosystem_banners_admin_delete on public.ecosystem_banners;
create policy ecosystem_banners_admin_delete on public.ecosystem_banners
  for delete to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists ecosystem_banner_events_public_insert on public.ecosystem_banner_events;
create policy ecosystem_banner_events_public_insert on public.ecosystem_banner_events
  for insert to anon, authenticated
  with check (
    app_slug in ('marketplace', 'jobs', 'suits')
    and exists (select 1 from public.ecosystem_banners b where b.id = banner_id and b.app_slug = ecosystem_banner_events.app_slug)
  );

drop policy if exists ecosystem_banner_events_admin_read on public.ecosystem_banner_events;
create policy ecosystem_banner_events_admin_read on public.ecosystem_banner_events
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create or replace function public.touch_ecosystem_banners_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ecosystem_banners_updated_at on public.ecosystem_banners;
create trigger ecosystem_banners_updated_at
before update on public.ecosystem_banners
for each row execute function public.touch_ecosystem_banners_updated_at();

comment on table public.ecosystem_banners is 'Admin-managed, scheduled promotional banners for SUKI Marketplace, Jobs, and Suits.';
comment on table public.ecosystem_banner_events is 'Aggregated privacy-safe banner interactions; no user, IP, or device identifiers are stored.';

-- Header ecosystem registry for the annotated SUKI Suits and SUKI Marketplace actions.
create table if not exists public.suki_ecosystem_apps (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug in ('suki-suits', 'suki-marketplace')),
  name text not null,
  short_name text not null,
  route text not null,
  icon text not null,
  position smallint not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.suki_ecosystem_apps (slug, name, short_name, route, icon, position)
values
  ('suki-suits', 'SUKI Suits', 'Suits', '/dashboard', 'message-circle', 5),
  ('suki-marketplace', 'SUKI Marketplace', 'Marketplace', '/marketplace', 'store', 6)
on conflict (slug) do update set name = excluded.name, short_name = excluded.short_name, route = excluded.route, icon = excluded.icon, position = excluded.position, updated_at = now();

alter table public.suki_ecosystem_apps enable row level security;
drop policy if exists suki_ecosystem_apps_public_read on public.suki_ecosystem_apps;
create policy suki_ecosystem_apps_public_read on public.suki_ecosystem_apps for select using (is_active = true);
create index if not exists suki_ecosystem_apps_position_idx on public.suki_ecosystem_apps(position);

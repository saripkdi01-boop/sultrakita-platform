-- JALA game progress sync: web <-> Telegram bot.
--
-- player_key format:
--   'tg:<telegram_user_id>'  untuk bot Telegram
--   'web:<client_uuid>'      untuk web (localStorage UUID)
--
-- Satu pemain bisa punya 2 key terpisah (web & Telegram) — merge akun
-- bisa ditambahkan nanti via kode verifikasi.

create table if not exists public.jala_players (
  id uuid primary key default gen_random_uuid(),
  player_key text unique not null,
  platform text not null check (platform in ('web', 'telegram')),
  username text,
  coins integer not null default 50,
  total_catch integer not null default 0,
  total_kg numeric not null default 0,
  legendary integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists jala_players_key_idx on public.jala_players(player_key);
create index if not exists jala_players_leaderboard_idx
  on public.jala_players(total_kg desc);

create table if not exists public.jala_catches (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.jala_players(id) on delete cascade,
  fish_id text not null,
  fish_name text not null,
  rarity text not null,
  kg numeric not null,
  coins integer not null,
  spot text not null,
  caught_at timestamptz not null default now()
);
create index if not exists jala_catches_player_idx
  on public.jala_catches(player_id, caught_at desc);

-- RLS: API pakai service role, jadi tidak perlu policy publik.
-- Jika nanti butuh akses client langsung, tambahkan policy di sini.
alter table public.jala_players enable row level security;
alter table public.jala_catches enable row level security;

comment on table public.jala_players is 'Progress pemain JALA, sinkron web <-> Telegram.';
comment on table public.jala_catches is 'Riwayat tangkapan JALA per pemain.';

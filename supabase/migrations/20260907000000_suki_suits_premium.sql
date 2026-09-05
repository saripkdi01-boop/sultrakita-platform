-- Suki Suits premium extension. Additive to 20260907000000_suki_properti.sql.
create extension if not exists pgcrypto;

alter table public.properties add column if not exists slug text;
alter table public.properties add column if not exists is_negotiable boolean not null default true;
alter table public.properties add column if not exists floors integer not null default 1;
alter table public.properties add column if not exists ac_available boolean not null default false;
alter table public.properties add column if not exists parking_slots integer not null default 0;
alter table public.properties add column if not exists amenities jsonb not null default '[]'::jsonb;
alter table public.properties add column if not exists province text not null default 'Sulawesi Tenggara';
alter table public.properties add column if not exists postal_code text;
alter table public.properties add column if not exists latitude numeric(10,8);
alter table public.properties add column if not exists longitude numeric(11,8);
alter table public.properties add column if not exists nearby_places jsonb not null default '[]'::jsonb;
alter table public.properties add column if not exists certificate_type text;
alter table public.properties add column if not exists is_admin_verified boolean not null default false;
alter table public.properties add column if not exists verification_documents text[] not null default '{}';
alter table public.properties add column if not exists auction_start_date timestamptz;
alter table public.properties add column if not exists auction_end_date timestamptz;
alter table public.properties add column if not exists starting_bid numeric(12,2);
alter table public.properties add column if not exists current_bid numeric(12,2);
alter table public.properties add column if not exists total_bids integer not null default 0;
alter table public.properties add column if not exists subsidy_program text;
alter table public.properties add column if not exists income_requirement numeric(12,2);
alter table public.properties add column if not exists virtual_tour_url text;
alter table public.properties add column if not exists featured_until timestamptz;
alter table public.properties add column if not exists ai_generated boolean not null default false;
alter table public.properties add column if not exists ai_score numeric(3,2);
alter table public.properties add column if not exists views_count integer not null default 0;
alter table public.properties add column if not exists favorites_count integer not null default 0;
alter table public.properties add column if not exists inquiries_count integer not null default 0;
alter table public.properties add column if not exists published_at timestamptz;
alter table public.properties add column if not exists expires_at timestamptz;
update public.properties set slug = lower(regexp_replace(trim(title) || '-' || substr(id::text,1,8), '[^a-zA-Z0-9]+', '-', 'g')) where slug is null;
create unique index if not exists properties_slug_uidx on public.properties(slug);

create table if not exists public.property_favorites (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, property_id uuid not null references public.properties(id) on delete cascade, created_at timestamptz not null default now(), unique(user_id, property_id));
create table if not exists public.property_inquiries (id uuid primary key default gen_random_uuid(), property_id uuid not null references public.properties(id) on delete cascade, inquirer_id uuid not null references auth.users(id) on delete cascade, message text not null check (char_length(message) between 2 and 2000), contact_method text not null default 'chat' check (contact_method in ('chat','whatsapp','email','phone')), status text not null default 'new' check (status in ('new','contacted','scheduled','closed')), scheduled_viewing_at timestamptz, created_at timestamptz not null default now());
create table if not exists public.property_bids (id uuid primary key default gen_random_uuid(), property_id uuid not null references public.properties(id) on delete cascade, bidder_id uuid not null references auth.users(id) on delete cascade, bid_amount numeric(12,2) not null check (bid_amount > 0), is_winning boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.property_reviews (id uuid primary key default gen_random_uuid(), property_id uuid not null references public.properties(id) on delete cascade, reviewer_id uuid not null references auth.users(id) on delete cascade, rating integer not null check (rating between 1 and 5), comment text, stay_duration text, would_recommend boolean, created_at timestamptz not null default now(), unique(property_id, reviewer_id));

create index if not exists property_favorites_user_idx on public.property_favorites(user_id, created_at desc);
create index if not exists property_inquiries_property_idx on public.property_inquiries(property_id, created_at desc);
create index if not exists property_bids_property_idx on public.property_bids(property_id, bid_amount desc);
create index if not exists property_reviews_property_idx on public.property_reviews(property_id, rating);

alter table public.property_favorites enable row level security;
alter table public.property_inquiries enable row level security;
alter table public.property_bids enable row level security;
alter table public.property_reviews enable row level security;
drop policy if exists property_favorites_select on public.property_favorites; create policy property_favorites_select on public.property_favorites for select to authenticated using (auth.uid() = user_id);
drop policy if exists property_favorites_manage on public.property_favorites; create policy property_favorites_manage on public.property_favorites for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists property_inquiries_insert on public.property_inquiries; create policy property_inquiries_insert on public.property_inquiries for insert to authenticated with check (auth.uid() = inquirer_id);
drop policy if exists property_inquiries_participant_read on public.property_inquiries; create policy property_inquiries_participant_read on public.property_inquiries for select to authenticated using (auth.uid() = inquirer_id or exists (select 1 from public.properties p where p.id = property_id and p.seller_id = auth.uid()));
drop policy if exists property_bids_public_read on public.property_bids; create policy property_bids_public_read on public.property_bids for select to authenticated using (true);
drop policy if exists property_bids_insert on public.property_bids; create policy property_bids_insert on public.property_bids for insert to authenticated with check (auth.uid() = bidder_id);
drop policy if exists property_reviews_public_read on public.property_reviews; create policy property_reviews_public_read on public.property_reviews for select to anon, authenticated using (true);
drop policy if exists property_reviews_insert on public.property_reviews; create policy property_reviews_insert on public.property_reviews for insert to authenticated with check (auth.uid() = reviewer_id);

create or replace function public.update_property_stats() returns trigger language plpgsql security definer set search_path = public as $$ begin if tg_table_name = 'property_favorites' then if tg_op = 'INSERT' then update properties set favorites_count = favorites_count + 1 where id = new.property_id; else update properties set favorites_count = greatest(favorites_count - 1, 0) where id = old.property_id; end if; elsif tg_table_name = 'property_inquiries' and tg_op = 'INSERT' then update properties set inquiries_count = inquiries_count + 1 where id = new.property_id; elsif tg_table_name = 'property_bids' and tg_op = 'INSERT' then update properties set current_bid = new.bid_amount, total_bids = total_bids + 1 where id = new.property_id; end if; return null; end; $$;
drop trigger if exists trg_update_property_stats_favorites on public.property_favorites; create trigger trg_update_property_stats_favorites after insert or delete on public.property_favorites for each row execute function public.update_property_stats();
drop trigger if exists trg_update_property_stats_inquiries on public.property_inquiries; create trigger trg_update_property_stats_inquiries after insert on public.property_inquiries for each row execute function public.update_property_stats();
drop trigger if exists trg_update_property_stats_bids on public.property_bids; create trigger trg_update_property_stats_bids after insert on public.property_bids for each row execute function public.update_property_stats();

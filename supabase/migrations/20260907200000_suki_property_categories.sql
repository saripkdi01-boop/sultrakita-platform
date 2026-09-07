-- Suki Properti: market-aligned categories and listing attributes.
-- Additive migration; legacy category values are normalized before the constraint is tightened.

alter table public.properties drop constraint if exists properties_category_check;
update public.properties set category = 'kontrakan' where category = 'rumah_sewa';
update public.properties set category = 'takeover_kpr' where category = 'rumah_takeover';
update public.properties set category = 'properti_lelang' where category = 'lelang';

alter table public.properties add constraint properties_category_check check (category in (
  'rumah_second', 'rumah_mewah', 'rumah_subsidi', 'kos_kosan', 'kontrakan',
  'tanah_kavling', 'tanah_kosong',
  'ruko', 'gudang', 'kantor', 'ruang_usaha',
  'properti_lelang', 'takeover_kpr', 'properti_developer',
  'apartemen', 'villa_resort'
));

alter table public.properties add column if not exists property_type text;
alter table public.properties add column if not exists condition text not null default 'second';
alter table public.properties add column if not exists furnishing text;
alter table public.properties add column if not exists can_kpr boolean not null default false;
alter table public.properties add column if not exists is_lelang boolean not null default false;
alter table public.properties add column if not exists lelang_type text;
alter table public.properties add column if not exists takeover_status text;

update public.properties set property_type = category where property_type is null;
update public.properties set is_lelang = true where category = 'properti_lelang';
update public.properties set takeover_status = 'available' where category = 'takeover_kpr' and takeover_status is null;

alter table public.properties drop constraint if exists properties_condition_check;
alter table public.properties add constraint properties_condition_check check (condition in ('new', 'second', 'need_renovation'));
alter table public.properties drop constraint if exists properties_furnishing_check;
alter table public.properties add constraint properties_furnishing_check check (furnishing is null or furnishing in ('unfurnished', 'semi_furnished', 'furnished'));
alter table public.properties drop constraint if exists properties_lelang_type_check;
alter table public.properties add constraint properties_lelang_type_check check (lelang_type is null or lelang_type in ('bank_lelang', 'lelang_ecommerce', 'lelang_kpkn'));
alter table public.properties drop constraint if exists properties_takeover_status_check;
alter table public.properties add constraint properties_takeover_status_check check (takeover_status is null or takeover_status in ('available', 'in_progress', 'sold'));

create index if not exists properties_property_type_idx on public.properties(property_type, status);
create index if not exists properties_market_attributes_idx on public.properties(condition, furnishing, can_kpr);

-- Normalize the property ecosystem registry to the canonical SUKI Suits brand.
-- Additive and safe for existing listings: no property rows or user data are changed.
update public.suki_ecosystem_apps
set
  name = 'SUKI Suits',
  short_name = 'Suits',
  route = '/properti',
  icon = 'building-2',
  updated_at = now()
where slug = 'suki-suits';

comment on table public.suki_ecosystem_apps is 'Canonical SUKI ecosystem registry; the property experience is branded SUKI Suits and uses building-2 as its iconic property mark.';

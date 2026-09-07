-- Property RLS hardening: seller inbox updates and protected admin publication fields.

create or replace function public.prevent_seller_publication_bypass()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    return new;
  end if;

  if new.is_admin_verified is distinct from old.is_admin_verified
     or new.published_at is distinct from old.published_at
     or (new.status in ('available', 'rejected') and new.status is distinct from old.status) then
    raise exception 'Only an admin can change property publication or verification state';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_seller_publication_bypass on public.properties;
create trigger trg_prevent_seller_publication_bypass
before update on public.properties
for each row execute function public.prevent_seller_publication_bypass();

drop policy if exists property_inquiries_update_seller on public.property_inquiries;
create policy property_inquiries_update_seller
on public.property_inquiries
for update to authenticated
using (exists (select 1 from public.properties p where p.id = property_id and p.seller_id = auth.uid()))
with check (exists (select 1 from public.properties p where p.id = property_id and p.seller_id = auth.uid()));

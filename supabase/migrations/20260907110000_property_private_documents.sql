-- Property private document keys and complete price-type contract.
-- Object keys are private R2 references; no public URL is stored here.
alter table public.properties
  add column if not exists verification_documents text[] not null default '{}';

do $$
begin
  alter table public.properties drop constraint if exists properties_price_type_check;
  alter table public.properties
    add constraint properties_price_type_check
    check (price_type in ('per_bulan', 'per_tahun', 'total', 'mulai_dari', 'nego'));
exception when duplicate_object then null;
end $$;

create index if not exists properties_verification_documents_idx
  on public.properties using gin (verification_documents);

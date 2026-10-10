-- Riwayat perubahan harga properti (Zillow "Price history").
-- BELUM DIJALANKAN ke production — butuh approval suki via Supabase SQL Editor.
-- Setelah migrasi jalan, updateProperty() otomatis mencatat perubahan harga.

create table if not exists public.property_price_history (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  old_price numeric not null,
  new_price numeric not null,
  changed_at timestamptz not null default now(),
  changed_by uuid references auth.users(id) on delete set null,
  note text
);

create index if not exists idx_property_price_history_property
  on public.property_price_history(property_id, changed_at desc);

alter table public.property_price_history enable row level security;

-- Publik boleh membaca riwayat harga properti yang statusnya available.
create policy "public read price history of available properties"
  on public.property_price_history for select
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_price_history.property_id
        and p.status = 'available'
    )
  );

-- Insert hanya via service role / server action (tidak ada policy insert publik).

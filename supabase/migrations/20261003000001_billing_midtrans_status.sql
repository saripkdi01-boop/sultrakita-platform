-- =====================================================================
-- BILLING MIDTRANS: status order untuk pembayaran nyata (Midtrans)
--
-- *** FILE SAJA — BELUM DI-APPLY. Wajib persetujuan eksplisit user ***
-- *** sebelum dijalankan ke Supabase (SQL editor).                  ***
--
-- Menambah status 'paid' | 'failed' | 'expired' ke billing_orders
-- untuk order provider='midtrans'. Status sandbox_* tetap dipertahankan.
-- Idempoten: aman dijalankan ulang; kompatibel bila migrasi Xendit
-- 20261003000000 sudah/sedang diterapkan (hasil akhir constraint sama).
-- =====================================================================

do $$
begin
  -- Hapus constraint lama bila ada (nama default Postgres untuk CHECK inline).
  if exists (
    select 1 from pg_constraint
    where conrelid = 'public.billing_orders'::regclass
      and conname = 'billing_orders_status_check'
  ) then
    alter table public.billing_orders drop constraint billing_orders_status_check;
  end if;
end $$;

alter table public.billing_orders
  add constraint billing_orders_status_check
  check (status in (
    'draft', 'pending', 'cancelled',
    'sandbox_paid', 'sandbox_failed',
    'paid', 'failed', 'expired'
  ));

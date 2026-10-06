-- Midtrans production billing support.
--
-- 1. Perluas status billing_orders untuk pembayaran nyata via Midtrans:
--    'paid' (settlement/capture berhasil), 'failed' (deny/cancel/expire).
-- 2. Tambah kolom referensi provider.

alter table billing_orders
  drop constraint if exists billing_orders_status_check;

alter table billing_orders
  add constraint billing_orders_status_check
  check (status in ('draft', 'pending', 'paid', 'failed', 'sandbox_paid', 'sandbox_failed', 'cancelled'));

alter table billing_orders
  add column if not exists provider_ref text,
  add column if not exists paid_at timestamptz;

comment on column billing_orders.provider_ref is 'Referensi provider pembayaran (mis. Midtrans transaction_id).';
comment on column billing_orders.paid_at is 'Waktu pembayaran dikonfirmasi provider.';

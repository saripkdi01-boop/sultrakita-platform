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

-- ---------------------------------------------------------------------------
-- 3. Dukungan order via bot Telegram (tanpa akun web):
--    - payment_method: mis. 'qris', 'snap'
--    - customer_ref: identitas pelanggan eksternal (mis. 'tg:username')
--    - user_id boleh null untuk order Telegram
-- ---------------------------------------------------------------------------
alter table billing_orders
  add column if not exists payment_method text,
  add column if not exists customer_ref text;

alter table billing_orders
  alter column user_id drop not null;

-- plan_id boleh null untuk produk Telegram yang tidak terikat billing_plans.
alter table billing_orders
  alter column plan_id drop not null;

comment on column billing_orders.payment_method is 'Metode pembayaran (mis. qris via Midtrans Core API).';
comment on column billing_orders.customer_ref is 'Identitas pelanggan non-web, mis. tg:username.';

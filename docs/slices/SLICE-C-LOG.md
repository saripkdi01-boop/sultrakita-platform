# SLICE-C Log — Monetisasi Sandbox SukiApps

Pemilik: SLICE-C. Tanggal: 2026-10-01.

## Ringkasan
Fondasi billing mode SANDBOX selesai: migrasi (plans, entitlements,
billing_orders, webhook_events + RLS + RPC atomik), lib billing (plans,
entitlements server-side, adapter sandbox, logika webhook murni), API
checkout + webhook idempoten, admin UI billing dengan banner jujur
`not_configured`, dokumen MONETIZATION_PLAN.md, env example.

## File yang dibuat/diubah (milik SLICE-C)
- `supabase/migrations/20261001140003_billing_sandbox.sql` (baru)
- `next-app/lib/billing/plans.ts` (baru)
- `next-app/lib/billing/entitlements.ts` (baru)
- `next-app/lib/billing/sandbox.ts` (baru)
- `next-app/lib/billing/webhook-logic.ts` (baru, murni — bisa unit-test)
- `next-app/app/api/billing/checkout/route.ts` (baru)
- `next-app/app/api/billing/webhook/route.ts` (baru)
- `next-app/app/admin/billing/page.tsx` (baru)
- `next-app/app/admin/billing/actions.ts` (baru)
- `next-app/.env.example` (append 3 kunci SUKI_BILLING_*)
- `docs/MONETIZATION_PLAN.md` (baru)
- `docs/slices/SLICE-C-LOG.md` (file ini)

## Keputusan desain
1. **Tabel `orders`/`promotions` lama TIDAK dipakai ulang** — keduanya milik
   alur transaksi marketplace (buyer/seller) dan promosi listing dari migrasi
   lama, bukan kontrak billing. Kontrak bersih memakai prefix `billing_*`.
2. **`billing_orders.status`**: `draft` → `pending` → `sandbox_paid` |
   `sandbox_failed` | `cancelled`. INSERT hanya via service role (tanpa policy
   INSERT publik) sesuai aturan.
3. **Entitlement unik per (user_id, feature_key)**; grant dari webhook bersifat
   upsert dan berlaku 30 hari. Konsumsi kuota atomik via RPC
   `billing_consume_entitlement` (fallback guard `used_value` bila RPC gagal).
4. **Webhook selalu 200** `{ received: true }`; event duplikat ditandai
   `duplicate`; order final tidak diproses ulang (`ignore_terminal`).
5. **Admin UI jujur**: banner "Mode SANDBOX — pembayaran nyata belum
   dikonfigurasi (not_configured)"; label status memakai kata "simulasi".
6. Harga paket adalah **asumsi**; snapshot harga disimpan di order.

## Ketergantungan lintas slice
- `@/lib/security/audit` (`logAuditEvent`) milik SLICE-A — **sudah mendarat**
  di worktree saat verifikasi berjalan (`lib/security/audit.ts`); signature
  `logAuditEvent(supabase, {...})` cocok dengan pemakaian di
  `app/admin/billing/actions.ts`.
- Rate limiter terpusat `@/lib/security/rate-limit` (milik SLICE-A) juga sudah
  mendarat — route checkout memakai `checkRateLimit` (10/menit per pengguna,
  429 + Retry-After). TODO rate-limit dihapus.
- Nama event analytics `checkout_started` / `purchase_sandbox_completed`
  mengikuti kontrak SLICE-D; implementasi `trackEvent` milik SLICE-D.

## Verifikasi
- `npx tsc --noEmit`: LOLOS (exit 0, tanpa error). Catatan: sempat ada error
  TS2802 sesaat di `lib/security/rate-limit.ts` milik SLICE-A saat slice
  tersebut masih mengerjakannya; sudah diperbaiki pemiliknya sebelum commit ini.
- `npx eslint lib/billing app/api/billing app/admin/billing`: LOLOS (tanpa
  error/warning). `npm run lint` keseluruhan lolos — hanya warning di file
  lama yang sudah ada sebelumnya.
- Unit test `processWebhookEvent` (node vs hasil kompilasi tsc ke /tmp,
  skrip `/tmp/billing-webhook-test.js`): **9/9 lolos** — grant paid/pending,
  mark failed/pending, duplicate saat event_id sudah diproses (tidak grant
  ulang), ignore_terminal untuk sandbox_paid/sandbox_failed/cancelled,
  reject payload non-sandbox, grant untuk draft.

## Blocker
- Tidak ada blocker internal. Blocker eksternal: file audit SLICE-A (lihat di atas).

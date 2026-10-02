# Billing Midtrans (Snap) — SUKI Apps

Integrasi pembayaran nyata via **Midtrans Snap**. Status: **SCAFFOLD** —
kode siap, tetapi TIDAK aktif sampai checklist go-live di bawah selesai.
Tanpa kredensial, semua endpoint menolak jujur (`503 not_configured`).

> Alternatif Xendit tetap ada di branch `fitur/billing-live-scaffold`
> (tidak diganggu branch ini).

## Arsitektur

```
User klik "Bayar" (paket basic/pro)
  -> POST /api/billing/midtrans/checkout { planId }   (auth, zod, rate-limit 10/mnt, CSRF)
  -> resolveBillingProvider() wajib 'midtrans' (selain itu 503 not_configured)
  -> assertKeyAllowed() — kunci PRODUCTION ditolak tanpa SUKI_BILLING_ALLOW_LIVE=true
  -> insert billing_orders (pending, provider='midtrans')
  -> POST Snap API /snap/v1/transactions (Basic auth server key)
  -> simpan provider_ref = order_id Midtrans (`suki_<uuid>`)
  -> return { redirectUrl, snapToken } -> user redirect ke halaman Midtrans

Midtrans -> POST /api/billing/midtrans/webhook (notifikasi)
  -> verifikasi signature_key = SHA512(order_id+status_code+gross_amount+serverKey)
     timing-safe; server key kosong -> 401 TOLAK SEMUA (fail-closed)
  -> idempotency: webhook_events.event_id = midtrans:<order_id>:<transaction_status>
  -> cari order (provider='midtrans', provider_ref=order_id); order terminal -> abaikan
  -> bila capture/settlement: konfirmasi ulang GET /v2/{order_id}/status
     + gross_amount >= order.amount -> grantEntitlement + status 'paid'
  -> deny/cancel/expire/failure -> status 'failed'
  -> selalu 200 setelah verifikasi lolos (Midtrans tidak retry liar)
```

### Status Midtrans yang ditangani

| transaction_status | Aksi |
|---|---|
| `settlement` | Grant entitlement → order `paid` (setelah re-konfirmasi + cek nominal) |
| `capture` + `fraud_status=accept` | Grant entitlement → order `paid` |
| `capture` + `fraud_status=challenge` | Dicatat, TANPA grant (tinjau manual) |
| `pending` | Dicatat, tanpa aksi (menunggu) |
| `deny` / `cancel` / `expire` / `failure` | Order → `failed` |
| `refund` / `partial_refund` / lainnya | Dicatat, tanpa aksi |

## Environment variables (Vercel → Production, server-only)

| Var | Wajib | Contoh |
|---|---|---|
| `SUKI_BILLING_PROVIDER` | Ya | `midtrans` |
| `MIDTRANS_SERVER_KEY` | Ya | `SB-Mid-server-…` (sandbox) / `Mid-server-…` (production) |
| `MIDTRANS_CLIENT_KEY` | Ya | `SB-Mid-client-…` / `Mid-client-…` |
| `MIDTRANS_IS_PRODUCTION` | Ya | `false` (sandbox) / `true` (production) |
| `SUKI_BILLING_ALLOW_LIVE` | Untuk production | `true` — tanpa ini scaffold MENOLAK kunci production |

Jangan pernah prefix `NEXT_PUBLIC_` untuk key di atas. Jangan commit key ke repo.

## Database

Migrasi `supabase/migrations/20261003000001_billing_midtrans_status.sql`
(**FILE SAJA — belum di-apply**): menambah status
`paid`/`failed`/`expired` ke `billing_orders`. Butuh persetujuan eksplisit
sebelum dijalankan via Supabase SQL editor. Idempoten & kompatibel dengan
migrasi Xendit `20261003000000` (hasil akhir sama).

## CHECKLIST GO-LIVE (untuk Sarip)

1. **Dashboard Midtrans → Settings → Configuration** — isi **Payment
   Notification URL**: `https://sukiapps.web.id/api/billing/midtrans/webhook`
   (agar status bayar masuk otomatis).
2. **Apply migrasi** `20261003000001_billing_midtrans_status.sql` via
   Supabase SQL editor (butuh persetujuan eksplisit per kejadian).
3. **Set 4 env di Vercel (Production)**: `SUKI_BILLING_PROVIDER=midtrans`,
   `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION`,
   `SUKI_BILLING_ALLOW_LIVE` (lihat tabel di atas).
4. **Uji SANDBOX dulu** — butuh kunci sandbox terpisah (`SB-Mid-server-…`).
   ⚠️ Kunci yang diberikan kemarin adalah **production** — JANGAN dipakai
   untuk uji coba. Minta/generate kunci sandbox di dashboard Midtrans
   (mode sandbox) bila belum ada.
5. **Uji LIVE nominal kecil** (mis. paket termurah, bayar lalu cek
   entitlement masuk) — HANYA atas perintah eksplisit, tidak otomatis.
6. Merge branch `fitur/billing-midtrans` ke main + deploy (butuh go eksplisit).

## Keamanan (ringkas)

- Server key hanya dibaca dari env, tidak pernah di-log/disimpan di kode.
- Webhook fail-closed: tanpa server key → 401 untuk semua notifikasi.
- Guard produksi: kunci `Mid-server-*` ditolak tanpa `SUKI_BILLING_ALLOW_LIVE=true`.
- Anti-spoofing lapis 2: status sukses selalu dikonfirmasi ulang ke Status API
  + nominal dibayar harus ≥ nominal order sebelum entitlement diberikan.
- Idempotency via `webhook_events` — notifikasi ganda tidak menyebabkan double-grant.
- CSRF + rate limit di checkout; order INSERT hanya via service role.

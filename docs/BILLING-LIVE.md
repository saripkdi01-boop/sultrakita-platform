# BILLING LIVE — Fondasi Pembayaran Nyata SukiApps

> **Status: SCAFFOLD / TEST.** Tidak ada kredensial asli di repo.
> Semua route menolak jujur (`503 not_configured`) bila belum dikonfigurasi.
> Migrasi `20261003000000_billing_live_scaffold.sql` = FILE SAJA, belum di-apply.

## 1. Keputusan provider: Xendit ✅

| Kriteria | Xendit | Midtrans |
|---|---|---|
| **Biaya QRIS** | 0,7% | 0,7% |
| **Biaya Virtual Account** | Rp 4.500–5.000/txn | Rp 4.000/txn |
| **Biaya e-wallet (GoPay/OVO/DANA/ShopeePay)** | 1,5–2% | 1,5–2% |
| **Kartu kredit domestik** | 2,9% + Rp 2.000 | 2,9% + Rp 2.000 |
| **Settlement VA** | T+2 | T+1 |
| **Settlement QRIS / e-wallet** | T+1 | T+1 |
| **Setup** | Gratis | Gratis |
| **Integrasi checkout** | **Invoice API: 1× POST → `invoice_url` (hosted)** | Snap: server token + popup JS di frontend |
| **Verifikasi webhook** | **`x-callback-token` (string compare, simpel)** | `signature_key` = SHA512(order_id+status+gross+serverKey) |
| **Dokumentasi** | Inggris, modern | Indonesia, lengkap |

**Alasan memilih Xendit untuk SukiApps:**
1. **Paling cocok dengan arsitektur yang ada.** Alur sandbox sekarang: checkout → return `checkoutUrl` → user redirect. Xendit Invoice API melakukan persis itu (`invoice_url`) — **tanpa perubahan frontend sama sekali**. Midtrans Snap butuh popup JS + client key di browser = lebih invasif.
2. **Halaman bayar hosted**: Xendit yang mengurus QRIS/VA/e-wallet/retail — nol UI pembayaran yang harus dibangun/dirawat tim kecil.
3. **Webhook paling sederhana**: cukup cocokkan `x-callback-token` (timing-safe), tidak perlu meracik hash dari banyak field.
4. **Harga setara** di metode yang relevan untuk paket Rp 49rb–149rb (QRIS 0,7% sama; e-wallet sama). Selisih VA Rp 500–1.000/txn tidak signifikan untuk langganan bulanan.
5. **Caveat jujur**: settlement kartu kredit Xendit T+7 (Midtrans T+2) — hampir tidak relevan karena pasar UMKM Kendari membayar via QRIS/VA/e-wallet, bukan kartu kredit.

## 2. Arsitektur

```
User klik "Pilih Paket" (Basic/Pro)
  -> POST /api/billing/xendit/checkout  (auth, zod, rate-limit 10/mnt, CSRF)
  -> insert billing_orders (pending, provider='xendit')
  -> POST api.xendit.co/v2/invoices  (external_id = suki_<orderId>)
  -> return { invoiceUrl } -> user redirect ke halaman Xendit
  -> user bayar (QRIS/VA/e-wallet/retail)
  -> Xendit POST https://sukiapps.web.id/api/billing/xendit/webhook
     (header x-callback-token)
  -> verifikasi token (fail-closed) -> idempotency check
  -> PAID/SETTLED: konfirmasi ulang GET /v2/invoices/{id} +
     paid_amount >= order.amount -> grant entitlements -> status 'paid'
  -> EXPIRED -> 'expired' | FAILED -> 'failed'
  -> selalu 200 { received: true } (kecuali token invalid -> 401)
```

**Keamanan (tidak mengulangi gap kritis #1):**
- `XENDIT_CALLBACK_TOKEN` kosong → **semua** webhook ditolak 401 (tidak ada fallback).
- Perbandingan token memakai `timingSafeEqual`.
- Konfirmasi ulang status ke API Xendit sebelum grant — webhook palsu tidak bisa mengaktifkan paket walau token bocor.
- Guard kunci LIVE: `xnd_production_*` ditolak kecuali `SUKI_BILLING_ALLOW_LIVE=true`.

## 3. Environment variables

| Var | Wajib | Contoh | Keterangan |
|---|---|---|---|
| `SUKI_BILLING_PROVIDER` | ya | `xendit` | default `sandbox` |
| `XENDIT_API_KEY` | ya (utk live) | `xnd_development_xxx` | Test/live key dari dashboard Xendit |
| `XENDIT_CALLBACK_TOKEN` | ya (utk live) | — | Settings → Webhooks → Callback Verification Token |
| `SUKI_BILLING_ALLOW_LIVE` | — | `false` | Guard anti-kecelakaan kunci production |
| `SUKI_BILLING_CURRENCY` | — | `IDR` | default IDR |

## 4. Checklist go-live (yang butuh manusia)

### A. Akun Xendit (Sarip, ~1–2 hari verifikasi)
1. Daftar di **xendit.co** → pilih akun **bisnis**.
2. Verifikasi: **KTP** pemilik + **rekening bank** atas nama pemilik/perusahaan. (PT/CV **tidak wajib** untuk mulai — perorangan/UMKM bisa; limit & fitur penuh terbuka setelah verifikasi lengkap.)
3. Setelah disetujui → dapat **API key** (`xnd_production_...`) + **Callback Verification Token**.

### B. Konfigurasi Xendit dashboard (Sarip, 10 menit)
1. **Settings → Webhooks**: callback URL invoice = `https://sukiapps.web.id/api/billing/xendit/webhook`; salin **Callback Verification Token**.
2. Aktifkan metode pembayaran yang diinginkan (QRIS, VA bank, e-wallet, retail).

### C. Vercel env (Sarip, 5 menit)
Set di Vercel → Project → Settings → Environment Variables (Production):
- `SUKI_BILLING_PROVIDER` = `xendit`
- `XENDIT_API_KEY` = `xnd_production_...`
- `XENDIT_CALLBACK_TOKEN` = token dari langkah B
- `SUKI_BILLING_ALLOW_LIVE` = `true`

### D. Database (butuh persetujuan eksplisit Sarip)
Jalankan via Supabase SQL editor: `supabase/migrations/20261003000000_billing_live_scaffold.sql`
(menambah status `paid`/`failed`/`expired` ke `billing_orders`).

### E. Uji end-to-end TEST dulu (sebelum live)
1. Pakai **test key** (`xnd_development_...`) + `SUKI_BILLING_ALLOW_LIVE=false` di preview/staging.
2. Checkout paket Basic → bayar via QRIS test → webhook PAID → entitlement aktif → order `paid`.
3. Coba webhook tanpa token → harus 401. Coba token salah → 401.
4. Baru ganti ke production key + `SUKI_BILLING_ALLOW_LIVE=true`.

### F. UI (opsional, belum di-scaffold)
Halaman `/billing` publik untuk memilih paket + tombol checkout memanggil
`/api/billing/xendit/checkout` lalu redirect ke `invoiceUrl`. (Halaman admin
billing sudah ada.)

## 5. File di branch ini

- `next-app/lib/billing/xendit.ts` — klien Invoice API + guard kunci
- `next-app/lib/billing/provider.ts` — resolver provider (default aman: sandbox)
- `next-app/lib/billing/xendit-webhook.ts` — verifikasi token + mapping status
- `next-app/app/api/billing/xendit/checkout/route.ts` — POST checkout
- `next-app/app/api/billing/xendit/webhook/route.ts` — POST webhook (fail-closed)
- `supabase/migrations/20261003000000_billing_live_scaffold.sql` — FILE SAJA
- `next-app/lib/env.ts`, `next-app/.env.example` — env baru

## 6. Estimasi jujur menuju LIVE

| Langkah | Estimasi | Pemilik |
|---|---|---|
| Daftar + verifikasi akun Xendit (KTP + rekening) | 1–3 hari (antre verifikasi) | Sarip |
| Konfigurasi webhook + metode bayar di dashboard | 30 menit | Sarip |
| Set 4 env di Vercel + redeploy | 15 menit | Sarip |
| Apply 1 migrasi SQL (butuh approval) | 10 menit | Muse/Sarip |
| Uji TEST end-to-end (checkout→bayar→webhook→entitlement) | 1–2 jam | Muse + Sarip |
| Halaman /billing publik + tombol checkout di UI | 2–4 jam | Muse |
| Uji LIVE nominal kecil (Rp 10rb) + refund test | 1 jam | Sarip |
| **Total** | **±1 minggu kalender** (mayoritas antre verifikasi Xendit) | — |

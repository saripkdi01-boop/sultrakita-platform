# Rencana Monetisasi SukiApps (SANDBOX)

> Status: **SANDBOX** — fondasi teknis selesai, pembayaran nyata **belum
> dikonfigurasi** (`not_configured`). Semua angka harga di dokumen ini adalah
> **asumsi perancangan, bukan harga final**. Jangan menagih pengguna sebelum
> provider nyata terintegrasi dan lolos review legal/keuangan.

Pemilik dokumen: SLICE-C. Terakhir diperbarui: 2026-10-01.

## 1. Persona

| Persona | Siapa | Kebutuhan berbayar |
|---|---|---|
| Penjual (seller) | UMKM/individu jual barang di marketplace | Listing terlihat lebih dulu (featured), dorong listing (boost) |
| Pemilik/agen properti | Agen & pemilik properti lokal | Listing properti unggulan, lencana terverifikasi |
| Pemberi kerja (employer) | UMKM butuh karyawan | Lowongan premium, jangkauan lebih luas |
| Bisnis lokal | Warung, jasa, kuliner | Lencana bisnis terverifikasi, langganan merchant |

## 2. Value proposition per surface

| Surface | Produk | Entitlement key |
|---|---|---|
| Marketplace | Featured listing — listing tampil di slot unggulan selama 7 hari | `featured_listings` (kuota/bln) |
| Marketplace | Boost — dorong listing ke atas hasil pencarian (1x pakai) | `boost_credits` (kuota/bln) |
| Profil bisnis | Verified business — lencana "Terverifikasi" + prioritas di direktori | `verified_business` (0/1) |
| Merchant | Langganan merchant — gabungan featured + boost + verifikasi | paket `basic`/`pro` |
| Jobs | Premium job post — lowongan tampil di atas + badge "Unggulan" | `premium_job_posts` (kuota/bln) |

## 3. Asumsi pricing (IDR — asumsi, bukan harga final)

| Paket | Harga/bln (asumsi) | Isi |
|---|---|---|
| Gratis | Rp0 | Listing standar tanpa batas, 1 lowongan premium/bln |
| Basic | Rp49.000 | 4 featured/bln, 10 boost/bln, 5 lowongan premium/bln, lencana terverifikasi |
| Pro | Rp149.000 | 20 featured/bln, 50 boost/bln, 20 lowongan premium/bln, lencana terverifikasi, prioritas dukungan |
| Enterprise | Belum ditetapkan | Kuota custom — hubungi tim SukiApps |

Harga disalin ke `billing_orders.amount` sebagai snapshot saat checkout agar
perubahan harga paket tidak mengubah riwayat order.

## 4. Funnel event (kontrak analytics SLICE-D)

Nama event mengikuti kontrak bersama di `IMPLEMENTATION_PLAN.md`:

- `checkout_started` — pengguna menekan "Upgrade/Beli" (payload: `planId`, `amount`, `sandbox: true`).
- `purchase_sandbox_completed` — webhook sandbox memproses outcome `paid` dan entitlement diberikan (payload: `orderId`, `planId`, `sandbox: true`).

Event analytics milik SLICE-D; slice ini hanya mencatat nama event yang dipakai
di alur billing agar taksonomi konsisten.

## 5. Unit economics (asumsi awal)

- Asumsi: biaya payment gateway ~2–3% + Rp2.000–5.000 per transaksi (cek ulang saat pilih provider).
- Target kontribusi margin per paket Basic: > 85% setelah fee gateway.
- Frekuensi: langganan bulanan, tanpa kontrak tahunan di fase awal.
- Break-even kasar: 200 pelanggan Basic/bln menutup estimasi biaya infra tambahan
  (angka ilustratif — hitung ulang dengan biaya aktual sebelum launch).

## 6. Risiko abuse & mitigasi

| Risiko | Mitigasi |
|---|---|
| Fake payment callback — penyerang memanggil webhook langsung | Verifikasi signature HMAC-SHA256 bila secret diset; mode sandbox tanpa secret hanya terima header `x-sandbox: true` dari dalam; idempotency `event_id` |
| Entitlement bypass — client mengklaim punya plan | Semua cek entitlement server-side (`lib/billing/entitlements.ts`); jangan percaya klaim client |
| Double-spend kuota — request paralel memakai kuota yang sama | Konsumsi atomik via RPC `billing_consume_entitlement` (guard `used_value < limit_value`) |
| Replay webhook | `webhook_events.event_id` unique; event duplikat ditandai `duplicate`, tidak diproses ulang |
| Order status final diubah lagi | Webhook menolak transisi dari status final (`ignore_terminal`) |

## 7. Refund & chargeback (pertimbangan, belum diimplementasikan)

- Kebijakan refund: tentukan sebelum live (mis. 7 hari untuk langganan pertama).
- Teknis: tambah status `refunded` di `billing_orders` + revoke entitlement via
  `valid_until` yang dipercepat — JANGAN hapus baris entitlement (audit trail).
- Chargeback: butuh dashboard sengketa manual di fase provider nyata; di sandbox
  cukup `cancelled` oleh admin + audit log.

## 8. Rollout plan

1. **Sandbox (sekarang)** — alur checkout → webhook → entitlement terverifikasi
   via skrip; admin UI menampilkan status jujur `not_configured`.
2. **Provider (berikutnya)** — pilih Xendit atau Midtrans; implementasikan adapter
   nyata terpisah (`lib/billing/xendit.ts`), JANGAN ubah kontrak sandbox;
   set `SUKI_BILLING_PROVIDER`, isi `SUKI_BILLING_WEBHOOK_SECRET`.
3. **Live** — setelah: review legal (syarat & ketentuan, kebijakan refund),
   uji end-to-end di akun staging provider, checklist aktivasi di bawah hijau.

## 9. Activation checklist

| Item | Status |
|---|---|
| Tabel billing + RLS | ✅ selesai (migrasi 20261001140003) |
| Adapter sandbox + webhook idempoten | ✅ selesai |
| Admin UI billing | ✅ selesai |
| Provider pembayaran nyata | ⬜ `not_configured` |
| Webhook secret produksi | ⬜ `not_configured` |
| Syarat & ketentuan + kebijakan refund | ⬜ belum ada |
| Uji E2E provider di staging | ⬜ belum ada |
| Persetujuan launch dari pemilik | ⬜ belum ada |

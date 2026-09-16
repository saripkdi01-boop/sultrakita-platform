# Fase 5 — Ranking Deterministik dan Discovery Feed Suki

**Tanggal:** 17 September 2026  
**Branch:** `suki-feed-preview-20260917`  
**Status:** Source dan smoke test lulus; belum production

## Implementasi

Route `/api/feed` sekarang memiliki ranking metadata deterministik yang dapat dijelaskan:

- `following` jika actor termasuk akun yang diikuti pengguna;
- `popular` jika total like, komentar visible, dan share mencapai threshold minimal;
- `fresh` jika pembaruan berusia maksimal 24 jam;
- `null` jika tidak ada sinyal yang cukup.

Response kini memakai:

```text
rankingVersion: deterministic-v1
```

Viewer state juga diisi:

```text
followingActor: boolean
```

Status `following` memakai tabel `follows` dan hanya dibaca untuk user authenticated.

## Batas privasi

Fase ini tidak melakukan:

- akses `navigator.geolocation`;
- pengumpulan kontak;
- pencarian berdasarkan nomor telepon;
- penyimpanan koordinat presisi;
- inferensi lokasi tanpa persetujuan.

Lokasi dan kontak tetap ditunda ke fase koneksi terpisah dengan opt-in eksplisit.

## Smoke test

Build terbaru berhasil dikompilasi. Smoke test lokal dengan staging menghasilkan:

```json
{
  "status": "ok",
  "items": 2,
  "rankingVersion": "deterministic-v1",
  "contract": "suki-feed-v1",
  "reasons": [null, null]
}
```

Alasan `null` valid karena data fixture staging tidak memenuhi sinyal following, popular, atau fresh. Sistem tidak mengarang label rekomendasi.

## Verifikasi

| Pemeriksaan | Hasil |
|---|---|
| Contract test | 9/9 lulus |
| Root lint | Lulus |
| Next.js typecheck | Lulus |
| Next.js build | Lulus |
| Feed smoke test | Lulus |
| Production branch | Tidak disentuh |
| Production migration | Tidak dijalankan |

## Langkah berikutnya

Fase selanjutnya adalah hardening UI/QA browser dan menampilkan recommendation reason pada kartu feed secara accessible. Fitur koneksi berbasis lokasi/kontak tidak diaktifkan sebelum ada desain consent dan privacy control terpisah.

**Keputusan:** Fase 5 selesai untuk ranking deterministik baseline. Tidak ada machine learning, kontak, atau lokasi implisit.

**Penulis:** Manus AI

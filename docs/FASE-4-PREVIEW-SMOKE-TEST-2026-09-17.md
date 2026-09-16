# Fase 4 — Preview Deployment dan Smoke Test Feed Suki

**Tanggal:** 17 September 2026  
**Branch:** `suki-feed-preview-20260917`  
**Commit utama:** `f51bca8`  
**Retry provisioning:** `2e062be`

## Hasil source verification

Build lokal Next.js berhasil untuk:

- `/api/feed`;
- `/api/comments`;
- `/beranda`.

Contract test Fase 1–2 menghasilkan 8/8 lulus. Root lint, Next.js typecheck, Next.js build, dan `git diff --check` juga lulus.

## Smoke test lokal dengan staging

Build production lokal dijalankan menggunakan environment staging.

| Route | Status |
|---|---:|
| `/beranda` | HTTP 200 |
| `/api/feed?limit=3` | HTTP 200 |
| `/api/comments?postId=<uuid>` | HTTP 200 |

Response feed menghasilkan:

- 2 item feed;
- `contractVersion: suki-feed-v1`;
- `likeCount: 0`;
- `commentCount: 0`;
- `shareCount: 0`;
- `saveCount: null` sesuai privasi;
- `viewer.liked: null` untuk anonymous;
- `viewer.saved: null` untuk anonymous.

## Branch dan deployment

Branch preview sudah didorong ke GitHub:

```text
suki-feed-preview-20260917
```

Pull request dapat dibuat melalui:

https://github.com/saripkdi01-boop/sultrakita-platform/pull/new/suki-feed-preview-20260917

Vercel membuat dua deployment preview, tetapi keduanya gagal sebelum build berjalan:

| Deployment | Commit | Status | Error |
|---|---|---|---|
| `dpl_7GKMrT1tozYPzc6SB3HRHKgEMHRe` | `f51bca8` | ERROR | `BUILD_FAILED — Resource provisioning failed` |
| `dpl_7AKvJT1gcB9DBDfiJEdeBeT926Pa` | `2e062be` | ERROR | `BUILD_FAILED — Resource provisioning failed` |

Vercel tidak menyediakan build log untuk kedua deployment tersebut. Karena build lokal lulus dan error terjadi pada tahap provisioning, blocker saat ini berada pada infra/Vercel, bukan pada TypeScript atau Next.js source.

Inspector deployment:

- https://vercel.com/saripkdi01-boops-projects/sultrakita-platform/7AKvJT1gcB9DBDfiJEdeBeT926Pa
- https://vercel.com/saripkdi01-boops-projects/sultrakita-platform/7GKMrT1tozYPzc6SB3HRHKgEMHRe

## Keputusan release

- Production branch tidak diubah.
- Production deployment tidak dibuat.
- Production migration tidak dijalankan.
- Preview source siap secara lokal.
- Smoke test staging lokal lulus.
- Vercel preview menunggu pemulihan provisioning atau pemeriksaan konfigurasi project oleh pemilik Vercel.

## Langkah berikutnya

1. Periksa Vercel project `sultrakita-platform` pada Inspector deployment.
2. Periksa apakah ada masalah provisioning/account quota/build resource.
3. Setelah deployment preview menjadi READY, jalankan smoke test pada URL Vercel preview.
4. Uji anonymous feed, authenticated feed, pagination, like, save, comment, dan share.
5. Jangan merge ke `main` sebelum preview browser lulus.

**Status Fase 4:** source dan local smoke test lulus; preview Vercel blocked oleh `Resource provisioning failed`.

**Penulis:** Manus AI

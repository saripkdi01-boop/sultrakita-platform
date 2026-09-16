# Fase 4B — Public Preview QA Feed Suki

**Tanggal:** 17 September 2026  
**Runtime:** Next.js production build dari branch `suki-feed-preview-20260917`  
**Database:** Supabase staging

## Public preview sementara

URL sandbox publik:

https://3200-iyhi0wdp9hqz71d66t6d8-4aeec41b.sg2.manus.computer/beranda

URL endpoint:

https://3200-iyhi0wdp9hqz71d66t6d8-4aeec41b.sg2.manus.computer/api/feed?limit=3

## Smoke test

| Endpoint | Hasil |
|---|---:|
| `/beranda` | HTTP 200 |
| `/api/feed?limit=3` | HTTP 200 |

Response feed:

- jumlah item: 2;
- contract: `suki-feed-v1`;
- aggregate like/comment/share tersedia;
- `saveCount: null` sesuai privasi;
- anonymous viewer state bernilai `null`.

## Status Vercel

Deployment Git preview Vercel untuk commit `f51bca8` dan retry `2e062be` sama-sama gagal sebelum build dengan:

```text
BUILD_FAILED: Resource provisioning failed
```

Build lokal lulus, sehingga URL sandbox digunakan sebagai preview QA sementara. Production dan branch `main` tidak disentuh.

## Next step

Setelah provisioning Vercel pulih, ulangi deployment preview dan browser smoke test pada URL Vercel. Jangan merge branch preview ke `main` sebelum preview Vercel atau QA publik pengganti disetujui.

**Status:** Public preview QA lulus; Vercel preview blocked oleh infrastructure provisioning.

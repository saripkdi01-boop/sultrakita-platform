# Laporan Implementasi Fase 1 — Kontrak Data Feed Suki Apps

**Tanggal:** 17 September 2026  
**Status:** Selesai untuk scope kontrak lokal; belum dideploy dan belum mengubah database/production  
**Repository:** `saripkdi01-boop/sultrakita-platform`  
**Branch:** `main`

## 1. Ringkasan

Fase 1 menetapkan kontrak canonical untuk Feed Suki antara route Next.js dan client React. Perubahan dilakukan secara additive pada source code dan test. Tidak ada migration Supabase, perubahan RLS, perubahan package manifest, commit, push, atau deployment production.

Kontrak baru menggunakan versi `suki-feed-v1` dan menyediakan bentuk stabil untuk actor, media, visibility, engagement, viewer state, recommendation, serta cursor pagination.

## 2. Perubahan yang dibuat

### 2.1 Tipe domain bersama

File baru `next-app/lib/feed-contract.ts` mendefinisikan:

- `FeedFilter` dan daftar filter resmi.
- `FeedItemType` untuk post, reel, property, marketplace, group, profile, partner, referral, public chat, dan platform announcement.
- `FeedAuthor`.
- `FeedMedia`.
- `FeedEngagement`.
- `FeedViewerState`.
- `FeedItem`.
- `FeedPageInfo` dan `FeedPage`.
- `FeedCursor`.

Field engagement dan viewer state menggunakan `number | null` atau `boolean | null` ketika sumber data belum tersedia. Ini disengaja agar sistem tidak menampilkan angka contoh atau status interaksi yang tidak terbukti berasal dari server.

### 2.2 Route `/api/feed`

`next-app/app/api/feed/route.ts` sekarang:

1. Memakai filter dan tipe dari kontrak bersama.
2. Menormalisasi row database menjadi `FeedItem` canonical.
3. Mengelompokkan identitas ke dalam `actor`.
4. Mengelompokkan URL media ke dalam `media` dengan jenis image/video.
5. Menormalkan `privacy` menjadi `visibility`.
6. Menyediakan struktur `engagement`, `viewer`, dan `recommendation`.
7. Mengembalikan `contractVersion: 'suki-feed-v1'`.
8. Mempertahankan `rankingVersion: 'baseline-v1'`.
9. Menyimpan sanitasi avatar berdasarkan `visibility_settings.avatar`.
10. Mempertahankan validasi filter, limit 1–30, signed cursor, CSRF boundary yang sudah ada pada mutation, dan response error yang tidak membocorkan detail database.

Aggregate like, komentar, share, dan save yang belum tersedia pada tabel/query tetap dikembalikan sebagai `null`. Route tidak memilih kolom yang belum ada pada schema `posts`, sehingga perubahan kontrak tidak menyebabkan query production langsung gagal.

### 2.3 Cursor pagination

Ordering feed tetap menggunakan:

```text
created_at DESC, id DESC
```

Cursor berikutnya sekarang menggunakan tie-breaker yang sama:

```text
created_at < cursor.createdAt
OR (created_at = cursor.createdAt AND id < cursor.id)
```

Perubahan ini mencegah item terlewati atau terduplikasi ketika beberapa post memiliki timestamp yang sama.

### 2.4 Hook client

`next-app/hooks/useInfiniteFeed.ts` sekarang mengonsumsi `FeedPage` dan memetakan `FeedItem` canonical ke bentuk kompatibilitas `BerandaPostData` yang masih digunakan oleh `FeedPost`.

Hook tidak membuat aggregate palsu. Jika nilai server masih `null`, UI compatibility layer memakai nilai numerik `0` untuk kebutuhan komponen lama. Nilai canonical tetap membedakan “belum tersedia” dari “angka 0”, sehingga implementasi `FeedPost` berikutnya dapat menampilkan keadaan yang lebih jujur setelah Fase 2.

### 2.5 Contract test

File baru `test/fase1-feed-contract.test.js` mencakup empat pemeriksaan:

1. Tipe canonical dan versioning page tersedia.
2. Normalisasi actor, media, visibility, engagement, viewer, dan recommendation tersedia.
3. Cursor menggunakan tie-breaker `created_at` dan `id`.
4. Route tidak memilih aggregate dari kolom `posts` yang belum tersedia dan tidak mengarang data.

## 3. Hasil verifikasi

| Pemeriksaan | Hasil |
|---|---|
| Contract test Fase 1 | **4/4 lulus** |
| Typecheck Next.js (`npx tsc --noEmit`) | **Lulus** |
| Build Next.js | **Lulus** |
| Route `/api/feed` pada build | Terdaftar sebagai dynamic route |
| Route `/beranda` pada build | Terkompilasi; First Load JS sekitar 224 kB |
| `git diff --check` | **Lulus** |
| Lint root | **Lulus** |
| Root test suite | 79 lulus, 4 gagal karena `express` tidak terpasang |

Empat kegagalan root test bukan regresi kontrak feed. Semuanya berhenti saat memuat `server.js` karena dependency legacy `express` tidak tersedia di environment sandbox:

- `scripts/test-whatsapp-webhook.js`
- `test/api.test.js`
- `test/promo-p0-contract.test.js`
- `test/v2-api-contract.test.js`

## 4. File yang berubah

| File | Perubahan |
|---|---|
| `next-app/lib/feed-contract.ts` | Baru; tipe Feed Suki canonical |
| `next-app/app/api/feed/route.ts` | Normalisasi response dan cursor tie-breaker |
| `next-app/hooks/useInfiniteFeed.ts` | Konsumsi kontrak canonical dengan adapter UI |
| `test/fase1-feed-contract.test.js` | Baru; regression test kontrak |

Tidak ada file migration Supabase, `package.json`, `package-lock.json`, atau `vercel.json` yang berubah.

## 5. Batasan yang sengaja belum dikerjakan

Fase 1 tidak mengerjakan hal-hal berikut:

- aggregate query untuk likes/comments;
- tabel dan mutation saves;
- pencatatan shares;
- alur komentar;
- viewer state authenticated dari database;
- ranking recommendation;
- tab UI Rekomendasi/Mengikuti/Terbaru;
- realtime;
- migration atau perubahan RLS;
- deploy ke Vercel atau cutover domain.

Hal-hal tersebut masuk Fase 2 sampai Fase 4 setelah target deployment dan project database sudah diverifikasi.

## 6. Keputusan untuk melanjutkan

Fase 1 dapat dinyatakan selesai pada level source code karena kontrak, normalisasi, cursor, typecheck, build, dan regression test telah lulus.

Namun Fase 1 belum dapat dianggap tervalidasi production karena audit Fase 0 menemukan target production publik masih mengembalikan `404` untuk `/api/feed`. Sebelum deploy, langkah wajib berikutnya adalah verifikasi Root Directory Vercel `next-app` dan route pada deployment Next.js yang benar.

Langkah berikutnya yang disarankan adalah:

> **Audit deployment `/api/feed` terlebih dahulu, lalu lanjutkan Fase 2 untuk sumber kebenaran interaksi.**

## References

[1]: ./FASE-0-AUDIT-BASELINE-FEED-SUKI-2026-09-17.md "Laporan Audit Fase 0 — Baseline Struktur Data Feed Suki Apps"

[2]: ./ROADMAP-BERANDA-FEED-SUKI-2026-09-16.md "Roadmap Implementasi Beranda dan Feed Ekosistem Suki Apps"

[3]: ../next-app/lib/feed-contract.ts "Canonical Feed Suki Contract"

[4]: https://nextjs.org/docs/app "Next.js App Router Documentation"

**Penulis:** Manus AI

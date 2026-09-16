# Laporan Audit Fase 0 — Baseline Struktur Data Feed Suki Apps

**Tanggal audit:** 17 September 2026  
**Ruang lingkup:** audit kode basis, runtime, endpoint feed, migration sosial, environment, dan baseline verification  
**Mode:** read-only; tidak ada perubahan database, RLS, production, atau file aplikasi  
**Repository:** `saripkdi01-boop/sultrakita-platform`  
**Branch:** `main` pada commit `409ce0f`

## 1. Kesimpulan eksekutif

Baseline belum siap untuk langsung masuk ke implementasi kategori feed baru. Fondasi kode Next.js sudah tersedia, tetapi terdapat ketidaksesuaian antara kode yang diharapkan dan jalur production yang terukur.

Status Fase 0 adalah **SELESAI DENGAN BLOCKER P0/P1**:

- **Kode Next.js:** tersedia dan memiliki route `/api/feed` secara deklaratif.
- **Runtime repository:** belum tunggal; `public/`/Express legacy masih ada sebagai compatibility surface.
- **Production endpoint:** audit read-only berhasil untuk `/api/health`, `/api/listings`, dan `/`, tetapi target production yang diuji mengembalikan **404 untuk `/api/feed?limit=8`**.
- **Kontrak feed:** masih berupa kontrak internal yang belum lengkap untuk Suki Feed; response saat ini belum mengembalikan aggregate engagement dan viewer state secara lengkap.
- **Like:** memiliki jalur server-side.
- **Komentar:** belum end-to-end; UI masih menampilkan placeholder.
- **Simpan:** masih bersumber dari `localStorage`, bukan database akun.
- **Bagikan:** belum dicatat sebagai event server-side.
- **Baseline repository:** lint dan build-check root berhasil; 75 dari 79 test lulus. Empat test gagal karena package `express` tidak terpasang di sandbox.
- **Baseline Next.js lokal:** belum dapat dijalankan karena dependency `next-app` belum terinstal. Lockfile dan manifest tersedia, tetapi `next` dan `typescript` belum ada di `node_modules`.

**Keputusan:** jangan menambahkan kategori marketplace, properti, grup, partner, referral, atau pencarian teman ke feed production sebelum deployment root, endpoint production, dan kontrak data dikunci.

## 2. Status repository dan deployment

Working tree pada saat audit hanya memiliki dokumen roadmap yang belum dilacak:

```text
?? docs/ROADMAP-BERANDA-FEED-SUKI-2026-09-16.md
```

Tidak ada perubahan aplikasi, migration, atau konfigurasi production yang dibuat selama audit.

Repository memiliki dua surface utama:

| Surface | Kondisi | Risiko |
|---|---|---|
| `next-app/` | Next.js App Router dengan halaman beranda, route API feed, hook feed, dan komponen kartu | Menjadi target runtime resmi, tetapi belum terbukti sebagai runtime production yang sedang merespons endpoint publik |
| `public/` dan Express root | Runtime legacy dan API lama masih ada | Dapat menyebabkan perbedaan auth, payload, endpoint, dan permission |

`vercel.json` hanya berisi versi konfigurasi umum. Dokumentasi `next-app/README.md` menyatakan Root Directory Vercel seharusnya `next-app`, tetapi audit endpoint publik belum membuktikan bahwa konfigurasi tersebut sudah menjadi deployment aktif untuk semua route feed.

## 3. Pemetaan kode feed saat ini

### 3.1 Halaman dan komponen

Halaman `next-app/app/beranda/page.tsx` saat ini menggunakan:

- `AppLayout` sebagai shell.
- `CreatePostInput` dan `CreatePostModal` untuk pembuatan pembaruan.
- `useInfiniteFeed` untuk pagination berbasis IntersectionObserver.
- `FeedPost` untuk kartu postingan.
- `RightSidebar` untuk rail desktop.
- `EcosystemSlider` untuk promosi ekosistem.
- `setPostLike` untuk mutation like.

Fondasi loading, error, empty state, reload, abort controller, dan infinite scroll sudah tersedia.

### 3.2 Filter yang tersedia

Hook client mendefinisikan filter berikut:

```text
recommended | following | latest | property | video
```

Route server `/api/feed` mendefinisikan filter yang sama. Namun halaman beranda saat ini memanggil `useInfiniteFeed()` tanpa menampilkan kontrol filter yang terlihat pada potongan implementasi yang diaudit. Artinya, sebagian kemampuan kontrak sudah tersedia di server dan hook, tetapi belum sepenuhnya menjadi pengalaman produk yang eksplisit.

### 3.3 Pagination

Route feed sudah menggunakan cursor bertanda tangan HMAC dan membatasi `limit` antara 1 dan 30. Cursor membawa versi, filter, waktu pembuatan, dan ID.

Namun query berikutnya hanya memakai:

```ts
query.lt('created_at', cursor.createdAt)
```

Padahal ordering menggunakan `created_at` lalu `id`. Jika dua postingan memiliki timestamp yang sama, pagination dapat melewati atau mengulang baris. Fase 1 harus menggunakan kondisi lexicographic yang mempertimbangkan pasangan `(created_at, id)`.

## 4. Temuan struktur data feed

### 4.1 Tabel yang sudah ada

Migration sosial utama membuat:

- `posts`
- `likes`
- `comments`

Migration berikutnya menambahkan ke `posts`:

- `privacy`
- `status`
- `idempotency_key`

Kunci unik likes adalah `(post_id, user_id)`, sehingga idempotensi dasar like sudah tersedia.

### 4.2 Field response yang tersedia saat ini

Route feed memilih field utama post dan profil:

```text
id, content, media_urls, type, privacy, location, mood,
tagged_user_ids, created_at, user_id,
profiles(display_name, username, avatar_url, visibility_settings)
```

Response belum mengembalikan kontrak lengkap yang dibutuhkan Suki Feed, yaitu:

- `likeCount`
- `commentCount`
- `shareCount`
- `saveCount`
- `viewer.liked`
- `viewer.saved`
- `followingActor`
- `visibility` yang sudah dinormalisasi
- tipe aktivitas lintas Marketplace, Properti, Grup, Partner, Referral, dan pengumuman
- alasan rekomendasi yang dapat dijelaskan

Hook client memang membaca `likes_count`, `comments_count`, dan `liked`, tetapi route feed yang diaudit belum memilih atau menghitung field tersebut. Akibatnya, pemetaan ke UI berisiko menghasilkan angka nol atau status interaksi yang tidak lengkap.

### 4.3 Belum ada sumber kebenaran untuk seluruh aksi

| Aksi | Kondisi kode saat audit | Status kesiapan |
|---|---|---|
| Like | `POST` dan `DELETE /api/interactions` tersedia; memakai CSRF, auth, dan unique key database | Fondasi tersedia, perlu response canonical dan test race condition |
| Komentar | Halaman beranda hanya menampilkan pesan placeholder | Belum siap |
| Simpan | `FeedPost.tsx` memakai `localStorage['suki-saved-posts']` | Belum siap lintas perangkat |
| Bagikan | Native share atau clipboard/WhatsApp; tidak ada server event | Belum siap sebagai metrik feed |
| Report/hide | Tombol menu terlihat, tetapi jalur aksi tidak terbukti pada audit | Belum siap |

## 5. Temuan RLS dan migration

Migration awal menggunakan policy luas `for all` untuk owner pada likes dan comments, serta membuka SELECT publik dengan `using (true)`. Migration live post kemudian memperketat visibility dan status post, tetapi belum menyelesaikan:

- tabel simpanan feed yang kanonik;
- tabel atau event share;
- aggregate counter yang konsisten;
- viewer state dalam query feed;
- policy terpisah untuk read, insert, update, dan delete;
- aturan akses komentar pada post yang sudah menjadi privat atau follower-only.

Migration staging/production berikutnya harus additive bila memungkinkan, memiliki corrective path, dan diuji pada matrix anonymous, authenticated, owner, outsider, anggota grup, bukan anggota grup, dan admin.

## 6. Hasil baseline verification

### 6.1 Root repository

| Pemeriksaan | Hasil |
|---|---|
| `npm run lint` | Lulus: syntax check dan no-empty-catch rule |
| `npm test` | 75 lulus, 4 gagal dari 79 |
| `npm run build` | Lulus: 31 artifact dan marker aplikasi terverifikasi |

Empat test yang gagal semuanya berhenti karena dependency root `express` tidak tersedia di sandbox:

- `scripts/test-whatsapp-webhook.js`
- `test/api.test.js`
- `test/promo-p0-contract.test.js`
- `test/v2-api-contract.test.js`

Kegagalan ini belum dapat dikategorikan sebagai bug aplikasi feed. Namun ia menunjukkan bahwa environment root belum reproducible tanpa instalasi dependency.

### 6.2 Next.js

Baseline Next.js tidak dapat menyelesaikan typecheck/build karena dependency lokal belum terinstal:

- `npx tsc --noEmit` mencoba meminta instalasi paket bernama `tsc@2.0.4`.
- Prompt instalasi dibatalkan agar tidak menambah dependency yang salah.
- `npm run build` gagal karena binary `next` tidak ditemukan.

Manifest dan lockfile tersedia dan mendeklarasikan `next@^15.5.25` serta `typescript@^5.6.3`. Jadi temuan ini adalah **setup environment blocker**, bukan bukti type error pada source.

### 6.3 Production read-only

Audit production read-only menghasilkan:

| Endpoint | Hasil |
|---|---|
| `/` | HTTP 200 pada seluruh sampel |
| `/api/health` | HTTP 200 pada seluruh sampel |
| `/api/listings?limit=8` | HTTP 200 pada seluruh sampel |
| `/api/feed?limit=8` | HTTP 404 pada seluruh sampel audit |

Header keamanan yang terlihat pada response mencakup HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, dan CSP.

Temuan `/api/feed` adalah blocker paling penting Fase 0. Kode route Next.js ada, tetapi route tersebut belum tersedia pada target production yang diaudit. Kemungkinan yang harus diverifikasi adalah Root Directory Vercel, deployment aktif, domain alias, atau perbedaan antara target legacy dan target Next.js.

## 7. Keputusan kesiapan

### Dapat dilakukan sekarang

Fase 1 dapat dimulai sebagai pekerjaan read-only atau pekerjaan kode lokal yang tidak menyentuh production:

1. menetapkan tipe `FeedItem` dan `FeedPage`;
2. membuat adapter response tunggal;
3. memperbaiki cursor pasangan `created_at + id`;
4. menulis contract test untuk response dan visibility;
5. menyusun matriks route/deployment;
6. menyiapkan fixture staging.

### Belum boleh dilakukan

Hal berikut belum boleh dijalankan ke production:

1. migration tabel saves/shares;
2. perubahan RLS likes/comments;
3. pengaktifan kategori feed baru;
4. realtime global;
5. pencocokan kontak perangkat;
6. rekomendasi berbasis lokasi presisi;
7. migrasi penghapusan runtime legacy.

## 8. Rekomendasi tindakan berikutnya

Urutan tindakan yang paling aman adalah:

### Langkah A — Verifikasi deployment route

Pastikan deployment Vercel aktif menggunakan Root Directory `next-app`, lalu uji route berikut pada URL deployment Next.js dan alias `sukiapps.web.id`:

```text
/beranda
/api/health
/api/feed?filter=recommended&limit=10
/api/feed?filter=latest&limit=10
/api/feed?filter=following&limit=10
```

Tes ini harus dilakukan tanpa mutation. Jika alias utama masih menyajikan runtime lama, jangan melakukan cutover otomatis; dokumentasikan target deployment yang benar terlebih dahulu.

### Langkah B — Siapkan environment lokal secara reproducible

Dari `next-app/`, gunakan lockfile yang sudah tersedia untuk memasang dependency secara deterministik, lalu jalankan:

```bash
npm ci
npx tsc --noEmit
npm run build
```

Root repository juga perlu memasang dependency yang dideklarasikan sebelum mengulang test suite agar empat kegagalan `express` dapat diklasifikasikan ulang.

### Langkah C — Masuk Fase 1

Setelah Langkah A dan B terverifikasi, implementasikan **kontrak Feed Suki** terlebih dahulu. Scope Fase 1 dibatasi pada tipe, adapter, query response, cursor correctness, dan contract test. Tidak ada perubahan UI besar dan tidak ada migration production dalam fase tersebut.

## 9. Status akhir Fase 0

**Status:** Audit selesai; baseline belum siap untuk perluasan feed production.

**Blocker utama:** endpoint `/api/feed` belum tersedia pada target production yang diuji.

**Blocker environment:** dependency root dan `next-app` belum terinstal di sandbox.

**Gap produk/data utama:** response feed belum memiliki aggregate dan viewer state lengkap; komentar, save, dan share belum server-side.

**Perintah lanjutan yang disarankan:** `lanjutkan Fase 1 setelah verifikasi deployment`, atau `audit deployment dulu` jika ingin memprioritaskan penyelesaian 404 `/api/feed` tanpa menyentuh kode aplikasi.

## References

[1]: ../docs/ROADMAP-BERANDA-FEED-SUKI-2026-09-16.md "Roadmap Implementasi Beranda dan Feed Ekosistem Suki Apps"

[2]: ../docs/audit-suki-home-api-2026-09-16.md "Audit Optimasi Beranda dan API Suki Apps"

[3]: ../docs/BERANDA-UX-RESEARCH-BRIEF-2026-09-12.md "Brief Riset dan Audit Beranda SultraKita"

[4]: ../docs/NEXT-RUNTIME-MIGRATION.md "Migrasi Runtime SultraKita ke Next.js"

[5]: ../supabase/migrations/20260913000000_beranda_social_feed.sql "Beranda Social Feed Migration"

[6]: ../supabase/migrations/20260916000000_live_social_posts.sql "Live Social Posts Migration"

[7]: https://nextjs.org/docs/app "Next.js App Router Documentation"

[8]: https://supabase.com/docs/guides/database/postgres/row-level-security "Supabase Row Level Security Documentation"

**Penulis:** Manus AI

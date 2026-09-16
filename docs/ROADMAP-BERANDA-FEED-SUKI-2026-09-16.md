# Roadmap Implementasi Beranda dan Feed Ekosistem Suki Apps

**Tanggal:** 16 September 2026  
**Ruang lingkup:** Beranda/feed publik dan personal Suki Apps  
**Status:** Dokumen eksekusi bertahap; belum mengubah production  
**Basis teknis:** Next.js App Router, React, TypeScript, Supabase, dan Vercel

## 1. Keputusan utama

Beranda Suki Apps tidak perlu ditulis ulang dari awal atau dipindahkan menjadi React SPA client-only. Fondasi yang sudah tersedia adalah React dengan Next.js App Router. Pekerjaan yang paling penting adalah menyatukan bahasa produk, model data, autentikasi, interaksi sosial, dan aturan ranking feed.

Mulai dari dokumen ini, **Next.js + TypeScript menjadi runtime dan bahasa implementasi resmi untuk beranda**. Fitur baru untuk beranda tidak boleh dibuat di runtime Express/HTML legacy. Runtime legacy tetap dipertahankan hanya sebagai compatibility layer sampai seluruh consumer penting dipindahkan dan akses log membuktikan bahwa jalur tersebut dapat dipensiunkan.

Secara produk, beranda akan menjadi **Suki Feed**: aliran pembaruan terkurasi dari ekosistem Suki. Feed dapat memuat aktivitas publik dari Suki Marketplace, properti, grup atau komunitas, Suki Chat yang memang ditandai publik, Suki Partner, referral, dan aktivitas akun yang pengguna ikuti. Feed bukan sekadar katalog fitur. Setiap item harus menjawab tiga hal: **siapa yang melakukan aktivitas, apa yang berubah, dan tindakan apa yang dapat dilakukan pengguna**.

## 2. Bahasa dan tema yang harus dikonsistenkan

### 2.1 Bahasa program

| Area | Standar resmi |
|---|---|
| Frontend | TypeScript dan TSX |
| Framework | Next.js App Router |
| UI | React Server Components untuk pembacaan awal; Client Components hanya untuk interaksi |
| Styling | Tailwind CSS dengan token desain Suki; CSS global hanya untuk kebutuhan lintas komponen |
| Auth dan data | Supabase SSR, Supabase client, Server Actions atau Route Handlers |
| Validasi | Schema validation terpusat, misalnya pada boundary API/server action |
| Deployment | Next.js dengan root deployment `next-app` |
| Kontrak | Tipe TypeScript bersama untuk feed dan mutation |

Istilah “full React” dalam proyek ini berarti seluruh pengalaman antarmuka dibangun dengan React di dalam Next.js. Istilah tersebut tidak berarti semua data dan logika dipindahkan ke browser.

### 2.2 Bahasa produk

Gunakan istilah yang sama di UI, API, dokumentasi, dan database mapping. Hindari campuran istilah “post”, “status”, “update”, dan “konten” untuk objek yang sama.

| Istilah kanonik | Makna |
|---|---|
| **Beranda** | Halaman utama aplikasi |
| **Feed Suki** | Aliran pembaruan yang tampil di beranda |
| **Pembaruan** | Satu item yang tampil di feed |
| **Profil** | Identitas publik pengguna atau organisasi |
| **Grup** | Ruang komunitas dengan anggota dan aturan sendiri |
| **Marketplace** | Area jual-beli produk dan jasa |
| **Properti** | Kategori listing rumah, tanah, sewa, proyek, dan kebutuhan terkait |
| **Mitra** | Pengguna atau organisasi yang terdaftar sebagai Suki Partner |
| **Mengikuti** | Hubungan ketika pengguna mengikuti profil, grup, atau topik |
| **Teman** | Hubungan sosial dua arah setelah permintaan diterima |
| **Simpan** | Bookmark server-side milik akun pengguna |
| **Bagikan** | Intent berbagi yang dicatat setelah pengguna memilih tindakan berbagi |
| **Rekomendasi** | Pemberian feed berdasarkan sinyal yang dapat dijelaskan |

Bahasa visual menggunakan token yang telah muncul pada desain Suki: ink `#12211F`, forest `#0E6258`, teal `#138A7D`, mint `#E7F3EF`, sand `#F8F6F1`, gold `#C78B45`, coral `#E76452`, dan line `#DDE7E3`. Card memakai radius sekitar 20px, kontrol sekitar 12px, dan motion singkat yang menghormati `prefers-reduced-motion`.

## 3. Bentuk produk yang dituju

### 3.1 Struktur halaman

Urutan desktop dan mobile harus mengikuti prioritas yang sama:

1. Header Suki dengan pencarian dan akses navigasi.
2. Identitas atau konteks pengguna bila pengguna sudah login.
3. Shortcut pembuatan pembaruan.
4. Pilihan feed: **Rekomendasi**, **Mengikuti**, dan **Terbaru**.
5. Cerita atau discovery rail yang benar-benar memiliki data.
6. Feed utama satu kolom.
7. Rail sekunder di desktop untuk grup, listing, atau rekomendasi yang relevan.
8. Navigasi bawah atau menu ringkas di mobile.

Pada mobile, rail sekunder tidak boleh dipaksa masuk ke kolom utama. Ia berubah menjadi blok horizontal yang dapat digeser atau ditunda sampai pengguna memilih kategori.

### 3.2 Kategori pembaruan tahap awal

Kategori adalah tipe aktivitas, bukan sekadar menu dekoratif.

| Kategori | Contoh pembaruan publik |
|---|---|
| Marketplace | Produk baru, produk terjual, penawaran toko, ulasan publik |
| Properti | Listing properti baru, perubahan harga, status terverifikasi, proyek baru |
| Grup | Grup baru, diskusi publik, event komunitas, pengumuman admin |
| Profil dan jaringan | Profil yang diikuti aktif, teman baru, saran koneksi |
| Mitra | Kegiatan partner, layanan, promo yang disetujui |
| Referral | Pencapaian referral yang memang diizinkan untuk tampil publik; nominal pribadi tidak ditampilkan |
| Suki Chat | Hanya ruang atau kanal yang secara eksplisit bersifat publik; isi chat pribadi tidak masuk feed |
| Informasi Suki | Pengumuman platform, panduan, dan status layanan |

Tahap pertama tidak perlu memasukkan semua kategori sekaligus. Urutan aman adalah Marketplace, Properti, Grup, Profil/Jaringan, dan Informasi Suki. Suki Chat, Partner, dan Referral masuk setelah aturan privasi dan sumber datanya disepakati.

### 3.3 Format kartu pembaruan

Setiap kartu harus memiliki:

- identitas penerbit atau pemilik aktivitas;
- label kategori;
- waktu penerbitan;
- objek utama, seperti foto, listing, grup, atau teks;
- alasan tampil jika item berasal dari rekomendasi;
- tiga aksi utama yang benar-benar bekerja;
- menu sekunder untuk laporan, sembunyikan, atau tindakan lain;
- status aksesibilitas yang benar untuk tombol, loading, error, dan optimistic rollback.

Feed tidak boleh menampilkan angka like, komentar, atau simpan yang berasal dari nilai contoh. Jika data belum tersedia, gunakan keadaan kosong yang jujur.

## 4. Arsitektur data yang menjadi sumber kebenaran

### 4.1 Kontrak tipe minimal

Buat tipe bersama di area server/client yang menjadi sumber bentuk data feed. Nama file dapat disesuaikan dengan struktur repository, tetapi kontraknya harus setara dengan berikut:

```ts
type FeedItemType =
  | 'marketplace_listing'
  | 'property_listing'
  | 'group_activity'
  | 'profile_activity'
  | 'partner_activity'
  | 'referral_milestone'
  | 'public_chat_activity'
  | 'platform_announcement';

type FeedItem = {
  id: string;
  type: FeedItemType;
  actor: AuthorSummary;
  target?: TargetSummary;
  content: ContentSummary;
  media: MediaSummary[];
  createdAt: string;
  visibility: 'public' | 'followers' | 'group' | 'private';
  engagement: {
    likeCount: number;
    commentCount: number;
    shareCount: number;
    saveCount: number;
  };
  viewer: {
    liked: boolean;
    saved: boolean;
    followingActor: boolean;
  };
  recommendation?: {
    reason: 'following' | 'nearby' | 'group' | 'category' | 'popular' | 'fresh';
  };
};

type FeedPage = {
  items: FeedItem[];
  nextCursor: string | null;
  hasMore: boolean;
};
```

Nama tabel internal dapat berbeda, tetapi response yang dikonsumsi UI harus stabil. Client tidak boleh menghitung ulang aggregate dari row mentah yang berbeda-beda.

### 4.2 Pagination

Gunakan cursor berdasarkan pasangan `created_at` dan `id`. Jangan menggunakan offset untuk feed utama. Cursor harus tetap stabil ketika pembaruan baru masuk selama pengguna sedang membaca.

### 4.3 Mutation sosial

Satu kontrak typed dapat menangani `like`, `save`, dan `share`. Komentar tetap memiliki endpoint create/list/delete yang terpisah karena memiliki isi, validasi panjang, pagination, dan aturan moderasi.

Semua mutation harus:

- memvalidasi sesi di server;
- memvalidasi input dan visibilitas objek;
- memiliki idempotensi;
- mengembalikan state canonical dari server;
- mengembalikan error yang dapat dibedakan antara login diperlukan, permission ditolak, validasi gagal, dan jaringan bermasalah;
- menggunakan optimistic UI hanya dengan rollback yang jelas.

`localStorage` boleh digunakan untuk cache sementara, tetapi tidak boleh menjadi sumber kebenaran like, save, comment, share, teman, atau follow.

## 5. Urutan eksekusi per fase

## Fase 0 — Kunci ruang lingkup dan baseline

**Tujuan:** memastikan pekerjaan berikutnya tidak bercabang ke dua runtime atau mengubah production tanpa bukti.

**Langkah kerja:**

1. Tandai Next.js di `next-app/` sebagai jalur pengembangan resmi beranda.
2. Inventarisasi route beranda yang masih mengarah ke `public/`, Express, atau API lama.
3. Catat endpoint yang benar-benar dipakai halaman beranda saat ini.
4. Catat project ref Supabase, migration history remote, deployment root, dan environment preview/production.
5. Buat fixture staging untuk anonymous, authenticated, owner, outsider, dan admin.
6. Simpan baseline build, lint, typecheck, browser smoke, ukuran First Load JS, serta tidak adanya horizontal overflow.

**Hasil yang harus tersedia:** satu matriks dependency beranda dan satu daftar route yang boleh atau tidak boleh disentuh.

**Selesai jika:** tim dapat menjawab data beranda berasal dari endpoint mana, database mana yang dituju, dan deployment mana yang menyajikannya.

**Checkpoint pengguna:** `lanjutkan` untuk masuk ke kontrak data. Jika root deployment, database, atau endpoint tidak sesuai, jawab `revisi Fase 0`.

## Fase 1 — Tetapkan kontrak Feed Suki

**Tujuan:** menyamakan bentuk data antara database, server, dan UI sebelum menambah kategori.

**Langkah kerja:**

1. Buat tipe `FeedItem`, `FeedPage`, `AuthorSummary`, `MediaSummary`, dan `EngagementSummary`.
2. Ubah hook feed agar tidak lagi mengisi `likes` dan `comments` dengan nol secara default ketika data tersedia di server.
3. Tetapkan response cursor pagination dengan `nextCursor` dan `hasMore`.
4. Pisahkan field yang publik dari field yang hanya boleh tampil kepada pemilik atau anggota grup.
5. Tetapkan mapping dari sumber aktivitas marketplace, properti, grup, profil, partner, dan pengumuman ke `FeedItemType`.
6. Tambahkan contract test untuk response normal, response kosong, cursor invalid, dan item yang sudah tidak dapat diakses.

**Hasil yang harus tersedia:** satu response feed yang dapat dipakai semua kartu tanpa mapping khusus per komponen.

**Selesai jika:** reload, pagination, anonymous read, dan authenticated read mengembalikan bentuk data yang konsisten.

**Checkpoint pengguna:** `lanjutkan` untuk migration additive dan interaksi sosial. Jika desain field perlu berubah, jawab `revisi kontrak`.

## Fase 2 — Selesaikan sumber kebenaran interaksi

**Tujuan:** membuat aksi yang terlihat di kartu benar-benar bekerja lintas reload dan perangkat.

**Langkah kerja:**

1. Audit tabel dan policy untuk likes, comments, saves, dan shares.
2. Tambahkan tabel `saved_posts` atau padanan kanonik bila belum tersedia.
3. Tambahkan event share yang membedakan intent membuka share sheet dari share yang berhasil dipilih pengguna.
4. Perketat policy RLS menjadi operasi yang terukur. Hindari policy `for all` jika operasi yang diperlukan hanya insert/delete milik user.
5. Tambahkan validasi komentar, batas panjang, normalisasi whitespace, cursor pagination, dan delete oleh pemilik.
6. Kembalikan state canonical setelah mutation.
7. Ganti state bookmark lokal pada `FeedPost` dengan state dari server.

**Hasil yang harus tersedia:** like, save, comment, dan share memiliki jalur server-side yang dapat diuji.

**Selesai jika:** double tap, retry, refresh, dua tab, dan perpindahan perangkat tidak membuat duplikasi atau counter palsu.

**Batas penting:** migration production dan perubahan RLS memerlukan target database yang benar, fixture staging, rencana rollback, dan otorisasi pemilik. Sampai hal itu tersedia, implementasi dibatasi pada migration staging dan test.

**Checkpoint pengguna:** `lanjutkan ke UI` setelah test RLS staging lulus. Jika ada policy atau tabel yang berbeda dari asumsi, jawab `revisi Fase 2`.

## Fase 3 — Bangun shell feed dan kartu yang seragam

**Tujuan:** menampilkan semua tipe pembaruan dalam bahasa visual Suki yang satu.

**Langkah kerja:**

1. Pertahankan `AppLayout` dan komponen interaktif yang sudah ada.
2. Bentuk satu `FeedCard` dengan renderer kecil per tipe, bukan enam kartu yang memiliki kontrak berbeda.
3. Pertahankan `FeedPost` hanya jika ia sudah dapat menerima kontrak baru tanpa menyimpan sumber kebenaran sendiri.
4. Buat segmented control untuk Rekomendasi, Mengikuti, dan Terbaru.
5. Jadikan rail desktop sekunder; pada mobile ubah menjadi stack atau horizontal scroller terisolasi.
6. Terapkan token warna, radius, spacing, typography, focus ring, dan reduced motion dari desain Suki.
7. Pastikan media memiliki rasio stabil, poster video, lazy loading, caption, dan fallback.
8. Sediakan skeleton yang mempertahankan tinggi layout serta empty, error, retry, dan unavailable state.

**Selesai jika:** semua tipe pembaruan memiliki hirarki visual yang sama, tidak ada overflow pada 320px, dan setiap aksi memiliki accessible name.

**Checkpoint pengguna:** `lanjutkan QA` untuk pengujian browser. Jika struktur visual tidak sesuai arah produk, jawab `revisi UI` dengan bagian yang perlu diubah.

## Fase 4 — Tambahkan ranking deterministik dan discovery

**Tujuan:** membuat feed terasa relevan tanpa langsung memasukkan machine learning yang sulit diaudit.

Mulai dengan aturan yang sederhana dan dapat dijelaskan:

1. Konten dari entitas yang diikuti mendapat prioritas.
2. Konten baru mendapat bobot freshness.
3. Konten di sekitar lokasi pengguna hanya dipakai jika pengguna memberi izin lokasi.
4. Konten dari grup yang diikuti mendapat prioritas.
5. Konten populer boleh masuk dengan label “Populer”, bukan disamarkan sebagai konten yang diikuti.
6. Batasi pengulangan actor, kategori, dan objek agar feed tidak monoton.
7. Terapkan filter keamanan, visibilitas, blokir, mute, dan status moderasi sebelum ranking.
8. Tampilkan alasan sederhana pada item rekomendasi, seperti “Dari grup yang kamu ikuti” atau “Populer di area pilihanmu”.

Jangan mengaktifkan pengumpulan kontak atau pencarian teman berdasarkan nomor telepon pada fase ini. Fitur tersebut membutuhkan persetujuan terpisah, tujuan yang jelas, hashing atau matching yang aman, retensi terbatas, dan pengaturan opt-out.

**Selesai jika:** pengguna dapat memilih feed Terbaru, memahami alasan rekomendasi, dan konten privat tidak bocor melalui ranking.

**Checkpoint pengguna:** `lanjutkan koneksi` untuk fitur teman/lokasi atau `tunda koneksi` jika feed publik masih perlu distabilkan.

## Fase 5 — Koneksi teman berdasarkan lokasi dan kontak

**Tujuan:** menambah discovery sosial secara aman, bukan sekadar menyalin fitur Facebook.

### Lokasi

1. Mulai dengan lokasi yang pengguna isi atau pilih sendiri, bukan lokasi presisi yang diambil diam-diam.
2. Gunakan area kasar, seperti kota atau distrik, untuk rekomendasi awal.
3. Minta izin browser hanya ketika pengguna memilih “Temukan orang di sekitar saya”.
4. Jangan menyimpan koordinat presisi untuk kebutuhan feed jika area kasar sudah cukup.
5. Sediakan kontrol nonaktifkan rekomendasi berbasis lokasi dan jelaskan penggunaan data.

### Kontak perangkat

1. Fitur hanya berjalan setelah tindakan eksplisit pengguna.
2. Jelaskan bahwa kontak dipakai untuk menemukan akun yang cocok, bukan untuk mengirim undangan otomatis.
3. Jangan mengunggah daftar kontak mentah jika pencocokan ter-hash atau pemrosesan lokal dapat digunakan.
4. Batasi retensi dan hapus data pencocokan ketika proses selesai.
5. Sediakan penghapusan dan opt-out.
6. Jangan menampilkan bahwa seseorang ditemukan melalui nomor telepon tanpa desain privasi yang jelas.

### Hubungan sosial

Gunakan status yang berbeda untuk `mengikuti`, `permintaan teman`, `teman`, `diblokir`, dan `dibisukan`. Jangan menyamakan follow dengan friendship karena aturan visibilitasnya berbeda.

**Selesai jika:** semua akses lokasi dan kontak bersifat opt-in, dapat dicabut, dapat diaudit, dan tidak mengubah feed pengguna yang belum memberi izin.

## Fase 6 — Realtime secara selektif

Realtime bukan prasyarat untuk versi pertama. Setelah kontrak, RLS, dan mutation stabil:

1. Mulai dari invalidasi atau refresh ringan setelah mutation milik pengguna sendiri.
2. Tambahkan subscription yang difilter pada objek yang benar-benar membutuhkan perubahan langsung.
3. Kirim payload minimum.
4. Bersihkan subscription saat unmount.
5. Deduplicate event agar counter tidak naik dua kali.
6. Sediakan fallback reload ketika channel gagal.

Feed global tidak boleh langsung dijadikan satu subscription tanpa filter.

## 6. Matriks pengujian sebelum rilis

| Area | Skenario minimum |
|---|---|
| Data | Feed berisi banyak kategori, feed kosong, item dihapus, item menjadi privat |
| Auth | Anonymous, authenticated, session expired, logout lalu reload |
| RLS | Owner, outsider, admin, anggota grup, bukan anggota grup |
| Mutation | Like, unlike, save, unsave, comment, delete comment, share, retry |
| Idempotensi | Double tap, dua tab, refresh saat mutation, request terkirim ulang |
| Pagination | Cursor valid, cursor invalid, item baru masuk saat scroll, duplicate prevention |
| Responsive | 320, 375, 768, 1024, dan desktop wide |
| Accessibility | Keyboard focus, screen reader name, target size, zoom 200–400%, reduced motion |
| Resilience | Offline mutation, timeout, 403, 422, 500, retry |
| Media | Lazy image, video poster, caption, aspect ratio, layout shift |
| Privacy | Lokasi tanpa izin, kontak tanpa izin, blocked user, private group, private chat |
| Performance | LCP, INP, CLS, payload feed, query aggregate, First Load JS |

## 7. Urutan commit yang disarankan

Agar setiap langkah mudah direview dan dapat dihentikan tanpa merusak langkah lain, gunakan commit terpisah:

1. `docs: define Suki feed product and data contract`
2. `refactor: centralize feed types and cursor response`
3. `feat: persist feed saves and shares`
4. `feat: complete comments server flow`
5. `refactor: unify feed card renderers`
6. `feat: add feed tabs and deterministic recommendation labels`
7. `test: add feed RLS and browser regression matrix`
8. `feat: add opt-in location discovery`
9. `feat: add privacy-safe contact discovery`
10. `feat: add filtered feed realtime updates`

Setiap commit harus melewati typecheck, lint, build, dan test yang relevan. Migration database tidak boleh digabungkan secara diam-diam ke perubahan visual.

## 8. Definisi selesai untuk versi pertama

Versi pertama **Suki Feed** dianggap siap untuk rilis terbatas jika:

1. Beranda berjalan pada Next.js sebagai runtime resmi.
2. Marketplace, Properti, Grup, Profil/Jaringan, dan Informasi Suki dapat tampil melalui kontrak `FeedItem` yang sama.
3. Feed memiliki tab Rekomendasi, Mengikuti, dan Terbaru dengan label yang jelas.
4. Like, save, comment, dan share memiliki sumber kebenaran server.
5. Cursor pagination tidak menggandakan item.
6. RLS lulus untuk anonymous, authenticated, owner, outsider, anggota grup, dan admin.
7. Tidak ada placeholder angka engagement di production.
8. Tidak ada horizontal overflow pada viewport yang ditentukan.
9. Loading, empty, error, retry, offline, dan session-expired state tersedia.
10. Konten privat, chat pribadi, data kontak, dan lokasi presisi tidak masuk feed publik.
11. Browser smoke, E2E inti, typecheck, lint, build, dan migration staging lulus.
12. Deployment production telah diverifikasi pada route beranda dan rollback plan tersedia.

## 9. Instruksi penggunaan roadmap ini

Eksekusi sebaiknya dilakukan satu fase per satu fase. Pada akhir setiap fase, hasilnya harus berupa perubahan yang dapat diuji, bukan hanya desain atau janji implementasi. Pengguna dapat memberikan salah satu perintah berikut:

- **“Lanjutkan”** — jalankan fase berikutnya.
- **“Lanjutkan Fase X”** — lompat ke fase tertentu setelah memastikan dependensinya sudah tersedia.
- **“Revisi Fase X”** — ubah ruang lingkup fase tersebut sebelum coding.
- **“Audit dulu”** — lakukan pemeriksaan read-only tanpa mengubah database atau production.
- **“Jangan deploy”** — izinkan perubahan lokal/staging saja.
- **“Batalkan perubahan terakhir”** — gunakan rollback atau revert pada commit yang sudah dibuat.

Rekomendasi awal adalah mulai dari **Fase 0**, kemudian **Fase 1**, karena keduanya memiliki risiko paling rendah dan menjadi prasyarat bagi perubahan UI maupun penambahan kategori.

## References

[1]: https://nextjs.org/docs/app "Next.js App Router Documentation"

[2]: https://supabase.com/docs/guides/database/postgres/row-level-security "Supabase Row Level Security Documentation"

[3]: https://supabase.com/docs/guides/realtime/postgres-changes "Supabase Realtime Postgres Changes Documentation"

[4]: https://www.w3.org/TR/WCAG22/ "Web Content Accessibility Guidelines 2.2"

[5]: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design "MDN Responsive Web Design"

[6]: https://transparency.meta.com/features/ranking-and-content/ "Meta Approach to Feed Ranking"

[7]: https://github.com/saripkdi01-boop/sultrakita-platform "SultraKita Platform Repository"

[8]: ./audit-suki-home-api-2026-09-16.md "Audit Optimasi Beranda dan API Suki Apps"

[9]: ./BERANDA-UX-RESEARCH-BRIEF-2026-09-12.md "Brief Riset dan Audit Beranda SultraKita"

[10]: ./NEXT-RUNTIME-MIGRATION.md "Migrasi Runtime SultraKita ke Next.js"

[11]: ./SUKI-DESIGN-SYSTEM-RESEARCH.md "SUKI Suits Design System Research"

**Penulis:** Manus AI

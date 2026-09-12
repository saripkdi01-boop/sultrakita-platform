# Brief Riset dan Audit Beranda SultraKita

**Tanggal:** 12 September 2026
**Status:** Riset selesai; implementasi dan migrasi production belum dijalankan
**Target:** Beranda compact, responsif, tidak overflow, dan konsisten untuk aksi suka, komentar, simpan, serta bagikan.

## Kesimpulan eksekutif

Beranda SultraKita sudah memiliki arah visual yang menyerupai feed sosial modern, tetapi belum memiliki satu kontrak produk yang utuh antara UI, endpoint, data feed, dan database. Gap paling besar bukan sekadar spacing. UI saat ini menampilkan empat aksi sosial, tetapi implementasi backend yang ditemukan baru memproses **like**. Komentar masih memberi pesan placeholder, simpan hanya mengubah state React lokal, dan bagikan hanya memanggil Web Share atau tautan WhatsApp tanpa pencatatan event. Hook feed juga memetakan `likes` dan `comments` menjadi nol, sehingga tampilan tidak merefleksikan data production.

Rekomendasi utama adalah melakukan hardening bertahap, bukan rewrite visual tanpa fondasi data. Tahap pertama harus menyatukan model feed dan kontrak interaksi. Tahap kedua memperbaiki kepadatan layout serta responsive behavior. Tahap ketiga menambahkan realtime yang terfilter dan pengujian RLS berbasis role. Migrasi production **belum boleh dijalankan** sebelum project ref Supabase, status migration remote, dan approval perubahan RLS/database dikonfirmasi.

## Referensi dan pola yang layak diserap

| Referensi | Temuan yang relevan | Adaptasi untuk SultraKita | Yang tidak disalin |
|---|---|---|---|
| Facebook Feed | Feed mencampur connected content dan recommended content. Meta menjelaskan tahapan inventory, signals, predictions, ranking, serta kontrol seperti Favorites, Interested/Not Interested, dan reverse-chronological Feeds. [1] | Pertahankan tab **Rekomendasi**, **Mengikuti**, dan **Terbaru** dengan label yang jelas. Tampilkan alasan sederhana atau filter aktif agar ranking tidak terasa misterius. | Jangan langsung meniru ranking ML kompleks. SultraKita perlu mulai dari aturan deterministik, freshness, interaksi, dan diversity sederhana yang dapat diaudit. |
| Pola feed visual sosial | Feed modern menempatkan identitas penulis, waktu, isi, media, metrik, dan aksi dalam satu alur vertikal dengan progressive disclosure. | Pertahankan satu kolom utama dengan card compact. Tampilkan tiga aksi utama secara langsung dan pindahkan aksi sekunder ke menu pada layar sempit bila diperlukan. | Jangan menambah carousel, animasi, badge, atau rail yang tidak meningkatkan keputusan pengguna. |
| WCAG 2.2 | WCAG 2.2 menambahkan Target Size Minimum dan Focus Not Obscured. Reflow mensyaratkan konten tidak kehilangan informasi atau fungsi saat viewport menyempit. [2] | Semua aksi tetap mudah disentuh, fokus keyboard terlihat, card tidak menyebabkan horizontal scroll, dan layout diuji pada lebar sekitar 320 CSS px serta zoom tinggi. | Jangan mengejar compactness dengan tombol ikon berukuran terlalu kecil atau teks yang terpotong tanpa akses alternatif. |
| MDN Responsive Design | Layout responsif sebaiknya menggunakan grid/flex yang fleksibel, media dengan `max-width: 100%`, mobile-first breakpoints, dan tidak mengandalkan fixed width. [3] | Gunakan `minmax(0, 1fr)`, `min-width: 0`, `overflow-wrap:anywhere`, media rasio terkontrol, dan perubahan rail menjadi stack pada breakpoint. | Jangan menambah breakpoint untuk setiap perangkat atau memakai fixed width yang menimbulkan overflow. |
| Supabase RLS | RLS adalah aturan otorisasi pada level database. Grants dan policies sama-sama perlu dikendalikan; policy saja tidak otomatis mencabut grants. [4] | Pisahkan policy SELECT publik dari INSERT/DELETE milik user. Uji anonymous, authenticated, owner, outsider, dan admin secara eksplisit. | Jangan memakai `for all` sebagai jalan pintas untuk tabel engagement tanpa menilai operasi yang sebenarnya dibutuhkan. |
| Supabase Realtime | Postgres Changes mengotorisasi event untuk setiap subscriber. Filter dan kolom selektif diperlukan. Broadcast lebih cocok jika subscriber pada satu perubahan melebihi sekitar 3.000. [5] | Mulai dengan subscription yang difilter per post/feed dan payload minimum. Sediakan fallback invalidate/reload. | Jangan menyalakan realtime global tanpa filter pada semua perubahan likes/comments. |

## Audit kondisi repository

Repository `saripkdi01-boop/sultrakita-platform` berada pada branch `main` dan HEAD yang diaudit adalah `d45c894`. Terdapat dua surface utama: legacy `public/` dan aplikasi Next.js di `next-app/`. Dokumentasi repository menyatakan halaman Next.js adalah production app dengan route `/beranda`, tetapi deployment root dan jalur legacy tetap perlu diverifikasi sebelum perubahan lintas surface.

### Temuan UI dan data

| Area | Bukti audit | Dampak |
|---|---|---|
| Feed mapping | `next-app/hooks/useInfiniteFeed.ts` memetakan `likes: 0` dan `comments: 0` untuk setiap post. | Metrik selalu salah dan state awal `liked` tidak sinkron dari server. |
| Like | `next-app/app/api/interactions/route.ts` hanya mendukung `POST action=like` dan `DELETE`. | Like memiliki fondasi endpoint, tetapi belum menjadi kontrak umum untuk semua aksi. |
| Komentar | `next-app/app/beranda/page.tsx` meneruskan `onComment` yang hanya menampilkan pesan bahwa kolom komentar akan tersedia setelah login. | Tidak ada alur komentar end-to-end. |
| Simpan | `FeedPost.tsx` memakai `useState(false)` untuk bookmark. | Status hilang saat reload/device berganti dan tidak tersimpan ke database. |
| Bagikan | `FeedPost.tsx` memanggil `navigator.share` atau tautan WhatsApp. | Tidak ada share record, deduplikasi, analytics, atau fallback URL canonical yang konsisten. |
| Compactness | Beranda memakai toolbar filter, stories, composer, feed card, dan right sidebar; CSS memiliki layout tiga kolom pada desktop. | Risiko vertical overhead dan overflow pada viewport sempit bila semua elemen dipertahankan tanpa prioritas. |
| Media | Feed memakai gambar lazy dan video autoplay berbasis IntersectionObserver. | Perlu uji bandwidth, poster video, caption, reduced motion, dan layout shift. |
| Loading/error | Sudah ada loading, error, empty, infinite sentinel, dan abort controller. | Fondasi baik, tetapi perlu skeleton yang menjaga tinggi layout dan retry per aksi. |

### Temuan database dan authorization

Migration `supabase/migrations/20260913000000_beranda_social_feed.sql` membuat `posts`, `likes`, dan `comments`. Tabel likes memiliki primary key `(post_id, user_id)`, sehingga idempotensi dasar untuk like sudah tersedia. Index dasar untuk feed, likes per post, dan comments per post juga tersedia.

Namun migration awal memberi policy `for all` kepada pemilik pada likes dan comments. Model ini terlalu lebar untuk fitur sosial yang membutuhkan operasi terukur. Selain itu, migration tersebut membuka SELECT publik dengan `using (true)` pada likes dan comments, sehingga perlu dipastikan bahwa jumlah dan isi komentar memang dimaksudkan publik. Migration `20260916000000_live_social_posts.sql` kemudian memperketat status/privacy post, tetapi belum menyelesaikan tabel saves, shares, aggregate counters, atau kontrak feed yang mengembalikan status user saat ini.

> Prinsip yang harus dipertahankan: perubahan production harus berupa migration terlacak, additive bila memungkinkan, diuji dua kali di staging, dan tidak diterapkan ke production sebelum project ref serta hasil audit migration remote jelas.

## Kontrak produk yang direkomendasikan

Endpoint feed sebaiknya mengembalikan data presentasional yang sudah siap dipakai UI, bukan membuat client menghitung dari nol. Minimal setiap item membutuhkan `id`, author summary, content/media, `createdAt`, `likeCount`, `commentCount`, `shareCount`, `saveCount`, `viewer.liked`, `viewer.saved`, serta `pageInfo` cursor.

Endpoint interaksi sebaiknya memakai satu kontrak typed dengan `action` bernilai `like`, `save`, atau `share`, sedangkan komentar memiliki endpoint create/list/delete yang terpisah. Like dan save harus idempotent melalui unique key `(post_id, user_id)`. Share perlu membedakan share intent yang berhasil dicatat dari sekadar membuka native share sheet. Semua mutation perlu mengembalikan state canonical dari server agar optimistic UI dapat dikoreksi ketika terjadi race atau kegagalan.

Komentar harus memiliki batas panjang, normalisasi whitespace, pagination cursor, dan policy delete/update untuk pemilik. Isi komentar tidak boleh dimasukkan ke log telemetry. Penghitungan counter sebaiknya dilakukan melalui query aggregate terkontrol atau materialized counter yang memiliki strategi konsistensi; counter optimistik di client tidak boleh menjadi sumber kebenaran.

## Arah UI compact yang direkomendasikan

Beranda sebaiknya menggunakan struktur satu kolom utama dengan rail desktop yang benar-benar sekunder. Pada mobile, stories dapat menjadi horizontal scroller yang memiliki `overflow-x: auto` hanya pada container-nya, sementara body tetap bebas dari horizontal overflow. Filter feed harus menjadi segmented control yang dapat digeser atau menu ringkas, bukan deretan tombol yang memaksa lebar viewport.

Feed card perlu memakai spacing vertikal yang konsisten, header satu baris dengan nama terpotong aman, metadata sekunder yang dapat disembunyikan, content line clamp yang memiliki kontrol “Lihat selengkapnya”, media dengan rasio stabil, dan action bar yang tidak melampaui lebar. Aksi utama tetap memiliki label atau accessible name yang jelas. Tombol visual boleh ringkas, tetapi hit area harus memenuhi target aksesibilitas.

Desktop dapat menggunakan grid `minmax(0, 1fr)` dengan batas lebar feed agar baris teks tetap mudah dibaca. Tablet mengurangi rail. Mobile menghapus right sidebar, mengecilkan padding, dan memindahkan action sekunder ke overflow menu. Tidak boleh ada `100vw` di dalam container berpadded, fixed-width card, atau child flex yang tidak memiliki `min-width: 0`.

## Acceptance criteria sebelum implementasi dianggap selesai

| Dimensi | Kriteria verifikasi |
|---|---|
| Data | Setelah reload, like/save/comment/share count dan status viewer sama pada desktop dan mobile. |
| Idempotensi | Double tap, retry, refresh, dan dua tab tidak membuat duplicate like/save/comment atau counter ganda. |
| Authorization | Anonymous dapat membaca data yang memang publik; hanya user yang tepat dapat membuat/menghapus interaksi; outsider tidak dapat memodifikasi row orang lain. |
| Responsive | Tidak ada horizontal overflow pada 320, 375, 768, 1024, dan desktop wide; test zoom 200–400% untuk route penting. |
| Accessibility | Keyboard focus terlihat, target interaksi memadai, aria-pressed/status benar, loading/error diumumkan tanpa spam, reduced motion dihormati. |
| Resilience | Offline/error mutation rollback ke state sebelumnya dan memberi retry; pagination tidak menduplikasi item. |
| Performance | Media tidak menyebabkan layout shift besar; feed memakai cursor pagination dan query payload selektif. |
| Realtime | Subscription dibersihkan saat unmount, event terfilter, event duplicate tidak menggandakan state, dan reload fallback tersedia. |

## Rencana eksekusi yang aman

Tahap pertama adalah audit production target dan migration drift. Verifikasi root deployment, project ref Supabase, migration history remote, grants, policies, indexes, publication membership, serta fixtures staging. Tahap ini tidak mengubah production.

Tahap kedua adalah data contract dan migration additive. Tambahkan tabel saves dan shares, policy operasi terpisah, index yang sesuai, serta query feed yang mengembalikan aggregate dan viewer state. Tambahkan komentar API dengan validasi dan pagination. Migration harus memiliki rollback atau corrective path yang jelas.

Tahap ketiga adalah implementasi UI compact. Hubungkan semua aksi ke mutation typed, gunakan optimistic update dengan rollback, dan pertahankan loading/empty/error/unavailable states. Refactor komponen FeedPost agar status berasal dari server dan tidak tersimpan hanya di state lokal.

Tahap keempat adalah QA browser dan authorization. Uji anonymous dan authenticated journey pada Chromium mobile/desktop, keyboard, zoom, reduced motion, slow network, duplicate actions, expired session, serta RLS matrix. Jangan menjalankan mutation test terhadap production tanpa approval eksplisit.

Tahap kelima adalah release loop. Setelah test, typecheck, lint, build, browser smoke, dan migration staging berhasil, perubahan dapat di-commit ke `main`, push, deploy melalui jalur yang sudah terhubung, lalu diverifikasi pada `/beranda`. Migration production tetap menjadi langkah terpisah yang membutuhkan otorisasi dan maintenance/rollback plan.

## Keputusan yang diperlukan sebelum eksekusi

Tidak diperlukan keputusan visual tambahan untuk mulai membuat prototype karena arah compact responsive sudah cukup jelas. Namun sebelum migrasi production diperlukan konfirmasi bahwa target database yang diaudit memang project production SultraKita dan bahwa owner mengizinkan perubahan schema/RLS untuk likes, comments, saves, dan shares. Tanpa dua hal tersebut, pekerjaan aman hanya sampai staging migration dan implementasi yang belum dipush/deploy.

## Referensi

[1]: https://transparency.meta.com/features/ranking-and-content/ "Our Approach to Facebook Feed Ranking"
[2]: https://www.w3.org/TR/WCAG22/ "Web Content Accessibility Guidelines (WCAG) 2.2"
[3]: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design "Responsive web design - MDN Web Docs"
[4]: https://supabase.com/docs/guides/database/postgres/row-level-security "Row Level Security - Supabase Docs"
[5]: https://supabase.com/docs/guides/realtime/postgres-changes "Postgres Changes - Supabase Docs"
[6]: https://www.facebook.com/help/163779957017799 "Share a post you see in your Feed - Facebook Help Center"
[7]: https://www.facebook.com/help/737806312958641 "Save something you see on Feed - Facebook Help Center"

**Penulis:** Manus AI

**Catatan status:** Dokumen ini adalah hasil riset dan audit kode. Tidak ada file aplikasi, migration production, commit, push, atau deployment yang diubah dalam tahap ini.

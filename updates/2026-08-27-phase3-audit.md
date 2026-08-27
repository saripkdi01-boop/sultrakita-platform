# SultraKita Phase 3 — Feature Matrix

## Fondasi existing yang dapat dipakai ulang

| Permintaan Phase 3 | Fondasi existing | Strategi |
|---|---|---|
| Category browsing, price filters, sort, infinite load | `/api/listings` sudah mendukung category, q, district, min_price, max_price, page, limit, sort | Tambah kontrol UI dan query parameter tanpa mengubah kontrak. |
| Favorites | `favorites` table serta POST/DELETE API sudah tersedia; UI existing menyimpan lokal | Pertahankan local-first UX, tambahkan heart animation dan history/recent local storage. |
| Share WhatsApp/Facebook/copy | `marketplace-bridge.js` sudah memiliki WhatsApp URL, FB text, canonical URL | Tambah action sheet yang memakai helper existing. |
| Reports | `/api/reports` sudah tersedia dan terproteksi autentikasi | Tambah dialog alasan laporan di detail listing. |
| Comments | GET/POST comments existing | Tambah thread komentar pada detail listing, dengan auth-aware composer. |
| Seller rating/verification | `users.rating_average`, `rating_count`, `verification_status`, `seller_verifications` sudah ada | Perluas query list/detail agar rating dan level trust dapat ditampilkan jika tersedia. |
| Chat/quick message/offers | `/api/conversations`, `/api/offers`, WhatsApp bridge sudah ada | Tambah CTA inquiry/quick message pada detail. |
| Delivery | Shipping quote sudah memiliki GoSend estimate | Tambah label local delivery estimate sebagai trust cue, tanpa mengklaim booking provider. |
| Donation/job board/external cards | Existing donation, external jobs, external cards routes dan UI | Pakai kembali sebagai differentiator SultraKita. |

## Fitur yang belum memiliki fondasi backend runtime

Seller public profile, seller stories 24 jam, reactions/likes, RFQ, bulk inquiry/MOQ, compare persistence, bump/promote, property 360 media, community RT/RW endorsements, dan provider Gojek/Grab booking belum memiliki tabel/route pada runtime `database/postgres-schema.sql`. Implementasi Phase 3 akan dimulai dari UI progressive enhancement dan endpoint read-only/additive yang tidak mengubah schema inti; aksi yang membutuhkan auth/provider resmi akan diberi state yang jelas, bukan simulasi transaksi.

## Prinsip implementasi

Perubahan harus additive pada homepage/detail experience. Tidak ada perubahan pada kolom existing atau penggantian route. Fitur local-first yang tidak memerlukan akun (search history, recently viewed, compare, reactions) disimpan terbatas di browser. Fitur yang menulis data memakai endpoint existing dan tetap menghormati autentikasi serta policy consent.


## QA awal UI

Homepage lokal menampilkan kontrol RFQ, mode feed, radius, rentang harga, dan compare tray. Browser berhasil mengaktifkan `listing-feed-mode` dan mengubah radius menjadi 25 km sehingga URL menjadi `?radius=25`. Tidak ditemukan teks error fatal pada halaman. Database lokal sandbox tidak dikonfigurasi (`DATABASE_URL` tidak tersedia), sehingga endpoint data tetap menggunakan empty-state/fallback.


RFQ berhasil dibuka dari tombol `Butuh barang?` pada discovery dan menampilkan form kebutuhan, detail, wilayah, budget, serta aksi simpan. Screenshot QA terbaru tersimpan di `/home/ubuntu/screenshots/localhost_2026-08-27_15-57-11_2220.webp`.


## Implementasi Phase 3

Fitur aktif pada release ini meliputi:

- filter radius 5/10/25/50 km sebagai discovery state yang tersimpan di URL/localStorage;
- min/max price filter yang terhubung ke parameter `/api/listings` existing;
- mode grid dan feed vertical dengan scroll snap;
- search history, recently viewed, compare hingga tiga listing, dan reaction/like local-first;
- heart animation pada favorite;
- share channel WhatsApp, Facebook caption, dan copy link;
- report reason selector yang mengirim ke `/api/reports` saat pengguna memiliki token;
- comment thread yang memakai GET/POST comments existing dan auth gate;
- seller rating/review count, supplier level Basic/Verified/Gold, seller profile publik, dan seller listings;
- detail trust panel, Garansi SultraKita, buyer protection copy, MOQ, dan product specs dari `specs` JSON bila tersedia;
- quick message ke chat/WhatsApp, similar items, bulk inquiry melalui RFQ local draft;
- trending section dari sort `popular`, infinite scroll existing, dan video preview progressive bila `video_url` tersedia.

Fitur yang belum dapat diklaim sebagai integrasi production penuh karena belum tersedia pada schema/provider runtime: geospatial radius calculation berbasis koordinat, RFQ server persistence, seller stories 24 jam, reactions/comments realtime, bump/promote, booking GoJek/Grab, RT/RW endorsement, government partnership verification, crowdfunding tambahan, dan property 360 viewer. UI yang bergantung pada area tersebut memakai progressive enhancement atau state yang eksplisit, bukan simulasi transaksi.

Lint, build marker, dan `git diff --check` terakhir lulus.


## Verifikasi runtime

`npm test` menyelesaikan 7 test tanpa failure; seluruh test ter-skip secara guard karena sandbox tidak memiliki `DATABASE_URL`. Lint dan build marker tetap lulus, sedangkan verifikasi endpoint yang membutuhkan database perlu dilakukan melalui CI/deployment live.


## Release live

CI run `33090835634` sukses seluruh tahap. Deployment live kemudian mengiklankan build `b80f75845c2bc4b09ebe19f34e07024c120ffd4f`; `/api/health` melaporkan API dan database up, `/api/stats` serta `/api/categories` merespons sukses, dan homepage memuat `styles.css?v=phase3-features-2` serta `app.js?v=phase3-features-2`. Storage tetap down sesuai catatan konfigurasi R2 sebelumnya.

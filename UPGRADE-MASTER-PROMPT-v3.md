# SultraKita — Upgrade Master Prompt v3

## Tujuan Dokumen

Dokumen ini adalah versi yang lebih operasional dari prompt upgrade SultraKita. Versi awal sudah memiliki cakupan produk yang kuat, tetapi masih terlalu lebar untuk dieksekusi sebagai satu pekerjaan besar tanpa risiko regresi. Versi ini mengubahnya menjadi **program upgrade bertahap dengan baseline terukur, quality gates, batasan perubahan, dan kriteria penerimaan**.

Repository canonical: `saripkdi01-boop/sultrakita-platform`

Deployment yang perlu dijaga: `https://sultrakita.aplikasi-cerdasku.workers.dev/`

> Jangan membuat repository atau aplikasi baru. Semua keputusan teknis harus dimulai dari inspeksi codebase yang ada dan setiap perubahan harus tetap dapat dikembalikan ke branch canonical.

---

## 1. Diagnosis Baseline Aktual

Audit terhadap repository dan deployment menunjukkan bahwa SultraKita sudah memiliki fondasi yang lebih maju daripada yang diasumsikan oleh audit lama. Aplikasi saat ini adalah **Node.js/Express dengan frontend static**, data layer `sql.js`/SQLite lokal, deployment Cloudflare Worker melalui `worker.js`, serta konfigurasi Vercel/Express untuk lingkungan lain. Fitur yang sudah tampak atau tersedia mencakup listing, filter lokasi, kategori, favorit, komentar, laporan, saran, donasi pledge, OTP, verifikasi penjual, upload gambar, percakapan, SSE, analytics, admin endpoint, manifest, sitemap, dan robots file.

Temuan paling penting bukan kekurangan visual, melainkan **konsistensi production, otorisasi, persistence, dan keselarasan antara Express runtime, Worker runtime, schema, dan frontend**. UI deployment sudah memiliki arah visual lokal yang baik, tetapi homepage masih lebih dekat ke katalog listing daripada gabungan social feed dan marketplace discovery yang ditargetkan.

| Area | Kondisi aktual | Risiko | Prioritas |
|---|---|---|---|
| Canonical source | Repository bersih pada branch `main`; deployment dan source perlu terus dibandingkan | Perubahan dapat masuk ke tempat yang salah | P0 |
| Runtime | Express `server.js` dan Cloudflare `worker.js` berjalan dengan jalur implementasi berbeda | Bug dapat diperbaiki di satu runtime tetapi tetap rusak di runtime lain | P0 |
| Database | SQLite berbasis `sql.js`; persistence file lokal; schema memiliki kolom legacy dan kolom verifikasi baru | Tidak cocok untuk scale-out tanpa strategi D1/R2/managed DB | P0 |
| Auth | OTP dan session tersedia, tetapi banyak endpoint masih menerima `user_id`/`sender_id` dari body tanpa autentikasi | Impersonasi, perubahan data milik user lain, spam | P0 |
| Verification | `verification_status` diperbarui, sementara query listing menggunakan `is_verified` yang tidak ikut diperbarui | Badge verified tidak dapat dipercaya | P0 |
| Upload | Filter MIME dan ukuran sudah ada; file lokal masih digunakan jika R2 tidak aktif | Penyimpanan tidak durable dan validasi masih bergantung pada MIME client | P0 |
| Messaging | Conversations, messages, dan SSE tersedia | Membership conversation belum ditegakkan pada seluruh endpoint | P0 |
| API | Response envelope sudah konsisten secara umum; pagination listing sudah ada | Validasi, ownership, dan error observability belum seragam | P1 |
| Frontend | Mobile-oriented homepage, search, kategori, theme toggle, CTA, listing card | Discovery, detail product, seller store, social feed, auth UX masih belum lengkap | P1 |
| Tests | Baseline test lulus, tetapi baru empat skenario dasar | Regression risk tinggi ketika fitur marketplace diperluas | P0 |
| Documentation | README berguna; `AUDIT.md` sebagian sudah tidak sesuai kondisi repository terbaru | Keputusan implementasi dapat didasarkan pada informasi lama | P1 |

---

## 2. Aturan Eksekusi Wajib

Bertindak sebagai **Senior Full-Stack Architect, Product Designer, UX Engineer, Security Engineer, DevOps Engineer, SEO Engineer, dan QA Engineer**. Jangan hanya memberikan rekomendasi. Lakukan perubahan nyata secara incremental pada repository yang telah diberikan.

Sebelum mengubah kode, buat branch kerja yang jelas, catat commit awal, jalankan test baseline, dan simpan hasil audit. Jangan melakukan force push, jangan mengganti remote, jangan menghapus history, dan jangan menghapus fitur existing tanpa bukti bahwa fitur tersebut benar-benar tidak dipakai.

Jangan mengklaim suatu fitur selesai apabila baru dibuat komponen visual atau endpoint kosong. Setiap fitur harus memiliki alur end-to-end yang dapat diuji: UI atau API, persistence, validasi, authorization, loading state, empty state, error state, dan test yang sesuai.

Apabila deployment target menggunakan runtime yang berbeda dari Express, implementasikan atau dokumentasikan adapter yang setara. Jangan memperbaiki `server.js` sambil membiarkan `worker.js` memiliki perilaku yang berlawanan tanpa catatan kompatibilitas.

---

## 3. Quality Gates Sebelum Setiap Phase

Sebelum dan sesudah setiap phase, jalankan `npm test`, pemeriksaan sintaks, dan build/deployment check yang tersedia. Tambahkan test baru untuk perubahan yang menyentuh auth, database, upload, messaging, moderation, atau listing mutation.

Setiap phase dianggap selesai hanya jika: fitur existing tetap berjalan; response error tidak membocorkan stack trace atau secret; migration dapat dijalankan lebih dari sekali tanpa merusak data; endpoint sensitif menolak user tanpa hak; halaman tetap usable pada lebar 390px; dan perubahan terdokumentasi dalam commit terpisah.

---

## 4. Urutan Implementasi yang Dioptimalkan

### Phase 0 — Baseline dan System Map

Inventarisasikan frontend, backend, Worker, database, schema, migration, auth, storage, API, deployment, environment variables, test, dan dependency. Bandingkan output deployment dengan source repository. Perbarui `AUDIT.md` agar tidak lagi menyatakan bahwa frontend, test, validasi, dan upload belum ada bila semuanya sudah tersedia.

Hasil wajib: `SYSTEM-MAP.md`, baseline test log, daftar endpoint, daftar environment variable tanpa nilai secret, dan daftar perbedaan Express versus Worker.

### Phase 1 — P0 Security and Data Integrity

Prioritaskan middleware session yang membaca Bearer token, lookup session hash, expiry check, dan `req.user`. Terapkan authorization berbasis ownership untuk create/edit/delete listing, favorite, comment, conversation, message, seller verification, serta endpoint profile. Untuk endpoint publik, tetap izinkan operasi read yang memang publik.

Perbaiki OTP dengan batas percobaan, invalidasi challenge sebelumnya, rate limit khusus per nomor dan IP, dan jangan pernah mengembalikan `dev_code` di production. Samakan sumber kebenaran status verifikasi: pilih `verification_status` sebagai canonical field atau buat migration yang secara eksplisit menyinkronkan `is_verified` dan status baru. Jangan menampilkan nomor telepon seller ke client kecuali benar-benar diperlukan.

Perkuat upload dengan validasi magic bytes/file signature, normalisasi nama file, cleanup file ketika database insert gagal, dan batas total payload. Jika object storage belum aktif, dokumentasikan bahwa local disk bukan storage production. Jangan menerima `image_url` arbitrer yang dapat digunakan untuk menyisipkan URL berbahaya.

Hasil wajib: authorization matrix, migration non-destruktif, security tests untuk impersonation dan ownership bypass, serta `.env.example` yang lengkap tanpa secret asli.

### Phase 2 — Runtime and Persistence Stabilization

Buat service layer kecil yang dapat dipakai oleh Express dan Worker, atau dokumentasikan perbedaan adapter dengan jelas. Hindari dua implementasi bisnis yang berkembang secara terpisah. Tambahkan request ID, structured logging, graceful shutdown untuk Express, cleanup timer, dan health check yang membedakan API, database, dan storage.

Rancang jalur persistence production. Jika Cloudflare Worker adalah target utama, evaluasi D1 untuk relational data, R2 untuk images, dan KV/Durable Objects hanya jika kebutuhan benar-benar sesuai. Migration harus versioned, idempotent, memiliki backup/rollback note, dan tidak mengasumsikan filesystem lokal tersedia.

Hasil wajib: runtime compatibility matrix, migration directory atau mekanisme versioning yang setara, backup/restore note, dan smoke test deployment.

### Phase 3 — Design System dan App Shell

Bangun token semantik untuk warna, typography, spacing, radius, elevation, focus ring, motion, z-index, dan breakpoints. Gunakan satu primary font yang mendukung bahasa Indonesia. Sediakan light/dark theme dengan contrast yang dapat dibaca.

Pertahankan identitas lokal SultraKita: **Local, Trust, Community, Discovery, Commerce**. Jangan menyalin layout atau identitas visual produk lain. App shell harus konsisten di desktop dan mobile. Mobile bottom navigation: Beranda, Jelajah, Buat, Notifikasi, Profil. Desktop navigation menampilkan Beranda, Jelajah, Kategori, Marketplace, Pesan, Notifikasi, dan Profil.

Setiap komponen interaktif wajib memiliki default, hover, pressed, focus-visible, loading, success, error, dan disabled state. Gunakan skeleton untuk loading list, empty state yang memberikan langkah berikutnya, dan error state dengan retry.

Hasil wajib: design token file, component inventory, responsive QA checklist, dan screenshot checklist pada 390px, 430px, 1440px, serta 1920px.

### Phase 4 — Marketplace Discovery

Ubah homepage menjadi kombinasi discovery marketplace dan community context tanpa membuat halaman terlalu padat. Urutan yang disarankan: search/location, kategori, highlight lokal, trending atau nearby listing, listing terbaru, seller pilihan, community pulse, dan CTA.

Search harus mendukung query, autocomplete, recent searches, trending suggestions, category, location hierarchy, price range, condition, seller, distance bila privacy-safe, sorting, pagination, dan debounce. Jangan mengambil ribuan record sekaligus. Semua query baru harus memeriksa index dan query plan bila runtime database mendukung.

Product card harus compact tetapi informatif: image, title, price, condition, location, seller, timestamp, verification, favorite, share, dan quick action. Product detail harus memuat gallery, trust information, description, specifications, related items, report, share, dan CTA chat/offer sesuai kemampuan backend yang benar-benar tersedia.

### Phase 5 — Seller, Listing Creation, dan Trust

Seller profile harus menjadi mini social-store dengan identitas, lokasi, verification state, rating/review ketika datanya valid, response signal, active listings, sold listings, dan CTA follow/chat/store. Jangan menampilkan metrik palsu; gunakan “belum ada data” jika belum ada basis data yang cukup.

Create listing harus menjadi flow mobile-first dengan upload, reorder, client/server validation, compression/responsive image, draft state bila persistence sudah aman, preview, dan publish. Draft tidak boleh dianggap listing aktif sebelum publish.

Trust layer harus menyediakan report listing/user, moderation state, seller verification, audit trail status, dan pencegahan abuse dasar. Hindari badge atau rating yang dapat dimanipulasi hanya dari input client.

### Phase 6 — Social, Messaging, dan Notifications

Tambahkan like/comment/share/save/follow hanya jika data model dan ownership sudah siap. Gunakan optimistic UI hanya pada operasi yang dapat di-rollback dengan aman. Conversation harus selalu memiliki membership check, context listing, message pagination, read state, attachment policy, dan rate limit.

SSE atau polling dapat dipertahankan jika paling sesuai dengan runtime. Jangan menambahkan WebSocket hanya demi kesan modern. Notification center harus memiliki unread count, event type, deep link, deduplication, dan retention policy.

### Phase 7 — Performance, Accessibility, SEO, dan PWA

Optimalkan image delivery, lazy loading, responsive source, cache headers, code splitting bila relevan, dan blocking JavaScript. Ukur perubahan sebelum dan sesudah; jangan menyatakan “cepat” tanpa measurement.

Gunakan semantic HTML, keyboard navigation, visible focus, label form, accessible error, reduced motion, alt text, dan contrast WCAG 2.2 AA sedapat mungkin. Tambahkan title, description, canonical, Open Graph, robots, sitemap, clean URLs, dan structured data yang sesuai dengan konten nyata. Jangan memakai review/rating schema jika review tidak benar-benar tersedia.

Evaluasi PWA berdasarkan installability dan manfaat nyata. Offline shell hanya untuk asset atau state yang memang dapat digunakan offline; jangan mensimulasikan transaksi, chat, atau publish offline tanpa conflict strategy.

### Phase 8 — Analytics, Monetization, dan AI Readiness

Gunakan analytics privacy-conscious dengan event schema terdokumentasi, retention, consent policy bila diperlukan, dan anonymous/session identifiers. Jangan menyimpan data pribadi yang tidak diperlukan.

Siapkan domain model untuk promoted listing, seller subscription, premium store, advertising, featured product, atau transaction fee tanpa mengaktifkan semuanya sekaligus. Semua perubahan billing harus menunggu provider resmi, webhook signature validation, reconciliation, refund policy, dan operational owner.

AI harus melalui service boundary/provider adapter. Mulai dari fitur berisiko rendah seperti category suggestion atau title assistance, dengan human review untuk moderation dan fallback ketika provider gagal. Jangan mengikat core marketplace ke satu model.

---

## 5. Definition of Done Produk

SultraKita versi terbaru dinyatakan siap untuk release candidate apabila seluruh item berikut terpenuhi.

| Dimensi | Kriteria penerimaan |
|---|---|
| Security | Endpoint mutation sensitif membutuhkan auth dan ownership; upload divalidasi; secret tidak masuk source atau client bundle |
| Data | Migration idempotent; existing data preserved; backup/rollback note tersedia |
| Marketplace | Browse, search, filter, detail, favorite, create listing, dan report berjalan end-to-end |
| Trust | Status verifikasi dan badge konsisten; moderation state terlihat sesuai hak akses |
| Messaging | User hanya dapat membaca/mengirim pada conversation yang diikutinya; pagination dan context listing tersedia |
| UX | Mobile-first tanpa horizontal overflow; loading, empty, error, success, dan focus state tersedia |
| Accessibility | Keyboard/focus/label/contrast/semantic checks dilakukan pada halaman utama |
| SEO | Metadata halaman publik, canonical, sitemap, robots, dan structured data valid untuk konten aktual |
| Performance | Tidak ada query tanpa pagination pada list utama; image payload dan bundle dibandingkan dengan baseline |
| Operations | Health check, request logging, smoke test, deployment notes, dan environment matrix tersedia |
| Testing | Baseline test tetap lulus; critical journeys dan security regressions memiliki test baru |
| Git | Commit terpisah per concern; tidak ada force overwrite; perubahan dapat direview dan di-rollback |

---

## 6. Format Laporan Final Wajib

Berikan laporan final dengan urutan berikut: ringkasan eksekutif; system map aktual; baseline dan temuan; perubahan nyata per phase; daftar file berubah; migration dan compatibility notes; security improvements; performance measurements; UX/accessibility/SEO improvements; test commands dan hasil; deployment notes; remaining technical debt; risiko yang belum terselesaikan; serta strategi commit dan rollback.

Untuk setiap fitur yang belum dapat diaktifkan karena provider atau konfigurasi belum tersedia, jelaskan alasan teknis, environment variable yang diperlukan, risiko bila dipaksa aktif, dan langkah aktivasi yang aman. Jangan menyamarkan placeholder sebagai fitur production.

---

## 7. Instruksi Mulai

Mulai dengan membaca branch, remote, README, package manifest, `server.js`, `worker.js`, `database.js`, `public/`, tests, Wrangler/Vercel config, dan deployment aktual. Jalankan baseline test. Buat `SYSTEM-MAP.md` dan perbarui `AUDIT.md`. Setelah itu kerjakan P0 security/data integrity terlebih dahulu, lalu lanjut hanya ketika quality gate phase tersebut lulus.

Jangan melakukan rewrite total. Jangan mengganti architecture tanpa bukti dari audit. Jangan menambahkan dependency untuk masalah yang dapat diselesaikan dengan platform atau utility yang sudah ada. Jangan menghapus fitur existing yang masih digunakan. Pastikan setiap perubahan dapat diterapkan kembali ke repository GitHub canonical dan tidak memutus URL production yang sudah ada.

**Output setiap phase harus berupa perubahan kode nyata, test yang relevan, dokumentasi singkat, hasil verifikasi, dan commit yang terfokus.**

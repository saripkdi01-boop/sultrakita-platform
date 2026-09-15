# Audit Tahap 1 dan Roadmap Peluncuran SutiApps

**Tanggal audit:** 16 September 2026  
**Target:** `https://sultrakita-platform.vercel.app`  
**Repositori:** `saripkdi01-boop/sultrakita-platform`  
**Commit tahap 1:** `1b1c8dd`

## Kesimpulan

Perbaikan tahap pertama telah diterapkan pada masalah keterbacaan sidebar dalam mode gelap. Akar masalahnya bukan hanya nilai warna yang terlalu gelap, melainkan adanya dua kontrak tema dan dua runtime frontend yang berkembang bersamaan. Halaman produksi Vercel menggunakan aplikasi Next.js, sementara repositori juga mempertahankan frontend vanilla di `public/`. Pada kedua runtime tersebut terdapat aturan warna legacy yang dapat mengalahkan token dark mode.

Patch telah menyelaraskan warna latar, foreground, teks sekunder, border, hover, focus, badge, dan kartu preferensi sidebar dengan token tema aktif. Build Next.js, lint proyek utama, build-check, pemeriksaan diff, serta validasi selector tema berhasil. Perubahan sudah dipush ke branch `main`; deployment Vercel berikutnya perlu dipantau sampai alias produksi benar-benar memakai commit `1b1c8dd`.

## Temuan tahap 1: sidebar dark mode

Pada frontend vanilla, preload menetapkan `html[data-theme="dark"]` sebelum elemen `body` tersedia. Namun token sidebar hanya berubah melalui selector `body.dark`. Akibatnya, first paint dapat memakai `--card: #ffffff` bersama teks gelap walaupun tema global sudah dark. Patch menambahkan selector `html[data-theme='dark']` dan aturan foreground eksplisit pada `#sidebarDrawer`.

Pada frontend Next.js, kontrak tema sebenarnya sudah mendefinisikan token dark mode yang cukup jelas. Masalahnya berada pada blok desain legacy yang memakai `!important` dengan token `--tsuki-*` terang untuk `.menu-title`, `.menu-item`, dan profil sidebar. Patch menambahkan guard dark mode pada lapisan CSS sesudah blok tersebut. Guard ini mencakup sidebar desktop, drawer mobile, menu aktif, hover, profil, metadata, preferensi tema, panel bahasa, login, dan logout.

Perubahan kode berada pada:

| File | Perubahan |
|---|---|
| `public/index.html` | Menyamakan token legacy dengan `html[data-theme='dark']` dan menetapkan foreground sidebar secara eksplisit. |
| `next-app/app/globals.css` | Menambahkan guard dark-mode final untuk sidebar desktop dan mobile terhadap override `!important` legacy. |
| `scripts/verify-sidebar-theme.js` | Menambahkan pemeriksaan statis untuk memastikan selector dan guard dark-mode tetap tersedia. |

## Verifikasi

| Pemeriksaan | Hasil |
|---|---|
| `next-app` production build | Berhasil |
| `npm run lint` | Berhasil |
| `npm run build` | Berhasil |
| `git diff --check` | Berhasil |
| Verifikasi selector sidebar | Berhasil |
| Repository setelah push | `main` sinkron dengan `origin/main` |
| Commit | `1b1c8dd fix: restore sidebar contrast in dark mode` |

## Status produksi yang perlu diperhatikan

Respons halaman produksi saat audit menunjukkan header Next.js dan prerendering Vercel. Ini mengonfirmasi bahwa runtime yang aktif bukan sekadar server Express pada root repository. Endpoint `https://sultrakita-platform.vercel.app/api/health` mengembalikan `404`, sedangkan server Express lokal memiliki endpoint health dan mengembalikan status API aktif dengan database belum terkonfigurasi. Perbedaan ini perlu dibereskan sebelum peluncuran, karena observabilitas dan health check harus mengukur runtime yang benar-benar melayani pengguna.

Secara lokal, backend Express dapat berjalan, tetapi health check menunjukkan `db: down`, `db_driver: unconfigured`, dan `storage: down` ketika `DATABASE_URL` serta kredensial storage tidak disediakan. Kondisi ini bukan kegagalan kode, tetapi bukti bahwa environment produksi belum dapat dianggap siap hanya berdasarkan keberhasilan build.

## Peta tulang punggung saat ini

Repositori memiliki dua jalur aplikasi yang harus diperlakukan sebagai satu produk:

| Lapisan | Kondisi saat ini | Risiko peluncuran |
|---|---|---|
| Frontend Next.js | Memiliki layout, sidebar desktop/mobile, halaman marketplace, feed, groups, jobs, chat, auth, admin, dan route API tertentu. | Jalur yang aktif di Vercel belum didokumentasikan secara eksplisit pada root config. |
| Frontend vanilla | Memiliki homepage marketplace/social yang kaya fitur dan masih dirujuk oleh server Express. | Potensi drift visual, route, dan kontrak API dengan Next.js. |
| Backend Express | Memiliki auth OTP/Google, listings, seller verification, conversations, notifications, donations, analytics, uploads, admin, webhook, dan health endpoint. | Belum terbukti sebagai runtime yang melayani domain produksi saat ini. |
| Database PostgreSQL/Supabase | Skema mencakup users, sessions, listings, images, comments, favorites, conversations, messages, donations, refunds, reports, analytics, dan webhook logs. | Perlu migration state, RLS, backup, pooling, dan environment check yang terverifikasi. |
| Storage | Adapter Cloudflare R2 dan alur signed upload tersedia. | Bucket, public base URL, CORS, signed URL, dan lifecycle policy perlu diuji pada environment production. |
| Integrasi | Resend, WhatsApp Cloud API, Google OAuth, Midtrans/Xendit/Aulaa, Redis, n8n, Telegram, dan AI provider sudah memiliki konfigurasi. | Terlalu banyak integrasi aktif sebelum runtime tunggal dan observabilitas stabil dapat memperbesar blast radius. |

## Roadmap peluncuran SutiApps

### Tahap 2 — Kunci runtime dan deployment

Tetapkan Next.js sebagai runtime publik utama atau tetapkan Express sebagai runtime utama dengan alasan yang terdokumentasi. Atur Root Directory, build command, output, environment variables, dan route ownership di Vercel. Pastikan `/api/health` yang dipantau adalah endpoint milik runtime aktif. Setelah deploy, lakukan smoke test untuk halaman utama, auth, feed, marketplace, listing detail, dan route API.

**Kriteria selesai:** satu domain memiliki satu sumber kebenaran untuk UI, API, autentikasi, dan health check; deployment production menampilkan commit yang sama dengan source yang diuji.

### Tahap 3 — Stabilkan data dan keamanan database

Jalankan migration PostgreSQL/Supabase dari keadaan database yang terukur. Verifikasi primary key, foreign key, unique constraint, index pencarian, status transition listings, idempotensi webhook, dan Row Level Security. Pisahkan environment development, staging, dan production. Aktifkan connection pooling, backup terjadwal, uji restore, serta audit log untuk operasi admin dan pembayaran.

**Kriteria selesai:** migration dapat diulang tanpa merusak data, akses lintas pengguna ditolak, backup dapat direstore, dan query utama marketplace memenuhi target latency.

### Tahap 4 — Jadikan marketplace sebagai alur transaksi yang utuh

Selesaikan alur seller dari onboarding sampai listing terbit. Alur tersebut harus mencakup draft, upload media, validasi kategori dan lokasi, moderasi, status publish, pencarian, detail, kontak seller, favorit, dan pelaporan. Tambahkan state machine yang jelas untuk listing serta order agar tidak ada perpindahan status yang ambigu.

**Kriteria selesai:** satu seller QA dapat membuat listing dari perangkat mobile, satu pembeli QA dapat menemukan listing, menghubungi seller, dan menyelesaikan alur order sandbox tanpa data mock yang bocor ke produksi.

### Tahap 5 — Pembayaran, pengiriman, dan perlindungan pengguna

Pilih satu provider pembayaran utama untuk peluncuran awal dan pertahankan provider lain sebagai fallback yang belum diaktifkan. Verifikasi signature webhook, idempotensi event, expiry, refund, cancel, rekonsiliasi, dan notifikasi. Untuk marketplace lokal, tetapkan kebijakan penjual, biaya layanan, pengiriman atau serah-terima, sengketa, serta penanganan penipuan sebelum transaksi uang nyata dibuka.

**Kriteria selesai:** seluruh event pembayaran dapat direkonsiliasi dari order ke webhook, dan operasi refund/cancel memiliki audit trail serta pembatasan role.

### Tahap 6 — Moderasi, trust, dan operasi Sulawesi Tenggara

Bangun panel moderasi untuk listing, laporan, seller verification, kategori, distrik, dan konten komunitas. Mulai dengan cakupan Kendari dan perluas ke kabupaten/kota lain melalui taxonomy lokasi yang konsisten. Tambahkan aturan konten, kanal pelaporan, waktu respons dukungan, dan metrik seller aktif, listing berkualitas, conversion, repeat buyer, serta distribusi wilayah.

**Kriteria selesai:** laporan pengguna memiliki owner, SLA, status, dan histori tindakan; data analitik dapat difilter menurut wilayah tanpa membuka data pribadi.

### Tahap 7 — Performance, accessibility, dan release readiness

Gunakan Lighthouse dan pengujian perangkat nyata untuk mobile. Audit kontras seluruh state tema, keyboard navigation, focus ring, reduced motion, label form, alt text, error state, loading state, dan empty state. Optimalkan gambar R2, caching, pagination, infinite scroll, dan bundle route. Tambahkan synthetic monitoring untuk route publik dan API penting.

**Kriteria selesai:** tidak ada blocker aksesibilitas, error JavaScript kritis, route 404 yang tidak disengaja, atau endpoint produksi tanpa observabilitas.

### Tahap 8 — Peluncuran bertahap dan pengukuran dampak

Lakukan soft launch dengan kelompok seller dan pembeli yang mewakili beberapa distrik. Buka fitur berdasarkan feature flag. Pantau error rate, latency p95, listing aktif, seller yang berhasil onboarding, buyer contact rate, order success, cancellation, refund, dan laporan penipuan. Setelah metrik stabil, perluas akses dan jalankan program onboarding UMKM melalui komunitas lokal.

**Kriteria selesai:** peluncuran memiliki rollback plan, owner on-call, dashboard metrik, runbook insiden, serta keputusan go/no-go berbasis data.

## Prioritas eksekusi berikutnya

Prioritas tertinggi bukan menambah fitur baru. Prioritasnya adalah menghilangkan ambiguitas antara Next.js dan Express, memastikan deployment memakai source yang benar, dan menghubungkan database production secara aman. Setelah itu, fokus pada satu vertical slice: seller onboarding, listing, discovery, contact, dan order sandbox. Vertical slice tersebut akan memberi bukti manfaat marketplace lebih cepat daripada mengaktifkan seluruh integrasi sekaligus.

## References

[1]: https://sultrakita-platform.vercel.app "SutiApps production URL audited on 16 September 2026"
[2]: https://github.com/saripkdi01-boop/sultrakita-platform "SultraKita Platform source repository"
[3]: https://vercel.com/docs "Vercel deployment documentation"
[4]: https://supabase.com/docs/guides/database "Supabase database documentation"
[5]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html "WCAG 2.2 contrast minimum guidance"

*Laporan ini disusun berdasarkan source code dan respons deployment yang dapat diakses pada saat audit. Status environment rahasia, kredensial provider, dan data produksi tidak diekspos.*

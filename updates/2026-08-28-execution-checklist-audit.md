# SultraKita — Execution Checklist Baseline Audit

## Prinsip yang dipertahankan

Repository berada pada branch `main` dan working tree bersih sebelum audit. Upgrade berikutnya wajib additive: tidak menghapus API route atau tabel, tidak mengubah konfigurasi koneksi Supabase, tidak merombak entry point Express, dan tidak memutus fitur marketplace existing. Implementasi frontend tetap vanilla HTML/CSS/JavaScript pada Express existing.

## Status checklist

| Checklist | Status baseline | Bukti implementasi |
|---|---|---|
| CSS variables/design system | Selesai pada Phase 1 | `public/styles.css` |
| Font imports | Selesai pada Phase 1 | `public/index.html`, halaman account/chat |
| Topbar, listing card, skeleton loading | Selesai | `public/index.html`, `public/app.js`, `public/styles.css` |
| Search autocomplete | Selesai | `renderSuggestions()` dan endpoint suggestion existing |
| Dark mode persistence | Selesai | `theme.js`, `account.js`, `app.js`, `localStorage` |
| Responsive breakpoints/mobile navigation | Selesai pada Phase 6 | `public/styles.css`, `public/index.html` |
| Favorites frontend + API persistence | Selesai baseline | UI/state/API marker ada; tetap perlu regression check dengan data DB aktif |
| Notifications | Selesai baseline setelah batch ini | Endpoint existing `/api/notifications` dan `/api/notifications/:id/read` kini memiliki notification center di account dashboard dengan unread count, link internal aman, refresh, dan tandai dibaca |
| Listing detail upgrade | Selesai sebagian | `openDetail()` dan detail dialog existing; perlu audit kelengkapan media/SEO |
| Filter bar real API | Selesai | `loadListings()` memakai query filter/radius/harga/sort |
| Category horizontal scroll | Selesai | `.category-scroll` dan responsive CSS |
| Infinite scroll | Selesai baseline | `IntersectionObserver` existing tetap mempertahankan tombol `Muat listing berikutnya` sebagai fallback |
| Share WhatsApp/copy link | Selesai | Share handlers di `public/app.js` |
| Seller profile | Selesai | `openSellerProfile()` dan API seller existing |
| Video listing | Selesai sebagian | Video preview pada card/detail path existing; perlu QA media nyata |
| Review & rating | Selesai sebagian | Rating/review fields dan comments path existing; perlu audit UX/persistence |
| RFQ | Selesai | Dialog RFQ, local draft, dan endpoint existing |
| Comparison | Selesai | Compare tray/dialog/state existing |
| Realtime notifications | Fallback/opsional | Supabase realtime hook ada; production public config sengaja null, sehingga Express fallback tetap menjadi baseline |
| Admin analytics | Selesai baseline | `public/admin.html` dan API admin existing |
| Promoted/featured listings | Backend marker tersedia | Perlu audit UI dan authorization sebelum perubahan |
| Search trending algorithm | Sebagian tersedia | Trending/recent sections dan analytics marker ada; algoritme perlu dirumuskan sebelum menambah schema |

## Batch yang diimplementasikan

Notification center ditambahkan hanya pada `account.html`, `account.js`, dan `account.css`, dengan cache-buster `notifications-1`. Tidak ada migration SQL, dependency baru, endpoint baru, atau perubahan server. Renderer memakai DOM API/textContent untuk title, body, timestamp, dan link agar data notifikasi tidak disisipkan sebagai HTML mentah. Link hanya ditampilkan jika berupa path internal yang diawali `/`. Item unread diberi class dan tombol `Tandai dibaca`; refresh menggunakan endpoint existing.

## QA batch

Local `git diff --check`, `node --check public/account.js`, `npm run lint`, dan `npm run build` lulus. Test suite backend tetap tidak dijalankan pada batch ini karena tidak ada perubahan server; baseline CI wajib dijalankan saat release.

Browser account lokal memverifikasi notification card, stylesheet `/account.css?v=notifications-1`, script `/account.js?v=notifications-1`, skip link, dan target main. Fixture aman menghasilkan satu `.notification-item.is-unread`, link internal `/orders.html?id=7`, dan tombol `Tandai dibaca`; fixture kemudian dihapus kembali dan tidak menyentuh database maupun autentikasi. Screenshot Chromium headless pada viewport `375x812` berhasil dibuat di `updates/qa/account-notifications-375.png`; mode login tetap satu kolom, kontrol OTP tidak meluber, dan tombol utama memenuhi lebar mobile.

## Prioritas berikutnya

Setelah batch notifikasi, prioritas aman berikutnya adalah regression mobile 375px dan audit dialog/dynamic content. Promoted listings dan trending algorithm ditunda sampai kontrak authorization dan sumber data existing dipastikan. Setiap batch berikutnya harus tetap melewati lint, build, test, security regression, API smoke test, mobile browser check, keyboard/screen-reader semantics, serta verifikasi route/schema existing.

## Release batch notification center

Batch frontend notification center telah dipush melalui commit `5168cbc` (`feat: add account notification center`). CI run `33118355211` berstatus success dan meluluskan migration, idempotency, lint, test, security regression, build, API smoke test, dan cleanup. Halaman account production memuat `.notification-card`, `#notifications`, `/account.css?v=notifications-1`, `/account.js?v=notifications-1`, skip link, dan `#account-main[tabindex="-1"]`. Tidak ada autentikasi atau data pengguna yang dipakai saat verifikasi live; isi notification hanya muncul setelah login melalui endpoint existing.

## Diagnosis lampiran dan repair data-pipeline

Diagnosis lampiran tentang SQLite tidak sesuai dengan repository aktual: `database.js` hanya memakai `pg` melalui `DATABASE_URL` atau `SUPABASE_DB_URL`, dan `vercel.json` sudah memakai `@vercel/node` untuk `server.js`. Production `/api/health`, `/api/stats`, dan `/api/listings` dapat diakses dengan HTTP 200, tetapi `/api/listings` sebelumnya mengembalikan `source: degraded`.

Log runtime Vercel menunjukkan dua penyebab aktual: `COALESCE types bigint and boolean cannot be matched` pada query seller verification dan `relation "rate_limits" does not exist`. Inspeksi `information_schema` Supabase production juga mengonfirmasi kolom Phase 4 listing dan tabel `rate_limits` belum tersedia. Query listing/detail diperbaiki dengan normalisasi `u.is_verified::text`, sehingga kompatibel dengan legacy bigint maupun boolean. Migration repository `013_rate_limits_repair.sql` ditambahkan, lalu migration production `phase4_schema_repair_014` diterapkan secara additive/idempoten melalui Supabase untuk memulihkan kolom `is_featured`, `is_promoted`, `views_count`, `favorites_count`, `video_url`, `promoted_until`, `seller_rating`, `notifications.data`, `listing_views`, `search_history`, `rate_limits`, dan index terkait.

Setelah repair, `/api/listings?limit=2` production merespons `success: true`, `HTTP 200`, `meta.limit: 2`, tanpa `source: degraded`; `/api/stats` dan `/api/health` juga tetap sukses. Tidak ada listing aktif saat verifikasi, sehingga `data: []` adalah kondisi data yang valid, bukan loading failure. Log `listings-fallback` yang terlihat setelah retest hanya berasal dari request sebelum migration repair; tidak ada error baru pada request setelah schema tersedia.


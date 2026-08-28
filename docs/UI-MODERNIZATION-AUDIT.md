# SultraKita Social Marketplace UI/UX Modernization Audit

## Ringkasan arsitektur saat ini

SultraKita menggunakan aplikasi Node.js CommonJS berbasis Express (`server.js`) dengan frontend vanilla HTML, CSS, dan JavaScript di folder `public/`. Homepage entry point adalah `public/index.html`, perilaku utama berada di `public/app.js`, dan styling historis berada di `public/styles.css` dengan progressive override tambahan `public/fb-theme.css`. `server.js` menyediakan route API marketplace, auth, upload, komentar, donasi, komunitas, analytics, dan aset statis. Deployment production terhubung ke GitHub repository `saripkdi01-boop/sultrakita-platform` melalui Vercel.

| Lapisan | File utama | Kontrak yang harus dijaga |
|---|---|---|
| Static shell | `public/index.html` | ID, `data-*`, form names, dialog hooks, script order |
| Interaction/runtime | `public/app.js` | API calls, delegated events, URL sync, local/session storage |
| Visual system | `public/styles.css`, `public/fb-theme.css` | responsive breakpoints, dark theme, safe-area, accessibility |
| Backend | `server.js`, `database.js` | Express routes, auth middleware, payload/response envelopes |
| Auth | `auth.js`, `public/app.js` | OTP request/verify, bearer/session token, seller onboarding |
| Data | `database.js`, `supabase/`, `public/supabase-client.js` | local/Postgres compatibility and optional realtime |

## Existing component inventory

Homepage sudah memiliki topbar, location picker, search suggestions, category navigation, compact hero, broadcast carousel, metric cards, listing grid/feed, filters, pagination/infinite loading, recently viewed, trending, partner listings, jobs, compare tray/dialog, RFQ dialog, seller onboarding wizard, OTP flow, image preview/upload, donation dialog, listing detail dialog, seller profile dialog, comments, reports, realtime feed banner, command palette, toast, service worker, and policy consent gate.

## DOM dependencies dan selector berisiko

Selector berikut direferensikan langsung atau tidak langsung oleh `app.js`, `marketplace-bridge.js`, `live-feed.js`, atau policy consent. Selector tersebut tidak boleh dihapus atau diganti nama tanpa patch binding pada commit yang sama.

| Kelompok | Selector wajib dipertahankan |
|---|---|
| Search/location | `#search`, `#search-button`, `#suggestions`, `.top-search`, `#location-pill`, `#location-label`, dynamic `#location-dialog` |
| Navigation/hero | `#beranda`, `#jelajah`, `#kategori`, `#job-board`, `#komunitas`, `#hero-explore`, `#hero-sell`, `#open-sell`, `#mobile-sell`, `#theme-toggle` |
| Data/filters | `#categories`, `#district`, `#sort`, `#radius`, `#min-price`, `#max-price`, `#listings`, `#load-more`, `#result-summary`, `#active-filter-row`, `#clear-filter` |
| Metrics | `#total-listings`, `#covered-districts`, `#weekly-new-listings`, `#stats-status`, `#favorite-count` |
| Dynamic sections | `#recent-section`, `#recent-listings`, `#trending-section`, `#trending-listings`, `#partner-picks`, `#partner-listings`, `#job-listings`, `#compare-tray`, `#compare-count`, `#compare-open`, `#compare-clear` |
| Dialogs/forms | `#rfq-dialog`, `#rfq-form`, `#rfq-open`, `#rfq-cancel`, `#rfq-message`, `#compare-dialog`, `#compare-content`, `#sell-dialog`, `#listing-form`, `#form-message` |
| Seller/OTP/upload | `#request-otp`, `#otp-phone-field`, `#otp-email-field`, `#onboarding-photo-drop`, `#onboarding-photo-preview`, `#onboarding-ai-suggest`, `#onboarding-ai-status`, `#onboarding-summary`, `#onboarding-finish`, `#onboarding-add-more`, `#form-category`, `#form-district` |
| Donation/feedback | `#donation-cta`, dynamic `#donation-dialog`, `#suggestion-cta`, `#show-guide`, `#toast` |
| Dynamic attributes | `[data-category]`, `[data-action]`, `[data-open-listing]`, `[data-view]`, `[data-carousel-dot]`, `[data-detail-share-channel]`, `[data-similar-id]`, `[data-seller-id]`, `[data-onboarding-next]`, `[data-onboarding-back]`, `[data-step-dot]`, `[data-donation-nav]` |

## API dependencies

API calls existing di `app.js` harus tetap dipanggil dengan parameter yang sama. Permukaan utamanya adalah `GET /api/health`, `/api/categories`, `/api/locations`, `/api/stats`, `/api/listings`, `/api/listings/:id`, `/api/listings/:id/images`, `/api/listings/:id/comments`, `/api/external-listings`, `/api/external-jobs`, `/api/broadcasts`, `/api/sellers/:id`, `/api/donation/stats`, `/api/community/summary`, serta `POST /api/listings`, `/api/favorites`, `/api/comments`, `/api/suggestions`, `/api/reports`, `/api/donations`, `/api/auth/request-otp`, `/api/auth/verify-otp`, `/api/seller/onboarding`, `/api/seller/onboarding/finalize`, `/api/uploads/presign`, `/api/uploads/commit`, `/api/listings/:id/images`. `DELETE /api/favorites` juga harus tetap tersedia.

Listing search memakai `q`, `category`, `district`, `min_price`, `max_price`, `sort`, `page`, `limit`, serta state radius/view yang disimpan terpisah. Mutation API tidak boleh diberi retry otomatis oleh client.

## Authentication dependencies

Seller onboarding memakai `sessionStorage['sultra-seller-session']`; token fallback dibaca dari `localStorage['sultra-account-token']`, `localStorage['sultra-auth-token']`, `localStorage['sultra-token']`, atau session auth token. OTP channel dapat berupa WhatsApp atau email. Authenticated favorites, comments, dan reports memakai bearer token. Jangan menambah secret ke frontend.

## Supabase dependencies

`public/supabase-client.js` memakai konfigurasi publik yang sudah ada untuk fitur realtime, sedangkan `public/live-feed.js` hanya aktif jika `window.SultraLiveFeed` tersedia. Service role key tidak boleh muncul di browser. Backend database abstraction tetap berada di `database.js`; UI tidak boleh mengubah response envelope untuk kebutuhan visual.

## localStorage dan session dependencies

| Storage | Key |
|---|---|
| localStorage | `sultra-favs`, `sultra-search-history`, `sultra-recently-viewed`, `sultra-compare`, `sultra-reactions`, `sultra-dark`, `sultra-radius`, `sultra-view`, `sultra-rfq`, `sultra-last-donation` |
| localStorage | `sultra-seller-onboarding-draft`, `sultrakita-policy-consent` |
| sessionStorage | `sultra-seller-session`, `sultra-auth-token`, `sultrakita-policy-session` |

## Upload dependencies

Upload flow melakukan image compression client-side, meminta presigned uploads melalui `/api/uploads/presign`, mengunggah file ke storage, melakukan commit melalui `/api/uploads/commit`, dan memiliki fallback multipart ke `/api/listings/:id/images` jika storage unavailable. Field `images` menerima JPG, PNG, dan WEBP maksimal lima file.

## Responsive dan navigation saat ini

CSS existing memiliki beberapa generasi override. Desktop menggunakan sidebar fixed dan homepage content; tablet menyembunyikan sebagian label sidebar; mobile memakai topbar dua baris dan bottom navigation fixed dengan safe-area. `fb-theme.css` menambahkan center tabs, right rail, dan mobile drawer. Risiko utama adalah specificity dari stylesheet lama, overlay right rail terhadap feed, serta menjaga `#mobile-sell` tetap terikat ke `openSellDialog`.

## Event handlers yang tidak boleh rusak

Event delegation listing harus tetap menangani favorite, compare, reaction, share, FB copy, flyer, ask, detail open, dan keyboard Enter/Space. Search input/button harus tetap menjalankan suggestion dan `loadListings()`. Filter harus tetap melakukan URL sync dan pagination reset. Dialog seller, RFQ, donation, detail comments/report/share, location picker, carousel, realtime feed, and command palette harus tetap dapat membuka target existing.

## Acceptance risks dan keputusan audit

Risiko tertinggi adalah mengganti ID/data attribute, menambahkan static/fake marketplace data, mengubah payload mutation, menutup `#mobile-sell` tanpa pengganti yang terikat, serta menampilkan widget right rail dengan angka hardcoded. Modernisasi berikutnya harus menggunakan data real dari endpoint yang tersedia; jika endpoint gagal atau kosong, widget harus menampilkan empty state atau disembunyikan, bukan fake data.

> Kesimpulan: strategi aman adalah visual refactor progressive. Pertahankan `index.html` sebagai compatibility shell, patch hanya area layout baru dan binding tambahan, serta gunakan `public/fb-theme.css` sebagai layer terakhir.

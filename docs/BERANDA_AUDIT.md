# AUDIT /beranda — Fondasi Overhaul Social Feed (Fase A)

**Tanggal:** 2026-10-01 · **Auditor:** subagent principal (read-only, tanpa perubahan file)
**Worktree:** `~/workspace/worktrees/sultrakita-beranda` · **Branch:** `upgrade/beranda-worldclass-overhaul`
**Base:** `main` @ `e81b46e` (merge PR #21 — worldclass execution; working tree bersih)
**App:** `next-app/` (Next.js 15.5.25 + React 18 + Supabase, repo `saripkdi01-boop/sultrakita-platform`)

---

## 1. Ringkasan eksekutif

`/beranda` hari ini adalah **halaman hibrida**: hero marketing + feed sosial infinite-scroll, dengan komposer posting yang sudah matang di sisi tulis (create post) tetapi **sangat lemah di sisi baca/interaksi sosial**. Fondasi yang sehat: SSR hero + ISR, cursor pagination bertanda tangan, RLS yang ketat, CSRF + rate limit berlapis, dan komposer dengan validasi server + upload R2 presigned.

Namun ada **2 temuan P0 yang wajib diperbaiki sebelum/dalam overhaul**:

1. **Jumlah suka/komentar tidak pernah tampil** — `GET /api/feed` tidak mengembalikan `likes_count`, `comments_count`, maupun status `liked`, padahal client (`hooks/useInfiniteFeed.ts`) memetakan field tersebut. Akibatnya setiap kartu feed selalu menampilkan "0 suka / 0 komentar" dan tombol like tidak pernah ter-hydrate dari server. Ini merusak inti pengalaman social feed.
2. **Data palsu hardcoded di produksi** — `RightSidebar` me-render properti fiktif ("Nirwana Residence", "The Coast Villa"), nomor WhatsApp `628123456789`, dan kontak online fiktif. Ini melanggar keputusan Fase 0 (D-07: tanpa klaim palsu).

Selain itu: **komentar belum ada UI/API-nya** (tombol hanya menampilkan notice "akan hadir"), **stories adalah placeholder statis** (tidak ada tabel stories), **filter kategori mati total** (state tidak dipakai), **dark mode tidak didukung halaman beranda** (padahal shell app mendukung), dan **tidak ada endpoint follow/unfollow** (feed "Mengikuti" hanya filter baca).

**Rekomendasi garis besar:** pertahankan kontrak `/api/feed` + cursor HMAC, server action `createPost`, pola SSR hero, dan seluruh navigasi global; bangun baru `/api/comments`, perluasan count di `/api/feed`, `/api/follow`, tabel `saved_posts`, dan widget sidebar berbasis data nyata; hapus komponen duplikat mati; satukan styling ke design tokens + varian dark.

---

## 2. Inventaris route & file /beranda

### 2.1 Route files (`next-app/app/beranda/`)

| File | Peran |
|---|---|
| `app/beranda/page.tsx` (25 baris) | Server Component. ISR `revalidate = 120`. Mengambil `getBerandaData()` (produk + event) untuk SEO/LCP, lalu me-render `BerandaPageClient`. Metadata SEO/OG/canonical (duplikat parsial dengan `layout.tsx` — lihat F14). Fallback: `catch` → `{ ok: false, products: [], events: [] }`. |
| `app/beranda/page-client.tsx` (~230 baris) | Client Component utama ("beranda-v4"). Komposisi: hero + search, pulse, explore grid, `StoriesSection`, `CreatePostInput`, filter feed + **filter kategori (mati)**, daftar `FeedPost`, infinite scroll via sentinel IntersectionObserver, section produk marketplace, section event komunitas, rail kanan (`RightSidebar` + opportunity + trust). Membuka `CreatePostModal` via `?compose=post|reel`. |
| `app/beranda/layout.tsx` (18 baris) | Layout tipis, hanya metadata (title/description/OG/canonical) lalu `return children`. Metadata-nya sedikit berbeda dari `page.tsx`. |
| `app/beranda/loading.tsx` | Skeleton generik (`skeleton-line`/`skeleton-card`) — tidak menyerupai layout v4 (lihat F17). |

### 2.2 Komponen (`next-app/components/beranda/`)

| File | Status | Peran |
|---|---|---|
| `FeedPost.tsx` (6,6 KB) | **AKTIF** | Kartu postingan: header author + privacy, konten, galeri media (grid ≤4 + lightbox `window.open`), video autoplay saat ≥60% viewport (hormat `prefers-reduced-motion`), ringkasan like/komen, aksi Like/Komentar/Bagikan/Simpan/WhatsApp. Like optimistis lokal; simpan via `localStorage` (lihat F9). Tombol "⋯" tidak berfungsi (tanpa menu). |
| `CreatePostModal.tsx` (15 KB) | **AKTIF** | Komposer penuh: tab post/reel, textarea 2000 char + counter, privasi publik/pengikut, lokasi, mood (6 opsi terkontrol), tag warga (search debounce 280ms, maks 10), upload ≤4 media via R2 presigned URL, draft di `localStorage`, idempotency key UUID, validasi + pesan error id-ID. |
| `CreatePostInput.tsx` (2,3 KB) | **AKTIF** | Trigger komposer (gaya "What's on your mind") + shortcut Foto/Reel/Lokasi. |
| `StoriesSection.tsx` (1,1 KB) | **AKTIF tapi placeholder** | Rail cerita statis: tombol "Buat cerita" (membuka komposer post biasa!) + kartu "Belum ada cerita". Tidak ada data/backend. |
| `RightSidebar.tsx` (1,4 KB) | **AKTIF — DATA PALSU** | Widget "Properti Unggulan" + "Kontak online" hardcoded (lihat P0-F2). |
| `LeftSidebar.tsx`, `TopNavBar.tsx`, `TagToolRow.tsx`, `MediaActionIcon.tsx` | **MATI** | Tidak diimpor di mana pun (grep seluruh `app/`, `components/`, `actions/`, `lib/`, `hooks/` → nol). |
| `SultraKitaUiUpgrade.tsx` (14,7 KB) | **MATI** | Varian feed alternatif dengan data lokal + satu-satunya file beranda yang punya kelas `dark:`. Tidak diimpor. |

### 2.3 Duplikat mati di luar `components/beranda/`

`components/feed/FeedPost.tsx`, `components/feed/CreatePostInput.tsx`, `components/stories/StoriesSection.tsx`, `components/stories/StoryCard.tsx`, `components/reels/ReelCard.tsx`, `components/reels/ReelsFeed.tsx` — **tidak ada yang mengimpor `components/feed` atau `components/stories`**; `/reels` memakai `components/reels/*` dengan **fallback demo hardcoded** (video `flower.mp4` dari MDN, `likes_count: 128` fiktif, author "Maya Kendari").

### 2.4 Hooks & lib khusus beranda

| File | Peran |
|---|---|
| `next-app/hooks/useInfiniteFeed.ts` | Infinite feed client: `GET /api/feed?filter=&limit=10&cursor=`, dedup by id, AbortController, `filter`/`setFilter`/`loadMore`/`reload`. `relativeTime()` hanya menit/jam (lihat F12). |
| `next-app/lib/feed-interactions.ts` | `setPostLike(postId, liked)`: ambil CSRF token dari `/api/csrf`, POST/DELETE `/api/interactions` dengan `X-CSRF-Token` + idempotencyKey. |
| `next-app/lib/beranda-data.ts` | `getBerandaData()` (server): `fetchPublicListings({limit:3})` + `group_events` mendatang (limit 3). |
| `next-app/lib/beranda-types.ts` | Tipe murni `BerandaProduct`/`BerandaEvent` + `formatEventMonth` (aman untuk client). |

### 2.5 Layout hierarchy & navigasi global (dipakai beranda)

```
app/layout.tsx  →  PreferencesProvider (tema + bahasa), metadata global
  └─ app/beranda/layout.tsx  →  metadata beranda
      └─ app/beranda/page.tsx (RSC)
          └─ page-client.tsx → <AppLayout active="home" onCreate={openComposer}>
                ├─ Header (brand, search, top-nav: Beranda/Pasang iklan/Panduan,
                │          CreateMenu, NotificationCenter, ProfileHub)
                ├─ QuickNavBar (Beranda, Campaign Hub, Komunitas, SUKI Jobs,
                │          SUKI Suits, SUKI Marketplace, Ajak Teman) — navigasi via
                │          window.location.href (full reload, bukan <Link>)
                ├─ SidebarDesktop (profil mini, menu dari config/navigation,
                │          toggle tema, pilihan bahasa, login/logout)
                └─ SidebarMobileDrawer
```

`middleware.ts`: `/beranda` adalah **rute publik** (tanpa login bisa baca feed). Rate limit + maintenance-mode di middleware; redirect `/login` hanya untuk rute non-publik. Deep-link composer: `/beranda?compose=post|reel` (di-pin contract test).

---

## 3. Model data & kontrak API

### 3.1 Tabel Supabase (dari `supabase/migrations/`)

| Tabel | Kolom kunci | Migrasi |
|---|---|---|
| `posts` | `id` uuid PK · `user_id` uuid → profiles · `content` text · `media_urls` text[] · `type` ∈ post/reel/property · `location` text · `mood` text (≤40 char, 6 nilai terkontrol di app) · `tagged_user_ids` uuid[] (≤10, GIN index) · `privacy` ∈ public/followers · `status` ∈ draft/published/archived · `idempotency_key` text (unique per user) · `created_at/updated_at` | `20260913000000_beranda_social_feed.sql`, `20260911232118_create_post_metadata.sql`, `20260916000000_live_social_posts.sql` |
| `likes` | PK `(post_id, user_id)` → posts/auth.users | `20260913000000_beranda_social_feed.sql` |
| `comments` | `id` uuid · `post_id` · `user_id` · `content` (non-blank) · `created_at` | `20260913000000_beranda_social_feed.sql` |
| `follows` | PK `(follower_id, following_id)` · check anti-self | `20260829100000_social_beta.sql` |
| `profiles` | `id` → auth.users · `display_name`, `username` (unique), `avatar_url`, `bio`, `district`, `role` ∈ warga/seller/admin (+buyer/creator/community di tipe client), `is_verified`, `visibility_settings` (jsonb: avatar public/followers/private) | `20260829100000_social_beta.sql` + beberapa |
| `notifications` | `recipient_id`, `actor_id`, `type`, `title`, `body`, `link`, `read_at` | `20260829100000_social_beta.sql` |
| `group_events` (+`groups`) | `id`, `title`, `starts_at`, `location`, `group_id` | dipakai hero beranda |

**Tidak ada:** tabel `stories`, tabel `saved_posts`/bookmark server-side, kolom `likes_count`/`comments_count` di `posts` (dihitung on-the-fly — tapi saat ini **tidak dihitung sama sekali** di `/api/feed`).

### 3.2 RLS relevan (ringkas)

- `posts`: `select` untuk anon+authenticated bila `status='published'` DAN (`privacy='public'` ATAU `auth.uid()=user_id`) — **catatan:** post `followers` hanya bisa dibaca author sendiri; graph follow belum ditegakkan di policy (disebut eksplisit di komentar migrasi sebagai TODO).
- `likes`/`comments`: `select` publik; `insert/delete` hanya pemilik (`auth.uid()=user_id`).
- `follows`: `select` publik; `insert/delete` hanya `follower_id = auth.uid()`.
- `profiles`: `select` publik penuh; write hanya pemilik. (Implikasi: email/no. HP tidak boleh ditaruh di kolom publik.)
- `notifications`: hanya `recipient_id` (select+update).
- `group_events`: dibaca beranda via anon client dengan filter grup publik.

### 3.3 Kontrak API & server actions

| Kontrak | Lokasi | Detail |
|---|---|---|
| `GET /api/feed?filter=&limit=&cursor=` | `next-app/app/api/feed/route.ts` | Filter: `recommended`/`following`/`latest`/`property`/`video`. Cursor HMAC-SHA256 v1 `{v, filter, createdAt, id}` (secret `FEED_CURSOR_SECRET`/`SUPABASE_JWT_SECRET`). Pagination keyset `created_at < cursor` + `limit+1`. Respons: `{ data: ApiPost[], pageInfo: {endCursor, hasNextPage}, rankingVersion: 'baseline-v1', filter }`. Rate limit 60/menit. `following` → 401 bila anonim. **Tidak mengembalikan counts/liked (P0).** Avatar di-mask bila `visibility_settings.avatar ≠ 'public'`. |
| `POST /api/interactions` `{action:'like', postId, idempotencyKey}` | `next-app/app/api/interactions/route.ts` | CSRF double-submit (`x-csrf-token` vs cookie `suki_csrf`), idempoten (cek existing + toleransi 23505). Rate limit per IP + per user. |
| `DELETE /api/interactions?postId=` | sama | Unlike. Idempoten. |
| `createPost(input)` (server action) | `next-app/lib/actions/posts.ts` | Validasi: konten ≥2 char atau media, ≤2000 char; type/privacy/mood whitelist; media URL `https://` ≤4; tag IDs uuid valid ≤10 & bukan diri sendiri; reel wajib video; auto-create profil bila belum ada; idempotency via `(user_id, idempotency_key)` unique. Error aman id-ID (kode PG dipetakan). |
| `searchProfiles(query)` (server action) | sama | Pencarian profil untuk tagging (ilike display_name/username, limit 8, escape `%_`). |
| `createR2Upload({fileName, contentType, size})` | `next-app/actions/upload.ts` | Presigned POST R2 untuk media (dipakai CreatePostModal). |
| `GET /api/listings?limit=3` | `next-app/app/api/listings/route.ts` | Sumber section "Produk dengan cerita" (sudah menyaring demo — Fase 0). |
| `GET /api/csrf` | `next-app/app/api/csrf/route.ts` | Penerbit token CSRF. |
| **Tidak ada** | — | API komentar, API follow/unfollow, API simpan/bookmark, API stories, API pencarian feed. |

### 3.4 Auth/session

- Supabase Auth via `@supabase/ssr`; middleware me-refresh sesi per request (`middleware.ts`). Client: `lib/supabase/client.ts` (null bila env belum diset → "demo mode" build).
- `hooks/useSessionProfile.ts`: hydrate user + profil + unread notification count. **Bug:** query pertama memakai kolom `profile_id`/`is_read` yang tidak ada di skema (kanonis: `recipient_id`/`read_at`) → selalu error lalu fallback (F10).
- Role: `profiles.role` (`warga`/`seller`/`admin`, tipe client juga mengenal `buyer`/`creator`/`community`); proteksi `/admin` & `/seller` di middleware.
- Kebijakan nama tampilan tunggal: `getProfileNickname()` (username → display_name → metadata → email prefix).

---

## 4. Sistem desain & komponen existing yang bisa dipakai ulang

### 4.1 Tokens & theming
- `next-app/design-system/tokens.css`: `--suki-space-*`, `--suki-radius-*`, `--suki-shadow-*`, `--suki-ease-*`, `--suki-duration-*`, dan **tema light/dark penuh** via `html[data-theme='dark']` (`--suki-theme-bg/surface/text/primary/...`).
- `next-app/lib/preferences.tsx`: `PreferencesProvider` — toggle tema (persist `sultrakita-theme`, hormat `prefers-color-scheme`), 25 bahasa (persist `sultrakita-language`). Diterapkan via `dataset.theme` + class `dark` di `<html>`/`<body>`.
- `tailwind.config.ts`: `darkMode: 'class'`; palet `suki-*`, `sultra-*` (teal `#A16207`, sand `#FAF9F6`, forest `#292524`, gold `#D4AF37`, mint `#F5EEDB`), font `DM Sans` (sans) + `Playfair Display` (display); radius card 20px/feature 28px.
- **Kesenjangan:** seluruh CSS beranda (`beranda-v4-*`, `beranda-feed-post`, `feed-*`, `create-post-*`, ±150 kelas di `globals.css` 3821 baris) adalah **gaya ad-hoc tanpa varian dark** — `grep -c "\.dark \.beranda" globals.css` = **0**. Hanya file mati `SultraKitaUiUpgrade.tsx` yang memakai kelas `dark:`. Akibatnya toggle dark mode membuat shell gelap tapi konten beranda tetap terang (F8).

### 4.2 Komponen/UI yang layak dipakai ulang untuk overhaul
- **Navigasi:** `AppLayout`, `Header`, `QuickNavBar`, `SidebarDesktop`, `SidebarMobileDrawer`, `CreateMenu`, `BrandLogo`, `NotificationCenter`, `ProfileHub` — jangan disentuh strukturnya.
- **Feed yang ada:** `FeedPost` (galeri media + `ViewportVideo` autoplay ambang 60% + hormat reduced-motion sudah bagus — pertahankan pola ini), `CreatePostInput`, `CreatePostModal` (komposer paling matang di repo), `useInfiniteFeed` (perluas, jangan tulis ulang), `setPostLike` + CSRF flow.
- **Ikon:** `lucide-react` konsisten di semua permukaan.
- **State:** `zustand` (`store/ui.ts`), `@tanstack/react-virtual` **sudah di dependencies tapi belum dipakai** → kandidat virtualisasi feed panjang. `framer-motion` ada tapi tak dipakai di beranda → kandidat animasi world-class.
- **Keamanan:** `lib/rate-limit.ts` (Upstash + fallback memori), `lib/api-error.ts` (format error konsisten `{error:{code,message,requestId}}`), `lib/security/rate-limit.ts` (middleware), `lib/dal.ts` (`requireUser`/`requireRole`).
- **Analytics:** `lib/analytics/events.ts` + tabel `analytics_events` — katalog 12 event **tanpa satu pun event feed** (`post_created`, `post_liked`, `comment_created` belum ada; `report_content` mendukung `target_type: 'post'` → pakai untuk fitur Laporkan).
- **i18n:** `lib/i18n` + `getLabels(language)` (sidebar sudah multi-bahasa; beranda masih hardcode id-ID).

### 4.3 Contract test yang mengunci perilaku (jangan dilanggar redesign)
`test/next-route-contract.test.js` menegaskan secara statis:
- `page.tsx` me-render `BerandaPageClient`; `page-client.tsx` mengandung `CreatePostInput onCreate={openComposer}`, baca `?compose=` via `URLSearchParams`.
- `CreatePostInput` memanggil `onCreate?.('reel')`; `CreatePostModal` menangani `postType === 'reel'`.
- `StoriesSection` **dilarang** mengandung nama demo (`Aulia|UMKM Sultra|Cerita Kendari|Wakatobi`).
- `useSessionProfile` memakai `getProfileNickname`, kolom `username`/`display_name`/`city`, `recipient_id` + `profile_id` (keduanya di-assert!).
- `CreateMenu` mengarah ke `/beranda?compose=${type}`.

---

## 5. Temuan (prioritas)

### P0 — Rusak / melanggar kebijakan produksi

- **F1. Count & status like tidak pernah terisi.** `app/api/feed/route.ts` SELECT tidak menyertakan `likes_count`, `comments_count`, `liked`; `hooks/useInfiniteFeed.ts:17` memetakan `Number(post.likes_count || 0)` → selalu 0, `liked: Boolean(post.liked)` → selalu false. Dampak: seluruh feed menampilkan "0 suka / 0 komentar", tombol like tak pernah menunjukkan state server. Interaksi like (POST) sebenarnya tersimpan, tapi tak terlihat. **Perbaikan:** perluas respons feed (subquery count + cek likes per user) atau RPC `get_feed_with_counts`.
- **F2. Data palsu hardcoded di produksi.** `components/beranda/RightSidebar.tsx:2-3`: properti "Nirwana Residence"/"The Coast Villa", `phone: '628123456789'` (dipakai membangun link `wa.me`), kontak "Ayu Rahma/Fajar Kendari/Mira Wakatobi" + "3 online". Melanggar D-07/decisions Fase 0. **Perbaikan:** ganti dengan widget data nyata (properti dari tabel `properties`/listings, atau hapus widget sampai ada data).

### P1 — Fitur hilang / UI mati

- **F3. Komentar tidak ada.** `page-client.tsx` → `onComment` hanya `setNotice('Komentar akan hadir pada pembaruan berikutnya…')`. Tabel `comments` + RLS + realtime publication sudah siap sejak `20260913000000`, tapi **tidak ada route `/api/comments`** (isi `app/api/`: billing, cron, csrf, feed, health, interactions, listings, profile, referral, security). Social feed tanpa komentar bukan kelas dunia.
- **F4. Stories non-fungsional.** `StoriesSection` statis; tidak ada tabel `stories` di 54 migrasi; tombol "Buat cerita" membuka komposer post biasa (menyesatkan).
- **F5. Filter kategori mati.** `page-client.tsx`: `const [category, setCategory] = useState('Semua')` — nilai `category` hanya dipakai untuk kelas `is-active`; tidak dikirim ke `/api/feed`, tidak memfilter client. 7 tombol tanpa efek.
- **F6. Follow/unfollow tidak ada.** `follows` hanya dibaca untuk filter `following`; tidak ada API maupun tombol follow di `FeedPost`/profil ringkas. Filter "Mengikuti" untuk anonim → 401 dengan pesan mentah `Masuk untuk melihat feed mengikuti.` (bukan CTA login yang baik).

### P2 — Bug & risiko kualitas

- **F7. Pesan "silakan login" pada like tidak pernah muncul.** `page-client.tsx` memeriksa `caught.message === 'authentication_required'`, tetapi API mengembalikan `{error:{code:'UNAUTHORIZED', message:'Sesi login diperlukan.'}}` sehingga `apiErrorMessage` menghasilkan `'Sesi login diperlukan.'` ≠ `'authentication_required'`. Pengguna anonim yang menekan Suka mendapat "Interaksi belum dapat disimpan." (generik).
- **F8. Dark mode tidak didukung konten beranda.** 0 aturan `.dark .beranda*` di `globals.css`; komponen beranda aktif tidak memakai kelas `dark:`. Toggle tema (didukung shell + tersimpan) menghasilkan halaman belang.
- **F9. Bookmark hanya `localStorage`** (`suki-saved-posts` di `FeedPost.tsx`) — tidak sinkron antar perangkat, hilang bila ganti browser; tidak ada tabel server.
- **F10. Query notifikasi memakai kolom yang tidak ada.** `useSessionProfile.ts` query `notifications(profile_id, is_read)` — skema kanonis `recipient_id`/`read_at` — sehingga selalu error sekali lalu fallback; 1 roundtrip sia-sia tiap hydrate. (Contract test meng-assert kedua nama kolom ada — perbaiki skema/test bersamaan.)
- **F11. "Untuk Anda" = "Terbaru".** Filter `recommended` dan `latest` menjalankan query identik (order `created_at` desc); `rankingVersion: 'baseline-v1'` dekoratif. Filter `following` mengecualikan postingan diri sendiri (mungkin tidak diinginkan).
- **F12. `relativeTime` usang untuk posting lama:** hanya menit/jam → posting 3 hari tampil "72 jam lalu" selamanya.
- **F13. Komponen duplikat/mati membingungkan:** `components/feed/*`, `components/stories/*`, `LeftSidebar/TopNavBar/TagToolRow/MediaActionIcon/SultraKitaUiUpgrade` di `components/beranda/` — nol import. Risiko overhaul menyentuh file yang salah.

### P3 — Kecil / tech-debt

- **F14. Metadata ganda:** `app/beranda/layout.tsx` vs `page.tsx` mendefinisikan title/description mirip tapi berbeda (page menang) — rawan drift SEO.
- **F15. Tanpa tipe DB generated:** tidak ada `lib/database.types.ts`; `getServerSupabase()` untyped → drift skema hanya tertangkap runtime/contract-test.
- **F16. `/reels` fallback demo** (`app/reels/page.tsx:5`): video MDN + `likes_count: 128` fiktif — relevan karena filter feed "Video" mengarah ke konten `type='reel'`.
- **F17. `loading.tsx` tidak menyerupai layout v4** (skeleton 3 kartu generik) → flash layout saat navigasi.
- **F18. Aksi hero placeholder:** "Ganti lokasi" hanya notice; search hero me-redirect ke `/marketplace?search=` (bukan pencarian dalam feed/komunitas).
- **F19. Tombol "⋯" tiap postingan tanpa menu** (Laporkan/Sembunyikan/Salin tautan belum ada) — padahal event analytics `report_content` sudah mendukung `target_type: 'post'`.

### Yang SUDAH bekerja (jangan dirusak overhaul)
1. SSR hero + ISR 120 dtk + metadata SEO/OG/canonical (`page.tsx`, `lib/beranda-data.ts`).
2. Infinite scroll: sentinel IntersectionObserver `rootMargin 480px`, cursor HMAC bertanda tangan & terikat filter, dedup by id, abort saat ganti filter, error state + "Coba lagi", pesan akhir feed.
3. Komposer `CreatePostModal`: privasi, mood terkontrol, lokasi, tag warga (≤10, tervalidasi server), upload ≤4 media via R2 presigned, draft lokal, idempotency key, pesan error id-ID yang ramah.
4. Like/unlike: CSRF double-submit, idempoten, rate limit 2 lapis, pesan sukses/gagal via notice.
5. RLS posts/likes/comments/follows yang ketat + tidak membocorkan error DB (kontrak `lib/api-error.ts`).
6. Navigasi global (`AppLayout` + `?compose=` deep-link + `CreateMenu`) dan proteksi rute publik vs privat di middleware.
7. Avatar masking mengikuti `visibility_settings` di `/api/feed`.

---

## 6. Rekomendasi arsitektur untuk overhaul

### 6.1 PAKAI ULANG (jangan tulis ulang)
| Aset | Alasan |
|---|---|
| `AppLayout` + Header/QuickNavBar/Sidebar | Navigasi terkonsolidasi; QuickNavBar pertimbangkan migrasi ke `<Link>` (saat ini full reload). |
| Kontrak `GET /api/feed` + cursor HMAC v1 | Stabil, aman, teruji; **perluas** respons (counts + `liked`), jangan ganti format. |
| `createPost` + validasi `lib/actions/posts.ts` | Server action matang; tambah rate limit per-user bila belum. |
| `CreatePostModal` | Komposer terbaik di repo; tambah opsi "jadwalkan"? di luar scope. |
| Pola `ViewportVideo` di `FeedPost` | Autoplay ambang + reduced-motion sudah benar; ekstraksi jadi komponen bersama. |
| `lib/preferences.tsx`, tokens.css, `lib/api-error.ts`, `lib/rate-limit.ts`, CSRF flow | Fondasi lintas halaman. |
| `useInfiniteFeed` | Perluas dengan `initialItems` dari SSR (first page di-render server → LCP/SEO feed), bukan tulis ulang. |

### 6.2 BANGUN BARU
1. **`GET/POST/DELETE /api/comments`** — thread komentar per post (cursor pagination), memakai tabel `comments` yang sudah ada; kirim notifikasi ke author post (tabel `notifications` siap).
2. **Perluasan `/api/feed`** — sertakan `likes_count`, `comments_count`, `liked` (subquery agregat atau RPC `get_feed_page`), agar F1 selesai tanpa N+1 di client.
3. **`/api/follow` + tombol Ikuti** di kartu postingan & hover profil; perbaiki RLS `posts` agar `privacy='followers'` benar-benar dibaca follower (TODO di migrasi `20260916000000`).
4. **Tabel `saved_posts`** (ganti `localStorage` F9) + filter "Tersimpan".
5. **Stories: putuskan** — bangun MVP (`stories` table, TTL 24 jam, viewer fullscreen) atau hapus `StoriesSection` sampai siap; jangan biarkan placeholder.
6. **Ranking `recommended`** — mulai dari sinyal sederhana (resensi: like/komen velocity + follow graph + lokalitas `district`) sebelum ML; pertahankan `rankingVersion` sebagai kontrak.
7. **Event analytics feed** — `post_created`, `post_viewed` (sampling), `post_liked`, `comment_created`, `feed_filter_changed` di `lib/analytics/events.ts`.
8. **Menu "⋯" postingan** — Laporkan (→ `report_content`), Sembunyikan, Salin tautan, Blokir author (tabel `user_blocks` sudah ada dari `20260831000001_user_blocks.sql`).
9. **Pencarian dalam feed/komunitas** — hero search saat ini lari ke marketplace; overhaul butuh scope search yang jelas.
10. **Tipe DB generated** — `supabase gen types` → `lib/database.types.ts`; jadikan `getServerSupabase<Database>()`.

### 6.3 HAPUS / GANTI
- `RightSidebar` hardcoded → widget data nyata (properti terbaru dari `properties`, event komunitas, atau "warga untuk diikuti" dari graph) atau hapus.
- Komponen mati: `components/feed/*`, `components/stories/*`, `LeftSidebar/TopNavBar/TagToolRow/MediaActionIcon/SultraKitaUiUpgrade` (arsipkan/hapus setelah overhaul stabil).
- Filter kategori: sambungkan ke query (`?category=` → kolom kategori/tag di posts) atau hapus dari UI.
- Fallback demo `/reels` → empty state jujur.

### 6.4 Migrasi styling (bertahap, tanpa big-bang)
1. Bungkus area feed baru dengan token `--suki-*` (spacing/radius/shadow/motion sudah didefinisikan, belum dipakai beranda).
2. Tambahkan varian dark untuk semua kelas `beranda-*`/`feed-*`/`create-post-*` (atau migrasi ke kelas `dark:` Tailwind) — selesaikan F8 sebelum klaim "dark mode didukung".
3. Selaraskan `loading.tsx` dengan layout v4 (skeleton kartu feed + rail).
4. Jaga satu sumber metadata (hapus duplikat di `layout.tsx` atau jadikan template).

### 6.5 Kontrak yang wajib dipertahankan overhaul
- Format respons `/api/feed` + cursor HMAC v1 + nama filter (kompatibilitas client lama/contract test).
- `POST/DELETE /api/interactions` + header `X-CSRF-Token` + idempotency.
- Wiring yang di-pin `test/next-route-contract.test.js` (lihat §4.3) — jalankan `npm test` tiap iterasi.
- RLS: feed publik tanpa login; tulis selalu butuh sesi; tidak ada demo data di produksi.
- ISR hero 120 dtk + pola `initialProducts/initialEvents` (siap diperluas ke `initialFeedItems`).

---

## Lampiran: file kunci (path absolut)

**Route & page**
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/app/beranda/page.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/app/beranda/page-client.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/app/beranda/layout.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/app/beranda/loading.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/app/layout.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/middleware.ts`

**Komponen beranda**
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/components/beranda/FeedPost.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/components/beranda/CreatePostModal.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/components/beranda/CreatePostInput.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/components/beranda/StoriesSection.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/components/beranda/RightSidebar.tsx`

**Data & API**
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/hooks/useInfiniteFeed.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/lib/feed-interactions.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/lib/beranda-data.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/lib/beranda-types.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/lib/actions/posts.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/actions/upload.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/app/api/feed/route.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/app/api/interactions/route.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/app/api/csrf/route.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/app/api/listings/route.ts`

**Migrasi skema sosial**
- `/home/hatch/workspace/worktrees/sultrakita-beranda/supabase/migrations/20260913000000_beranda_social_feed.sql`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/supabase/migrations/20260916000000_live_social_posts.sql`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/supabase/migrations/20260911232118_create_post_metadata.sql`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/supabase/migrations/20260829100000_social_beta.sql`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/supabase/migrations/20260913060000_suki_community_interactions.sql`

**Desain, auth, navigasi, kontrak**
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/app/globals.css`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/design-system/tokens.css`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/tailwind.config.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/lib/preferences.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/lib/supabase/server.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/lib/supabase/client.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/hooks/useSessionProfile.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/components/layout/AppLayout.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/components/layout/Header.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/components/layout/QuickNavBar.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/components/layout/SidebarDesktop.tsx`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/lib/analytics/events.ts`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/test/next-route-contract.test.js`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/docs/DECISIONS.md`
- `/home/hatch/workspace/worktrees/sultrakita-beranda/next-app/package.json`

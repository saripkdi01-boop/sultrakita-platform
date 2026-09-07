# Checklist Audit Pasca-Upgrade SultraKita / SUKI

**Tanggal:** 7 September 2026  
**Repository:** `saripkdi01-boop/sultrakita-platform`  
**Production:** [sultrakita-platform.vercel.app](https://sultrakita-platform.vercel.app/)  
**Basis evaluasi:** Audit Mendalam SultraKita / SUKI terlampir dan seluruh perubahan yang telah diimplementasikan serta diverifikasi pada repository sampai commit `2aec6c3`.

## 1. Kesimpulan Status

Upgrade yang dikerjakan pada sesi ini berhasil memperkuat **AI Listing Assistant**, menyelesaikan error runtime server action di halaman create property, menambahkan telemetry AI yang privacy-safe, dan menambahkan mekanisme feedback seller. Deployment production yang terkait sudah berstatus **READY**, dan regression test, type-check, production build, serta QA browser pada fallback AI telah berhasil.

Hasil ini belum berarti seluruh temuan audit platform telah selesai. Temuan besar tentang public-read policy, konsolidasi runtime, verifikasi database production, OAuth provider, storage, mobile QA lintas modul, dan aktivasi workflow operasional masih memerlukan pekerjaan terpisah.

| Status | Arti |
|---|---|
| ✅ Selesai dan terverifikasi | Implementasi tersedia, diuji, dan bukti hasilnya tercatat. |
| ◐ Selesai sebagian | Ada implementasi atau hardening, tetapi acceptance criteria audit belum lengkap. |
| ☐ Belum selesai | Belum ada bukti implementasi/validasi yang cukup pada sesi ini. |
| — Di luar kontribusi sesi | Fitur ada di source atau konektor tersedia, tetapi tidak diubah atau belum diverifikasi sebagai runtime production. |

## 2. Checklist Kontribusi yang Sudah Berhasil

| Checklist | Status | Bukti dan catatan |
|---|---:|---|
| AI Listing Assistant terpasang pada form `/properti/create`. | ✅ | Assistant muncul setelah input foto utama. |
| Validasi MIME JPG, PNG, dan WebP dilakukan sebelum request AI. | ✅ | Format lain ditolak di client dan server. |
| Batas ukuran foto 8 MB dipertahankan. | ✅ | Input di atas 8 MB ditolak sebelum proses AI. |
| Fallback tanpa `GEMINI_API_KEY` tetap aman. | ✅ | Seller diarahkan mengisi form manual; tidak ada data listing palsu. |
| Fallback quota/rate-limit memiliki pesan berbeda. | ✅ | Error diklasifikasikan sebagai quota/rate-limit. |
| Fallback provider unavailable memiliki pesan berbeda. | ✅ | Error provider diarahkan ke mode manual. |
| Response JSON AI yang invalid tidak mengisi listing. | ✅ | Response divalidasi dan dibuang bila tidak memenuhi schema. |
| AI tidak dapat auto-publish listing. | ✅ | AI hanya mengisi draft; seller tetap memeriksa dan submit manual. |
| Mapping kategori AI ke kategori property aman. | ✅ | Nilai `Properti` dipetakan ke `rumah_sewa`; nilai lain tidak menimpa pilihan property seller. |
| Status assistant accessible. | ✅ | `aria-live`, `aria-busy`, status loading, dan error announcement tersedia. |
| Telemetry generation AI privacy-safe. | ✅ | Event hanya memuat outcome, reason terbatas, model, dan durasi. |
| Telemetry tidak menyimpan payload sensitif. | ✅ | Tidak mencatat foto, base64, prompt, output AI, URL storage, API key, identitas seller, atau raw provider error. |
| Server action AI kompatibel dengan Next.js `'use server'`. | ✅ | Export non-function di `ai-listing.ts` dihapus. |
| Server action property kompatibel dengan Next.js `'use server'`. | ✅ | `propertySchema` dan `PropertyInput` dijadikan internal; error runtime production terselesaikan. |
| Feedback seller tersedia setelah draft AI berhasil. | ✅ | Seller dapat memilih “Ya, membantu” atau “Perlu perbaikan”. |
| Komentar feedback dibatasi. | ✅ | Komentar opsional dibatasi maksimal 1.000 karakter. |
| Submit feedback idempotent. | ✅ | Satu feedback per seller dan generation UUID; submit duplikat tidak menggagalkan UI. |
| Feedback tidak menyimpan hasil AI atau foto. | ✅ | Tabel hanya menyimpan metadata feedback dan label field koreksi. |
| RLS feedback seller tersedia. | ✅ | Seller hanya dapat insert/read feedback miliknya sendiri. |
| Regression test AI dan feedback tersedia. | ✅ | `npm run test:ai-listing` berhasil. |
| Type-check production berhasil. | ✅ | `cd next-app && npx tsc --noEmit` berhasil. |
| Production build berhasil. | ✅ | `cd next-app && npm run build` berhasil. |
| QA production halaman create property berhasil. | ✅ | Deployment `dpl_APBr6iYbVs6NiiPRsFcixxLgbBvY` READY; fallback Generate diuji tanpa 500. |
| Runtime logs production bersih setelah QA. | ✅ | Tidak ada error/fatal runtime pada rentang pemeriksaan. |
| Browser console bersih setelah QA. | ✅ | Tidak ada output error pada console browser. |

## 3. Checklist Temuan Audit Platform

### 3.1 Runtime dan deployment

| Checklist audit | Status | Tindak lanjut |
|---|---:|---|
| Vercel production menggunakan Next.js sebagai runtime aktif. | ◐ | Live production dan deployment menunjukkan Next.js aktif. Root Directory perlu dikunci dan didokumentasikan sebagai kebijakan resmi. |
| Tidak ada pengembangan fitur baru paralel di Express legacy dan Next.js. | ◐ | Perubahan sesi ini diarahkan ke Next.js; Express legacy masih ada dan belum dipensiunkan. |
| Root Directory Vercel, env, domain, dan commit dapat dibuktikan. | ◐ | Deployment dan commit dapat dibuktikan; verifikasi seluruh env production masih diperlukan. |
| Deployment terbaru memiliki status READY. | ✅ | Deployment F2.4 `dpl_APBr6iYbVs6NiiPRsFcixxLgbBvY` READY. |
| Build error production kosong. | ✅ | Vercel build selesai tanpa error. |
| Runtime error production kosong setelah QA AI. | ✅ | Tidak ada error/fatal pada runtime logs. |

### 3.2 Route, public access, dan product policy

| Checklist audit | Status | Tindak lanjut |
|---|---:|---|
| Homepage dapat diakses publik. | ✅ | Live check sebelumnya menghasilkan HTTP 200. |
| Route `/properti` dapat dibaca publik sesuai product intent. | ☐ | Audit menemukan redirect ke login. Tetapkan apakah katalog dan detail bersifat public-read atau memang authenticated-read. |
| `/marketplace`, `/chat`, `/jobs`, `/groups`, `/reels`, dan `/support` memiliki policy akses yang terdokumentasi. | ☐ | Buat matriks public-read, authenticated-read, dan authenticated-write per route. |
| Auth wall tidak menghalangi discovery yang memang dimaksudkan publik. | ☐ | Tampilkan contoh listing, kategori, wilayah, bantuan, dan legal content bila product policy mengizinkan. |
| Endpoint production tidak memanggil API legacy yang 404. | ◐ | AI/property create memakai Server Action Next.js; audit endpoint platform secara keseluruhan masih diperlukan. |
| `/api/listings` memiliki kontrak production resmi. | ◐ | Endpoint tersedia dan merespons demo/fallback data; source of truth catalog production masih perlu diverifikasi. |
| `/api/categories`, `/api/properties`, dan `/api/auth/me` tidak menjadi dependency frontend production. | ☐ | Audit menyatakan endpoint tersebut 404 di production; lakukan static dependency check dan tetapkan kontrak pengganti. |

### 3.3 Data, Supabase, RLS, dan migration

| Checklist audit | Status | Tindak lanjut |
|---|---:|---|
| Supabase menjadi source of truth untuk entity production yang dipilih. | ◐ | Digunakan oleh Server Action; matriks entity dan owner belum lengkap. |
| Migration AI feedback sudah dibuat. | ✅ | `supabase/migrations/20260907000000_ai_listing_feedback.sql`. |
| Migration AI feedback sudah diaplikasikan ke staging. | ☐ | Staging terpisah belum tersedia/terverifikasi pada sesi ini. |
| Migration AI feedback sudah diaplikasikan ke production. | ✅ | Migration `ai_listing_feedback` berhasil diterapkan ke project `sultrakita-platform` production melalui Supabase connector. |
| RLS feedback seller sudah diverifikasi di production. | ✅ | RLS aktif; policy insert-own dan select-own terdeteksi. Anonymous REST read mengembalikan HTTP 200 dengan `[]`, tanpa data terekspos. |
| RLS feedback seller diuji dengan akun QA authenticated. | ◐ | Session seller production terdeteksi sebagai `Wan Shofir`/seller terverifikasi dan halaman create property dapat dibuka. Generate AI masuk ke fallback manual karena Gemini tidak menghasilkan draft; feedback control tidak muncul, tidak ada test row yang dimasukkan, dan database tetap memiliki 0 feedback rows. |
| Migration, seed, profile, listings, properties, dan support diuji bersama. | ☐ | Memerlukan database environment dan akun QA yang dapat diverifikasi. |
| Data demo dipisahkan dari data production. | ☐ | Audit menemukan seeded/demo content; tambahkan label atau pisahkan source data. |
| Feedback aggregate hanya tersedia melalui server/admin path terkontrol. | ✅ | Implementasi awal tidak menambahkan endpoint aggregate publik. |

### 3.4 Auth dan provider

| Checklist audit | Status | Tindak lanjut |
|---|---:|---|
| Signup dan login password diuji dengan akun QA. | ☐ | Belum diverifikasi end-to-end pada sesi ini. |
| Google OAuth callback, redirect, dan error state diuji. | ☐ | Verifikasi dengan credential/provider production. |
| Facebook OAuth diuji bila tetap digunakan. | ☐ | Pastikan provider memang aktif atau tandai sebagai coming soon. |
| Seller session diteruskan dengan benar ke Server Action. | ◐ | Berhasil menjadi fondasi action property/feedback; uji database authenticated flow masih diperlukan. |
| Secret provider tidak diekspos melalui `NEXT_PUBLIC_`. | ✅ | AI action memakai `GEMINI_API_KEY` server-side; tidak ditambahkan ke client bundle. |

### 3.5 Storage dan media

| Checklist audit | Status | Tindak lanjut |
|---|---:|---|
| Jalur storage production tunggal dipilih. | ☐ | Audit menemukan R2/S3-compatible dan fallback legacy; tetapkan satu kontrak resmi. |
| Upload menggunakan presigned/signed flow. | ◐ | Action upload tersedia di source; upload object storage production belum diverifikasi. |
| MIME dan ukuran divalidasi server-side. | ✅ | AI input memiliki validasi MIME dan 8 MB; validasi seluruh media platform belum selesai. |
| Magic bytes, thumbnail/CDN, lifecycle, dan virus/abuse policy diuji. | ☐ | Belum diverifikasi lintas modul. |
| Foto AI tidak disimpan oleh telemetry. | ✅ | Kontrak telemetry dan feedback tidak menyimpan foto/base64. |

### 3.6 UX, accessibility, dan mobile

| Checklist audit | Status | Tindak lanjut |
|---|---:|---|
| Visual identity homepage dan login konsisten. | ✅ | Audit live menilai fondasi visual sudah terarah dan polished. |
| AI assistant memiliki loading, error, success, dan manual fallback state. | ✅ | Seluruh state tersedia dan diuji production fallback. |
| Keyboard navigation dan focus order seluruh aplikasi diuji. | ☐ | Belum dilakukan secara menyeluruh. |
| Contrast dan reduced-motion diuji. | ☐ | Belum dilakukan secara menyeluruh. |
| Label form terhubung dan error announcement diuji. | ◐ | AI assistant memiliki label/status accessible; audit lintas form masih diperlukan. |
| QA mobile 375/390 px dilakukan. | ☐ | Belum diverifikasi live. |
| QA tablet 768 px dan desktop dilakukan lintas modul. | ◐ | Create property telah diuji desktop; lintas modul belum. |
| Sidebar drawer, top bar, feed, property card, modal, chat, dan create form diuji mobile. | ☐ | Jadwalkan functional QA per modul. |

### 3.7 Fitur inti selain AI Listing Assistant

| Checklist audit | Status | Tindak lanjut |
|---|---:|---|
| Property browse, filter, detail, gallery, inquiry, save, dan contact usable end-to-end. | ☐ | Audit mencatat route masih protected dan belum dapat diuji anonim. |
| Marketplace category/location contract stabil. | ◐ | Marketplace tersedia di source; kontrak kategori/lokasi production perlu difinalkan. |
| Chat realtime, unread, block/report, attachment, dan retention diuji. | ☐ | Belum diverifikasi pada sesi ini. |
| Jobs employer/applicant workflow diuji. | ☐ | Belum diverifikasi pada sesi ini. |
| Groups/events membership dan moderation diuji. | ☐ | Belum diverifikasi pada sesi ini. |
| Reels storage, transcoding, dan size limits diuji. | ☐ | Belum diverifikasi pada sesi ini. |
| Seller onboarding memiliki resume/draft/progress persistence. | ☐ | Audit mencatat flow masih panjang dan belum sempurna. |
| Support ticket, notification, admin queue, SLA, dan n8n staging workflow diuji. | ☐ | Konektor tersedia, tetapi execution aktif belum diverifikasi. |
| Security center revoke session, privacy checkup, blocked users, dan activity logs diuji. | ☐ | Belum diverifikasi pada sesi ini. |
| Admin authority dikonsolidasikan ke satu stack. | ☐ | Express legacy dan Next admin masih berpotensi permission drift. |
| Legal content memiliki versioning dan consent log. | ☐ | Route legal tersedia; versioning/consent audit belum diverifikasi. |

## 4. Checklist Integrasi Operasional

| Integrasi | Status | Acceptance criteria berikutnya |
|---|---:|---|
| Supabase | ◐ | Verifikasi project, migration, RLS, seed, profile, listing, property, support, dan realtime dengan akun QA. |
| Vercel | ✅ | Deployment F2.4 READY, build selesai, runtime logs bersih. Kunci Root Directory secara permanen. |
| Google Gemini | ◐ | Fallback dan security sudah diuji dalam session seller production; jalur successful generation dan feedback UI perlu diuji dengan key/quota production yang aktif. |
| R2/S3-compatible storage | ☐ | Tetapkan provider tunggal, signed upload, CDN, lifecycle, dan abuse limits. |
| Resend | ◐ | Flow inquiry notification tersedia di source; domain, template, delivery, retry, dan observability belum diverifikasi menyeluruh. |
| n8n | ☐ | Workflow blueprint tersedia; credential, import, idempotency, staging execution, dan monitoring belum diverifikasi. |
| Telegram Bot | ☐ | Credential, bot/chat ID, webhook, dan internal API protection belum diverifikasi. |
| WhatsApp | ☐ | Jangan mengklaim notifikasi otomatis sebelum provider resmi, opt-in, template, signature, dan rate limit diuji. |
| Google OAuth | ☐ | Uji callback, redirect URI, consent, dan error state dengan akun QA. |
| Facebook OAuth | ☐ | Uji atau nonaktifkan secara eksplisit jika belum menjadi provider production. |
| Sentry/observability | ☐ | Audit merekomendasikan error tracing, latency, webhook failures, dan provider failures; belum terlihat aktif. |
| GitHub | ✅ | Repository dipakai sebagai source control; branch `main` sinkron dan commit telah dipush. |
| Manus Vercel connector | ✅ | Dipakai untuk inspeksi deployment dan runtime/build logs. |
| Manus Supabase connector | ◐ | Tersedia untuk operasi; migration feedback belum diaplikasikan melalui sesi ini. |

## 5. Checklist Test dan Security Sign-Off

| Checklist | Status | Bukti atau pekerjaan tersisa |
|---|---:|---|
| Regression AI Listing Assistant. | ✅ | `npm run test:ai-listing` passed. |
| Type-check Next.js. | ✅ | `npx tsc --noEmit` passed. |
| Production build Next.js. | ✅ | `npm run build` passed. |
| Static check feedback action hanya mengekspor async function. | ✅ | Export contract telah diperiksa. |
| Diff whitespace check. | ✅ | `git diff --check` passed sebelum push. |
| Vercel build log. | ✅ | Build completed tanpa error. |
| Vercel runtime log setelah QA. | ✅ | Tidak ada error/fatal. |
| Browser console setelah QA. | ✅ | Tidak ada console output. |
| Full root test suite sesuai audit. | ◐ | Audit sebelumnya mencatat 69 pass, 0 fail, 7 skip; ulangi setelah migration F2.4 diterapkan. |
| `npm audit` high severity dependency triage. | ☐ | Audit mencatat 2 high severity pada `next-app`; triase path/package dan lakukan upgrade terkontrol. Jangan menjalankan `npm audit fix --force` tanpa review. |
| Authenticated database integration test. | ☐ | Memerlukan staging database dan akun QA. |
| Storage upload integration test. | ☐ | Memerlukan object storage environment yang aktif. |
| OAuth provider test. | ☐ | Memerlukan credential/provider yang valid. |
| n8n, WhatsApp, Telegram, email delivery test. | ☐ | Memerlukan credential dan environment staging. |
| Backup/restore drill. | ☐ | Ikuti staging runbook; jangan lakukan restore drill langsung di production. |

## 6. Urutan Pekerjaan yang Direkomendasikan

### P0 — Sebelum public pilot

- [ ] Kunci `next-app` sebagai satu-satunya runtime production dan hentikan penambahan fitur paralel di Express legacy.
- [ ] Tetapkan public-read policy untuk `/properti`, marketplace, detail listing, help center, dan legal pages.
- [ ] Buat matriks kontrak route/action yang berisi auth requirement, input/output schema, owner, migration, environment, dan smoke test.
- [ ] Terapkan migration AI feedback ke staging, uji RLS own/cross-seller, lalu terapkan ke production setelah sign-off.
- [ ] Verifikasi akun QA, session, Supabase project, RLS, seed/demo separation, dan property/listing data.
- [ ] Uji password login, forgot password, Google OAuth, dan Facebook OAuth bila dipakai.
- [ ] Pisahkan seeded/demo content dari data production atau beri label yang tegas.
- [ ] Jalankan mobile QA pada 390 px, 768 px, dan desktop, termasuk keyboard, focus, contrast, ARIA, dan reduced motion.
- [ ] Triase dua high severity vulnerability dari `next-app` secara terkontrol.

### P1 — Menjadikan modul usable end-to-end

- [ ] Selesaikan public property discovery, filter, detail, gallery, inquiry, save, seller contact, create/edit/draft/publish.
- [ ] Selesaikan marketplace category/location contract, cart/checkout, order/review, dan seller verification.
- [ ] Selesaikan support ticket, notification, admin queue, status update, SLA, dan n8n staging workflow.
- [ ] Selesaikan chat realtime reliability, unread, block/report, attachment policy, dan retention.
- [ ] Selesaikan seller onboarding dengan progress persistence, resume, draft, upload preview, dan AI suggestion optional.
- [ ] Pilih satu admin authority dan hilangkan permission drift antara Express dan Next.

### P2 — Growth dan operational excellence

- [ ] Tambahkan funnel analytics dari landing → property view → inquiry → signup → publish/transaction.
- [ ] Stabilkan event schema sebelum mengaktifkan Customer.io lifecycle automation.
- [ ] Tambahkan observability untuk latency, provider failure, webhook failure, dan rate-limit telemetry.
- [ ] Jalankan backup/restore drill dan uptime monitoring.
- [ ] Selesaikan SEO public category/property pages, canonical URL, Open Graph, sitemap, dan crawl policy.

## 7. Bukti Implementasi Utama

| Bukti | Nilai |
|---|---|
| Commit perbaikan server action property | `034078d fix: keep property schema server-only` |
| Commit telemetry AI | `8940c2d feat: add privacy-safe AI listing telemetry` |
| Commit feedback loop F2.4 | `2aec6c3 feat: add privacy-safe AI listing feedback loop` |
| Deployment AI/property runtime fix | `dpl_7yXHzYGbcCVtiFRy2Pao4Une5giv` — READY |
| Deployment F2.4 feedback loop | `dpl_APBr6iYbVs6NiiPRsFcixxLgbBvY` — READY |
| Regression command | `npm run test:ai-listing` — passed |
| Type-check command | `cd next-app && npx tsc --noEmit` — passed |
| Build command | `cd next-app && npm run build` — passed |
| Production route QA | `/properti/create` — assistant dan fallback manual tampil |
| Production runtime QA | Tidak ada error/fatal runtime setelah Generate fallback |

## 8. Catatan Batas Validasi

Checklist ini membedakan **implementasi source**, **verifikasi production**, dan **validasi environment eksternal**. Status ✅ pada AI Listing Assistant tidak boleh ditafsirkan sebagai bukti bahwa Gemini successful generation, database migration, storage upload, OAuth, n8n, WhatsApp, Telegram, email delivery, atau payment provider sudah teruji. Semua area tersebut tetap membutuhkan credential, environment, dan akun QA yang sesuai.

## References

[1]: https://github.com/saripkdi01-boop/sultrakita-platform "SultraKita Platform GitHub repository"

[2]: https://sultrakita-platform.vercel.app/ "SultraKita production deployment"

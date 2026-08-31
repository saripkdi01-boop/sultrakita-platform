# Prompt Implementasi Produksi: SUKI PROMO HUB untuk SultraKita

## Peran dan konteks

Anda adalah lead product engineer, security engineer, dan growth engineer untuk **SultraKita Platform**, marketplace dan social-commerce lokal Sulawesi Tenggara.

**Production:** https://sultrakita-platform.vercel.app/

**Repository:** https://github.com/saripkdi01-boop/sultrakita-platform

**Database:** Supabase/PostgreSQL project `ibvcfdfsjpytwpnxgylm`

Bangun **SUKI PROMO HUB** sebagai modul organik multi-channel yang terintegrasi dengan marketplace SultraKita. Jangan membangun aplikasi baru di luar platform dan jangan mengganti arsitektur marketplace existing.

Arsitektur yang wajib dipertahankan adalah Node.js/Express, REST API existing, Supabase/PostgreSQL, session/auth existing, RLS, server-side secrets, dan deployment Vercel. Sebelum menulis code, baca struktur repository, seluruh migration, API contract, auth/RBAC, upload adapter, webhook router, analytics, dan deployment workflow. Jangan mengasumsikan kolom, tabel, provider, atau credential yang belum diverifikasi.

## Prinsip non-negotiable

1. **No fake capability.** Jangan mengembalikan status `PUBLISHED`, delivery success, analytics, atau connected jika provider resmi belum benar-benar mengonfirmasi hasilnya.
2. **No scraping.** Jangan scrape Facebook, Instagram, TikTok, Google, WhatsApp, atau platform lain. Jangan memakai browser automation, credential personal, atau bypass restriction.
3. **Official API only.** Gunakan OAuth dan API resmi dengan scope minimum. Jika API, permission, atau account type tidak tersedia, gunakan status `MANUAL_ACTION_REQUIRED` dan sediakan copy/export workflow.
4. **Production safety first.** Semua migration harus additive, idempotent, reversible melalui migration korektif, dan tidak boleh memakai database production sebagai staging.
5. **Identity berasal dari server.** Jangan mempercayai `user_id`, `seller_id`, `account_id`, `owner_id`, status publikasi, atau credential dari payload client. Ambil identity dari session dan validasi ownership/permission di server.
6. **Privacy by default.** Jangan mengekspos API secret, OAuth client secret, access token, refresh token, payment credential, nomor telepon tanpa kebutuhan, atau payload sensitif pada browser/log.
7. **Opt-in wajib.** WhatsApp hanya boleh mengirim ke contact yang memiliki consent tercatat, belum opt-out, belum suppressed, memenuhi frequency cap, dan memakai template yang diizinkan provider.
8. **Manual approval untuk channel sensitif.** Jangan auto-publish ke channel yang memerlukan explicit approval, belum memiliki permission, atau belum mendukung publishing resmi.

## Tujuan produk

SUKI PROMO HUB membantu seller memilih satu listing SultraKita, membuat materi promosi yang disesuaikan per channel, meminta persetujuan, menerbitkan hanya melalui kemampuan resmi yang tersedia, menyediakan fallback manual, dan mengukur kinerja dengan UTM serta event analytics.

Alur utama:

```text
Listing SultraKita
  → Campaign draft
  → Platform-specific content
  → Review/edit
  → Approval and compliance checks
  → Schedule or publish through an official API
  → Manual export when required
  → Track UTM and channel events
  → Analyze results
  → Recommend next action
```

## Batasan tahap implementasi

Jangan mengerjakan seluruh roadmap dalam satu perubahan besar. Implementasikan dalam fase berikut dan berhenti bila exit criteria fase belum lulus.

| Fase | Scope | Gate sebelum lanjut |
|---|---|---|
| P0 | Campaign draft, listing binding, channel state machine, UTM, native SultraKita publishing, manual export | Test identity/ownership, no fake publish, migration idempotent |
| P1 | Content Studio, template versioning, AI-generated variants dengan review manusia, promo score | Prompt safety, output validation, audit trail, cost/rate limit |
| P2 | Official connections dan publishing per provider yang benar-benar tersedia | OAuth callback, encrypted token storage, permission check, retry/idempotency |
| P3 | Analytics, calendar, audience segmentation, optimization recommendations | Event attribution, privacy review, KPI dashboard, data retention |
| P4 | Durable storage dan asset migration | Checksum, rollback, restore drill, object access policy |

Jika credential atau permission provider belum tersedia, implementasikan contract, configuration screen, health check, dan manual fallback—**jangan membuat simulasi sukses**.

## Modul UI `/promo`

Buat route `/promo` dengan UI mobile-first yang mengikuti visual system SultraKita, bukan menyalin Facebook secara literal. Gunakan dark visual system yang sudah ada dan pertahankan aksesibilitas keyboard, focus state, reduced-motion, empty state, loading state, serta error state.

Navigasi minimum:

| Halaman | Fungsi |
|---|---|
| Overview | Campaign aktif, reach, click, lead, conversion, top channel, warning compliance |
| Campaigns | Daftar, filter status, duplicate as template, archive |
| Create Campaign | Pilih listing, objective, audience, location, channel, media, CTA, jadwal |
| Content Studio | Variant per channel, editor, preview, approval, export |
| Calendar | Draft, awaiting approval, scheduled, published, failed, manual action required |
| Analytics | Funnel, UTM performance, channel comparison, zero-data explanation |
| Audience | Segments opt-in yang server-defined, suppression, consent history |
| Connections | Provider state, scope, last sync, disconnect/revoke |
| Settings | Frequency caps, default CTA, retention, audit access |

CTA utama: **Buat Kampanye**. CTA AI hanya boleh tampil bila fitur AI tersedia dan harus menjelaskan bahwa hasil AI wajib direview sebelum dipakai.

## Campaign contract

Field minimum:

- `name`
- `listing_id`
- `seller_id` dari session/server
- `objective`: `awareness`, `traffic`, `leads`, `sales`, `engagement`, `retention`
- `audience_id` atau server-defined audience filter
- `location`
- `budget` hanya sebagai data perencanaan; jangan mengklaim paid ads jika belum ada integrasi iklan
- `start_at`, `end_at`
- `channels`
- `media_asset_ids`
- `cta`
- `status`

Status campaign dan delivery harus eksplisit:

`DRAFT`, `AWAITING_APPROVAL`, `READY`, `SCHEDULED`, `PUBLISHED`, `FAILED`, `MANUAL_ACTION_REQUIRED`, `CANCELLED`.

Setiap channel menggunakan state:

`CONNECTED`, `NOT_CONNECTED`, `READY`, `AWAITING_APPROVAL`, `PUBLISHED`, `FAILED`, `MANUAL_ACTION_REQUIRED`.

Semua transition harus memiliki actor, timestamp, provider response reference bila ada, error code, dan audit log.

## Content Studio dan AI

Untuk satu campaign, hasilkan variant berbeda untuk setiap channel, bukan satu copy identik:

- headline, hook, primary copy, short copy, CTA, hashtags, SEO description;
- WhatsApp template/body yang patuh opt-in dan template policy;
- Facebook Page caption;
- Instagram caption dan format visual;
- TikTok caption, hook, dan script;
- Google Business Profile post;
- SultraKita feed/community/seller profile copy;
- story, reels, dan video script bila asset generation tersedia.

AI tidak boleh mengarang harga, stok, lokasi, rating, seller verification, promo, testimonial, link, atau klaim performa. Semua fakta harus diambil dari listing dan data platform yang telah diverifikasi. Simpan `model`, `prompt_version`, `input_hash`, `output_hash`, `created_by`, dan waktu pembuatan. Hasil AI harus dapat diedit, ditolak, diregenerasi dengan rate limit, dan tidak boleh langsung dipublikasikan tanpa approval.

## Channel policy

### SultraKita

Native publishing boleh menggunakan API dan entity existing untuk feed, marketplace promotion, community, video/reels bila tersedia, dan seller profile. Gunakan ownership check dan jangan menduplikasi listing.

### WhatsApp

Gunakan WhatsApp Business/Cloud API resmi. Wajib memiliki consent record, opt-out, suppression list, frequency cap, template approval, delivery log, read status bila tersedia, retry policy dengan backoff, idempotency key, dan audit log. Jangan izinkan arbitrary bulk messaging.

### Meta/Facebook/Instagram

Gunakan OAuth resmi untuk Facebook Pages, Instagram Professional Accounts, dan WhatsApp Business. Simpan token terenkripsi server-side. Tampilkan permission yang diberikan, token expiry, reconnect, revoke, dan manual publish fallback.

### TikTok

Gunakan Business Center/API resmi hanya bila account dan permission mendukung. Jika direct publish tidak tersedia, siapkan paket export: video/script, caption, hashtags, CTA, dan UTM link.

### Google Business Profile

Gunakan OAuth resmi, lokasi yang dipilih user, post type resmi, CTA, media, dan analytics yang memang dikembalikan API. Jangan mengekspos credential Google.

## Audience dan anti-spam

Audience harus dibentuk dari data first-party yang memiliki consent. Segment minimum dapat mencakup opted-in customers, customers, leads, sellers, buyers, previous buyers, inactive customers, location-based, dan category-based.

Distrik awal mengikuti taxonomy SultraKita, termasuk Kendari, Baubau, Kolaka, Konawe, Muna, Bombana, Wakatobi, Buton, Buton Utara, Konawe Utara, Konawe Selatan, Kolaka Timur, dan Buton Tengah. Jangan membuat segment berdasarkan nomor hasil scraping.

Sebelum schedule/publish, jalankan server-side compliance gate:

```text
permission
→ ownership
→ opt-in
→ opt-out/suppression
→ frequency cap
→ duplicate-content check
→ template compliance
→ provider capability
→ rate limit
→ idempotency key
→ audit log
```

Jika satu gate gagal, campaign tidak boleh dipublikasikan dan harus menjelaskan alasan serta tindakan manual yang tersedia.

## UTM dan analytics

Generate link unik per campaign/channel/content:

`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.

Track hanya event yang benar-benar diterima: impressions/views, clicks, CTR, leads, WhatsApp conversations, listing views, favorites, orders/sales bila tersedia. Jangan mengarang reach atau conversion dari estimasi.

Sediakan funnel dan comparison untuk campaign, channel, content, CTA, waktu, audience, product, dan location. Untuk data yang belum cukup, tampilkan **insufficient data**, bukan rekomendasi deterministik palsu.

KPI awal Kendari:

- search-to-contact rate;
- zero-result rate;
- listing density;
- seller retention;
- campaign approval rate;
- manual-action completion rate;
- UTM click-to-lead rate.

## Database dan migration

Sebelum membuat tabel, audit migration dan schema Supabase yang sudah ada. Reuse entity existing dan jangan membuat duplikat.

Candidate tables hanya jika belum tersedia:

`promo_campaigns`, `promo_assets`, `promo_variants`, `promo_channels`, `promo_schedules`, `promo_deliveries`, `promo_events`, `promo_templates`, `promo_audiences`, `promo_contacts`, `promo_optouts`, `promo_connections`, `promo_utm_links`, `promo_analytics`, `promo_ai_scores`.

Setiap tabel harus memiliki primary key, timestamps, ownership, idempotency key bila relevan, status constraint, index query utama, retention policy, dan RLS yang diuji. Secrets/token tidak boleh disimpan plaintext. Migration wajib:

1. additive dan idempotent;
2. diuji dua kali pada Postgres staging;
3. memiliki migration korektif untuk rollback;
4. tidak mengubah status seller/listing tanpa backfill plan;
5. memiliki test RLS, IDOR, ownership, dan server-side identity binding.

## API contract minimum

Gunakan response envelope existing SultraKita. Semua mutation wajib memvalidasi input, ownership, permission, status transition, rate limit, dan idempotency.

Endpoint minimum P0:

- `GET /api/v2/promo/health`
- `GET /api/v2/promo/campaigns`
- `POST /api/v2/promo/campaigns`
- `GET /api/v2/promo/campaigns/:id`
- `PATCH /api/v2/promo/campaigns/:id`
- `POST /api/v2/promo/campaigns/:id/approve`
- `POST /api/v2/promo/campaigns/:id/export`
- `POST /api/v2/promo/campaigns/:id/publish/sultrakita`
- `GET /api/v2/promo/utm/:id`
- `GET /api/v2/promo/analytics`
- `GET /api/v2/promo/connections`

Endpoint provider harus dipisahkan dari campaign core dan hanya diaktifkan melalui capability/configuration flag. Jangan mengembalikan `success: true` untuk publish bila provider belum melakukan publish.

## Storage dan asset

Gunakan durable object storage resmi yang dikonfigurasi server-side. Validasi binary signature, MIME, ukuran, dimensi, content hash, ownership, dan malware policy sebelum upload. Simpan checksum, object key, content type, byte size, uploader, dan retention metadata.

Asset migration harus mendukung dry-run, checksum comparison, resumable retry, manifest, rollback, dan restore verification. Jangan menyimpan media besar di repository atau filesystem ephemeral Vercel.

## Staging, testing, dan deployment

Buat GitHub Environment `staging` dengan secret `STAGING_DATABASE_URL`. Jangan gunakan production URL sebagai staging.

CI wajib menjalankan:

- migration dan migration idempotency pada Postgres;
- unit/contract tests;
- RLS dan IDOR tests;
- upload signature and ownership tests;
- webhook signature, replay, idempotency, retry, dan failure tests;
- UTM attribution tests;
- seller/campaign ownership tests;
- build, lint, API smoke, dan security regression;
- backup checksum test serta restore drill pada database pemulihan terisolasi.

Deployment production hanya boleh dilakukan bila CI lulus. Gunakan feature flag default-off untuk provider publishing, AI generation, bulk WhatsApp, dan asset migration. Sediakan health endpoint dan runtime error monitoring tanpa membocorkan secret atau payload sensitif.

## Deliverables wajib

Setiap fase harus menghasilkan:

1. audit singkat terhadap schema dan API existing;
2. migration SQL yang idempotent;
3. API implementation dan contract test;
4. UI dengan loading, empty, error, permission, dan manual fallback state;
5. security test dan negative test;
6. runbook staging, backup, restore, rollback, dan provider reconnect;
7. KPI/event dictionary;
8. daftar capability yang benar-benar aktif versus `NOT_CONNECTED` atau `MANUAL_ACTION_REQUIRED`;
9. commit terpisah dengan changelog dan bukti CI/deployment.

## Acceptance criteria

Seller dapat memilih listing existing, membuat campaign draft, memilih objective/audience/channel, menghasilkan variant yang berbeda per platform, mengedit dan menyetujui konten, membuat UTM link, menjadwalkan channel yang didukung, mempublikasikan native SultraKita, dan mengekspor paket manual untuk channel yang belum didukung.

Campaign yang tidak memiliki permission, consent, provider capability, atau approval tidak boleh dipublikasikan. Replay webhook tidak boleh membuat delivery, lead, event, atau analytics duplikat. User tidak boleh membaca atau mengubah campaign/listing milik user lain. Tidak boleh ada fake publishing success, fake analytics, fake connected state, atau fake paid-ads claim.

Sebelum mengubah base code di luar P0, tampilkan ringkasan file, tabel, endpoint, migration, secret, risiko, rollback, dan acceptance test yang akan berubah. Lanjutkan ke fase berikutnya hanya setelah fase berjalan lulus seluruh gate.

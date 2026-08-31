# SUKI PROMO HUB P0 — Audit dan Runbook

## Ringkasan

P0 menambahkan modul `/promo` ke aplikasi Node.js/Express yang sudah ada. Perubahan ini **tidak mengganti marketplace**, tidak membuat provider eksternal palsu, dan tidak mengklaim publikasi ke Facebook, Instagram, TikTok, Google Business Profile, atau WhatsApp. P0 hanya mengaktifkan campaign draft terikat listing, state channel, UTM, native marketplace promotion SultraKita, dan manual export.

> Identity `owner_id` dan `seller_id` selalu berasal dari session serta listing yang diverifikasi server. Nilai identity dari payload browser tidak dipercaya.

## Audit base code

| Area | Temuan | Keputusan P0 |
|---|---|---|
| Runtime | Aplikasi berjalan sebagai Node.js/Express dengan REST API dan adapter PostgreSQL yang menerjemahkan placeholder `?` menjadi parameter PostgreSQL. | Router baru mengikuti pola Express existing dan tidak memperkenalkan REST client kedua. |
| Marketplace | `listings` menggunakan `BIGINT` runtime IDs, memiliki `seller_id`, `status`, `image_url`, `is_promoted`, `promoted_until`, dan `boost_until`. | Campaign wajib mereferensikan listing aktif. Publish native memanggil update pada listing yang sama, tanpa menduplikasi listing. |
| Auth/RBAC | `authenticate` menempatkan user session pada `req.user`; `requireAuth` menolak request anonim; seller/admin adalah role yang relevan. | Semua read/mutation campaign dilindungi. Server memvalidasi role, ownership campaign, dan kesesuaian seller listing. |
| Database | Migration existing bersifat additive dan memakai RLS deny-by-default pada tabel server-owned. | Migration `022_suki_promo_hub_p0.sql` memakai `CREATE TABLE IF NOT EXISTS`, index idempotent, policy replace, dan foreign key ke entity existing. |
| Native content | Tidak ditemukan entity feed/community generic yang dapat dipakai P0 dengan aman. Marketplace promotion sudah memiliki entity dan endpoint yang terverifikasi. | Native P0 dibatasi pada marketplace promotion SultraKita. Feed, community, video/reels, dan seller profile tetap out of scope. |
| Provider eksternal | Credential/OAuth capability provider tidak tersedia untuk P0. | Connections mengembalikan `NOT_CONNECTED`; channel eksternal memakai `MANUAL_ACTION_REQUIRED`. |
| Media/AI | P0 tidak menambahkan generator AI atau upload asset baru. | `media_asset_ids` hanya disimpan sebagai referensi data campaign; Content Studio dan asset validation ditunda ke P1/P4. |

## Migration

File `database/migrations/022_suki_promo_hub_p0.sql` menambah enam tabel server-owned berikut: `promo_campaigns`, `promo_channels`, `promo_channel_events`, `promo_utm_links`, `promo_exports`, dan `promo_events`. Foreign key, status check, index utama, unique idempotency/attribution key, RLS, serta policy deny-by-default dicakup pada migration.

Migration forward tidak melakukan drop atau mengubah status listing/seller existing. Rollback dilakukan melalui migration korektif setelah export dan keputusan eksplisit, bukan dengan mengedit migration yang sudah diterapkan.

## API P0

Semua response mengikuti envelope existing `{ success, data, error }`.

| Method | Endpoint | Auth | Fungsi |
|---|---|---:|---|
| GET | `/api/v2/promo/health` | Tidak | Capability contract P0; provider eksternal selalu `NOT_CONNECTED`. |
| GET | `/api/v2/promo/listings` | Ya | Listing aktif milik session untuk picker campaign. |
| GET | `/api/v2/promo/campaigns` | Ya | Daftar campaign milik session; admin dapat membaca sesuai role existing. |
| POST | `/api/v2/promo/campaigns` | Ya | Membuat campaign draft dan channel/UTM rows. Mendukung `Idempotency-Key`. |
| GET | `/api/v2/promo/campaigns/:id` | Ya | Detail campaign, channel states, dan UTM links setelah ownership check. |
| PATCH | `/api/v2/promo/campaigns/:id` | Ya | Mengedit draft sebelum publish; listing binding tidak dapat diganti. |
| POST | `/api/v2/promo/campaigns/:id/approve` | Ya | `DRAFT`/`AWAITING_APPROVAL` menjadi `READY` dan mencatat transition. |
| POST | `/api/v2/promo/campaigns/:id/export` | Ya | Membuat package verified facts untuk channel manual; tidak mengklaim publish. |
| POST | `/api/v2/promo/campaigns/:id/publish/sultrakita` | Ya | Mempromosikan listing aktif pada marketplace SultraKita setelah approval. |
| GET | `/api/v2/promo/utm/:id` | Ya | Membaca link UTM milik campaign. |
| POST | `/api/v2/promo/events` | Tidak | Menerima event dengan `event_key` unik dan menolak replay duplikat. |
| GET | `/api/v2/promo/analytics` | Ya | Menghitung event yang benar-benar diterima; zero-data dikembalikan sebagai `insufficient_data`. |
| GET | `/api/v2/promo/connections` | Ya | Menampilkan capability native dan fallback provider eksternal. |

## State machine

State campaign: `DRAFT`, `AWAITING_APPROVAL`, `READY`, `SCHEDULED`, `PUBLISHED`, `FAILED`, `MANUAL_ACTION_REQUIRED`, `CANCELLED`.

State channel: `CONNECTED`, `NOT_CONNECTED`, `READY`, `AWAITING_APPROVAL`, `PUBLISHED`, `FAILED`, `MANUAL_ACTION_REQUIRED`.

Setiap perubahan state channel memasukkan actor, waktu, state asal/tujuan, provider reference bila tersedia, error code bila ada, dan metadata ke `promo_channel_events`. P0 tidak menyediakan scheduler dan tidak auto-publish channel sensitif.

## Capability aktif

| Capability | Status P0 | Catatan |
|---|---|---|
| Campaign draft | Aktif | Terikat pada listing aktif milik session. |
| Listing/seller binding | Aktif | Ownership diverifikasi server-side. |
| Native SultraKita marketplace promotion | Aktif | Menggunakan `is_promoted`, `promoted_until`, dan `boost_until` existing. |
| UTM campaign/channel link | Aktif | Satu link deterministic per campaign/channel. |
| Manual export | Aktif | Package JSON berisi verified listing facts dan disclaimer manual. |
| Facebook / Instagram / TikTok / Google / WhatsApp direct publish | `NOT_CONNECTED` | Tidak ada fake connected state; manual fallback tersedia. |
| AI generation, Content Studio, calendar, audience/consent, provider OAuth | Ditunda | P1–P3 sesuai roadmap. |

## Risiko dan rollback

Risiko utama adalah migration belum diterapkan pada environment target, perbedaan schema legacy antar environment, dan native promotion columns yang tidak tersedia pada database lama. Jalankan seluruh migration existing sampai `022` pada staging terlebih dahulu. Publish native hanya boleh diaktifkan setelah query `listings` berhasil pada staging.

Jika perlu rollback, hentikan akses UI `/promo` melalui feature flag/deployment revert, pertahankan data campaign untuk audit, lakukan export tabel `promo_*`, lalu terapkan migration korektif terpisah setelah review. Jangan menghapus listing atau mengubah data seller sebagai bagian dari rollback P0.

## Acceptance evidence

Test `test/promo-p0-contract.test.js` mencakup deterministik UTM, normalisasi channel tanpa provider fiktif, manual package state, route health, anonymous denial, identity/ownership source assertions, migration markers, dan UI fallback markers. `npm test`, `npm run lint`, dan `npm run build` lulus di sandbox; database integration suite penuh membutuhkan `STAGING_DATABASE_URL` atau environment database non-production dan belum dijalankan karena credential tersebut tidak tersedia pada sesi ini.

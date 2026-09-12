# Analisis Pengembangan Reward Affiliate SUKI

**Tanggal audit:** 13 September 2026
**Repository:** `saripkdi01-boop/sultrakita-platform`
**Branch/commit baseline:** `main` / `02af5f1a8fd5909c755edb16f5c0532da44284e6`
**Status working tree:** bersih dan sinkron dengan `origin/main`

## Kesimpulan eksekutif

Fitur reward affiliate SUKI sudah memiliki fondasi yang cukup luas. Repository telah memuat Campaign Hub pada `/ajak-teman`, personal referral link, activity feed, leaderboard berbasis referral `qualified`, redemption manual, queue payout admin, audit trail, notifikasi status payout, serta guardrail two-person payment. Karena itu, langkah berikutnya **bukan menambah halaman atau tombol reward**, melainkan mengunci sumber kebenaran reward di backend dan menghilangkan ambiguitas antara referral, poin, saldo tersedia, redemption, dan pembayaran.

Rekomendasi utama adalah mengerjakan **P0: immutable reward ledger + status dictionary + idempotent qualification pipeline** pada runtime dan database yang benar-benar menjadi production source of truth. Setelah itu baru aktifkan peningkatan UX, fraud scoring, cohort leaderboard, dan payout provider.

## Temuan repository

| Area | Kondisi saat ini | Implikasi |
|---|---|---|
| Repository | Node.js/Express runtime lama masih ada, bersama `next-app` berbasis Next/Supabase | Risiko kontrak ganda dan fitur dibangun pada runtime yang tidak live |
| UI pengguna | Campaign Hub sudah tersedia dengan ringkasan, leaderboard, tukar poin, aturan, dan histori | UI dasar sudah cukup untuk iterasi backend |
| Referral state | Copy dan API sudah membedakan aktivitas `qualified` dari klik/signup | Belum terlihat ledger immutable yang menjadi sumber saldo per event |
| Redemption | Ada minimum 1.000 poin, masked account, satu pengajuan aktif, dan histori | Mekanisme manual sudah ada, tetapi harus dipastikan saldo didebit atomik |
| Payout admin | `pending → approved/rejected → paid/rejected`, alasan reject, payment reference, audit log, dan operator kedua | Guardrail operasional relatif baik; tetap perlu role/RLS test di staging |
| Notification | Status payout dapat mengirim notifikasi in-app | Harus diuji idempotency agar retry tidak menggandakan notifikasi |
| Anti-abuse | Self-referral, akun ganda, bot, retur/chargeback disebut sebagai aturan produk | Belum cukup bila tidak diwujudkan menjadi sinyal, decision, dan audit event backend |
| Deployment | Connector Vercel dan Supabase tersedia/enabled; target project/production URL belum diverifikasi dalam audit ini | Jangan deploy/migrasi sebelum project ref, URL, dan source of truth dikonfirmasi |
| CI | Workflow menjalankan migrasi dua kali, lint, test, security, build, dan API smoke | Dapat dijadikan gate baseline untuk implementasi berikutnya |

## Risiko terbesar

### 1. Dua runtime dan dua kontrak

`server.js` memasang `/api/referral` dari runtime Express/public, sementara `next-app` juga memiliki route referral dan halaman Campaign Hub. Sebelum perubahan fitur, perlu diputuskan apakah production memakai Express/public, Next/Supabase, atau adapter resmi di antaranya. Tanpa keputusan ini, pengguna dapat melihat UI dari satu runtime tetapi menulis data ke kontrak API/database lain.

### 2. Saldo dapat menjadi angka turunan yang tidak dapat diaudit

Reward membutuhkan jejak peristiwa yang tidak boleh diubah: siapa yang mendapat poin, dari campaign mana, untuk aktivitas apa, kapan qualified, alasan hold/reversal, kapan available, kapan reserved untuk redemption, dan kapan redeemed. Menyimpan hanya total saldo atau status referral tidak cukup untuk menangani sengketa, pembalikan transaksi, retry webhook, atau rekonsiliasi payout.

### 3. Qualification dan redemption harus atomik

Request yang diulang, dua tab browser, webhook retry, atau operator yang memproses bersamaan dapat menggandakan poin atau payout bila tidak ada idempotency key, unique constraint, row lock, dan transaksi database.

### 4. Payout mengubah risiko produk menjadi risiko operasional

Begitu reward dapat dicairkan, perlu ada kebijakan minimum saldo, hold period, reversal, rekening/e-wallet, bukti bayar, rekonsiliasi harian, retensi data, dan jalur sengketa. Review legal/operasional Indonesia diperlukan sebelum klaim komersial atau payout publik diperluas.

## Rekomendasi arsitektur P0

### A. Kamus status global

Tetapkan status terpisah untuk tiga objek, bukan satu status campuran:

1. **Referral attribution:** `clicked`, `signed_up`, `qualified`, `rejected`, `reversed`.
2. **Reward entry:** `pending`, `available`, `reserved`, `redeemed`, `reversed`, `expired`.
3. **Redemption/payout:** `pending`, `approved`, `rejected`, `paid`.

Semua transisi harus memiliki actor/system source, timestamp, reason code, dan correlation/idempotency key.

### B. Immutable ledger

Tambahkan migration additive untuk entitas yang setara dengan:

- `reward_campaigns`: konfigurasi periode, action key, jumlah poin, cap, hold period, status aktif.
- `reward_referrals`: referrer, referred account, referral code, attribution timestamps, qualification decision, fraud flags.
- `reward_ledger_entries`: signed delta poin, balance bucket, source event, status, reason code, idempotency key, created/available/reversed timestamps.
- `reward_redemption_reservations`: ledger entries yang dikunci untuk satu redemption.
- `reward_event_audit_logs`: append-only transition record dan actor/source metadata.

Nama tabel boleh mengikuti konvensi yang sudah ada; yang penting adalah satu sumber kebenaran dan backward-compatible view/API untuk UI lama.

### C. Fungsi transaksi server-side

Buat fungsi atau service server-side untuk:

- `qualify_referral(event_id, campaign_id)` yang idempotent.
- `post_reward(entry)` yang menolak duplicate idempotency key.
- `reserve_reward_for_redemption(redemption_id)` yang mengunci saldo available.
- `release_or_reverse_reward(...)` untuk reject, refund, chargeback, atau fraud decision.
- `transition_payout(...)` yang mempertahankan two-person payment dan audit trail yang sudah ada.

Client tidak boleh mengirim angka saldo final atau menentukan bahwa referral sudah qualified.

## Urutan eksekusi yang disarankan

### Tahap 0 — Konfirmasi source of truth (sebelum coding)

1. Verifikasi production URL, Vercel project, Supabase project ref, deployment commit, dan runtime yang melayani `/ajak-teman` serta `/api/referral`.
2. Bandingkan migration history repository dengan remote Supabase; hentikan bila ada drift yang belum dijelaskan.
3. Pilih satu runtime canonical. Runtime lain hanya menjadi compatibility layer sampai dekomisioning terencana.
4. Buat matriks role/RLS untuk anonymous, authenticated/referrer, referred user, payout reviewer, payout payer, admin, dan service role.

**Output:** keputusan arsitektur satu halaman dan drift report.

### Tahap 1 — P0 ledger dan idempotency

1. Tambahkan migration additive dan index sesuai query nyata.
2. Tambahkan constraint untuk campaign, referral pair, source event, dan idempotency key.
3. Implementasikan qualification pipeline dari event yang benar-benar bermakna, bukan sekadar page view atau signup.
4. Pisahkan `available_balance`, `pending_balance`, `reserved_balance`, dan `promotional_balance` melalui ledger/query teruji.
5. Pertahankan endpoint lama melalui adapter agar UI tidak rusak.

**Acceptance criteria:** event yang sama diproses dua kali hanya menghasilkan satu reward; redemption paralel tidak dapat menghabiskan saldo yang sama; reversal menghasilkan ledger entry korektif, bukan mengubah histori lama.

### Tahap 2 — Admin operations dan fraud review

1. Tambahkan daftar event pending/flagged dengan reason code, bukan hanya queue payout.
2. Tambahkan filter campaign, periode, source event, status, dan risk flag.
3. Tampilkan total ledger, reserved, paid, reversed, dan variance rekonsiliasi.
4. Terapkan role separation pada approve dan pay, lalu uji dengan akun staging berbeda.
5. Tambahkan audit export yang sudah dimasking.

**Acceptance criteria:** reviewer tidak dapat membayar payout yang belum approved; operator yang sama tidak dapat melakukan approval dan payment; semua keputusan memiliki actor, waktu, dan alasan.

### Tahap 3 — UX growth yang aman

1. Tampilkan status per referral: klik, daftar, qualified, pending, available, rejected/reversed.
2. Tambahkan disclosure dekat CTA dan template caption referral.
3. Tambahkan cohort/periode leaderboard, posisi sekitar pengguna, opt-out, dan alias server-side.
4. Tambahkan QR/deep-link fallback serta attribution expiry yang eksplisit.
5. Tampilkan estimasi unlock dan alasan hold tanpa membocorkan sinyal fraud sensitif.

### Tahap 4 — Payout provider atau reward non-cash

Jangan mengaktifkan payout otomatis sebelum ledger, reconciliation, fraud review, dan kebijakan operasional stabil. Pilihan lebih aman untuk pilot adalah reward non-cash yang terbatas, misalnya kredit promosi SUKI, dengan bucket saldo terpisah dan aturan expiry. Integrasi provider pembayaran baru dilakukan setelah kebutuhan secret, KYC/verification, callback signature, retry, dan rekonsiliasi disetujui.

## Test plan wajib

| Lapisan | Skenario minimum |
|---|---|
| Unit/contract | Status transition valid/invalid, nilai poin, cap campaign, reason code, masking |
| Idempotency | Duplicate signup/event/webhook, retry request, dua redemption bersamaan |
| Authorization | Anonymous, user lain, referrer, reviewer, payer, admin, service role |
| RLS | SELECT/INSERT/UPDATE/DELETE untuk referral, ledger, redemption, audit log |
| Fraud | Self-referral, same device/phone/email signal, account duplicate, velocity, reversed action |
| Payout | Reject wajib alasan, paid wajib payment reference, two-person rule, terminal state |
| Regression | Campaign Hub mobile, empty/loading/error, leaderboard, histori, notification center |
| Migration | Apply dua kali pada staging, schema/index/policy verification, corrective migration plan |
| Operational | Rekonsiliasi ledger vs redemption vs paid; request ID dan redacted structured logs |

## Go/No-Go saat ini

| Gate | Hasil | Alasan |
|---|---|---|
| Repository/branch | **GO untuk analisis** | `main` bersih, sinkron dengan `origin/main`, baseline `02af5f1` |
| Fitur existing | **GO untuk iterasi backend** | Campaign Hub dan payout workflow sudah ada |
| Source of truth runtime | **BLOCKED untuk implementasi production** | Express/public dan Next/Supabase sama-sama memiliki kontrak referral; target live belum diverifikasi |
| Database migration | **BLOCKED untuk apply production** | Project ref, remote history, dan drift belum diaudit pada sesi ini |
| Security/RLS | **BLOCKED untuk release** | Matriks role-based belum dijalankan pada staging |
| Payout otomatis | **NO-GO** | Ledger, reconciliation, fraud review, dan provider contract belum cukup matang |

## Pilihan eksekusi

**Pilihan yang saya sarankan: P0 Ledger & Source-of-Truth Audit.** Ini adalah effort sedang dengan impact tertinggi dan menjadi prasyarat aman untuk semua fitur reward berikutnya.

Alternatif yang lebih cepat tetapi terbatas adalah **pilot reward non-cash berbasis kredit promosi**; risikonya lebih rendah daripada cash payout, tetapi tetap membutuhkan ledger dan idempotency. Menambah UI leaderboard atau campaign baru tanpa P0 sebaiknya dihindari karena hanya memperbesar volume data yang sulit direkonsiliasi.

## Keputusan yang diperlukan dari pemilik proyek

Sebelum saya mengimplementasikan tahap P0, saya membutuhkan konfirmasi pilihan runtime canonical:

1. **Express/public + PostgreSQL legacy** sebagai runtime utama; atau
2. **Next/Supabase** sebagai runtime utama; atau
3. **Migrasi bertahap**, dengan Next/Supabase sebagai target dan Express/public sebagai compatibility layer.

Jika tidak ada preferensi, saya merekomendasikan **opsi 3**, tetapi saya akan tetap memverifikasi deployment live dan Supabase migration history sebelum menyentuh schema atau production.

## Referensi internal

- `docs/CAMPAIGN-HUB-RESEARCH-2026-09-12.md`
- `database/migrations/029_referral_payout_workflow.sql`
- `database/migrations/030_referral_payout_notifications.sql`
- `test/referral-contract.test.js`
- `next-app/app/admin/affiliate-rewards/page.tsx`
- `next-app/app/api/referral/route.ts`
- `public/referral/`
- `.github/workflows/ci.yml`

# SultraKita — P0 Soft-Launch Status

Tanggal verifikasi: 9 September 2026

## Perubahan yang diselesaikan

Badge seller pada endpoint publik `/api/sellers/:id` sekarang hanya memakai `users.verification_status = 'approved'` sebagai sumber kebenaran. Kolom legacy `is_verified` dan `phone_verified` tidak lagi dapat membuat badge seller tampak terverifikasi secara keliru. Regression test ditambahkan untuk mencegah fallback legacy kembali masuk.

Security regression runner sekarang memiliki preflight eksplisit. Jika dijalankan tanpa `DATABASE_URL` atau `SUPABASE_DB_URL`, runner berhenti dengan status **SKIP** dan pesan yang jelas, bukan menghasilkan false failure karena mencoba menjalankan mutation terhadap database lokal/ephemeral.

## Bukti validasi lokal

| Pemeriksaan | Hasil |
|---|---|
| `npm run lint` | Lulus |
| `npm test` | 76 test, 69 lulus, 7 skip karena integration database tidak tersedia, 0 gagal |
| `npm run build` | Lulus; 31 artefak/marker terverifikasi |
| `npm run test:security` tanpa database staging | Skip eksplisit dan aman |
| Canonical verification regression | Lulus |
| Session identity binding regression | Lulus |
| Conversation membership regression | Lulus |
| Fake image signature regression | Lulus pada suite security yang membutuhkan database |
| OTP cooldown/lockout contract | Lulus pada unit/contract suite; full mutation test membutuhkan database staging |

## Gate P0 yang harus dijalankan di staging sebelum Go

Pengujian berikut tidak dapat dianggap selesai hanya dari sandbox lokal:

1. Jalankan `DATABASE_URL` menuju PostgreSQL staging dan jalankan `npm run test:security`. Suite ini membuat fixture user/listing/session, menguji impersonation, membership conversation, revocation session, OTP lockout, PII redaction, dan fake image signature.
2. Jalankan migration staging dan verifikasi RLS untuk `conversations`, `messages`, `listing_analytics`, `reels`, `blocked_users`, `activity_logs`, `seller_verifications`, `listing_media`, dan `workflow_events`.
3. Uji upload dengan storage durable. Pastikan foto tetap tersedia setelah redeploy dan tidak hanya tersimpan di filesystem lokal.
4. Uji OTP provider production dengan nomor/email uji, cooldown per tujuan, expiry, lima percobaan salah, dan provider failure.
5. Jalankan smoke test pada Express dan Worker target. Perbedaan runtime harus dicatat sebelum Worker menjadi jalur production.
6. Verifikasi backup dan restore drill sebelum menerima data organik.

## Keputusan soft launch

**Kode dan regression lokal siap untuk dilanjutkan ke staging. Production soft launch belum boleh dinyatakan GO hanya berdasarkan hasil lokal**, karena database staging, storage durable, OTP production, backup/restore, dan runtime parity merupakan dependency eksternal.

n8n/Slack/Customer.io bukan blocker P0 untuk fungsi inti website dan boleh tetap nonaktif. Fitur tersebut dapat diaktifkan setelah alur utama stabil.


## Verifikasi eksternal terbaru

Supabase project `ibvcfdfsjpytwpnxgylm` telah menerima migration `security_definer_privileges_025` dan `jobs_manager_security_invoker_026`. Fungsi SECURITY DEFINER yang tidak diperlukan untuk role publik sudah ditutup; advisor tidak lagi melaporkan fungsi SECURITY DEFINER yang dapat dipanggil `anon` atau `authenticated`.

Sisa advisor Supabase yang bukan blocker langsung untuk jalur Express service-role adalah 61 tabel RLS tanpa policy eksplisit, `pg_trgm` pada schema `public`, dan leaked-password protection Supabase Auth yang masih nonaktif. RLS tanpa policy perlu ditangani per domain karena menambahkan policy secara massal tanpa matriks akses dapat membuka data atau memutus fitur. Leaked-password protection harus diaktifkan dari konfigurasi Auth Supabase.

Smoke read-only production berhasil memuat halaman utama dan endpoint marketplace listing. Route `/api/health`, `/api/v2/health`, `/api/categories`, dan `/api/locations` mengembalikan 404 pada deployment Next.js aktif; route tersebut adalah kontrak Express lama dan bukan route yang diekspor oleh `next-app`. Ini menegaskan bahwa production saat ini memakai Next.js runtime, sehingga validasi berikutnya harus memakai route Next.js (`/api/feed`, `/api/interactions`, `/api/listings`) dan server actions, bukan menganggap Express health endpoint tersedia.

Deployment production terakhir yang terdeteksi berstatus `READY` dan berasal dari repository GitHub SultraKita. Perubahan lokal P0 harus tetap dipush ke branch production agar hardening server dan migration file ikut terdokumentasi di repository; migration Supabase sudah diterapkan langsung pada project.

# SultraKita — Production Readiness & Soft Launch

Dokumen ini adalah runbook implementasi untuk beta launch. Jalankan langkah database pada staging terlebih dahulu, lalu ulangi pada Production setelah backup dan verifikasi deployment.

## 1. Urutan migrasi SQL

Jalankan file berikut di **Supabase SQL Editor** dalam urutan yang sama:

1. `supabase/migrations/20260905180000_privacy_security_core.sql`
2. `supabase/migrations/20260906000000_growth_trinity.sql`
`activity_logs` dan `blocked_users` sudah dibuat oleh migrasi privacy core, jadi tidak ada migrasi pelengkap kedua yang perlu dijalankan. Migrasi bersifat non-destruktif: menggunakan `create ... if not exists`, kebijakan dihapus/dibuat ulang dengan nama terkontrol, dan tidak menghapus data aplikasi. Setelahnya, verifikasi tabel `conversations`, `messages`, `listing_analytics`, `reels`, `blocked_users`, dan `activity_logs` di Table Editor. Pastikan Realtime aktif untuk `conversations`, `messages`, dan `reels`.

## 2. Environment Variables Vercel

Isi secret pada target **Production**, **Preview**, dan **Development** sesuai kebutuhan. Jangan menyalin nilai contoh ke production dan jangan memakai prefix publik untuk secret.

| Variable | Wajib | Deskripsi | Contoh nilai |
|---|---:|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | URL project Supabase yang dipakai browser/server action | `https://project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Anon key Supabase; aman untuk client sesuai RLS | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Kondisional | Hanya untuk job server-side/admin; tidak boleh masuk bundle | `server-only-secret` |
| `GEMINI_API_KEY` | Untuk AI | API key Gemini yang hanya dibaca server action | `AIza...` |
| `GEMINI_API_BASE` | Disarankan | Base URL Gemini | `https://generativelanguage.googleapis.com/v1beta` |
| `GEMINI_MODEL` | Disarankan | Model AI listing yang telah diverifikasi | `gemini-2.5-flash` |
| `N8N_WHATSAPP_WEBHOOK_URL` | Untuk WhatsApp | Endpoint webhook n8n untuk notifikasi seller | `https://n8n.example.com/webhook/sultrakita` |
| `N8N_WEBHOOK_SECRET` | Jika webhook memakai secret | Secret header `x-webhook-secret` | `set-in-vercel-only` |
| `NEXT_PUBLIC_API_BASE_URL` | Jika memakai Express terpisah | Base URL API Express yang diakses Next app | `https://api.example.com` |
| `CORS_ORIGINS` | Jika memakai Express terpisah | Origin Vercel yang diizinkan | `https://sultrakita-platform.vercel.app` |
| `DATABASE_URL` | Hanya Express/Postgres | Connection string server-side legacy API | `postgresql://...` |

Setelah perubahan environment, lakukan **Redeploy**. Periksa bahwa secret tidak muncul dalam build log, source map, HTML, atau bundle browser. `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, dan `N8N_WEBHOOK_SECRET` tidak boleh memakai `NEXT_PUBLIC_`.

## 3. Seed cold-start

Buat lima user terlebih dahulu di Supabase Auth (sebaiknya akun staging atau akun tim):

- `admin@sultrakita.local`
- `seller.kendari1@sultrakita.local`
- `seller.kendari2@sultrakita.local`
- `creator.wakatobi@sultrakita.local`
- `buyer.kendari@sultrakita.local`

Kemudian jalankan `supabase/seed/20260906_soft_launch_seed.sql`. Script akan berhenti bila kelima user belum tersedia, memakai `where not exists` untuk fixture listings/reels/messages, dan tidak pernah membuat atau mengubah password Auth. Nilai `is_demo = true` menandai fixture agar mudah dikelola saat data organik mulai masuk.

## 4. QA pre-launch

- [ ] Jalankan dua migrasi dan pastikan tidak ada error SQL.
- [ ] Verifikasi keenam tabel soft-launch dan index penting di Table Editor.
- [ ] Pastikan RLS aktif pada `conversations`, `messages`, `listing_analytics`, `reels`, `blocked_users`, dan `activity_logs`.
- [ ] Login sebagai seller dan buyer pada browser normal serta Incognito.
- [ ] Jalankan **Generate AI Listing** dengan satu gambar asli; verifikasi draft dapat diedit sebelum publish.
- [ ] Simulasikan Gemini timeout/key kosong; pastikan UI menampilkan fallback ramah dan tidak crash.
- [ ] Buka chat pada dua browser, kirim 3–4 pesan bolak-balik, dan pastikan pesan muncul tanpa refresh.
- [ ] Simulasikan webhook n8n gagal; pastikan pesan tetap tersimpan dan UI tidak menunggu lebih dari timeout.
- [ ] Periksa log n8n untuk payload nomor seller, nama buyer, judul listing, dan isi pesan.
- [ ] Buka Reels pada district dengan data dan district kosong; pastikan skeleton, empty state, pagination, dan error tampil benar.
- [ ] Buka Seller Analytics untuk seller tanpa listing; pastikan empty state tampil, bukan chart rusak.
- [ ] Sebagai user A, coba membaca conversation, messages, analytics, blocklist, dan activity logs user B melalui Network tab; semua harus ditolak atau kosong.
- [ ] Verifikasi user biasa tidak dapat mengubah `activity_logs` user lain dan tidak dapat mengelola blocklist user lain.
- [ ] Uji mobile viewport 360px: drawer, skeleton, CTA, dan tombol tidak overflow horizontal.
- [ ] Jalankan `npm run lint`, `npm test`, dan `npm run build` dari root repository.
- [ ] Setelah redeploy Vercel, cek smoke test listing read, upload staging, AI listing, chat realtime, dan webhook.

## 5. Go/no-go criteria

Soft launch hanya boleh diumumkan bila migrasi selesai, environment Production lengkap, RLS test lulus, fallback AI/webhook terverifikasi, dan halaman utama tidak terlihat kosong. Hapus fixture demo secara terencana setelah minimal 10 listing organik, 3 Reels organik, dan 2 komunitas nyata tersedia; jangan menjalankan `delete` otomatis dari script seed.

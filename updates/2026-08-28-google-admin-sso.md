# Google Admin SSO — 28 Agustus 2026

## Status

SultraKita kini memiliki alur **Google Admin SSO additive** yang memakai OAuth 2.0/OpenID Connect Google, session bearer marketplace existing, RBAC existing, dan secondary `ADMIN_TOKEN` existing. Tidak ada Supabase browser client, JWT auth stack kedua, password, service-role key, atau credential Google yang disimpan di repository.

## Alur

1. Operator mengonfigurasi `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_ADMIN_EMAIL_ALLOWLIST`, dan redirect URI `https://sultrakita-platform.vercel.app/api/auth/google/admin/callback` pada environment production.
2. Halaman `/admin/index.html` menampilkan tombol **Masuk dengan Google SSO admin**.
3. Server membuat state acak HttpOnly, mengarahkan ke Google, lalu memvalidasi state cookie, token exchange, OpenID profile, dan `email_verified === true`.
4. Email Google harus berada pada allowlist server. Server tidak membuat user baru untuk jalur admin SSO.
5. User yang sudah ada harus mempunyai `admin_role_assignments.role` `admin` atau `super_admin`. Jika belum, server mengembalikan `GOOGLE_ADMIN_PROVISIONING_REQUIRED` atau `GOOGLE_ADMIN_ROLE_REQUIRED`.
6. Server menerbitkan one-time exchange code selama dua menit. Browser menukarkannya menjadi bearer session lalu tetap harus memasukkan `ADMIN_TOKEN` pada form login admin.

## Provisioning

Akun target belum diprovisioning otomatis. Ini disengaja: email saja tidak cukup untuk memberikan kuasa penuh. Operator harus mengidentifikasi user marketplace yang sah, memastikan identitas Google sudah diverifikasi melalui OAuth, lalu memakai jalur role-assignment resmi yang diaudit. Jangan memasukkan password atau secret ke source code, issue tracker, log, atau chat.

## Environment variables

| Variable | Keterangan |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth Client ID dari Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret; hanya server-side |
| `GOOGLE_ADMIN_EMAIL_ALLOWLIST` | Daftar email dipisahkan koma; isi hanya alamat operator yang disetujui |
| `GOOGLE_ADMIN_REDIRECT_URI` | Opsional; default mengikuti `SITE_URL` ke callback admin |
| `ADMIN_TOKEN` | Secondary gate admin existing; tetap wajib pada login form |

Jangan mengubah `vercel.json` atau mengganti entry point Express. Setelah environment dikonfigurasi dan user benar-benar diprovisioning, deploy ulang diperlukan agar Vercel memakai environment baru.

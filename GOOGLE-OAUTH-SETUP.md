# Login dan Daftar Cepat dengan Google

## Batasan dan keamanan

Fitur ini memakai **Google OAuth 2.0 dengan OpenID Connect** untuk autentikasi identitas. SultraKita tidak meminta password Gmail, tidak menyimpan password Google, dan tidak meminta izin membaca atau mengirim email di inbox. Scope yang diminta hanya `openid email profile`.

Setelah pengguna menyetujui akun Google, server menukar authorization code dengan Google, mengambil profil terverifikasi, lalu mencocokkan pengguna berdasarkan `google_sub` atau email terverifikasi. Server membuat session lokal dan mengirim handoff code satu kali ke `/account.html`; token session tidak pernah ditempatkan pada query string.

## Konfigurasi Google Cloud

Buka Google Cloud Console, pilih atau buat project, lalu siapkan OAuth consent screen. Untuk penggunaan internal atau pengujian, tambahkan akun penguji sesuai kebutuhan. Buat OAuth Client ID dengan application type **Web application**.

Pada bagian Authorized redirect URIs tambahkan URL callback persis sesuai domain aktif:

```text
https://<domain-live>/api/auth/google/callback
```

Untuk deployment yang memakai URL Vercel contoh repository ini, URL-nya adalah:

```text
https://sultrakita-platform.vercel.app/api/auth/google/callback
```

Redirect URI harus sama persis antara Google Cloud Console dan environment server, termasuk HTTPS, hostname, path, dan tanpa slash tambahan. Salin Client ID dan Client Secret dari Google Cloud Console ke secret environment Vercel. Jangan commit keduanya.

## Environment Vercel

Set variabel berikut pada Vercel Project Settings. `GOOGLE_CLIENT_SECRET` dan `RESEND_API_KEY` harus bertipe secret dan hanya tersedia pada server runtime.

```dotenv
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://<domain-live>/api/auth/google/callback
```

Jika `GOOGLE_REDIRECT_URI` tidak diisi, server memakai `PUBLIC_SITE_URL` atau `SITE_URL` yang tersedia pada konfigurasi proyek lalu menambahkan `/api/auth/google/callback`. Mengisi URI eksplisit lebih aman untuk mencegah salah domain pada preview dan production.

## Endpoint aplikasi

Tombol pada halaman akun mengarah ke `GET /api/auth/google/start`. Endpoint ini membuat state acak pada cookie HttpOnly, Secure, SameSite Lax lalu mengarahkan pengguna ke Google. Callback memvalidasi state, menukar code, memeriksa profil OIDC, dan mengarahkan kembali ke `/account.html?google_code=...`. Browser segera menukar kode satu kali itu melalui `POST /api/auth/google/exchange` lalu menghapus parameter dari URL. Kode handoff memiliki masa berlaku dua menit dan dapat digunakan sekali.

Jika credential Google belum diisi, endpoint start mengembalikan kode stabil `GOOGLE_OAUTH_NOT_CONFIGURED`. Ini adalah kondisi konfigurasi, bukan alasan untuk meminta pengguna memberikan password Gmail.

## Checklist verifikasi

Jalankan migration `005_auth_channels_google.sql` melalui runner migration sebelum uji login. Buka halaman akun, pilih tombol Google, selesaikan consent, dan pastikan dashboard tampil setelah kembali ke aplikasi. Periksa bahwa URL browser kembali bersih tanpa `google_code`, refresh halaman tetap menggunakan session lokal, dan penggunaan ulang kode exchange ditolak. Uji juga callback dengan state yang diubah; request tersebut harus ditolak.

Untuk production, lakukan smoke test hanya setelah domain callback Google didaftarkan dan environment variables telah diisi pada environment yang benar. Jangan menyalin Client Secret ke issue, chat publik, frontend bundle, atau repository.

## Referensi resmi

Alur ini mengikuti dokumentasi resmi [Google OAuth 2.0 untuk web server applications](https://developers.google.com/identity/protocols/oauth2/web-server) dan [OpenID Connect Google](https://developers.google.com/identity/openid-connect/openid-connect).

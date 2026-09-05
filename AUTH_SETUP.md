# Setup Autentikasi SultraKita

Dokumen ini menjelaskan konfigurasi **Auth Gate satu pintu** untuk deployment SultraKita. Route platform dilindungi oleh middleware; `/login`, `/signup`, `/auth/callback`, dan halaman legal tetap publik.

## 1. Jalankan migration

Buka **Supabase Dashboard → SQL Editor**, lalu jalankan isi file berikut:

```text
supabase/migrations/20260909000000_auth_profiles.sql
```

Migration ini additive dan menambahkan profile, role, serta login history tanpa menghapus tabel atau data lama. Pastikan tabel `profiles` yang sudah ada tetap kompatibel dengan kolom `id`, `full_name`, `display_name`, `email`, dan `role`.

## 2. Environment Vercel

Tambahkan environment variables berikut untuk **Production, Preview, dan Development** bila diperlukan:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

Client ID dan secret OAuth dikonfigurasi di Supabase Authentication Providers, bukan disimpan di browser atau source code Next.js.

## 3. Provider Google

1. Buka [Google Cloud Console](https://console.cloud.google.com/) dan buat OAuth Client ID.
2. Tambahkan Authorized redirect URI:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

3. Di **Supabase → Authentication → Providers → Google**, aktifkan provider dan masukkan Client ID serta Client Secret.
4. Di **Supabase → Authentication → URL Configuration**, set Site URL ke:

```text
https://sultrakita-platform.vercel.app
```

Tambahkan redirect URL berikut:

```text
https://sultrakita-platform.vercel.app/auth/callback
```

## 4. Provider Facebook

1. Buka [Meta for Developers](https://developers.facebook.com/) dan aktifkan produk Facebook Login.
2. Tambahkan Valid OAuth Redirect URI:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

3. Di Supabase, aktifkan Facebook dan masukkan App ID serta App Secret.
4. Untuk production, pastikan aplikasi Meta berada pada mode yang dapat digunakan oleh akun target dan domain production sudah terdaftar.

## 5. Perilaku route

- Guest yang membuka `/`, `/dashboard`, marketplace, chat, atau route platform lain diarahkan ke `/login?redirect=<route-asal>`.
- User yang sudah login dan membuka `/login` atau `/signup` diarahkan ke `/dashboard`.
- Setelah login manual, user dikembalikan ke route asal yang aman atau `/dashboard`.
- Setelah OAuth, `/auth/callback` menukar code menjadi session lalu mengarahkan ke route aman atau `/dashboard`.
- `/admin/*` hanya dapat diakses role `admin`.
- `/seller/*` hanya dapat diakses role `seller` atau `admin`.
- Logout menghapus session Supabase dan mengarahkan ke `/login`.

## 6. Deploy dan verifikasi

```bash
cd next-app
npm run build
git add .
git commit -m "feat: implement full auth gate protection"
git push
```

Kemudian verifikasi:

```text
https://sultrakita-platform.vercel.app/       -> /login untuk guest
https://sultrakita-platform.vercel.app/login  -> HTTP 200
https://sultrakita-platform.vercel.app/signup -> HTTP 200
```

Jangan menaruh `service_role` key di Vercel client environment atau source code. Hanya anon key yang boleh digunakan oleh browser.

## Troubleshooting

Jika terjadi redirect loop, hapus cookie site dan ulangi login. Jika callback OAuth gagal, periksa kecocokan URL pada Google/Meta, Site URL Supabase, dan redirect allow-list. Jika role tidak terbaca, jalankan migration dan pastikan row profile memiliki `id` yang sama dengan `auth.users.id`.

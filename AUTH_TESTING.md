# Auth Gate Testing Checklist

## Pre-deployment

- [ ] Migration `20260909000000_auth_profiles.sql` dijalankan di Supabase.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` tersedia di Vercel.
- [ ] Google dan Facebook provider aktif di Supabase.
- [ ] OAuth redirect URL production terdaftar di Google dan Meta.
- [ ] `npm run build` berhasil.

## Guest flow

- [ ] `/` mengarahkan guest ke `/login`.
- [ ] `/dashboard` mengarahkan guest ke `/login?redirect=%2Fdashboard`.
- [ ] `/marketplace` mengarahkan guest ke login.
- [ ] `/login` dapat dibuka dan menampilkan form.
- [ ] `/signup` dapat dibuka dan menampilkan form.
- [ ] `/legal/terms`, `/legal/privacy`, dan `/legal/cookies` tetap publik.

## Manual authentication

- [ ] Signup dengan password lemah menampilkan validasi.
- [ ] Signup dengan email valid mengirim email verifikasi bila email confirmation aktif.
- [ ] Login dengan kredensial benar menuju `/dashboard`.
- [ ] Login dengan route asal mengembalikan user ke route tersebut.
- [ ] Login dengan kredensial salah menampilkan error tanpa kehilangan form.
- [ ] Reset password mengirim email reset.

## OAuth

- [ ] Google mengembalikan user ke `/dashboard`.
- [ ] Facebook mengembalikan user ke `/dashboard`.
- [ ] Parameter `next` tidak dapat mengarahkan ke domain eksternal.
- [ ] Callback tanpa code mengembalikan user ke `/login?error=auth_callback`.

## Authenticated flow

- [ ] User yang sudah login membuka `/login` dan diarahkan ke `/dashboard`.
- [ ] User yang sudah login membuka `/signup` dan diarahkan ke `/dashboard`.
- [ ] `/` mengarahkan user login ke `/dashboard`.
- [ ] Dashboard menampilkan nama/email user.
- [ ] Shortcut dashboard membuka route platform yang benar.
- [ ] Logout menghapus session dan mengarahkan ke `/login`.

## Role protection

- [ ] User non-admin yang membuka `/admin/*` diarahkan ke `/dashboard?error=unauthorized`.
- [ ] User non-seller yang membuka `/seller/*` diarahkan ke dashboard.
- [ ] Admin dapat membuka `/admin/*`.
- [ ] Seller atau admin dapat membuka `/seller/*`.

## Production smoke test

Uji di browser incognito dan browser biasa setelah deployment. Periksa juga cookie session, Network tab untuk callback, serta log Vercel jika provider OAuth menampilkan error.

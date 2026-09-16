# Implementasi Fase 3 — Engagement Aggregate dan Viewer State Feed Suki

**Tanggal:** 17 September 2026  
**Status:** Source selesai dan tervalidasi; belum dideploy production

## 1. Tujuan

Fase 3 mengisi field canonical Feed Suki yang sebelumnya masih `null` atau belum berasal dari database. Route feed sekarang menggabungkan data post dengan engagement dan state pengguna yang sedang login melalui query batch per halaman.

## 2. Perubahan implementasi

File utama:

```text
next-app/app/api/feed/route.ts
```

Ditambahkan helper `hydrateEngagement` yang mengambil data untuk seluruh post pada satu halaman melalui batch query:

- `likes` untuk jumlah like dan state `viewer.liked`;
- `post_comments` untuk jumlah komentar berstatus `visible`;
- `post_shares` untuk jumlah share;
- `saved_posts` untuk state `viewer.saved` pengguna aktif.

Query tidak dilakukan satu per satu per kartu feed. Untuk satu halaman feed, data interaksi diambil menggunakan empat query batch sehingga tidak menimbulkan N+1 query per item.

## 3. Kontrak response

Item Feed Suki sekarang dapat mengisi:

```text
engagement.likeCount
engagement.commentCount
engagement.shareCount
viewer.liked
viewer.saved
```

`saveCount` tetap `null` karena save bersifat privat dan policy staging hanya mengizinkan user membaca save miliknya sendiri. Jumlah save publik tidak boleh dihitung dengan membuka seluruh relasi save pengguna.

`followingActor` masih `null` sampai follower graph dan query relationship yang konsisten tersedia.

## 4. Perilaku anonymous dan authenticated

### Anonymous

- dapat menerima count like, komentar visible, dan share pada post yang dapat dibaca;
- `viewer.liked = null`;
- `viewer.saved = null`.

### Authenticated

- menerima count like, komentar visible, dan share;
- `viewer.liked` dihitung berdasarkan user aktif;
- `viewer.saved` dihitung dari `saved_posts` milik user aktif.

## 5. Verifikasi

| Pemeriksaan | Hasil |
|---|---|
| Contract test Fase 1 + Fase 2 | 8/8 lulus |
| Root lint | Lulus |
| Next.js typecheck | Lulus |
| Next.js build | Lulus |
| Route `/api/feed` | Berhasil dikompilasi |
| Route `/beranda` | Berhasil dikompilasi |
| `git diff --check` | Lulus |

## 6. Prasyarat deployment

Route feed Fase 3 membutuhkan tabel:

- `post_comments`;
- `post_shares`;
- `saved_posts`.

Ketiganya sudah ada pada project staging setelah migration Fase 2. Production belum memiliki migration tersebut dan belum boleh menerima deployment source Fase 3 sebelum migration production direncanakan serta disetujui.

## 7. Risiko dan langkah berikutnya

Jika source Fase 3 dideploy ke production sebelum migration Fase 2, query batch terhadap tabel baru dapat membuat `/api/feed` gagal. Oleh karena itu urutan release wajib:

1. production migration review;
2. production migration apply dengan otorisasi terpisah;
3. preview deployment source;
4. smoke test Feed Suki;
5. production deployment.

Langkah produk berikutnya yang masih terbuka:

- menampilkan count dan state baru secara lengkap pada UI card;
- menambahkan viewer following state;
- menjalankan write RLS matrix dua akun staging;
- menyiapkan preview deployment.

**Keputusan:** Fase 3 source siap masuk preview setelah write matrix staging lulus. Production belum disentuh.

## References

[1]: ./STAGING-MIGRATION-RLS-RESULT-2026-09-17.md "Hasil Migration Fase 2 dan RLS Staging"

[2]: ./AUDIT-MIGRATION-REMOTE-RLS-STAGING-2026-09-17.md "Audit Migration Remote dan RLS Staging"

[3]: ./REVIEW-DIFF-FASE-2-2026-09-17.md "Review Diff Fase 2"

**Penulis:** Manus AI

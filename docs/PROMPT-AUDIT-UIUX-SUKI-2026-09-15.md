# Prompt Audit UI/UX SUKI Apps

Gunakan prompt berikut untuk audit menyeluruh terhadap seluruh tampilan SUKI Apps:

> Audit seluruh UI/UX SUKI Apps secara end-to-end pada desktop, tablet, dan mobile, mencakup mode terang dan mode gelap. Inventarisasikan semua route, komponen navigasi, halaman data, modal, form, empty/loading/error state, responsive breakpoint, keyboard navigation, screen reader label, focus state, dan kontras warna.
>
> Untuk setiap temuan, tampilkan: route/komponen, severity (P0–P3), bukti visual atau kode, expected behavior, actual behavior, akar masalah, file/symbol terdampak, dan rekomendasi perbaikan. Prioritaskan bug yang membuat teks tidak terbaca, foreground/background tidak sinkron saat tema berubah, state aktif tidak terlihat, icon button salah label, overflow mobile, atau feedback aksi tidak jelas.
>
> Audit juga sinkronisasi UI dengan backend dan database. Cocokkan label, field, status, aggregate, loading state, pagination, error contract, authorization, dan empty state dengan API/action, schema/migration, serta RLS. Tandai setiap mismatch dengan tabel: UI contract, API contract, database source of truth, risiko pengguna, dan corrective path. Jangan mengubah schema, RLS, auth, data production, secret, atau provider tanpa approval eksplisit.
>
> Terapkan design-token-first: seluruh warna teks, surface, border, icon, focus ring, placeholder, badge, button, input, select, modal, dan navigation harus menggunakan token semantik yang memiliki pasangan light/dark. Pastikan teks normal minimal memenuhi WCAG AA (4.5:1), teks besar minimal 3:1, focus ring terlihat, dan tidak ada hard-coded color yang mengalahkan token tema. Tema harus disimpan konsisten, menerapkan `html[data-theme="light|dark"]` dan kompatibilitas class legacy bila diperlukan, serta menghormati preferensi sistem pada first load.
>
> Normalisasi nomenklatur produk: gunakan “SUKI Suits” untuk fitur properti pada label navigasi dan icon button; jangan gunakan “SUKI Property” atau “SUKI Switch”. Icon button wajib memiliki `aria-label`, tooltip/title yang konsisten, state pressed/current yang benar, dan target sentuh minimal 44×44px.
>
> Setelah audit, implementasikan perbaikan paling aman tanpa rewrite besar. Tambahkan regression test untuk label canonical, tema light/dark, kontras token, dan state navigasi. Jalankan lint, typecheck bila tersedia, unit/contract test, build, serta browser smoke test pada route terdampak. Laporkan file berubah, mismatch UI–backend–database yang masih tersisa, command validasi, risiko, dan rollback plan.

## Acceptance criteria

1. Tidak ada label “SUKI Property” atau “SUKI Switch” pada navigasi/icon button; label canonical adalah “SUKI Suits”.
2. Pergantian tema mengubah `data-theme`, class legacy, token warna, meta theme-color, dan status ARIA secara serempak.
3. Teks, placeholder, icon, border, input, select, badge, modal, dan tombol terbaca jelas pada kedua tema.
4. Mismatch UI–backend–database didokumentasikan terpisah dari bug visual dan tidak ditutup dengan mock success.
5. Validasi gagal berarti rilis berstatus NO-GO, bukan dianggap selesai.

## Temuan awal pada audit 15 September 2026

| Area | Temuan | Status setelah patch |
|---|---|---|
| Quick navigation | Label `SUKI Property` tidak sesuai nomenklatur canonical dan menyebabkan CI contract test gagal. | Diperbaiki menjadi `SUKI SUITS`. |
| Tema legacy/modern | Sebagian halaman hanya mengubah `body.dark`/class preload, sementara token modern membaca `html[data-theme]`; keduanya dapat tidak sinkron. | Bridge `data-theme` ditambahkan pada semua initializer tema yang diaudit. |
| Backend/database | Audit terdahulu mencatat feed engagement masih menampilkan `likes/comments` nol, save lokal, dan share tanpa pencatatan server. | Di luar scope perubahan visual; tetap menjadi follow-up backend/data contract. |
| CI baseline | Commit sebelum patch memiliki satu failure: canonical SUKI Suits label. | Divalidasi ulang setelah patch. |

Perubahan database/RLS tidak dilakukan pada patch ini karena membutuhkan target staging dan otorisasi eksplisit.

## Prompt singkat untuk laporan hasil

> Buat laporan audit dalam bahasa Indonesia dengan bagian: Ringkasan eksekutif, Matriks route dan komponen, Temuan light mode, Temuan dark mode, Accessibility/contrast, Mismatch UI–API–database, Perbaikan yang diterapkan, Validasi dan bukti, Risiko/rollback, serta backlog P0–P3. Bedakan dengan jelas fakta yang terbukti, asumsi, dan rekomendasi yang belum dieksekusi.

# SUKI Campaign Hub — Riset dan Keputusan Desain

## Ringkasan

Campaign Hub SUKI dirancang sebagai pengalaman referral/affiliate yang **mobile-first, transparan, dan bertahap**. Pengguna harus memahami cara memperoleh reward sebelum membagikan tautan, melihat status atribusi dan validasi secara eksplisit, serta dapat menukar reward yang benar-benar berguna. Leaderboard menjadi lapisan feedback berbasis progres dan periode, bukan satu-satunya insentif.

## Temuan riset yang diterapkan

| Area | Temuan | Keputusan untuk SUKI |
|---|---|---|
| Onboarding | Program affiliate modern memakai checklist singkat, contoh materi, deep link, dan disclosure. | UI memakai alur tiga langkah: bagikan → teman bergabung → verifikasi. |
| Status reward | Referral yang sehat memisahkan klik, signup, aksi valid, pending, available, dan redeemed. | Copy UI menjelaskan bahwa klik atau signup belum otomatis menjadi poin. |
| Anti-abuse | Self-referral, akun ganda, bot, retur, chargeback, dan atribusi terlambat dapat menggelembungkan reward. | Backend tetap memakai validasi qualified dan redemption manual; tidak ada klaim pendapatan instan. |
| Leaderboard | Ranking global dapat memotivasi sebagian pengguna tetapi mengecilkan hati pengguna berperingkat rendah. | Leaderboard menampilkan alias server-side dan metrik referral qualified, dengan catatan transparansi. Tahap berikutnya sebaiknya menambah cohort, periode, posisi sekitar pengguna, dan opt-out. |
| Redemption | Reward perlu memiliki kegunaan konkret, nilai rupiah, minimum, proses, dan histori yang jelas. | UI memisahkan saldo rupiah, saldo iklan SUKI, dan sponsor campaign; saldo iklan/sponsor diberi label belum aktif. |
| Disclosure | Hubungan komersial perlu dijelaskan dekat dengan tautan atau materi promosi. | Tahap berikutnya wajib menambahkan disclosure dekat CTA dan template caption afiliasi. |

## Implementasi saat ini

Perubahan ini membangun ulang `/ajak-teman` menjadi Campaign Hub yang konsisten dengan visual system Promo Hub: navigasi **Ringkasan, Papan peringkat, Tukar poin, dan Aturan program**; kartu saldo/referral; personal link; alur tiga langkah; aktivitas; leaderboard; redemption rupiah; dan penjelasan saldo iklan/sponsor yang belum aktif.

API referral menambahkan endpoint baca `GET /api/referral/leaderboard` dan `GET /api/referral/redemptions`. Leaderboard hanya menghitung event `qualified`, membatasi hasil, dan mengembalikan alias stabil yang tidak mengekspos nama akun penuh. Jika tabel belum tersedia, endpoint fallback ke data kosong tanpa fake capability.

## Guardrail yang harus dipertahankan

Poin hanya boleh dianggap final setelah aktivitas bermakna dan pemeriksaan anti-abuse. Saldo **Reward dapat dicairkan** harus dipisahkan dari **Saldo iklan/promosi** yang hanya dapat digunakan untuk campaign. Redemption harus tetap idempotent, diaudit, dimasking, dan diverifikasi manual sampai payout resmi benar-benar tersedia. Jangan mengklaim sponsor, saldo iklan, payout otomatis, atau provider affiliate yang belum aktif.

## Prioritas berikutnya

P0 berikutnya adalah kamus status global dan ledger immutable dengan `pending`, `available`, `redeemed`, alasan penyesuaian, timestamp, dan estimasi unlock. Setelah itu tambahkan leaderboard opt-in berbasis cohort/periode, target progres pribadi, disclosure siap pakai, QR/deep-link fallback, serta review legal/operasional Indonesia untuk payout, pajak, perlindungan konsumen, dan promosi.

## Sumber

- [Shopee Affiliate Program FAQ](https://help.shopee.sg/10/article/126383-Shopee-Affiliate-Program-FAQ)
- [Amazon Associates](https://affiliate-program.amazon.com/)
- [TikTok Shop Academy](https://seller-id.tokopedia.com/university/home?default_language=id-ID)
- [Branch — Referral UX insights](https://www.branch.io/resources/blog/ux-insights-referral-program-best-practices/)
- [impact.com — Fraud-proof referral program](https://help.impact.com/brand/what-would-you-like-to-learn-about/advocate-program/protect-your-advocate-program/design-a-fraud-proof-referral-program)
- [JMIR — Gamification and points](https://games.jmir.org/2022/3/e35907/)
- [JMIR — Leaderboards and social comparison](https://pmc.ncbi.nlm.nih.gov/articles/PMC8097522/)
- [FTC Endorsement Guides](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking)
- [Google Ads promotional credit policy](https://support.google.com/adspolicy/answer/1396257?hl=en)
- [TikTok Ads refund FAQ](https://ads.tiktok.com/resources/help/article/refund-faq?redirected=2)

Catatan: sumber terdiri dari dokumentasi vendor, panduan kepatuhan, dan studi akademik. Payout, pajak, perlindungan konsumen, privasi, dan disclosure yang berlaku untuk SUKI harus diverifikasi secara lokal sebelum peluncuran komersial.

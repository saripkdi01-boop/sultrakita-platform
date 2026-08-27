# SultraKita Phase 8 — Accessibility & Inclusivity Audit

## Scope

Perbaikan dilakukan di atas stack existing tanpa rebuild: API route, schema database, core marketplace logic, Supabase/PostgreSQL, Express, dan deployment Vercel tidak diubah.

## Audit awal

Homepage sudah memiliki sebagian focus-visible dan beberapa reduced-motion rules, tetapi belum memiliki skip link, forced-colors handling, atau target main yang dapat menerima fokus. `account.html` memuat stylesheet shared sehingga dapat memakai primitive global. Halaman legal memakai `legal.css` terpisah, sedangkan `chat.html` dan `admin.html` memakai CSS inline sehingga perlu aturan lokal.

## Implementasi

- Homepage, account, terms, dan privacy mendapat skip link berbahasa Indonesia yang menuju landmark main dengan `tabindex="-1"`.
- Shared `styles.css` mendapat focus-visible global, skip-link styling, reduced-motion yang mematikan animasi/transisi dan scroll behavior, serta fallback `forced-colors: active` untuk tombol, navigasi aktif, hero, banner, dan skip link.
- `public/app.js` menyetel `aria-busy="true"` selama fetch listing dan mengembalikannya ke `false` pada success maupun error.
- Ikon dekoratif sidebar dan bottom navigation homepage diberi `aria-hidden="true"`; label teks dan aria-label kontrol tetap dibacakan.
- `legal.css`, `chat.html`, dan `admin.html` mendapat primitive focus-visible, reduced motion, forced colors, serta skip-link masing-masing. Helper `.sr-only` pada chat juga diperbaiki.
- Cache-buster homepage/account/legal dinaikkan menjadi `phase8-a11y-1` pada stylesheet terkait.

## QA lokal

`git diff --check`, `npm run lint`, `npm run build`, `node --check public/app.js`, dan `node --test` telah dijalankan; lint/build/syntax lulus dan 7 integration test lokal ter-skip karena `DATABASE_URL` tidak tersedia.

Browser homepage lokal menemukan skip link, `main#beranda[tabindex="-1"]`, listing `aria-live="polite"` dengan `aria-busy="false"` setelah load, reduced motion/forced colors media query tersedia, dan 17 rule accessibility terdeteksi di CSSOM. Uji keyboard aktual dengan `Tab` pertama memfokuskan anchor `.skip-link`; CSSOM menunjukkan `top: 8px`. Menekan `Enter` mengubah URL ke `#beranda` dan memindahkan fokus aktif ke `MAIN#beranda` dengan `tabindex="-1"`. Pemeriksaan terakhir menemukan 11 ikon navigasi sidebar tersembunyi dari screen reader, `aria-live="polite"`, dan `aria-busy="false"`.

Halaman `terms.html` lokal juga tervalidasi: skip link tersedia, target `#legal-main` memakai `tabindex="-1"`, stylesheet `/legal.css?v=phase8-a11y-1` termuat, dan 7 rule focus/skip/reduced-motion/forced-colors terbaca dari CSSOM. Halaman `account.html` tervalidasi dengan skip link, target `#account-main[tabindex="-1"]`, shared stylesheet `/styles.css?v=phase8-a11y-1`, dan helper `.sr-only` tersedia. Halaman `chat.html` tervalidasi dengan skip link, target `#chat-main[tabindex="-1"]`, helper `.sr-only` yang benar-benar tersamarkan, serta 9 marker rule accessibility pada style inline. Admin telah diverifikasi secara statis melalui source setelah patch inline.

Fixture media tidak relevan untuk fase ini. Release/CI/live verification masih harus dilanjutkan.

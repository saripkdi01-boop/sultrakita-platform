# Ringkasan Prompt Settings & Privacy 2.0

Sumber: file pengguna `/home/ubuntu/upload/pasted_content.txt`, merujuk repository https://github.com/saripkdi01-boop/sultrakita-platform, production https://sultrakita-platform.vercel.app/, dan Supabase project URL https://ibvcfdfsjpytwpnxgylm.supabase.co.

Target: refactor/rebuild production-grade Settings & Privacy agar FRONTEND -> API -> service layer -> Supabase/PostgreSQL -> RLS -> frontend. Tidak boleh mockup/fake functionality, localStorage sebagai source of truth, endpoint duplicate, database paralel, atau menghapus marketplace.

UX: mobile-first responsive drawer dengan overlay, slide/fade, width 86–92vw mobile/max 390px, sticky header, scrollable content, safe area, body lock, ESC/overlay close, focus/ARIA. Referensi pola UX sosial modern/Facebook saja; branding dan visual tetap SultraKita. Drawer configuration-driven, tanpa deskripsi panjang pada compact mode; item icon SVG 24px/40–44px container, label 15–16px, row sekitar 56–64px. Group: Pengaturan & Privasi (account, preferences, notifications), Privasi & Keamanan (privacy center, checkup, security, devices), Aktivitas (time, promotions, link history, account activity), Transaksi (orders/payments), Data (information/download), Tampilan (dark mode/language/app icon), Lainnya (blocking/help/terms).

Registry: shared config dengan id, label/title, description, iconKey/icon name, route, api, authRequired, status. Drawer compact icon+label+optional chevron; full settings icon+title+description. Status active/coming_soon/disabled/admin_only; jangan tampilkan fitur backend belum siap sebagai aktif.

Backend canonical existing yang harus diaudit/reuse: GET/PATCH `/api/account/settings`; data export POST + download GET; deletion request POST/cancel; devices GET/DELETE; promotion activity GET; link history GET; data usage GET; time management GET/PATCH; orders GET; privacy checkup GET. Missing endpoints/features harus ditemukan sebelum menambah.

Database: Supabase PostgreSQL source of truth; gunakan migration additive, FK user yang benar, created_at/updated_at/index/check constraints, RLS private ownership, jangan raw IP, jangan service-role di browser. Prompt mengusulkan profiles, user_preferences, notification_preferences, privacy_settings, user_sessions, account_activity_logs, link_history, user_time_settings, promotion_preferences/activity, unified order/payment read model, data export jobs, deletion flow, privacy checkup. Tetap audit schema production dulu dan jangan buat duplicate jika tabel/kontrak existing sudah tersedia.

Security: semua settings endpoint membutuhkan auth; jangan percaya user_id request body; authenticated identity dan ownership wajib diverifikasi; payment success hanya dari verified webhook; export file private/signed URL; deletion memerlukan re-auth/confirmation/audit log.

Arsitektur code yang disarankan: pisahkan api/, services/, repositories/, validators/, middleware/auth dan rate-limit, tetapi pertahankan kompatibilitas runtime Express/CommonJS existing secara incremental.

Catatan audit awal lokal: registry sebelumnya telah ada tetapi memakai Unicode/iconKey yang belum semuanya SVG; drawer/settings renderer sudah ada; canonical router `/api/account/*` sudah tersedia; `security-events` masih missing/coming_soon; backend dan schema harus diaudit sebelum memperluas.

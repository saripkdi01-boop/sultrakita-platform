-- Production seed content for the CMS-driven SUKI ecosystem slider.
insert into public.ecosystem_banners (app_slug, eyebrow, title, description, image_url, cta_label, cta_href, priority, starts_at, ends_at, is_active)
select 'marketplace', 'SUKI Marketplace · Pilihan lokal', 'Belanja lebih dekat dengan kebutuhanmu.', 'Temukan produk, jasa, kuliner, dan karya lokal dari Sulawesi Tenggara.', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=85', 'Jelajahi listing', '/marketplace', 20, null, null, true
where not exists (select 1 from public.ecosystem_banners where app_slug = 'marketplace' and title = 'Belanja lebih dekat dengan kebutuhanmu.');
insert into public.ecosystem_banners (app_slug, eyebrow, title, description, image_url, cta_label, cta_href, priority, starts_at, ends_at, is_active)
select 'marketplace', 'SUKI Marketplace · Seller', 'Bangun toko yang dipercaya warga.', 'Kelola listing dan tumbuhkan pelanggan lokal dari satu ruang seller.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=85', 'Buka Seller Tools', '/marketplace/seller-tools', 19, null, null, true
where not exists (select 1 from public.ecosystem_banners where app_slug = 'marketplace' and title = 'Bangun toko yang dipercaya warga.');
insert into public.ecosystem_banners (app_slug, eyebrow, title, description, image_url, cta_label, cta_href, priority, starts_at, ends_at, is_active)
select 'jobs', 'SUKI Jobs · Peluang baru', 'Temukan pekerjaan yang membuatmu berkembang.', 'Cari peluang kerja berdasarkan posisi, skill, lokasi, dan sistem kerja.', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=85', 'Cari lowongan', '/jobs', 20, null, null, true
where not exists (select 1 from public.ecosystem_banners where app_slug = 'jobs' and title = 'Temukan pekerjaan yang membuatmu berkembang.');
insert into public.ecosystem_banners (app_slug, eyebrow, title, description, image_url, cta_label, cta_href, priority, starts_at, ends_at, is_active)
select 'jobs', 'SUKI Jobs · Perusahaan', 'Jangkau talenta terbaik Sulawesi Tenggara.', 'Terbitkan lowongan yang mudah ditemukan kandidat yang tepat.', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85', 'Pasang lowongan', '/jobs/create', 19, null, null, true
where not exists (select 1 from public.ecosystem_banners where app_slug = 'jobs' and title = 'Jangkau talenta terbaik Sulawesi Tenggara.');
insert into public.ecosystem_banners (app_slug, eyebrow, title, description, image_url, cta_label, cta_href, priority, starts_at, ends_at, is_active)
select 'suits', 'SUKI Suits · Hunian pilihan', 'Temukan hunian ideal di Sulawesi Tenggara.', 'Bandingkan rumah, kos, tanah, ruko, dan properti pilihan.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', 'Lihat properti', '/properti', 20, null, null, true
where not exists (select 1 from public.ecosystem_banners where app_slug = 'suits' and title = 'Temukan hunian ideal di Sulawesi Tenggara.');
insert into public.ecosystem_banners (app_slug, eyebrow, title, description, image_url, cta_label, cta_href, priority, starts_at, ends_at, is_active)
select 'suits', 'SUKI Suits · Seller', 'Pasarkan properti dengan lebih terpercaya.', 'Lengkapi foto, fasilitas, dokumen, dan lokasi agar calon pembeli lebih yakin.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=85', 'Pasang properti', '/properti/create', 19, null, null, true
where not exists (select 1 from public.ecosystem_banners where app_slug = 'suits' and title = 'Pasarkan properti dengan lebih terpercaya.');

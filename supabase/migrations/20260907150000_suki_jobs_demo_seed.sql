-- SUKI Jobs demo hardening and high-fidelity mock seed.
-- No direct scraping: all companies and postings below are fictional demo data.

create or replace function public.is_suki_jobs_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'employer')
    and coalesce((auth.jwt() -> 'app_metadata' ->> 'verified')::boolean, false),
    false
  );
$$;

revoke all on function public.is_suki_jobs_manager() from public;
grant execute on function public.is_suki_jobs_manager() to anon, authenticated;

drop policy if exists companies_owner_insert on public.companies;
create policy companies_manager_insert on public.companies
  for insert to authenticated
  with check (public.is_suki_jobs_manager() and auth.uid() = created_by);

drop policy if exists jobs_owner_insert on public.jobs;
create policy jobs_manager_insert on public.jobs
  for insert to authenticated
  with check (public.is_suki_jobs_manager() and auth.uid() = created_by);

drop policy if exists jobs_manager_update on public.jobs;
create policy jobs_manager_update on public.jobs
  for update to authenticated
  using (public.is_suki_jobs_manager())
  with check (public.is_suki_jobs_manager());

drop policy if exists jobs_manager_delete on public.jobs;
create policy jobs_manager_delete on public.jobs
  for delete to authenticated
  using (public.is_suki_jobs_manager());

drop policy if exists companies_manager_update on public.companies;
create policy companies_manager_update on public.companies
  for update to authenticated
  using (public.is_suki_jobs_manager())
  with check (public.is_suki_jobs_manager());

drop policy if exists companies_manager_delete on public.companies;
create policy companies_manager_delete on public.companies
  for delete to authenticated
  using (public.is_suki_jobs_manager());

insert into public.companies (name, slug, description, industry, company_size, location, district, city, province, benefits, is_verified, rating, total_reviews)
values
  ('PT Sultra Konstruksi Jaya', 'pt-sultra-konstruksi-jaya', 'Perusahaan konstruksi dan pengembangan kawasan yang mendukung pertumbuhan industri Sulawesi Tenggara.', 'Konstruksi', '51-200', 'Kecamatan Molawe, Kabupaten Konawe Utara', 'Molawe', 'Konawe Utara', 'Sulawesi Tenggara', array['BPJS Kesehatan','BPJS Ketenagakerjaan','Tunjangan site'], true, 4.6, 18),
  ('CV Muna Logistik Mandiri', 'cv-muna-logistik-mandiri', 'Mitra logistik lokal untuk distribusi antarpulau dan rantai pasok usaha Muna Barat.', 'Logistik dan Transportasi', '11-50', 'Kecamatan Tiworo Tengah, Kabupaten Muna Barat', 'Tiworo Tengah', 'Muna Barat', 'Sulawesi Tenggara', array['Uang makan','Insentif operasional','Pelatihan keselamatan'], true, 4.4, 11),
  ('Kendari Tech Solutions', 'kendari-tech-solutions', 'Studio teknologi yang membangun produk digital untuk bisnis dan komunitas di Indonesia Timur.', 'Teknologi Informasi', '11-50', 'Kecamatan Kadia, Kota Kendari', 'Kadia', 'Kendari', 'Sulawesi Tenggara', array['Kerja hybrid','Perangkat kerja','Mentoring'], true, 4.8, 24),
  ('Koperasi Bahari Konawe Utara', 'koperasi-bahari-konawe-utara', 'Koperasi yang mengembangkan layanan perdagangan dan pemberdayaan ekonomi pesisir.', 'Perdagangan', '11-50', 'Kecamatan Lasolo, Kabupaten Konawe Utara', 'Lasolo', 'Konawe Utara', 'Sulawesi Tenggara', array['Insentif target','BPJS','Jadwal kerja teratur'], false, 4.1, 6),
  ('Yayasan Cerdas Muna Barat', 'yayasan-cerdas-muna-barat', 'Organisasi pendidikan yang memperluas akses belajar berkualitas untuk anak-anak daerah.', 'Pendidikan', '11-50', 'Kecamatan Tiworo Kepulauan, Kabupaten Muna Barat', 'Tiworo Kepulauan', 'Muna Barat', 'Sulawesi Tenggara', array['Tunjangan transport','Pengembangan profesional'], true, 4.5, 9)
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, location = excluded.location, district = excluded.district,
  city = excluded.city, benefits = excluded.benefits, is_verified = excluded.is_verified, rating = excluded.rating,
  total_reviews = excluded.total_reviews;

with job_seed (company_slug, title, slug, description, requirements, responsibilities, job_type, work_type, experience_level, salary_min, salary_max, location, district, city, skills, is_featured) as (
  values
    ('pt-sultra-konstruksi-jaya','Land Acquisition Officer','land-acquisition-officer-konut','Kelola proses identifikasi, negosiasi, dan dokumentasi lahan untuk proyek konstruksi kawasan di Konawe Utara.',array['S1 Hukum, Agribisnis, atau bidang relevan','Minimal 2 tahun pengalaman akuisisi lahan','Mampu berkomunikasi dengan pemangku kepentingan lokal'],array['Memetakan calon lahan dan status dokumen','Membangun hubungan dengan pemilik lahan dan pemerintah desa'], 'full_time','onsite','mid',7000000,10000000,'Kecamatan Molawe, Kabupaten Konawe Utara','Molawe','Konawe Utara',array['Land Acquisition','Negosiasi','Legal Review'],true),
    ('pt-sultra-konstruksi-jaya','Site Engineer Infrastruktur','site-engineer-infrastruktur-konut','Pastikan pekerjaan lapangan berjalan sesuai gambar kerja, spesifikasi teknis, jadwal, dan standar keselamatan.',array['S1 Teknik Sipil','Memahami AutoCAD dan pengukuran lapangan','Bersedia ditempatkan di site Konawe Utara'],array['Mengawasi progres pekerjaan harian','Menyusun laporan mutu dan progres proyek'], 'full_time','onsite','mid',8500000,12500000,'Kecamatan Lasolo, Kabupaten Konawe Utara','Lasolo','Konawe Utara',array['Teknik Sipil','AutoCAD','K3'],true),
    ('koperasi-bahari-konawe-utara','Manajer Toko Bangunan','manajer-toko-bangunan-konut','Pimpin operasional toko bahan bangunan, kelola stok, dan kembangkan layanan pelanggan untuk kontraktor lokal.',array['Minimal D3 Manajemen atau pengalaman setara','3 tahun pengalaman retail atau distribusi','Terbiasa menggunakan aplikasi inventori'],array['Mengatur target penjualan dan tim toko','Menjaga akurasi stok dan hubungan pemasok'], 'full_time','onsite','manager',6000000,9000000,'Kecamatan Asera, Kabupaten Konawe Utara','Asera','Konawe Utara',array['Retail Management','Inventory','Leadership'],false),
    ('cv-muna-logistik-mandiri','Administrasi Pelabuhan','administrasi-pelabuhan-mubar','Dukung pencatatan dokumen muatan, jadwal kapal, dan koordinasi administrasi operasional pelabuhan.',array['Minimal D3 Administrasi atau Logistik','Teliti dan mampu bekerja dengan tenggat waktu','Mahir Microsoft Office'],array['Memeriksa dokumen pengiriman','Merekonsiliasi manifest dan laporan harian'], 'full_time','onsite','entry',4000000,5500000,'Kecamatan Tiworo Tengah, Kabupaten Muna Barat','Tiworo Tengah','Muna Barat',array['Administrasi','Microsoft Office','Dokumentasi'],true),
    ('cv-muna-logistik-mandiri','Staff Logistik Rantai Pasok','staff-logistik-rantai-pasok-mubar','Kelola alur barang dari gudang ke pelanggan dan pastikan pengiriman tercatat dengan akurat.',array['SMA/SMK atau D3 Logistik','Pengalaman 1 tahun menjadi nilai tambah','Memiliki SIM C dan mengenal wilayah Muna Barat'],array['Menyiapkan picking list dan surat jalan','Memantau status pengiriman dan retur'], 'contract','onsite','entry',3500000,5000000,'Kecamatan Sawerigadi, Kabupaten Muna Barat','Sawerigadi','Muna Barat',array['Warehouse','Delivery Coordination','Stock Control'],false),
    ('yayasan-cerdas-muna-barat','Guru Privat Matematika','guru-privat-matematika-mubar','Bimbing siswa SMP dan SMA dengan pendekatan belajar yang kontekstual dan menyenangkan.',array['S1 Pendidikan Matematika atau bidang terkait','Memiliki pengalaman mengajar atau les privat','Bersedia mengajar sore dan akhir pekan'],array['Menyusun rencana belajar personal','Memberikan umpan balik perkembangan siswa'], 'part_time','onsite','mid',3000000,5000000,'Kecamatan Tiworo Kepulauan, Kabupaten Muna Barat','Tiworo Kepulauan','Muna Barat',array['Matematika','Tutoring','Lesson Planning'],false),
    ('kendari-tech-solutions','Digital Marketing Specialist','digital-marketing-specialist-kendari','Rancang kampanye digital yang membantu UMKM dan bisnis lokal tumbuh secara terukur.',array['S1 Marketing, Komunikasi, atau setara','2 tahun pengalaman social media atau performance marketing','Mampu membaca insight dan membuat laporan kampanye'],array['Menyusun kalender konten','Mengoptimalkan iklan digital dan mengevaluasi hasil'], 'full_time','hybrid','mid',5500000,8500000,'Kecamatan Kadia, Kota Kendari','Kadia','Kendari',array['Digital Marketing','Meta Ads','Analytics'],true),
    ('kendari-tech-solutions','Full Stack Developer','full-stack-developer-kendari','Bangun fitur web end-to-end untuk produk digital yang dipakai oleh pengguna di berbagai daerah.',array['Pengalaman dengan TypeScript dan React','Memahami API, SQL, dan Git','Mampu bekerja kolaboratif dalam tim kecil'],array['Mengembangkan dan menguji fitur produk','Menjaga kualitas code melalui review dan dokumentasi'], 'full_time','hybrid','mid',9000000,15000000,'Kecamatan Mandonga, Kota Kendari','Mandonga','Kendari',array['Next.js','TypeScript','PostgreSQL'],true),
    ('kendari-tech-solutions','Customer Success Officer','customer-success-officer-kendari','Dampingi pelanggan menggunakan produk digital dan ubah masukan menjadi perbaikan layanan.',array['D3/S1 semua jurusan','Komunikasi tertulis dan lisan yang baik','Pengalaman CRM menjadi nilai tambah'],array['Menjawab pertanyaan pelanggan','Mencatat kebutuhan dan berkoordinasi dengan tim produk'], 'full_time','onsite','entry',4000000,6000000,'Kecamatan Wua-Wua, Kota Kendari','Wua-Wua','Kendari',array['Customer Service','CRM','Communication'],false),
    ('pt-sultra-konstruksi-jaya','Safety Officer Proyek','safety-officer-proyek-konut','Bangun budaya kerja aman dan pastikan kepatuhan prosedur K3 di area proyek.',array['S1 K3 atau sertifikasi K3 relevan','Pengalaman proyek konstruksi minimal 2 tahun','Mampu melakukan toolbox meeting'],array['Melakukan inspeksi area kerja','Menyusun laporan insiden dan tindakan korektif'], 'contract','onsite','senior',7500000,11000000,'Kecamatan Oheo, Kabupaten Konawe Utara','Oheo','Konawe Utara',array['K3','Risk Assessment','Incident Reporting'],false),
    ('cv-muna-logistik-mandiri','Sales Representative B2B','sales-representative-b2b-mubar','Kembangkan relasi dengan toko, kontraktor, dan pelaku usaha untuk memperluas layanan distribusi.',array['Minimal SMA/SMK','Berorientasi target dan nyaman melakukan kunjungan','Memiliki kendaraan pribadi'],array['Mencari prospek baru','Menyusun penawaran dan menjaga relasi pelanggan'], 'full_time','onsite','entry',4000000,7000000,'Kecamatan Barangka, Kabupaten Muna Barat','Barangka','Muna Barat',array['B2B Sales','Negotiation','Account Management'],false),
    ('yayasan-cerdas-muna-barat','Koordinator Program Literasi','koordinator-program-literasi-mubar','Kelola program literasi komunitas dan koordinasi relawan untuk kegiatan belajar di desa.',array['S1 Pendidikan, Sosiologi, atau bidang relevan','Pengalaman mengelola kegiatan komunitas','Mampu menyusun proposal dan laporan'],array['Menyusun jadwal dan indikator program','Berkoordinasi dengan sekolah dan mitra lokal'], 'contract','onsite','mid',5000000,7500000,'Kecamatan Kusambi, Kabupaten Muna Barat','Kusambi','Muna Barat',array['Community Development','Program Management','Reporting'],false)
)
insert into public.jobs (company_id, title, slug, description, requirements, responsibilities, job_type, work_type, experience_level, salary_min, salary_max, is_salary_hidden, location, district, city, province, is_remote, benefits, skills, education_level, positions_available, status, published_at, is_featured)
select c.id, s.title, s.slug, s.description, s.requirements, s.responsibilities, s.job_type, s.work_type, s.experience_level, s.salary_min, s.salary_max, false, s.location, s.district, s.city, 'Sulawesi Tenggara', false, c.benefits, s.skills, null, 1, 'published', now() - ((row_number() over (order by s.slug))::int || ' days')::interval, s.is_featured
from job_seed s join public.companies c on c.slug = s.company_slug
on conflict (company_id, slug) do update set
  title = excluded.title, description = excluded.description, requirements = excluded.requirements, responsibilities = excluded.responsibilities,
  job_type = excluded.job_type, work_type = excluded.work_type, experience_level = excluded.experience_level, salary_min = excluded.salary_min,
  salary_max = excluded.salary_max, is_salary_hidden = excluded.is_salary_hidden, location = excluded.location, district = excluded.district,
  city = excluded.city, benefits = excluded.benefits, skills = excluded.skills, status = 'published', published_at = excluded.published_at,
  is_featured = excluded.is_featured;

update public.companies c set total_jobs = (select count(*) from public.jobs j where j.company_id = c.id and j.status = 'published');

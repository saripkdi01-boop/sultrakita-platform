-- Import direktori perumahan SiKumbang BP Tapera (Sulawesi Tenggara)
-- Sumber: https://sikumbang.tapera.go.id/ | Data agregat direktori, BUKAN listing SUKI.
-- Jalankan di Supabase SQL Editor. Idempotent: lewati slug yang sudah ada.

INSERT INTO public.properties (id,seller_id,category,property_type,title,slug,description,province,city,regency_name,district,subdistrict_name,address_detail,postal_code,latitude,longitude,maps_link,price,price_type,is_negotiable,bedrooms,bathrooms,building_area_sqm,land_area_sqm,floors,images,amenities,subsidy_program,can_kpr,certificate_type,condition,status,is_admin_verified,is_featured,views_count,favorites_count,inquiries_count,published_at,ai_generated)
SELECT
  v.id::uuid,
  v.seller_id::uuid,
  v.category,
  v.property_type,
  v.title,
  v.slug,
  v.description,
  v.province,
  v.city,
  v.regency_name,
  v.district,
  v.subdistrict_name,
  v.address_detail,
  v.postal_code,
  v.latitude,
  v.longitude,
  v.maps_link,
  v.price,
  v.price_type,
  v.is_negotiable,
  v.bedrooms,
  v.bathrooms,
  v.building_area_sqm::integer,
  v.land_area_sqm::integer,
  v.floors,
  v.images::text[],
  v.amenities::text[],
  v.subsidy_program,
  v.can_kpr,
  v.certificate_type,
  v.condition,
  v.status,
  v.is_admin_verified,
  v.is_featured,
  v.views_count,
  v.favorites_count,
  v.inquiries_count,
  v.published_at::timestamptz,
  v.ai_generated
FROM (VALUES
('85b48168-8b63-406a-b611-304531d79d30',NULL,'rumah_subsidi','rumah_tapak','GREEN DIRLAND RESIDENCE 3','sikumbang-kdi0910022024t005','GREEN DIRLAND RESIDENCE 3 oleh PT NASYATUL DIRU UTAMA (APPERNAS JAYA).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 m2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SUPU YUSUF; Telp: 081355055067; Email: priyanto.joko9655@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9619909722222224,122.477861,'https://www.google.com/maps?q=-3.9619909722222224,122.477861',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1707923381322-7c21a4f5-6c77-48b7-8c95-9a9b3aa56f54.jpg","https://sikumbang.tapera.go.id/public/upload/1707923327740-5644b0f9-5d2b-46c8-8314-3b710bc3274b.jpg","https://sikumbang.tapera.go.id/public/upload/1707923354412-bc37e0b9-7379-4e13-80ad-e4a628d49df6.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0f7923d3-141b-44f0-8739-27d3ddc15a28',NULL,'rumah_subsidi','rumah_tapak','AL FATH PUUWATU','sikumbang-kdi0910022024t006','AL FATH PUUWATU oleh PT MAHA KARYA HALUOLEO (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 36 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Abunawas; Telp: 082333999914; Email: haluoleoproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.964611111111111,122.47928333333334,'https://www.google.com/maps?q=-3.964611111111111,122.47928333333334',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1708326018284-b12ec4ec-44ad-44c4-8e27-786d540db8e5.jpg","https://sikumbang.tapera.go.id/public/upload/1708326016701-c0e2aed5-2ab3-436a-b26e-2ec7b6e03144.jpg","https://sikumbang.tapera.go.id/public/upload/1708326019346-4ba343a8-a9bd-4e79-8254-3bf65863cbb4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7131c746-59a9-4042-8071-44bd877aa82c',NULL,'rumah_subsidi','rumah_tapak','GRIYA CITRA WUA-WUA','sikumbang-kdi0710012024t001','GRIYA CITRA WUA-WUA oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 112 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com; Web: https://maps.app.goo.gl/3V6S661ML3d15e727

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.9933578888888888,122.47749327777778,'https://www.google.com/maps?q=-3.9933578888888888,122.47749327777778',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1705298288039-a2ce587c-1870-4904-ba04-e2f297d3f075.jpg","https://sikumbang.tapera.go.id/public/upload/1705298286139-c4b4c8f1-2509-43af-a97d-6013baf33ded.jpg","https://sikumbang.tapera.go.id/public/upload/1705298286701-9c71894f-68ac-4011-bfc4-7a8e3c0f0a11.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ca06e62d-d62a-4ac8-992d-beabaa194006',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN GREEN HOUSE','sikumbang-kdi0410042023t005','PERUMAHAN GREEN HOUSE oleh PT GEMILANG TAMARA MANDIRI (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / -2 KM, 1 lantai.
- subsidi (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / -2 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. KAYU MANIS (EKS. JL. BANTENG) PERUMAHAN MUTIARA GEMILANG BLOK C NO 1; Telp: 082293779997; Email: taufikusman778@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042023T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.018066666666667,122.55748055555556,'https://www.google.com/maps?q=-4.018066666666667,122.55748055555556',168000000.0,'total',FALSE,2,-2,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1701936089953-cf5a9f73-91f9-4eac-bad7-43a71b2d5290.jpg","https://sikumbang.tapera.go.id/public/upload/1701936082863-b38a8c49-b034-41a0-ad5d-8c70e37ad8f9.jpg","https://sikumbang.tapera.go.id/public/upload/1701936087306-c4fb4e84-b3ae-4fc7-95bc-d1f605e365d8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8e7d9db8-bc2a-4aa3-99f7-b7a887e67ad0',NULL,'rumah_subsidi','rumah_tapak','RESKITA HOMBIS','sikumbang-kdi0310082023t007','RESKITA HOMBIS oleh PT IRFAN JAYA SULTRA (PI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 35 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36 baru (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: btn reskita anawai ; Telp: 0852 5931 5320; Email: reskitagroupid@gmail.com; Web: https://forms.gle/tdHmjZCk2XziDBM29

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082023T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.017136,122.484196,'https://www.google.com/maps?q=-4.017136,122.484196',168000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1699270625256-56a5d623-b752-4468-9e60-e43c1c512441.jpg","https://sikumbang.tapera.go.id/public/upload/1699270573675-995c0654-2b83-44dc-a4c8-b387674e069f.jpg","https://sikumbang.tapera.go.id/public/upload/1699270573720-09a0812a-d9ac-49b3-b293-2ef294814b18.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bdc473be-e665-4a6e-be42-f14ca7d74c20',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN NUR CAHAYA RESIDEN','sikumbang-kdi0910012023t007','PERUMAHAN NUR CAHAYA RESIDEN oleh PT REZKY NUR PRATAMA (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36/96 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Tunggala Dalam RT. 003 RW. 006 ; Telp: 082210397161; Email: suprieva811@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012023T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9879670000000003,122.477835,'https://www.google.com/maps?q=-3.9879670000000003,122.477835',168000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1699042772956-5ccfe66b-bc5c-4610-824c-16b9218d76a4.jpeg","https://sikumbang.tapera.go.id/public/upload/1699042774740-96ab2870-9084-4ddd-8580-ec57bbf50af9.jpg","https://sikumbang.tapera.go.id/public/upload/1699042797681-6c68748e-eb67-4736-9eb7-d9accf14cc86.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d2ec7955-21cc-4540-baf9-e0f1f10c5beb',NULL,'rumah_subsidi','rumah_tapak','GRAND ANDIKA 8','sikumbang-kdi0410042023t004','GRAND ANDIKA 8 oleh PT JAYA ANDIKA PERKASA (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 159.600.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Lingkungan pada Jl. Kayu Manis; Telp: 082259912266; Email: pt.jap2020@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.027713888888889,122.55756111111111,'https://www.google.com/maps?q=-4.027713888888889,122.55756111111111',159600000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/1699343173725-619950c4-a074-46fa-928e-45280c1c1a32.jpg","https://sikumbang.tapera.go.id/public/upload/1699343172529-e0c1449e-716b-4b77-a18d-9cf3edad32d8.jpg","https://sikumbang.tapera.go.id/public/upload/1699343175627-314a4686-5229-44d1-b0dc-5707d484b123.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fdf86dc2-7224-41e1-9bf9-44011c14916d',NULL,'rumah_subsidi','rumah_tapak','DJAVINO RESIDENCE VI','sikumbang-kdi0310072023t008','DJAVINO RESIDENCE VI oleh PT DJAVINO GRUP INDONESIA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. ADE IRMA NASUTION ; Telp: 082368884546; Email: Djavinogroup@gmail.com; Web: www.djavinogroup.comm

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072023T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0195875,122.4819281,'https://www.google.com/maps?q=-4.0195875,122.4819281',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1699690720339-f66dff4e-c641-4c11-9419-5722a9d95bd6.jpg","https://sikumbang.tapera.go.id/public/upload/1699690721075-2732348a-32bf-4293-b68d-33abf6621322.jpg","https://sikumbang.tapera.go.id/public/upload/1699690721677-b5fa599d-2f2e-4aa3-b8a3-b43570066c1e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6e959109-cbcd-44f1-9138-4dcb9fe9f287',NULL,'rumah_subsidi','rumah_tapak','PURI MAGAHA','sikumbang-kdi0310082023t008','PURI MAGAHA oleh PT MAGAHA PERKASA PROPERTY (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JLN DI PANJAITAN; Telp: 08114009278; Email: mppkendari80@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082023T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0228,122.49717777777778,'https://www.google.com/maps?q=-4.0228,122.49717777777778',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1698477058207-20ca5711-5150-47ed-a547-c3e02ef65caf.jpg","https://sikumbang.tapera.go.id/public/upload/1698477058317-7e0ec90f-7be8-425f-81c5-823c43094b8b.jpg","https://sikumbang.tapera.go.id/public/upload/1698477058528-caa9396c-4247-4f23-9230-76ba65c9a3b2.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d981aca5-c7fd-4fc0-b0da-834ffa189bd6',NULL,'rumah_subsidi','rumah_tapak','TELUK KENDARI LAND','sikumbang-kdi0610082023t001','TELUK KENDARI LAND oleh ARIN DUA PUTRA (HIMPERRA).
Alamat: Poasia, Kec. Abeli, Kota Kendari, Sulawesi Tenggara.
Total unit: 32 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jL. Malaka Komp Ruko Andonohu Square ; Telp: 0812-8439-4799; Email: arinduaputrakendari@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0610082023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Abeli','Poasia','Poasia, Kec. Abeli, Kota Kendari, Sulawesi Tenggara',NULL,-3.987908263533111,122.58907791227335,'https://www.google.com/maps?q=-3.987908263533111,122.58907791227335',168000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1701266891972-54fe615c-2e37-401f-8453-606632c64c3c.jpg","https://sikumbang.tapera.go.id/public/upload/1701266891967-b953ba13-b7ef-49f5-ac8f-3a6f9cbcd391.jpg","https://sikumbang.tapera.go.id/public/upload/1701266891989-419d4e70-2743-411f-a533-4108ba743755.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3d32fafb-18f7-4c5e-9124-e015811e7598',NULL,'rumah_subsidi','rumah_tapak','SHAFA MARWAH RESIDENCE 2','sikumbang-kdi0910022023t009','SHAFA MARWAH RESIDENCE 2 oleh PT GETRACO TIMUR PERSADA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 94.5 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 94.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ade Irma II; Telp: 085242016538; Email: getracotimurpersada@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022023T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9858731,122.4799248,'https://www.google.com/maps?q=-3.9858731,122.4799248',168000000.0,'total',FALSE,2,1,36,94.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1701754152258-77d657e5-9882-4eb9-b9bd-d3982a069918.jpg","https://sikumbang.tapera.go.id/public/upload/1701754152862-9bd960c8-65db-490a-9860-a99c3b5d179d.jpg","https://sikumbang.tapera.go.id/public/upload/1701754154284-905682db-e097-4735-9cde-d8dc2c4fb86b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('380bd3e5-64dd-4927-aac4-021825fdfdfa',NULL,'rumah_subsidi','rumah_tapak','MARGAHAYU REGENCY KAMBU I','sikumbang-kdi1010022023t007','MARGAHAYU REGENCY KAMBU I oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. H. SUPU YUSUF ; Telp: 0811405887; Email: margahayumegautama@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022023T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.033774199722222,122.54113279972222,'https://www.google.com/maps?q=-4.033774199722222,122.54113279972222',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1702368815682-4dc4eb65-1b90-48e4-a231-e19c54532acc.jpg","https://sikumbang.tapera.go.id/public/upload/1702368815661-d86c8539-a902-41fe-bc73-39a7fc40c953.jpg","https://sikumbang.tapera.go.id/public/upload/1702368815719-961847e2-0bf5-4e7a-ac3a-8e1fe454f5f3.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('68be9103-766f-49e7-b21e-728fa8b5c254',NULL,'rumah_subsidi','rumah_tapak','KOTA PRAJA KENDARI','sikumbang-kdi1010032023t001','KOTA PRAJA KENDARI oleh PT HARWIN JAYA BAROKAH PROPERTY (HIMPERRA).
Alamat: Padaleu, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 36 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Praja Boulevar; Telp: 085398786061; Email: jayaharwin@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010032023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Padaleu','Padaleu, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.0312777777777775,122.521675,'https://www.google.com/maps?q=-4.0312777777777775,122.521675',168000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1702710509529-670cfdd7-cf37-49b5-856e-6bf87590947a.JPG","https://sikumbang.tapera.go.id/public/upload/1702710509574-acb6bb06-e4b9-469c-854b-577ad044a7b5.JPG","https://sikumbang.tapera.go.id/public/upload/1702710509597-45ed570c-960a-43fb-a453-aa5ccf147528.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7d04a4ce-917a-4643-8cf1-43e24574ef57',NULL,'rumah_subsidi','rumah_tapak','BUKIT TASAHEA PERMAI 2','sikumbang-trw0120062023t001','BUKIT TASAHEA PERMAI 2 oleh PT ANUGERAH LAPPABUKA PERMAI (REI).
Alamat: Tababu, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 61 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.
- KPR Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. POROS RATERATE - LADONGI; Telp: 081386714009; Email: mieschaliedmawardi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120062023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Tababu','Tababu, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.0521255,121.8879577,'https://www.google.com/maps?q=-4.0521255,121.8879577',168000000.0,'total',FALSE,2,1,36,150,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/23/fotoContoh-97648a00-2263-440d-b4df-5212beb73a0f.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/23/fotoGerbang--49878c17-4dac-44b4-a7e3-88ee9b5883a6.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/23/fotoTengah-06b04fd6-bb83-402c-9ca2-bc97681dcc39.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b5c1fd03-cab4-4e48-97bf-49c17dd0172c',NULL,'rumah_subsidi','rumah_tapak','GRIYA CITRA PUUWATU','sikumbang-kdi0910052023t001','GRIYA CITRA PUUWATU oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Abeli Dalam, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com; Web: https://maps.app.goo.gl/viJWc2dHFiqqP97t5

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910052023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Abeli Dalam','Abeli Dalam, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9739799444444444,122.45310211111111,'https://www.google.com/maps?q=-3.9739799444444444,122.45310211111111',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1702968614248-044fdfd8-bf3a-48ce-af82-c426ea79c09f.jpg","https://sikumbang.tapera.go.id/public/upload/1702968610276-2cefa5a2-ac2e-4a6a-b7ac-eb9f7f972e85.jpg","https://sikumbang.tapera.go.id/public/upload/1702968701342-c6e1a545-76d9-417f-9ca6-cc1979e6fa44.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('29e4be85-b574-4ef8-9c91-e00ae55b3583',NULL,'rumah_subsidi','rumah_tapak','QUEEN LUCKY RESIDENCE','sikumbang-kdi0910032023t003','QUEEN LUCKY RESIDENCE oleh PT UNIVERSAL MODERN GROUP (APERSI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.
- 36 subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. JENDRAL A.H NASUTION LR. SEPAKAT; Telp: 085255537563; Email: ptuniversalmoderngroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.959658055555556,122.4884263888889,'https://www.google.com/maps?q=-3.959658055555556,122.4884263888889',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1703133742911-62be7a77-4fe1-4614-8e78-80415826f2ea.jpg","https://sikumbang.tapera.go.id/public/upload/1703133743427-f4c8a7d5-5176-4c4f-af77-fc093542f546.jpg","https://sikumbang.tapera.go.id/public/upload/1703133742900-490e8f0a-15fe-4a8b-9197-0d44747597b9.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e75c0b4b-8590-4236-8300-0a6fadaebb8a',NULL,'rumah_subsidi','rumah_tapak','ATHIRAH BARUGA 4','sikumbang-kdi0310012023t009','ATHIRAH BARUGA 4 oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 081245833044; Email: Ilyasathirah4@gmail.com; Web: https://maps.app.goo.gl/aB6ZCdKeJbsZhVhX8

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012023T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.046103944444444,122.49652097222223,'https://www.google.com/maps?q=-4.046103944444444,122.49652097222223',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1703056081885-a7168b44-3e55-4eea-8e96-994aa2e9ec09.jpg","https://sikumbang.tapera.go.id/public/upload/1703056081380-31406724-edd9-4938-8db2-9b9d6022678c.jpg","https://sikumbang.tapera.go.id/public/upload/1703056081392-5df3da6e-0fbb-4f5a-9c53-c4a230547b39.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4d9da976-ffd3-4bd0-809a-67f89e272be9',NULL,'rumah_subsidi','rumah_tapak','A99 CORP LAND TAHAP III','sikumbang-kdi0910032023t004','A99 CORP LAND TAHAP III oleh PT AGFE JAYA PROPERTINDO (HIMPERRA).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 96 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LALOMBAKU BTN GRIYA OASE BLOK A; Telp: 085145799995; Email: pt.agfejayapropertindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9612558333333334,122.48854083333333,'https://www.google.com/maps?q=-3.9612558333333334,122.48854083333333',156500000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/upload/1703321623563-54ce9771-f6a2-45c6-a83a-91f7ed2fae0a.jpg","https://sikumbang.tapera.go.id/public/upload/1703321629414-64add6f6-7b64-44a5-bb70-af34733b6384.jpg","https://sikumbang.tapera.go.id/public/upload/1703321628516-c6e1f091-193a-4b5c-bdbc-84ce2dab784c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('428af437-fb4b-4f07-a2d8-fe4588196416',NULL,'rumah_subsidi','rumah_tapak','PERMATA CALISTA','sikumbang-kdi1010022023t008','PERMATA CALISTA oleh PT PERMATA BERKAH KENDARI (REI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 Subsidi (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Piere Tendean ; Telp: 08114000228; Email: permataberkah.kdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022023T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.0376055555555554,122.55257777777777,'https://www.google.com/maps?q=-4.0376055555555554,122.55257777777777',168000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1702687552637-77185183-c509-47e1-9144-e5f189cd9a17.jpg","https://sikumbang.tapera.go.id/public/upload/1702687536319-f65d8e8f-7dc2-4977-aa35-99578ce00613.jpg","https://sikumbang.tapera.go.id/public/upload/1702687546343-55c74b27-2c19-4e11-a4f9-b725256acdd7.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('83f088af-1c02-4e94-af99-dc2c96624d6d',NULL,'rumah_subsidi','rumah_tapak','BINTANG RESIDENCE','sikumbang-kdi0410042023t006','BINTANG RESIDENCE oleh PT WAKUMORO JAYA PROPERTINDO (APERSI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kayu Manis (Ex. Jl. Banteng) BTN Al-Dzakiy Residence; Telp: 085242467819; Email: wakumorojayapropertindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042023T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.033542138888889,122.55855558333333,'https://www.google.com/maps?q=-4.033542138888889,122.55855558333333',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1703578579111-06bcd9e0-60d3-433b-a32b-edd53f6161c5.jpg","https://sikumbang.tapera.go.id/public/upload/1703578581515-f27d7736-d737-4919-8ebe-7a3a06758fd6.jpg","https://sikumbang.tapera.go.id/public/upload/1703578583367-d8dbc9fc-06af-48f2-b9e4-c09f4669493f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ed6c2fa5-b424-43a4-8aae-b5a3287575f8',NULL,'rumah_subsidi','rumah_tapak','FAHMI RESIDENCE 3','sikumbang-adl0810012023t002','FAHMI RESIDENCE 3 oleh PT PERMATA TIRTA JAYA (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36/ 97,5 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: KELURAHAN RANOMEETO KECAMATAN RANOMEETO KABUPATEN KONAWE SELATAN; Telp: 081342813438; Email: residencepermata28@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.049230555555555,122.46817222222222,'https://www.google.com/maps?q=-4.049230555555555,122.46817222222222',173000000.0,'total',FALSE,2,1,36,97.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1702367071452-24b0fa9e-813b-441b-ad3d-4d72f1975126.JPG","https://sikumbang.tapera.go.id/public/upload/1702367069986-678b02e4-326e-4849-913a-27197c6e9efd.JPG","https://sikumbang.tapera.go.id/public/upload/1702367071067-f8d7fa6d-7f76-479e-b926-9acd6c6ae65e.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d89ddf51-8926-4262-86b1-ccac3a285f76',NULL,'rumah_subsidi','rumah_tapak','Queensha Residence 2','sikumbang-kdi0410062023t002','Queensha Residence 2 oleh PT UNIVERSAL MODERN GROUP (APERSI).
Alamat: Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Jambu Putih, Perumahan Queensha Residence, Matbubu Poasia; Telp: 085255537563; Email: pt.universalmoderngroup@gmail.com; Web: www.ptuniversalmoderngroup.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410062023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Matabubu','Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.002361666666666,122.56531249999999,'https://www.google.com/maps?q=-4.002361666666666,122.56531249999999',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1694584551306-cff45333-1829-4632-beea-40ce7b8749cb.jpg","https://sikumbang.tapera.go.id/public/upload/1694584549398-8888c2c3-d5fa-4cc1-93d0-1d8268c85189.jpg","https://sikumbang.tapera.go.id/public/upload/1694584550205-1c75fc54-cb6c-4453-a860-0724d9a9c942.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f29c2bf2-86f4-4623-a5c3-63186b18011e',NULL,'rumah_subsidi','rumah_tapak','INTAN BATARI REGENCY 3','sikumbang-kdi0910012023t005','INTAN BATARI REGENCY 3 oleh PT INTAN BATARI ISKANDAR (AB).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. CHAIRIL ANWAR ; Telp: 082238192098 085311458478; Email: andisusanti84@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012023T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9691231940326603,122.46808983385831,'https://www.google.com/maps?q=-3.9691231940326603,122.46808983385831',168000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1695008176812-0e31dd36-b5d2-49d3-91b0-b560a24f0e71.jpg","https://sikumbang.tapera.go.id/public/upload/1695008180032-e1ede117-d94f-4c98-817d-14efe4735adf.jpg","https://sikumbang.tapera.go.id/public/upload/1695008176878-1cfcd324-504c-49f1-9470-dd41414f75c4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('687d5b09-f453-4528-9950-552c1c1ed5e2',NULL,'rumah_subsidi','rumah_tapak','GREEN ANUGERAH REGENCY 2','sikumbang-kdi0410052023t002','GREEN ANUGERAH REGENCY 2 oleh PT PUTRA ANUGERAH PROPERTINDO (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 56 (Komersil): Rp 320.000.000, LB 87 m2 / LT 107.95 m2, 2 KT / 2 KM, 1 lantai.
- 65 (Komersil): Rp 390.000.000, LB 97 m2 / LT 127 m2, 3 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Wua Eha Perumahan Green Anugerah Regency Blok C; Telp: 081935419225; Email: putraanugerahpropertindo.pt@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0017909722222225,122.55956797222223,'https://www.google.com/maps?q=-4.0017909722222225,122.55956797222223',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1695086260896-1683b3c0-2911-41c7-8007-e253299bd97d.jpg","https://sikumbang.tapera.go.id/public/upload/1695086261745-69cf7895-e7e2-48d4-a089-27c5ee59afb0.jpg","https://sikumbang.tapera.go.id/public/upload/1695086261202-76600ae9-64c5-4dda-b533-f5581b23fb6f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('73591ba9-51e1-43e9-8d92-7d0be86f9833',NULL,'rumah_subsidi','rumah_tapak','NARAHILLS','sikumbang-kdi0710042023t003','NARAHILLS oleh PT MULYA NARA JANITRA (APERSI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 35 subsidi / 0 komersil.

Tipe rumah:
- 36/96 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. D.I Panjaitan Kompleks Ruko Lepo-lepo Square; Telp: 082188981186; Email: busines.mulyanarajanitra@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.000769444444445,122.48306666666667,'https://www.google.com/maps?q=-4.000769444444445,122.48306666666667',168000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1694496510327-22d001d7-89a7-4bd2-abeb-1ad2481e5e0a.jpg","https://sikumbang.tapera.go.id/public/upload/1694496449002-650f2a70-e155-4561-90b7-abeae235f41c.jpg","https://sikumbang.tapera.go.id/public/upload/1694496473715-9318e5ff-f22a-4254-b399-d0a5bdfced79.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('de5570f2-d02d-4a26-bf19-04fac7bac350',NULL,'rumah_subsidi','rumah_tapak','Saprolite Indah','sikumbang-kdi0910022023t008','Saprolite Indah oleh PT HASSCO INDO KONSUL (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- 36 Rumah Tunggal Kavling Depan (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 Kavling 84 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- Kopel (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- Tunggal (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. P. Sulawesi (ex Jl. Konggoasa); Telp: 085656349525; Email: hasscoindkonsul@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022023T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9523036997222225,122.4719697,'https://www.google.com/maps?q=-3.9523036997222225,122.4719697',168000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/fotoContoh-0629f155-a902-4c1c-a894-cce30106b4b7.jpg","https://sikumbang.tapera.go.id/public/upload/fotoGerbang-ca58ef42-8335-4abf-8c7c-2dee0a8a9f9a.jpg","https://sikumbang.tapera.go.id/public/upload/fotoTengah-1d29d722-f0c9-4c4e-b5a8-87d61c5f9db8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('24e66dee-913c-454a-983e-7b7cfaf6a47e',NULL,'rumah_subsidi','rumah_tapak','GRIYA BUKIT ANAIWOI','sikumbang-kka1810032023t002','GRIYA BUKIT ANAIWOI oleh PT GALAMPA KOLUMBA PERSADA (REI).
Alamat: Anaiwoi, Kec. Tanggetada, Kab Kolaka, Sulawesi Tenggara.
Total unit: 15 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Bukit Kolumba, Blok A; Telp: 085216125057; Email: galampa.kolumba.persada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1810032023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Tanggetada','Anaiwoi','Anaiwoi, Kec. Tanggetada, Kab Kolaka, Sulawesi Tenggara',NULL,-4.368140299999999,121.54521959972222,'https://www.google.com/maps?q=-4.368140299999999,121.54521959972222',156500000.0,'total',FALSE,2,1,36,150,1,'{"https://sikumbang.tapera.go.id/public/upload/1696232274217-27500ec8-c033-47fb-b0af-c2ad8611a8ce.jpg","https://sikumbang.tapera.go.id/public/upload/1696232283735-9aaa4cfe-7035-4bfa-8e36-1fccc7684283.jpg","https://sikumbang.tapera.go.id/public/upload/1696232273386-c892e792-cfd0-43e1-a170-568f01f4d545.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('57f50853-3ff1-4fd8-bb60-8cd5fb9d7482',NULL,'rumah_subsidi','rumah_tapak','Grand Adhea City 2','sikumbang-lss0120092023t003','Grand Adhea City 2 oleh ADHEA MALINTA MALLURU (REI).
Alamat: Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 29 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Gunung Tojabi; Telp: 082266077574; Email: pt.adheamalintamalluru@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120092023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Watuliwu','Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.5073194444444447,120.89313333333334,'https://www.google.com/maps?q=-3.5073194444444447,120.89313333333334',168000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1696322751646-70955611-a18f-413b-9d10-3dfdd6bdff84.jpg","https://sikumbang.tapera.go.id/public/upload/1696322754400-7a1b11de-15ff-4b34-9d5c-6e822f8978f3.jpg","https://sikumbang.tapera.go.id/public/upload/1696322751036-2e26ad3c-1fcb-4189-bfb1-68e858763da5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2ce97e20-d0e5-4564-bd97-e132524f0da1',NULL,'rumah_subsidi','rumah_tapak','PONDOK INDAH KONAWE','sikumbang-unh3920042023t001','PONDOK INDAH KONAWE oleh PT PONDOK INDAH KONAWE (PI).
Alamat: Paku, Kec. Morosi, Kab Konawe, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 119 m2, 2 KT / 1 KM, 1 lantai.
- 36 SUBSIDI BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 119 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Anggrek Raya ; Telp: 081355556568; Email: pondokindahkonawe@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH3920042023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Morosi','Paku','Paku, Kec. Morosi, Kab Konawe, Sulawesi Tenggara',NULL,-3.9319427777777776,122.42956277777779,'https://www.google.com/maps?q=-3.9319427777777776,122.42956277777779',168000000.0,'total',FALSE,2,1,36,119,1,'{"https://sikumbang.tapera.go.id/public/upload/1695025611156-1bd6c577-5e1d-45bb-83ee-2c0fb8381887.jpg","https://sikumbang.tapera.go.id/public/upload/1695025599762-90a30be8-32df-43a6-a8ec-b1fdf1c94814.jpg","https://sikumbang.tapera.go.id/public/upload/1695025606312-7d06768f-56c8-4051-afb5-017bc1b243ef.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('931801a5-100b-413b-a54f-9541f3ab3693',NULL,'rumah_subsidi','rumah_tapak','Puri Puuwatu Indah.','sikumbang-kdi0910012023t006','Puri Puuwatu Indah. oleh PT PROPERTI NIAGA MANDIRI (APERSI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.CHAIRIL ANWAR; Telp: 08114531208; Email: propertiniagamandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012023T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.980307777777778,122.47291777777778,'https://www.google.com/maps?q=-3.980307777777778,122.47291777777778',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1696464617653-69e736d9-8dc4-4d75-b0fd-b71acf926577.jpg","https://sikumbang.tapera.go.id/public/upload/1696464618451-6c6e23de-00b3-4ce8-9c79-4a071a801330.jpg","https://sikumbang.tapera.go.id/public/upload/1696464617898-29098c83-cc27-476d-b605-90a7ce606232.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('59cd18eb-da80-4248-be35-e294cb41660d',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN BUMI ARUM RESIDENCE TAHAP II','sikumbang-adl0820172023t004','PERUMAHAN BUMI ARUM RESIDENCE TAHAP II oleh PT MUSTIKA PUTRA PERSADA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 103 m2, 2 KT / 1 KM, 1 lantai.
- 36 BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 103.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Brigjend Katamso; Telp: 082398999431; Email: pt.bumiarumlestari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0486059999999995,122.47293397222222,'https://www.google.com/maps?q=-4.0486059999999995,122.47293397222222',168000000.0,'total',FALSE,2,1,36,103,1,'{"https://sikumbang.tapera.go.id/public/upload/1697173815151-abb5ff78-1340-488d-8e2f-c22a5fa17c3e.jpg","https://sikumbang.tapera.go.id/public/upload/1697173791947-4b45f78a-8db0-48c1-af46-34b42fc63bc7.jpg","https://sikumbang.tapera.go.id/public/upload/1697173806212-e8caa1ef-4769-4900-8c95-c6bfd695a339.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9b3c104b-f519-4653-b10a-58f500701608',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN BARUGA REGENCY','sikumbang-kdi0310072023t007','PERUMAHAN BARUGA REGENCY oleh PT GETRACO TIMUR PERSADA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 49 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 92 m2, 1 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ade Irma II; Telp: 085242016538; Email: getracotimurpersada@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072023T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.019007572222222,122.490140525,'https://www.google.com/maps?q=-4.019007572222222,122.490140525',168000000.0,'total',FALSE,1,1,36,92,1,'{"https://sikumbang.tapera.go.id/public/upload/1698364441403-cf2c413c-a594-4251-82b6-e86f12cb0547.jpg","https://sikumbang.tapera.go.id/public/upload/1698364443095-96f21270-c35e-45b7-a9a1-6902505e2e86.jpg","https://sikumbang.tapera.go.id/public/upload/1698364441806-cacded52-e1a1-4c38-a8ca-66e54ccd150f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('92609920-1c06-48b2-a0df-a4282408545c',NULL,'rumah_subsidi','rumah_tapak','RATU PERMAI RESIDENCE 4','sikumbang-bau0110122023t002','RATU PERMAI RESIDENCE 4 oleh CV RATU PERMAI (ASPERI).
Alamat: Waborobo, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- T36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- t36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LIMBO WOLIO; Telp: 081242946579; Email: cv.ratupermai@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110122023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Waborobo','Waborobo, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.496211111111111,122.58175555555555,'https://www.google.com/maps?q=-5.496211111111111,122.58175555555555',168000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1698374806109-bfd539fb-312b-45bf-9681-b4807575ab6d.jpg","https://sikumbang.tapera.go.id/public/upload/1698374806950-96ce56a5-bb64-43ee-8153-180eb8361f1c.jpg","https://sikumbang.tapera.go.id/public/upload/1698374806050-f2aa84bf-d370-468b-b9e0-371c22add4b9.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e6440891-e628-4c94-ab1c-6b7394983c85',NULL,'rumah_subsidi','rumah_tapak','ELBAITY RESIDENCE III','sikumbang-kdi0310072023t006','ELBAITY RESIDENCE III oleh PT ELMITRA JAYA GRUP (APERSI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 57 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 99 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: PERUMAHAN ELBAITY RESIDENCE III; Telp: 081241758166; Email: Elmitrajaya08@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072023T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.031636111111111,122.473225,'https://www.google.com/maps?q=-4.031636111111111,122.473225',168000000.0,'total',FALSE,2,1,36,99,1,'{"https://sikumbang.tapera.go.id/public/upload/1698289619279-be2e26ac-25a1-4ef9-b32b-e2b02f3d3a61.jpg","https://sikumbang.tapera.go.id/public/upload/1698289620360-7f2d4eea-888b-41ee-887d-2ca7845958f0.jpg","https://sikumbang.tapera.go.id/public/upload/1698289620036-9f052819-ee7d-44b3-96dc-d645020d519b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c3e584c7-55b6-4276-8264-aea8f0defa52',NULL,'rumah_subsidi','rumah_tapak','BUKIT BARINGENG PERMAI 3','sikumbang-kdi0310082023t005','BUKIT BARINGENG PERMAI 3 oleh PT BARINGENG (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 37 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 2025 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perum. Bukit Baringeng Permai Blok B; Telp: 085255577725; Email: pt.baringeng@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082023T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0201416666666665,122.490725,'https://www.google.com/maps?q=-4.0201416666666665,122.490725',168000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1696499919191-59e521f9-5b4f-4fb6-8398-ba4e38c2e242.jpg","https://sikumbang.tapera.go.id/public/upload/1696499916005-08fe06a5-aafc-4e3f-85a6-b837f4679473.jpg","https://sikumbang.tapera.go.id/public/upload/1696499917808-989a02c0-c24a-445a-9138-c5921071b0ec.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('edd9813e-c617-4911-a356-b606e7ce62c6',NULL,'rumah_subsidi','rumah_tapak','New Mandala Regency','sikumbang-kdi0310012023t008','New Mandala Regency oleh PT GOLDEN BARUGA LAND (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 113 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI PREMIUM (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI 2024 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. KS Tubun. Kompleks Perumahan Mandala Regency Blok Bougenville No. 1 ; Telp: 085256789016; Email: Goldenbarugaland@gmail.com; Web: newmandalaregency.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012023T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.042263888888889,122.50404722222223,'https://www.google.com/maps?q=-4.042263888888889,122.50404722222223',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1698580941795-9f60d4f7-a573-43d8-b515-032a53250237.JPG","https://sikumbang.tapera.go.id/public/upload/1698580941870-125b5101-f180-4492-9244-2b895cb4e019.JPG","https://sikumbang.tapera.go.id/public/upload/1698580943390-7cb4c6f8-adc5-4b90-a7d1-f061a2f7fee1.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a7beea64-a427-4953-b917-5c7fbd4e5cd3',NULL,'rumah_subsidi','rumah_tapak','ALYA RESIDENCE TAHAP 2','sikumbang-kdi0310082023t006','ALYA RESIDENCE TAHAP 2 oleh PT MAJU GRIYA CAHAYA (APERSI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. WULELE; Telp: 08114019700; Email: majugriyacahaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082023T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.021885,122.49563897222222,'https://www.google.com/maps?q=-4.021885,122.49563897222222',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1699091586970-dfe77028-d742-4779-959a-0085e6735a78.jpg","https://sikumbang.tapera.go.id/public/upload/1699091584068-f2582823-542f-45ef-9974-3da43ac8e34e.jpg","https://sikumbang.tapera.go.id/public/upload/1699091587244-6ec022f7-5b21-4c25-b614-4b7add66191f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('81a18b22-6084-4bf9-8ebc-6e91eb15511a',NULL,'rumah_subsidi','rumah_tapak','KITA SEHATI','sikumbang-kdi0710042023t004','KITA SEHATI oleh PT ROJO BAGUS NUSANTARA (APERSI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 (173) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- HARGA BARU 173.000.000 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. MALAKA, KOMP. CITRALAND KENDARI RUKO GATEWAY, BLOK RK B1; Telp: 082348767323; Email: pt.rojobagus@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.0032901,122.48286339972222,'https://www.google.com/maps?q=-4.0032901,122.48286339972222',168000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1699071284395-9a322a93-4067-4c63-a987-24551d8b3ab8.jpg","https://sikumbang.tapera.go.id/public/upload/1699071286520-070512a9-9b3b-484d-aa63-36eed7bbe5ef.jpg","https://sikumbang.tapera.go.id/public/upload/1699071292036-38baa6ad-e5e0-4faa-8f4e-e4c4a92861c9.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4ae877a2-faf9-4cd3-8d55-bae2096eab7a',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN ANUGRAH LAND','sikumbang-kdi0910022023t007','PERUMAHAN ANUGRAH LAND oleh PT ANUGRAH ANINDYA PROPERTY (PI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 48 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan Anugrah land blok C; Telp: 081213220192; Email: anugrahanindyaproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022023T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.97073,122.47871805555556,'https://www.google.com/maps?q=-3.97073,122.47871805555556',168000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1691739741161-6d6ada96-bd39-4967-b595-9e30d184cf79.jpg","https://sikumbang.tapera.go.id/public/upload/1691740078341-c3866e50-2477-4a8b-b449-7d28a1d56f09.jpg","https://sikumbang.tapera.go.id/public/upload/1691739741509-51026b4b-8a4f-4336-a5bc-b80239b2a0de.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ce6072e0-9fb4-4fd7-83e8-ad7e6123d489',NULL,'rumah_subsidi','rumah_tapak','VILLA INDAH BALANDETE TAHAP 2','sikumbang-kka0410032023t001','VILLA INDAH BALANDETE TAHAP 2 oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.PEMUDA; Telp: 082293212640; Email: pt.villa.mutiara.ramadhan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410032023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Balandete','Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.070967972222222,121.63160297222221,'https://www.google.com/maps?q=-4.070967972222222,121.63160297222221',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1690434478522-bad94bb6-c675-40e2-b236-f3f6d6353639.jpg","https://sikumbang.tapera.go.id/public/upload/1690434480623-5e6bc262-e19f-4a76-86e7-6e9c53488705.jpg","https://sikumbang.tapera.go.id/public/upload/1690434480095-f74eb851-5bee-48aa-8336-10da6cb7a0cb.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('89d30cbb-a6cf-4151-9bae-abc49b12ccf6',NULL,'rumah_subsidi','rumah_tapak','GRAHA TERATAI INDAH 4','sikumbang-kdi0710042023t002','GRAHA TERATAI INDAH 4 oleh PT PATMINDO RAYA (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 (173) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Malaka, Ruko Gateway RK B 01 Kompleks Citraland  Kendari; Telp: 082348767323; Email: admpatmindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.000621399722222,122.48517909972222,'https://www.google.com/maps?q=-4.000621399722222,122.48517909972222',168000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1691810946803-26cc5dd2-0b79-4ad2-9695-a503b6652327.jpg","https://sikumbang.tapera.go.id/public/upload/1691810945652-5918b9fa-d0c5-4026-a128-4b94acd18601.jpg","https://sikumbang.tapera.go.id/public/upload/1691811221187-747be5bc-2c8e-4695-a37c-24fc402c830d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('efc6262c-572b-4fc5-928e-5a524ccbdd62',NULL,'rumah_subsidi','rumah_tapak','BANUA RESIDENCE WATULIWU','sikumbang-lss0120092023t002','BANUA RESIDENCE WATULIWU oleh PT PT. BABANA KONSTRUKSI PERSADA (REI).
Alamat: Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jalan mataiwoi; Telp: 085232424644; Email: babanakonstruksipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120092023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Watuliwu','Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.506874972222222,120.89276097222223,'https://www.google.com/maps?q=-3.506874972222222,120.89276097222223',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1690778848286-b1a8302a-8dae-4e24-9c4f-af489be5483b.jpg","https://sikumbang.tapera.go.id/public/upload/1690778815826-83aabbde-2b9a-4c42-974a-5ffa52f713bd.jpg","https://sikumbang.tapera.go.id/public/upload/1690778834384-9ee6f898-233c-4d72-8867-1d20ffbd920a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0f8a1892-6863-452d-ab56-9e22301e788d',NULL,'rumah_subsidi','rumah_tapak','Mawar Saron residence 2','sikumbang-adl0820172023t003','Mawar Saron residence 2 oleh PT MAWAR SARON SUSANTA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 HARGA BARU (Subsidi): Rp 168.000.000, LB 36 m2 / LT 95 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Kota Bangun, RT. 001 RW 003, Ranomeeto, Kabupaten Konawe Selatan, Sulawesi Tenggara ; Telp: 082292044649 ; Email: mawarsaronsusanta@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.042836972222222,122.46778297222222,'https://www.google.com/maps?q=-4.042836972222222,122.46778297222222',168000000.0,'total',FALSE,2,1,36,95,1,'{"https://sikumbang.tapera.go.id/public/upload/1655958403708-9a0bb05f-ff03-40d8-8d74-4399418210be.jpg","https://sikumbang.tapera.go.id/public/upload/1655958406439-2dbe3da0-0e37-4e8a-b105-f701b87894dd.jpg","https://sikumbang.tapera.go.id/public/upload/1655958404727-afba2c02-722e-4176-aeab-317893263d22.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c0f1246a-2adc-488a-a18f-6d9e65523620',NULL,'rumah_subsidi','rumah_tapak','GRIYA ORAWA RESIDENCE','sikumbang-trw0120092023t001','GRIYA ORAWA RESIDENCE oleh PANRITA BOLA NUSANTARA (REI).
Alamat: Orawa, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 80 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. Poros Kolaka - Kendari; Telp: 085238118123; Email: panritabolanusantara@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120092023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Orawa','Orawa, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.0371559,121.9043458,'https://www.google.com/maps?q=-4.0371559,121.9043458',168000000.0,'total',FALSE,2,1,36,80,1,'{"https://sikumbang.tapera.go.id/public/upload/1691024877729-8dae279c-4c33-4ecc-89af-a21744253862.jpg","https://sikumbang.tapera.go.id/public/upload/1691024870730-706cc95e-e551-4b10-b609-d405f955f507.jpg","https://sikumbang.tapera.go.id/public/upload/1691024874800-62fefe39-023d-48cf-ba0e-860f63446ee5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ffd6303f-216a-4b2f-be55-5c5a3ef1bc36',NULL,'rumah_subsidi','rumah_tapak','Grand Kencana Land','sikumbang-adl0820192023t001','Grand Kencana Land oleh PT SERRIL DOBEL KONSTRUKSI (REI).
Alamat: Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Mawar Perumahan Puri Kencana 1 Blok C; Telp: 085240303659; Email: pt.serrildobelkonstruksi@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820192023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Laikaha','Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0411769444444445,122.45016777777778,'https://www.google.com/maps?q=-4.0411769444444445,122.45016777777778',168000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1689599298528-d70812c6-7786-4bf3-8de6-4c084c8d6ec2.jpg","https://sikumbang.tapera.go.id/public/upload/1689599286642-c2d779eb-6368-469c-838f-c078c5985d62.jpg","https://sikumbang.tapera.go.id/public/upload/1689599291055-abc9065b-f2cc-412e-9baa-58d7d238ab41.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f66a96fc-1aca-44ba-99ea-99cd3c0a9b41',NULL,'rumah_subsidi','rumah_tapak','ERA BARU RESIDENCE II','sikumbang-kdi0310082023t004','ERA BARU RESIDENCE II oleh NEO ELECTRONIK GRUP (APERSI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36/96 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36/96 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.RAMBUTAN II NO 24 A; Telp: 085241533398; Email: neoseni03@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.024183333333333,122.49858888888889,'https://www.google.com/maps?q=-4.024183333333333,122.49858888888889',168000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1689247386665-b98ec72e-11c9-4394-b52b-e665cf08fc0d.jpg","https://sikumbang.tapera.go.id/public/upload/1689247383035-ab1c8712-164b-44be-a0b0-7935fc89216e.jpg","https://sikumbang.tapera.go.id/public/upload/1689247400485-caed6ad6-e480-44bd-ab23-8bfff174bfa3.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1806e69d-2659-45f7-81a4-c1ff8b3fab91',NULL,'rumah_subsidi','rumah_tapak','BANUA GREEN CITY II','sikumbang-kdi0410032023t007','BANUA GREEN CITY II oleh PT BANUA INDAH PRATAMA (APERNAS).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 27 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BUNGA KOLOSUA; Telp: 085241767715; Email: madesujarto@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032023T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.023622972222222,122.55725097222222,'https://www.google.com/maps?q=-4.023622972222222,122.55725097222222',168000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/1690338061668-f2c1e451-a4b8-4cfc-88cb-1e2430724376.jpg","https://sikumbang.tapera.go.id/public/upload/1690337973043-2c907329-2002-4eec-af49-523bbc2b59a4.jpg","https://sikumbang.tapera.go.id/public/upload/1690337961113-71fb988b-7451-4bdb-8a2c-09978bc36720.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6ce55fd4-7982-437c-8823-ee6b144994f4',NULL,'rumah_subsidi','rumah_tapak','PURI TAMAN KENDARI','sikumbang-kdi0910032023t002','PURI TAMAN KENDARI oleh PT PRATAMA JAYA PROPERTI (REI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN GRAHA REKSA KENCANA BLOK B; Telp: 082352623961; Email: agilmirwan07@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.971488888888889,122.49561388888888,'https://www.google.com/maps?q=-3.971488888888889,122.49561388888888',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/10/22/fotoContoh-66f8c35b-5183-4b64-bd06-bf839feed3f1.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/22/fotoGerbang--59d11ed7-0fcc-4ffc-a3da-e8d3cb519c4b.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/22/fotoTengah-6d5cb9dc-c38b-40c6-93fb-ff3a08a1048a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('043aecf1-54ed-4123-90fe-11811c004bff',NULL,'rumah_subsidi','rumah_tapak','Villa Indah Tahoa.','sikumbang-kka0410072023t003','Villa Indah Tahoa. oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 24 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jln.pemuda; Telp: 082293212640; Email: pt.villa.mutiara.ramadhan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410072023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Tahoa','Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.082997972222222,121.614114,'https://www.google.com/maps?q=-4.082997972222222,121.614114',156000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1691465362983-e82ffcb4-73fe-4ca8-88f7-d623de9e18cd.jpg","https://sikumbang.tapera.go.id/public/upload/1691465364609-cffa2ace-6f24-4cca-9301-670d3a02d813.jpg","https://sikumbang.tapera.go.id/public/upload/1691465365012-da7bb75f-e235-4984-8db5-4f0eb0c849a4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2412569e-1637-4a6c-8091-f6c6b89099b0',NULL,'rumah_subsidi','rumah_tapak','GRAHA KARTIKA INDAH IV','sikumbang-kdi0910062023t001','GRAHA KARTIKA INDAH IV oleh PT MEGA INDAH PROPERTY (HIMPERRA).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 35 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 HARGA BARU (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. GUNUNG MERPATI ; Telp: 085241892724; Email: megaindahproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.951722777777778,122.49975888888889,'https://www.google.com/maps?q=-3.951722777777778,122.49975888888889',168000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1691459723034-fde30ef8-fa38-4b3a-88e6-221b617a91d6.jpg","https://sikumbang.tapera.go.id/public/upload/1691459723378-4da162c8-e86a-4a4a-8847-f8a417db6580.jpg","https://sikumbang.tapera.go.id/public/upload/1691459723069-dcaaeee4-fa93-4e00-8659-21d15cb44c71.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f1d21394-1d5f-448e-bf11-ff05b1ee7996',NULL,'rumah_subsidi','rumah_tapak','MUTIARA GEMILANG TAHAP IV','sikumbang-kdi0410042023t002','MUTIARA GEMILANG TAHAP IV oleh PT GEMILANG TAMARA MANDIRI (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36/96 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. Lingkugan Pd. JL. Kayu Manis ( EX.JL. Banteng ); Telp: 082293779997; Email: gemilangtamaramandiri@gemail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.021686111111111,122.55679166666667,'https://www.google.com/maps?q=-4.021686111111111,122.55679166666667',168000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1690010171849-63323568-9eef-4c8f-ac74-0bc73c3ec661.jpg","https://sikumbang.tapera.go.id/public/upload/1690010177675-4af4a371-5973-412c-adcb-385cb850512b.jpg","https://sikumbang.tapera.go.id/public/upload/1690010167833-d86dc5e5-a77b-4fee-afff-4a151f693637.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a6da0174-f782-44df-9a5c-1b2b9c22ac65',NULL,'rumah_subsidi','rumah_tapak','PESONA ALAM KENDARI TAHAP 2','sikumbang-kdi0410032023t008','PESONA ALAM KENDARI TAHAP 2 oleh PT PRATAMA JAYA PROPERTI (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN GRAHA REKSA KENCANA BLOK B; Telp: 082352623961; Email: ptpratamajayaproperti19@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032023T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.041377777777778,122.56089722222222,'https://www.google.com/maps?q=-4.041377777777778,122.56089722222222',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1692840298781-77f017d9-e653-4970-b4be-d74fb3b7708f.jpg","https://sikumbang.tapera.go.id/public/upload/1692840297557-a8dcb28c-f27d-4044-b46f-5c5aea010892.jpg","https://sikumbang.tapera.go.id/public/upload/1692840299305-1d91500b-b02b-41c3-b5ad-a5333a27c71f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5e62797c-ef69-475a-ae1c-eca2990c8fa0',NULL,'rumah_subsidi','rumah_tapak','DINI RESIDENCE','sikumbang-kdi1010022023t006','DINI RESIDENCE oleh DINI MENTARI PROPERTY (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 44 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan KS. TUBUN, Kelurahan Mokoau, Kecamatan Kambu, Kota Kendari; Telp: 085333222208; Email: irmapandora88@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022023T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.054501999999999,122.528244,'https://www.google.com/maps?q=-4.054501999999999,122.528244',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1691816253622-92011264-9885-40ae-8fc6-326696d8889d.jpg","https://sikumbang.tapera.go.id/public/upload/1691816247096-d4f059a6-0558-44a1-b9e6-bc9bd74b81ed.jpg","https://sikumbang.tapera.go.id/public/upload/1691816250915-857e42ba-7dbf-4f24-968e-47abe4750c1b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9294a9d1-e507-42e9-9a62-21bf2ed9e809',NULL,'rumah_subsidi','rumah_tapak','SINAR Regency Tahap II','sikumbang-kdi0410042023t003','SINAR Regency Tahap II oleh FNUR GROUP PROPERTY (PI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.010017777777778,122.54874583333333,'https://www.google.com/maps?q=-4.010017777777778,122.54874583333333',168000000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/upload/1693307126659-7550ddb4-7247-4fe8-99e0-755ad54b208b.jpg","https://sikumbang.tapera.go.id/public/upload/1693307126455-ec2ab675-e5ea-4a60-b041-2608f77a7d2d.jpg","https://sikumbang.tapera.go.id/public/upload/1693307126663-a82e0c98-2e02-498a-931e-013f4b56fc65.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a965b8a6-e0d5-414d-bfaf-1275fddf3b91',NULL,'rumah_subsidi','rumah_tapak','ANAK SULTAN LAKUDO RESIDENCE','sikumbang-lbk0110072023t001','ANAK SULTAN LAKUDO RESIDENCE oleh PT SULTAN MEKAR JAYA (APERNAS).
Alamat: Lakudo, Kec. Lakudo, Kab Buton Tengah, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Lingk. Gu Barat, Kel. Lakudo, Kec. Lakudo, Kan. Buton Tengah; Telp: 085359992899; Email: ptsultanmekarjaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LBK0110072023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton Tengah','Kab Buton Tengah','Lakudo','Lakudo','Lakudo, Kec. Lakudo, Kab Buton Tengah, Sulawesi Tenggara',NULL,-5.316325,122.52855277777778,'https://www.google.com/maps?q=-5.316325,122.52855277777778',156500000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/11/17/fotoContoh-056bb120-a40d-404f-acf5-ca769d2a640a.jpg","https://sikumbang.tapera.go.id/public/upload/2025/11/17/fotoGerbang--a8cfcfc3-045c-433e-8f90-d927ddfe86a7.jpg","https://sikumbang.tapera.go.id/public/upload/2025/11/17/fotoTengah-4753e95d-b132-4e02-8b31-2dbc6148bbd9.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('813c93cc-eebd-4f1f-b551-a677254a4808',NULL,'rumah_subsidi','rumah_tapak','AISYAH RESIDENCE','sikumbang-adl0810012023t001','AISYAH RESIDENCE oleh PT ANNUR BERKAH PROPERTI (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. MANDIRI KEL. RANOMEETO KEC. RANOMEETO KAB. KONAWE SELATAN; Telp: 085241515081; Email: annurberkahproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.045371944444445,122.465815,'https://www.google.com/maps?q=-4.045371944444445,122.465815',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1694159096348-89a68974-2683-4ecf-93ef-95fd927ffe29.jpg","https://sikumbang.tapera.go.id/public/upload/1694159092987-4d7a3913-8c43-42a3-ae33-4269f3273adc.jpg","https://sikumbang.tapera.go.id/public/upload/1694159094212-6f17bd2c-8453-4243-98c3-54b19b15c45e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('93452874-040b-472b-b508-e371af22d537',NULL,'rumah_subsidi','rumah_tapak','BINTANG REGENCY I','sikumbang-adl0820152023t001','BINTANG REGENCY I oleh PT BINTANG GROUP TERBUKA (REI).
Alamat: Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Kompleks Perum Bintang Regency I; Telp: 082216773545; Email: bintanggrouptbk@gmail.com; Web: 082216773545

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820152023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranooha','Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.055716666666666,122.449775,'https://www.google.com/maps?q=-4.055716666666666,122.449775',168000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1688971581265-18452507-a2ad-4625-84f9-6afb1f49f7c3.jpg","https://sikumbang.tapera.go.id/public/upload/1688971580805-b1dade30-1b08-42ca-8692-1c17558b7a2a.jpg","https://sikumbang.tapera.go.id/public/upload/1688971580991-e61cc4f6-2f7e-4b3d-aa2e-fce1fc86e457.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9fa63a8b-b85e-4f75-9b11-5f1c22adcfd9',NULL,'rumah_subsidi','rumah_tapak','GRIYA LAND PUUWATU TAHAP II','sikumbang-kdi0910012023t004','GRIYA LAND PUUWATU TAHAP II oleh PT AMANAH JAYA PROPERTI (PI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 2025 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. R.E. MARTADINATA ; Telp: 082235742445; Email: amanahjayapropertipusatkendari@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9849847222222223,122.47424694444445,'https://www.google.com/maps?q=-3.9849847222222223,122.47424694444445',168000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1688987838577-345e1cd7-aff4-4918-9e39-fc0f4a36aa7b.jpg","https://sikumbang.tapera.go.id/public/upload/1688987841727-bbdcda45-9b66-4995-8a8b-c71c21bbca9d.jpg","https://sikumbang.tapera.go.id/public/upload/1688987838861-162e17e4-a1c0-4491-bde4-5eb59ddca702.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4ae6b40f-4764-4cb2-bc2b-634003192be8',NULL,'rumah_subsidi','rumah_tapak','BUMI PRAJA RESIDENCE 4','sikumbang-kdi0410032023t005','BUMI PRAJA RESIDENCE 4 oleh PT HARWIN JAYA BAROKAH PROPERTY (HIMPERRA).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LAMPARENG II, KOMPLEKS PERUMAHAN BUMI PRAJA RESIDENCE, RT. 01 RW. 01 ; Telp: 085398786061; Email: jayaharwin@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032023T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.030872222222222,122.55129722222222,'https://www.google.com/maps?q=-4.030872222222222,122.55129722222222',168000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1688727919262-983737b1-32cb-467b-8ab6-d5bd4e0abd83.jpg","https://sikumbang.tapera.go.id/public/upload/1688727928396-40c3d9dc-5c36-408e-924a-95cd769e030e.jpg","https://sikumbang.tapera.go.id/public/upload/1688727928901-2c82c066-3650-4073-bd06-f7c5bfa79e00.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4637e789-37ea-4468-b20e-446f1207b372',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN NUR EMPAT TAHAP V','sikumbang-kdi0410032023t006','PERUMAHAN NUR EMPAT TAHAP V oleh PT USFADAH NUR EMPAT (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 114 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LIAMBO KOMP. BTN II; Telp: 085333371835; Email: ptnurempat@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032023T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.037186799722222,122.55798559972222,'https://www.google.com/maps?q=-4.037186799722222,122.55798559972222',168000000.0,'total',FALSE,2,1,36,114,1,'{"https://sikumbang.tapera.go.id/public/upload/1689508536458-4895b511-bd9a-462f-99f3-d67dcf4ba782.jpg","https://sikumbang.tapera.go.id/public/upload/1689508538610-bee72a81-ae96-4ebf-a874-06d887a3686a.jpg","https://sikumbang.tapera.go.id/public/upload/1689508536726-6d1eea9a-07de-4eea-8524-05796491cebf.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('523f216b-589b-4821-9c06-e3c75fa80cac',NULL,'rumah_subsidi','rumah_tapak','Kawasan Perumahan Lepo Lepo Mas','sikumbang-kdi0310022023t005','Kawasan Perumahan Lepo Lepo Mas oleh PT BULU MANARANG (REI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 90 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. H. Lamuse, Lrg. Adem, RT 016 RW 07 Kec. Baruga Kel. Lepo Lepo, Kota Kendari; Telp: 0853 3361 1489; Email: bulumanarangkendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022023T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.021186805555556,122.5134353611111,'https://www.google.com/maps?q=-4.021186805555556,122.5134353611111',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/fotoContoh-3cbfe623-a98b-4347-b01f-6eabc985d02d.JPG","https://sikumbang.tapera.go.id/public/upload/fotoGerbang-cc19ffea-6f1d-4033-9d4f-a154b3af3d37.JPG","https://sikumbang.tapera.go.id/public/upload/fotoTengah-81ed0614-f096-4049-9aef-33841c63136e.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0120a1fe-eee0-4cc2-a285-8b742cd15241',NULL,'rumah_subsidi','rumah_tapak','MENARA GRAHA REGENCY','sikumbang-kka0720042023t001','MENARA GRAHA REGENCY oleh PT MENARA KENSETSU NUSANTARA (REI).
Alamat: Pelambua, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 84.5 m2, 2 KT / 1 KM, 1 lantai.
- 36 HARGA BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ekonomi ; Telp: 081242319567; Email: menarakensetsunusantara69@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720042023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Pelambua','Pelambua, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.1755555555555555,121.6255361111111,'https://www.google.com/maps?q=-4.1755555555555555,121.6255361111111',168000000.0,'total',FALSE,2,1,36,84.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1689497630905-ac918d62-f53b-453c-9fe5-37c165e7a23d.jpg","https://sikumbang.tapera.go.id/public/upload/1689497632405-9ab8f5cf-ede5-4077-82e4-8390ee2f905b.jpg","https://sikumbang.tapera.go.id/public/upload/1689497632573-a627bd07-e8d5-4ed1-b735-c8e9595ab9cf.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c9325423-5c87-433f-bbe5-ecc043485676',NULL,'rumah_subsidi','rumah_tapak','BANUA RESIDENCE LASUSUA','sikumbang-lss0110012023t001','BANUA RESIDENCE LASUSUA oleh PT PT. BABANA KONSTRUKSI PERSADA (REI).
Alamat: Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI HARGA BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jalan tomangera desa patowonua (samping bank mandiri); Telp: 085232424644; Email: babanakonstruksipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0110012023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Lasusua','Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.503026699722222,120.88272769999999,'https://www.google.com/maps?q=-3.503026699722222,120.88272769999999',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1686370752722-1e5a19a0-df6b-4cb2-8786-0355233e5784.jpg","https://sikumbang.tapera.go.id/public/upload/1686370050032-7b749cd6-1fbf-4a22-88fe-01725cc2c438.jpg","https://sikumbang.tapera.go.id/public/upload/1686370369924-aa543ba7-2928-4449-a175-2f931f0eb96e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d67ef21f-bb52-48cf-8f96-728a790c027d',NULL,'rumah_subsidi','rumah_tapak','GRIYA 21 BANTENG','sikumbang-kdi0410042023t001','GRIYA 21 BANTENG oleh PT REZKY MEGA PROPERTI (HIMPERRA).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 14 subsidi / 0 komersil.

Tipe rumah:
- 36/98 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / -2 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LAMPARENG II PERUMAHAN GRIYA 21 LAMPARENG ; Telp: 082293816577; Email: rezkymegap21@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.028351777777778,122.55798338888889,'https://www.google.com/maps?q=-4.028351777777778,122.55798338888889',156500000.0,'total',FALSE,2,-2,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1685439245251-b3c4fc27-7e3c-461a-9c4a-f9ba717cb88f.jpg","https://sikumbang.tapera.go.id/public/upload/1685439243490-bf18a764-aae4-4a58-b603-6bb8f78a6391.jpg","https://sikumbang.tapera.go.id/public/upload/1685439245514-611a3c00-47a0-46bd-b249-7ee16e7e28fc.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ae36fc58-99e6-4383-87f7-716d3c67db48',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE IX TAHAP II','sikumbang-kdi0310072023t004','PRADANA RESIDENCE IX TAHAP II oleh PT ZENK NAWANK KENJEL (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- PRADANA RESIDENCE IX TAHAP II (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. AHMAD YANI ( APOTEK PRADANA FARMA); Telp: 082231810164; Email: inhadafa15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.024538888888888,122.48659444444445,'https://www.google.com/maps?q=-4.024538888888888,122.48659444444445',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1678935082007-9229e015-2401-4c49-b929-b1d7d6372b82.jpeg","https://sikumbang.tapera.go.id/public/upload/1678935081223-088cf8f1-3b48-4fb2-9582-1c570fa732a5.jpeg","https://sikumbang.tapera.go.id/public/upload/1678935081856-bcbd269e-570d-4428-91e4-526df3e632f3.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fa0ec455-ac0f-428d-9ac3-29dadeb50b69',NULL,'rumah_subsidi','rumah_tapak','BANUA RESIDENCE PATOWONUA','sikumbang-lss0120152023t001','BANUA RESIDENCE PATOWONUA oleh PT PT. BABANA KONSTRUKSI PERSADA (REI).
Alamat: Patowonua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 2 subsidi / 1 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36 komersil (Komersil): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jalan tomangera; Telp: 085232424644; Email: babanakonstruksipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120152023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Patowonua','Patowonua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.506969999722222,120.8920982,'https://www.google.com/maps?q=-3.506969999722222,120.8920982',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1686392167990-b5ea5f44-a046-436a-a4f4-ca409baf58c9.jpg","https://sikumbang.tapera.go.id/public/upload/1686392168302-89e931c2-2054-46f9-b210-a2c88ee89135.jpg","https://sikumbang.tapera.go.id/public/upload/1686392167726-41ffe106-0c4e-4009-84a1-4c8c25f7c49b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2d1aa413-25c0-4770-9a2f-a7171a90e664',NULL,'rumah_subsidi','rumah_tapak','GRIYA BUKIT KOLUMBA KOLAKA','sikumbang-kka0410042023t002','GRIYA BUKIT KOLUMBA KOLAKA oleh PT GALAMPA KOLUMBA PERSADA (REI).
Alamat: Lalombaa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 5 subsidi / 3 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Bukit Kolumba, Blok A; Telp: 085216125057; Email: galampa.kolumba.persada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410042023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Lalombaa','Lalombaa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.078149299722222,121.63967829972223,'https://www.google.com/maps?q=-4.078149299722222,121.63967829972223',156500000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/1690111985397-e5d2e94b-3142-4917-87c6-c7f9a72653fc.jpg","https://sikumbang.tapera.go.id/public/upload/1690111990588-650ae16d-d7fd-4f99-bf3e-f7373d045261.jpg","https://sikumbang.tapera.go.id/public/upload/1690111993433-5380b8d4-f5dd-4822-9744-348004f438be.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('00e3aee7-15a0-43bc-9ac2-48691de00cc7',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN NUR EMPAT','sikumbang-kdi0410032023t004','PERUMAHAN NUR EMPAT oleh PT USFADAH NUR EMPAT (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 26 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LIAMBO KOMP. BTN II, BLOK E ; Telp: 085333371835; Email: pnurempat@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.037868699722222,122.5573002,'https://www.google.com/maps?q=-4.037868699722222,122.5573002',156500000.0,'total',FALSE,2,1,26,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1687183157907-869563da-d64d-4ce2-8f20-3266b299337c.jpg","https://sikumbang.tapera.go.id/public/upload/1687183158229-9f782097-4c05-4378-ba38-f116aa1aa61c.jpg","https://sikumbang.tapera.go.id/public/upload/1687183156837-bd3f0c1e-49f0-4e32-9b5a-933658986ea1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ac701911-2809-4ec1-8059-4ef7e6ab6f1c',NULL,'rumah_subsidi','rumah_tapak','SHAFA MARWAH RESIDENCE','sikumbang-kdi0310072023t005','SHAFA MARWAH RESIDENCE oleh PT GETRACO TIMUR PERSADA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 87.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Grand Boulevard Regency Blok A; Telp: 085242016538; Email: getracotimurpersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072023T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.027802,122.48885389972223,'https://www.google.com/maps?q=-4.027802,122.48885389972223',156500000.0,'total',FALSE,2,1,36,87.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1687275249420-18b4d419-b67b-4e32-9e66-2ad38334a244.jpg","https://sikumbang.tapera.go.id/public/upload/1687275249070-ee4efcdf-ef7e-4e33-951a-1c560a351009.jpg","https://sikumbang.tapera.go.id/public/upload/1687275249816-f5c6a4b6-4a74-4425-ad62-a90fb378e45f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('76567000-124d-45fe-a836-beed82c5acb1',NULL,'rumah_subsidi','rumah_tapak','BUKIT BARINGENG PERMAI TAHAP II','sikumbang-kdi0310082023t003','BUKIT BARINGENG PERMAI TAHAP II oleh PT BARINGENG (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. D.I. PANJAITAN PERUMAHAN BUKIT BARINGENG PERMAI BLOK B; Telp: 0811411255; Email: pt.baringeng@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.018691666666666,122.49476944444444,'https://www.google.com/maps?q=-4.018691666666666,122.49476944444444',156500000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/1686933665544-e75d5930-c287-4ffa-a019-63d76e72a18a.jpg","https://sikumbang.tapera.go.id/public/upload/1686933665368-dd9b95d9-beca-4187-a1e1-0af8f40ba6ec.jpg","https://sikumbang.tapera.go.id/public/upload/1686933685815-12977175-14f8-4678-b995-9ea9815ac130.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8852ea46-29c2-4363-8c77-5c2503c9b527',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN AMALIA RESIDENCE TAHAP 2','sikumbang-bau0110132023t004','PERUMAHAN AMALIA RESIDENCE TAHAP 2 oleh CV AMALIA (REI).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 61 subsidi / 1 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Haji Pada; Telp: 081286089925; Email: amaliaproperty12@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.5041039722222225,122.57694599999999,'https://www.google.com/maps?q=-5.5041039722222225,122.57694599999999',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1688547771217-4afaeead-b022-413c-9593-f64473b9826c.jpg","https://sikumbang.tapera.go.id/public/upload/1688547746709-9df0e57d-82cf-4962-b711-1d4739311508.jpg","https://sikumbang.tapera.go.id/public/upload/1688547771950-9ffc850f-3311-4f4f-b85c-1c127d1a8351.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ac977627-0926-47a1-ba96-004d601105b9',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN BUMI ARUM RESIDENCE','sikumbang-adl0820172023t002','PERUMAHAN BUMI ARUM RESIDENCE oleh PT MUSTIKA PUTRA PERSADA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 103.5 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 103 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Desa Puosu Jaya; Telp: 082398999431; Email: mustikaputrapersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0486059999999995,122.47293397222222,'https://www.google.com/maps?q=-4.0486059999999995,122.47293397222222',168000000.0,'total',FALSE,2,1,36,103.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1687404382145-e569f5e0-20e9-44c3-aa1d-0806a15419c5.jpg","https://sikumbang.tapera.go.id/public/upload/1687404383124-99c0418f-4602-4f47-8db7-c707806a3daf.jpg","https://sikumbang.tapera.go.id/public/upload/1687404383528-10b966c2-939b-4a8e-ad27-f05166302572.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6453d839-3c37-4fd8-b935-230b4f8678ed',NULL,'rumah_subsidi','rumah_tapak','PORASA RESIDENCE','sikumbang-kdi0710042023t001','PORASA RESIDENCE oleh PT PALUGADA KONSTRUKSI ABADI (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.
- Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. Y. WAYONG. LR. PERINTIS; Telp: 085341608681; Email: pt.palugadakonstruksiabadi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.012318111111111,122.49510955555556,'https://www.google.com/maps?q=-4.012318111111111,122.49510955555556',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1683268691639-03d6c5d0-6548-4d46-985d-3d297c38e775.jpg","https://sikumbang.tapera.go.id/public/upload/1683268685566-1a6472a6-de52-4118-8cec-b2c711a09f01.jpg","https://sikumbang.tapera.go.id/public/upload/1683268688281-b426314f-2968-4fa3-aa5c-8692226b9950.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('093843d6-9a1d-44f1-ac7f-de9a749cbd42',NULL,'rumah_subsidi','rumah_tapak','LAGALIGO RESIDENCE II','sikumbang-kdi0310012023t003','LAGALIGO RESIDENCE II oleh PT LAGALIGO PUTRA PERKASA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 16 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF; Telp: 082259717776; Email: lagaligoputraperkasa@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0336017,122.50527209972222,'https://www.google.com/maps?q=-4.0336017,122.50527209972222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1683278779358-ef52882e-a3db-49d4-a0b0-842aac83a841.jpg","https://sikumbang.tapera.go.id/public/upload/1683278778553-a8a4fed5-b825-4c3f-9514-466d8249b661.jpg","https://sikumbang.tapera.go.id/public/upload/1683278777024-8fc7b858-65ad-4049-94c9-bfd5b77b943c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5b19738a-44e7-4358-bb2e-a5f52f7dbff4',NULL,'rumah_subsidi','rumah_tapak','LAGALIGO RESIDENCE I','sikumbang-kdi0310012023t004','LAGALIGO RESIDENCE I oleh PT LAGALIGO PUTRA PERKASA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF; Telp: 082259717776; Email: lagaligoputraperkasa@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.040646599722222,122.501356,'https://www.google.com/maps?q=-4.040646599722222,122.501356',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1683278290294-47a41203-c7f3-46c9-92b0-6be57caa4b09.jpg","https://sikumbang.tapera.go.id/public/upload/1683278292131-3cc2cd3b-a5c4-4522-a69d-a1b1226bfdb9.jpg","https://sikumbang.tapera.go.id/public/upload/1683278289768-5d9c659e-736d-4bf8-8aef-8cace736ec3c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('52c006fc-73a8-4f55-8926-23344bb8e1b7',NULL,'rumah_subsidi','rumah_tapak','MARGAHAYU LAND KAMBU I','sikumbang-kdi1010022023t002','MARGAHAYU LAND KAMBU I oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 30 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF; Telp: 0811405887; Email: margahayumega@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.0380481999999995,122.54053609972222,'https://www.google.com/maps?q=-4.0380481999999995,122.54053609972222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1683277152102-ecf71f0e-1e1c-4326-a403-6dd901439c44.jpg","https://sikumbang.tapera.go.id/public/upload/1683277153372-8d9c6fe6-ffa3-47a8-8969-b5720943f54d.jpg","https://sikumbang.tapera.go.id/public/upload/1683277153080-9999872d-21a5-4fbd-ae9b-0a37b1e021a1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('681f6d8f-10b0-4828-b3ac-3aa1bceb5a9d',NULL,'rumah_subsidi','rumah_tapak','MARGAHAYU LAND KAMBU 2','sikumbang-kdi1010022023t003','MARGAHAYU LAND KAMBU 2 oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- DETAIL 36 (SUBSIDI) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF; Telp: 0811405887; Email: margahayumega@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.039866899722222,122.5400264,'https://www.google.com/maps?q=-4.039866899722222,122.5400264',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1683277688791-92be1d6a-2313-4ec7-8887-4bee7a22aae2.jpg","https://sikumbang.tapera.go.id/public/upload/1683277689844-c11a3899-765f-4c9a-8634-291e727aa734.jpg","https://sikumbang.tapera.go.id/public/upload/1683277690337-432a298b-5b2d-44ad-b3a5-5a4a046c0a5b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f742c8ea-1ea2-4679-82e9-77d6c56b8751',NULL,'rumah_subsidi','rumah_tapak','LABULENG MOKOAU RESIDENCE','sikumbang-kdi1010022023t004','LABULENG MOKOAU RESIDENCE oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://maps.app.goo.gl/DFFVfR2bnjFKacKX8

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.048952083333333,122.55661772222221,'https://www.google.com/maps?q=-4.048952083333333,122.55661772222221',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1683510705706-c1367cfd-3813-41b4-b5dc-20e19e1ca902.jpg","https://sikumbang.tapera.go.id/public/upload/1683510705679-7db51db0-1547-442c-9489-2b7e243d9b8d.jpg","https://sikumbang.tapera.go.id/public/upload/1683510705437-028138e0-2a5c-41f6-a01b-db76223d3a60.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b0cb666d-2a2b-410b-9e92-3cc81cd39de6',NULL,'rumah_subsidi','rumah_tapak','BUKIT BOULEVARD','sikumbang-kdi0310012023t005','BUKIT BOULEVARD oleh HANAMI TARIDALA GROUP (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 14 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 156.500.000, LB 36 m2 / LT 116 m2, 2 KT / 1 KM, 1 lantai.
- Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 117 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. ADE IRMA NASUTION ; Telp: 085257922261; Email: hanamitaridala@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012023T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.039288027777777,122.50378416666666,'https://www.google.com/maps?q=-4.039288027777777,122.50378416666666',156500000.0,'total',FALSE,2,1,36,116,1,'{"https://sikumbang.tapera.go.id/public/upload/1683365863895-55769967-beed-4bb9-ba60-d59951c37876.jpg","https://sikumbang.tapera.go.id/public/upload/1683365862867-f27c8591-3485-436f-9c28-902ce22ca09d.jpg","https://sikumbang.tapera.go.id/public/upload/1683365863627-248913d1-bc43-4bd7-9eab-1a41c2d48c92.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3c92680b-62ce-407e-b316-e14cbf52707b',NULL,'rumah_subsidi','rumah_tapak','A99 CORP LAND II','sikumbang-kdi0910032023t001','A99 CORP LAND II oleh PT AGFE JAYA PROPERTINDO (HIMPERRA).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.
- 36 (subsidi) (Subsidi): Rp 167.270.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Hurami; Telp: 085145799995; Email: pt.agfejayapropertindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.961230555555556,122.48858055555556,'https://www.google.com/maps?q=-3.961230555555556,122.48858055555556',156500000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/upload/1678331155823-deb7218f-73b5-423b-abc3-d4a1343da3de.jpg","https://sikumbang.tapera.go.id/public/upload/1678331158034-854e8270-a293-4983-830d-dd532a7877f9.jpg","https://sikumbang.tapera.go.id/public/upload/1678331157011-47414d39-959b-42ac-b182-66a205fd1a8f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1bcc4ecb-92ff-439a-93d8-543bd1fa064c',NULL,'rumah_subsidi','rumah_tapak','BUMI BHAKTI RESIDENT','sikumbang-kdi0910012023t003','BUMI BHAKTI RESIDENT oleh PT BHUMI BHAKTI GROUP (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 60 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ratna Sari BTN BPN S.14; Telp: 082262709164; Email: bumibhaktigroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.970934722222222,122.47303472222222,'https://www.google.com/maps?q=-3.970934722222222,122.47303472222222',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/upload/1683264540425-7dda0dc7-6cc2-4d75-af5b-5ea5ab925e56.png","https://sikumbang.tapera.go.id/public/upload/1683264540936-bcddbd85-4fe6-4b13-ae0a-a9be9e87d6cf.png","https://sikumbang.tapera.go.id/public/upload/1683264541922-ca63c21a-6ff3-45ce-8bf9-b1ffe3bee72a.png"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8a90144a-4576-4c36-a93b-7ff3e9163d0e',NULL,'rumah_subsidi','rumah_tapak','Alrazeqi Residence21','sikumbang-bau0110132023t002','Alrazeqi Residence21 oleh CV AL-RAZEQI BERSAUDARA (HIMPERRA).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 19 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl.dayanu ikhsanudin ; Telp: 6281280504179; Email: cv.alrazeqibersaudara@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.5165119,122.56392549722221,'https://www.google.com/maps?q=-5.5165119,122.56392549722221',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1668869628564-8cb19fc4-21f8-4f35-bc83-17a15af202e4.jpg","https://sikumbang.tapera.go.id/public/upload/1668869624539-50fd942c-ff3f-4957-979c-4b05176c5338.jpg","https://sikumbang.tapera.go.id/public/upload/1668869625880-68363251-7426-43ba-b13a-aafbfa02e8aa.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('11803480-4460-49b8-8248-d92fc5038975',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN AZALIA ZAKI III','sikumbang-kdi1010022023t005','PERUMAHAN AZALIA ZAKI III oleh PT AZALIA ZAKI RESIDENS (REI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36/112 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Lingkungan , Kel.Watulondo , Kec.Puuwatu ,Kota Kendari
Jl.Lingkungan Pada Jl. Haluoleo , Kel.Mokoau , Kec.Kambu; Telp: 08114092101; Email: pt.azaliazakiresidence@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022023T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.0481331,122.5546659,'https://www.google.com/maps?q=-4.0481331,122.5546659',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1684121817827-e169c603-4af5-4a3d-95ed-a4f5771a5ab0.jpg","https://sikumbang.tapera.go.id/public/upload/1684121806846-a9b58270-bd12-4475-ab3e-0d017696f3e0.jpg","https://sikumbang.tapera.go.id/public/upload/1684121813634-a9183978-b5f9-4ec5-aaaf-c40594a8dbd9.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('71eb6647-e3ae-4a87-81b7-214ea40e6721',NULL,'rumah_subsidi','rumah_tapak','NEO CAPITANO 2 VILLAGE','sikumbang-bau0110132023t003','NEO CAPITANO 2 VILLAGE oleh PT CANTATA INDAH PROPERTI (PI).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 0 subsidi / 2 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 Subsidi New (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Dayanu Ikhsanuddin; Telp: 081245917369; Email: cantataindahproperti@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.508228,122.57479099999999,'https://www.google.com/maps?q=-5.508228,122.57479099999999',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1685001092906-9a1c6057-5355-41f4-bfd1-ce2eaab4bf8f.jpg","https://sikumbang.tapera.go.id/public/upload/1685001098433-a413476a-42e5-4ea3-b82b-e10f2ef70870.jpg","https://sikumbang.tapera.go.id/public/upload/1685001097486-be73a059-fd6f-4beb-9db0-bf42587a983c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('92900be8-7198-4f13-897e-f2d4830280a9',NULL,'rumah_subsidi','rumah_tapak','VILLA INDAH TAHOA tahap 3','sikumbang-kka0410072023t002','VILLA INDAH TAHOA tahap 3 oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 129 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jln.pemuda; Telp: 082293833529; Email: pt.villa.mutiara.ramadhan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410072023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Tahoa','Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.0837449999999995,121.61411497222221,'https://www.google.com/maps?q=-4.0837449999999995,121.61411497222221',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1684991109274-6d41d252-8f2c-48a6-bb1a-d1682a9fc8da.jpg","https://sikumbang.tapera.go.id/public/upload/1684991109696-9d1933ce-9062-4117-8a7c-3d1d01f265a5.jpg","https://sikumbang.tapera.go.id/public/upload/1684991111707-5c586c99-a26a-4376-af01-294a9b6d181e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5c44cf90-c83a-4f7b-ae0c-511b0f29d17f',NULL,'rumah_subsidi','rumah_tapak','Bukit Baringeng Permai','sikumbang-kdi0310082023t002','Bukit Baringeng Permai oleh PT BARINGENG (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 1 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.
- new (Subsidi): Rp 173.000.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perum Bukit Baringeng Permai Blok B; Telp: 085255577725; Email: pt.baringeng@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.018961111111111,122.49669444444444,'https://www.google.com/maps?q=-4.018961111111111,122.49669444444444',156500000.0,'total',FALSE,2,1,36,90,1,'{"https://sikumbang.tapera.go.id/public/upload/1685430589238-4aeb9e3a-369b-4e0a-bbb6-3c86cf308d80.jpg","https://sikumbang.tapera.go.id/public/upload/1685430590578-9a5485f3-913c-4d0c-a485-79619256f28d.jpg","https://sikumbang.tapera.go.id/public/upload/1685430590075-599cde99-aeb5-4aa4-9759-5cb0dafa8236.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('88c1c512-b7ec-4a0f-9390-c07c85ced50a',NULL,'rumah_subsidi','rumah_tapak','BARUGA HARMONI 3','sikumbang-kdi0310072023t003','BARUGA HARMONI 3 oleh PT RASYA DWI MANDIRI (APERSI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL DI PANJAITAN KECAMATAN  WUA WUA; Telp: 082231952426; Email: rasyadwimandiri@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.022030555555555,122.48263333333334,'https://www.google.com/maps?q=-4.022030555555555,122.48263333333334',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1685770854836-090942ed-23c7-40ff-a1af-425cfbd7ec40.jpg","https://sikumbang.tapera.go.id/public/upload/1685770865833-ad0e1718-280a-4c8d-a330-916839032592.jpg","https://sikumbang.tapera.go.id/public/upload/1685770862983-1b7903cd-6891-4fae-9cb3-c33c1d1c4db5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7ec1a1f6-8f87-46dc-acc6-d82b70feeea2',NULL,'rumah_subsidi','rumah_tapak','KEMALA TOWN HOUSE III','sikumbang-kdi0310012023t006','KEMALA TOWN HOUSE III oleh PT JIRUNA AKUSARA MESARI (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 99 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BOULEVARD PERUMAHAN KEMALA TOWN HOUSE 5 ; Telp: 0811411447; Email: PT.JIRUNAAKUSARAMESARI@GMAIL.COM

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012023T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.032375,122.50208888888889,'https://www.google.com/maps?q=-4.032375,122.50208888888889',156500000.0,'total',FALSE,2,1,36,99,1,'{"https://sikumbang.tapera.go.id/public/upload/1685939684800-2fa96ec2-2689-4ead-82a8-10764878e3e1.jpg","https://sikumbang.tapera.go.id/public/upload/1685939670995-62cb22e6-82bb-40d5-ad30-300fb7f4dc14.jpg","https://sikumbang.tapera.go.id/public/upload/1685939663793-71db1533-799d-4210-88a4-1f08b74840b8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6604c0da-31c4-4cd0-a125-75c6b3ab5f2a',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN DELTA LEPO LEPO PERMAI','sikumbang-kdi0310022023t004','PERUMAHAN DELTA LEPO LEPO PERMAI oleh DELTA BETON NUSANTARA (REI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JLN SAO SAO ; Telp: 082271046689; Email: deltabeton.kdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.032701944444445,122.49925994444445,'https://www.google.com/maps?q=-4.032701944444445,122.49925994444445',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1686128807799-33cffdc9-ba88-43de-a406-00d4f1bc4b1e.jpg","https://sikumbang.tapera.go.id/public/upload/1686128808788-8883ecc1-0186-44f7-91a9-06d9ff9336f6.jpg","https://sikumbang.tapera.go.id/public/upload/1686128806350-01ecec4c-afa2-45ca-aee3-1de0238346c2.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a8aecf6d-c8dd-4a86-8a0f-771e2bd3f9ea',NULL,'rumah_subsidi','rumah_tapak','PERMATA RESIDENCE 6','sikumbang-kdi0410032023t003','PERMATA RESIDENCE 6 oleh PT PERMATA TIRTA JAYA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36/ 97,5 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI 36/ 97,5 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: PERUMAHAN PERMATA RESEIDENCE BLOK A NO 13 KEL. ANDOUNOHU KEC. POASIA KOTA KENDARI; Telp: 081342813438; Email: residencepermata28@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.035739888888889,122.55567930555556,'https://www.google.com/maps?q=-4.035739888888889,122.55567930555556',156500000.0,'total',FALSE,2,1,36,97.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1685876673469-ee10f50e-0b68-4efb-b18e-03acfe3b5017.jpg","https://sikumbang.tapera.go.id/public/upload/1685876661492-815c01c8-7ffd-43a8-b52c-2fc448f71adf.jpg","https://sikumbang.tapera.go.id/public/upload/1685876661283-41cae8c8-127e-427a-8186-7452e6c0a017.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('73953fb2-37ef-48e9-85e6-d8daf6d4ad88',NULL,'rumah_subsidi','rumah_tapak','BUMI LAWORO PERMAI','sikumbang-swg0120012023t001','BUMI LAWORO PERMAI oleh GEMA CITRA PERDANA (APERSI).
Alamat: Wakoila, Kec. Sawerigadi, Kab Muna Barat, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 117 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SUGIMANURU BTN LAENDE; Telp: 082194442202; Email: hilalirianto03@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/SWG0120012023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Muna Barat','Kab Muna Barat','Sawerigadi','Wakoila','Wakoila, Kec. Sawerigadi, Kab Muna Barat, Sulawesi Tenggara',NULL,-4.778913888888889,122.48120555555556,'https://www.google.com/maps?q=-4.778913888888889,122.48120555555556',156500000.0,'total',FALSE,2,1,36,117,1,'{"https://sikumbang.tapera.go.id/public/upload/1679640452737-7dbf7bd4-8b95-4b76-b5c4-3423732f341d.jpg","https://sikumbang.tapera.go.id/public/upload/1679640454058-5a36a920-11bc-470d-aebc-0f183084b2d0.jpg","https://sikumbang.tapera.go.id/public/upload/1679640454729-34bd397b-e0ca-4eff-8dba-991a25e1dd67.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e1c215a5-e8ee-40bb-a072-6d6f8bef69a1',NULL,'rumah_subsidi','rumah_tapak','HALUOLEO GARDEN 3','sikumbang-kdi0410032023t002','HALUOLEO GARDEN 3 oleh PT SULAIMAN ABDI PERSADA (APERSI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 HARGA BARU (Subsidi): Rp 168.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- harga subsidi 2025 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: PERUMNAS POASIA BLOK A; Telp: 081244061663; Email: ptsulaimanabdipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.026916275,122.55419461111111,'https://www.google.com/maps?q=-4.026916275,122.55419461111111',156500000.0,'total',FALSE,2,1,36,97.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1680101335356-f1ccd2e3-5dd8-4f06-83db-e08571b901b1.jpg","https://sikumbang.tapera.go.id/public/upload/1680101336889-44229ec4-52ab-4d09-a96e-fdc208014f88.jpg","https://sikumbang.tapera.go.id/public/upload/1680101332181-de6ada46-d263-4ec1-a983-a8780ff62737.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e04f344e-4527-4c69-9d09-a0d35324653a',NULL,'rumah_subsidi','rumah_tapak','IZRAR FAEYZA RESIDENCE','sikumbang-kka0410072023t001','IZRAR FAEYZA RESIDENCE oleh MEKONGGA FAEYZA KARYA (HIMPERRA).
Alamat: Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 HARGA BARU (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 HARGA BARU 2024 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. KALI MERAH; Telp: 081341848585; Email: mekonggakarya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410072023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Tahoa','Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.083186111111111,121.61322222222222,'https://www.google.com/maps?q=-4.083186111111111,121.61322222222222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1679894217615-7ca9e49c-3eb3-4d09-a69d-6524f9eb1a9a.jpg","https://sikumbang.tapera.go.id/public/upload/1679894219855-a19d1381-336a-401d-836c-b819a06cffbe.jpg","https://sikumbang.tapera.go.id/public/upload/1679894217187-a5790deb-7469-4ebd-9522-4d6ce728ff8d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3a8686b0-74d5-4498-a6a7-0b7d9cab9e21',NULL,'rumah_subsidi','rumah_tapak','ZAM RESIDENCE I','sikumbang-adl0720022023t001','ZAM RESIDENCE I oleh ZAHFRAN ALFARISQI MAKMUR (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. KOTA BAGUN; Telp: 085219993586; Email: ptzam123@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720022023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.052638027777777,122.47497558333333,'https://www.google.com/maps?q=-4.052638027777777,122.47497558333333',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1680253478766-513231be-13af-4978-803c-3449cb0bff85.jpg","https://sikumbang.tapera.go.id/public/upload/1680253520025-89f52e82-df5f-4381-a8f3-de703b34af82.jpg","https://sikumbang.tapera.go.id/public/upload/1680253473949-f8f226c9-6af9-4186-917e-c652fb912d43.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5d1c8f77-19e6-4a95-b6a5-df2c6c956c01',NULL,'rumah_subsidi','rumah_tapak','ANAIWOI VILLAGE RESIDENCE','sikumbang-kka1810032023t001','ANAIWOI VILLAGE RESIDENCE oleh PT SEMBARANG TECHNOLOGY INDONESIA (REI).
Alamat: Anaiwoi, Kec. Tanggetada, Kab Kolaka, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL KAMBOJA; Telp: +62 812-4265-8574; Email: sembarang@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1810032023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Tanggetada','Anaiwoi','Anaiwoi, Kec. Tanggetada, Kab Kolaka, Sulawesi Tenggara',NULL,-4.381309972222222,121.55002591666667,'https://www.google.com/maps?q=-4.381309972222222,121.55002591666667',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1678927865405-710eb57f-38f1-4f57-80c3-15ea2bbd8737.jpg","https://sikumbang.tapera.go.id/public/upload/1678927869858-22f9f5a5-c8cf-482e-8f5b-e8cb9e25cedd.jpg","https://sikumbang.tapera.go.id/public/upload/1678927866097-44b0e04c-5e0e-472c-81ba-5033bcec448b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('afb62ca9-00ec-45cf-b9ca-491b9769e8bf',NULL,'rumah_subsidi','rumah_tapak','Aurora Residence','sikumbang-kdi0310012023t002','Aurora Residence oleh PT MEGAH LOHE BUANNA (HIMPERRA).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Tunggala Gedung RESYS Lt.2; Telp: 081244622246; Email: megahlohebuanna.office@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.051160805555555,122.51022338888889,'https://www.google.com/maps?q=-4.051160805555555,122.51022338888889',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1681455060816-1bca49af-5bf1-4250-8c6e-ed58330b5dae.jpg","https://sikumbang.tapera.go.id/public/upload/1681455050373-674ffad0-7649-43a7-9ede-7a49006b8b67.jpg","https://sikumbang.tapera.go.id/public/upload/1681455055452-1f9cd1dc-44f1-47e5-84fb-fb41a454e1a8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('64b66c8d-6725-435d-a04a-da50f3a94757',NULL,'rumah_subsidi','rumah_tapak','PURI KHANISSA RESIDENCE IV','sikumbang-kka0720032023t001','PURI KHANISSA RESIDENCE IV oleh PT KHAILAH BERKAH JAYA (PI).
Alamat: Huko-huko, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 34 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Poros Kolaka-Pomalaa; Telp: 082348943371; Email: pt.khalahberkahjayakdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720032023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Huko-huko','Huko-huko, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.174328,121.65322897222222,'https://www.google.com/maps?q=-4.174328,121.65322897222222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1681444839765-5ceaa8f5-7877-4972-ac87-9898bbfe14a6.jpg","https://sikumbang.tapera.go.id/public/upload/1681444829697-f9798834-53a4-4275-b4ef-13b9e95c0d8b.jpg","https://sikumbang.tapera.go.id/public/upload/1681444834155-e496d0a7-5a71-4a53-961b-5e616606a321.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('be5ac67f-4545-4c3a-bccf-7c3aa00df5e5',NULL,'rumah_subsidi','rumah_tapak','KHAZANAH ELEGAN WATULIWU 2','sikumbang-lss0120092023t001','KHAZANAH ELEGAN WATULIWU 2 oleh PT GRIYA BINTANG ELEGAN (HIMPERRA).
Alamat: Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- Rumah Tapak (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN GRIYA BINTANG ELEGAN; Telp: 0811401970; Email: pt.gbelegan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120092023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Watuliwu','Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.5052777777777777,120.89277777777778,'https://www.google.com/maps?q=-3.5052777777777777,120.89277777777778',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1682561583246-949f4b84-e54e-4b87-8d21-d9d21fb11fb6.jpg","https://sikumbang.tapera.go.id/public/upload/1682561584819-41c7075d-10fa-4156-85d7-cdd2217d3162.jpg","https://sikumbang.tapera.go.id/public/upload/1682561582341-015b179a-c796-4ab3-b7e2-167e78df9959.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('39495ae4-16c8-4447-a21d-7e323308724d',NULL,'rumah_subsidi','rumah_tapak','MADINAH CITY SQUARE III','sikumbang-kdi0310072023t002','MADINAH CITY SQUARE III oleh PT SWARNA DWIPA PROPERTY (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 33 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ade Irma 2; Telp: 082120860799; Email: ptswarnadwipaproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0251529999999995,122.4899311,'https://www.google.com/maps?q=-4.0251529999999995,122.4899311',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1683005848167-9273b890-1b9a-4689-a5e7-402e1e826708.jpg","https://sikumbang.tapera.go.id/public/upload/1683005845556-ef96fc4a-90a2-42cb-94ef-784c6e3d6bf1.jpg","https://sikumbang.tapera.go.id/public/upload/1683005848621-4625c913-3b57-4624-84f9-6f2281434472.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1cfd29eb-46c2-4946-a9a1-db70004cbdb5',NULL,'rumah_subsidi','rumah_tapak','FELYCIA RESIDENCE (Tahap 2)','sikumbang-kdi0910022023t005','FELYCIA RESIDENCE (Tahap 2) oleh PT FELYCIA PROPERTINDO NIAGA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.
- 3 6 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.
- 36__ (Subsidi): Rp 173.000.000, LB 36 m2 / LT 123 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Chairil Anwar, Kel. Watulondo, Kec. Watulondo Kota Kendari (Kantor Pemasaran Afika Residence, Afika Land dan Felycia Residence); Telp: 082393287000; Email: pt.felyciaproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022023T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9795889999074845,122.482892,'https://www.google.com/maps?q=-3.9795889999074845,122.482892',156500000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1683180673094-a3b3e232-9094-4090-9172-3ccf853ba797.jpg","https://sikumbang.tapera.go.id/public/upload/1683180672745-e48a5ae0-5ce7-42e9-9ae7-35d9b4eacd9c.JPG","https://sikumbang.tapera.go.id/public/upload/1683180673591-4afa4c64-6176-4b9a-b7d5-4291e4dc98a8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE)
) AS v(id,seller_id,category,property_type,title,slug,description,province,city,regency_name,district,subdistrict_name,address_detail,postal_code,latitude,longitude,maps_link,price,price_type,is_negotiable,bedrooms,bathrooms,building_area_sqm,land_area_sqm,floors,images,amenities,subsidy_program,can_kpr,certificate_type,condition,status,is_admin_verified,is_featured,views_count,favorites_count,inquiries_count,published_at,ai_generated)
WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.slug = v.slug);


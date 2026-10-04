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
('a551fe49-1d51-444e-9402-c0ae59d97884',NULL,'rumah_subsidi','rumah_tapak','SERENIA CAMPUS','sikumbang-kdi1010042026t001','SERENIA CAMPUS oleh PT TALLASA SANDY KARSA (REI).
Alamat: Lalolara, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- SERENIA CAMPUS 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perum griya ines amanda blok No 1 . Kel watubang kec baruga; Telp: +62 852-5500-4343; Email: faslyfasly01@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010042026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Lalolara','Lalolara, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-3.998572222222222,122.51589722222222,'https://www.google.com/maps?q=-3.998572222222222,122.51589722222222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/08/10/file-lokasi-857c7e94-19c5-435c-a88d-3013683c0c3c.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/10/file-lokasi-4be0c839-ecec-4ac7-816a-f64b89550cc0.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/10/file-lokasi-30d63e75-a6f3-4b42-94fe-746df2075019.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('dbbf6d32-a830-43d1-a764-87d1045ed52d',NULL,'rumah_subsidi','rumah_tapak','ALFATIH LAND II','sikumbang-adl0820162026t003','ALFATIH LAND II oleh PT NEO ELECTRONIK PROPERTI GROUP (APERSI).
Alamat: Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 71 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.RAMBUTAN II NO 24 A; Telp: 085241533398; WA: 6285241533398; Email: neoelectronikpropertigroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820162026T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Langgea','Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.033419444444444,122.46508888888889,'https://www.google.com/maps?q=-4.033419444444444,122.46508888888889',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/08/12/file-lokasi-a4594263-3068-4af2-9c40-1d7f15d436e3.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/12/file-lokasi-58e4c6a3-17bd-46ac-bb7a-8468d029a3e2.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/12/file-lokasi-cf393fe6-e7bd-49b3-aadf-8a96afff5f71.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ba192caa-65b8-4bb3-92a3-5853110ecdf8',NULL,'rumah_subsidi','rumah_tapak','TAWAKKAL PERMAI II','sikumbang-kka1210012026t001','TAWAKKAL PERMAI II oleh PT AHMAD TAWAKKAL PRATAMA (REI).
Alamat: Puundoho, Kec. Baula, Kab Kolaka, Sulawesi Tenggara.
Total unit: 41 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Poros Kolaka-Pomalaa, Kelurahan Puundoho, Kec. Baula, Kab. Kolaka; Telp: 085179630450; WA: 6285179630450; Email: ahmadmustawakkal538@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1210012026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Baula','Puundoho','Puundoho, Kec. Baula, Kab Kolaka, Sulawesi Tenggara',NULL,-4.162224,121.67769600000001,'https://www.google.com/maps?q=-4.162224,121.67769600000001',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/08/20/file-lokasi-222ecd1e-daea-44c2-96cb-b30a1134ebe2.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/20/file-lokasi-de88e468-aef6-4cc5-a5b5-ad2a97edec19.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/20/file-lokasi-e1efb868-8ee5-498e-b88c-b2ac302788e3.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ab269859-7df5-4213-bf19-3524a3f1b964',NULL,'rumah_subsidi','rumah_tapak','Bahagia Residence','sikumbang-adl0810012026t001','Bahagia Residence oleh PT BAHAGIA PRIMA PROPERTY (HIMPERRA).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 22 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Anawai Perumahan Bahagia Land 1 Blok D; Telp: 085284002224; WA: 6285284002224; Email: bahagialand.kdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0410585999999995,122.4552237,'https://www.google.com/maps?q=-4.0410585999999995,122.4552237',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/08/24/file-lokasi-38ded0fd-9214-46c5-88ff-441700b0e0ed.jpg","https://sikumbang.tapera.go.id/public/upload/2026/08/24/file-lokasi-abefa83c-c7e6-4307-9092-676e5b7c5f65.jpg","https://sikumbang.tapera.go.id/public/upload/2026/08/24/file-lokasi-37635ade-969e-4d73-8733-a7c307a4e172.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('69d0e68e-f2d8-4b87-8348-6ffaf22ef052',NULL,'rumah_subsidi','rumah_tapak','ZAM-ZAM PERMAI TAHAP 2','sikumbang-rmb0410022026t001','ZAM-ZAM PERMAI TAHAP 2 oleh PT FATIHA PERMATA PROPERTINDO (REI).
Alamat: Lameroro, Kec. Rumbia, Kab Bombana, Sulawesi Tenggara.
Total unit: 34 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 117 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln Trans Sulawesi Depan Kantor Bupati Bombana Lameroro, Rumbia, KAB BOMBANA, Provinsi SULAWESI TENGGARA; Telp: 08114034220; WA: 628114034220; Email: fatihapermatapropertindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/RMB0410022026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Bombana','Kab Bombana','Rumbia','Lameroro','Lameroro, Kec. Rumbia, Kab Bombana, Sulawesi Tenggara',NULL,-4.747323027777778,122.00897216666667,'https://www.google.com/maps?q=-4.747323027777778,122.00897216666667',173000000.0,'total',FALSE,2,1,36,117,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581360018863.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581359911100.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581360107969.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a797b777-99cf-4037-b448-5e2992cce17b',NULL,'rumah_subsidi','rumah_tapak','lalowiu residence','sikumbang-adl0720192026t003','lalowiu residence oleh PT GINI MEGA TAMA INDAH (REI).
Alamat: Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 34 subsidi / 0 komersil.

Tipe rumah:
- 36/98 (Subsidi): Rp 173.000.000, LB 32 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: lorong melati, desa kota bangun, kel. rahomeeto, kab. konawe selatan; Telp: 085340548076; WA: 6285340548076; Email: pt.gmi027@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720192026T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Lalowiu','Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.072222222222222,122.48805555555556,'https://www.google.com/maps?q=-4.072222222222222,122.48805555555556',173000000.0,'total',FALSE,2,1,32,97,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/08/15/file-5b756843-d79e-4f5c-83e4-38f1828f2a61.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/15/file-e74f17eb-f343-4dc6-9485-28f696251515.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/15/file-13432174-b0bd-498a-aa46-6b1bf662ea3c.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8207465a-7f10-42df-9574-2c490fb02d9b',NULL,'rumah_subsidi','rumah_tapak','KOTA PRAJA VILLAGE','sikumbang-kdi1010032026t001','KOTA PRAJA VILLAGE oleh PT HARWIN JAYA BAROKAH PROPERTY (HIMPERRA).
Alamat: Padaleu, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 39 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 SUBSIDI (Subsidi): Rp 173.000.000, LB 33 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. PRAJA BOULEVARD; Telp: 085398786061; WA: 6285398786061; Email: jayaharwin@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010032026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Padaleu','Padaleu, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.048597222222222,122.52435277777778,'https://www.google.com/maps?q=-4.048597222222222,122.52435277777778',173000000.0,'total',FALSE,2,1,33,102,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/08/31/file-lokasi-e7e2253b-b2e4-4a44-9148-6b63392f7f12.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/31/file-lokasi-0b1cb99c-478c-4a57-982b-82bd710602fc.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/31/file-lokasi-f9362d1c-19df-4035-8d5d-c68683943af2.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d17109b4-45f2-43f7-822c-dbbed285a04b',NULL,'rumah_subsidi','rumah_tapak','GRIYA MEKAR ALAM','sikumbang-bau0210112026t001','GRIYA MEKAR ALAM oleh PT SARFENDY MEKAR PROPERTY (ASPRUMNAS).
Alamat: Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 42 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. ANOA NO. 58; Telp: 082121559938; Email: mekarpropertyptsarfendy@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210112026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Bukit Wolio Indah','Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.479669,122.61523697222222,'https://www.google.com/maps?q=-5.479669,122.61523697222222',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/08/31/file-9f48f91e-bf8d-474e-a506-8de2d5cdfddc.jpg","https://sikumbang.tapera.go.id/public/upload/2026/08/31/file-bca544a8-2295-47da-b073-e2c1ce1a0e7e.jpg","https://sikumbang.tapera.go.id/public/upload/2026/08/31/file-a469c07a-7f1d-47c6-aaff-563a15a1ff96.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e00854a6-09d7-4d97-88f7-3f32f079c864',NULL,'rumah_subsidi','rumah_tapak','TAMAN KHALIF RESIDENCE','sikumbang-bau0610102026t001','TAMAN KHALIF RESIDENCE oleh PT MAZANA MEGAH PROPERTY (APERNAS).
Alamat: Baadia, Kec. Murhum, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 23 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 1 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: KELURAHAN BAADIA KECAMATAN MURHUM KOTA BAU-BAU; Telp: 085342174589; WA: 6285342174589; Email: Asdianto8796@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0610102026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Murhum','Baadia','Baadia, Kec. Murhum, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.485173972222222,122.593412,'https://www.google.com/maps?q=-5.485173972222222,122.593412',173000000.0,'total',FALSE,1,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/08/13/file-lokasi-f1f1dde0-9530-4473-8b14-ec96079c3df0.jpg","https://sikumbang.tapera.go.id/public/upload/2026/08/13/file-lokasi-5efa17e0-c980-4000-8040-98b597333545.jpg","https://sikumbang.tapera.go.id/public/upload/2026/08/13/file-lokasi-7a45c9a6-3525-4c14-bdc3-dd4e1d0ed9c0.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('23d2c79d-af17-4bcc-9889-73ab33e2b52a',NULL,'rumah_subsidi','rumah_tapak','RAFASYA RESIDENCE','sikumbang-kdi0410032026t006','RAFASYA RESIDENCE oleh PT SINERGI MITRA KONSTRUKSI (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 37 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL haluoleo Lrg Tinggololi; Telp: 085241515081; WA: 6285241515081; Email: smkgrup802@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032026T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.037761111111111,122.5573111111111,'https://www.google.com/maps?q=-4.037761111111111,122.5573111111111',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/09/01/file-lokasi-e480939f-d6a0-4165-a372-71b95c93ae26.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/09/01/file-lokasi-56822013-3bea-4435-82f5-63153c7c8cae.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/09/01/file-lokasi-b51eafa8-52cb-4035-8c18-074b46534bd5.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fad74912-589b-467d-a912-deb9c39829eb',NULL,'rumah_subsidi','rumah_tapak','MARSYA RESIDENCE 2','sikumbang-bau0610102026t002','MARSYA RESIDENCE 2 oleh PT BERKAH BUTON MANDIRI (APERNAS).
Alamat: Baadia, Kec. Murhum, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 36 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 32 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN LIMBO WOLIO; Telp: 085299548109; WA: 6285299548109; Email: bbmberkahbutonmandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0610102026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Murhum','Baadia','Baadia, Kec. Murhum, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.483718861111111,122.59082030555555,'https://www.google.com/maps?q=-5.483718861111111,122.59082030555555',173000000.0,'total',FALSE,2,1,32,102,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/09/04/file-lokasi-763970aa-bd15-4106-9f24-c52005a3ab8d.jpg","https://sikumbang.tapera.go.id/public/upload/2026/09/04/file-lokasi-9d15967f-b69b-4861-8873-7c5876c54489.jpg","https://sikumbang.tapera.go.id/public/upload/2026/09/04/file-lokasi-e9624724-0a8b-4130-8f9a-b112d4a83aa4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('83998321-ccaf-4d5f-a61c-b1eb1d195f9e',NULL,'rumah_subsidi','rumah_tapak','HALUOLEO GARDEN 7','sikumbang-kdi0310072026t008','HALUOLEO GARDEN 7 oleh PT SULAIMAN ABDI PERSADA (APERSI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 28 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. KS Tubun; Telp: 081244061663; WA: 6281244061663; Email: ptsulaimanabdipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072026T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0188659,122.4852107,'https://www.google.com/maps?q=-4.0188659,122.4852107',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/09/08/file-caa440a0-d6e8-4fc2-ac55-5ae116c79645.jpg","https://sikumbang.tapera.go.id/public/upload/2026/09/08/file-f1f558ef-98fc-416a-aad5-6191d265b131.jpg","https://sikumbang.tapera.go.id/public/upload/2026/09/08/file-b3966fdb-b490-4046-aca8-6122ab62c4c0.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d7e8a86b-4595-4e58-af28-4cda77f0bf64',NULL,'rumah_subsidi','rumah_tapak','Green Tamaona','sikumbang-kka0410022026t001','Green Tamaona oleh PT BUMI MEKONGGA PROPERTY (REI).
Alamat: Watuliandu, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 69 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Pemuda  kel. tahoa kec.kolaka kab.kolaka prov. sultra; Telp: 082394594646; WA: 6282394594646; Email: ptbumimekonggaproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410022026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Watuliandu','Watuliandu, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.044462194444444,121.59235380555555,'https://www.google.com/maps?q=-4.044462194444444,121.59235380555555',173000000.0,'total',FALSE,2,1,36,84.5,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/09/02/file-61a91377-4692-45ec-8b4a-0e86bb0fb862.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/09/02/file-1f966c7c-59d9-47b3-90d4-2657d11a49c8.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/09/02/file-869b25b4-7463-4b65-bc10-2f1d8d27f477.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('57e32eca-614e-431d-a5bf-7bbec1f37094',NULL,'rumah_subsidi','rumah_tapak','ANAK SULTAN LAKUDO','sikumbang-lbk0610042026t002','ANAK SULTAN LAKUDO oleh PT ANAK SULTAN LAKUDO (APERNAS).
Alamat: Watulea, Kec. Gu, Kab Buton Tengah, Sulawesi Tenggara.
Total unit: 94 subsidi / 0 komersil.

Tipe rumah:
- 36 Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: LINGKUNGAN GU BARAT; Telp: 085359992899; WA: 6285359992899; Email: anaksultanlakudo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LBK0610042026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton Tengah','Kab Buton Tengah','Gu','Watulea','Watulea, Kec. Gu, Kab Buton Tengah, Sulawesi Tenggara',NULL,-5.260151972222222,122.55809099999999,'https://www.google.com/maps?q=-5.260151972222222,122.55809099999999',173000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/09/14/file-lokasi-7d73facb-6b30-4578-abda-5a1d3300cea6.jpg","https://sikumbang.tapera.go.id/public/upload/2026/09/14/file-lokasi-75b22482-0d28-48f5-b35a-8ab5650d74d5.jpg","https://sikumbang.tapera.go.id/public/upload/2026/09/14/file-lokasi-ce2476d6-8119-4219-8975-82457dcd0c46.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7d06e771-bbb2-45e2-ad97-6f17ac9cb466',NULL,'rumah_subsidi','rumah_tapak','AWAL REGENCY III','sikumbang-adl0820152026t002','AWAL REGENCY III oleh PT AWAL UTAMA GROUP (REI).
Alamat: Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 44 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: AWAL REGENCY 1 BLOK C07, DESA RANOOHA, KECAMATAN RANOMEETO, KABUPATEN KONAWE SELATAN, PROVINSI SULAWESI TENGGARA; Telp: 082114752045; WA: 6282260539442; Email: ptawalutamagroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820152026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranooha','Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.054708333333333,122.44336111111112,'https://www.google.com/maps?q=-4.054708333333333,122.44336111111112',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/09/02/file-d3cf54a7-780c-4e26-bfac-2f3bdb1ba287.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/09/02/file-47c0bf16-1839-4d5e-9292-eeceb5163593.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/09/02/file-0ccd9686-d3e6-446c-a084-358b1b86d7cd.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b1eb5361-f1a4-4da5-86c3-b566c7ce70da',NULL,'rumah_subsidi','rumah_tapak','RAYYA AMARIZ','sikumbang-kdi0310072026t009','RAYYA AMARIZ oleh PT FILLA AZHAR LAND (APERNAS).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- RAYYA AMARIZ (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. TAMBURAKA ; Telp: 081241739239; Email: filaazharland@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072026T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.014811111111111,122.46996944444444,'https://www.google.com/maps?q=-4.014811111111111,122.46996944444444',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/09/24/file-lokasi-9ac15aca-3823-44af-9379-6bfe07310112.jpg","https://sikumbang.tapera.go.id/public/upload/2026/09/24/file-lokasi-027ceea4-5a25-4a67-b280-d968d8e39c93.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/09/24/file-lokasi-e27af7ce-e9b4-48a0-b69d-f379e26eb735.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('497f4e6e-4261-4d52-a0db-054e43ad079e',NULL,'rumah_subsidi','rumah_tapak','BARUGA HARMONI TAHAP 2','sikumbang-kdi0310072026t006','BARUGA HARMONI TAHAP 2 oleh PT RASYA DWI MANDIRI (APERSI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 22 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. CHAIRIL ANWAR HARMONI BUILDING ; Telp: 085397374244; Email: rasyadwimandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072026T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.026119444444444,122.47338055555555,'https://www.google.com/maps?q=-4.026119444444444,122.47338055555555',173000000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/07/02/file-lokasi-7687c669-ca0f-4fa0-9d0a-905353c90e12.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/07/02/file-lokasi-bb52d95f-1b71-44f5-adc1-a7cd4409a1b4.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/07/02/file-lokasi-b8a33958-7fc7-4db3-9ad0-7bbce06f358a.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0f090689-e71a-4179-b0c4-e69b46fb7643',NULL,'rumah_subsidi','rumah_tapak','EBI RESIDENCE I','sikumbang-kdi0910032026t001','EBI RESIDENCE I oleh PT EBI MANDIRI GROUP (DEPRINDO).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 29 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Kelurahan Punggolaka Kecamatan Puuwatu Kota kendari; Telp: 082241834433; Email: ebimandirigroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.963039,122.489106,'https://www.google.com/maps?q=-3.963039,122.489106',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/06/09/file-lokasi-f7964ce5-6b0a-4a07-a3d4-ceee71d518c6.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/06/09/file-lokasi-8c955e40-7728-4af3-abcc-a33c57f8365d.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/06/09/file-lokasi-cc75b15a-d729-4c9b-8493-173eea3768ab.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2dc5fe54-cb3b-4143-bc10-8ceb2bed275e',NULL,'rumah_subsidi','rumah_tapak','AMMAR LIVING LAND','sikumbang-kdi0710012026t002','AMMAR LIVING LAND oleh PT AMMAR PROPERTI INDONESIA (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 76 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL KOL H ABD HAMID PASAR BUAH KALI KADIA KEL KADIA KEC KADIA KOTA KENDARI PROVINSI SULAWESI TENGGARA; Telp: 082156816281; Email: ammarpropertiindonesia@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.987559099722222,122.4885308,'https://www.google.com/maps?q=-3.987559099722222,122.4885308',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/06/29/file-lokasi-9679507e-6080-4e86-ac5d-a45c4c963bf9.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/29/file-lokasi-b94e59da-3797-4ce5-a96c-61d515083a91.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/29/file-lokasi-2e6815b8-e755-4db7-bbf3-0925cc606761.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7c35a1d5-6048-4fb0-9dd9-58464dc17043',NULL,'rumah_subsidi','rumah_tapak','KONASARA RESIDENCE','sikumbang-kdi0310072026t007','KONASARA RESIDENCE oleh PT BINAYA PROPERTINDO NIAGA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 48 subsidi / 0 komersil.

Tipe rumah:
- SCANDINAVIAN (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Boulevard Kendari; Telp: 081140002744; Email: ptbinayapropertindoniaga@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072026T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.022898972222222,122.47279,'https://www.google.com/maps?q=-4.022898972222222,122.47279',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/07/14/file-lokasi-57c878c7-de43-4d0c-8c49-cd9cab550c61.jpg","https://sikumbang.tapera.go.id/public/upload/2026/07/14/file-lokasi-7d1d99b6-d2fe-43b6-a88d-2a62b9839ecb.jpg","https://sikumbang.tapera.go.id/public/upload/2026/07/14/file-lokasi-e8fff092-a61e-435a-8c53-bcc2d4b43cfe.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8f659b27-b07e-4f21-8470-613462fb30af',NULL,'rumah_subsidi','rumah_tapak','GREEN MANSION 4','sikumbang-kdi0710042026t002','GREEN MANSION 4 oleh PT DELAPAN SEMBILAN KONSTRUKSI (HIMPERRA).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 40 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Ahmad Yani, Kompleks Ahmad Yani Square; Telp: 082271005816; Email: ptdelapansembilankonstruksi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.0104041666666665,122.48502472222222,'https://www.google.com/maps?q=-4.0104041666666665,122.48502472222222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/06/30/file-lokasi-c2cc45d6-d5ad-4d6b-ae72-607185acae5e.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/30/file-lokasi-c84ea36b-1966-41b9-928e-7635f75e53da.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/30/file-lokasi-030a1ce9-5aba-4770-abb1-93eabc40d857.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9d6ab6b1-867a-48de-a939-6da07d1c0eee',NULL,'rumah_subsidi','rumah_tapak','PERMATA KOSGORO RESIDENCE','sikumbang-kdi0310012026t004','PERMATA KOSGORO RESIDENCE oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012026T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.040203888888889,122.48435333333333,'https://www.google.com/maps?q=-4.040203888888889,122.48435333333333',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/07/08/file-lokasi-ec801caf-8a44-4aa4-bc03-920f965dfd23.jpg","https://sikumbang.tapera.go.id/public/upload/2026/07/08/file-lokasi-81ee6a46-ae32-4a88-9362-ec0653746f9c.jpg","https://sikumbang.tapera.go.id/public/upload/2026/07/08/file-lokasi-03eb6cc6-87c7-48c1-b90d-6721af821afe.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8f237e67-f9c7-4b3a-8d84-d6b5671361be',NULL,'rumah_subsidi','rumah_tapak','BINTANG MASAGENA 3','sikumbang-lss0110012026t001','BINTANG MASAGENA 3 oleh PT MEGA BOLA MASAGENA (HIMPERRA).
Alamat: Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 78 m2, 2 KT / 1 KM, 1 lantai.
- 36/84 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Griya Bintang Elegan; Telp: 0811401970; Email: megabolamasagena@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0110012026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Lasusua','Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.4994444444444444,120.885,'https://www.google.com/maps?q=-3.4994444444444444,120.885',173000000.0,'total',FALSE,2,1,36,78,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/06/20/file-lokasi-1b105742-26d8-45d6-b234-883e558d6b91.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/20/file-lokasi-9d07cbdd-af0a-434f-96a3-0cb7e134be4d.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/20/file-lokasi-261ffc3d-9fde-4cec-a60f-98a5c1c1c0c5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3292cdd2-dc61-405a-8f2b-d1a0f8034406',NULL,'rumah_subsidi','rumah_tapak','Mutiara Hills','sikumbang-kdi0310082026t004','Mutiara Hills oleh PT TADISANGKA SUKSES BERSAMA (APPERNAS JAYA).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 108 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SUPU YUSUF; Telp: 082363226387; Email: tadisangkasuksesbersama.2023@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082026T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.015452699722222,122.4894666,'https://www.google.com/maps?q=-4.015452699722222,122.4894666',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/06/12/file-lokasi-c48fba26-f629-434a-8224-2973b7e506cd.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/12/file-lokasi-46d8238e-0de4-4ced-9749-5b23f49e5991.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/12/file-lokasi-d5bc652f-f43f-4957-ab8f-c7230010949c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bdd19f7e-a6f2-43ee-bc08-b853cf8134a8',NULL,'rumah_subsidi','rumah_tapak','SUN HALU OLEO','sikumbang-kdi0310012026t005','SUN HALU OLEO oleh PT SULAIMAN PROPERTI NUSANTARA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 112 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan KS Tubun; Telp: 081241666632; Email: ptsulaimanpropertinusantara@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012026T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0527346,122.5080251,'https://www.google.com/maps?q=-4.0527346,122.5080251',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/07/14/file-87bbb017-7300-424e-9a00-bdf2dc0e09f1.jpg","https://sikumbang.tapera.go.id/public/upload/2026/07/14/file-e798c47b-6520-4e42-ac7d-9f9078dc648c.jpg","https://sikumbang.tapera.go.id/public/upload/2026/07/14/file-4c31bfdb-480e-4e73-ac60-b350a8f7aa5d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0a95a499-33aa-4d12-b2c1-db5feaf7990d',NULL,'rumah_subsidi','rumah_tapak','Banua residence lasusua 2','sikumbang-lss0110012026t002','Banua residence lasusua 2 oleh PT PT. BABANA KONSTRUKSI PERSADA (REI).
Alamat: Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 14 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan tomakkeda; Telp: 085232424644; Email: babanakonstruksipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0110012026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Lasusua','Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.5022277777777777,120.88436944444445,'https://www.google.com/maps?q=-3.5022277777777777,120.88436944444445',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/06/30/file-lokasi-29243122-e224-45d0-8d7e-9460edf385fd.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/06/30/file-lokasi-4039f86b-764f-4e46-a0d1-1a223314168d.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/06/30/file-lokasi-6f105492-1c1a-4b52-b2c1-67842bc094ef.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ede52304-e043-47ad-a7c9-ef37274b4d24',NULL,'rumah_subsidi','rumah_tapak','ADHAM TAL HAFIDZ IV','sikumbang-kdi0410032026t005','ADHAM TAL HAFIDZ IV oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032026T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.022015833333334,122.55327194444445,'https://www.google.com/maps?q=-4.022015833333334,122.55327194444445',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/06/10/file-lokasi-99cbe633-8a4f-4c19-b9f4-18f824f4cd33.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/10/file-lokasi-511c1d85-f49d-43fb-9bd8-f8ae55b6dceb.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/10/file-lokasi-2bab5099-8e81-44fd-9455-d700162ddf71.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('798637b5-9af6-4773-b928-f9cc28451f63',NULL,'rumah_subsidi','rumah_tapak','RAJENDRA RESIDENCE 4','sikumbang-kdi0910022026t002','RAJENDRA RESIDENCE 4 oleh PT RIZKY AZKA KONSTRUKSI (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 27 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Chairil Anwar; Telp: 082267240034; Email: sarymulya102@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9748722222222224,122.48801388888889,'https://www.google.com/maps?q=-3.9748722222222224,122.48801388888889',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/06/16/file-lokasi-f3a83151-ea36-42c4-95db-7301d4179c15.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/06/16/file-lokasi-fc76850c-8042-4c47-ac5a-80d48a211262.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/06/16/file-lokasi-9ff18f2f-d576-445e-999e-d6b4a183ff58.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('282283cc-68cb-49d1-bbc5-d4804e67336a',NULL,'rumah_subsidi','rumah_tapak','GREEN MANSION 5','sikumbang-kdi0310072026t005','GREEN MANSION 5 oleh PT DELAPAN SEMBILAN KONSTRUKSI (HIMPERRA).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Ahmad Yani, Kompleks Ahmad Yani Square; Telp: 082271005816; Email: ptdelapansembilankonstruksi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072026T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.013491111111111,122.46662805555556,'https://www.google.com/maps?q=-4.013491111111111,122.46662805555556',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/06/30/file-lokasi-0c0eb347-7849-4641-b2be-345475a0084a.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/30/file-lokasi-4858f6ce-84c3-4737-a701-e1ceb87eb22a.jpg","https://sikumbang.tapera.go.id/public/upload/2026/06/30/file-lokasi-b7aa75e4-82b8-4b06-9f9d-2a6e071dd1d8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f4871445-4316-4e81-8c99-978e62a83c21',NULL,'rumah_subsidi','rumah_tapak','FAHMI RESIDENCE 4 TAHAP 2','sikumbang-adl0820172026t001','FAHMI RESIDENCE 4 TAHAP 2 oleh PT PERMATA TIRTA JAYA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 16 subsidi / 0 komersil.

Tipe rumah:
- 36/ 97.5 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. MELATI; Telp: 082152378299; Email: residencepermata28@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.052013888888888,122.474625,'https://www.google.com/maps?q=-4.052013888888888,122.474625',173000000.0,'total',FALSE,2,1,36,97.5,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/06/04/file-lokasi-0e94b709-2e4a-44d8-acbc-0f6d3abae5f5.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/06/04/file-lokasi-bfe05ad5-bc54-4259-978b-33d3cda64e68.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/06/04/file-lokasi-bf932a4a-279f-47af-869d-04eb4e4762da.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a6dc206f-ae88-428d-83b3-4291f2ac3715',NULL,'rumah_subsidi','rumah_tapak','GRAND INOLOBUNGGADUE','sikumbang-unh0210152026t001','GRAND INOLOBUNGGADUE oleh PT RIZKI ANAWONUA PROPERTINDO (ASPRUMNAS).
Alamat: Inolobunggadue, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 31 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL PAGALA; Telp: 082189247678; Email: rizki.anawonua@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210152026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Inolobunggadue','Inolobunggadue, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,-3.8495408333333336,122.03893083333332,'https://www.google.com/maps?q=-3.8495408333333336,122.03893083333332',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/07/26/file-lokasi-9114317e-7647-47c3-ab2b-e0e5e119864b.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/07/26/file-lokasi-a51f6a34-46e7-495c-b4f7-90212a57a6d6.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/07/26/file-lokasi-25bf9fb3-9641-427c-913e-1d13cff99df6.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9e23c20e-4add-427f-b230-ba67d17849ee',NULL,'rumah_subsidi','rumah_tapak','BERKAH PADANGKUKU RESIDENCE 2','sikumbang-bau0110142026t003','BERKAH PADANGKUKU RESIDENCE 2 oleh CV RAJA BARAKATI PERMAI (ASPERI).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Limbo Wolio No.19B, Kel. Tanganapada, Kec. Murhum; Telp: 081327839178; Email: rajabarakatipermai@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142026T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.4978444444444445,122.58129166666666,'https://www.google.com/maps?q=-5.4978444444444445,122.58129166666666',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/08/10/file-4ff80a8d-0864-4add-b330-ee7e53f8e169.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/10/file-bf65924f-ad7b-4fcd-85b2-13e368ef45d7.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/08/10/file-e8effa2a-c8c9-4806-8b07-b7a1f3ec5cd5.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ea6d54e5-dfc3-4e14-9ec1-a3d0b2624e70',NULL,'rumah_subsidi','rumah_tapak','VILLA PERMATA RESIDENCE','sikumbang-unh0210162026t001','VILLA PERMATA RESIDENCE oleh PT  BUMI FADYA MANDIRI GROUP (APERSI).
Alamat: Asambu, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 33 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: VILLA PERMATA RESIDENCE; Telp: 081340247776; Email: ptbumifadyamandirigroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210162026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Asambu','Asambu, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,-3.852298888888889,122.04858194444444,'https://www.google.com/maps?q=-3.852298888888889,122.04858194444444',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/07/24/file-lokasi-76ec95b3-95b3-4957-a682-82ed956db493.png","https://sikumbang.tapera.go.id/public/upload/2026/07/24/file-lokasi-5d8f5e61-a9de-4c5b-a6e5-fd45c15cd7a5.png","https://sikumbang.tapera.go.id/public/upload/2026/07/24/file-lokasi-38723826-d215-4d48-a25e-a7826c644114.png"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9155e2a3-ae30-4753-9943-bcd890474bd6',NULL,'rumah_subsidi','rumah_tapak','Faisal Residence','sikumbang-kdi0310012026t003','Faisal Residence oleh PT FAISAL KREASINDO GROUP (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 25 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Beringin; Telp: 081774878775; Email: Faisalresidence04@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012026T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.047029,122.50391199972222,'https://www.google.com/maps?q=-4.047029,122.50391199972222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/25/file-lokasi-2ca3c83b-fcc0-42f7-9031-d0ebf3c9d952.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/25/file-lokasi-0b256845-2846-414a-927f-e1400d50610d.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/25/file-lokasi-ef1065ac-493f-4689-87aa-93628aa1edd4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c5d3a607-8b58-4991-b726-9b4a31cb4590',NULL,'rumah_subsidi','rumah_tapak','TAWAKAL RESIDENCE','sikumbang-adl0820162026t002','TAWAKAL RESIDENCE oleh PT YASNUM TAWAKAL PROPERTY (ASPRUMNAS).
Alamat: Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 40 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. Sorumba; Telp: 085221436136; Email: yasnumtawakalproperty@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820162026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Langgea','Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0307889999999995,122.466744,'https://www.google.com/maps?q=-4.0307889999999995,122.466744',173000000.0,'total',FALSE,2,1,36,150,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/30/file-lokasi-3750c9a0-6706-4ca6-a20e-c8c0f40e4dbe.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/30/file-lokasi-e42c099e-ac06-410f-aa8b-389cebcbcb72.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/30/file-lokasi-ceb6587c-6cbf-4579-bf99-0692f5ae7253.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0d97f4ff-8d13-42eb-8dfa-ffa22419d8a5',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN AHI MARUH PERMAI','sikumbang-kdi0910062026t001','PERUMAHAN AHI MARUH PERMAI oleh PT AHI MARU PERKASA (APERSI).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 120 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. Chairil Anwar Lr. Lamarundu; Telp: 081242111700; Email: ptahimaruperkasa@Gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9430173,122.4920874,'https://www.google.com/maps?q=-3.9430173,122.4920874',173000000.0,'total',FALSE,2,1,36,120,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/13/file-lokasi-a53c08dd-e035-4dfc-873c-5509734daf6b.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/13/file-lokasi-66c2f4d6-fe92-448f-927d-2165ed88a9de.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/13/file-lokasi-605714dd-943f-4d3a-b804-8ab986eb6f55.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('15ab7fd9-2ab5-4522-aa7b-c3d4223a8777',NULL,'rumah_subsidi','rumah_tapak','ANAIWOI VILLAGE RESIDENCE II','sikumbang-kka1810032026t002','ANAIWOI VILLAGE RESIDENCE II oleh PT SEMBARANG TECHNOLOGY INDONESIA (REI).
Alamat: Anaiwoi, Kec. Tanggetada, Kab Kolaka, Sulawesi Tenggara.
Total unit: 32 subsidi / 3 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. ANOA; Telp: 081242658574; Email: riswandiabbas48@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1810032026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Tanggetada','Anaiwoi','Anaiwoi, Kec. Tanggetada, Kab Kolaka, Sulawesi Tenggara',NULL,-4.379304599999999,121.54040799972222,'https://www.google.com/maps?q=-4.379304599999999,121.54040799972222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/04/30/file-lokasi-8a27c9b3-bdde-4ea2-93c2-1a6b31d3a7cf.jpg","https://sikumbang.tapera.go.id/public/upload/2026/04/30/file-lokasi-6d7a7a2c-9a84-44f8-8732-d5ae9717ffe2.jpg","https://sikumbang.tapera.go.id/public/upload/2026/04/30/file-lokasi-a6521226-1c33-4cfb-a3f1-bef5e3e16dff.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d8119803-10a3-4b41-a01a-2a4669d838b5',NULL,'rumah_subsidi','rumah_tapak','GRIYA CITRA LEPO-LEPO','sikumbang-kdi0310082026t003','GRIYA CITRA LEPO-LEPO oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 100 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082026T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.015809444444445,122.49109027777777,'https://www.google.com/maps?q=-4.015809444444445,122.49109027777777',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/06/file-lokasi-fbeedaba-9c33-46db-9d9c-869ff2f2f8e8.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/06/file-lokasi-a9e106e7-0ea7-456e-9d67-c565df3a4fc6.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/06/file-lokasi-97c3cdfa-115c-48a9-8f91-2df0f68c1166.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('79bf038e-bd1f-48f1-802a-0faa03d380ed',NULL,'rumah_subsidi','rumah_tapak','ERLANGGA MEGA RESIDENCE - BUKIT SULAA','sikumbang-bau0110132026t003','ERLANGGA MEGA RESIDENCE - BUKIT SULAA oleh PT ERLANGGA MEGA PROPERTI (APERNAS).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 94 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN LAKARAMBAU; Telp: 0852-4167-7871; Email: erlanggamegaproperti@gmail.com; Web: https://www.facebook.com/erlanggamegaresidence

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132026T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.510576634813566,122.56791687518007,'https://www.google.com/maps?q=-5.510576634813566,122.56791687518007',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/03/file-f5b30589-2ece-4e15-814f-7eaa680a6b95.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/03/file-c509d133-2e1d-43bc-85d2-9bc86a13bc31.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/03/file-4a14f71b-a83c-4bba-a3b9-2462ca150ac1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('66eef064-ea25-4959-8262-80b9aef8d7d7',NULL,'rumah_subsidi','rumah_tapak','BINTANG REGENCY IV','sikumbang-adl0720192026t002','BINTANG REGENCY IV oleh PT BINTANG GROUP TERBUKA (REI).
Alamat: Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 52 subsidi / 0 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: DESA LALOWIU KEC KONDA KAB KONAWE SELATAN SULAWESI TENGGRA; Telp: 082216773545; Email: ptbintanggrouptbk@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720192026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Lalowiu','Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.071358799722222,122.48757019972223,'https://www.google.com/maps?q=-4.071358799722222,122.48757019972223',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/05/file-lokasi-19da64cb-b766-48d1-b02f-26df55b376d4.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/05/file-lokasi-fce97a52-2041-4e2f-90e6-14a403fd71b9.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/05/file-lokasi-b3dd1a41-cf31-4e19-a288-7a394b38e620.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('528ab1f2-71bb-4596-91f9-bde5f0c6cdc8',NULL,'rumah_subsidi','rumah_tapak','LARUMBALANGI RESIDENCE','sikumbang-kka0410032026t002','LARUMBALANGI RESIDENCE oleh PT ANEKA RAYA MULTISARANA (REI).
Alamat: Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 28 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BADEWI; Telp: 082137398884; Email: ptarmskolaka@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410032026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Balandete','Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.071680555555555,121.6320111111111,'https://www.google.com/maps?q=-4.071680555555555,121.6320111111111',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/04/21/file-eb76dd7d-262f-463e-97dc-1acddc458137.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/21/file-3a772da1-dc42-4a63-b3f7-899dbbb6b7d9.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/21/file-22adb023-b25f-46d4-aad7-1a0e360ecd92.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d5f908fa-1757-4751-9a97-579c160da7b1',NULL,'rumah_subsidi','rumah_tapak','BUMI SAMARKAND','sikumbang-kdi0910012026t001','BUMI SAMARKAND oleh PT SWARNA DWIPA PROPERTY (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 688 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Sao Sao; Telp: 082120860799; Email: ptswarnadwipaproperty@gmail.com; Web: https://swarnadwipaproperty.com/

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9572737997222225,122.4695569,'https://www.google.com/maps?q=-3.9572737997222225,122.4695569',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/12/file-lokasi-03248ca8-1fc4-4b07-a32f-289181fc58a9.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/12/file-lokasi-5f9481ad-b77e-41f5-8119-b188309af378.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/12/file-lokasi-f2de3992-dde2-47eb-ad6f-7fd26ed3efbb.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c5055e3c-2c1a-4356-a2e3-3d7fd5c693aa',NULL,'rumah_subsidi','rumah_tapak','GREEN WINSTA 2','sikumbang-unh0210022026t001','GREEN WINSTA 2 oleh PT BERKAH ALAM RIMBA (REI).
Alamat: Tumpas, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 16 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 86 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL AH NASUATION; Telp: 082298913530; Email: alwisetiawan199704@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210022026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Tumpas','Tumpas, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,-3.8634694444444446,122.04383333333332,'https://www.google.com/maps?q=-3.8634694444444446,122.04383333333332',173000000.0,'total',FALSE,2,1,36,86,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/12/file-ecb984fe-7fe2-4734-90c7-7b97ed4e6385.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/12/file-2f29788e-9657-4166-9979-727ae8520d87.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/12/file-feb693f6-e12d-453a-81f6-123594d29f5c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e9f8363e-076b-49c9-93dc-39d0ae27e5f2',NULL,'rumah_subsidi','rumah_tapak','GRIYA ATIKO LAND','sikumbang-unh2120022026t001','GRIYA ATIKO LAND oleh PT HARUMAWARDI ATIKO GROUP (APERSI).
Alamat: Pebunooha, Kec. Bondoala, Kab Konawe, Sulawesi Tenggara.
Total unit: 57 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan poros pohara laosu ; Telp: 08134126665; Email: harumawardiatiko@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH2120022026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Bondoala','Pebunooha','Pebunooha, Kec. Bondoala, Kab Konawe, Sulawesi Tenggara',NULL,-3.9222777777777775,122.44345833333334,'https://www.google.com/maps?q=-3.9222777777777775,122.44345833333334',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/14/file-lokasi-ea879543-e15c-4b0e-95b4-2be51c650a8d.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/14/file-lokasi-c1ea035e-c8c7-41b9-8eee-5ab8dd0cbc9e.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/14/file-lokasi-64d49b2d-fb4e-4613-b8dc-f97f76ba5b6a.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0bbc84a6-3a63-436b-abea-36c111dc6fc9',NULL,'rumah_subsidi','rumah_tapak','LAWERO RESIDENCE','sikumbang-bau0110142026t002','LAWERO RESIDENCE oleh PT MOLAGINA KALALESA KARUNA (APERNAS).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 88 subsidi / 2 komersil.

Tipe rumah:
- 36 SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN DAYANU IKHSANUDDIN; Telp: 081242503585; WA: 6281242503585; Email: molaginakalalesa@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.5025,122.57762,'https://www.google.com/maps?q=-5.5025,122.57762',173000000.0,'total',FALSE,2,1,36,97,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/19/file-lokasi-da32f8f9-fe10-4b67-adf3-be0c4769bb4e.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/19/file-lokasi-fa9c86f1-72be-447b-a28f-a73adecd1b5f.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/19/file-lokasi-a114ea73-d23b-4c4e-9a1f-00ad2c1c9fbf.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d05b96fd-bb74-4f43-9e33-7c24a28ba5e3',NULL,'rumah_subsidi','rumah_tapak','GRIYA DIOLO','sikumbang-unh2120092026t001','GRIYA DIOLO oleh CV AQLI NUSANTARA (HIMPERRA).
Alamat: Diolo, Kec. Bondoala, Kab Konawe, Sulawesi Tenggara.
Total unit: 34 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: DESA TIRAWUTA; Telp: 085146160101; Email: aqlinusantara4@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH2120092026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Bondoala','Diolo','Diolo, Kec. Bondoala, Kab Konawe, Sulawesi Tenggara',NULL,-3.9105555555555553,122.45611111111111,'https://www.google.com/maps?q=-3.9105555555555553,122.45611111111111',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/20/file-lokasi-24e429c2-297b-464e-a6e0-193043cf05b7.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/20/file-lokasi-df089c58-b2d8-4310-90b7-bddb26d5aa9b.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/20/file-lokasi-42fcc11b-08c0-48ff-a58f-2a7b0960345b.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f611ece9-b40e-4bee-9d47-9ee0c51a20ca',NULL,'rumah_subsidi','rumah_tapak','ALEXANDRIA CITY','sikumbang-kdi0310072026t003','ALEXANDRIA CITY oleh PT NASYATUL DIRU UTAMA (APPERNAS JAYA).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 40 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / - KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SUPU YUSUF RUKO PETAK NO.5; Telp: 085372667043; Email: nasyatuldiruutama2023@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072026T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.021208333333333,122.46250833333333,'https://www.google.com/maps?q=-4.021208333333333,122.46250833333333',173000000.0,'total',FALSE,2,0,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/12/file-lokasi-339c1887-3269-4005-959f-a42b720c21d9.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/12/file-lokasi-79bed750-1e41-48cc-b81c-39acc14b1a24.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/12/file-lokasi-ed525f7f-eb62-47ed-9dcc-9d4e6adb2331.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a6d3b21a-d6cc-408f-95fa-dc27df107a11',NULL,'rumah_subsidi','rumah_tapak','RAJENDRA HILLS','sikumbang-kdi0310072026t004','RAJENDRA HILLS oleh PT RIZKY AZKA KONSTRUKSI (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 212 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Chairil Anwar; Telp: 082267240034; Email: rajendrahills@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072026T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.015025,122.48716666666667,'https://www.google.com/maps?q=-4.015025,122.48716666666667',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/19/file-59db3b93-04ee-42ed-b4ef-c6589a9ce8f4.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/19/file-30993581-e412-40aa-ada3-33c209f84e99.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/19/file-0426cb78-9d02-4f99-a45b-57a6d722438f.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('719a2ba4-9a1a-49bc-8f53-efc731db92d6',NULL,'rumah_subsidi','rumah_tapak','NUR EMPAT TAHAP 7','sikumbang-kdi0410032026t004','NUR EMPAT TAHAP 7 oleh PT ANUGERAH SRI PUTRI LESTARI (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 16 subsidi / 0 komersil.

Tipe rumah:
- 36 m2 (Subsidi): Rp 173.000.000, LB 26 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL LIMBO KOMP BTN II; Telp: 081244854165; Email: ptanugerahsriputrilestari@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032026T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.039691666666666,122.556275,'https://www.google.com/maps?q=-4.039691666666666,122.556275',173000000.0,'total',FALSE,2,1,26,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/21/file-lokasi-51c1e403-aaa6-474d-988a-f9c98757d4e2.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/21/file-lokasi-0b8fa509-d34b-48b6-a98a-d522587b5c7f.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/21/file-lokasi-7fb09721-e77f-4778-b596-6cbf33ded4c4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d1c89748-5e01-4c7a-973d-016c73d8e201',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN BUMI ARUM PERMAI','sikumbang-adl0820162026t001','PERUMAHAN BUMI ARUM PERMAI oleh PT BUMI ARUM LESTARI (APERSI).
Alamat: Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL MAYJEND KATAMSO; Telp: 082398999431; Email: pt.bumiarumlestari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820162026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Langgea','Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.035447222222222,122.46194444444444,'https://www.google.com/maps?q=-4.035447222222222,122.46194444444444',173000000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/29/file-lokasi-cb7e2d64-3b5d-4a49-b4f8-06e84a677bb9.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/29/file-lokasi-172fb283-ed12-412f-9c4b-d64633119ee9.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/05/29/file-lokasi-45c9fc01-fb43-4315-aae9-0dd69d590da4.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9922b829-e5ef-4122-bc54-1838e526ff97',NULL,'rumah_subsidi','rumah_tapak','MEKAR ALAMANDA 2','sikumbang-kdi0310022026t001','MEKAR ALAMANDA 2 oleh PT MEKAR ALAM PRINDO (REI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL CHAIRIL ANWAR; Telp: 085342174589; Email: Asdianto8796@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.021282,122.510901,'https://www.google.com/maps?q=-4.021282,122.510901',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/17/file-lokasi-e20d054d-3af2-457d-8c36-b11242cd5072.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/17/file-lokasi-e181893c-ccf6-4cf4-8ca9-79d061aae5f8.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/17/file-lokasi-4d567c12-e57b-4482-b5af-cfc028e4ac4e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fa4beef4-e045-4de7-b1f6-abdfb213af44',NULL,'rumah_subsidi','rumah_tapak','HALUOLEO GARDEN 8','sikumbang-kdi0310012026t001','HALUOLEO GARDEN 8 oleh PT SULAIMAN ABDI PERSADA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. K.S. TUBUN. KEL. BARUGA, KEC. BARUGA, KOTA KENDARI; Telp: 081244061663; Email: ptsulaimanabdipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0549874,122.5074232,'https://www.google.com/maps?q=-4.0549874,122.5074232',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/01/29/file-9ea2c159-3abd-489c-b33b-630f17d02093.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/29/file-0344c440-c527-454a-b599-8609c62d5fc0.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/29/file-e59b798a-6818-4ce9-9d8e-cadc543b0041.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e7677606-a808-452f-908f-36a0df65ec30',NULL,'rumah_subsidi','rumah_tapak','GANIYAN RESIDENCE 1','sikumbang-adl0720192026t001','GANIYAN RESIDENCE 1 oleh PT GANIYAN RIZQIA GROUP (REI).
Alamat: Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 55 subsidi / 0 komersil.

Tipe rumah:
- 36+ (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LAPOROTA,; Telp: 082277774158; Email: ptganiyanrizqiagroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720192026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Lalowiu','Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0700946,122.48756849972223,'https://www.google.com/maps?q=-4.0700946,122.48756849972223',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/01/31/file-lokasi-189a6e96-e4e8-465a-835a-09df77e04797.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/01/31/file-lokasi-2b0d2c35-721b-49a1-9d35-e4fd83127dad.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/01/31/file-lokasi-75143a12-5f46-4327-b506-a3e4a36fb219.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2840fb1d-4e01-4a7b-a89e-06588aff270f',NULL,'rumah_subsidi','rumah_tapak','BINTANG REGENCY III','sikumbang-adl0820022026t001','BINTANG REGENCY III oleh PT BINTANG GROUP TERBUKA (REI).
Alamat: Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 28 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: KELURAHAN ONEWILA KECAMATAN RANOMEETO KONAWE SELATAN; Telp: 082127777330; Email: PT.BINTANGGROUPTBK@GMAIL.COM

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820022026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Onewila','Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.059922222222222,122.42593611111111,'https://www.google.com/maps?q=-4.059922222222222,122.42593611111111',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/02/03/file-lokasi-22767c22-7175-49cb-b597-17f3f8593049.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/02/03/file-lokasi-a9af51c3-bf3c-4b6c-9d68-d3a4626b7303.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/02/03/file-lokasi-64a72411-dc17-4836-9a80-ba5eb26810df.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('baaf408b-bbb3-4b3a-b5e0-837bbb0e960e',NULL,'rumah_subsidi','rumah_tapak','PURI KHANISSA RESIDENCE VII','sikumbang-lbk0610042026t001','PURI KHANISSA RESIDENCE VII oleh PT KHAILAH BERKAH JAYA (PI).
Alamat: Watulea, Kec. Gu, Kab Buton Tengah, Sulawesi Tenggara.
Total unit: 68 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. POROS TMMD (LAKAPERA-WAARA); Telp: 082311570457; Email: pt.khalahberkahjayakdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LBK0610042026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton Tengah','Kab Buton Tengah','Gu','Watulea','Watulea, Kec. Gu, Kab Buton Tengah, Sulawesi Tenggara',NULL,-5.2525,122.5586111111111,'https://www.google.com/maps?q=-5.2525,122.5586111111111',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/02/14/file-lokasi-116f179e-01b5-442c-81c1-22921b857c94.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/02/14/file-lokasi-94ed1b5b-99ed-426f-9166-5098ec46c7ca.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/02/14/file-lokasi-6b5d35e8-b3cc-4806-9ca7-25d57a7d3e52.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('dad5de36-392a-4aca-8288-b3f31206767e',NULL,'rumah_subsidi','rumah_tapak','GRAHA INDAH ANAWAI','sikumbang-kdi0310082026t001','GRAHA INDAH ANAWAI oleh PT SINERGI INDAH NUSANTARA (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 194 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BTN SHIFA PERDANA 8 PUNGGOLAKA; Telp: 085255501236; Email: sinergiin08@gmail.com; Web: https://maps.app.goo.gl/h65AgD3VDnj9SC9g8?g_st=aw

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.01274,122.48389666666667,'https://www.google.com/maps?q=-4.01274,122.48389666666667',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/02/25/fotoContoh-ca47c177-e4a0-4592-8049-60479b5b7792.jpg","https://sikumbang.tapera.go.id/public/upload/2026/02/25/fotoGerbang--703050c3-1ce0-46c1-9b06-fce11a30147e.jpg","https://sikumbang.tapera.go.id/public/upload/2026/02/25/fotoTengah-5b691753-a901-4945-9e35-c658f11fde0b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0d9210ee-9a9e-4ddc-af51-5516b1a42547',NULL,'rumah_subsidi','rumah_tapak','AWAL REGENCY II','sikumbang-adl0820152026t001','AWAL REGENCY II oleh PT AWAL UTAMA GROUP (REI).
Alamat: Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN POROS BANDARA HALUOLEO, BTN AWAL REGENCY I; Telp: 082260539442; Email: ptawalutamagroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820152026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranooha','Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0560577,122.4514992,'https://www.google.com/maps?q=-4.0560577,122.4514992',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/02/14/file-lokasi-195ab6f2-5e02-4eb3-b50c-f43ca63cb1f6.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/02/14/file-lokasi-1748a63e-1056-4fbc-b92d-d3b4033c222e.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/02/14/file-lokasi-1008db40-8aad-4061-8b4b-31fc49a7b7bc.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('04084334-33b6-4195-ae71-6b4ccc8af522',NULL,'rumah_subsidi','rumah_tapak','RATU PERMAI RESIDENCE 5','sikumbang-bau0110142026t001','RATU PERMAI RESIDENCE 5 oleh CV RATU PERMAI (ASPERI).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- T36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Limbo Wolio, Kelurahan Tanganapada, Kec. Murhum, Kota Baubau; Telp: 081243618604; Email: ratupermain@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.498017777777778,122.57974083333333,'https://www.google.com/maps?q=-5.498017777777778,122.57974083333333',168000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/03/04/file-lokasi-e2618e6c-a714-415e-81f8-805a22cf9e97.jpg","https://sikumbang.tapera.go.id/public/upload/2026/03/04/file-lokasi-67fe1808-602a-4dd3-8887-9f270d143327.jpg","https://sikumbang.tapera.go.id/public/upload/2026/03/04/file-lokasi-d1efa1b5-927b-4534-81be-707a844f1236.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2121834b-811c-4331-96d2-1ad135d72fb1',NULL,'rumah_subsidi','rumah_tapak','ANAY RESIDENCE II','sikumbang-kdi0910022026t001','ANAY RESIDENCE II oleh PT RATU ANAY KONSTRUKSI (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 72 subsidi / 0 komersil.

Tipe rumah:
- ANAY RESIDENCE II 36 PLUS (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. KONGGOASA (PERUMAHAN ANAY RESIDENCE I) KEL. WATULONDO KEC. PUUWATU ; Telp: 0812 2224 1488; Email: ratuanaykonstruksi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9613495000000003,122.4746963,'https://www.google.com/maps?q=-3.9613495000000003,122.4746963',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/03/27/file-lokasi-ac4a466c-69ac-41a8-806e-0c0ca2259050.jpg","https://sikumbang.tapera.go.id/public/upload/2026/03/27/file-lokasi-217b65cd-d67f-4c6b-a27c-25b1db0c808a.jpg","https://sikumbang.tapera.go.id/public/upload/2026/03/27/file-lokasi-1e917b6e-01b5-409b-a62a-babbbca15067.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('51fcd7f6-0eab-4509-88a0-0011873bb8cb',NULL,'rumah_subsidi','rumah_tapak','JATAYU PUTRA DEWATA','sikumbang-kka0410032026t001','JATAYU PUTRA DEWATA oleh PT JATAYU PUTRA DEWATA (ASPRUMNAS).
Alamat: Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Badewi; Telp: 08124115479; Email: ptjatayuputra22@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410032026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Balandete','Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.066707999999999,121.63042399999999,'https://www.google.com/maps?q=-4.066707999999999,121.63042399999999',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/04/09/file-lokasi-6e8194ae-6463-46af-9c79-4ada06f4b54a.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/09/file-lokasi-f993e860-129f-4f19-aa43-feb045d97601.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/09/file-lokasi-0902634a-05a7-4438-a0da-7cf7c7001f65.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('481d2a64-4829-4996-97d7-85b0c49ed3a5',NULL,'rumah_subsidi','rumah_tapak','ALAM RAYA HILLS','sikumbang-kdi0310082026t002','ALAM RAYA HILLS oleh PT ALAM RAYA REGENCY (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 181 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl D I Panjaitan Lr Kehutanan ; Telp: 081222532814; Email: Alamrayaregency@gmail.com; Web: https://maps.app.goo.gl/46nauAqaGkhmrrTz7?g_st=aw

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.014759166666667,122.49154027777777,'https://www.google.com/maps?q=-4.014759166666667,122.49154027777777',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/04/13/file-lokasi-531be11e-07a5-4ad7-88a2-ec4c5936cbe1.jpg","https://sikumbang.tapera.go.id/public/upload/2026/04/13/file-lokasi-5fe84514-02cc-473c-9784-fa4ca53cc395.jpg","https://sikumbang.tapera.go.id/public/upload/2026/04/13/file-lokasi-7c021ad1-4069-4a17-aacd-551def142b6a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e1fb22e2-fce7-4b60-8eaa-6fc29a28c951',NULL,'rumah_subsidi','rumah_tapak','GRIYA PUNCAK RESIDENCE','sikumbang-bau0210072026t001','GRIYA PUNCAK RESIDENCE oleh PT KOYOTAP BUKAKAL ABADI (ASPRUMNAS).
Alamat: Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Pahlawan; Telp: 085169326635; Email: ptgriyamediapropertindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210072026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Kadolo Katapi','Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.463712258600776,122.63687687028364,'https://www.google.com/maps?q=-5.463712258600776,122.63687687028364',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/04/13/file-lokasi-99d42fb9-4cab-44da-9888-4cbe2592b237.jpg","https://sikumbang.tapera.go.id/public/upload/2026/04/13/file-lokasi-d93611ce-f461-4be1-8211-93bc7d23617a.jpg","https://sikumbang.tapera.go.id/public/upload/2026/04/13/file-lokasi-c5354880-e142-4d1b-bab9-94086f92e6f2.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fc3c0b79-31aa-4b0b-9565-a8e3bc12e50a',NULL,'rumah_subsidi','rumah_tapak','ISTANA CITY 2','sikumbang-kdi0410032026t002','ISTANA CITY 2 oleh PT WAKUMORO JAYA PROPERTINDO (APERSI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. TINGGOLOLI; Telp: 085242467819; Email: WAKUMOROJAYAPROPERTINDO@GMAIL.COM; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.041238888888889,122.56276111111112,'https://www.google.com/maps?q=-4.041238888888889,122.56276111111112',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/04/14/file-lokasi-3689c3db-566b-4828-a34e-77f2de46ce14.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/14/file-lokasi-70cd2ab8-0967-49d9-94bd-b98511cf8eb6.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/14/file-lokasi-9d221c68-eb87-49e7-b4fa-ba4e4e058e9f.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8e71fb59-4f68-4fcd-9d98-b82ee8a52778',NULL,'rumah_subsidi','rumah_tapak','GRAND WIMAL RESIDENCE','sikumbang-bng0110092026t001','GRAND WIMAL RESIDENCE oleh PT WIMAL KULISUSU WABIA (HIMPERRA).
Alamat: Lipu, Kec. Kulisusu, Kab Buton Utara, Sulawesi Tenggara.
Total unit: 62 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. MINA-MINANGA; Telp: 085242831294; Email: widozaliadin@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BNG0110092026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton Utara','Kab Buton Utara','Kulisusu','Lipu','Lipu, Kec. Kulisusu, Kab Buton Utara, Sulawesi Tenggara',NULL,-4.784643611111111,123.18351444444446,'https://www.google.com/maps?q=-4.784643611111111,123.18351444444446',173000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/04/17/file-lokasi-2ecc7d19-efc2-4132-9b41-afe056f8d21a.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/17/file-lokasi-cd0dff51-bd1d-486a-9a16-c9ac9f09accb.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/17/file-lokasi-2dbd5cda-6502-4f0d-9078-b379df9f30dd.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d0973226-9a54-411d-ac3e-9438087532c9',NULL,'rumah_subsidi','rumah_tapak','TINGGOLOLI RESIDENCE 2','sikumbang-kdi0410032026t001','TINGGOLOLI RESIDENCE 2 oleh PT SINAR PRIBUMI GRUP (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL HALUOLEO LRG TINGGOLOLI; Telp: 085241515081; Email: sinarpribumi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.027602777777778,122.55006388888889,'https://www.google.com/maps?q=-4.027602777777778,122.55006388888889',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/03/14/file-lokasi-c8125235-3dbf-47b5-9cbe-d7b90ab19550.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/03/14/file-lokasi-5cb60be7-f24a-4566-928d-9ca7b131a668.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/03/14/file-lokasi-2210db21-3735-4b73-8a4e-a5e50554eb06.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c7ea3ab7-ee8c-41ac-b902-a7e816f13b73',NULL,'rumah_subsidi','rumah_tapak','BUKIT MEKAR','sikumbang-kdi0310012026t002','BUKIT MEKAR oleh PT AROMA NUSA KUSUMA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 2026 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. D.I. PANJAITAN; Telp: 082393326221; Email: aromanusakusuma.pt@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.034688888888889,122.50201111111112,'https://www.google.com/maps?q=-4.034688888888889,122.50201111111112',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/03/12/file-lokasi-ecdb5d07-da98-408a-8ab0-0196300b7101.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/03/12/file-lokasi-e47f91cc-e731-4fad-a9f6-d4ffb8dfe8fa.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/03/12/file-lokasi-3cffe678-e7aa-4539-818b-a9eedae44c4e.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6b9ee516-ffd3-466c-814d-05dcb7b6596d',NULL,'rumah_subsidi','rumah_tapak','BUKIT MUTIARA ESTATE','sikumbang-kdi0410032026t003','BUKIT MUTIARA ESTATE oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032026T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.018336388888889,122.55198916666666,'https://www.google.com/maps?q=-4.018336388888889,122.55198916666666',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/05/04/file-lokasi-befd1809-9834-42c3-9284-5bd7be7f1b8a.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/04/file-lokasi-ac0c1cb8-901b-47b3-8b03-a9d1fe2f722f.jpg","https://sikumbang.tapera.go.id/public/upload/2026/05/04/file-lokasi-6dfaf9a1-cd2d-478f-b4ec-0cb5590eead3.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9fb3f61d-b5b3-4f1a-8a3b-700c2fb8d684',NULL,'rumah_subsidi','rumah_tapak','GRIYA CITRA HOMBIS','sikumbang-kdi0310072026t002','GRIYA CITRA HOMBIS oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 68 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.013682222222222,122.46698388888889,'https://www.google.com/maps?q=-4.013682222222222,122.46698388888889',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/04/30/file-lokasi-89eb8596-6e21-4ba7-9a7b-ffe7368c77a2.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/30/file-lokasi-c82fb227-8ce5-4095-96dc-3332b2c16a86.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/30/file-lokasi-67e7b034-2890-4754-b9f8-1f99e5a119bb.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2316fa28-e933-405c-aeb9-d7d665e2c8c5',NULL,'rumah_subsidi','rumah_tapak','GRIYA CITRA WUA-WUA RESIDENCE','sikumbang-kdi0710012026t001','GRIYA CITRA WUA-WUA RESIDENCE oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 136 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.993538611111111,122.47830194444445,'https://www.google.com/maps?q=-3.993538611111111,122.47830194444445',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/04/30/file-lokasi-7a1f509c-d1be-44eb-8bcf-5f66cceb4716.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/30/file-lokasi-97de24a8-9223-4f0b-bc6a-300ec8cb1939.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/04/30/file-lokasi-31d8001c-da57-46a7-9eeb-f8723e20ce52.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('00a09b2c-36ef-4793-9113-76e2e8096cb0',NULL,'rumah_subsidi','rumah_tapak','AL-RaZeQi Residence','sikumbang-bau0110132025t004','AL-RaZeQi Residence oleh CV AL-RAZEQI BERSAUDARA (HIMPERRA).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- t36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 103 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Dayanu Ikhsanudin ; Telp: 081280504179; Email: cv.alrazeqibersaudara@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132025T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.5165119,122.56392549722221,'https://www.google.com/maps?q=-5.5165119,122.56392549722221',173000000.0,'total',FALSE,2,1,36,103,1,'{"https://sikumbang.tapera.go.id/public/upload/1668867010408-7dbffed3-1e1e-4897-a87e-4b7b56324a63.jpg","https://sikumbang.tapera.go.id/public/upload/1668867009191-795c3e06-198b-4fdd-8d9d-24d74baa7e8a.jpg","https://sikumbang.tapera.go.id/public/upload/1668867011372-7b0087b0-b3ef-4ee4-bbc7-874361604755.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('aac7fc4b-7b1e-4e34-9f2a-d28e3e1ebe20',NULL,'rumah_subsidi','rumah_tapak','KABA RESIDENCE TAHAP 9','sikumbang-kdi0310012025t007','KABA RESIDENCE TAHAP 9 oleh PT KARYABARU BERKAH NUSANTARA (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 128 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Brigjen Katamso, Perumahan Kaba Residence, Nomor E2, Sulawesi Tenggara, Kota Kendari, Baruga, Baruga; Telp: 082226666906; Email: kbnproperti@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012025T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.050525399722222,122.49585059972222,'https://www.google.com/maps?q=-4.050525399722222,122.49585059972222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/12/06/file-8841d48e-a93e-4ff6-9a1c-1ae86198274d.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/06/file-c161ae49-3886-48cc-b436-723ed83f2c5a.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/06/file-6db89361-4521-4401-87c9-cdc72108a371.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ff6c1da3-d55b-4935-ac45-51b3204f6832',NULL,'rumah_subsidi','rumah_tapak','GRAND PRIMA SKY','sikumbang-kdi0410042025t005','GRAND PRIMA SKY oleh PT ZAFRAN MUQADDIM PROPERTY (APERSI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 7 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN Grand Boulevard Regency Blok E90, Mokoau, Kambu, Kota Kendari, Sulawesi Tenggara; Telp: 082199113009; Email: zmp@flyup.id; Web: zmp.corpo.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042025T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0150008594609465,122.55729916113427,'https://www.google.com/maps?q=-4.0150008594609465,122.55729916113427',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/12/16/file-lokasi-57150781-43b3-4590-904d-9f26466c827c.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/16/file-lokasi-b8f7c014-428f-4193-9e2f-62d55f9507bf.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/16/file-lokasi-bf13f5fe-4d11-4361-9b07-c018c80a5fd2.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a6906f2e-3b11-4ee1-8e64-8a2850baaec1',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN ANGGORO PERMAI III','sikumbang-bau0210112025t001','PERUMAHAN ANGGORO PERMAI III oleh PT ANGGORO MAJU ABADI (REI).
Alamat: Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- Tapak (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Dayanu Ikhsanuddin ; Telp: 085241573597; Email: anggoromajuabadi@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210112025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Bukit Wolio Indah','Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.478016666666667,122.62352222222222,'https://www.google.com/maps?q=-5.478016666666667,122.62352222222222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/11/17/file-db6aa419-17c5-4102-8c58-adf3d38a390b.jpg","https://sikumbang.tapera.go.id/public/upload/2025/11/17/file-31b62d3c-0095-454e-85ab-626d0ec7873d.jpg","https://sikumbang.tapera.go.id/public/upload/2025/11/17/file-01f77718-d8cf-47b0-99af-6b6ac49f49ac.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('503c43f6-95f2-4447-a78f-534c4f1b0159',NULL,'rumah_subsidi','rumah_tapak','PRATAMA RESIDENCE','sikumbang-kka0720072025t002','PRATAMA RESIDENCE oleh PT SAHABAT HARMONI KOLAKA (HIMPERRA).
Alamat: Pesouha, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. PRAMUKA; Telp: 082310674897; Email: sahabatharmonikolaka@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720072025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Pesouha','Pesouha, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.173866666666667,121.63458333333334,'https://www.google.com/maps?q=-4.173866666666667,121.63458333333334',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/12/21/file-754a613a-7f51-479e-a6dc-2fef11299e6d.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/21/file-1df5f397-66db-4a4e-97ad-ddd3219569e1.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/21/file-9175d579-c741-4b77-a2c0-69304b88f9f8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('63cfdb96-f62f-4ab7-b4c6-e7a13348240b',NULL,'rumah_subsidi','rumah_tapak','RINSU RESIDENCE II','sikumbang-kdi0910012025t003','RINSU RESIDENCE II oleh PT RINSU GROUP INDONESIA (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL LINGKUNGAN PROF M YAMIN; Telp: 085333300034; Email: rinsugroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9625001111111113,122.46422575,'https://www.google.com/maps?q=-3.9625001111111113,122.46422575',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/12/15/file-lokasi-1bf49cde-1def-4eb8-812c-5a928a87d04e.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/15/file-lokasi-59f29fb9-1164-4675-ade2-0b7c2a1c0970.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/15/file-lokasi-62caf7ef-494a-4b95-a131-c216e63a3c38.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8bfef957-8ef8-49a1-9db7-6939420bb4c9',NULL,'rumah_subsidi','rumah_tapak','GRIYA CITRA WATUBANGGA RESIDENCE','sikumbang-kdi0310072025t011','GRIYA CITRA WATUBANGGA RESIDENCE oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com; Web: https://maps.app.goo.gl/GbXc9ibRx9gVS6eu9

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072025T011 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.026473888888889,122.47970277777777,'https://www.google.com/maps?q=-4.026473888888889,122.47970277777777',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/12/24/file-lokasi-bcdee59f-7a52-4c27-a99a-015214f6dcba.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/24/file-lokasi-a814f6e1-d30b-4b5f-b44e-9748d2709041.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/24/file-lokasi-54be1ed8-0849-4ee5-bde9-c9f1302bdb37.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('10c92913-0aff-4d9b-b261-d6b2a0186102',NULL,'rumah_subsidi','rumah_tapak','MIFZAL ANAK SULTAN RESIDENCE','sikumbang-lbk0110072025t001','MIFZAL ANAK SULTAN RESIDENCE oleh PT SULTAN MEKAR JAYA (APERNAS).
Alamat: Lakudo, Kec. Lakudo, Kab Buton Tengah, Sulawesi Tenggara.
Total unit: 58 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.
- 80 (Komersil): Rp 550.000.000, LB 80 m2 / LT 140 m2, 3 KT / 2 KM, 1 lantai.
- 60 (Komersil): Rp 450.000.000, LB 60 m2 / LT 140 m2, 3 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: Lingkungan GU Barat II; Telp: 085359992899; Email: ptsultanmekarjaya@gmail.com; Web: ptsultanmekarjaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LBK0110072025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton Tengah','Kab Buton Tengah','Lakudo','Lakudo','Lakudo, Kec. Lakudo, Kab Buton Tengah, Sulawesi Tenggara',NULL,-5.318869111111111,122.53321075,'https://www.google.com/maps?q=-5.318869111111111,122.53321075',173000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/12/16/file-lokasi-f8cdff58-3dfd-4d24-9b1b-76758a927113.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/16/file-lokasi-6f49a349-f5da-432d-bd20-9b2831614711.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/16/file-lokasi-d92df257-a6ad-4132-9b34-4ce2fa6b3054.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fa32d78a-781a-4a2e-bc59-a9f15ffec490',NULL,'rumah_subsidi','rumah_tapak','DREEN RESIDENCE','sikumbang-kdi0910022025t007','DREEN RESIDENCE oleh PT TIGA JAYA SULTRA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Pulau Sulawesi, BTN Dreen Residence ; Telp: 082299782445; Email: dreenresidence@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022025T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.950902777777778,122.4709111111111,'https://www.google.com/maps?q=-3.950902777777778,122.4709111111111',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/12/27/file-lokasi-922d3a90-b827-418f-85d4-d346f36e874d.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/27/file-lokasi-ba04a481-6169-4d21-8bcc-42f815545d44.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/27/file-lokasi-ac0820db-309c-4bf7-9413-bd8b7c87be4a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9e01574c-bbb1-43c2-99eb-bbd5955a257d',NULL,'rumah_subsidi','rumah_tapak','Grand Labungkari City','sikumbang-lbk0620032026t001','Grand Labungkari City oleh PT RULLYTASARI (APERSI).
Alamat: Walando, Kec. Gu, Kab Buton Tengah, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Jenderal Sudirman ; Telp: 0811549968; Email: ptrullytasari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LBK0620032026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton Tengah','Kab Buton Tengah','Gu','Walando','Walando, Kec. Gu, Kab Buton Tengah, Sulawesi Tenggara',NULL,-5.263652777777778,122.54558055555556,'https://www.google.com/maps?q=-5.263652777777778,122.54558055555556',173000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/01/05/file-afa5f489-8e84-4df6-9a19-0700d5602987.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/05/file-9ac88213-faed-4d5b-8709-55cdfa63537b.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/05/file-339a1553-4017-4ded-9121-d814e25d1f9b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e6cdbadd-d657-4ff7-a6b5-cd611bccafab',NULL,'rumah_subsidi','rumah_tapak','HAN CITY SQUARE','sikumbang-kka1810032026t001','HAN CITY SQUARE oleh PT HARAPAN ADE NUSANTARA (APERSI).
Alamat: Anaiwoi, Kec. Tanggetada, Kab Kolaka, Sulawesi Tenggara.
Total unit: 57 subsidi / 0 komersil.

Tipe rumah:
- HAN CITY SQUARE (Subsidi): Rp 173.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Menwa; Telp: 085222241157; Email: ptharapanadenusantara@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1810032026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Tanggetada','Anaiwoi','Anaiwoi, Kec. Tanggetada, Kab Kolaka, Sulawesi Tenggara',NULL,-4.373734944444444,121.52754211111112,'https://www.google.com/maps?q=-4.373734944444444,121.52754211111112',173000000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/01/12/file-lokasi-4cb2c43b-ab32-4ed1-ae56-926ab81eb827.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/12/file-lokasi-27b2b7aa-cc9b-4add-a3e9-eff02720cdf1.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/12/file-lokasi-1f6cd511-d90c-4b33-ad99-976da1d247dd.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('89dfb31d-53ba-448b-b550-3f6d47d01045',NULL,'rumah_subsidi','rumah_tapak','PORARA RESIDENCE','sikumbang-unh2120292026t001','PORARA RESIDENCE oleh PT PUTRI ARINI SIRADJUDDIN (APERSI).
Alamat: Laosu Jaya, Kec. Bondoala, Kab Konawe, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 167.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Desa Porara, Kec. morosi, Kab. Konawe, Provinsi Sulawesi Tenggara; Telp: 082348801994; Email: pt.putriarinisiradjuddib@gmail.com; Web: @Porara_Residence

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH2120292026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Bondoala','Laosu Jaya','Laosu Jaya, Kec. Bondoala, Kab Konawe, Sulawesi Tenggara',NULL,-3.866611111111111,122.41818888888889,'https://www.google.com/maps?q=-3.866611111111111,122.41818888888889',167000000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/12/26/file-lokasi-53e1670b-96fc-4d3f-a5b9-1340ad850b72.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/12/26/file-lokasi-c2c1569b-f815-45d0-b0fc-3427697f8bcc.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/12/26/file-lokasi-0300806e-d013-4fee-851d-ecb8509cfd1a.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c2a6a4eb-d272-4acb-aabc-5ac7f2e342c7',NULL,'rumah_subsidi','rumah_tapak','Aswinda Residence','sikumbang-bau0110132026t001','Aswinda Residence oleh PT CAHAYA ASWINDA JAYA (APERNAS).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 17 subsidi / 2 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Betoambari; Telp: 082213712226; Email: cahayaaswindajaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.501993888888889,122.56921972222221,'https://www.google.com/maps?q=-5.501993888888889,122.56921972222221',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/01/13/file-lokasi-14e35149-a579-4f8f-b1ae-e135b3a1fd4c.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/13/file-lokasi-844ac971-12c9-425a-87a8-a1e9abbf6632.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/13/file-lokasi-c22df73b-669a-4c2b-b40d-5d6a804778d4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d35d0323-166d-4224-962c-c8ccea4e59bf',NULL,'rumah_subsidi','rumah_tapak','AISYAH RESIDENCE 4','sikumbang-adl0820192026t001','AISYAH RESIDENCE 4 oleh PT ANNUR BERKAH PROPERTI (REI).
Alamat: Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 40 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 94.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Gersamata; Telp: 085123238493; Email: berkahannur200@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820192026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Laikaha','Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0406455999999995,122.44781999972223,'https://www.google.com/maps?q=-4.0406455999999995,122.44781999972223',173000000.0,'total',FALSE,2,1,36,94.5,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/01/23/file-lokasi-9014bb46-f7dd-4aad-8d6b-e59bfc739883.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/01/23/file-lokasi-8f1db6bd-3d5d-4269-bd4f-bfe10eedf4f2.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/01/23/file-lokasi-3e87fff5-c98e-4b54-9396-7ace904e3313.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1ed13939-e3a9-4fda-b2a0-78dd6155c83d',NULL,'rumah_subsidi','rumah_tapak','RAZKA TOWN HOUSE','sikumbang-kdi0710042026t001','RAZKA TOWN HOUSE oleh PT MAJU GRIYA CAHAYA (APERSI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. WULELE; Telp: 08114019700; Email: majugriyacahaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.013617777777778,122.49285583333334,'https://www.google.com/maps?q=-4.013617777777778,122.49285583333334',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/01/26/file-lokasi-13e28479-b2cf-4eae-abdb-74c50e56677b.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/26/file-lokasi-4a08b7e5-5081-4ce9-afb7-3d7c16856c37.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/26/file-lokasi-fa974d3c-f150-413a-b922-6275881738d6.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('86598006-d430-4eab-a11b-6cddcf3228f3',NULL,'rumah_subsidi','rumah_tapak','QUEEN RESIDENCE','sikumbang-bau0110132026t002','QUEEN RESIDENCE oleh CV QANZA DEVELOPMENT (APERNAS).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Dayanu Ikhsanuddin; Telp: 08122229844; Email: cvqanzadevelopment1@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132026T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.50334,122.56622,'https://www.google.com/maps?q=-5.50334,122.56622',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/01/30/file-lokasi-5411e438-da26-4ddb-802f-dec8ff27bf81.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/01/30/file-lokasi-aea2ebf9-3407-40f5-9fbb-307b089a6a64.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/01/30/file-lokasi-6963793f-1d78-40c7-afc6-3e95d9e807a0.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ec0ffc93-be36-4cbe-8414-47a50163bead',NULL,'rumah_subsidi','rumah_tapak','PESONA BUMI','sikumbang-kdi0310072026t001','PESONA BUMI oleh PT PESONA BUMI PROPERTY (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl.syech yusuf ; Telp: 082298673735; Email: civilheri7@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.026037194444444,122.47544858333333,'https://www.google.com/maps?q=-4.026037194444444,122.47544858333333',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/01/30/file-lokasi-0049bf20-3add-470f-9512-2bfce4b5cdd9.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/30/file-lokasi-41586437-72d3-44d0-8207-f6d6d1978ff9.jpg","https://sikumbang.tapera.go.id/public/upload/2026/01/30/file-lokasi-9b58f540-9cb0-4995-8db0-c9fc8c0215bd.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('614c90c7-2c97-4b19-b8d7-340977f073d7',NULL,'rumah_subsidi','rumah_tapak','TAMAN JAMBU RESIDENCE','sikumbang-kdi0410042026t001','TAMAN JAMBU RESIDENCE oleh PT MAZANA GLOBAL PROPERTINDO (APERSI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 87.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL CHAIRIL ANWAR; Telp: 0853-4217-4589; Email: mazanaglobalpropertindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042026T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.016776,122.55855799999999,'https://www.google.com/maps?q=-4.016776,122.55855799999999',173000000.0,'total',FALSE,2,1,36,87.5,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/01/27/file-lokasi-e5a292e3-56da-4496-a748-84d94de2e0b8.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/01/27/file-lokasi-deaae38f-65c8-4e67-b8a7-fb489e5faf95.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/01/27/file-lokasi-b11a4961-2628-4ca3-b3eb-e3c9b7bfa7f9.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('14978477-d061-494a-9c25-2999895232fb',NULL,'rumah_subsidi','rumah_tapak','EVERGREEN VILLAGE','sikumbang-kka0410072025t002','EVERGREEN VILLAGE oleh PT ADIB DAYA SULAWESI (REI).
Alamat: Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 16 subsidi / 0 komersil.

Tipe rumah:
- 36/174 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 174 m2, 2 KT / 1 KM, 1 lantai.
- 36/166 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 166 m2, 2 KT / 1 KM, 1 lantai.
- 36/153 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 153 m2, 2 KT / 1 KM, 1 lantai.
- 36/104 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36/125,5 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 125.5 m2, 2 KT / 1 KM, 1 lantai.
- 36/110,5 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 110.5 m2, 2 KT / 1 KM, 1 lantai.
- 36/160 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 160 m2, 2 KT / 1 KM, 1 lantai.
- 36/125 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 125 m2, 2 KT / 1 KM, 1 lantai.
- 36/102 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.
- 36/103 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 103 m2, 2 KT / 1 KM, 1 lantai.
- 36/110 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 110 m2, 2 KT / 1 KM, 1 lantai.
- 36/106 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 106 m2, 2 KT / 1 KM, 1 lantai.
- 36/159 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 159 m2, 2 KT / 1 KM, 1 lantai.
- 36/174 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 174 m2, 2 KT / 1 KM, 1 lantai.
- 36/157 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 157 m2, 2 KT / -1 KM, 1 lantai.
- 36/156 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 156 m2, 1 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Komp. Evergreen Village Blok A2. Jl. Bokeo Robe; Telp: 085333902228; Email: adibdayasulawesi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410072025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Tahoa','Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.083038888888889,121.61846944444444,'https://www.google.com/maps?q=-4.083038888888889,121.61846944444444',173000000.0,'total',FALSE,2,1,36,174,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/25/file-lokasi-fccb1f58-327c-416c-8e21-34cb67079145.DNG","https://sikumbang.tapera.go.id/public/upload/2025/09/25/file-lokasi-d95a83b4-167e-45e8-be6a-ab024f4c2b37.DNG","https://sikumbang.tapera.go.id/public/upload/2025/09/25/file-lokasi-ac605ffb-9e40-47ed-ac32-39a5f1b8d080.DNG"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f9084254-c6c9-4fe1-af10-3f34cf30838a',NULL,'rumah_subsidi','rumah_tapak','VILLA INDAH TAHOA 3','sikumbang-kka0410072025t001','VILLA INDAH TAHOA 3 oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.PEMUDA; Telp: 082293212640; Email: pt.villa.mutiara.ramadhan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410072025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Tahoa','Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.083898999722222,121.6141183,'https://www.google.com/maps?q=-4.083898999722222,121.6141183',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-lokasi-33ddcaa4-51fb-4f83-ab38-b796d035d787.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-lokasi-27adcc59-e392-40a5-89e0-f3874cce9b8d.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-lokasi-ce32133b-81f7-4063-b52a-26186e94b679.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7aeeefab-720f-4c8b-8791-c5d0b9e6495d',NULL,'rumah_subsidi','rumah_tapak','BUKIT NUSANTARA 2','sikumbang-kdi0310072025t009','BUKIT NUSANTARA 2 oleh PT TULUS BERKARYA UTAMA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Sao-Sao; Telp: 082196541415; Email: tulusberkaryautama@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072025T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.024497799722222,122.47414559972222,'https://www.google.com/maps?q=-4.024497799722222,122.47414559972222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/10/04/file-lokasi-6d8903e7-0ad3-4586-ba3a-381fc82c0191.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/04/file-lokasi-12912eeb-4850-4a6b-bf78-8f3bf20c09b7.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/04/file-lokasi-e7942068-1e33-4070-b451-679338f03028.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('54f36ffe-4e92-440c-977f-ec8523599cc9',NULL,'rumah_subsidi','rumah_tapak','PENGEMBANGAN GRIYA HILWA ZAITUN 2','sikumbang-kdi0610032025t002','PENGEMBANGAN GRIYA HILWA ZAITUN 2 oleh PT KAEMBA JAYA UTAMA (REI).
Alamat: Abeli, Kec. Abeli, Kota Kendari, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Pemuda; Telp: 085343945138; Email: kaembajayautama.kdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0610032025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Abeli','Abeli','Abeli, Kec. Abeli, Kota Kendari, Sulawesi Tenggara',NULL,-3.9908595,122.58037399999999,'https://www.google.com/maps?q=-3.9908595,122.58037399999999',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/15/file-lokasi-839a687e-d880-4489-93a7-b9c035e47f3c.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/15/file-lokasi-32abaf4f-5d23-412c-846f-6eed0306d5d9.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/15/file-lokasi-5ceeb1b6-19ad-438e-84ad-fefeb8d56a0f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5e1bf336-09f8-4531-b2b4-f83c9459e6b7',NULL,'rumah_subsidi','rumah_tapak','BUKIT IMPIAN PERMAI','sikumbang-unh3610092025t001','BUKIT IMPIAN PERMAI oleh PT NATIRA ASA SEJAHTERA (PI).
Alamat: Watunggarandu, Kec. Lalonggasumeeto, Kab Konawe, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 145 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. TAMBANG BATU,NO.1 Kec, Lalonggasumeeto Kel, Watunggarandu Provinsi Sulawesi Tenggara; Telp: 0895323582449; Email: natiraasasejahtera@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH3610092025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Lalonggasumeeto','Watunggarandu','Watunggarandu, Kec. Lalonggasumeeto, Kab Konawe, Sulawesi Tenggara',NULL,-3.8881722222222224,122.5013,'https://www.google.com/maps?q=-3.8881722222222224,122.5013',173000000.0,'total',FALSE,2,1,36,145,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/10/05/file-lokasi-e5a373a7-311e-4be5-a66e-8713e1a587d7.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/10/05/file-lokasi-37d8f9b3-5bed-4c41-b473-914ef23563db.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/10/05/file-lokasi-a91f0286-ac3f-4115-b7f7-340c77a85b87.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ef14cbcf-36eb-4a4d-b450-8c1e1f973900',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN JAYA BERLIAN REGENCY','sikumbang-rmb0410022025t001','PERUMAHAN JAYA BERLIAN REGENCY oleh PT WUNA JAYA BOMBANA (REI).
Alamat: Lameroro, Kec. Rumbia, Kab Bombana, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: KEL. LAMERORO, KEC. RUMBIA, KAB. BOMBANA, SULAWESI TENGGARA; Telp: 082345190117; Email: bombanawunajaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/RMB0410022025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Bombana','Kab Bombana','Rumbia','Lameroro','Lameroro, Kec. Rumbia, Kab Bombana, Sulawesi Tenggara',NULL,-4.7516574,122.0199806,'https://www.google.com/maps?q=-4.7516574,122.0199806',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/10/16/file-lokasi-bf326577-9c16-4e86-8e2e-deff8ac4523a.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/16/file-lokasi-5f86e6b5-7569-43e6-9bf0-fc4e5f1b2142.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/16/file-lokasi-f05bc10c-f40b-42ef-bcfa-0840b98bc6dd.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bbbde51b-5881-4922-bcb4-50dd032932fb',NULL,'rumah_subsidi','rumah_tapak','GRIYA ANDIKA RESIDENCE','sikumbang-adl0720192025t003','GRIYA ANDIKA RESIDENCE oleh BERJAYA ZANYA PROPERTY (REI).
Alamat: Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 17 subsidi / 1 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 145 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SAO SAO  NO 266 KELURAHAN BENDE KECAMATAN KADIA KOTA KENDARI SULAWESI TENGGARA; Telp: 082190760337; Email: ptberjayazanyaproperty@gmai.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720192025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Lalowiu','Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.064676666666666,122.49002833333333,'https://www.google.com/maps?q=-4.064676666666666,122.49002833333333',173000000.0,'total',FALSE,2,1,36,145,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/10/15/file-e6a26960-84f6-4252-bb29-9cb10ac4f3a4.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/15/file-a7c6b577-34d7-4ea1-a56f-4a1f8931ce5d.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/15/file-4a749847-ee3e-4f7f-8f42-d30343d730e0.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8b16689e-edfd-44f1-9602-a0f14e812394',NULL,'rumah_subsidi','rumah_tapak','CECERIA RESIDENCE V','sikumbang-bau0110132025t003','CECERIA RESIDENCE V oleh CV MELAJU JAYA (PI).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 61 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Gajah Mada; Telp: 082290115797; Email: melajujayacv@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.523552777777778,122.57103333333333,'https://www.google.com/maps?q=-5.523552777777778,122.57103333333333',173000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/10/20/file-lokasi-e5c5a031-194b-41f6-a713-c6910919b337.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/20/file-lokasi-bc184a11-5ffb-4234-9f1d-c43adc44e590.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/20/file-lokasi-08554cf2-af81-4bed-932c-d3ec53e45a37.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3ebd41ae-f805-40c7-b3ea-35257874d634',NULL,'rumah_subsidi','rumah_tapak','Rajendra Residence II','sikumbang-kdi0310072025t010','Rajendra Residence II oleh PT RAJENDRA PRATYAKSA GROUP (APERSI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Chairil Anwar; Telp: 085397219997; Email: Wanabaskarainyoman@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072025T010 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.014302777777778,122.46840555555556,'https://www.google.com/maps?q=-4.014302777777778,122.46840555555556',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/10/30/file-lokasi-e916f34b-8361-4996-b094-97f5118d4a35.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/10/30/file-lokasi-04e111d8-a6d5-4dff-b604-b19ef06bc1b8.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/10/30/file-lokasi-1d7dfcc4-0e01-4cfa-8519-39ab39715045.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('621c5267-38e9-48cb-84bd-3e85f30f951b',NULL,'rumah_subsidi','rumah_tapak','LILY MEKAR ASRI','sikumbang-kdi0710042025t008','LILY MEKAR ASRI oleh PT LIMARSHA PARAMA JAYA (PI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 27 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Tunggala Baru ; Telp: 081355055067; Email: limarsharparamajaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042025T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.004921999722222,122.4939648,'https://www.google.com/maps?q=-4.004921999722222,122.4939648',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/04/16/fotoContoh-c01afc2e-9a19-44f7-832a-04088d4bd253.jpg","https://sikumbang.tapera.go.id/public/upload/2026/04/16/fotoGerbang--89aa377a-f408-4acd-9218-d6dae3593830.jpg","https://sikumbang.tapera.go.id/public/upload/2026/04/16/fotoTengah-afe40e69-1be8-4f04-a98f-5cd409a6211e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e29397c7-a88a-4ea6-918b-777598765662',NULL,'rumah_subsidi','rumah_tapak','DHARMA UTAMA RESIDENCE','sikumbang-kdi0410042025t004','DHARMA UTAMA RESIDENCE oleh PT MITRA PROPERTY SULTRA (APERSI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 147 subsidi / 30 komersil.

Tipe rumah:
- 36/91m2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 55 (Komersil): Rp 350.000.000, LB 55 m2 / LT 91 m2, 3 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BANTENG, KELURAHAN RAHANDOUNA, KECAMATAN POASIA, KOTA KENDARI; Telp: 082290705156; Email: ptmitrapropertysultra21@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042025T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.038117777777778,122.56301777777777,'https://www.google.com/maps?q=-4.038117777777778,122.56301777777777',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/11/26/file-lokasi-b0655571-e572-41bb-81f0-a1e72bf0d7ae.jpg","https://sikumbang.tapera.go.id/public/upload/2025/11/26/file-lokasi-2d38a2cb-2caf-4309-b9d0-907f505d9785.jpg","https://sikumbang.tapera.go.id/public/upload/2025/11/26/file-lokasi-0755933a-5f01-47ee-981a-5d8b2d29729b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9787328e-7467-4f0b-a41d-4c61f152598c',NULL,'rumah_subsidi','rumah_tapak','Deneta Residence 5','sikumbang-adl0820192025t003','Deneta Residence 5 oleh PT ANUGERAH JAYA BUNDA (REI).
Alamat: Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Mandiri, PR. Deneta Residence Blok D No 1; Telp: 085397601437; Email: ptanugerahjayabunda@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820192025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Laikaha','Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.040048111111111,122.4494933888889,'https://www.google.com/maps?q=-4.040048111111111,122.4494933888889',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/11/25/file-lokasi-12213450-e167-45eb-ab94-fb44c5c95c7b.jpg","https://sikumbang.tapera.go.id/public/upload/2025/11/25/file-lokasi-4065049a-ce79-465e-b409-dc2052056c40.jpg","https://sikumbang.tapera.go.id/public/upload/2025/11/25/file-lokasi-a2e5e432-448a-4e65-b428-17115b4d6a86.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a87f4f4f-313b-4e8b-9f9b-81d01d0dd3ff',NULL,'rumah_subsidi','rumah_tapak','FAHMI RESIDENCE 5','sikumbang-adl0820172025t001','FAHMI RESIDENCE 5 oleh PT PERMATA TIRTA JAYA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36/91 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN KAPTEN PIERE TENDEAN KEL. BARUGA KEC. BARUGA KOTA KENDARI; Telp: 081342813438; Email: cecepanshory@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0532305555555554,122.47379444444445,'https://www.google.com/maps?q=-4.0532305555555554,122.47379444444445',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/11/26/file-lokasi-2633fc22-8286-4d77-8212-57448093f48d.JPG","https://sikumbang.tapera.go.id/public/upload/2025/11/26/file-lokasi-059438fe-34bb-436d-a5d4-200e88baf449.JPG","https://sikumbang.tapera.go.id/public/upload/2025/11/26/file-lokasi-84f176d4-6812-4647-9d59-4eeade39fec9.JPG"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE)
) AS v(id,seller_id,category,property_type,title,slug,description,province,city,regency_name,district,subdistrict_name,address_detail,postal_code,latitude,longitude,maps_link,price,price_type,is_negotiable,bedrooms,bathrooms,building_area_sqm,land_area_sqm,floors,images,amenities,subsidy_program,can_kpr,certificate_type,condition,status,is_admin_verified,is_featured,views_count,favorites_count,inquiries_count,published_at,ai_generated)
WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.slug = v.slug);


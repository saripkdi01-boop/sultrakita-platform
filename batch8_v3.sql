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
('63ecbd4c-7c7c-464c-8eb9-8d22475c93a8',NULL,'rumah_subsidi','rumah_tapak','CITRA ASRI WAWOMBALATA','sikumbang-kdi0110082020t004','CITRA ASRI WAWOMBALATA oleh KARYA AMANAH MANDIRI (HIMPERRA).
Alamat: Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Imam Bonjol ; Telp: 082187466125; Email: ibnu.4rch@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0110082020T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Mandonga','Wawombalata','Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara',NULL,-3.942777777777778,122.51166666666667,'https://www.google.com/maps?q=-3.942777777777778,122.51166666666667',156000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1582603573819-10011.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1582603556553-10011.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1582603579620-10011.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('266f0284-26f0-4dc9-a9ca-227022768c54',NULL,'rumah_subsidi','rumah_tapak','Griya f''araz anggoeya','sikumbang-kdi0410052020t007','Griya f''araz anggoeya oleh PT ARAZ TRISULA MANDIRI (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36/104 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN PNS Kota Kendari Blok 33; Telp: 085241813163; Email: fredif112@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052020T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-3.9969930555555555,122.56209563888889,'https://www.google.com/maps?q=-3.9969930555555555,122.56209563888889',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1582947849806-10284.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1582947847360-10284.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1582947851877-10284.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('aed5d1f8-a425-4e84-a895-ceaa9e54b429',NULL,'rumah_subsidi','rumah_tapak','GRIYA MATABONDU','sikumbang-trw0120052020t002','GRIYA MATABONDU oleh PT GRIYA SULTRA KONSTRUKSI (REI).
Alamat: Woiha, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 116 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: desa matabondu kec. tirawuta; Telp: 085145808020; Email: dyahkurniawatysetyoriny@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120052020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Woiha','Woiha, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.025555555555555,121.92222222222223,'https://www.google.com/maps?q=-4.025555555555555,121.92222222222223',156000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579761410792.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579761389419.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579761412132.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('82b6315f-cc4e-4b4e-9608-b94339d0c8c3',NULL,'rumah_subsidi','rumah_tapak','gardenia residence','sikumbang-kka0410032020t003','gardenia residence oleh PT GELORA FIRNAGRAHA REALTYTANIA (REI).
Alamat: Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36/100 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jalan cakalang; Telp: 085399111130; Email: citralatambaga@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410032020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Balandete','Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.073847944444444,121.63068497222221,'https://www.google.com/maps?q=-4.073847944444444,121.63068497222221',156500000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581404455324.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1595526553824-8714.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581404464115.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9aeddff1-181a-4f08-a835-0f488781b440',NULL,'rumah_subsidi','rumah_tapak','Bukit Cendana Permai','sikumbang-kdi0310082020t004','Bukit Cendana Permai oleh GERBANG PROPERTY NUSANTARA (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Kantor Pemasaran Perumahan BUKIT CENDANA PERMAI
Jl. Bukit Kendari Indah; Telp: 082271409813; Email: gerbang.property.sultra@gmail.com; Web: https://www.facebook.com/gerbang.property.39/

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082020T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.022946472222222,122.49890588888888,'https://www.google.com/maps?q=-4.022946472222222,122.49890588888888',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1594702132645-12542.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1594702129913-12542.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1594702133404-12542.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('48fe983e-518f-46cb-8881-adcbd09bc9bc',NULL,'rumah_subsidi','rumah_tapak','BALQIS PERMAI BOMBANA','sikumbang-rmb0420012020t001','BALQIS PERMAI BOMBANA oleh PT BALQIS INDAH PERSADA (REI).
Alamat: Lantawonua, Kec. Rumbia, Kab Bombana, Sulawesi Tenggara.
Total unit: 0 subsidi / 3 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36 (2025) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. Tugu Munajah Desa Lantowua Kec. Rumbia Kab. Bombana; Telp: 085145014830; Email: balqisindahpersadabombana@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/RMB0420012020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Bombana','Kab Bombana','Rumbia','Lantawonua','Lantawonua, Kec. Rumbia, Kab Bombana, Sulawesi Tenggara',NULL,-4.768055555555556,122.03333333333333,'https://www.google.com/maps?q=-4.768055555555556,122.03333333333333',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1593746879858-12376.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1593746829739-12376.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1593746895897-12376.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ab4a1418-c273-4070-8d42-d8ea793097f9',NULL,'rumah_subsidi','rumah_tapak','TRI SATYA RESIDENCE','sikumbang-kdi0310012020t005','TRI SATYA RESIDENCE oleh PT AMAR MULYA MANDIRI (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL KS TUBUN BARUGA; Telp: 082243255242; Email: amar.mulya.mandiri.01@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.045178055555556,122.5028316111111,'https://www.google.com/maps?q=-4.045178055555556,122.5028316111111',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581575302805.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581575302654.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1689663356540-9074.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b64455af-7f92-4813-a52d-be02e833652a',NULL,'rumah_subsidi','rumah_tapak','DEWI BUNGA LAND','sikumbang-kdi1010022020t002','DEWI BUNGA LAND oleh PT MAHA KARYA HALUOLEO (REI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan balaikota 2 nomor 2 rt 025 rw 007; Telp: +62 852 55004343; Email: haluoleomahakarya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.045,122.55361111111111,'https://www.google.com/maps?q=-4.045,122.55361111111111',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/foto_contoh-1594814198834-11125.jpg","https://sikumbang.tapera.go.id/public/generated/images/foto_gerbang-1594814269208-11125.jpg","https://sikumbang.tapera.go.id/public/generated/images/foto_tengah-1594814243799-11125.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('dc52f5eb-af77-4169-8455-d5e6b8c659a9',NULL,'rumah_subsidi','rumah_tapak','Griya Elegan Tojabi','sikumbang-lss0120072020t002','Griya Elegan Tojabi oleh CV GRIYA BINTANG ELEGANT (HIMPERRA).
Alamat: Tojabi, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 14 subsidi / 0 komersil.

Tipe rumah:
- Rumah Tapak (Subsidi): Rp 156.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan TPU Tojabi; Telp: 0811401970; Email: cv.griyaelagantojabi16@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120072020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Tojabi','Tojabi, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.507516888888889,120.89588947222222,'https://www.google.com/maps?q=-3.507516888888889,120.89588947222222',156000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/foto_contoh-1594723608858-11075.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1585279500451-11075.jpg","https://sikumbang.tapera.go.id/public/generated/images/foto_tengah-1594723598442-11075.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('baef4e90-4b62-4eae-aebe-877da6dad6ef',NULL,'rumah_subsidi','rumah_tapak','Griya Elegan Mangolo','sikumbang-kka1410012020t001','Griya Elegan Mangolo oleh CV GRIYA BINTANG ELEGANT (HIMPERRA).
Alamat: Mangolo, Kec. Latambaga, Kab Kolaka, Sulawesi Tenggara.
Total unit: 24 subsidi / 0 komersil.

Tipe rumah:
- Rumah Tapak (Subsidi): Rp 156.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan TPI; Telp: 0811401970; Email: hijau.daunsagi79@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1410012020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Latambaga','Mangolo','Mangolo, Kec. Latambaga, Kab Kolaka, Sulawesi Tenggara',NULL,-4.029166083333333,121.54634533333333,'https://www.google.com/maps?q=-4.029166083333333,121.54634533333333',156000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579327014158.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579326977396.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579327033862.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('966c060f-e219-4f59-9aa1-af07b0b6fc43',NULL,'rumah_subsidi','rumah_tapak','GRIYA ARINI PERMAI','sikumbang-kdi0910022020t002','GRIYA ARINI PERMAI oleh PT ALINDRA ADI KARYA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 35 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LALOMBAKU, LORONG SMP 19 KENDARI; Telp: 08111918235; Email: joindray@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.985194,122.482602,'https://www.google.com/maps?q=-3.985194,122.482602',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579325332667.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579325331718.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579325333697.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7234bd53-c997-4457-bc4e-ba8e1fb6aab1',NULL,'rumah_subsidi','rumah_tapak','NEISYA KONDA','sikumbang-adl0720022020t001','NEISYA KONDA oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Puosu Jaya, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
-    36 (Subsidi): Rp 146.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SYECH YUSUF; Telp: 081245833044 / 082293198772; Email: Ilyasathirah4@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720022020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Puosu Jaya','Puosu Jaya, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.059444444444444,122.47055555555556,'https://www.google.com/maps?q=-4.059444444444444,122.47055555555556',146000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580796522647.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580796519192.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580796526083.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('92bb4799-feb6-47b2-8c3a-a5ec6eaac6a8',NULL,'rumah_subsidi','rumah_tapak','DEWI BUNGA POASIA 2','sikumbang-kdi0410042020t004','DEWI BUNGA POASIA 2 oleh PT MAHA KARYA HALUOLEO (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.BALAIKOTA II; Telp: 085255004343 / 081343333371; Email: ARHYSANDY93@GMAIL.COM

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042020T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.031111111111111,122.55666666666666,'https://www.google.com/maps?q=-4.031111111111111,122.55666666666666',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580808040411.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580808037726.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580808042081.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8d7ba6b5-4aec-490d-b68d-e84068e4eb8d',NULL,'rumah_subsidi','rumah_tapak','DELHAN RESIDENCE','sikumbang-kdi0410042020t003','DELHAN RESIDENCE oleh DELHAN NUSANTARA (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- 36 m3 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: PERUMAHAN DELHAN RESINDICE; Telp: 082259673216; Email: arlinendang@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0225664722222225,122.55869047222222,'https://www.google.com/maps?q=-4.0225664722222225,122.55869047222222',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1593577992213-12169.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1593577987325-12169.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1593577996604-12169.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('72108eff-721a-473c-8ff1-7070b428fd14',NULL,'rumah_subsidi','rumah_tapak','ADE GRAHA BUMI ASRI','sikumbang-kdi0410042020t006','ADE GRAHA BUMI ASRI oleh PT ADE GRAHA ASRI (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN SAFIRA INDAH; Telp: 082264272677; Email: aaljufri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042020T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0132398333333335,122.55628966666666,'https://www.google.com/maps?q=-4.0132398333333335,122.55628966666666',156500000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1594695615591-12469.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1594695568815-12469.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1594695624655-12469.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0304543a-65b6-4b31-9250-d6e9265aae8c',NULL,'rumah_subsidi','rumah_tapak','ERLANGGA MEGA RESIDENCE - PANTAI NIRWANA','sikumbang-bau0110132020t005','ERLANGGA MEGA RESIDENCE - PANTAI NIRWANA oleh PT ERLANGGA MEGA PROPERTI (APERNAS).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 94 m2, 2 KT / 1 KM, 1 lantai.
- 30 (Subsidi): Rp 173.000.000, LB 30 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Lakarambau; Telp: 0822 9037 7243 - 0822 7138 4874; Email: erlanggamegaproperti@gmail.com; Web: www.facebook.com/erlanggamegaresidence

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.5199769722222225,122.57319697222222,'https://www.google.com/maps?q=-5.5199769722222225,122.57319697222222',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1592731165436-12127.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1592731154259-12127.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1592731174615-12127.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('efe013e4-e027-4e46-9c72-d221c3310659',NULL,'rumah_subsidi','rumah_tapak','Olive residence wakorambu','sikumbang-rah1510042020t001','Olive residence wakorambu oleh PT LIMA PILAR SUKSES RAHA (REI).
Alamat: Laiworu, Kec. Batalaiworu, Kab Muna, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Jati; Telp: 04032521186; Email: alfiqihtaufiq@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/RAH1510042020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Muna','Kab Muna','Batalaiworu','Laiworu','Laiworu, Kec. Batalaiworu, Kab Muna, Sulawesi Tenggara',NULL,-4.811804749999999,122.71326444444445,'https://www.google.com/maps?q=-4.811804749999999,122.71326444444445',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1592970248632-4376.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1592970242358-4376.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1592970257156-4376.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2a61dfac-d861-47f9-96b0-2e3aaf542ba0',NULL,'rumah_subsidi','rumah_tapak','Griya Hilwa Zaitun 02','sikumbang-kdi0610032020t002','Griya Hilwa Zaitun 02 oleh PT KAEMBA JAYA UTAMA (REI).
Alamat: Abeli, Kec. Abeli, Kota Kendari, Sulawesi Tenggara.
Total unit: 33 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- RUMAH TAPAK (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jalan Pemuda Perumahan BTN Griya Hilwa Zaitun Blok P; Telp: 081355855553; Email: kaembajayautama001@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0610032020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Abeli','Abeli','Abeli, Kec. Abeli, Kota Kendari, Sulawesi Tenggara',NULL,-3.986380111111111,122.57775113888889,'https://www.google.com/maps?q=-3.986380111111111,122.57775113888889',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581392255525.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581392254898.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581392256329.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ba4faf8a-d9cc-4cd3-b0ad-ee6a5fa1bbc8',NULL,'rumah_subsidi','rumah_tapak','DJAVINO RESIDENCE II','sikumbang-adl0820022020t001','DJAVINO RESIDENCE II oleh PT DJAVINO GRUP INDONESIA (REI).
Alamat: Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 12 subsidi / 1 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 45 (Komersil): Rp 375.000.000, LB 45 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan poros Bandara Haluoleo Kompleks Perumahan DJAVINO RESIDENCE I; Telp: 082368884546; Email: djavinoresidence@gmail.com; Web: https://residence.djavinogroup.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820022020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Onewila','Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.061340399722222,122.4257486,'https://www.google.com/maps?q=-4.061340399722222,122.4257486',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1593799589610-11615.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1588580193939-11615.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1588580203344-11615.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('dd9c1b3a-7dc4-4b00-bfef-98e57220b932',NULL,'rumah_subsidi','rumah_tapak','SHIFA PERDANA DELAPAN PUNGGOLAKA','sikumbang-kdi0910032020t001','SHIFA PERDANA DELAPAN PUNGGOLAKA oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Komersil): Rp 146.000.000, LB 36 m2 / LT 93 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Komersil): Rp 136.000.000, LB 36 m2 / LT 93 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 146.000.000, LB 36 m2 / LT 93 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 93 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF; Telp: 081245833044 / 082293198772; Email: Ilyasathirah4@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.957777777777778,122.49805555555555,'https://www.google.com/maps?q=-3.957777777777778,122.49805555555555',136000000.0,'total',FALSE,2,1,36,93,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580822990912.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580822990863.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580822990920.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c7289174-893a-4cf8-9a26-262fa3c7a0e8',NULL,'rumah_subsidi','rumah_tapak','BUMI ROYAL IZTHIN SHIFA','sikumbang-kdi0910062020t003','BUMI ROYAL IZTHIN SHIFA oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 146.000.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Komersil): Rp 146.000.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF 
; Telp: 081245833044 / 082293198772; Email: Ilyasathirah4@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9483333333333337,122.49583333333334,'https://www.google.com/maps?q=-3.9483333333333337,122.49583333333334',146000000.0,'total',FALSE,2,1,36,92,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580825505407.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580825500946.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580825506933.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d12521ca-8239-47c0-adb8-53ee80983105',NULL,'rumah_subsidi','rumah_tapak','ANGGABERI PERMAI','sikumbang-unh2410022020t001','ANGGABERI PERMAI oleh SURAS BARANI (APERSI).
Alamat: Anggaberi, Kec. Anggaberi, Kab Konawe, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Podada Blok A; Telp: 082188061043; Email: bnkmajujaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH2410022020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Anggaberi','Anggaberi','Anggaberi, Kec. Anggaberi, Kab Konawe, Sulawesi Tenggara',NULL,-3.8441309444444447,122.06758880555554,'https://www.google.com/maps?q=-3.8441309444444447,122.06758880555554',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1584696948797-10950.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1584696935124-10950.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1584696963497-10950.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('dd2c37c2-abfa-4821-8704-4b42856e233f',NULL,'rumah_subsidi','rumah_tapak','Bukit Memory 2','sikumbang-bau0110142020t001','Bukit Memory 2 oleh CV BUKIT MEMORY (APERNAS).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Raya Palagimata, Samping KUA Betoambari; Telp: 082266076216; Email: residencebm284@gmail.com; Web: bukitmemory.wordpress.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.501464972222222,122.57974697222222,'https://www.google.com/maps?q=-5.501464972222222,122.57974697222222',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-9877-1582332255832.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-9877-1582332224140.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-9877-1582332269612.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4c26d242-0b12-4022-ba2c-69b1e88741b8',NULL,'rumah_subsidi','rumah_tapak','GRIYA MUSTIKA MATABUBU','sikumbang-kdi0410062020t002','GRIYA MUSTIKA MATABUBU oleh PT ALKOBAR ALAM NUSANTARA (REI).
Alamat: Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36/96 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ade Irma Nasution Lrg. BTN Zam-Zam (Hombis); Telp: 085299075015; Email: alkobaralamnusantara@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410062020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Matabubu','Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.004444444444444,122.57083333333333,'https://www.google.com/maps?q=-4.004444444444444,122.57083333333333',156000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1591076538300-11813.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1591076537299-11813.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1591076540212-11813.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('88b81110-9dd0-4010-8bf2-df610ad3ea36',NULL,'rumah_subsidi','rumah_tapak','Griya Asri Kendari','sikumbang-kdi0310082020t003','Griya Asri Kendari oleh PT BARINGENG (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- GAK 2025 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. D.I. Panjaitan Lr Kehutanan Perumahan Bukit Baringeng Permai Blok B; Telp: 085255577725; Email: pt.baringeng@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.018820972222223,122.500179,'https://www.google.com/maps?q=-4.018820972222223,122.500179',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1591607103168-11890.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1591607094080-11890.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1591607108470-11890.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2d899e69-16d2-4308-9683-e9c9bc58a916',NULL,'rumah_subsidi','rumah_tapak','GREEN MUNANDO','sikumbang-kdi0410052020t006','GREEN MUNANDO oleh PT MUNANDO BARAKATI MANDIRI (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 74 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kijang; Telp: 081241167748; Email: basbangunproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052020T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-3.9980555555555557,122.56444444444445,'https://www.google.com/maps?q=-3.9980555555555557,122.56444444444445',156500000.0,'total',FALSE,2,1,36,74,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1593460457969-12296.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1593460398930-12296.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1593460432937-12296.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('33324471-890b-4e27-8277-ab77f05996ad',NULL,'rumah_subsidi','rumah_tapak','AMALIA RESIDENCE','sikumbang-bau0110132020t004','AMALIA RESIDENCE oleh CV AMALIA (REI).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 5 subsidi / 1 komersil.

Tipe rumah:
- 36 M2 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN HAJI PADA ; Telp: 082393079786; Email: amaliaproperty12@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132020T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.504021972222223,122.57694297222221,'https://www.google.com/maps?q=-5.504021972222223,122.57694297222221',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1592892540676-12159.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1592892531625-12159.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1592892546322-12159.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b688bce8-3907-492f-92c3-a62d195c0a80',NULL,'rumah_subsidi','rumah_tapak','GRAHA REKSA KENCANA TAHAP V','sikumbang-kdi0410032020t002','GRAHA REKSA KENCANA TAHAP V oleh PT DHANA JAYA PROPERTI (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Komersil): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. HALU OLEO, PERUM. GRAHA REKSA KENCANA BLOK B RT. 037 RW. 001; Telp: 085241511454; Email: pt.djp2013.kendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.037802888888889,122.5555038888889,'https://www.google.com/maps?q=-4.037802888888889,122.5555038888889',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579759439680.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579759400004.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1593494337973-834.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('516aed63-cc6f-45c8-8336-43c922fbff3f',NULL,'rumah_subsidi','rumah_tapak','Perumnas Haluoleo','sikumbang-adl0820142020t001','Perumnas Haluoleo oleh PEMBANGUNAN PERUMAHAN NASIONAL (PERUMNAS).
Alamat: Ambaipua, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1664 subsidi / 80 komersil.

Tipe rumah:
- RK 50/60 (Komersil): Rp 340.000.000, LB 50 m2 / LT 60 m2, - KT / 1 KM, 1 lantai.
- 36 SUBISIDI 2023 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- RS 45/120 (Komersil): Rp 263.000.000, LB 45 m2 / LT 120 m2, 2 KT / 1 KM, 1 lantai.
- RST 28/84 (Subsidi): Rp 146.000.000, LB 28 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- RST 36/84 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- RST 36/84 TBA (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- RS 45/120 TBA (Komersil): Rp 350.000.000, LB 45 m2 / LT 120 m2, 2 KT / 1 KM, 1 lantai.
- 36 SUBSIDI NEW (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36 Subsidi 2026 (model lama) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Poros Bandara Haluoleo, Ambaipua, Ranomeeto; Telp: 082396528000; Email: cab.sultra@perumnas.co.id; Web: www.perumnas.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820142020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ambaipua','Ambaipua, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.063666666666666,122.41390277777778,'https://www.google.com/maps?q=-4.063666666666666,122.41390277777778',146000000.0,'total',FALSE,2,1,28,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/09/17/fotoContoh-4723b116-9bc7-48fb-ad51-32a32d5b1810.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/09/17/fotoGerbang--a80e15fa-37de-4df6-b7eb-51abab727fa4.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/09/17/fotoTengah-cbde2692-1be9-41e6-a55e-737e25033059.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('73f86db6-0ce9-44b9-9001-fcae3413ba92',NULL,'rumah_subsidi','rumah_tapak','Perumnas Bumi Saraea Buton Utara','sikumbang-bng0110082020t001','Perumnas Bumi Saraea Buton Utara oleh PEMBANGUNAN PERUMAHAN NASIONAL (PERUMNAS).
Alamat: Bangkudu, Kec. Kulisusu, Kab Buton Utara, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- RST 36/180 (Subsidi): Rp 85.000.000, LB 36 m2 / LT 180 m2, 2 KT / 1 KM, 1 lantai.
- RST 36-200 (Subsidi): Rp 88.000.000, LB 36 m2 / LT 200 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Bangkudu, Kulisusu, Kabupaten Buton Utara, Sulawesi Tenggara 93672; Telp: 081241159292; Email: cab.sultra@perumnas.co.id; Web: www.perumnas.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BNG0110082020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton Utara','Kab Buton Utara','Kulisusu','Bangkudu','Bangkudu, Kec. Kulisusu, Kab Buton Utara, Sulawesi Tenggara',NULL,-4.7598416666666665,123.19699166666668,'https://www.google.com/maps?q=-4.7598416666666665,123.19699166666668',85000000.0,'total',FALSE,2,1,36,180,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579489575438.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579489575413.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579489575456.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2e0d3314-5ba4-4e23-8ac0-06993e8db325',NULL,'rumah_subsidi','rumah_tapak','UNIFIT LAND KOLTIM','sikumbang-trw0120012020t001','UNIFIT LAND KOLTIM oleh PT KREASI BANGUN SEJAHTERA (REI).
Alamat: Simbune, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 27 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Bunggasi ; Telp: 08114030787; Email: unifitland8@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120012020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Simbune','Simbune, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.022500027777777,121.88026427777777,'https://www.google.com/maps?q=-4.022500027777777,121.88026427777777',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1593479904148-10448.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1583815779829-10448.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1583815787310-10448.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('eee1a575-647e-47e6-bc47-99f9aa2cb19a',NULL,'rumah_subsidi','rumah_tapak','Perumnas Wapunto Raha','sikumbang-rah1710052020t001','Perumnas Wapunto Raha oleh PEMBANGUNAN PERUMAHAN NASIONAL (PERUMNAS).
Alamat: Wapunto, Kec. Duruka, Kab Muna, Sulawesi Tenggara.
Total unit: 216 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 129.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 29,5/84 (Subsidi): Rp 123.200.000, LB 29.5 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. WR. Supratman, Wapunto, Duruka, Kabupaten Muna, Sulawesi Tenggara 93611; Telp: 082396528000; Email: cab.sultra@perumnas.co.id; Web: www.perumnas.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/RAH1710052020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Muna','Kab Muna','Duruka','Wapunto','Wapunto, Kec. Duruka, Kab Muna, Sulawesi Tenggara',NULL,-4.863180555555555,122.72095833333333,'https://www.google.com/maps?q=-4.863180555555555,122.72095833333333',123200000.0,'total',FALSE,2,1,29.5,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579488815690.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579488815672.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579488815712.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('932261ff-45a2-4483-8e43-27310da46d4c',NULL,'rumah_subsidi','rumah_tapak','BUMI NAMBO PERMAI','sikumbang-kdi0610112020t001','BUMI NAMBO PERMAI oleh PT DHANA JAYA PROPERTI (REI).
Alamat: Nambo, Kec. Nambo, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. HALU OLEO PERM. GRAHA REKSA KENCANA BLOK B, RT 037/RW 001; Telp: 085241511454; Email: pt.djp2013.kendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0610112020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Nambo','Nambo','Nambo, Kec. Nambo, Kota Kendari, Sulawesi Tenggara',NULL,-3.993113888888889,122.60778055555555,'https://www.google.com/maps?q=-3.993113888888889,122.60778055555555',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579751664459.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579751662520.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579751666256.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('571e8d8d-a395-497e-aa48-dcb2c6644f34',NULL,'rumah_subsidi','rumah_tapak','WANABAKTI INDAH','sikumbang-bau0110132020t003','WANABAKTI INDAH oleh PT BUANA SULTRA MANDIRI (REI).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 82 m2, 2 KT / 1 KM, 1 lantai.
- Subsidi Terbaru (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN DAYANU IKHSANUDDIN, KOMPLEKS PERUMAHAN WANABAKTI INDAH; Telp: 081242188620; Email: amdk.bsm@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.503571388888889,122.56573158333333,'https://www.google.com/maps?q=-5.503571388888889,122.56573158333333',156500000.0,'total',FALSE,2,1,36,82,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579485493109.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579485487380.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579485498045.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5cce57fe-abb9-425f-9f56-14c62288e79b',NULL,'rumah_subsidi','rumah_tapak','NEISYA PUUWATU','sikumbang-kdi0910062020t002','NEISYA PUUWATU oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 146.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF ; Telp: 081245833044 / 082293198772; Email: Ilyasathirah4@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.95,122.49833333333333,'https://www.google.com/maps?q=-3.95,122.49833333333333',146000000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1578650836714.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1578650825825.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1578650847959.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('52664b0f-5060-4578-bc6e-5675c0288fc8',NULL,'rumah_subsidi','rumah_tapak','GRAHA REKSA KENCANA TAHAP IV','sikumbang-kdi0410032020t001','GRAHA REKSA KENCANA TAHAP IV oleh PT DHANA JAYA PROPERTI (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 18 subsidi / 2 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 45 (Komersil): Rp 200.000.000, LB 45 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. HALU OLEO PERM GRAHA REKSA KENCANA BLOK B, RT 037/RW 001; Telp: 085241511454; Email: pt.djp2013.kendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.038349888888889,122.55411519444444,'https://www.google.com/maps?q=-4.038349888888889,122.55411519444444',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579141285562.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579141247786.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579141341049.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('95630e70-a091-47bc-8ab1-83cfe87ab2e6',NULL,'rumah_subsidi','rumah_tapak','BUKIT BARINGENG PERMAI 2','sikumbang-kdi0310082020t001','BUKIT BARINGENG PERMAI 2 oleh PT BARINGENG (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. D.I. PANJAITAN PERUMAHAN BUKIT BARINGENG PERMAI BLOK B; Telp: 085255577725; Email: pt.baringeng@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.018909972222223,122.49631597222222,'https://www.google.com/maps?q=-4.018909972222223,122.49631597222222',156500000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579487841297.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579487838098.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579487843546.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ac75d127-217c-4338-970e-b932fb25d7cb',NULL,'rumah_subsidi','rumah_tapak','Griya Permata Lampareng','sikumbang-kdi0410032020t004','Griya Permata Lampareng oleh PT SINAR PRIBUMI GRUP (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN KENDARI PERMAI BLOK B2; Telp: 085254432351; Email: sinarpribumi@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032020T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0325,122.55638888888889,'https://www.google.com/maps?q=-4.0325,122.55638888888889',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579490688860.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579490686148.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579490695028.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('35c97e9b-9d00-4db3-b732-107478609243',NULL,'rumah_subsidi','rumah_tapak','GRIYA PERMATA HIJAU 2','sikumbang-kdi0410032020t006','GRIYA PERMATA HIJAU 2 oleh PT SINAR PRIBUMI GRUP (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 25 subsidi / 1 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.
- 45 (Komersil): Rp 280.000.000, LB 45 m2 / LT 120 m2, 2 KT / 1 KM, 1 lantai.
- 60 (Komersil): Rp 400.000.000, LB 60 m2 / LT 135 m2, 3 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN KENDARI PERMAI BLOK B2; Telp: 085254432351; Email: sinarpribumi@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032020T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.019722222222222,122.54388888888889,'https://www.google.com/maps?q=-4.019722222222222,122.54388888888889',156500000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1583287805919-10407.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1583287804055-10407.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1583287807309-10407.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1ef5bead-82a3-48ac-b528-5cdfb5f76c70',NULL,'rumah_subsidi','rumah_tapak','Butonesia Kahila Village','sikumbang-psw1110202020t003','Butonesia Kahila Village oleh PT PUTRA BUTON INDONESIA (PI).
Alamat: Holimombo, Kec. Pasarwajo, Kab Buton, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Lingk. Lasingga, Kel. Holimombo, Kec. Pasarwajo, Kab. Buton, Prov. Sultra; Telp: 0811404191; Email: totowagola@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/PSW1110202020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton','Kab Buton','Pasarwajo','Holimombo','Holimombo, Kec. Pasarwajo, Kab Buton, Sulawesi Tenggara',NULL,-5.526587,122.85586547222222,'https://www.google.com/maps?q=-5.526587,122.85586547222222',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580168064461.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580168053539.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580168070462.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('cf23325a-67af-4e0e-9776-26090031aa8b',NULL,'rumah_subsidi','rumah_tapak','Villa Indah Pondui','sikumbang-kka0410062020t001','Villa Indah Pondui oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Laloeha, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 146.000.000, LB 36 m2 / LT 72 m2, 2 KT / 1 KM, 1 lantai.

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410062020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Laloeha','Laloeha, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.054593972222222,121.61082897222222,'https://www.google.com/maps?q=-4.054593972222222,121.61082897222222',146000000.0,'total',FALSE,2,1,36,72,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1578910380310.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1578910375446.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1578910384973.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('54553322-b876-4a97-9893-5b5a4d536a96',NULL,'rumah_subsidi','rumah_tapak','Villa Indah Balandete (VIB)','sikumbang-kka0410032020t001','Villa Indah Balandete (VIB) oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Badewi, Kel. Balandete; Telp: 085241654268; Email: pt.villa.mutiara.ramadhan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410032020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Balandete','Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.069243999999999,121.63151699999999,'https://www.google.com/maps?q=-4.069243999999999,121.63151699999999',156500000.0,'total',FALSE,2,1,36,90,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1578898550713.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1578898515612.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1578898567158.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('76cc4053-25d4-46e8-83fe-01f97ad67135',NULL,'rumah_subsidi','rumah_tapak','Mangatta Permai II','sikumbang-kka0720072020t002','Mangatta Permai II oleh PT LAPPARIAJA MANGATTA (REI).
Alamat: Pesouha, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.
- 36 M3 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Almuhajirin, Pesouha, Pomalaa, Kolaka; Telp: 08121999049; Email: hendra_baia@yahoo.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720072020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Pesouha','Pesouha, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.170670027777778,121.63549041666667,'https://www.google.com/maps?q=-4.170670027777778,121.63549041666667',173000000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579490208389.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579490204113.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579490212495.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ab48dfa9-a9c6-4aa4-8f7c-b8f918bf9418',NULL,'rumah_subsidi','rumah_tapak','NEISYA AMBEKAIRI 2','sikumbang-unh0210052020t001','NEISYA AMBEKAIRI 2 oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Ambekairi, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 146.000.000, LB 36 m2 / LT 95 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 95 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SYECH YUSUF; Telp: 081245833044 / 082293198772; Email: Ilyasathirah4@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210052020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Ambekairi','Ambekairi, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,3.8629342222222225,122.05906961111111,'https://www.google.com/maps?q=3.8629342222222225,122.05906961111111',146000000.0,'total',FALSE,2,1,36,95,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1578723689364.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1578723680879.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1578723697174.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1a817bad-4dfe-472f-b200-4aa668a2bcbf',NULL,'rumah_subsidi','rumah_tapak','BUMI PERUMNAS WARURUMA BAU-BAU','sikumbang-bau0510042020t001','BUMI PERUMNAS WARURUMA BAU-BAU oleh PEMBANGUNAN PERUMAHAN NASIONAL (PERUMNAS).
Alamat: Waruruma, Kec. Kokalukuna, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 0 subsidi / 4 komersil.

Tipe rumah:
- RS 36/140 (Komersil): Rp 121.000.000, LB 36 m2 / LT 140 m2, 2 KT / 1 KM, 1 lantai.
- RS 36/150 (Komersil): Rp 122.000.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.
- RST 36/84 (Subsidi): Rp 85.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- RS 36/105 (Subsidi): Rp 88.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Sultan Hasanuddin Poros Bandara Haluoleo; Telp: 082396528000; Email: sultra.perumnas@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0510042020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Kokalukuna','Waruruma','Waruruma, Kec. Kokalukuna, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.4322,122.66730000000001,'https://www.google.com/maps?q=-5.4322,122.66730000000001',85000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1587084727747-11435.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1587084727710-11435.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1587084727784-11435.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8b6db5a3-3030-42ed-9678-30c8a4a3b520',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN KONDA RESIDENCE','sikumbang-adl0720242020t001','PERUMAHAN KONDA RESIDENCE oleh PT KREASI BANGUN SEJAHTERA (REI).
Alamat: Konda Satu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Bunggasi; Telp: 08114030787; Email: unifitland8@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720242020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Konda Satu','Konda Satu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.072724805555556,122.46456908333333,'https://www.google.com/maps?q=-4.072724805555556,122.46456908333333',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579077084355.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579077082372.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579077085888.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('15719c68-3cf7-49c0-a8ba-36bef4d9ec3c',NULL,'rumah_subsidi','rumah_tapak','PURI KENCANA','sikumbang-adl0820172020t001','PURI KENCANA oleh PT SERRIL DOBEL KONSTRUKSI (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36/97 (Subsidi): Rp 146.000.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 136.000.000, LB 36 m2 / LT 117 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Mawar Blok C Nomor ; Telp: 082395661099; Email: pt.serrildobelkonstruksi@yahoo.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.044263833333333,122.46794888888888,'https://www.google.com/maps?q=-4.044263833333333,122.46794888888888',136000000.0,'total',FALSE,2,1,36,117,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579255461019.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579255449945.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579255461673.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('61f8e58f-52db-4e84-8e25-936b93b440f0',NULL,'rumah_subsidi','rumah_tapak','Bukit Memory','sikumbang-bau0110122020t001','Bukit Memory oleh CV BUKIT MEMORY (APERNAS).
Alamat: Waborobo, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 136.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. RAYA PALAGIMATA, SAMPING KANTOR URUSAN AGAMA (KUA) BETOAMBARI; Telp: 082266076216; Email: residencebm284@gmail.com; Web: bukitmemory.wordpress.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110122020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Waborobo','Waborobo, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.501846972222222,122.57883497222223,'https://www.google.com/maps?q=-5.501846972222222,122.57883497222223',136000000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-9491-1582067829010.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-9491-1582067704281.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-9491-1582067900044.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ff02770c-aab3-4ab7-b868-beef7fc16238',NULL,'rumah_subsidi','rumah_tapak','BENUA GREEN CITY','sikumbang-kdi0410052020t001','BENUA GREEN CITY oleh PT BANUA INDAH PRATAMA (APERNAS).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Bunga Kolosua; Telp: 085241767715; Email: madesujarto@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.025115944444444,122.55442044444445,'https://www.google.com/maps?q=-4.025115944444444,122.55442044444445',156000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1582034057809.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1582034022089.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1582034073111.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4f613df9-03bb-4f54-8bb4-c214fe103848',NULL,'rumah_subsidi','rumah_tapak','BSB Regency','sikumbang-kdi1010022020t001','BSB Regency oleh BAS BANGUN PROPERTI (REI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 72 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kijang; Telp: 081241167748; Email: basbangunproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.019722222222222,122.52972222222222,'https://www.google.com/maps?q=-4.019722222222222,122.52972222222222',156500000.0,'total',FALSE,2,1,36,72,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-9585-1582049097659.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-9585-1582049074667.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-9585-1582049113495.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f7c35499-da1e-4c10-ad4a-bf6f5987a420',NULL,'rumah_subsidi','rumah_tapak','Baruga Griya Asri','sikumbang-kdi0310012020t002','Baruga Griya Asri oleh PT KANAKINDO MITRA SEMESTA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- Ruruhi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- Lobe-Lobe (Subsidi): Rp 156.500.000, LB 36 m2 / LT 99 m2, 2 KT / 1 KM, 1 lantai.
- Ruruhi (Subsidi): Rp 173.000.000, LB 35 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan Baruga Griya Asri Jl. Brigjen Katamso Blok B; Telp: 082158111339; Email: kanakindomitras@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.049410333333333,122.48821258333334,'https://www.google.com/maps?q=-4.049410333333333,122.48821258333334',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580359992511.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580359981734.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580360004204.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('124e99c5-a773-4559-b136-80eb98b382b9',NULL,'rumah_subsidi','rumah_tapak','NEISYA POASIA','sikumbang-kdi0410052020t003','NEISYA POASIA oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 146.000.000, LB 36 m2 / LT 93 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SYECH YUSUF; Telp: 081245833044 / 082293198772; Email: Ilyasathirah4@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0225,122.56027777777777,'https://www.google.com/maps?q=-4.0225,122.56027777777777',146000000.0,'total',FALSE,2,1,36,93,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580794893136.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580794885061.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580794893161.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('512576b6-3d11-48b2-9158-226edae9c320',NULL,'rumah_subsidi','rumah_tapak','Villa wua wua','sikumbang-kdi0710012020t002','Villa wua wua oleh PT ABBA JAYA SUKSES (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 54 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 146.000.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.ahmad yani; Telp: 082293127420; Email: usmansonda@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.9951449,122.4906002,'https://www.google.com/maps?q=-3.9951449,122.4906002',146000000.0,'total',FALSE,2,1,36,90,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581218620179.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581218603730.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581218633563.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9a63a6e6-87c4-45d2-8f03-6247b366c260',NULL,'rumah_subsidi','rumah_tapak','D'' GREENLAND REGENCY','sikumbang-adl0810012020t002','D'' GREENLAND REGENCY oleh PT LATENRI JAYA PRATAMA (HIMPERRA).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 73 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 HARGA BARU (Subsidi): Rp 173.000.000, LB 35 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Malaka, Komp. Ruko Corridor Blok K. 01; Telp: 081284394799; Email: pt.latenrijayapratama@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.041877722222222,122.45723722222222,'https://www.google.com/maps?q=-4.041877722222222,122.45723722222222',156000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581303899376.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581303880610.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581303913033.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('05d91e13-d23f-422d-a15c-b1e1a62ab98f',NULL,'rumah_subsidi','rumah_tapak','VILLA MAHKOTA','sikumbang-bau0210112020t001','VILLA MAHKOTA oleh PT ANDROMEDA BANGUN PERKASA (HIMPERRA).
Alamat: Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Bakti ABRI Perumahan Villa Mahkota Blok E ; Telp: 081341637619; Email: alfatih89@yahoo.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210112020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Bukit Wolio Indah','Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.474978,122.61873719444444,'https://www.google.com/maps?q=-5.474978,122.61873719444444',156000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581052972731.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581052852747.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581053063761.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('430574b5-0c23-48cd-8197-882ffdf6b99b',NULL,'rumah_subsidi','rumah_tapak','WONUA MORINI','sikumbang-kdi0410052020t002','WONUA MORINI oleh ANUGRAH SINAR KONSEL (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 15 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. RURUHI ANGGOEYA; Telp: 085299377430; Email: mudrikahwahyu28@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.006944444444445,122.56055555555555,'https://www.google.com/maps?q=-4.006944444444445,122.56055555555555',156500000.0,'total',FALSE,2,1,36,97,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580876732562.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580876722211.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580876743185.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2b30bc01-3c4c-4c2f-a6c9-61afa52ba40c',NULL,'rumah_subsidi','rumah_tapak','GRIYA HIDAYAH','sikumbang-kdi0110082020t001','GRIYA HIDAYAH oleh RIZKY HIDAYAT (HIMPERRA).
Alamat: Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Imam Bonjol; Telp: 085285802266; Email: yhidayat209@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0110082020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Mandonga','Wawombalata','Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara',NULL,-3.942855,122.51215666666667,'https://www.google.com/maps?q=-3.942855,122.51215666666667',156000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580965406511.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580965400582.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580965421792.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6ec2be46-f1cb-49bb-be9c-44f71deaef58',NULL,'rumah_subsidi','rumah_tapak','DJAVINO RESIDENCE I','sikumbang-adl0820152020t002','DJAVINO RESIDENCE I oleh PT DJAVINO GRUP INDONESIA (REI).
Alamat: Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 146.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Desa Ranooha, Kec. Ranomeeto Kab. Konsel Kompleks Perumahan DJAVINO RESIDENCE I; Telp: 082368884546; Email: djavinoresidence@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820152020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranooha','Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0539179999999995,122.44975739972223,'https://www.google.com/maps?q=-4.0539179999999995,122.44975739972223',146000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581044515630.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581044507567.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581044522565.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fe4b5386-92f9-4ad3-a6da-cad0f5570ecc',NULL,'rumah_subsidi','rumah_tapak','Anova Garden 2','sikumbang-adl0820152020t001','Anova Garden 2 oleh PT PT. ANOVA GRAHA PROPERTY (ASPRUMNAS).
Alamat: Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 148 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36 Subsidi (Subsidi): Rp 168.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI BARU ANOVA 2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 87 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI 2026 (Subsidi): Rp 173.000.000, LB 3.6 m2 / LT 87 m2, 2 KT / 1 KM, 1 lantai.
- A10 NEW (Subsidi): Rp 173.000.000, LB 36 m2 / LT 87 m2, 2 KT / 1 KM, 1 lantai.
- 36/112,5 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.  MT HARYONO KOMP. BCA Unit 7/8; Telp: 04013198303; Email: anovaproperty18@gmail.com; Web: www.anova-indonesia.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820152020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranooha','Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.057315277777778,122.4529125,'https://www.google.com/maps?q=-4.057315277777778,122.4529125',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581077843862.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581077809583.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581077918704.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('261ccac0-c41b-4e07-89de-b9e3cf078766',NULL,'rumah_subsidi','rumah_tapak','ANOVA GRIYA PERMAI','sikumbang-rah1420072020t001','ANOVA GRIYA PERMAI oleh PT PT. ANOVA GRAHA PROPERTY (ASPRUMNAS).
Alamat: Lasalepa, Kec. Lasalepa, Kab Muna, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: RUKO ANOVA JL. GATOT SUBROTO KEL.SIDODADI KEC. BATALAIWORU KAB. MUNA PROV. SULTRA; Telp: 04013198303; Email: anovaproperty.18@gmail.com; Web: www.anova-indonesia.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/RAH1420072020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Muna','Kab Muna','Lasalepa','Lasalepa','Lasalepa, Kec. Lasalepa, Kab Muna, Sulawesi Tenggara',NULL,-4.795889833333333,122.73227691666666,'https://www.google.com/maps?q=-4.795889833333333,122.73227691666666',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580370068495.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580370063488.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580370077318.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('518d84c9-d09b-4249-a044-a4255ed3e8de',NULL,'rumah_subsidi','rumah_tapak','SULTRA RESIDENT I','sikumbang-kdi0410032020t003','SULTRA RESIDENT I oleh SULTRA MULTI USAHA (APERSI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. KH Ahmad Dahlan; Telp: 082292965927; Email: ptsmu.kendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.040188777777778,122.56048683333333,'https://www.google.com/maps?q=-4.040188777777778,122.56048683333333',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581071152982.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581071112164.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581071192467.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('53824e88-3a86-4d4e-aa1b-3a213736d35d',NULL,'rumah_subsidi','rumah_tapak','PERKANTORAN PERMAI UNAAHA','sikumbang-unh0210152020t001','PERKANTORAN PERMAI UNAAHA oleh PT AMANAH BERSAMA BINTANG (AB).
Alamat: Inolobunggadue, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl.inolobunggadue Komp. Tumpas Residence I ; Telp: 08114039443; Email: amanahbersamabintang03@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210152020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Inolobunggadue','Inolobunggadue, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,-3.851471888888889,122.0414276111111,'https://www.google.com/maps?q=-3.851471888888889,122.0414276111111',156000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/10/09/fotoContoh-42851385-7269-4b60-8b26-19c6768d9273.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/09/fotoGerbang--f3675b02-1ebb-4f4a-8dce-144353dcf656.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/09/fotoTengah-8481221a-5dcc-4cdc-af43-6a1d6fe5741d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('be0c556a-ae74-4d90-8ab1-c8abf6674b72',NULL,'rumah_subsidi','rumah_tapak','Villa Anawai Residence','sikumbang-adl0810012020t003','Villa Anawai Residence oleh PT PROPERTI NIAGA MANDIRI (APERSI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36/98 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36/98 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Chairil Anwar; Telp: 082321650050; Email: propertiniagamandiri@gmail.com; Web: Https://villa-anawai-residence.business.site

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.037697166666667,122.45585661111112,'https://www.google.com/maps?q=-4.037697166666667,122.45585661111112',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580433524308.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580433509319.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580433525950.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('11f3cd7b-5f27-4703-946c-f78c35aaa4bb',NULL,'rumah_subsidi','rumah_tapak','Mawar saron','sikumbang-adl0820172020t003','Mawar saron oleh PT MAWAR SARON SUSANTA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Haluoleo ; Telp: 082292044649; Email: mawarsaronsusanta@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.042918361111111,122.46772655555556,'https://www.google.com/maps?q=-4.042918361111111,122.46772655555556',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580905247936.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580905151445.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580905307977.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6b245d3a-a815-4d0d-9007-765017bcdd1e',NULL,'rumah_subsidi','rumah_tapak','kota hijau residence','sikumbang-kka0410032020t002','kota hijau residence oleh PT GELORA FIRNAGRAHA REALTYTANIA (REI).
Alamat: Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 14 subsidi / 0 komersil.

Tipe rumah:
- 36/96 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jalan cakalang; Telp: 085399111130; Email: citralatambaga@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410032020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Balandete','Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.071729972222222,121.63346097222222,'https://www.google.com/maps?q=-4.071729972222222,121.63346097222222',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581407435900.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581407420518.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581407448034.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f3b27267-0ada-427d-90a3-06872bf8f952',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN ANGGORO PERMAI','sikumbang-bau0210072020t001','PERUMAHAN ANGGORO PERMAI oleh PT ANGGORO MAJU ABADI (REI).
Alamat: Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- Tapak (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 2 KM, 1 lantai.
- Tapak (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Gajah Mada, Kelurahan Lipu, Kecamata Betoambari Kota Baubau, Sulawesi Tenggara, Samping Kantor BPJS Kesehatan; Telp: 081285090436; Email: anggoromajuabadi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210072020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Kadolo Katapi','Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.475852944444444,122.62192533333332,'https://www.google.com/maps?q=-5.475852944444444,122.62192533333332',156500000.0,'total',FALSE,2,2,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579601754996.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579601750503.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579601757708.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e4c6f9db-a96e-4459-8568-f8186b9c9dd6',NULL,'rumah_subsidi','rumah_tapak','BUKIT MEDINA INDAH','sikumbang-bau0110132020t002','BUKIT MEDINA INDAH oleh PT KENSU PUTRA JAYA (PI).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- tiga enam (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.dayanu iksanuddin; Telp: 085256904454; Email: kensuputrajy@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.511846361111111,122.56109777777777,'https://www.google.com/maps?q=-5.511846361111111,122.56109777777777',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579513561468.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579513533275.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579513574633.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('87f68679-0338-407f-bb14-c97dbaf0f974',NULL,'rumah_subsidi','rumah_tapak','TAPALOSA RESIDENCE','sikumbang-kdi0710042020t001','TAPALOSA RESIDENCE oleh PT TAPALOSA CIPTA SARANA (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 146.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.DI.PANJAITAN ; Telp: 0811402799; Email: tapalosa.cskendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.9993294,122.48110649972223,'https://www.google.com/maps?q=-3.9993294,122.48110649972223',146500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580099415451.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580099403988.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580099423979.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a67d9079-aff6-4268-9b98-3707a0cf0cce',NULL,'rumah_subsidi','rumah_tapak','BUKIT TINOMU PERMAI','sikumbang-trw0110022020t001','BUKIT TINOMU PERMAI oleh PT ALMUBARAK MULTI INSANI (REI).
Alamat: Rate-rate, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 135 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. TINOMU PERMAI DESA ORAWA; Telp: 082120191916; Email: almubarak.mi@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0110022020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Rate-rate','Rate-rate, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.045881416666666,121.89338202777779,'https://www.google.com/maps?q=-4.045881416666666,121.89338202777779',156500000.0,'total',FALSE,2,1,36,135,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580103889833","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580103888949.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580103896327"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bc6ef593-1c4e-40ff-ab04-726bd5ff6922',NULL,'rumah_subsidi','rumah_tapak','GRIYA PERMATA HIJAU','sikumbang-kdi0310072020t002','GRIYA PERMATA HIJAU oleh PT SINAR PRIBUMI GRUP (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN KENDARI PERMAI BLOK B2; Telp: 082348778210; Email: sinarpribumi@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.025,122.46361111111112,'https://www.google.com/maps?q=-4.025,122.46361111111112',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579510234659.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579510232975.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579510241007.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9e8db3ac-1ffa-4280-8321-ab370fa3f993',NULL,'rumah_subsidi','rumah_tapak','SPP Ranomeeto Regency V','sikumbang-adl0820172020t002','SPP Ranomeeto Regency V oleh PT SAQI PUTRA PRATAMA (HIMPERRA).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Raya qaimuddin; Telp: 085235880025; Email: sppwilayah@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.047777777777777,122.47472222222223,'https://www.google.com/maps?q=-4.047777777777777,122.47472222222223',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579682819419.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579682804806.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579682822135.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b19c4f9d-a1cb-475f-91ad-2a35c1b0a7ac',NULL,'rumah_subsidi','rumah_tapak','TAWANG ALUN 8','sikumbang-kdi0410032020t005','TAWANG ALUN 8 oleh PT DYAH EKA PARIWISESA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 29 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.
- tawang alun 8 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.
- 36 2026 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: KOMPELK BTN KENDARI PERMAI BLOK U 4; Telp: 082195949889; Email: sarmantripitaka@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0325,122.54777777777778,'https://www.google.com/maps?q=-4.0325,122.54777777777778',156500000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580357940138.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580357925981.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580357940310.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1b1ba929-37f6-4797-bdc7-f0a028d4f3ca',NULL,'rumah_subsidi','rumah_tapak','TAWANG ALUN 10','sikumbang-kdi0310012020t001','TAWANG ALUN 10 oleh PT DYAH EKA PARIWISESA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN KENDARI PERMAI BLOK U4; Telp: 082195949889; Email: sarmantripitaka@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.046552777777777,122.49704444444444,'https://www.google.com/maps?q=-4.046552777777777,122.49704444444444',173000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580363553952.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580363547984.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580363558489.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE)
) AS v(id,seller_id,category,property_type,title,slug,description,province,city,regency_name,district,subdistrict_name,address_detail,postal_code,latitude,longitude,maps_link,price,price_type,is_negotiable,bedrooms,bathrooms,building_area_sqm,land_area_sqm,floors,images,amenities,subsidy_program,can_kpr,certificate_type,condition,status,is_admin_verified,is_featured,views_count,favorites_count,inquiries_count,published_at,ai_generated)
WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.slug = v.slug);

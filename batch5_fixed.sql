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
('7c498b3c-38c1-4ce6-93e1-1ee41cf2ab25',NULL,'rumah_subsidi','rumah_tapak','NEISYA POASIA II.','sikumbang-kdi0410052023t001','NEISYA POASIA II. oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://g.co/kgs/hX5at8

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.021822194444445,122.56191547222222,'https://www.google.com/maps?q=-4.021822194444445,122.56191547222222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1678889999516-41628a38-2a77-459c-8ce2-874f878b5607.jpg","https://sikumbang.tapera.go.id/public/upload/1678889998280-ea7c6446-e963-4e62-82c8-70017aaf7e4b.jpg","https://sikumbang.tapera.go.id/public/upload/1678890000247-9b11e529-0fa6-4aa3-ba3d-c34d8deb3a7a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f4b7cea1-0b1c-443c-983f-5a2e4c3383f2',NULL,'rumah_subsidi','rumah_tapak','PESONA KING ADHAM RESIDENCE TAHAP 2','sikumbang-kdi0910022023t004','PESONA KING ADHAM RESIDENCE TAHAP 2 oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 081245833044 - 082293198772 ; Email: Ilyasathirah4@gmail.com; Web: https://maps.app.goo.gl/9eFeHUtFczssSJhy5

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022023T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9774889444444446,122.47642516666667,'https://www.google.com/maps?q=-3.9774889444444446,122.47642516666667',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1678831153369-a9fffcce-4d59-4d46-b883-3eaa968a49e7.jpg","https://sikumbang.tapera.go.id/public/upload/1678831151148-6da4dd02-ff1a-4b41-8fca-eef90ffc765f.jpg","https://sikumbang.tapera.go.id/public/upload/1678831151810-ad8a4ad4-66e4-4061-8a90-da08889852a2.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('490aa995-190b-45f6-a15e-e06d1c52bf5b',NULL,'rumah_subsidi','rumah_tapak','MUTIARA ATHIRA BARUGA 2','sikumbang-kdi0310012023t001','MUTIARA ATHIRA BARUGA 2 oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://maps.google.com/?q=-4.042056,122.497762&entry=gps

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.041972138888889,122.49565122222222,'https://www.google.com/maps?q=-4.041972138888889,122.49565122222222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1678829653230-63a550df-a2bb-448f-a50b-05cf4eb4bdf9.jpg","https://sikumbang.tapera.go.id/public/upload/1678829652625-8116d849-d0ea-4243-98c3-485eccda8e8e.jpg","https://sikumbang.tapera.go.id/public/upload/1678829654037-5811a0bf-641b-484d-bfcb-fe7d734e2a18.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7343b151-f495-4d55-91e9-94fd587fc911',NULL,'rumah_subsidi','rumah_tapak','GRAHA ARTANTI','sikumbang-kdi1010022023t001','GRAHA ARTANTI oleh ARTANTI MONAPA PERSADA (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 2 KM, 1 lantai.
- 36 Baru (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 1 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN AIR TERJUN RT/RW 001/001 BTN MERTOLAND BLOK B3 ; Telp: 082260366665; Email: ptartantimonapapersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.035794444444444,122.54142777777777,'https://www.google.com/maps?q=-4.035794444444444,122.54142777777777',156500000.0,'total',FALSE,2,2,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1678182031627-6e7ee029-7ce1-4b6f-8dc0-34b1bd0aca11.jpg","https://sikumbang.tapera.go.id/public/upload/1678182033453-c444a8f2-eb93-4be9-9617-3b00adb2cd3d.jpg","https://sikumbang.tapera.go.id/public/upload/1678182033207-bd372273-a78f-4a3c-a451-a70f1faaec37.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('79b65bc8-7f42-4c70-9338-37b9664f34a6',NULL,'rumah_subsidi','rumah_tapak','MADINAH CITY SQUARE II','sikumbang-kdi0310072023t001','MADINAH CITY SQUARE II oleh PT SWARNA DWIPA PROPERTY (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 25 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ade Irma II; Telp: 082120860799; Email: ptswarnadwipaproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0284113,122.48763309972222,'https://www.google.com/maps?q=-4.0284113,122.48763309972222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1678413172000-34e9f026-7c18-4a8a-9ee3-19d9423f3fd3.jpg","https://sikumbang.tapera.go.id/public/upload/1678413172899-e0a9f996-9815-46ef-8643-f8b49832e0c1.jpg","https://sikumbang.tapera.go.id/public/upload/1678413173025-1db6ac40-a782-480e-abce-6ca623a70f0d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c1345ab5-8099-480a-a722-dd083ad43f68',NULL,'rumah_subsidi','rumah_tapak','FELYCIA LAND 3','sikumbang-kdi0910022023t006','FELYCIA LAND 3 oleh PT FELYCIA PROPERTINDO NIAGA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.
- 3 6 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Chairil Anwar, Kel. Watulondo, Kec. Watulondo Kota Kendari (Kantor Pemasaran Afika Residence, Afika Land dan Felycia Residence); Telp: 082393287000; Email: pt.felyciaproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022023T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9813680000000002,122.478335,'https://www.google.com/maps?q=-3.9813680000000002,122.478335',156500000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1683252777053-62019993-edd8-46ea-81dc-e599c19da8a1.jpg","https://sikumbang.tapera.go.id/public/upload/1683252777851-7bedd146-0a52-476b-a154-6b1cc38d1965.JPG","https://sikumbang.tapera.go.id/public/upload/1683252777494-b7a13157-ddab-41e0-b849-21b036094128.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5bc1b2e6-dd3a-4c3a-a05a-ef632402e694',NULL,'rumah_subsidi','rumah_tapak','ANDALAS HILL','sikumbang-bau0110132023t001','ANDALAS HILL oleh PT BUTON PILAR UTAMA (REI).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 10 subsidi / 27 komersil.

Tipe rumah:
- ANDALAS - 36 SUBSIDI (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- ANDALAS - 54 KOMERSIL (Komersil): Rp 365.000.000, LB 54 m2 / LT 120 m2, 3 KT / 2 KM, 1 lantai.
- ANDALAS - 80 KOMERSIL (Komersil): Rp 650.000.000, LB 80 m2 / LT 153 m2, 4 KT / 3 KM, 1 lantai.
- ANDALAS-173 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Diponegoro; Telp: 082291556924; Email: butonpilarutama@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.506411055555556,122.5607833611111,'https://www.google.com/maps?q=-5.506411055555556,122.5607833611111',156500000.0,'total',FALSE,2,1,36,97.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1679025213921-6c5ebb1a-03ac-4f30-a31d-f19f66961f20.jpg","https://sikumbang.tapera.go.id/public/upload/1679025216127-c4c55a69-c379-4958-961c-336d4b84f712.jpg","https://sikumbang.tapera.go.id/public/upload/1679025215308-a603d8a8-f295-41fb-abab-5c28cfc5ba80.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c502ff8c-8d1e-4c33-9981-83304197ecf3',NULL,'rumah_subsidi','rumah_tapak','TAPERA KENDARI TAHAP 3','sikumbang-kdi0910012023t002','TAPERA KENDARI TAHAP 3 oleh PT BAZPROPER SUKSES INDONESIA (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JLN. DI PANDJAITAN; Telp: 08114550341; Email: Bazproper15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9719819444444444,122.4653538888889,'https://www.google.com/maps?q=-3.9719819444444444,122.4653538888889',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1679285249729-ec60ee91-39eb-4d3d-9a3d-212dcb7afaac.jpg","https://sikumbang.tapera.go.id/public/upload/1679285248407-8ff8a214-f83e-455a-99ab-3caac9648b1a.jpg","https://sikumbang.tapera.go.id/public/upload/1679285249591-8d8a5b7d-023a-4038-beda-cfeb294c7c7c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a0ecbb8f-2b2d-4c59-8898-e24bca9cfe1d',NULL,'rumah_subsidi','rumah_tapak','ADHAM TAL HAFIDZ III TAHAP 2','sikumbang-kdi0410032022t010','ADHAM TAL HAFIDZ III TAHAP 2 oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 16 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://maps.app.goo.gl/PjcMeq1B76ngbUyu9

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032022T010 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.025749277777778,122.55091138888889,'https://www.google.com/maps?q=-4.025749277777778,122.55091138888889',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1672198655381-a7f5f693-cb8d-42b4-ad79-52e89126e82e.jpg","https://sikumbang.tapera.go.id/public/upload/1672198653568-7cb2fd00-9c3a-4ea7-8e3a-8c79926bdb59.jpg","https://sikumbang.tapera.go.id/public/upload/1672198654744-123ba9e3-6bca-4611-b633-be17a2a8223e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('69e503a9-d994-4a95-ba86-665b13e6f890',NULL,'rumah_subsidi','rumah_tapak','MARGAHAYU LAND BARUGA III','sikumbang-kdi0310022023t003','MARGAHAYU LAND BARUGA III oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF; Telp: 0811405887; Email: margahayumega@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.038714780555555,122.50644208055556,'https://www.google.com/maps?q=-4.038714780555555,122.50644208055556',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1672721802142-3c6be9d0-0c4d-4a9d-a95c-51ba44299050.jpg","https://sikumbang.tapera.go.id/public/upload/1672721793324-7ff084df-5bb9-4627-9491-5ee93eb52e1d.jpg","https://sikumbang.tapera.go.id/public/upload/1672721796486-f9e5ebcb-2e5f-442c-bd57-30f3ebebacf6.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('89fcb9ee-3914-492e-98d4-5ccd35621f0b',NULL,'rumah_subsidi','rumah_tapak','MARGAHAYU LAND BARUGA','sikumbang-kdi0310022023t001','MARGAHAYU LAND BARUGA oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SUPU YUSUF; Telp: 0811405887; Email: margahayumega@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.040639955555555,122.50496154722222,'https://www.google.com/maps?q=-4.040639955555555,122.50496154722222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1672720120781-e5962b6e-a130-4aee-971f-f579d403164e.jpg","https://sikumbang.tapera.go.id/public/upload/1672720090602-2bf49ded-ce14-459b-82d8-3e83ea622e24.jpg","https://sikumbang.tapera.go.id/public/upload/1672720106933-c7600c87-5396-4b3b-95fa-d956dbdc39fa.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a09445b0-5786-4632-bdce-89652425483a',NULL,'rumah_subsidi','rumah_tapak','MARGAHAYU LAND BARUGA 2','sikumbang-kdi0310022023t002','MARGAHAYU LAND BARUGA 2 oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF; Telp: 0811405887; Email: margahayumega@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.039334030555556,122.50557603888889,'https://www.google.com/maps?q=-4.039334030555556,122.50557603888889',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1672721482612-1ef55da0-080d-4f56-b433-be189ea3bebd.jpg","https://sikumbang.tapera.go.id/public/upload/1672721476044-9f73c1c6-1068-48c4-b609-c50184ce6925.jpg","https://sikumbang.tapera.go.id/public/upload/1672721478730-2a862f39-493c-4a1f-9cd2-396f6ddc63f6.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('40fbda22-c376-4226-af28-99ec52e5c195',NULL,'rumah_subsidi','rumah_tapak','PESONA ALAM KENDARI','sikumbang-kdi0410032023t001','PESONA ALAM KENDARI oleh PT PRATAMA JAYA PROPERTI (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. DURIAN KEL. WUA-WUA KEC. WUA-WUA; Telp: 085241511454; Email: pratamajayaproperti19@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.040236111111111,122.56117222222223,'https://www.google.com/maps?q=-4.040236111111111,122.56117222222223',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1672985413397-f293a2f0-1e1c-49f6-849a-6eaacf349c7b.jpg","https://sikumbang.tapera.go.id/public/upload/1672985418563-3721cf76-8b06-4e99-85d6-3ccff155ab33.jpg","https://sikumbang.tapera.go.id/public/upload/1672985418095-54dd34f0-dcf0-48b0-83c2-4cb2e7db70fe.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a1422e15-b9c2-4f40-ba2b-c58a1b5bf647',NULL,'rumah_subsidi','rumah_tapak','BARUGA HARMONI 2 TAHAP 2','sikumbang-kdi0910022023t001','BARUGA HARMONI 2 TAHAP 2 oleh PT RASYA DWI MANDIRI (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL DI PANJAITAN KECAMATAN  WUA WUA; Telp: 082231952426; Email: rasyadwimandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9774555555555557,122.47900833333334,'https://www.google.com/maps?q=-3.9774555555555557,122.47900833333334',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1673840034694-319bd1de-065f-43b0-bdeb-4570c82ae6af.jpg","https://sikumbang.tapera.go.id/public/upload/1673840034169-f4924bfc-43af-43fb-8a41-f291affe2719.jpg","https://sikumbang.tapera.go.id/public/upload/1673840033870-42c433b7-8b9c-4e5e-92cf-e347661def4c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2bf71913-7ba6-4007-a2bd-859ed46d3f5b',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN MAWAR SARON RESIDENCE','sikumbang-adl0820172023t001','PERUMAHAN MAWAR SARON RESIDENCE oleh PT MAWAR SARON SUSANTA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 95 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Desa Kota Bangun, Kecamatan Ranomeeto, Kabupaten Konawe ; Telp: 082292044649; Email: mawarsaronsusanta@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.042836972222222,122.46778297222222,'https://www.google.com/maps?q=-4.042836972222222,122.46778297222222',156500000.0,'total',FALSE,2,1,36,95,1,'{"https://sikumbang.tapera.go.id/public/upload/1655958403708-9a0bb05f-ff03-40d8-8d74-4399418210be.jpg","https://sikumbang.tapera.go.id/public/upload/1655958406439-2dbe3da0-0e37-4e8a-b105-f701b87894dd.jpg","https://sikumbang.tapera.go.id/public/upload/1655958404727-afba2c02-722e-4176-aeab-317893263d22.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ad38deb4-9e32-44ad-8c9c-64956d9c8dbc',NULL,'rumah_subsidi','rumah_tapak','Hamonangan Green House','sikumbang-kdi0910022023t002','Hamonangan Green House oleh PT HAMONANGAN PERSADA GRUP (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 15 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- KPR SUBSIDI BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Made Sabara; Telp: 08114000225; Email: hamonanganpersadagrup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022023T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.969696972222222,122.48778533333333,'https://www.google.com/maps?q=-3.969696972222222,122.48778533333333',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1673244066949-c54bee5a-1125-404b-a1ab-94e1adbd0d42.jpg","https://sikumbang.tapera.go.id/public/upload/1673244068247-1af399b7-7f22-43b6-9afc-e80cd7c4e4cb.jpg","https://sikumbang.tapera.go.id/public/upload/1673244066522-beb1646f-8691-432b-adb9-1dcefb90c1ea.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('492019ec-9a51-40a9-bbf7-24fb3a177910',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN GRIYA BUKIT KOLUMBA','sikumbang-kka0410042023t001','PERUMAHAN GRIYA BUKIT KOLUMBA oleh PT GALAMPA KOLUMBA PERSADA (REI).
Alamat: Lalombaa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Bukit Kolumba, Blok A; Telp: 085216125057; Email: galampa.kolumba.persada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410042023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Lalombaa','Lalombaa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.078149299722222,121.63967829972223,'https://www.google.com/maps?q=-4.078149299722222,121.63967829972223',156500000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/1675221022886-2e931d1e-40ff-4ae6-9bf1-45e56beffe81.jpg","https://sikumbang.tapera.go.id/public/upload/1675221001705-c47bfbab-9b8f-464b-a171-56791ba7dc9e.jpg","https://sikumbang.tapera.go.id/public/upload/1675221015239-6e4ac248-09f7-44a6-a386-6cddd9660cd6.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f1a2c572-a162-4149-b3a7-c0f6c723bdba',NULL,'rumah_subsidi','rumah_tapak','HASANAH MANSION KENDARI','sikumbang-kdi0410062023t001','HASANAH MANSION KENDARI oleh PT HARWIN JAYA BAROKAH PROPERTY (HIMPERRA).
Alamat: Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Komp. Perumahan Bumi Praja Residence Blok C ; Telp: 085398786061; Email: jayaharwin@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410062023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Matabubu','Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-3.996280555555556,122.56454444444444,'https://www.google.com/maps?q=-3.996280555555556,122.56454444444444',156500000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1676203044283-dd9bb64b-2014-4630-b42e-9cd6e0f275bd.jpg","https://sikumbang.tapera.go.id/public/upload/1676203048360-6a10c96d-20d0-498c-adcf-98348f6d3d7b.jpg","https://sikumbang.tapera.go.id/public/upload/1676203046203-136fcae7-2fe7-4b08-aade-8ca69e3082e5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('377caa0d-eb7f-4ab3-a12d-0c62be468efd',NULL,'rumah_subsidi','rumah_tapak','WAHANA RESIDENCE 2','sikumbang-bau0110142023t001','WAHANA RESIDENCE 2 oleh WAHANA SUMBER BAHAGIA (PI).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. DAYANU IKHSANUDDIN; Telp: 082235510007; Email: modernjaya13@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.4961166666666665,122.56956944444444,'https://www.google.com/maps?q=-5.4961166666666665,122.56956944444444',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1675479984730-eaf20e86-6011-4377-bf47-575a43c6762e.jpg","https://sikumbang.tapera.go.id/public/upload/1675479993757-a5661a9f-2b81-415e-9684-4256e414b334.jpg","https://sikumbang.tapera.go.id/public/upload/1675479999496-a81df962-8570-4397-bf8e-51c10aeb021a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('93a6bda2-3058-47fe-a612-82d482f67ffc',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN TAWAKKAL PERMAI','sikumbang-kka1220092023t001','PERUMAHAN TAWAKKAL PERMAI oleh PT AHMAD TAWAKKAL PRATAMA (REI).
Alamat: Puuroda, Kec. Baula, Kab Kolaka, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: DESA BAULA; Telp: +62 822-5022-2705; Email: ahmadtawakkalpratama@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1220092023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Baula','Puuroda','Puuroda, Kec. Baula, Kab Kolaka, Sulawesi Tenggara',NULL,-4.161481833333334,121.67651366666666,'https://www.google.com/maps?q=-4.161481833333334,121.67651366666666',156000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1676518931977-b39085a5-aa58-46ea-a620-9432ca848085.jpg","https://sikumbang.tapera.go.id/public/upload/1676518923946-ad749de0-b887-43c5-add5-063367007420.jpg","https://sikumbang.tapera.go.id/public/upload/1676518928757-a9949c86-5fc7-4919-95aa-42fbee96730d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3317c6e8-1d26-4f27-a6fe-b2dd46bcc76f',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN GRAND PRADANA RESIDENCE','sikumbang-kdi0910012023t001','PERUMAHAN GRAND PRADANA RESIDENCE oleh PT RIZKY AZKA KONSTRUKSI (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 23 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 2025 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JLN. CHAIRIL ANWAR; Telp: 0853-7776-4209; Email: halisanur1210@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9665980000000003,122.47520444444444,'https://www.google.com/maps?q=-3.9665980000000003,122.47520444444444',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1676864880979-2e644826-fea8-4913-a043-5ac677917814.jpg","https://sikumbang.tapera.go.id/public/upload/1676864880905-e330f57d-24f7-47ab-b4b8-36cee067b64b.jpg","https://sikumbang.tapera.go.id/public/upload/1676864880260-76b9dd31-95d7-47db-badc-75bb730628d8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('64a986ad-d029-43b7-acb4-83cb646fd46b',NULL,'rumah_subsidi','rumah_tapak','GRIYA PERMATA INDAH','sikumbang-adl0720192023t001','GRIYA PERMATA INDAH oleh PT TUWU PERKASA ABADI (REI).
Alamat: Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: PERUMAHAN GRAHA LEPO-LEPO INDAH BLOK B.NO 1; Telp: 081245791664; Email: pttuwuperkasaabadi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720192023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Lalowiu','Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0616319999999995,122.48732497222223,'https://www.google.com/maps?q=-4.0616319999999995,122.48732497222223',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1677473668246-5e61250b-ddf0-4b92-a197-4a4542858542.jpg","https://sikumbang.tapera.go.id/public/upload/1677473669900-9d8607d0-5646-4d54-89d1-65405b06a08c.jpg","https://sikumbang.tapera.go.id/public/upload/1677473668815-fb485bac-3b0b-4ec4-a2f9-2299d99425fd.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1f8253ce-3a57-4073-82fb-1ac3bb60818f',NULL,'rumah_subsidi','rumah_tapak','SULTRA HILLS RESIDENCE 2','sikumbang-kdi0310082023t001','SULTRA HILLS RESIDENCE 2 oleh PT SULTRA RAYA MANDIRI (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 1 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SMPN 12 KENDARI Lr. Cendana Kel. Wundudopi Kec. Baruga Kota Kendari; Telp: 085341920400; Email: sultraraya421@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.021539583333333,122.49588608333333,'https://www.google.com/maps?q=-4.021539583333333,122.49588608333333',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1672194761843-11478d53-1f0b-4fe3-915b-aa03442d9940.jpg","https://sikumbang.tapera.go.id/public/upload/1672194758974-bfc98496-4c6d-476f-9468-5f84d5b5e429.jpg","https://sikumbang.tapera.go.id/public/upload/1672194760298-754b7b3e-12e0-41d4-b068-3a6ae7d85e3b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1952f201-418c-444a-8dd4-1d09042a4d98',NULL,'rumah_subsidi','rumah_tapak','Citra Latambaga Indah 3','sikumbang-kka1410012023t001','Citra Latambaga Indah 3 oleh PT GELORA FIRNAGRAHA REALTYTANIA (REI).
Alamat: Mangolo, Kec. Latambaga, Kab Kolaka, Sulawesi Tenggara.
Total unit: 121 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 101 m2, 2 KT / 1 KM, 1 lantai.
- Gen-Z (Subsidi): Rp 173.000.000, LB 35 m2 / LT 101 m2, 2 KT / 1 KM, 1 lantai.
- GEN - ZET (Subsidi): Rp 173.000.000, LB 35 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- GEN-Zi (Subsidi): Rp 173.000.000, LB 35 m2 / LT 99 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: PERUMAHAN CITRA LATAMBAGA; Telp: 082190338038; Email: citralatambaga@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1410012023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Latambaga','Mangolo','Mangolo, Kec. Latambaga, Kab Kolaka, Sulawesi Tenggara',NULL,-4.036183333333333,121.55757777777778,'https://www.google.com/maps?q=-4.036183333333333,121.55757777777778',156500000.0,'total',FALSE,2,1,36,101,1,'{"https://sikumbang.tapera.go.id/public/upload/1677132087642-c3f20487-07e1-4dbb-8ce8-f621c16aefd2.jpg","https://sikumbang.tapera.go.id/public/upload/1677132088821-a3190195-483e-4d54-aed0-2e319aecdf58.jpg","https://sikumbang.tapera.go.id/public/upload/1677132087841-292bc9af-17ef-42c4-bf1e-560bde3f5074.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2b078bd9-6b16-49e8-a3a9-16d2db9f7532',NULL,'rumah_subsidi','rumah_tapak','RATU PERMAI RESIDENCE 3','sikumbang-bau0110122023t001','RATU PERMAI RESIDENCE 3 oleh CV RATU PERMAI (ASPERI).
Alamat: Waborobo, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 23 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- T 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Limbo Wolio; Telp: 081242946579; Email: cv.ratupermai@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110122023T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Waborobo','Waborobo, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.501341666666667,122.5791611111111,'https://www.google.com/maps?q=-5.501341666666667,122.5791611111111',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1677912508847-79591a39-f5a9-478d-9f75-d9dc8a1a63f5.jpg","https://sikumbang.tapera.go.id/public/upload/1677912511632-d2ecfbe8-0091-4687-88fa-8341a49e6563.jpg","https://sikumbang.tapera.go.id/public/upload/1677912512350-0d641582-d17a-4449-b000-665ae40e4496.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('aaf452ad-a59b-4c3c-abc8-ed38b52421dc',NULL,'rumah_subsidi','rumah_tapak','FELYCIA RESIDENCE','sikumbang-kdi0910022023t003','FELYCIA RESIDENCE oleh PT FELYCIA PROPERTINDO NIAGA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 28 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Chairil Anwar, Kel. Watulondo, Kec. Watulondo Kota Kendari (Kantor Pemasaran Afika Residence, Afika Land dan Felycia Residence); Telp: 082393287000; Email: pt.felyciaproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022023T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9795889999074845,122.482892,'https://www.google.com/maps?q=-3.9795889999074845,122.482892',156500000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1678085606224-f570907b-a765-48ae-ac07-db4405f3bcea.jpg","https://sikumbang.tapera.go.id/public/upload/1678085608150-6c05b59f-237f-4806-aa56-a7c4c8fa4ded.JPG","https://sikumbang.tapera.go.id/public/upload/1678085610750-98abde45-8e6e-42ea-a4e5-bd188c2cf071.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2ebf24d3-d52a-4871-a880-4160ab6987da',NULL,'rumah_subsidi','rumah_tapak','BUMI ANAWAI LAND','sikumbang-kdi0710042022t003','BUMI ANAWAI LAND oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 23 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://maps.app.goo.gl/vBzmYSE72DNbck3P9

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.0100373,122.4832632,'https://www.google.com/maps?q=-4.0100373,122.4832632',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1671602053999-845727f0-6c33-4d13-b5ae-79a6ebe7ac16.jpg","https://sikumbang.tapera.go.id/public/upload/1671602050395-ef6e34bf-1eff-4c15-aa77-b5fb5d0a2d71.jpg","https://sikumbang.tapera.go.id/public/upload/1671602052028-bbca1621-554c-4efb-9e3b-784387b187e8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('789d1c32-2240-4b6d-a6bf-6a015f7eb441',NULL,'rumah_subsidi','rumah_tapak','ADHAM TAL HAFIDZ III','sikumbang-kdi0410032022t009','ADHAM TAL HAFIDZ III oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://maps.app.goo.gl/A3uTvUUfaC27EKcp6

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032022T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.025739194444444,122.55100408333332,'https://www.google.com/maps?q=-4.025739194444444,122.55100408333332',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1671850987639-8c130e28-a20b-458f-a73a-bd6e851b9147.jpg","https://sikumbang.tapera.go.id/public/upload/1671850986438-3faa63fb-9375-4fbe-9ff2-827a6b7b149b.jpg","https://sikumbang.tapera.go.id/public/upload/1671850986790-6e1b8617-b8e2-4aaa-b94b-083d3b421102.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('101f60c6-62f1-4878-a1e3-954d76a98aed',NULL,'rumah_subsidi','rumah_tapak','NEISYA POASIA II','sikumbang-kdi0410052022t005','NEISYA POASIA II oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://goo.gl/maps/bv77icJLw3ekYL138

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052022T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.031497777777778,122.55229919444444,'https://www.google.com/maps?q=-4.031497777777778,122.55229919444444',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1672018343791-f46287e8-fc0a-4a29-868a-fb7e40435e63.jpg","https://sikumbang.tapera.go.id/public/upload/1672018342891-afc143a7-1132-4a58-b217-3ede66045e46.jpg","https://sikumbang.tapera.go.id/public/upload/1672018343310-98025067-17eb-4bad-8bee-aef582835083.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('466de320-dfce-4a9e-9f3f-bf09f173b75a',NULL,'rumah_subsidi','rumah_tapak','HALUOLEO GARDEN 2','sikumbang-kdi1010022022t005','HALUOLEO GARDEN 2 oleh PT SULAIMAN ABDI PERSADA (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 15 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 HARGA BARU (Subsidi): Rp 168.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- HARGA TERBARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- harga baru 2025 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN. GRAHA REKSA; Telp: 081244061663; Email: ptsulaimanabdipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022022T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.043505999722222,122.55285879972222,'https://www.google.com/maps?q=-4.043505999722222,122.55285879972222',156500000.0,'total',FALSE,2,1,36,97.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1670564241765-032c0976-2e56-4bb8-be4f-b3c8419df5ea.jpg","https://sikumbang.tapera.go.id/public/upload/1670564241551-45280a94-b3d6-4804-a2f0-8b0462113f02.jpg","https://sikumbang.tapera.go.id/public/upload/1670564241129-2600f6a3-22cf-40d0-8ded-08517c33508b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bac25605-df3e-414f-90df-23254ec366da',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN HARMONY REGENCY','sikumbang-kdi0310012022t006','PERUMAHAN HARMONY REGENCY oleh PT RIZKY AZKA KONSTRUKSI (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- PERMANEN (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. AHMAD YANI ; Telp: 082231810164; Email: inhadafa15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012022T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.038630555555556,122.47743333333334,'https://www.google.com/maps?q=-4.038630555555556,122.47743333333334',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1666074918998-bce36b78-5dc1-44f0-9fd6-1973feaf55fa.JPG","https://sikumbang.tapera.go.id/public/upload/1666074904165-8070925c-452e-4e83-9292-61c7e8b8925f.JPG","https://sikumbang.tapera.go.id/public/upload/1666074912535-c2216825-596e-47fb-996b-976923846526.JPG"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('44031579-2bf3-4cdb-94be-54fc40c1cbbd',NULL,'rumah_subsidi','rumah_tapak','QUEENSHA RESIDENCE','sikumbang-kdi0410062022t001','QUEENSHA RESIDENCE oleh PT UNIVERSAL MODERN GROUP (APERSI).
Alamat: Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LAPATO (Ex. Jl. Jambu putih); Telp: 085255537563; Email: Ptuniversalmoderngroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410062022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Matabubu','Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.002165,122.56536972222221,'https://www.google.com/maps?q=-4.002165,122.56536972222221',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1668587132001-ea74713b-2d1c-4e69-820b-dac20d4b517c.jpg","https://sikumbang.tapera.go.id/public/upload/1668587131715-4b4ccba5-c802-4051-aba1-7520c6132e65.jpg","https://sikumbang.tapera.go.id/public/upload/1668587131309-35a0913d-2c5a-4973-87ef-d93506f5d533.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ef41e3f2-743d-4d66-a1b6-28e556271957',NULL,'rumah_subsidi','rumah_tapak','Alrazeqi residence 3','sikumbang-bau0110132022t008','Alrazeqi residence 3 oleh CV AL-RAZEQI BERSAUDARA (HIMPERRA).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Dayanu Iksanudin ; Telp: 081280504179; Email: cv.alrazeqibersaudara@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132022T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.5165119,122.56392549722221,'https://www.google.com/maps?q=-5.5165119,122.56392549722221',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1668869628564-8cb19fc4-21f8-4f35-bc83-17a15af202e4.jpg","https://sikumbang.tapera.go.id/public/upload/1668869624539-50fd942c-ff3f-4957-979c-4b05176c5338.jpg","https://sikumbang.tapera.go.id/public/upload/1668869625880-68363251-7426-43ba-b13a-aafbfa02e8aa.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c54b245c-75a7-45f9-9b62-b630c176f8cf',NULL,'rumah_subsidi','rumah_tapak','MARGAHAYU LAND POASIA','sikumbang-kdi0410042022t005','MARGAHAYU LAND POASIA oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF; Telp: 0811405887; Email: margahayu_megautama@yahoo.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042022T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0216576,122.5530935,'https://www.google.com/maps?q=-4.0216576,122.5530935',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1669367769363-a00bde07-fd52-4626-a97e-62b08204a60b.jpg","https://sikumbang.tapera.go.id/public/upload/1669367768355-a3af6e98-8cc9-4aa3-b7b0-af8c10467a6a.jpg","https://sikumbang.tapera.go.id/public/upload/1669367769546-c7ce3415-29a4-441c-af41-0ac1d32bce68.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6860b331-465c-40f5-9d39-6bdb90053278',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN SIMBO RESIDENCE','sikumbang-kdi0310072022t007','PERUMAHAN SIMBO RESIDENCE oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF; Telp: 0811405887; Email: margahayu_megautama@yahoo.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072022T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.029315099722222,122.47260819972223,'https://www.google.com/maps?q=-4.029315099722222,122.47260819972223',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1669357296071-f1492889-d543-445f-b3e8-76fe9f4ed4bd.jpg","https://sikumbang.tapera.go.id/public/upload/1669357297703-cee0f392-200d-48aa-a334-d08eff28101b.jpg","https://sikumbang.tapera.go.id/public/upload/1669357294221-b72ef85e-46e3-46db-bcf1-67e29e518ee1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('44b2fb27-628b-4da9-94eb-eefe458beb73',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN SIMBO RESIDENCE 2','sikumbang-kdi0310072022t008','PERUMAHAN SIMBO RESIDENCE 2 oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF; Telp: 0811405887; Email: margahayu_megautama@yahoo.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072022T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0293626527777775,122.474010425,'https://www.google.com/maps?q=-4.0293626527777775,122.474010425',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1669357826208-07ec6ff0-2e93-441a-86e7-f767b96cbf4c.jpg","https://sikumbang.tapera.go.id/public/upload/1669357828225-d537f313-2eba-4729-b824-49f17dfdc0cb.jpg","https://sikumbang.tapera.go.id/public/upload/1669357825646-a77f6757-5dec-4e3a-be4f-8f03148f6155.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('10fc05c2-cd0d-40ea-a0da-bf1a3ce8bcee',NULL,'rumah_subsidi','rumah_tapak','BUMI TAHOA PERMAI','sikumbang-kka0410072022t001','BUMI TAHOA PERMAI oleh PT KOLAKA BUMI REALTY (ASPRUMNAS).
Alamat: Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36/90 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Komersil): Rp 156.500.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jalan repelita ; Telp: 085298678427; Email: kolakakbr@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410072022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Tahoa','Tahoa, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.079201111111111,121.61453666666667,'https://www.google.com/maps?q=-4.079201111111111,121.61453666666667',156500000.0,'total',FALSE,2,1,36,90,1,'{"https://sikumbang.tapera.go.id/public/upload/1667957777018-be20dee1-595f-4630-9d83-1a29ed06df58.jpg","https://sikumbang.tapera.go.id/public/upload/1667957764320-7bd5a19b-62be-411a-afb3-324f73cbf432.jpg","https://sikumbang.tapera.go.id/public/upload/1667957772370-b2711198-50b8-473c-a385-83b8d4ae532f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('64e91f83-c05d-4987-a578-325605039162',NULL,'rumah_subsidi','rumah_tapak','DJAVINO RESIDENCE V','sikumbang-kdi0310072022t009','DJAVINO RESIDENCE V oleh PT DJAVINO GRUP INDONESIA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 23 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 2025 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. ADE IRMA NASUTION; Telp: 08114038833; Email: djavinogroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072022T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.019431599722222,122.48214369972223,'https://www.google.com/maps?q=-4.019431599722222,122.48214369972223',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1666589059717-35a5de88-80ee-42db-b3fd-23f79b0786d7.jpg","https://sikumbang.tapera.go.id/public/upload/1666589059605-e07888cf-995e-4c70-9070-9de291e18967.jpg","https://sikumbang.tapera.go.id/public/upload/1666589059112-390972a5-90de-449f-9fae-9abe9ea945dc.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2ef68422-d6e7-4c58-bd7a-795d936079e8',NULL,'rumah_subsidi','rumah_tapak','MALEO GRIYA LESTARI','sikumbang-adl0810012022t004','MALEO GRIYA LESTARI oleh PT MALEO GRIYA MEGA CIPTA LESTARI (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 115 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 115 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL RONGA II MANDONGA; Telp: +62 813-4153-1880; Email: muhmuchsintaruna@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012022T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.048436972222222,122.46773297222222,'https://www.google.com/maps?q=-4.048436972222222,122.46773297222222',156500000.0,'total',FALSE,2,1,36,115,1,'{"https://sikumbang.tapera.go.id/public/upload/1668479996982-0ac18267-4d85-4fa0-8eab-dc2f84fd5303.jpg","https://sikumbang.tapera.go.id/public/upload/1668479988612-854ccd02-4a47-489d-8261-5ca0349f743f.jpg","https://sikumbang.tapera.go.id/public/upload/1668479988597-f1f6a2d5-a391-48d2-a51c-a0fc2ef70837.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ef17d73a-898a-431e-b63d-65c379ebd889',NULL,'rumah_subsidi','rumah_tapak','GRIYA IB HASANAH','sikumbang-kdi0910012022t007','GRIYA IB HASANAH oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 72 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://maps.app.goo.gl/11edXAWV5ib69fjn6

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012022T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9757510000000003,122.4704692,'https://www.google.com/maps?q=-3.9757510000000003,122.4704692',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1671605262130-a7e06525-5d73-4dd4-aff2-ed0ed781e158.jpg","https://sikumbang.tapera.go.id/public/upload/1671605261204-d99e770c-4761-4c25-8983-ff9cf6e70e32.jpg","https://sikumbang.tapera.go.id/public/upload/1671605261973-b9e60b9a-d00f-4bfd-b411-6b3e2d63c0c5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d1d75b5a-4019-4e93-b812-e17794beff88',NULL,'rumah_subsidi','rumah_tapak','Bumi Punggolaka Indah tahap 2','sikumbang-kdi0910062022t003','Bumi Punggolaka Indah tahap 2 oleh HARAPAN MERONGA SEJAHTERA (REI).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Kh.Ahmad Dahlan kompleks ruko; Telp: 08114056901; Email: ptharapanmerongasejahtera@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9544760833333337,122.49617766666667,'https://www.google.com/maps?q=-3.9544760833333337,122.49617766666667',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1669767603999-a3de3fa4-864e-42c8-aada-c79257fea1b9.jpg","https://sikumbang.tapera.go.id/public/upload/1669767608061-d19c6bef-2c4e-4700-8221-3bec65596970.jpg","https://sikumbang.tapera.go.id/public/upload/1669767603531-8d26f4e6-d7a6-4b37-bcd9-5c213d1a32f3.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2bf9bac4-d58d-419a-be80-cdaa71e75b06',NULL,'rumah_subsidi','rumah_tapak','PURI PUUWATU INDAH TAHAP 2','sikumbang-kdi0910012022t006','PURI PUUWATU INDAH TAHAP 2 oleh PT PROPERTI NIAGA MANDIRI (APERSI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36/98 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.CHAIRIL ANWAR ; Telp: 082321650050; Email: propertiniagamandiri@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012022T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.980193972222222,122.473025,'https://www.google.com/maps?q=-3.980193972222222,122.473025',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1671007557671-df90a1b0-5779-4228-bafb-78ffc90e0d11.jpg","https://sikumbang.tapera.go.id/public/upload/1671007558153-74a7fb00-1924-462a-a048-7ea71b473252.jpg","https://sikumbang.tapera.go.id/public/upload/1671007061385-aca7ef24-2b06-47f6-8618-cfce797e17b1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('90e7474f-3660-40d9-afe0-790310073fdf',NULL,'rumah_subsidi','rumah_tapak','KABA RESIDENCE','sikumbang-kdi0310012022t007','KABA RESIDENCE oleh PT KARYABARU BERKAH NUSANTARA (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Mayjen Katamso, Komplek BTN Raksa Asri, nomor 03, SULAWESI TENGGARA, KOTA KENDARI, Baruga, Baruga; Telp: 085394769471; Email: pt.karyabaruberkahnusantarakdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012022T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0464472222222225,122.49369722222222,'https://www.google.com/maps?q=-4.0464472222222225,122.49369722222222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1670395065542-b03d442f-2618-4a91-8bc2-8a0fe5d5d474.jpg","https://sikumbang.tapera.go.id/public/upload/1670395068169-dfd7bae6-0170-4fe1-bdbf-8c81cddc77c4.jpg","https://sikumbang.tapera.go.id/public/upload/1670395068869-53ae189b-7429-46ae-8f75-1379bbf5475d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a8807387-8c0e-4087-a0ca-e6eae8aa0c7c',NULL,'rumah_subsidi','rumah_tapak','GSK RESIDENCE PUUWATU','sikumbang-kdi0910012022t004','GSK RESIDENCE PUUWATU oleh PT GRIYA SULTRA KONSTRUKSI (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 Subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN GRAHA ASRI; Telp: 081357758855; Email: griyasultrakonstruksi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012022T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9746239722222225,122.465046,'https://www.google.com/maps?q=-3.9746239722222225,122.465046',156500000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/upload/1663594086816-8a2dcd10-1895-435d-ba05-2ce0f1bfc558.jpg","https://sikumbang.tapera.go.id/public/upload/1663594097373-5fbf4aeb-3ed1-446e-a2eb-604bc7fe92f9.jpg","https://sikumbang.tapera.go.id/public/upload/1663594087708-7886444f-b2e2-4a27-ac01-1f289d497ebe.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('06ac0082-13e5-4791-b8e3-f0e855f1de4c',NULL,'rumah_subsidi','rumah_tapak','FAHMI RESIDENCE 2','sikumbang-adl0810012022t002','FAHMI RESIDENCE 2 oleh PT PERMATA TIRTA JAYA (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Kel. Ranomeeto Kec. Ranomeeto Kab. Konawe Selatan; Telp: 081342813438; Email: residencepermata28@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.040391916666667,122.45799252777778,'https://www.google.com/maps?q=-4.040391916666667,122.45799252777778',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1657164637276-640566b4-d49a-4152-82a9-e2daaee2ad85.jpg","https://sikumbang.tapera.go.id/public/upload/1657164640315-8926e494-5d10-4a0e-9c1f-d3fa3b9d679f.jpg","https://sikumbang.tapera.go.id/public/upload/1657164633456-aa67bbfe-aa5d-4399-868c-0e3fdf8a8ba8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9bf1b792-426c-4c8f-8d36-cb6c1842694f',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN BARUGA HARMONI 2','sikumbang-kdi0910012022t005','PERUMAHAN BARUGA HARMONI 2 oleh PT RASYA DWI MANDIRI (APERSI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Simbo; Telp: 0811404977; Email: pt.rasyadwimandiri2020@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012022T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.977794888888889,122.47679136111111,'https://www.google.com/maps?q=-3.977794888888889,122.47679136111111',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1664330056029-425ce3d7-fc62-4872-8403-d4aef998dfc2.jpg","https://sikumbang.tapera.go.id/public/upload/1664330030478-9348200e-7a32-45ff-b93c-3c285a3c2cc9.jpg","https://sikumbang.tapera.go.id/public/upload/1664330042294-a0311cf0-50c6-4f0d-8798-95c3195e94bb.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('49dd1584-a1f0-49db-b30d-133ecc782596',NULL,'rumah_subsidi','rumah_tapak','VILLA INDAH PONDUI 2','sikumbang-kka0410062022t001','VILLA INDAH PONDUI 2 oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Laloeha, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN PEMUDA; Telp: 082293833529; Email: pt.villa.mutiara.ramadhan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410062022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Laloeha','Laloeha, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.0547659722222225,121.61074199999999,'https://www.google.com/maps?q=-4.0547659722222225,121.61074199999999',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1664422016728-8b97bea1-60bc-425f-b2db-dc4d7461118b.jpg","https://sikumbang.tapera.go.id/public/upload/1664422003939-04477b5b-6f69-420c-9737-860e94c820bc.jpg","https://sikumbang.tapera.go.id/public/upload/1664422016960-5d2548d2-7183-47f8-822f-8725ec380afc.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6eae2860-437e-4b74-8cb6-00507d5098e1',NULL,'rumah_subsidi','rumah_tapak','SIMPONI RESIDENCE','sikumbang-trw0120032022t001','SIMPONI RESIDENCE oleh PT ARDJUN NUSANTARA KONSTRUKSI (APERSI).
Alamat: Poni-poniki, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 19 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Desa Poni-Poniki, Kec.Tirawuta, Kab. Kolaka Timur; Telp: 082245364466; Email: ptardjunnusantara@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120032022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Poni-poniki','Poni-poniki, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.029958333333333,121.87974166666666,'https://www.google.com/maps?q=-4.029958333333333,121.87974166666666',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1660122922188-39a2ede0-1158-4fb8-9934-f5be5fe2a215.jpg","https://sikumbang.tapera.go.id/public/upload/1660122813750-1922bacc-cbaf-435b-b685-21b3f65643be.jpg","https://sikumbang.tapera.go.id/public/upload/1660122865952-d14ad9ca-28b8-40a8-89a4-197e90f8af9c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('26e98c89-d745-4e6d-8ae0-286a9720ff75',NULL,'rumah_subsidi','rumah_tapak','MEKAR ASRI RESIDENCE','sikumbang-bau0210072022t003','MEKAR ASRI RESIDENCE oleh KEENAN MEKAR JAYA (PI).
Alamat: Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 Subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. WR. MONGINSIDI; Telp: 08524062467; Email: keenanmekarjaya28@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210072022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Kadolo Katapi','Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.47105,122.63390000000001,'https://www.google.com/maps?q=-5.47105,122.63390000000001',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1665031670209-39e1533e-5ead-4b14-8bad-3c7741be8c12.jpg","https://sikumbang.tapera.go.id/public/upload/1665031653899-23772205-6f8b-41c3-a13b-dd1cc9146bc6.jpg","https://sikumbang.tapera.go.id/public/upload/1665031662142-7399065b-8158-442f-b3d4-9923626753ca.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('32d4bd65-0879-4d33-91e1-c63280af7cc6',NULL,'rumah_subsidi','rumah_tapak','BUMI POLEANG RESIDENCE','sikumbang-rmb0110172022t001','BUMI POLEANG RESIDENCE oleh PT HARAPAN ADE NUSANTARA (APERSI).
Alamat: Kasabolo, Kec. Poleang, Kab Bombana, Sulawesi Tenggara.
Total unit: 31 subsidi / 0 komersil.

Tipe rumah:
- 36/105 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.
- 36/105 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Poros Bombana-Kolaka; Telp: 085299909972; Email: ptharapanadenusantara@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/RMB0110172022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Bombana','Kab Bombana','Poleang','Kasabolo','Kasabolo, Kec. Poleang, Kab Bombana, Sulawesi Tenggara',NULL,-4.771377027777778,121.55960080555555,'https://www.google.com/maps?q=-4.771377027777778,121.55960080555555',156500000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/upload/1648966282665-09a4b637-633c-4d4c-9efd-b8be34f7ba0d.jpg","https://sikumbang.tapera.go.id/public/upload/1648966292606-eab0f819-71fb-44c6-afa7-f1e824bfff08.jpg","https://sikumbang.tapera.go.id/public/upload/1648966289465-b8e8067f-5cb0-4dd6-9379-183b62c15a97.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6fb6abcb-cb8b-43f1-a451-4d14bf8c101b',NULL,'rumah_subsidi','rumah_tapak','Naya Residence','sikumbang-kdi0410042022t004','Naya Residence oleh PT WAHANA ANUGERAH PERKASA (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 53 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- harga baru 2025 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. Jend Ahmad Yani (Depan Stasiun TVRI Sulawesi Tenggara); Telp: 08561033337; Email: ptwahanaanugerahperkasa@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042022T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.034262166666666,122.56147002777777,'https://www.google.com/maps?q=-4.034262166666666,122.56147002777777',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1665104314767-3436c5d0-ecaf-4bb3-aa0a-995ab1ac1fab.jpg","https://sikumbang.tapera.go.id/public/upload/1665104320768-57f347a7-bcac-4232-8370-22ff253e308e.jpg","https://sikumbang.tapera.go.id/public/upload/1665104320161-ca0d3e68-6009-4a3f-8a17-b0570a730f24.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0fd0031c-20ea-44ee-af30-4bf7b83d3458',NULL,'rumah_subsidi','rumah_tapak','GRAHANARA PUNGGOLAKA','sikumbang-kdi0910062022t002','GRAHANARA PUNGGOLAKA oleh PT HANARA GEMA REALTY (REI).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 1 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: J.syech yusuf; Telp: 085296511511; Email: hanaragemarealty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.956485027777778,122.50057983333333,'https://www.google.com/maps?q=-3.956485027777778,122.50057983333333',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1665039624424-2386e9ee-cf5a-4e3e-b3d5-dafed281e9e5.jpg","https://sikumbang.tapera.go.id/public/upload/1665039670387-7802507b-f85f-4c72-9ab8-b21f7736ddec.jpg","https://sikumbang.tapera.go.id/public/upload/1665039671447-01717a15-5154-4571-823d-117f8958e176.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9b4e03dd-1b07-4463-a693-56d7fcbcc863',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN TRI SATYA RESIDENCE','sikumbang-kdi0310012022t004','PERUMAHAN TRI SATYA RESIDENCE oleh PT AMAR MULYA MANDIRI (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN BUMI WANGGU PERMAI BLOK L/2; Telp: +62 822-4325-5242; Email: amarmuliamandiri@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012022T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.045169444444444,122.50274722222223,'https://www.google.com/maps?q=-4.045169444444444,122.50274722222223',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1665713504515-b9267544-1daa-4de1-87b9-f7be4407ef8b.jpg","https://sikumbang.tapera.go.id/public/upload/1665713504099-0650bcbe-3350-46d6-a297-f72088f7ea13.jpg","https://sikumbang.tapera.go.id/public/upload/1665713502486-02c1dfae-96f9-428a-b695-8b484a3d26d0.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('805bd370-4592-4b78-87ff-bc69e72cd9d0',NULL,'rumah_subsidi','rumah_tapak','DENETA RESIDENCE 3','sikumbang-adl0810012022t003','DENETA RESIDENCE 3 oleh PT ANUGERAH JAYA BUNDA (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Mandiri. PR. Deneta Residence Blok D; Telp: 082343088996; Email: ptanugerahjayabunda@gmail.com; Web: 0

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.044464444444444,122.457935,'https://www.google.com/maps?q=-4.044464444444444,122.457935',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/upload/1666056604599-127c92fd-a841-4f83-9c50-6e53f4c65c66.jpg","https://sikumbang.tapera.go.id/public/upload/1666056623560-0e2b203e-8f53-4551-a3d6-2782000ef5c9.jpg","https://sikumbang.tapera.go.id/public/upload/1666056621966-d5f3e7fa-05d0-4076-8b2a-5cdefe685aff.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7b5b8df4-ab19-47f4-9f10-9607329e5b44',NULL,'rumah_subsidi','rumah_tapak','VILLA INDAH AHMAD MUSTIN','sikumbang-kka0410062022t002','VILLA INDAH AHMAD MUSTIN oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Laloeha, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 15 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN PEMUDA; Telp: 082293833529; Email: pt.villa.mutiara.ramadhan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410062022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Laloeha','Laloeha, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.063515972222222,121.61540699999999,'https://www.google.com/maps?q=-4.063515972222222,121.61540699999999',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1666926455852-af62a9ee-9c57-4095-9e00-6ac8cb5151a4.jpg","https://sikumbang.tapera.go.id/public/upload/1666926457772-61fbf0a3-95d1-47a8-9902-ed13f99dce35.jpg","https://sikumbang.tapera.go.id/public/upload/1666926456678-7a627204-3154-458e-9498-4013f112a2ea.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('db87bf7c-ec36-4eb0-b593-d6997a6e43c5',NULL,'rumah_subsidi','rumah_tapak','ALYA RESIDENCE','sikumbang-kdi0310082022t003','ALYA RESIDENCE oleh PT MAJU GRIYA CAHAYA (APERSI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl wuele kendari; Telp: 08114019700; Email: majugriyacahaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.021744166666666,122.49541916666666,'https://www.google.com/maps?q=-4.021744166666666,122.49541916666666',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1667891549547-a71e5fb6-2751-45e3-b5dc-c54da68244e3.jpg","https://sikumbang.tapera.go.id/public/upload/1667891508499-03fc3d08-c6d8-40c0-a5e9-c51f9b28218e.jpg","https://sikumbang.tapera.go.id/public/upload/1667891539619-d0c5a8ab-9767-4e5c-a17b-07a3c44d0f2b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b5aeffcc-4162-4a6f-a586-5fb2a304fc52',NULL,'rumah_subsidi','rumah_tapak','BARUGA AL NAIRA RESIDENCE','sikumbang-kdi0310012022t005','BARUGA AL NAIRA RESIDENCE oleh MITRA MANDIRI GRUP (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 23 subsidi / 0 komersil.

Tipe rumah:
- 36 Premium (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Sorumba; Telp: 082346754298; Email: mitramandiripropertysultra@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012022T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0382,122.474101,'https://www.google.com/maps?q=-4.0382,122.474101',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1658295788864-63b5003d-34bd-4b2f-9517-93cb13b453d2.jpg","https://sikumbang.tapera.go.id/public/upload/1658295912514-2cd9186b-679e-4f07-b120-748929f685ab.jpg","https://sikumbang.tapera.go.id/public/upload/1658295761669-427affdd-6b15-4dbb-8d37-2e904c61da28.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5e6c8964-c58b-4d96-a16a-54048524571c',NULL,'rumah_subsidi','rumah_tapak','Elbaity Residence II','sikumbang-kdi0610012022t001','Elbaity Residence II oleh PT ELMITRA JAYA GRUP (APERSI).
Alamat: Puday, Kec. Abeli, Kota Kendari, Sulawesi Tenggara.
Total unit: 32 subsidi / 0 komersil.

Tipe rumah:
- blok A (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- Blok B (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- Blok C (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- Blok D (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl.madusila -kantor camat abeli; Telp: 082272028081; Email: elsahsumy@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0610012022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Abeli','Puday','Puday, Kec. Abeli, Kota Kendari, Sulawesi Tenggara',NULL,-3.9892083333333335,122.57806333333333,'https://www.google.com/maps?q=-3.9892083333333335,122.57806333333333',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1668481925662-fa2be526-6fbf-4933-a5b6-84befc17b328.jpg","https://sikumbang.tapera.go.id/public/upload/1668481924442-abf7e4c0-c4c5-42c2-a40e-1f1b372d72e4.jpg","https://sikumbang.tapera.go.id/public/upload/1668481926033-ff35539e-34d6-47bd-95a9-ada711287cea.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9283a846-9895-4610-a298-9294b4a63724',NULL,'rumah_subsidi','rumah_tapak','AL-RAZEQI RESIDENCE 2','sikumbang-bau0110132022t007','AL-RAZEQI RESIDENCE 2 oleh CV AL-RAZEQI BERSAUDARA (HIMPERRA).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.dayanu ikhsanudin; Telp: 081280504179; Email: idrisdelarose@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132022T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.5165119,122.56392549722221,'https://www.google.com/maps?q=-5.5165119,122.56392549722221',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1665523002715-9dd73ea8-8805-465a-9233-c979770803da.jpg","https://sikumbang.tapera.go.id/public/upload/1665523000141-11cd8841-1491-4a39-8017-b4fe4ea0a0fe.jpg","https://sikumbang.tapera.go.id/public/upload/1665523001784-b199fb66-b52d-4e43-9659-a1333e8139aa.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e5bb875c-4f03-4497-a64c-26d7fc73b4cd',NULL,'rumah_subsidi','rumah_tapak','RAFEILLA HILLS RESIDENCE','sikumbang-bau0110132022t004','RAFEILLA HILLS RESIDENCE oleh PT RESTU SATYA ABADI (APERNAS).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 39 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 Subsidi Baru (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Bonekom (Bengkel Lia Jaya Variasi); Telp:  085241991000; Email: nobermangguali@yahoo.co.id; Web:  restupermairesidence.wordpress.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132022T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.505375861111111,122.57775113888889,'https://www.google.com/maps?q=-5.505375861111111,122.57775113888889',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1661831602827-6ae337d4-861f-40cd-85ed-530b86251482.jpg","https://sikumbang.tapera.go.id/public/upload/1661831585791-b0bba5c1-185b-4795-8d07-2afe8d934043.jpg","https://sikumbang.tapera.go.id/public/upload/1661831595229-d34c6bca-227a-404e-b772-1accf1f9f2e4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('763e581c-099f-4a05-8836-65e8d50609e1',NULL,'rumah_subsidi','rumah_tapak','CeCeria Residence III','sikumbang-bau0110132022t005','CeCeria Residence III oleh CV MELAJU JAYA (PI).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Gajah Mada; Telp: 082290115797; Email: yantijusma78@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132022T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.519605972222222,122.57094497222222,'https://www.google.com/maps?q=-5.519605972222222,122.57094497222222',156500000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1661852566005-afa337d3-e3f2-4df8-b2f1-6d470b4332b6.jpg","https://sikumbang.tapera.go.id/public/upload/1661852561555-f0d2f08f-0130-4e9d-84ae-09b7e7ef3c9d.jpg","https://sikumbang.tapera.go.id/public/upload/1661852563411-74ca5f0b-2f72-4d50-8522-aa41e8258988.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ad19bd83-dea7-475c-b5b5-83d88c26399d',NULL,'rumah_subsidi','rumah_tapak','GRAHA KARTIKA INDAH III','sikumbang-kdi0910062022t001','GRAHA KARTIKA INDAH III oleh PT MEGA INDAH PROPERTY (HIMPERRA).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 51 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 HARGA BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Gunung Merpati; Telp: 085241892724; Email: megaindahproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.950363888888889,122.49736944444444,'https://www.google.com/maps?q=-3.950363888888889,122.49736944444444',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1662305894935-8315c72c-9940-44a3-a02a-b8ef214e150b.jpg","https://sikumbang.tapera.go.id/public/upload/1662305895561-7b2aa832-e52f-4b5c-8bb3-ef218557467b.jpg","https://sikumbang.tapera.go.id/public/upload/1662305894610-0e4124c0-f99d-4239-900e-b1db9b339c57.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('90497d9e-e75e-4a38-8c29-3c1c6313fd93',NULL,'rumah_subsidi','rumah_tapak','RAPID ASRI RANOMEETO','sikumbang-adl0820192022t001','RAPID ASRI RANOMEETO oleh PT RAPID CAHAYA LAND (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. ANAWAI KEL. RANOMEETO KEC. RANOMEETO; Telp: 082111100515; Email: pt.rapidcahayaland@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820192022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.043355199722222,122.46044949972223,'https://www.google.com/maps?q=-4.043355199722222,122.46044949972223',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1662696405565-869fadaa-ee1a-4f32-8770-eea06c5a6215.jpg","https://sikumbang.tapera.go.id/public/upload/1662696402044-5625fe38-c2fe-4777-9143-cd10a8272290.jpg","https://sikumbang.tapera.go.id/public/upload/1662696404246-22680790-5777-4d5d-8cd4-ea978d879375.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f96de420-4202-47d7-ac13-401ff15ed002',NULL,'rumah_subsidi','rumah_tapak','TAPERA KENDARI TAHAP 2','sikumbang-kdi0910012022t003','TAPERA KENDARI TAHAP 2 oleh PT BAZPROPER SUKSES INDONESIA (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. D.I Pandjaitan; Telp: 082188061043; Email: bazproper15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.971916999722222,122.4655702,'https://www.google.com/maps?q=-3.971916999722222,122.4655702',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1662602132624-8b78e2a3-20e8-4368-a717-6508803b245b.jpg","https://sikumbang.tapera.go.id/public/upload/1662602140202-6af5f4e5-e29b-4ea2-9d00-c8a57c9b9554.jpg","https://sikumbang.tapera.go.id/public/upload/1662602152327-e3216756-3b81-484f-8f9f-b40fab858ede.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('182b0d65-7d3d-457f-9e5a-b2059959dbd6',NULL,'rumah_subsidi','rumah_tapak','ADHAM TAL HAFIDZ II','sikumbang-kdi0410032022t007','ADHAM TAL HAFIDZ II oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 30 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF; Telp: 081245833044; Email: Ilyasathirah4@gmail.com; Web: https://maps.app.goo.gl/FCg9ucBZg8cTFtzv6

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032022T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.021144699722222,122.55298999972221,'https://www.google.com/maps?q=-4.021144699722222,122.55298999972221',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1662801241090-34b99daa-b598-4503-b687-b554d0b90171.jpg","https://sikumbang.tapera.go.id/public/upload/1662801243722-922430b8-5218-4889-ab05-0178a9a914d8.jpg","https://sikumbang.tapera.go.id/public/upload/1662801242854-b72920a5-7e9a-43b8-9651-201ee91efd3e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e06656d8-73d8-4c52-ab88-761faf1d4098',NULL,'rumah_subsidi','rumah_tapak','GRIYA ANUGRAH WAKATOBI PERMAI','sikumbang-wgw0520122022t001','GRIYA ANUGRAH WAKATOBI PERMAI oleh ANUGRAH SARI INTI ABADI (REI).
Alamat: Komala, Kec. Wangi Wangi Selatan, Kab Wakatobi, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.
- 36 SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI HARGA BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 101 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jln. Jendral sudirman, hotel Nur Risky Lt. 1, Wangi-Wangi ; Telp: 082296888833; Email: anugrahsariintiabadi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/WGW0520122022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Wakatobi','Kab Wakatobi','Wangi Wangi Selatan','Komala','Komala, Kec. Wangi Wangi Selatan, Kab Wakatobi, Sulawesi Tenggara',NULL,-5.3335361388888884,123.56224058333333,'https://www.google.com/maps?q=-5.3335361388888884,123.56224058333333',156500000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/upload/1662445728929-d15b35a8-0ad8-4895-a15d-f5da099ab2ea.jpg","https://sikumbang.tapera.go.id/public/upload/1662445694255-92349eb6-e443-4de1-a027-addac0bb7385.jpg","https://sikumbang.tapera.go.id/public/upload/1662445710399-c38d3b34-5e5c-4aac-8027-9a1988d68818.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4a2ec28b-e1b0-424d-8931-33541d241ef5',NULL,'rumah_subsidi','rumah_tapak','RIZKY WAWOMBALATA','sikumbang-kdi0110082022t003','RIZKY WAWOMBALATA oleh PT REZEKI MERDEKA JAYA (PI).
Alamat: Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara.
Total unit: 74 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 SUBSIDI 2023 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- Subsidi 2024 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan H.Abd. Silondae (RM. Minang Jaya); Telp: 085146029087 ; Email: ptsultramerdekajaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0110082022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Mandonga','Wawombalata','Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara',NULL,-3.9427770000000004,122.51237197222223,'https://www.google.com/maps?q=-3.9427770000000004,122.51237197222223',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1661916061533-ec4903bc-8ca0-408f-adfe-bb878e9000df.jpg","https://sikumbang.tapera.go.id/public/upload/1661916062132-a44872af-ba4a-4b85-9f95-69749a3f42f2.jpg","https://sikumbang.tapera.go.id/public/upload/1661916062686-9eb63879-45c3-4102-8069-01d194e7fbad.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8016eaf3-939e-4e7c-b2f4-8bd3924b5f81',NULL,'rumah_subsidi','rumah_tapak','KING ADHAM SALEMBA','sikumbang-kdi0910032022t003','KING ADHAM SALEMBA oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://goo.gl/maps/jNzT2dfhQKWFh5zq6

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9621355,122.5022952,'https://www.google.com/maps?q=-3.9621355,122.5022952',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1660963453940-958a850f-36ec-431d-b6aa-9b880bec8490.jpg","https://sikumbang.tapera.go.id/public/upload/1660963448954-9865f18c-4bd9-4029-8489-bc905c824f5b.jpg","https://sikumbang.tapera.go.id/public/upload/1660963449963-1f1c0339-c61e-4cd1-bc4c-3c578246604f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1a4d0c64-862a-4b36-a580-32e60bdc4a76',NULL,'rumah_subsidi','rumah_tapak','SALIKA LAND BONDOALA','sikumbang-unh2110032022t001','SALIKA LAND BONDOALA oleh PT SALIKA JAYA MANDIRI (AB).
Alamat: Laosu, Kec. Bondoala, Kab Konawe, Sulawesi Tenggara.
Total unit: 14 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Poros Laosu Jaya; Telp: 08114001772; Email: Salikajayamandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH2110032022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Bondoala','Laosu','Laosu, Kec. Bondoala, Kab Konawe, Sulawesi Tenggara',NULL,-3.887495027777778,122.4614105,'https://www.google.com/maps?q=-3.887495027777778,122.4614105',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1652946747071-e1dedc94-3716-46b1-8665-9787dbad94d2.jpg","https://sikumbang.tapera.go.id/public/upload/1652946747253-bdd5b140-ce13-4eac-8c56-5866ca4d926a.jpg","https://sikumbang.tapera.go.id/public/upload/1652946747597-a64eac6f-83f9-43df-89de-d3753932c4af.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('af926f57-9c11-4eb7-bd88-2de13b174ee3',NULL,'rumah_subsidi','rumah_tapak','Perumahan Diamond Alfa II','sikumbang-kdi0310022022t003','Perumahan Diamond Alfa II oleh PT DIAMOND KONSTRUCTION INDONESIA (REI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- Subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Bahagia; Telp: 082264345250; Email: indonesiadiamond61@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.031441,122.505643,'https://www.google.com/maps?q=-4.031441,122.505643',156500000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/upload/1659327080897-d75f18e5-6a51-46ab-a346-3c170aa6e00d.jpg","https://sikumbang.tapera.go.id/public/upload/1659327068234-19754976-3b2b-4f69-a619-dade7c1d6b39.jpg","https://sikumbang.tapera.go.id/public/upload/1659327075466-71b3c4e5-a29a-465d-8657-17f7d634ec16.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('77d87754-dc49-4f9e-aeda-247e74a086f9',NULL,'rumah_subsidi','rumah_tapak','POLIMA RESIDENCE','sikumbang-kdi0310072022t005','POLIMA RESIDENCE oleh PT PUTRI SYAFIKA SEJAHTERA (HIMPERRA).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 26 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 HARGA BARU (Subsidi): Rp 173.000.000, LB 35 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Singa; Telp: 081355123257; Email: hasmarianarina2@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072022T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.024326777777778,122.47985075,'https://www.google.com/maps?q=-4.024326777777778,122.47985075',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1659073624503-5261d1cf-dce0-4031-a1b5-01550964a6bf.jpg","https://sikumbang.tapera.go.id/public/upload/1659073628911-d7800a22-82b6-41fe-b324-21213db6cb29.jpg","https://sikumbang.tapera.go.id/public/upload/1659073624318-3ecbc03e-c12e-4854-a59e-cb3c30249ff4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7514b058-a7bf-482b-92d2-ffc26eb18b4d',NULL,'rumah_subsidi','rumah_tapak','SULTRA RESIDENCE 2','sikumbang-kdi0910022022t004','SULTRA RESIDENCE 2 oleh SULTRA MULTI USAHA (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. KH AHMAD DAHLAN ; Telp: 081385198309; Email: sultramultiusaha7@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022022T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9765319722222223,122.48207852777777,'https://www.google.com/maps?q=-3.9765319722222223,122.48207852777777',156000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1660113026615-4925e630-e823-4e80-bd8c-7e1245a3c8ef.jpg","https://sikumbang.tapera.go.id/public/upload/1660113037580-3b6eb54f-925c-44a5-968c-74c561522dae.jpg","https://sikumbang.tapera.go.id/public/upload/1660113026698-66a09437-15b8-4508-bf8f-f89d1bb09266.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3910f43f-3b59-4783-9952-11509bf3e424',NULL,'rumah_subsidi','rumah_tapak','GRAND MANGKU BUMI RESIDENCE','sikumbang-kdi0910022022t005','GRAND MANGKU BUMI RESIDENCE oleh PT SWARNA DWIPA PROPERTY (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Konggoasa; Telp: 082120860799; Email: ptswarnadwipaproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022022T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9585320555555557,122.47309111111112,'https://www.google.com/maps?q=-3.9585320555555557,122.47309111111112',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1660290174628-0c5ff50a-76fc-48a5-86bf-d7c99cf1504b.jpg","https://sikumbang.tapera.go.id/public/upload/1660290170636-ecf0788f-f7cd-42c1-a2d7-c82044880efa.jpg","https://sikumbang.tapera.go.id/public/upload/1660290174667-4d515fa2-a5d3-4eb2-ac68-1ac2192bd9db.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('943c0527-dcc0-4a9c-bcb8-6f91bd31c405',NULL,'rumah_subsidi','rumah_tapak','A99 CORP LAND','sikumbang-kdi0910032022t002','A99 CORP LAND oleh PT AGFE JAYA PROPERTINDO (HIMPERRA).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 37 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Hurami ; Telp: 085145799995; Email: pt.agfejayapropertindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9611944444444447,122.48865277777777,'https://www.google.com/maps?q=-3.9611944444444447,122.48865277777777',156500000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/upload/1660274400961-162a372b-3521-494e-b485-4a9ec7860be7.jpg","https://sikumbang.tapera.go.id/public/upload/1660274417987-3f1f63f3-b369-418a-8385-c6c8607ddf6b.jpg","https://sikumbang.tapera.go.id/public/upload/1660274387545-963be895-63af-43ec-8329-0d5551f5debd.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('67fbd393-fa55-4b48-8ed1-9e3654ab38d0',NULL,'rumah_subsidi','rumah_tapak','ALSYIFA BOULEVARD','sikumbang-kdi1010022022t004','ALSYIFA BOULEVARD oleh PT ALSYIFA ALAM LESTARI (REI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 31 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 31 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. AH. NASUTION ; Telp: 082211698027; Email: alsyifaalamlestari@gmail.com; Web: 000

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022022T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.030941722222222,122.52354919444444,'https://www.google.com/maps?q=-4.030941722222222,122.52354919444444',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1661393999220-e2b375a5-05ee-4b2c-9d50-bf675ee8219c.jpg","https://sikumbang.tapera.go.id/public/upload/1661393970500-3664803f-5a53-4952-9661-8921c3e46d80.jpg","https://sikumbang.tapera.go.id/public/upload/1661393985312-b44c1d16-c1b6-4e9c-b225-c1ceaa3b79d1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8417d32c-d583-4e63-90a2-e6d6c1d42aa6',NULL,'rumah_subsidi','rumah_tapak','INULGI RESIDENCE II','sikumbang-bau0210112022t001','INULGI RESIDENCE II oleh PT WAHYU INULGI MANDIRI (HIMPERRA).
Alamat: Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 192 subsidi / 9 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 93.75 m2, 2 KT / 1 KM, 1 lantai.
- 80 (Komersil): Rp 600.000.000, LB 80 m2 / LT 126 m2, 3 KT / 2 KM, 1 lantai.
- 36 HARGA 173 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. M.H. Tamrin ; Telp: 085203756888; Email: wahyuinulgi123@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210112022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Bukit Wolio Indah','Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.472591666666667,122.6147,'https://www.google.com/maps?q=-5.472591666666667,122.6147',156500000.0,'total',FALSE,2,1,36,93.75,1,'{"https://sikumbang.tapera.go.id/public/upload/1654744426701-ea7c57e7-a84d-4500-99d4-d3da95944391.jpeg","https://sikumbang.tapera.go.id/public/upload/1654744424556-342e3524-1028-468b-add4-e6af7641c9d8.jpg","https://sikumbang.tapera.go.id/public/upload/1654744428293-4f274149-bbf8-4cc4-8f1b-aa2ad118f365.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9a29ffd6-0aa9-4b8b-8fb7-5e765893d45e',NULL,'rumah_subsidi','rumah_tapak','NUR HIDAYAT RESIDENCE','sikumbang-kdi0410052022t003','NUR HIDAYAT RESIDENCE oleh PT LINGKAR SULTRA GRUP (APERSI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36/91 SUB (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 Subsidi (Subsidi): Rp 173.000.000, LB 31 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 Subsidi New (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN Mekar puri indah ; Telp: 082188817501; Email: nurhidayatresidence@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.009166666666666,122.56055555555555,'https://www.google.com/maps?q=-4.009166666666666,122.56055555555555',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1653973548669-6d33465e-04a9-4bf7-add7-9c460c5b1764.jpg","https://sikumbang.tapera.go.id/public/upload/1653973548435-385148ed-0d52-4da8-aa29-ea53f9251c07.jpg","https://sikumbang.tapera.go.id/public/upload/1653973548543-e0cdeee1-ba31-4159-852b-9f346d053835.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7036dfd8-d2db-4c91-82a7-dd8762384a4c',NULL,'rumah_subsidi','rumah_tapak','Madinah City Square','sikumbang-kdi0310072022t003','Madinah City Square oleh PT SWARNA DWIPA PROPERTY (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 123 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. ADE IRMA II; Telp: 082120860799; Email: ptswarnadwipaproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.028527777777778,122.48617888888889,'https://www.google.com/maps?q=-4.028527777777778,122.48617888888889',156500000.0,'total',FALSE,2,1,36,92,1,'{"https://sikumbang.tapera.go.id/public/upload/1650894276404-ec2b6ccf-8f42-46ba-9f40-9967dd9e5683.jpg","https://sikumbang.tapera.go.id/public/upload/1650894277480-6338a71c-ee68-40d5-b0f1-48b072748d15.jpg","https://sikumbang.tapera.go.id/public/upload/1650894276495-0a9dd676-5417-4636-8ec1-c2f6e801d2de.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('13a2ec91-8b1d-4333-96b0-d8fb67ebaaa2',NULL,'rumah_subsidi','rumah_tapak','GREEN ANUGERAH REGENCY TAHAP 2','sikumbang-kdi0410052022t004','GREEN ANUGERAH REGENCY TAHAP 2 oleh PT PUTRA ANUGERAH PROPERTINDO (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan Green Anugerah Regency Blok C; Telp: 04013094640; Email: putraanugerahpropertindo.pt@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052022T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-3.999031388888889,122.55935472222222,'https://www.google.com/maps?q=-3.999031388888889,122.55935472222222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1649052970150-f0a63af2-b125-4eca-9dd6-ad35915427c7.jpg","https://sikumbang.tapera.go.id/public/upload/1649052971366-38b5b88a-0f1b-4aa3-99d4-55ec8b56b394.jpg","https://sikumbang.tapera.go.id/public/upload/1649052970666-f81a9bc7-cbab-4459-8821-b337e10920cc.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c9a55b7d-8e91-46ba-af78-b344c60a931b',NULL,'rumah_subsidi','rumah_tapak','AS TAMRIN RESIDENCE','sikumbang-kdi0310012022t003','AS TAMRIN RESIDENCE oleh PT KANDARINDO BUMI PERKASA (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 69 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. KS TUBUN ; Telp: 0811-409-900; Email: ritongaresidence3@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.04626,122.502366,'https://www.google.com/maps?q=-4.04626,122.502366',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1654150660742-05c72779-7d11-4d8b-956c-8dd6ee4fdb5e.jpg","https://sikumbang.tapera.go.id/public/upload/1654150657933-37aaba8f-24d0-4e16-8e9a-02d748ed1658.jpg","https://sikumbang.tapera.go.id/public/upload/1654150659384-d6fbe9ce-db88-4928-a072-c06a63df8329.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('16a57594-081b-4f8a-99a7-6cea4a0d16b3',NULL,'rumah_subsidi','rumah_tapak','KEMALA TOWN HOUSE II','sikumbang-kdi0310022022t002','KEMALA TOWN HOUSE II oleh PT BUMI ARUM LESTARI (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 35 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Brigjend Katamso ; Telp: 082398999431; Email: pt.bumiarumlestari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0327858333333335,122.51128416666667,'https://www.google.com/maps?q=-4.0327858333333335,122.51128416666667',156500000.0,'total',FALSE,2,1,35,108,1,'{"https://sikumbang.tapera.go.id/public/upload/1655263700179-c95077ba-9bec-424b-a62e-ca0cbc0e63dd.jpg","https://sikumbang.tapera.go.id/public/upload/1655263699569-3b88f5c5-12f4-4d4c-96d8-8d67dda7f25e.jpg","https://sikumbang.tapera.go.id/public/upload/1655263700413-e36f36e2-a90d-4594-b496-d8b3ee703603.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6520a571-c3c2-4be1-93b3-7d20f7591e52',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN ADE GRAHA BUMI ASRI','sikumbang-kdi0410042022t001','PERUMAHAN ADE GRAHA BUMI ASRI oleh PT ADE GRAHA ASRI (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 25 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 34.75 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 45 (Komersil): Rp 450.000.000, LB 45 m2 / LT 120 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Kayu Sintigi, Perumahan Ade Graha Bumi Asri Blok 45 A; Telp: 085254179296; Email: hiljarpurnama26@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0138631,122.55581239972221,'https://www.google.com/maps?q=-4.0138631,122.55581239972221',156000000.0,'total',FALSE,2,1,34.75,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1655182367990-eab6ffbc-316e-4f08-a9df-95f4fb17fc45.jpg","https://sikumbang.tapera.go.id/public/upload/1655182374205-b33b50d7-d253-44ff-9c47-62e27328135e.jpg","https://sikumbang.tapera.go.id/public/upload/1655182366608-2f12f585-f078-463c-9b2d-b5fb7ef285c4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('97e0ff9e-36b9-4ca1-9c71-712858e4337e',NULL,'rumah_subsidi','rumah_tapak','SAFIRA REGENCY','sikumbang-kdi0610032022t001','SAFIRA REGENCY oleh PT BONE UTAMA SULTRA (APERSI).
Alamat: Abeli, Kec. Abeli, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. R.A KARTINI; Telp: 08114031050; Email: ptboneutamasultra@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0610032022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Abeli','Abeli','Abeli, Kec. Abeli, Kota Kendari, Sulawesi Tenggara',NULL,-3.9967453,122.57822469999999,'https://www.google.com/maps?q=-3.9967453,122.57822469999999',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1655200733270-42d1563c-8380-401b-8517-67ca5b5f7eb8.jpg","https://sikumbang.tapera.go.id/public/upload/1655200673641-f1562ae5-9383-46e0-baa0-a208acd06ff5.jpg","https://sikumbang.tapera.go.id/public/upload/1655200736105-862f7056-1bfd-4f5d-a08b-7f538916ec75.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c4a2b212-a08d-4298-9ec2-713616ba62d5',NULL,'rumah_subsidi','rumah_tapak','Watuliwu Elegan Residance','sikumbang-lss0120092022t001','Watuliwu Elegan Residance oleh PT GRIYA BINTANG ELEGAN (HIMPERRA).
Alamat: Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN TPU TOJABI; Telp: 0811401970; Email: PT.GBELEGAN19@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120092022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Watuliwu','Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.498888888888889,120.89527777777778,'https://www.google.com/maps?q=-3.498888888888889,120.89527777777778',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1655514080883-36762a2a-55db-47a5-a38b-c57a9c45fa57.jpg","https://sikumbang.tapera.go.id/public/upload/1655514082793-ecd60196-fd3c-49ef-8fe6-30b4f08ca566.jpg","https://sikumbang.tapera.go.id/public/upload/1655514082402-eabea813-cc09-45b6-bde1-ebf79b8bec99.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('eec985c5-4401-4822-94dc-3296103b2e8b',NULL,'rumah_subsidi','rumah_tapak','BADEWI RESIDENCE','sikumbang-kka0410032022t001','BADEWI RESIDENCE oleh PT YUKO AMANDA KONSTRUKSI (REI).
Alamat: Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 89 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BADEWI ; Telp: 085241674114; Email: yukoamandakonstruksi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410032022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Balandete','Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.066598888888889,121.62654875,'https://www.google.com/maps?q=-4.066598888888889,121.62654875',156500000.0,'total',FALSE,2,1,36,89,1,'{"https://sikumbang.tapera.go.id/public/upload/1655731418104-a828ef1e-b4df-47da-a582-74ad140a93ff.jpg","https://sikumbang.tapera.go.id/public/upload/1655731416726-4b5d80ac-20f3-4f90-8c8c-745a8f8c9522.jpg","https://sikumbang.tapera.go.id/public/upload/1655731418844-3567372f-9696-40be-927a-32af59209555.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d38ae831-1774-4d94-9417-a6d4ffd816cc',NULL,'rumah_subsidi','rumah_tapak','KHAZANAH ELEGAN WATULIWU','sikumbang-lss0120072022t001','KHAZANAH ELEGAN WATULIWU oleh PT GRIYA BINTANG ELEGAN (HIMPERRA).
Alamat: Tojabi, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN TPU TOJABI; Telp: 0811401970; Email: PT.GBELEGAN19@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120072022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Tojabi','Tojabi, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.507222222222222,120.89416666666668,'https://www.google.com/maps?q=-3.507222222222222,120.89416666666668',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1655782027587-56422d64-5790-4482-9109-c23f6fe7209a.jpg","https://sikumbang.tapera.go.id/public/upload/1655781996828-14e446dd-fc8e-4a41-900f-06493545fcac.jpg","https://sikumbang.tapera.go.id/public/upload/1655782011296-31098e0a-2ebc-436b-913b-f2fad97aee04.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('78f277f1-f52e-4749-825a-f3419b98e0a8',NULL,'rumah_subsidi','rumah_tapak','BUMI PRAJA RESIDENCE 3','sikumbang-kdi0410032022t004','BUMI PRAJA RESIDENCE 3 oleh PT HARWIN JAYA BAROKAH PROPERTY (HIMPERRA).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Lampareng II, Kompleks Perumahan Bumi Praja Residence, RT. 01 RW. 01 ; Telp: 085398786061; Email: jayaharwin@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032022T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.032396777777778,122.55052947222222,'https://www.google.com/maps?q=-4.032396777777778,122.55052947222222',156500000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1655979144819-b47f28f3-a0a0-49b4-8a2d-9892e1241899.jpg","https://sikumbang.tapera.go.id/public/upload/1655979151421-7fda7555-4cc7-4a22-9619-5daa16db61a4.jpg","https://sikumbang.tapera.go.id/public/upload/1655979153226-2519078e-2651-4e7a-9171-b3105861d641.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e5b3cc6b-4c72-4854-9672-bb9e4f2ca0f1',NULL,'rumah_subsidi','rumah_tapak','Mawar Saron 2','sikumbang-adl0820172022t001','Mawar Saron 2 oleh PT MAWAR SARON SUSANTA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 24 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 95 m2, 1 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: Desa Kota Bangun, Kecamatan Ranomeeto, Kabupaten Konawe Selatan ; Telp: 082292044649; Email: mawarsaronsusanta@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.042836972222222,122.46778297222222,'https://www.google.com/maps?q=-4.042836972222222,122.46778297222222',156500000.0,'total',FALSE,1,2,36,95,1,'{"https://sikumbang.tapera.go.id/public/upload/1655958403708-9a0bb05f-ff03-40d8-8d74-4399418210be.jpg","https://sikumbang.tapera.go.id/public/upload/1655958406439-2dbe3da0-0e37-4e8a-b105-f701b87894dd.jpg","https://sikumbang.tapera.go.id/public/upload/1655958404727-afba2c02-722e-4176-aeab-317893263d22.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e7c7ec78-e43e-4918-aef9-b9d745fc231b',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN ALFA ANDROMEDA HILLS','sikumbang-kdi1010022022t002','PERUMAHAN ALFA ANDROMEDA HILLS oleh PT ALFA FAJAR RAYA (REI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.
- 36 (SUBSISIDI) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 111 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. KH Ahmad Dahlan; Telp: 081385198309; Email: ptalfafajarraya86@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.048576805555555,122.55585477777778,'https://www.google.com/maps?q=-4.048576805555555,122.55585477777778',156000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/1656313256950-85d3ceee-7093-4a20-b72a-254dff51df78.jpg","https://sikumbang.tapera.go.id/public/upload/1656313301848-3c61e66d-9ee3-4426-87a0-497e0b9bb929.jpg","https://sikumbang.tapera.go.id/public/upload/1656313286857-a26deee8-bcf6-4a6c-8eca-a7c5fcc46548.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('66285a7a-e656-48c9-acb3-941414dd5578',NULL,'rumah_subsidi','rumah_tapak','GERBANG KHATULISTIWA','sikumbang-kdi1010022022t003','GERBANG KHATULISTIWA oleh PT GETRACO TIMUR PERSADA (REI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 88 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Grand Boulevard Regency Blok A; Telp: 085242016538; Email: getracotimurpersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.037961944444445,122.53526305555556,'https://www.google.com/maps?q=-4.037961944444445,122.53526305555556',156500000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/upload/1657005507088-41a255dc-a54c-4ddf-a454-540dbe24a206.jpg","https://sikumbang.tapera.go.id/public/upload/1657005532179-5f368c9b-4a95-45a8-83f2-c4dd58919711.jpg","https://sikumbang.tapera.go.id/public/upload/1657005531074-3f282313-a643-4ebf-955c-9a1995202f02.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f45b4b0d-eb42-4eed-9a7e-3045c4c47b51',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE 9','sikumbang-kdi0310072022t004','PRADANA RESIDENCE 9 oleh PT ZENK NAWANK KENJEL (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN AHMAD YANI ; Telp: 082231810164; Email: inhadafa15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072022T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.024680555555555,122.48664722222222,'https://www.google.com/maps?q=-4.024680555555555,122.48664722222222',156000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1658985677934-75486bfe-9587-4221-891e-fd61b54f3d48.jpg","https://sikumbang.tapera.go.id/public/upload/1658985672087-6f0a1c30-8044-4d44-b140-218dbedf579a.jpg","https://sikumbang.tapera.go.id/public/upload/1658985672744-e7033e7f-05a8-4405-b6df-44cb3dea0a7b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0f333a39-544c-44e7-ad7b-b76a9819867b',NULL,'rumah_subsidi','rumah_tapak','Al-Dzakiy Residence','sikumbang-kdi0410032022t005','Al-Dzakiy Residence oleh PT ALDZAKIY JAYA SULTRA (APERSI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36/105 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.
- 36/104 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36/104 baru (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN AHMAD YANI BELAKANG BTN III; Telp: 085242467819; Email: kahar_uvri@yahoo.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032022T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0270751,122.55484819972222,'https://www.google.com/maps?q=-4.0270751,122.55484819972222',156500000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/upload/1658025171975-414a22a9-2e8f-46b1-9b3f-83d66911b625.jpg","https://sikumbang.tapera.go.id/public/upload/1658025187045-a48cd587-f5b1-4e4d-9e9f-d284abae5d1f.jpg","https://sikumbang.tapera.go.id/public/upload/1658025183599-ed5d7392-0a92-40a0-908b-cc9c4579290e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6a823b10-0a02-44dc-91d1-4a47d52ec009',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE X','sikumbang-kdi0910022022t002','PRADANA RESIDENCE X oleh PT RIZKY AZKA KONSTRUKSI (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. AHMAD YANI ; Telp: 082231810164; Email: inhadafa15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9647,122.47565555555556,'https://www.google.com/maps?q=-3.9647,122.47565555555556',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1647529049779-9a63e7c3-f9fd-4843-803c-ae7788353608.jpeg","https://sikumbang.tapera.go.id/public/upload/1647529042814-75e3dd69-6f05-40b7-90d2-87e4f98694c4.jpeg","https://sikumbang.tapera.go.id/public/upload/1647529047668-a93fbbed-0721-47e3-a5df-79847bfadbd9.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('33937dc8-9269-499b-96d8-abfd796684bd',NULL,'properti_developer','rumah_tapak','GREEN ANGGOEYA RESORT','sikumbang-kdi0410052022t001','GREEN ANGGOEYA RESORT oleh PT GRAHA AGUNG PERMATA (HIMPERRA).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 147 komersil.

Tipe rumah:
- LIMBOTO 45 (Komersil): Rp 342.000.000, LB 45 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.
- TOWUTI 38 (Komersil): Rp 263.000.000, LB 38 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.
- LINOUW 77 (Komersil): Rp 388.000.000, LB 77 m2 / LT 90 m2, 4 KT / 3 KM, 2 lantai.
- LINOUW 66 (Komersil): Rp 361.000.000, LB 66 m2 / LT 90 m2, 3 KT / 2 KM, 2 lantai.
- TONDANO 115 (Komersil): Rp 570.000.000, LB 115 m2 / LT 128 m2, 4 KT / 3 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.H.Banawula Sinapoy Ruko Green Anggoeya Resort Blok A No.5 RT.016 RW.006 Kelurahan Anggoeya Kec.Poasia Kota Kendari; Telp: 08114095598; Email: resortanggoeya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-3.9900694444444444,122.56350277777777,'https://www.google.com/maps?q=-3.9900694444444444,122.56350277777777',263000000.0,'total',FALSE,2,1,38,90,1,'{"https://sikumbang.tapera.go.id/public/upload/1629952080153-61046417-5f15-4745-9660-2112badb7380.jpg","https://sikumbang.tapera.go.id/public/upload/1629952081213-773a8f85-0070-49bb-8147-8274333265e6.jpg","https://sikumbang.tapera.go.id/public/upload/1629952080797-a902da11-e41e-44b4-a7ab-fd94ea284442.jpg"}','{}',NULL,TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('93749166-65b8-4b87-9f42-4a96152f8410',NULL,'rumah_subsidi','rumah_tapak','CITRA ASRI WAWOMBALATA II','sikumbang-kdi0110082022t002','CITRA ASRI WAWOMBALATA II oleh RIZKY HIDAYAT (HIMPERRA).
Alamat: Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara.
Total unit: 36 subsidi / 0 komersil.

Tipe rumah:
- 36 HARGA BARU (Subsidi): Rp 168.000.000, LB 36 m2 / LT 120 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 120 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Imam Bonjol; Telp: 085285802266; Email: yhidayat209@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0110082022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Mandonga','Wawombalata','Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara',NULL,-3.942572138888889,122.51209258333333,'https://www.google.com/maps?q=-3.942572138888889,122.51209258333333',156500000.0,'total',FALSE,2,1,36,120,1,'{"https://sikumbang.tapera.go.id/public/upload/1649388367465-1da33bfb-79ac-41c0-ab69-ae0d123e6730.jpg","https://sikumbang.tapera.go.id/public/upload/1649388368148-5fb451a1-6061-412c-8322-1f9cc35dbdff.jpg","https://sikumbang.tapera.go.id/public/upload/1649388368250-110284e8-643d-494e-917c-377817281a39.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('505592a4-08f2-425f-a579-641eaf94a92d',NULL,'rumah_subsidi','rumah_tapak','MARGAHAYU REGENCY KAMBU III','sikumbang-kdi1010022022t001','MARGAHAYU REGENCY KAMBU III oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 42 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SUPU YUSUF { ODIXY CAFE } ; Telp: 0811405887; Email: margahayu_megautama@yahoo.co.id; Web: www.m2uproperti.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.03618095,122.54082008055555,'https://www.google.com/maps?q=-4.03618095,122.54082008055555',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1649305555117-f75cd771-6157-4c5f-91e8-df4b16d5e4e6.jpg","https://sikumbang.tapera.go.id/public/upload/1649305554670-c37a5753-0895-473f-beed-c3a830e4dacc.jpg","https://sikumbang.tapera.go.id/public/upload/1649305555118-9a8da007-72e3-44e9-a44b-d95a246a829f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e9b2bccf-673a-4e1c-bb9b-7f750f79a95e',NULL,'properti_developer','rumah_tapak','GRAHA REKSA KENCANA TAHAP 2','sikumbang-kdi0410032022t002','GRAHA REKSA KENCANA TAHAP 2 oleh PT DHANA JAYA PROPERTI (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 45 (Komersil): Rp 230.000.000, LB 45 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN GRAHA REKSA BLOK B; Telp: 082352623961; Email: pt.djp2013.kendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.037436111111111,122.55461111111111,'https://www.google.com/maps?q=-4.037436111111111,122.55461111111111',230000000.0,'total',FALSE,2,1,45,112,1,'{"https://sikumbang.tapera.go.id/public/upload/1649397934566-f6976142-e26a-4e46-ab7c-9f24a6ae21be.jpg","https://sikumbang.tapera.go.id/public/upload/1649397935888-1746eb72-1c8d-4450-92f5-89a47aa803f3.jpg","https://sikumbang.tapera.go.id/public/upload/1649397935515-202dfccc-490a-4bb3-a127-08d000d993c9.jpg"}','{}',NULL,TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bfa578d7-77fb-4be9-aa77-2cb2b85e7509',NULL,'rumah_subsidi','rumah_tapak','GRAHA REKSA KENCANA TAHAP 6','sikumbang-kdi0410032022t001','GRAHA REKSA KENCANA TAHAP 6 oleh PT DHANA JAYA PROPERTI (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN GRAHA REKSA KENCANA ; Telp: 082352623961; Email: pt.djp2013.kendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.040277777777778,122.55801388888888,'https://www.google.com/maps?q=-4.040277777777778,122.55801388888888',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1649323021372-315f9e99-2972-48d8-8dae-2654a7de64f5.jpg","https://sikumbang.tapera.go.id/public/upload/1649323022329-ca1febd5-04ae-44c4-b795-65fdfd99fe1e.jpg","https://sikumbang.tapera.go.id/public/upload/1649323021386-dc354cb7-9ad2-4a4f-baa3-28bac0b84964.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('90217a8e-8b94-403b-8073-e13e86d01381',NULL,'rumah_subsidi','rumah_tapak','RAFA RESIDENCE II','sikumbang-kdi0110082022t001','RAFA RESIDENCE II oleh RAFA BANGUN PROPERTI (HIMPERRA).
Alamat: Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara.
Total unit: 16 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 HARGA BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. IMAM BONJOL; Telp: 082187466125; Email: rafa.bangunproperti@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0110082022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Mandonga','Wawombalata','Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara',NULL,-3.943055555555556,122.50972222222222,'https://www.google.com/maps?q=-3.943055555555556,122.50972222222222',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1649490619667-ddb49c63-057a-4664-a871-f16c96a3ec65.jpg","https://sikumbang.tapera.go.id/public/upload/1649490620336-f8a49625-a66a-4233-a9c8-974c35be9cf6.jpg","https://sikumbang.tapera.go.id/public/upload/1649490619534-cc0fea59-ea28-4614-a802-7cf56f38eba1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('55355d31-60ec-4a9f-a6c7-5d798f8b74fc',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE IX','sikumbang-kdi0310072022t002','PRADANA RESIDENCE IX oleh PT ZENK NAWANK KENJEL (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 15 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL DI PANJAITAN; Telp: 085333450106; Email: pt.zenknawankkenjel.888@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.022655277777778,122.48735500000001,'https://www.google.com/maps?q=-4.022655277777778,122.48735500000001',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1649762951676-c6f626d9-9d2f-4cb4-9c6a-c04c6236378f.jpg","https://sikumbang.tapera.go.id/public/upload/1649762951718-a0e29571-566a-4c5d-9a77-80d4638ecade.jpg","https://sikumbang.tapera.go.id/public/upload/1649762951637-7494bb48-8db1-4a70-8a52-de6633193ff6.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE)
) AS v(id,seller_id,category,property_type,title,slug,description,province,city,regency_name,district,subdistrict_name,address_detail,postal_code,latitude,longitude,maps_link,price,price_type,is_negotiable,bedrooms,bathrooms,building_area_sqm,land_area_sqm,floors,images,amenities,subsidy_program,can_kpr,certificate_type,condition,status,is_admin_verified,is_featured,views_count,favorites_count,inquiries_count,published_at,ai_generated)
WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.slug = v.slug);


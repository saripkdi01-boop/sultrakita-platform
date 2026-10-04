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
('ce95f9d4-b7e6-4018-8e3b-73d58082cb4a',NULL,'rumah_subsidi','rumah_tapak','JR Anggopiu Residence I','sikumbang-unh1820112021t001','JR Anggopiu Residence I oleh PT JERRY CHANDRA PERKASA (REI).
Alamat: Anggopiu, Kec. Uepai, Kab Konawe, Sulawesi Tenggara.
Total unit: 14 subsidi / 0 komersil.

Tipe rumah:
- 36/104 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: DESA ANGGOPIU KECAMATAN UEPAI KABUPATEN KONAWE; Telp: 081285309526; Email: hendralasahari20286@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH1820112021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Uepai','Anggopiu','Anggopiu, Kec. Uepai, Kab Konawe, Sulawesi Tenggara',NULL,-3.880737972222222,122.04018497222222,'https://www.google.com/maps?q=-3.880737972222222,122.04018497222222',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1614591257565-15139.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1614591257558-15139.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1614591257562-15139.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a32245f3-9c38-44c7-97df-e86bd87fe224',NULL,'rumah_subsidi','rumah_tapak','BUKIT MADANI PERMAI','sikumbang-kdi0410032021t003','BUKIT MADANI PERMAI oleh PT KARIMUN BERKAH MANDIRI (HIMPERRA).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 HARGA BARU (Subsidi): Rp 168.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 HARGA BARU 2025 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Martandu Ruko Pelangi; Telp: 08525633721; Email: karimun.berkahmandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.027501666666667,122.55102333333333,'https://www.google.com/maps?q=-4.027501666666667,122.55102333333333',156500000.0,'total',FALSE,2,1,36,97.5,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1627874282937-15113.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1627874267815-15113.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1627874304796-15113.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3992b67e-5fd6-4952-ad03-8e053be7c8d1',NULL,'rumah_subsidi','rumah_tapak','BUMI ROYAL IZTHIN SHIFA 2','sikumbang-kdi0910062021t001','BUMI ROYAL IZTHIN SHIFA 2 oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 96 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://www.google.com/maps/place/BTN+Bumi+Royal+Isthin+Shifa/@-3.948502,122.4956172,15z/data=!4m5!3m4!1s0x0:0xf32259e4c8eeb7ab!8m2!3d-3.948502!4d122.4956172

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9486111111111115,122.49666666666667,'https://www.google.com/maps?q=-3.9486111111111115,122.49666666666667',156500000.0,'total',FALSE,2,1,36,92,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1613533688589-14944.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1613533688599-14944.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1613533688584-14944.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('750ba0b8-bb7d-4b89-a68d-553720518536',NULL,'rumah_subsidi','rumah_tapak','NAINAWA RESIDENCE','sikumbang-swg0120052021t001','NAINAWA RESIDENCE oleh DAYA HASIL BERSAMA (APERNAS).
Alamat: Nihi, Kec. Sawerigadi, Kab Muna Barat, Sulawesi Tenggara.
Total unit: 11 subsidi / 10 komersil.

Tipe rumah:
- NAINAWA (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- NAINAWA 1 (Komersil): Rp 175.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan Nainawa Residence Jalan Poros Nihi Blok B1; Telp: 082347343434; Email: pt.daya.hasilbersama@hotmail.com; Web: https://sikumbang.tapera.go.id/lokasi-perumahan/SWG0120052021T001

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/SWG0120052021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Muna Barat','Kab Muna Barat','Sawerigadi','Nihi','Nihi, Kec. Sawerigadi, Kab Muna Barat, Sulawesi Tenggara',NULL,-4.785856111111111,122.52412472222223,'https://www.google.com/maps?q=-4.785856111111111,122.52412472222223',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1613015279281.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1613015279289.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1613015279273.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('20be82e0-70b7-41af-bc18-785e965bdef2',NULL,'rumah_subsidi','rumah_tapak','Griya Sapta ','sikumbang-unh0210062021t002','Griya Sapta  oleh SAKHA PUTRA MANDIRI (ASPRUMNAS).
Alamat: Asinua, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 127 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. Anoa ; Telp: 08114042315; Email: 5akha.milano81@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210062021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Asinua','Asinua, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,-3.851821,122.05886699999999,'https://www.google.com/maps?q=-3.851821,122.05886699999999',156500000.0,'total',FALSE,2,1,36,127,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1588041743287-11554.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1588041741328-11554.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1588041745724-11554.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a3f6a7df-9537-470c-bf34-a0db2595e9b1',NULL,'rumah_subsidi','rumah_tapak','GRIYA CEKO TUNGGALA 2','sikumbang-kdi0710042021t004','GRIYA CEKO TUNGGALA 2 oleh PT CEKO SEGAR WANGI (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL CENDANA; Telp: 082194157692; Email: cekosegarwangi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042021T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.998888888888889,122.47805555555556,'https://www.google.com/maps?q=-3.998888888888889,122.47805555555556',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1613440340057-14910.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1619158293318-14910.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1613440340061-14910.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3f5d5887-ace7-480e-a7fc-dfdf8b7d11cc',NULL,'rumah_subsidi','rumah_tapak','PRATAMA KING ADHAM','sikumbang-kdi0410052021t001','PRATAMA KING ADHAM oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://www.google.com/maps?q=PRATAMA+KING+ADHAM&um=1&ie=UTF-8&sa=X&ved=2ahUKEwi0rr7AqO7uAhWX63MBHQH1CJEQ_AUoAXoECAoQAw

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.023299399722222,122.56058509972222,'https://www.google.com/maps?q=-4.023299399722222,122.56058509972222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1613474854690-14937.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1613474854694-14937.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1613474854686-14937.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('198aa1d9-eb0e-4c65-b8cc-a386a5fff0e5',NULL,'rumah_subsidi','rumah_tapak','MUTIARA ATHIRA BARUGA','sikumbang-kdi0310012021t001','MUTIARA ATHIRA BARUGA oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SYECH YUSUF; Telp: 081245833044  082293198772; Email: Ilyasathirah4@gmail.com; Web: https://www.google.com/maps/uv?pb=!1s0x2d988d1ead2194cb%3A0x439ed6ecff9b2148!3m1!7e115!4shttps%3A%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipN-KmQV02qVlhdQj2czf6mMbCu2xmqqETDqWbn1%3Dw284-h160-k-no!5sMUTIARA%20ATHIRA%20BARUGA%20MAPS%20-%20Penelusuran%20Google!15sCgIgAQ&imagekey=!1e10!2sAF1QipN-KmQV02qVlhdQj2czf6mMbCu2xmqqETDqWbn1&hl=id&sa=X&ved=2ahUKEwj_0fyBuu7uAhUCgUsFHXqSDkoQoiowE3oECCIQAw

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0423748999999995,122.49987799972223,'https://www.google.com/maps?q=-4.0423748999999995,122.49987799972223',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1613483657602.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1613483657594.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1613483657606.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('88fbbf7e-a490-4c31-83e6-175e428a47e8',NULL,'rumah_subsidi','rumah_tapak','PESONA KING ADHAM RESIDENCE','sikumbang-kdi0910022021t001','PESONA KING ADHAM RESIDENCE oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 15 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF; Telp: 081245833044  - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://www.google.com/maps/place/Pesona+King+Adham+Residence/@-3.97689,122.478041,15z/data=!4m2!3m1!1s0x0:0x1aeb8df6039710d8?sa=X&ved=2ahUKEwjq8J_qofDuAhWhILcAHaIBDDUQ_BIwE3oECBwQBQ

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9776346,122.4779335,'https://www.google.com/maps?q=-3.9776346,122.4779335',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1613542180330-14950.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1613542180333-14950.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1613542180327-14950.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e8205ddb-5701-4eee-8de1-a0d596019d55',NULL,'rumah_subsidi','rumah_tapak','ADHAM TAL HAFIDZ ','sikumbang-kdi0410032021t002','ADHAM TAL HAFIDZ  oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://goo.gl/maps/o7sHkfABAYCfNmyG6

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.022472999722222,122.55182519972222,'https://www.google.com/maps?q=-4.022472999722222,122.55182519972222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1613554802878-14959.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1613554802874-14959.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1613554802882-14959.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('68259ba0-511b-4f0d-8364-7385d81af89b',NULL,'rumah_subsidi','rumah_tapak','PILAR KING ADHAM','sikumbang-kdi0910032021t002','PILAR KING ADHAM oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SYECH YUSUF; Telp: 081245833044 - 082293198772; Email: Ilyasathirah4@gmail.com; Web: https://maps.app.goo.gl/jWVuGUDywPZNtfVa6

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.969951299722222,122.48851659972222,'https://www.google.com/maps?q=-3.969951299722222,122.48851659972222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1613650586325-14984.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1613650586333-14984.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1613650586327-14984.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1a426689-b0ae-46af-ada0-8ef40fdf0409',NULL,'rumah_subsidi','rumah_tapak','CITRA LATAMBAGA INDAH 2','sikumbang-kka1410012021t001','CITRA LATAMBAGA INDAH 2 oleh PT GELORA FIRNAGRAHA REALTYTANIA (REI).
Alamat: Mangolo, Kec. Latambaga, Kab Kolaka, Sulawesi Tenggara.
Total unit: 37 subsidi / 0 komersil.

Tipe rumah:
- 34/100 (Subsidi): Rp 156.500.000, LB 34.5 m2 / LT 101 m2, 2 KT / 1 KM, 1 lantai.
- 36/100 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 101 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. CAKALANG ; Telp: 085399111130; Email: citralatambaga@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1410012021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Latambaga','Mangolo','Mangolo, Kec. Latambaga, Kab Kolaka, Sulawesi Tenggara',NULL,-4.036147222222222,121.55738055555555,'https://www.google.com/maps?q=-4.036147222222222,121.55738055555555',156500000.0,'total',FALSE,2,1,34.5,101,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1611660832567-14590.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1611660825570-14590.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1611660838571-14590.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d427217a-b744-438d-9fb1-e0f0c2c151e1',NULL,'rumah_subsidi','rumah_tapak','LARA REGENCY','sikumbang-trw0120072021t001','LARA REGENCY oleh BANUA BAKKARANG DEVELOPMENT (HIMPERRA).
Alamat: Lara, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 22 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 135 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Poros Lara - Peatoa Perum. Lara Regency ; Telp: 085215569802; Email: ptbbdkoltim@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120072021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Lara','Lara, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.049606666666667,121.92216666666667,'https://www.google.com/maps?q=-4.049606666666667,121.92216666666667',156500000.0,'total',FALSE,2,1,36,135,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1611222179460-14524.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1611222176257-14524.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1611222185535-14524.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('967ca585-49e8-430e-985f-bfdd04497480',NULL,'rumah_subsidi','rumah_tapak','CITRA TABABU INDA ( CTI )','sikumbang-trw0110162021t001','CITRA TABABU INDA ( CTI ) oleh PT VIRERA JAYA INDONESIA (REI).
Alamat: Tababu, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln.poros kolaka-kendari,Kel.Rate-rate,Kec.Tirawuta,Kab.kolaka Timur.; Telp: +62 822-6403-6834; Email: rydhorahman@gmail.com; Web: virerajayaindonesia.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0110162021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Tababu','Tababu, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.0500454999999995,121.8913713888889,'https://www.google.com/maps?q=-4.0500454999999995,121.8913713888889',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1610607341812-14420.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1705468482192-14420.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1610607345080-14420.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0bc16b97-d249-4265-bcee-400c621f39c3',NULL,'rumah_subsidi','rumah_tapak','Ratu Permai Residence 2','sikumbang-bau0110142021t001','Ratu Permai Residence 2 oleh CV RATU PERMAI (ASPERI).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 59 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- T36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 1 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LIMBO WOLIO; Telp: 081242946579; Email: cv.ratupermai@yahoo.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.499282805555556,122.5805758611111,'https://www.google.com/maps?q=-5.499282805555556,122.5805758611111',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1612346709450-14722.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1612346709447-14722.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1612346709453-14722.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fc838828-bc87-4149-9d8d-8e3e48250705',NULL,'rumah_subsidi','rumah_tapak','HOMBIS RESIDENCE','sikumbang-kdi0310072021t004','HOMBIS RESIDENCE oleh PT PERMATA BERKAH KENDARI (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 Subsisdi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kapten. Pierre Tendean; Telp: 082394478887; Email: permataberkah.kdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072021T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.023867,122.489934,'https://www.google.com/maps?q=-4.023867,122.489934',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1612246369244-14684.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1612246369245-14684.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1612246369243-14684.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ea7ed1ee-386b-46bd-a881-fc23b4935557',NULL,'rumah_subsidi','rumah_tapak','Griya Raffasya Anawai','sikumbang-kdi0710042021t002','Griya Raffasya Anawai oleh PT MAHA KARYA HALUOLEO (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL, BUBURANDA KELURHAN KORUMBA KECAMATAN MANDONGA KOTA KENDARI; Telp: 085246391692; Email: Adrian_fadly@ymail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.0079419722222225,122.487052,'https://www.google.com/maps?q=-4.0079419722222225,122.487052',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1612427542635.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1612427542636.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1612427542634.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('21c9b00a-20ad-4d22-bf32-c2a523f7858c',NULL,'rumah_subsidi','rumah_tapak','Griya Mulya Tunggala','sikumbang-kdi0710012021t002','Griya Mulya Tunggala oleh PT MULYA NARA JANITRA (APERSI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36/96 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. DI Panjaitan No. 16, Wundudopi, Baruga, Kota Kendari, Sulawesi Tenggara; Telp: 082290156542; Email: busines.mulyanarajanitra@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.9991666666666665,122.47944444444444,'https://www.google.com/maps?q=-3.9991666666666665,122.47944444444444',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1612338878323-14716.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1612338878309-14716.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1612338878289-14716.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('adcb1699-7351-425a-aa17-6e335e676292',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE IV','sikumbang-kdi0710042021t003','PRADANA RESIDENCE IV oleh PT RIZKY AZKA KONSTRUKSI (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BRIDJEN KATAMSO; Telp: 0853-7776-4209; Email: pt.zenknawankkenjel.888@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.003057833333333,122.48798438888889,'https://www.google.com/maps?q=-4.003057833333333,122.48798438888889',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1612508290521-14765.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1612508290520-14765.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1612508290523-14765.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7afc9628-4514-47f3-829f-03e2a3a73644',NULL,'rumah_subsidi','rumah_tapak','Puri khanissa residence II','sikumbang-kka0120082021t001','Puri khanissa residence II oleh PT KHAILAH BERKAH JAYA (PI).
Alamat: Unamendaa, Kec. Wundulako, Kab Kolaka, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 94 m2, 2 KT / 1 KM, 1 lantai.
- 36 Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl. Poros Kolaka-Pomalaa; Telp: 082311570457; Email: pt.khalahberkahjayakdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0120082021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Wundulako','Unamendaa','Unamendaa, Kec. Wundulako, Kab Kolaka, Sulawesi Tenggara',NULL,-4.131116,121.67465100000001,'https://www.google.com/maps?q=-4.131116,121.67465100000001',173000000.0,'total',FALSE,2,1,36,94,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/06/25/fotoContoh-c7481e25-f958-4844-aa99-bdd500210d06.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/06/25/fotoGerbang--12238eb1-aa39-4680-bb09-a8ca360759d0.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/06/25/fotoTengah-73fee6bb-061a-42c0-95b9-16efb0ebda13.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('63d52c17-ce2d-4c81-9b6e-261297e03aad',NULL,'rumah_subsidi','rumah_tapak','GRIYA HUSADA PERMAI','sikumbang-unh0210062021t001','GRIYA HUSADA PERMAI oleh PT PUNGGAWA SAPTA KENCANA (AB).
Alamat: Asinua, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ponggawa ; Telp: 085254266769; Email: punggawasaptakencana@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210062021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Asinua','Asinua, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,-3.8555555555555556,122.06444444444445,'https://www.google.com/maps?q=-3.8555555555555556,122.06444444444445',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580181452824.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580181448032.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580181462291.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('40d126b2-e46c-408b-befa-c6e8d43a0f34',NULL,'rumah_subsidi','rumah_tapak','ANGGOEYA REGENCY','sikumbang-kdi0410052020t012','ANGGOEYA REGENCY oleh PT DHANA JAYA PROPERTI (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. HALUOLEO BTN GRAHA REKSA KENCANA; Telp: 08114097980; Email: pt.djp2013.kendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052020T012 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.010173055555556,122.56074483333333,'https://www.google.com/maps?q=-4.010173055555556,122.56074483333333',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1608619876626-14289.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1608619844677-14289.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1608619902820-14289.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('307a9ec9-735d-48e6-ab7d-b0451f165a8a',NULL,'rumah_subsidi','rumah_tapak','PERMATA RESIDENCE 4','sikumbang-adl0810012020t008','PERMATA RESIDENCE 4 oleh PT PERMATA TIRTA JAYA (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI 36 TAPAK (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Melati Desa Kota Bangun Kecamatan Ranomeeto Kabupaten Konawe Selatan; Telp: 081245661819; Email: permata.residence@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012020T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.045538888888888,122.46141027777779,'https://www.google.com/maps?q=-4.045538888888888,122.46141027777779',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1604110335220-13887.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1604110263874-13887.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1604110363561-13887.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('efe2649d-378f-4c5b-99dd-c0a63d6fc8a2',NULL,'rumah_subsidi','rumah_tapak','Bahtera Permai','sikumbang-kdi0310072021t001','Bahtera Permai oleh PT PT. PUTRA MUBARAT PROPERTI (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 26 subsidi / 3 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 55 (Komersil): Rp 350.000.000, LB 72 m2 / LT 117 m2, 3 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ade Irma Nasution; Telp: 082188704949; Email: ptputramubaratproperti0@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.034523472222222,122.49077069444445,'https://www.google.com/maps?q=-4.034523472222222,122.49077069444445',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1606813158100-14201.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1765966489240-14201.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1606813159604-14201.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fbdbd287-40ed-4049-a54c-e53aef8ae060',NULL,'rumah_subsidi','rumah_tapak','PRADANA REGENCY','sikumbang-kdi0910032021t001','PRADANA REGENCY oleh PT ZENK NAWANK KENJEL (REI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BRIDJEN KATAMSO; Telp: 0853-7776-4209; Email: pt.zenknawankkenjel.888@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.966111111111111,122.5,'https://www.google.com/maps?q=-3.966111111111111,122.5',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1610604756419-14418.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1610604755427-14418.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1610604757374-14418.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7b14a759-341d-4055-8cd9-73e44e73994d',NULL,'rumah_subsidi','rumah_tapak','MARGAHAYU REGENCY KAMBU','sikumbang-kdi1010022021t001','MARGAHAYU REGENCY KAMBU oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 53 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF { ODIXY CAFE LT3 }; Telp: 0811405887; Email: margahayu_megautama@yahoo.co.id; Web: www.m2uproperti.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.033333333333333,122.54194444444444,'https://www.google.com/maps?q=-4.033333333333333,122.54194444444444',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1610980124224-14466.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1610980083212-14466.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1610980162567-14466.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4686dc8b-39f5-46aa-b889-a6d8fbf8f3ae',NULL,'rumah_subsidi','rumah_tapak','Azalia Perdana Abeli','sikumbang-kdi0610032021t001','Azalia Perdana Abeli oleh PT AZALIA ZAKI RESIDENS (REI).
Alamat: Abeli, Kec. Abeli, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Abeli; Telp: 08114092101; Email: pt.azalizakiresidence@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0610032021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Abeli','Abeli','Abeli, Kec. Abeli, Kota Kendari, Sulawesi Tenggara',NULL,-3.9963888888888888,122.58361111111111,'https://www.google.com/maps?q=-3.9963888888888888,122.58361111111111',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1610958139183-14300.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1610958135423-14300.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1610958142861-14300.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('36c5589d-7fb9-4626-a372-cdad7deb7085',NULL,'rumah_subsidi','rumah_tapak','Sinar regency','sikumbang-kdi0410042021t001','Sinar regency oleh FNUR GROUP PROPERTY (PI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan kijang, PERUMAHAN SINAR REGENCY
; Telp: 082197272233; Email: ptfnurgroupproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.010455833333333,122.549735,'https://www.google.com/maps?q=-4.010455833333333,122.549735',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1613535136837-14503.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1613535150581-14503.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1613535120496-14503.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('50cbfcb4-598c-4453-ad94-66da2a55241a',NULL,'rumah_subsidi','rumah_tapak','SPP Ranomeeto Regency VI','sikumbang-adl0820172021t002','SPP Ranomeeto Regency VI oleh PT SAQI PUTRA PRATAMA (HIMPERRA).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 35 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Made sabhara kota kendari; Telp: 08114154073; Email: sppwilayah@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.047777777777777,122.47416666666666,'https://www.google.com/maps?q=-4.047777777777777,122.47416666666666',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1591600358507-11886.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1591600356875-11886.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1591600359339-11886.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('71dc7ce3-9cd1-4851-8f53-3ce81bde5cf2',NULL,'rumah_subsidi','rumah_tapak','PUUWATU RESINDENCE','sikumbang-kdi0910012021t001','PUUWATU RESINDENCE oleh PT GINI MEGA TAMA INDAH (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36/96 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. DI PANJAITAN NO. 259; Telp: 082133360164      085211834556; Email: pt.gmi027@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9728410000000003,122.46299741666667,'https://www.google.com/maps?q=-3.9728410000000003,122.46299741666667',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581308304271.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581308304128.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581308304516.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('634e9cac-15e6-4888-a69c-321cdd9555c2',NULL,'rumah_subsidi','rumah_tapak','Khalifa Residence','sikumbang-adl0720242021t001','Khalifa Residence oleh PT BUNGA SRI REJEKI LESTARI (REI).
Alamat: Konda Satu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 47 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36/98 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36/98 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Empat Puluh; Telp: 085343597388; Email: iranurfiyanti@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720242021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Konda Satu','Konda Satu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.073055555555555,122.45111111111112,'https://www.google.com/maps?q=-4.073055555555555,122.45111111111112',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1599629215145-11229.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1599629205994-11229.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1599629220414-11229.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e65bf075-ed3e-43e2-ac25-9f7230694220',NULL,'rumah_subsidi','rumah_tapak','Zamrud Elegan Lasusua','sikumbang-lss0110012021t001','Zamrud Elegan Lasusua oleh CV GRIYA BINTANG ELEGANT (HIMPERRA).
Alamat: Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 0 subsidi / 4 komersil.

Tipe rumah:
- Rumah Tapak (Subsidi): Rp 156.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan TPU Tojabi; Telp: 0811401970; Email: hijau.daunsagi79@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0110012021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Lasusua','Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.501151777777778,120.88291166666666,'https://www.google.com/maps?q=-3.501151777777778,120.88291166666666',156000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1606189693631-14137.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1606189687871-14137.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1606189698404-14137.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('cfab1c73-7a2e-4f5f-8784-0f7683629aab',NULL,'rumah_subsidi','rumah_tapak','Bumi Praja Residence','sikumbang-kdi0410032021t001','Bumi Praja Residence oleh PT HARWIN JAYA BAROKAH PROPERTY (HIMPERRA).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 52 subsidi / 0 komersil.

Tipe rumah:
- 36/96 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Komp. Perumahan Bumi Praja Residence Blok C; Telp: 085394748880; Email: rumahmamminasata.com@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.031066666666667,122.55147222222222,'https://www.google.com/maps?q=-4.031066666666667,122.55147222222222',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1610950663156-14459.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1610950577870-14459.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1610950701668-14459.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('16d59392-a725-48c1-a0e5-e6981957133e',NULL,'rumah_subsidi','rumah_tapak','ANOVA LAND KENDARI','sikumbang-adl0820152020t005','ANOVA LAND KENDARI oleh PT PT. ANOVA GRAHA PROPERTY (ASPRUMNAS).
Alamat: Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl.MT.haryono , wua wua; Telp: 082197272233; Email: anovaproperty.18@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820152020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranooha','Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.057315277777778,122.4529125,'https://www.google.com/maps?q=-4.057315277777778,122.4529125',156500000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579742076916.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579742075625.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579742077634.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('68b2b600-afa2-40f9-af6c-93d2afd41150',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE II','sikumbang-adl0720022020t005','PRADANA RESIDENCE II oleh PT ZENK NAWANK KENJEL (REI).
Alamat: Puosu Jaya, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN RITONGA RESIDENCE BLOK B.8 , DESA PUOSU JAYA, KECAMATAN KONDA, KABUPATEN KONAWE SELATAN, SULAWSI TENGGARA; Telp: 085340501808; Email: pt.zenknawankkenjel.888@gmail.com; Web: https://sikumbang.ppdpp.id/pengembang/lokasi/13708/kantor-pemasaran/tambah

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720022020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Puosu Jaya','Puosu Jaya, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.054532694444444,122.47286308333334,'https://www.google.com/maps?q=-4.054532694444444,122.47286308333334',156500000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1602664026919-13708.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1602663995349-13708.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1602664064964-13708.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('85ba7acb-0879-4a6b-830c-f4389a4dc361',NULL,'rumah_subsidi','rumah_tapak','GRIYA NAJWA','sikumbang-unh0210062020t003','GRIYA NAJWA oleh PT ANAN SULTRA JAYA (ASPRUMNAS).
Alamat: Asinua, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: DESA TUDAONE; Telp: 082190962007; Email: anan852963@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210062020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Asinua','Asinua, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,-3.8589799722222224,122.06225808333333,'https://www.google.com/maps?q=-3.8589799722222224,122.06225808333333',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1599029054700-13264.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1599029049051-13264.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1599029059924-13264.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9ab0107c-5aab-4c1f-9597-92475429733d',NULL,'rumah_subsidi','rumah_tapak','AROMA BUKIT INDAH','sikumbang-kdi0310012020t017','AROMA BUKIT INDAH oleh PT TRISED MULTI GRAHA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 2 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 Blok B (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.sao sao; Telp: 083132424158; Email: trisedmultigraha@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T017 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.038333333333333,122.50083333333333,'https://www.google.com/maps?q=-4.038333333333333,122.50083333333333',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1602230435308-13651.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1602226508376-13651.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1602230446519-13651.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('94f7b467-b7e2-4bff-9f0d-df479df7cf33',NULL,'rumah_subsidi','rumah_tapak','GRAHA MANDIRI PERMAI','sikumbang-kdi0910032020t005','GRAHA MANDIRI PERMAI oleh AZATATA CITRA (REI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI 36 BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Syech Yusuf; Telp: 04013127099; Email: azatatacitra875@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9577370000000003,122.5028337,'https://www.google.com/maps?q=-3.9577370000000003,122.5028337',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581991573426.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581991564175.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581991581434.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bd20aff7-3718-4d7e-adf7-b1d1e2bad724',NULL,'rumah_subsidi','rumah_tapak','Green Winsta','sikumbang-kdi0910022020t013','Green Winsta oleh BAS BANGUN PROPERTI (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97 m2, 2 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kijang; Telp: 085241664211; Email: pt.basbangunproperti@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022020T013 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.955277777777778,122.47305555555556,'https://www.google.com/maps?q=-3.955277777777778,122.47305555555556',156500000.0,'total',FALSE,2,2,36,97,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580221484753.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580221447876.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580221511652.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c1d550ec-0153-49f6-ab0d-fac8400212c6',NULL,'rumah_subsidi','rumah_tapak','BUKIT TASAHEA PERMAI','sikumbang-trw0110162020t002','BUKIT TASAHEA PERMAI oleh PT ANUGERAH LAPPABUKA PERMAI (REI).
Alamat: Tababu, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 21 subsidi / 2 komersil.

Tipe rumah:
- 54 M2 (Komersil): Rp 315.000.000, LB 54 m2 / LT 190 m2, 3 KT / 1 KM, 1 lantai.
- 36 M2 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 160 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.poros raterate-ladongi; Telp: 081386714009; Email: mieschaliedmawardi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0110162020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Tababu','Tababu, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.052171,121.888652,'https://www.google.com/maps?q=-4.052171,121.888652',156500000.0,'total',FALSE,2,1,36,160,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1587815246255-10951.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1587815243521-10951.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1587815249705-10951.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c0af11a7-edd9-48ae-a477-16253210588b',NULL,'rumah_subsidi','rumah_tapak','Citra pelangi laikaaha','sikumbang-adl0820192020t005','Citra pelangi laikaaha oleh PT PELANGI DWI PROPERTINDO (PI).
Alamat: Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 37 subsidi / 0 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.
- Citra (Subsidi): Rp 173.000.000, LB 36 m2 / LT 136 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.MARTANDU; Telp: 0811407020; Email: petrussambira@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820192020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Laikaha','Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.041944444444444,122.45166666666667,'https://www.google.com/maps?q=-4.041944444444444,122.45166666666667',156500000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1603181605802-13782.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1603181604471-13782.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1603181607329-13782.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6f5aed0f-6272-4399-b27f-7451bcfe59fb',NULL,'rumah_subsidi','rumah_tapak','GRIYA PERMATA ABELI','sikumbang-kdi0610042020t001','GRIYA PERMATA ABELI oleh PT SULTRA DUTA PROPERTY (REI).
Alamat: Benuanirae, Kec. Abeli, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL Ir.Soekarno ; Telp: 082187423310; Email: sarahlambebeh@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0610042020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Abeli','Benuanirae','Benuanirae, Kec. Abeli, Kota Kendari, Sulawesi Tenggara',NULL,-4.010437944444444,122.57805633333334,'https://www.google.com/maps?q=-4.010437944444444,122.57805633333334',168000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1594190181711-11723.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1594190181403-11723.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1594190182042-11723.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2745c37b-1850-4ff8-8cbc-4b7773ad06d8',NULL,'rumah_subsidi','rumah_tapak','ALIYAH RESIDENCE','sikumbang-kdi0410052020t010','ALIYAH RESIDENCE oleh PT TAPALOSA CIPTA SARANA (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan HaluOleo, Lorong merica,Kel. Mokoau, Kec. Kambu, Kota Kendari Provinsi Sulawesi Tenggara.; Telp: 081243781199; Email: tapalosa.cskendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052020T010 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0057358,122.5605309,'https://www.google.com/maps?q=-4.0057358,122.5605309',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1600678912053-13479.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1600678893672-13479.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1600678933123-13479.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e9e21896-8664-48f4-b232-d3a182e24333',NULL,'rumah_subsidi','rumah_tapak','GRIYA LALODATI','sikumbang-kdi0910062020t005','GRIYA LALODATI oleh SURYA AZHARNA GRAHA (APERSI).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36/104 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Badak Ruko Azharna Griya No.7 (KP.Bugis) Kec. Poasia Kota Kendari; Telp: 081221888857; Email: suryaazharnagraha@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9386111111111113,122.48722222222223,'https://www.google.com/maps?q=-3.9386111111111113,122.48722222222223',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1601173459925-5579.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1601173505053-5579.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1601173476780-5579.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7066d155-9feb-41fe-a705-4f5bebf63cc7',NULL,'rumah_subsidi','rumah_tapak','ARRIZKY PERDANA RESIDENCE','sikumbang-adl0820022020t002','ARRIZKY PERDANA RESIDENCE oleh NASHIFA ARRIZKY PERDANA (REI).
Alamat: Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.BALAIKOTA III PERMAI; Telp: 082293198772; Email: yusharisharm@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820022020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Onewila','Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.059166666666666,122.42944444444444,'https://www.google.com/maps?q=-4.059166666666666,122.42944444444444',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1601438033499-13537.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1601269137350-13537.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1601269160027-13537.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('970c3d3c-6234-40b0-997a-74867e337ab3',NULL,'rumah_subsidi','rumah_tapak','SYAHADAT LAND','sikumbang-kdi0410062020t006','SYAHADAT LAND oleh SYAHADAT PROPERTI UTAMA (REI).
Alamat: Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36/104 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SISINGAMANGARAJA ; Telp: 08124361227; Email: syahadatproperti1@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410062020T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Matabubu','Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.001433333333333,122.56986944444444,'https://www.google.com/maps?q=-4.001433333333333,122.56986944444444',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1600918819634-13507.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1600918789232-13507.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1600918872617-13507.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d2a7173b-c0aa-4e58-b258-2dd92dfe2382',NULL,'rumah_subsidi','rumah_tapak','GRIYA AFLAH RANOMEETO ','sikumbang-adl0820162020t004','GRIYA AFLAH RANOMEETO  oleh PT LANGGENG JAYA KONSTRUKSI (PI).
Alamat: Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 30 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. MALEO; Telp: 082299225104; Email: ptlanggengjayakonstruksi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820162020T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Langgea','Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.049918522222222,122.45809391111112,'https://www.google.com/maps?q=-4.049918522222222,122.45809391111112',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581053739969.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581053737103.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581053742661.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1e0adbcc-e4e0-42af-bfc8-0ae74e4dd575',NULL,'rumah_subsidi','rumah_tapak','Baruga Regency','sikumbang-kdi0310072020t011','Baruga Regency oleh WIRA PERDANAJAYA TIGA (HIMPERRA).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 26 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Zam Ratulangi ; Telp: 04013418011; Email: amanahgroup19@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072020T011 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.021388888888889,122.4863888888889,'https://www.google.com/maps?q=-4.021388888888889,122.4863888888889',156500000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1588735169719-11624.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1588735157733-11624.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1588735172265-11624.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('586ffbfa-0930-4cc8-9730-3fb2a923c74e',NULL,'rumah_subsidi','rumah_tapak','NIRWANA RESIDENCE','sikumbang-bau0110162020t001','NIRWANA RESIDENCE oleh PT ALMA AWI JAYA SENTOSA (APERNAS).
Alamat: Labalawa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 35 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Tarbiyah; Telp: 085395506687; Email: almaalwijayasentosa@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110162020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Labalawa','Labalawa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.505071138888889,122.57350919444444,'https://www.google.com/maps?q=-5.505071138888889,122.57350919444444',156500000.0,'total',FALSE,2,1,35,112,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579847995487.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579847927150.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579848009384.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('882773f7-eefe-42fa-a672-74523f8b8bda',NULL,'rumah_subsidi','rumah_tapak','The Topaz Residence III','sikumbang-bau0110142020t003','The Topaz Residence III oleh MODERN JAYA PROPERTY (HIMPERRA).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 45 (Komersil): Rp 265.000.000, LB 45 m2 / LT 90 m2, 2 KT / 2 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Dayanu Ikhsanuddin; Telp: 082235510007; Email: modernjaya13@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.491694777777778,122.56992749999999,'https://www.google.com/maps?q=-5.491694777777778,122.56992749999999',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579837093964.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579837092059.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579837094848.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('49da14fc-361f-4c1a-b0e4-a06bba301d86',NULL,'rumah_subsidi','rumah_tapak','GRAHA TERATAI INDAH 2','sikumbang-kdi0710042020t005','GRAHA TERATAI INDAH 2 oleh PT PATMINDO RAYA (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 19 subsidi / 2 komersil.

Tipe rumah:
- Rumah Sederhana 36/96 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Malaka, Ruko Gateway  Blok RK B01
Kompleks Citraland - Kendari; Telp: 082348767323; Email: admpatmindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.0025,122.48722222222223,'https://www.google.com/maps?q=-4.0025,122.48722222222223',156000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1598584557462-13202.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1598584555847-13202.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1598584559585-13202.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('19d5004b-b877-4bbf-9db2-53ba1fc464b8',NULL,'rumah_subsidi','rumah_tapak','PURI KENCANA 2','sikumbang-adl0810012020t007','PURI KENCANA 2 oleh PT SERRIL DOBEL KONSTRUKSI (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36/110,5 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 110.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Mawar Perumahan Puri Kencana Blok A; Telp: 082395661099; Email: pt.serrildobelkonstruksi@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012020T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.05058525,122.46836852777778,'https://www.google.com/maps?q=-4.05058525,122.46836852777778',156500000.0,'total',FALSE,2,1,36,110.5,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1600611459089-13442.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1600496749720-13442.JPG","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1600496751846-13442.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c44eb81f-66cb-4832-b7e8-26e41df8e4e5',NULL,'rumah_subsidi','rumah_tapak','Perumahan Graha Teratai Indah','sikumbang-kdi0310012020t013','Perumahan Graha Teratai Indah oleh PT PATMINDO RAYA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 3 komersil.

Tipe rumah:
- Rumah Sederhana 36/96 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 (173) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Malaka, Kompleks Citraland Kendari
Ruko Gateway, Blok RK B01; Telp: 082348767323; Email: admpatmindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T013 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.053333333333333,122.48361111111112,'https://www.google.com/maps?q=-4.053333333333333,122.48361111111112',156000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581994976639.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581994964625.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581994979359.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fe49c184-9706-46dc-bb2e-38745bcbaae4',NULL,'rumah_subsidi','rumah_tapak','TAMAN SURYA BARUGA','sikumbang-kdi0310012020t014','TAMAN SURYA BARUGA oleh KANDARINDO (HIMPERRA).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 (subsidi) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Taridala ; Telp: 082191198706; Email: natsirssirate12@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T014 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.043577777777777,122.49312777777777,'https://www.google.com/maps?q=-4.043577777777777,122.49312777777777',156000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1621421659179-13360.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1621421663859-13360.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1621421670998-13360.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('87a319e5-7f07-4296-842f-7cdc7d17e936',NULL,'rumah_subsidi','rumah_tapak','GRIYA PERMATA KOLUT','sikumbang-lss0120082020t001','GRIYA PERMATA KOLUT oleh PT FATIHA PERMATA PROPERTINDO (REI).
Alamat: Ponggiha, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 12 subsidi / 2 komersil.

Tipe rumah:
- 45 (Komersil): Rp 375.000.000, LB 45 m2 / LT 58 m2, 2 KT / 1 KM, 1 lantai.
- 78 (Komersil): Rp 400.000.000, LB 78 m2 / LT 135 m2, 3 KT / 2 KM, 1 lantai.
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: DESA PONGGIHA KECAMATAN LASUSUA, KABUPATEN KOLAKA UTARA.
PROVINSI SULAWESI TENGGARA; Telp: 082271658163; Email: fatihapermatapropertindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120082020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Ponggiha','Ponggiha, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.4854769444444447,120.88753580555556,'https://www.google.com/maps?q=-3.4854769444444447,120.88753580555556',156000000.0,'total',FALSE,2,1,36,90,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579756326853.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579756311001.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579756338512.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a0aebf97-e8c3-4b1d-a399-d03117df51ea',NULL,'rumah_subsidi','rumah_tapak','SHIFA PERDANA 6','sikumbang-adl0810012020t006','SHIFA PERDANA 6 oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Komersil): Rp 146.000.000, LB 36 m2 / LT 111 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 146.000.000, LB 36 m2 / LT 111 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 111 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SYECH YUSUF ; Telp: 081245833044 / 082293198772; Email: Ilyasathirah4@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012020T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.046111111111111,122.46555555555555,'https://www.google.com/maps?q=-4.046111111111111,122.46555555555555',146000000.0,'total',FALSE,2,1,36,111,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1578876419007.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1578876405506.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1578876434252.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a51e5a8c-3301-4018-a2f6-8532b057c36f',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE','sikumbang-kdi0910022020t012','PRADANA RESIDENCE oleh PT ZENK NAWANK KENJEL (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BRIGJEN KATAMSO POUSU JAYA KONDA KONSEL; Telp: 085340198976; Email: pt.zenknawankkenjel.88@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022020T012 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.974865888888889,122.48465727777779,'https://www.google.com/maps?q=-3.974865888888889,122.48465727777779',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1598335250862-13166.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1598335250489-13166.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1598335251809-13166.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bd0efb9f-f66f-447d-abd9-bb2f5ad80dbe',NULL,'rumah_subsidi','rumah_tapak','RESTU PERMAI 02','sikumbang-bau0110132020t007','RESTU PERMAI 02 oleh PT RESTU SATYA ABADI (APERNAS).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 2 subsidi / 2 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Bonekom; Telp: 04022812973; Email: Nobermangguali@yahoo.co.id; Web: https://restupermai.wordpress.com/

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132020T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.5084885833333335,122.57457327777777,'https://www.google.com/maps?q=-5.5084885833333335,122.57457327777777',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1596631116880-12880.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1596631007691-12880.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1596631143747-12880.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('41ca23e2-d710-4f5b-a554-7ef8f81338e3',NULL,'rumah_subsidi','rumah_tapak','BUKIT RESKITA INDAH RESIDENDE','sikumbang-kdi0310012020t012','BUKIT RESKITA INDAH RESIDENDE oleh PT IRFAN JAYA SULTRA (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Cristina Martha Tiahahu, Lepo-lepo,Kendari; Telp: 085211123407; Email: irfanjayasultra01@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T012 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.044405583333333,122.48767427777778,'https://www.google.com/maps?q=-4.044405583333333,122.48767427777778',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580713414400.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580713403045.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580713421042.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('32f1f6ce-b21e-4311-b525-d575cf29536b',NULL,'rumah_subsidi','rumah_tapak','Griya Ines Amanda','sikumbang-kdi0310072020t008','Griya Ines Amanda oleh PT MAHA KARYA HALUOLEO (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. Balaikota II NO. I; Telp: 085255004343; Email: propertymh9@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072020T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.02006,122.483332,'https://www.google.com/maps?q=-4.02006,122.483332',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1597045757840-12963.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1597045756103-12963.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1597045759817-12963.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d3610006-0bb5-4bf4-a3b4-61063bfd429b',NULL,'rumah_subsidi','rumah_tapak','VILLA MUTIARA BOULEVARD','sikumbang-kdi0310022020t003','VILLA MUTIARA BOULEVARD oleh PT TADISANGKA REZKI BAROKAH (APPERNAS JAYA).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 90 subsidi / 0 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SUPU YUSUF NO. 77 KELURAHAN KORUMBA KEC. MANDONGA KOTA. KENDARI; Telp: 082393191951; Email: rezkibarokah0@gmail.com; Web: rezkibarokah0@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.031181388888889,122.51658877777778,'https://www.google.com/maps?q=-4.031181388888889,122.51658877777778',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579253186536.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579253186512.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579253186615.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e9537790-ebef-42a8-9ec2-6bec890e564d',NULL,'rumah_subsidi','rumah_tapak','PERMATA BARUGA','sikumbang-kdi0310012020t015','PERMATA BARUGA oleh AFIF CELEBES COCO (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36 2025 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.mayjend Katamso perumahan permata Baruga Kav.A; Telp: 0821288997170; Email: ironmuslih@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T015 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.051693805555556,122.48587322222222,'https://www.google.com/maps?q=-4.051693805555556,122.48587322222222',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1600139254507-13415.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1600139241184-13415.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1600139259701-13415.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d9ce7a48-e381-4356-bdad-2cf9d72afa48',NULL,'rumah_subsidi','rumah_tapak','GREEN ANUGERAH REGENCY','sikumbang-kdi0410052020t009','GREEN ANUGERAH REGENCY oleh PT PUTRA ANUGERAH PROPERTINDO (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Wua Eha; Telp: 081935419225; Email: putraanugerahpropertindo.pt@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052020T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-3.997268,122.56007597222222,'https://www.google.com/maps?q=-3.997268,122.56007597222222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1584950921711-11001.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1584950921516-11001.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1584950921751-11001.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9010e1ed-75ce-43ab-9b5f-d8b3e88b1443',NULL,'rumah_subsidi','rumah_tapak','GRIYA ANOA RESIDENCE','sikumbang-kdi0310012020t010','GRIYA ANOA RESIDENCE oleh PT ANOA PUTERA SEJAHTERA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 68 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. Dr. SAM RATULANGI NO. 200 C; Telp: 08114006544; Email: ptanoaputerahsejahtera@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T010 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0387789722222225,122.49085394444444,'https://www.google.com/maps?q=-4.0387789722222225,122.49085394444444',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1597722937827-13079.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1597722936730-13079.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1597722938551-13079.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e6ce33b2-0d9a-47a0-9f53-9aac9674588d',NULL,'rumah_subsidi','rumah_tapak','OLIVE RESIDENCE','sikumbang-kdi0410042020t009','OLIVE RESIDENCE oleh PT LIMA PILAR SUKSES RAHA (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 42 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kancil lorong apel 
Cluster Kancil Mas Blok B No.4
Kelurahan Anduonohu
Kecamatan Poasia
Kendari; Telp: 081383189094; Email: limapilarsuksesraha@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042020T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.01149175,122.55677794444445,'https://www.google.com/maps?q=-4.01149175,122.55677794444445',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1596787009995-12912.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1596787009356-12912.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1596787010935-12912.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('947ac73f-56af-470a-a939-8671d4d19747',NULL,'rumah_subsidi','rumah_tapak','GRIYA CEKO TUNGGALA','sikumbang-kdi0710012020t003','GRIYA CEKO TUNGGALA oleh PT CEKO SEGAR WANGI (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 25 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL ADE IRMA NASUTION ; Telp: 081333966656; Email: ilhamilham47@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.9991666666666665,122.4775,'https://www.google.com/maps?q=-3.9991666666666665,122.4775',156000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580964666868.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580964666684.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580964667000.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7e001a75-2d4e-47db-9e35-25b446abb28c',NULL,'rumah_subsidi','rumah_tapak','ZAVIER ANUGRAH RESIDENCE','sikumbang-kdi0710042020t004','ZAVIER ANUGRAH RESIDENCE oleh PT LASEGO PUTRA MANDIRI (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 19 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Malaka kompleks Ruko Citra Land ; Telp: 082348311691; Email: lasegoputeramandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042020T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.9984532777777777,122.48404988888889,'https://www.google.com/maps?q=-3.9984532777777777,122.48404988888889',156500000.0,'total',FALSE,2,1,36,97,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1598323654384-13161.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1598323653920-13161.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1598323684328-13161.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('96a24106-5390-4f34-aa6c-029f0beff695',NULL,'rumah_subsidi','rumah_tapak','GRAND BOULEVARD REGENCY','sikumbang-kdi1010022020t003','GRAND BOULEVARD REGENCY oleh PT ZAM ZAM SULTRA (HIMPERRA).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 61 subsidi / 0 komersil.

Tipe rumah:
- 36/97 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.
- 36/97 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Malaka; Telp: 08114090987; Email: amanahgroup19@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.036944444444444,122.5375,'https://www.google.com/maps?q=-4.036944444444444,122.5375',156500000.0,'total',FALSE,2,1,36,97,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-9588-1582081567929.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-9588-1582081537680.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-9588-1582081583571.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c38bb34d-7d89-4b5e-aadf-62cf5b319973',NULL,'rumah_subsidi','rumah_tapak','GRIYA MUTIARA BARUGA','sikumbang-kdi0310012020t009','GRIYA MUTIARA BARUGA oleh PT RIZKI ANAWONUA PROPERTINDO (ASPRUMNAS).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 99 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN BARUGA GRIYA PERDANA KOMPLEKS TEPOROMBU ; Telp: 085349749983; Email: firdauziro@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.049560399722222,122.4812593,'https://www.google.com/maps?q=-4.049560399722222,122.4812593',156500000.0,'total',FALSE,2,1,36,99,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1594974357559-11697.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1594974352543-11697.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1594974360698-11697.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('51ccfef7-6ab6-4227-b252-17331eb57aef',NULL,'rumah_subsidi','rumah_tapak','FAMILY RESIDENCE','sikumbang-adl0810012020t005','FAMILY RESIDENCE oleh OFEL KINERET SULTRA (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan Family Residen. Ranomeeto Jln Poros Bandara Halu Oleo; Telp: 081381161609; Email: ofel_kineret@ymail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.039074583333333,122.45848775,'https://www.google.com/maps?q=-4.039074583333333,122.45848775',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1593401762699-12269.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1593401780934-12269.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1593401767388-12269.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('cc316c44-95b8-4ca2-9bb1-dbd71150ed0a',NULL,'rumah_subsidi','rumah_tapak','GRIYA RIZKI PRADANA','sikumbang-kdi0310012020t011','GRIYA RIZKI PRADANA oleh PT MEGA HARAPAN (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 16 subsidi / 0 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl.jati raya; Telp: 085299482291; Email: megaharapan48@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T011 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.045453999999999,122.503167,'https://www.google.com/maps?q=-4.045453999999999,122.503167',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580530975956.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580530970474.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580530983146.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ae986151-3644-496a-8d89-f53f4300d941',NULL,'rumah_subsidi','rumah_tapak','ALSYIFA REGENCY','sikumbang-kdi0710022020t001','ALSYIFA REGENCY oleh PT ALSYIFA ALAM LESTARI (REI).
Alamat: Bonggoeya, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN A.H NASUTION; Telp: 082230599226; Email: alsyifaalamlestari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710022020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Bonggoeya','Bonggoeya, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.006666666666667,122.50333333333333,'https://www.google.com/maps?q=-4.006666666666667,122.50333333333333',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1598239930685-10278.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1598239937377-10278.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1598239944752-10278.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('82c6420d-08a5-43f4-a207-8d3ac74e5b95',NULL,'rumah_subsidi','rumah_tapak','FLAMBOYAN INDAH','sikumbang-kka0720042020t001','FLAMBOYAN INDAH oleh PT MENARA KENSETSU NUSANTARA (REI).
Alamat: Pelambua, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 89 m2, 2 KT / 1 KM, 1 lantai.
- 36 HARGA BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 89 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. Palambua Pomala Kolaka; Telp: 082193111333; Email: sulaiman.asmar69@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720042020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Pelambua','Pelambua, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.17629538888889,121.62171369444444,'https://www.google.com/maps?q=-4.17629538888889,121.62171369444444',156500000.0,'total',FALSE,2,1,36,89,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1596680472272-12881.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1596680471861-12881.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1596680472888-12881.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1576ee99-27df-4a13-8221-ece9e1dcdca3',NULL,'rumah_subsidi','rumah_tapak','RADJA RESIDENCE','sikumbang-adl0810012020t004','RADJA RESIDENCE oleh CV MANDIRI JAYA TEKNIK (HIMPERRA).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 2025 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. Sawerigading ; Telp: 085241581669; Email: cvmandirijayateknik88@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012020T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0420975,122.45927719444445,'https://www.google.com/maps?q=-4.0420975,122.45927719444445',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579678967223.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579678957963.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579678976037.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('72878985-745c-424a-ada5-1ce2a39eada1',NULL,'rumah_subsidi','rumah_tapak','DJAVINO RESIDENCE III','sikumbang-adl0820152020t003','DJAVINO RESIDENCE III oleh PT DJAVINO GRUP INDONESIA (REI).
Alamat: Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Desa Ranooha, Kec. Ranomeeto Kab. Konsel Kompleks Perumahan DJAVINO RESIDENCE I, nomor 5, SULAWESI TENGGARA,  KAB KONAWE SELATAN, Ranomeeto, Ranooha; Telp: 082368884546; Email: djavinoresidence@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820152020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranooha','Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.053586944444445,122.44951627777778,'https://www.google.com/maps?q=-4.053586944444445,122.44951627777778',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1596965927587-12944.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1596965919255-12944.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1596965935451-12944.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('97766a27-c24f-4ee1-96ed-5bb70c9f6479',NULL,'rumah_subsidi','rumah_tapak','Perum PNS kendari','sikumbang-kdi0310072020t006','Perum PNS kendari oleh PT PATMINDO RAYA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 161 subsidi / 2 komersil.

Tipe rumah:
- Rumah Sederhana 36/150 (Subsidi): Rp 150.000.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.
- 36 (153) (Subsidi): Rp 153.000.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.
- 36 (159) (Subsidi): Rp 159.000.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Malaka Ruko Gateway RK B01 No. 11, Komp. Citraland Kendari; Telp: 082348767323; Email: admpatmindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072020T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0284937,122.48446269972223,'https://www.google.com/maps?q=-4.0284937,122.48446269972223',150000000.0,'total',FALSE,2,1,36,150,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581575129680.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581575128197.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581575131666.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e0582139-a007-40b1-8db8-9c06b4817b11',NULL,'rumah_subsidi','rumah_tapak','Inulgi Residence','sikumbang-bau0210112020t002','Inulgi Residence oleh PT WAHYU INULGI MANDIRI (HIMPERRA).
Alamat: Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 314 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 93.75 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan M. H.  Tamrin; Telp: 085203756888; Email: wahyuinulgi123@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210112020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Bukit Wolio Indah','Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.4781469722222225,122.61795397222221,'https://www.google.com/maps?q=-5.4781469722222225,122.61795397222221',156000000.0,'total',FALSE,2,1,36,93.75,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1595481146386-7634.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1595481137858-7634.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1595481258393-7634.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a1d260fe-b582-4a64-9b8d-fe5580fd8382',NULL,'rumah_subsidi','rumah_tapak','Alam Sabila 2','sikumbang-kdi0910022020t009','Alam Sabila 2 oleh PT MEKAR ALAM PRINDO (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 99 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN Alam Sabila 1 ; Telp: 081245794040; Email: sarvendi09@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022020T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.983888888888889,122.48222222222222,'https://www.google.com/maps?q=-3.983888888888889,122.48222222222222',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581248759842.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581248758778.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581248761392.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9ff4fae4-28fb-4d66-89d8-e9d95895bc45',NULL,'rumah_subsidi','rumah_tapak','Griya 21 anduonohu','sikumbang-kdi0410032020t008','Griya 21 anduonohu oleh PT REZKY MEGA PROPERTI (HIMPERRA).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36/97 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Btn kendari permai blok B1; Telp: 081342683423; Email: rezkymegap21@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032020T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.020411944444445,122.54346463888889,'https://www.google.com/maps?q=-4.020411944444445,122.54346463888889',156500000.0,'total',FALSE,2,1,36,97,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1596677530372-10547.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1596677509735-10547.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1596677542832-10547.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3740df41-71a9-4a75-be65-d9f375e9eefe',NULL,'rumah_subsidi','rumah_tapak','citra latambaga indah','sikumbang-kka1410012020t002','citra latambaga indah oleh PT GELORA FIRNAGRAHA REALTYTANIA (REI).
Alamat: Mangolo, Kec. Latambaga, Kab Kolaka, Sulawesi Tenggara.
Total unit: 83 subsidi / 0 komersil.

Tipe rumah:
- 36/100 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 101 m2, 2 KT / 1 KM, 1 lantai.
- gen-Z (Subsidi): Rp 173.000.000, LB 36 m2 / LT 101 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: CAKALANG; Telp: 085399111130; Email: citralatambaga@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1410012020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Latambaga','Mangolo','Mangolo, Kec. Latambaga, Kab Kolaka, Sulawesi Tenggara',NULL,-4.034719444444445,121.55801388888888,'https://www.google.com/maps?q=-4.034719444444445,121.55801388888888',156500000.0,'total',FALSE,2,1,36,101,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581359106227.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581359099854.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581359111530.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('620ae6c9-fe99-4646-a5ff-a377b38e2ee2',NULL,'rumah_subsidi','rumah_tapak','Griya Baruga Mas 2','sikumbang-kdi0310012020t008','Griya Baruga Mas 2 oleh PT TRIO REMAJA JAYA (HIMPERRA).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36  (Subsidi): Rp 146.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jln brigjen m yunus (bypass samping kafe rich o); Telp: 085399056099; Email: trio.remaja.jaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.054463799722222,122.5178147,'https://www.google.com/maps?q=-4.054463799722222,122.5178147',146000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1594258797790-12074.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1593489466456-12074.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1594258804436-12074.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('89a6ea8a-d075-447f-8d96-4b4e9659a703',NULL,'rumah_subsidi','rumah_tapak',' ZAHRA RESIDENCE II','sikumbang-adl0820162020t003',' ZAHRA RESIDENCE II oleh ZAHRA PUTRI CENDANA (HIMPERRA).
Alamat: Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 37 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.MALEO II KOTA BANGUN RANOMETO BLOK A1; Telp: 082292316766; Email: awaludintambara@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820162020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Langgea','Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0391349722222225,122.46105427777778,'https://www.google.com/maps?q=-4.0391349722222225,122.46105427777778',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1589345466587-11712.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1589345464273-11712.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1589345467314-11712.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d57fc187-403a-4797-93e8-95c7f9c80544',NULL,'rumah_subsidi','rumah_tapak','GREEN ANDUONOHU','sikumbang-kdi0410032020t007','GREEN ANDUONOHU oleh PT AGRA CAKRA MULIA ABADI (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 41 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL JENDRAL AH. NASUTION PERUMAHAN LINGGAHARA; Telp: 08114036431; Email: adee3016@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032020T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.034768055555555,122.55425805555555,'https://www.google.com/maps?q=-4.034768055555555,122.55425805555555',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1578973599159.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1578973593761.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1578973603581.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0c5b5af2-6a2c-4b44-a9f9-832b99e9be65',NULL,'rumah_subsidi','rumah_tapak','GRAHA ALAM RESIDENCE','sikumbang-kdi0910022020t007','GRAHA ALAM RESIDENCE oleh CV GRAHA ALAM KARYA (PI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36/98 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. Cendana; Telp: 085255213662; Email: cv.grahaalamkarya@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022020T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9856308333333335,122.47873663888889,'https://www.google.com/maps?q=-3.9856308333333335,122.47873663888889',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1578974570974.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1578974567519.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1578974575971.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('afeb01ee-66a3-4cd1-8e4a-41f00959d599',NULL,'rumah_subsidi','rumah_tapak','PERMATA RESIDENCE 3','sikumbang-adl0820172020t004','PERMATA RESIDENCE 3 oleh PT PERMATA TIRTA JAYA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- TUNGGAL (Subsidi): Rp 146.000.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. MELATI DESA KOTA BANGUN KEC. RANOMEETO KABUPATEN KONAWE SELATAN; Telp: 081245661819; Email: kaswankendari1234@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172020T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.041575888888889,122.47379302777777,'https://www.google.com/maps?q=-4.041575888888889,122.47379302777777',146000000.0,'total',FALSE,2,1,36,90,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580288988515.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580288946089.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580288993115.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7b797a95-0b00-45c4-a7a7-55186c0f7eeb',NULL,'rumah_subsidi','rumah_tapak','SANGIA NIBANDERA CITY','sikumbang-kka0120092020t001','SANGIA NIBANDERA CITY oleh UNIFIT GRAHA PROPERTINDO (REI).
Alamat: Tikonu, Kec. Wundulako, Kab Kolaka, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 164.350.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl. bunggasi; Telp: 08114030787; Email: unifitland8@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0120092020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Wundulako','Tikonu','Tikonu, Kec. Wundulako, Kab Kolaka, Sulawesi Tenggara',NULL,-4.113293166666666,121.68538663888889,'https://www.google.com/maps?q=-4.113293166666666,121.68538663888889',156500000.0,'total',FALSE,2,1,36,150,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580358168257.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580358165241.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580358170363.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f65d1706-cc82-4259-800b-c7fb9b2c9406',NULL,'rumah_subsidi','rumah_tapak','Puri Maharani Puuwatu','sikumbang-kdi0910032020t004','Puri Maharani Puuwatu oleh PT MAHARANI JAYA GEMILANG (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 81 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kijang; Telp: 085241664211; Email: basbangunproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032020T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9605555555555556,122.49833333333333,'https://www.google.com/maps?q=-3.9605555555555556,122.49833333333333',156500000.0,'total',FALSE,2,1,36,81,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579639668005.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579639619835.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579639689399.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0466f3ef-8af3-4e76-89ac-e11434c9b63e',NULL,'rumah_subsidi','rumah_tapak','GRIYA ANGGOEYA PERMAI','sikumbang-kdi0410052020t008','GRIYA ANGGOEYA PERMAI oleh SURYA AZHARNA GRAHA (APERSI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 15 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 65 (Komersil): harga belum valid di sumber, LB 65 m2 / LT 96 m2, 3 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Badak Ruko Azharna Griya No.7 (KP.Bugis) Kec. Poasia Kota Kendari; Telp: 081221888857; Email: Surayazharnagraha@gmail.com; Web: azharnaproperty.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052020T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-3.9922222222222223,122.55749999999999,'https://www.google.com/maps?q=-3.9922222222222223,122.55749999999999',NULL,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580006210077.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580006104903.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580006217021.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('07df3c27-7bfe-451e-bb77-077b63ee9b96',NULL,'rumah_subsidi','rumah_tapak','GREEN VIENA','sikumbang-kdi0910022020t005','GREEN VIENA oleh PT MEKAR ALAM PRINDO (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 99 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN LALOMBAKU, PERUMAHAN ALAM SABILA 1 BLOK, A NO/1 ; Telp: 081245794040; Email: mujibur.rokhman72@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.957777777777778,122.47611111111111,'https://www.google.com/maps?q=-3.957777777777778,122.47611111111111',156500000.0,'total',FALSE,2,1,36,99,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1578888826656.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1578888825094.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1578888828019.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('cc528acc-77aa-4ce3-acaa-4952c1ab3865',NULL,'rumah_subsidi','rumah_tapak','Green Sarvendi','sikumbang-kdi0910022020t006','Green Sarvendi oleh PT MEKAR ALAM PRINDO (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 99 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Alam Sabila 1; Telp: 081245794040; Email: sarvendi09@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022020T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9827777777777778,122.48444444444445,'https://www.google.com/maps?q=-3.9827777777777778,122.48444444444445',156500000.0,'total',FALSE,2,1,36,99,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581249797877.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581249796992.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581249798836.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6d828cc3-2d9b-4d28-b7c2-f307e83ead0e',NULL,'rumah_subsidi','rumah_tapak','Ratu permai residence','sikumbang-bau0110142020t002','Ratu permai residence oleh CV RATU PERMAI (ASPERI).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LIMBO WOLIO ; Telp: 085241708476; Email: ratupermaicv@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.498124472222222,122.57935427777777,'https://www.google.com/maps?q=-5.498124472222222,122.57935427777777',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580364341340.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1595578943537-5827.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580364357435.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5074ab27-3280-4b23-b4b7-1d20381896c3',NULL,'rumah_subsidi','rumah_tapak','BRIS TOWN HOUSE','sikumbang-kdi0310022020t002','BRIS TOWN HOUSE oleh PT RIZKY AZKA KONSTRUKSI (REI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl. Brigjen Katamso, Desa Pousu Jaya Konda Konsel ; Telp: 085340501808; Email: rizky.azka01kosntruksi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0329033,122.5170968,'https://www.google.com/maps?q=-4.0329033,122.5170968',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1591671374476-11899.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1591671366005-11899.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1591671382766-11899.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c348613a-9da2-4686-9089-52554cc6e4b4',NULL,'rumah_subsidi','rumah_tapak','Restu permai residence 01','sikumbang-bau0810012020t001','Restu permai residence 01 oleh PT RESTU SATYA ABADI (APERNAS).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36 NEW (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. Bonekom; Telp: 085241991000; Email: Nobermangguali@yahoo.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0810012020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.505587,122.56042897222223,'https://www.google.com/maps?q=-5.505587,122.56042897222223',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1579684714257.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1579684666977.jpeg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1579684745223.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fb27b416-e5ba-46d2-8f17-362ffa2c5afb',NULL,'rumah_subsidi','rumah_tapak','GRIYA TIWI BARUGA 1','sikumbang-kdi0310072020t005','GRIYA TIWI BARUGA 1 oleh PT ALKOBAR ALAM RAYA (ASPRUMNAS).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Mayjen Katamso, RT/RW : 003/002; Telp: 085342997165; Email: ptalkobaralamraya@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0177861,122.4847519,'https://www.google.com/maps?q=-4.0177861,122.4847519',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-9579-1582096326439.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-9579-1582096309465.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-9579-1582096326919.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9cb0bc7b-3552-472f-bae8-bbaf282cc526',NULL,'rumah_subsidi','rumah_tapak','KOTA BANGUN PERMAI','sikumbang-adl0720022020t002','KOTA BANGUN PERMAI oleh TRIKA SARI PUTRA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl bunga kamboja lorong edelweis; Telp: 082334689538; Email: Trikasari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720022020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.052738166666667,122.47144316666667,'https://www.google.com/maps?q=-4.052738166666667,122.47144316666667',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1594867800373-11111.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1594867782145-11111.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1594867808162-11111.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ae55a588-aaea-42a3-a38e-bf881e5e1a5c',NULL,'rumah_subsidi','rumah_tapak','RITONGA RESIDENCE II','sikumbang-adl0720022020t003','RITONGA RESIDENCE II oleh PT RIZKY AZKA KONSTRUKSI (REI).
Alamat: Puosu Jaya, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- RITONGA RESIDENCE 2 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BRIGJEND KATAMSO, BLOK B; Telp: 085340501808; Email: rizky.azka01kosntruksi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720022020T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Puosu Jaya','Puosu Jaya, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.059025,122.47219722222222,'https://www.google.com/maps?q=-4.059025,122.47219722222222',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580184579062.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580184575952.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580184582428.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fbcd84d5-212f-4fdf-a3d9-24b6f0bd41ae',NULL,'rumah_subsidi','rumah_tapak','Kadar Punggolaka Residence ','sikumbang-kdi0910032020t002','Kadar Punggolaka Residence  oleh PT KADAR BARU BERKAH (APERNAS).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- Subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Hurami; Telp: 082291972249; Email: kadarrealty@gmail.com; Web: kadarrealty.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032020T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9607511997222224,122.49030399972223,'https://www.google.com/maps?q=-3.9607511997222224,122.49030399972223',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1594113881231-891.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1594113888052-891.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1594113869612-891.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('256b6015-895c-4e36-b94c-628ed0084152',NULL,'rumah_subsidi','rumah_tapak','PERMATA KHALILA','sikumbang-kdi0310082020t005','PERMATA KHALILA oleh PT PERMATA BERKAH KENDARI (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 Subsisdi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kapten Pierre Tendean ; Telp: 08114038606; Email: permataberkah.kdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082020T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.025805,122.49602458333334,'https://www.google.com/maps?q=-4.025805,122.49602458333334',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581078850816.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581078841873.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581078858089.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6e136484-e534-4580-90c4-1e57f8c7b05f',NULL,'rumah_subsidi','rumah_tapak','RANOMEETO PERMAI','sikumbang-adl0820162020t001','RANOMEETO PERMAI oleh PT SULTRA RAYA MANDIRI (REI).
Alamat: Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. KAPTEN PIERE TENDE; Telp: 085241543048; Email: sultraraya421@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820162020T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Langgea','Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.039896388888889,122.46090308333333,'https://www.google.com/maps?q=-4.039896388888889,122.46090308333333',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1589940722686-11764.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1589940722282-11764.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1589940723577-11764.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d2b6c485-ad0a-49d0-bccc-9836ab9010a7',NULL,'rumah_subsidi','rumah_tapak','BARUGA GRIYA PERMAI II','sikumbang-kdi0310012020t006','BARUGA GRIYA PERMAI II oleh PT AIQ REKA DEVELOPER (HIMPERRA).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 44 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Bunga Asoka; Telp: 085241729057; Email: romyits05@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012020T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.044084527777778,122.50220952777778,'https://www.google.com/maps?q=-4.044084527777778,122.50220952777778',156000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580972773111.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580972761648.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580972784755.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE)
) AS v(id,seller_id,category,property_type,title,slug,description,province,city,regency_name,district,subdistrict_name,address_detail,postal_code,latitude,longitude,maps_link,price,price_type,is_negotiable,bedrooms,bathrooms,building_area_sqm,land_area_sqm,floors,images,amenities,subsidy_program,can_kpr,certificate_type,condition,status,is_admin_verified,is_featured,views_count,favorites_count,inquiries_count,published_at,ai_generated)
WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.slug = v.slug);


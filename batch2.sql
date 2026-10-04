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
('bc0d9d65-9424-4be4-85fa-0b4018e07ccc',NULL,'rumah_subsidi','rumah_tapak','KABA RESIDENCE TAHAP 6','sikumbang-kdi0310012025t005','KABA RESIDENCE TAHAP 6 oleh PT KARYABARU BERKAH NUSANTARA (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 36 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Brigjen Katamso, Perumahan Kaba Residence, Nomor  E2, Sulawesi Tenggara, Kota Kendari, Baruga, Baruga; Telp: 082226666906; Email: kbnproperti@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012025T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0480580999999995,122.4956872,'https://www.google.com/maps?q=-4.0480580999999995,122.4956872',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/12/05/file-d29ef2ac-1028-469c-ab60-fe4e295ae66f.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/05/file-362f694c-fc68-4152-a88f-11f3b01857e8.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/05/file-5220e3ad-f7c3-451b-9ff4-84febb47d70f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1bb20050-b531-40c9-9ee2-7c8c4ddff77d',NULL,'rumah_subsidi','rumah_tapak','KABA RESIDENCE TAHAP 8','sikumbang-kdi0310012025t006','KABA RESIDENCE TAHAP 8 oleh PT KARYABARU BERKAH NUSANTARA (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 56 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Brigjen Katamso, Perumahan Kaba Residence, Nomor E2, Sulawesi Tenggara, Kota Kendari, Baruga, Baruga; Telp: 082226666906; Email: kbnproperti@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012025T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.049601199722222,122.4958584,'https://www.google.com/maps?q=-4.049601199722222,122.4958584',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/12/06/file-fb616679-f691-4465-b519-4d3f91ca5434.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/06/file-c872d541-bf41-457f-9fe3-697d4c677114.jpg","https://sikumbang.tapera.go.id/public/upload/2025/12/06/file-e3d436f4-fb78-461b-81b7-28da9a920a93.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c08a0dbb-3119-40e5-9c6e-39621922c268',NULL,'rumah_subsidi','rumah_tapak','GRIYA ELEGAN MANGOLO 2','sikumbang-kka1410012025t001','GRIYA ELEGAN MANGOLO 2 oleh PT GRIYA BINTANG ELEGAN (HIMPERRA).
Alamat: Mangolo, Kec. Latambaga, Kab Kolaka, Sulawesi Tenggara.
Total unit: 138 subsidi / 0 komersil.

Tipe rumah:
- TAPAK (Subsidi): Rp 173.000.000, LB 36 m2 / LT 78 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan TPI; Telp: 0811401970; Email: hijau_daunsagi79@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1410012025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Latambaga','Mangolo','Mangolo, Kec. Latambaga, Kab Kolaka, Sulawesi Tenggara',NULL,-4.0280555555555555,121.54694444444445,'https://www.google.com/maps?q=-4.0280555555555555,121.54694444444445',173000000.0,'total',FALSE,2,1,36,78,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/11/20/file-cbdd1c82-1005-4fdc-a8fb-c44910f2e924.jpg","https://sikumbang.tapera.go.id/public/upload/2025/11/20/file-bd77a409-c424-42fd-af40-20629761c6da.jpg","https://sikumbang.tapera.go.id/public/upload/2025/11/20/file-2a46fb97-852e-4372-a15e-e5122451fe3e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7de63e19-ce90-465e-b2df-37dda6095b66',NULL,'rumah_subsidi','rumah_tapak','Bukit Mels Residence','sikumbang-bag0120012025t001','Bukit Mels Residence oleh PT MULTI NATURAL SINERGI (DEPRINDO).
Alamat: Lawela, Kec. Batauga, Kab Buton Selatan, Sulawesi Tenggara.
Total unit: 50 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Sultan Hasanuddin ; Telp: 082297779271  085232776277; Email: management.minergi@gmail.com; Web: https://www.facebook.com/share/1Di36LrQ6q/

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAG0120012025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton Selatan','Kab Buton Selatan','Batauga','Lawela','Lawela, Kec. Batauga, Kab Buton Selatan, Sulawesi Tenggara',NULL,-5.537639722222222,122.59540388888888,'https://www.google.com/maps?q=-5.537639722222222,122.59540388888888',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/02/28/fotoContoh-e7f0d45a-466b-45a1-9ec2-2200392e76bc.jpg","https://sikumbang.tapera.go.id/public/upload/2026/02/28/fotoGerbang--7a56079d-4e45-4e19-ae25-236d6d63deb8.jpg","https://sikumbang.tapera.go.id/public/upload/2026/02/28/fotoTengah-a36239c5-1f94-47b2-b982-096584c48df4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d0769d7c-4561-48f7-8ec4-5877e6de9217',NULL,'rumah_subsidi','rumah_tapak','KITA SEHATI 2','sikumbang-kdi0710042025t007','KITA SEHATI 2 oleh PT ROJO BAGUS NUSANTARA (APERSI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 27 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Malaka Komp. Citraland Kendari Ruko Gateway Blok RK B1 ; Telp: 082348767323; Email: pt.rojobagus@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042025T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.0039942,122.4834735,'https://www.google.com/maps?q=-4.0039942,122.4834735',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/10/18/file-lokasi-cc29def1-6680-4486-ac30-c5acbaa932de.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/18/file-lokasi-d22b1d64-c40f-43d8-a2d6-73cc10b0f59d.jpg","https://sikumbang.tapera.go.id/public/upload/2025/10/18/file-lokasi-cc4f0609-1dc6-455a-966f-68fc9cf57bef.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('74dcb608-2ae9-4432-ab5d-50f03b60c7e0',NULL,'rumah_subsidi','rumah_tapak','RAYYAN HILLS','sikumbang-kdi0910032025t002','RAYYAN HILLS oleh PT UNIVERSAL MODERN GROUP (APERSI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 85 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.JEND.AHMAD YANI; Telp: 082194770789; Email: pt.universal01@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.958466666666667,122.48695555555555,'https://www.google.com/maps?q=-3.958466666666667,122.48695555555555',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/08/12/file-lokasi-856033a9-7c04-4749-807a-b9a1b1bd3b46.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/12/file-lokasi-3f24207f-f132-483b-ac02-57de588b0943.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/12/file-lokasi-e5a3bb26-8beb-46c5-a8d3-d27804a6524e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('51115b4c-dd78-4b1d-857f-77b257454a4c',NULL,'rumah_subsidi','rumah_tapak','GSK Land','sikumbang-kdi0910012025t002','GSK Land oleh PT GRIYA SULTRA KONSTRUKSI PROPERTI (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 87 subsidi / 0 komersil.

Tipe rumah:
- Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.
- Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. Chairil Anwar, Lrg. Persatuan, Perum. GSK Residence Puuwatu Blok B No. 10, RT.027/RW.009, Puuwatu, Kota Kendari; Telp: 082290745213; Email: gsk.property.id@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.976843099722222,122.4632438,'https://www.google.com/maps?q=-3.976843099722222,122.4632438',173000000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/08/09/file-lokasi-749ea406-58f8-46e4-b7e7-db92f51a680c.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/09/file-lokasi-b2aa20f5-965c-4b79-b610-becfdb3e4cb9.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/09/file-lokasi-b0b4cf39-3d7e-4e4e-a170-dd6b9d6670c1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b549138d-2765-43ca-b63e-5d1e23a93665',NULL,'rumah_subsidi','rumah_tapak','DIANDRA RESIDENCE','sikumbang-kdi0310012025t003','DIANDRA RESIDENCE oleh PT DIARRA INDAH PRATAMA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 44 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JLN. KS. TUBUN Lrg. LALOEPISI; Telp: 085222288848; Email: Diarraindahpratama@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.049467452416667,122.49790459872223,'https://www.google.com/maps?q=-4.049467452416667,122.49790459872223',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/08/13/file-lokasi-0f0d4e98-067d-48d7-a94f-d23c3f95ccd1.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/13/file-lokasi-d124200e-2197-44d1-a630-94c073e3eda5.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/13/file-lokasi-d6c42b97-23f4-4210-bdf6-0c9387f8fde2.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('006683f0-670f-4ad3-ba4d-5c4130fecba5',NULL,'rumah_subsidi','rumah_tapak','ARMA SRIKANDI LAND','sikumbang-kdi0310072025t008','ARMA SRIKANDI LAND oleh PT KARYA ARMA SRIKANDI (APERSI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 41 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL ANTERO HAMRA; Telp: 085241967919; Email: ptkaryaarmasrikandi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072025T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.016666666666667,122.48333333333333,'https://www.google.com/maps?q=-4.016666666666667,122.48333333333333',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/04/29/file-lokasi-825c268a-badf-42bb-b97f-4934b8b0f71a.jpg","https://sikumbang.tapera.go.id/public/upload/2025/04/29/file-lokasi-c1ca3840-b833-4730-a2f2-9586fc3b36af.jpg","https://sikumbang.tapera.go.id/public/upload/2025/04/29/file-lokasi-8540b162-e76a-4a73-8d1b-fa71693f69f5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a8779c71-a52e-4536-9222-431e5fa8021a',NULL,'rumah_subsidi','rumah_tapak','LALOMBAKU RESIDENCE','sikumbang-kdi0910022025t006','LALOMBAKU RESIDENCE oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN SUPU YUSUF; Telp: 0811405887; Email: margahayumega@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022025T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9873541,122.4807207,'https://www.google.com/maps?q=-3.9873541,122.4807207',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/08/23/file-lokasi-8e78148c-711c-48d2-953c-460267f1489b.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/23/file-lokasi-2ab9240d-ddea-4e5b-80a9-60be506996e9.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/23/file-lokasi-f6ea0e31-1e78-482a-a8d8-924a579b8ce9.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ee1e61d3-2018-48f7-bc76-178f4bf8fe03',NULL,'rumah_subsidi','rumah_tapak','Bukit Safa','sikumbang-kdi0310012025t004','Bukit Safa oleh PT BAYTUL MAKMUR SEJAHTERA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan The Villas Blok E. 1 (Jl. D.I Panjaitan); Telp: 085333353809; Email: albaytul.makmur@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012025T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.046138888888889,122.49343888888889,'https://www.google.com/maps?q=-4.046138888888889,122.49343888888889',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/12/12/fotoContoh-b782e8a6-5832-4e1e-9e14-920f33cdf8c0.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/12/12/fotoGerbang--b1deff58-451c-4e06-9173-33b74fcb7ff9.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/12/12/fotoTengah-aaf5af9f-ed65-4777-bec9-4ba5eef40917.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c6de6cbf-76bd-4800-8491-3c000e70d82a',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN LINSEN REGENCY','sikumbang-adl0720192025t001','PERUMAHAN LINSEN REGENCY oleh PT LIN SEN MANDIRI (APERSI).
Alamat: Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 15 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.40 Desa lalowiu ; Telp: 085391260761; Email: pt.linsenmandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720192025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Lalowiu','Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.074510833333333,122.48583694444444,'https://www.google.com/maps?q=-4.074510833333333,122.48583694444444',173000000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/08/31/file-lokasi-713e6807-54ff-4028-b2bb-103c14c787d9.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/31/file-lokasi-a0f2b64c-b762-49b8-a772-c990797a5a77.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/31/file-lokasi-451a6d05-2cf8-4fc6-be9f-ef54b8a08126.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9b7461af-bdf0-4fbf-bd50-8c10d1345b87',NULL,'rumah_subsidi','rumah_tapak','ONEWILA PRAJA LAND','sikumbang-adl0820022025t001','ONEWILA PRAJA LAND oleh PT MEGA BOLA MASAGENA (HIMPERRA).
Alamat: Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 68 subsidi / 0 komersil.

Tipe rumah:
- Rumah Tapak (Subsidi): Rp 173.000.000, LB 36 m2 / LT 78 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. Griya Bintang Elegan ; Telp: 0811401970; Email: hijau.daunsagi79@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820022025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Onewila','Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.057222222222222,122.43472222222222,'https://www.google.com/maps?q=-4.057222222222222,122.43472222222222',173000000.0,'total',FALSE,2,1,36,78,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-lokasi-0612d15e-03ce-4c89-baf8-6ce57e5eb190.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-lokasi-c4dd6537-9347-43a4-90f3-70bcf51a454c.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-lokasi-eafbac10-c9bd-42fb-ae56-4f7c2889116a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('85c724bc-8383-4bb3-b47b-7efd7bc376ac',NULL,'rumah_subsidi','rumah_tapak','HOGA RESIDENCE','sikumbang-bau0110132025t002','HOGA RESIDENCE oleh PT SATRIADITAMA GEMILANG ABADI (PIN).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- Hoga (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Belakang Laboratorium Kesehatan Kota Baubau, RUKO BLOK 7 BUANA HIJAU; Telp: 081244464764 - 082310697125; Email: satriaditamagemilangabadi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.510767777777778,122.57315083333333,'https://www.google.com/maps?q=-5.510767777777778,122.57315083333333',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-fb268d32-9ee5-48ba-99aa-4b0766dcd60a.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-25264e51-ac50-4365-a1db-3f81f93f85bd.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-daf24445-55d6-4e32-8383-407134d11326.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2c467cb3-8a9a-451c-a327-6236509abfe3',NULL,'rumah_subsidi','rumah_tapak','BUKIT MADANI PERMAI TAHAP II','sikumbang-kdi0410032025t006','BUKIT MADANI PERMAI TAHAP II oleh PT KARIMUN BERKAH MANDIRI (HIMPERRA).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 16 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 HARGA BARU 2025 (subsidi) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Martandu Ruko Pelangi; Telp: 085241726657; Email: karimun.berkahmandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032025T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.028414722222222,122.55187777777778,'https://www.google.com/maps?q=-4.028414722222222,122.55187777777778',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-lokasi-3c6eb0ef-d305-4e9c-9684-77a58322b8a7.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-lokasi-f6582a3f-0d67-4ec0-9daf-f346e91c3710.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/10/file-lokasi-58156a03-fa62-4d44-b7dd-037b48655a4b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d7603521-efee-472a-8454-471067f6ce9a',NULL,'rumah_subsidi','rumah_tapak','VILLA INDAH PESOUHA','sikumbang-kka0720072025t001','VILLA INDAH PESOUHA oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Pesouha, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.PEMUDA; Telp: 085241654268; Email: pt.villa.mutiara.ramadhan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720072025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Pesouha','Pesouha, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.1756083,121.63429659972223,'https://www.google.com/maps?q=-4.1756083,121.63429659972223',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/13/file-lokasi-13b72ee0-ce68-4a6e-ba3c-410fdfd8421a.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/13/file-lokasi-2be7f679-4021-4ef2-9dd2-20e359601b9e.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/13/file-lokasi-9dced688-ed12-4fc7-84d3-f7984fa6ce67.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5e089d46-b97e-4b89-8201-26d5f7f03c73',NULL,'rumah_subsidi','rumah_tapak','grand lagosi tahap 2','sikumbang-kdi0710042025t006','grand lagosi tahap 2 oleh PT PROPERTI NIAGA MANDIRI (APERSI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 41 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jln tunggala , kelurahan anawai kecamatan wua wua , kendari sulawesi tenggara; Telp: 08114531208; Email: propertiniagamandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042025T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.001027777777778,122.4818,'https://www.google.com/maps?q=-4.001027777777778,122.4818',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/04/file-aa310788-fab9-4000-ad68-142cdb165942.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/04/file-db3934be-29d6-4126-afa0-d619a49f061b.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/04/file-30801314-78c8-44c6-95de-f43a5f5c1796.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('459df548-5fbf-4ee1-b4fd-4ca217bd14e4',NULL,'rumah_subsidi','rumah_tapak','ROYAL TOMILLA RESIDENCE','sikumbang-lss0120092025t002','ROYAL TOMILLA RESIDENCE oleh PT ALIMADA GROUP PROPERTY (REI).
Alamat: Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 31 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Pombili BTN Griya Tomarumemmeng Blok A; Telp: 085241665251; Email: furqanalimus@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120092025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Watuliwu','Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.50935,120.89296666666667,'https://www.google.com/maps?q=-3.50935,120.89296666666667',173000000.0,'total',FALSE,2,1,36,90,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/13/file-lokasi-3a2acb72-1e86-49c1-8076-19f111ea0f03.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/09/13/file-lokasi-5f0b72a7-d9d5-4c57-adbc-a207d8e24bb7.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/09/13/file-lokasi-b91ae422-9ae4-4afa-984b-40e931474432.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b40083d4-475a-420f-a8c4-a3bef8ddeae0',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN A99 CORP LAND TAHAP 4','sikumbang-kdi0910032025t003','PERUMAHAN A99 CORP LAND TAHAP 4 oleh PT AGFE JAYA PROPERTINDO (HIMPERRA).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 68 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.LALOMBAKU BTN GRIYA OASE BLOK A; Telp: 085145799995; Email: pt.agfejayapropertindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.95,122.48333333333333,'https://www.google.com/maps?q=-3.95,122.48333333333333',173000000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/14/file-lokasi-7140380b-fa48-4cda-9420-5d44c4147cf0.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/14/file-lokasi-e2dd48dd-a79d-42ca-b623-800385a246bf.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/14/file-lokasi-b83b2ce0-a975-4db2-8aa5-f766fb8e7403.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fc337ab1-60b5-4315-ab06-88947c9911f4',NULL,'rumah_subsidi','rumah_tapak','GRAHA EXPO WOIHA','sikumbang-trw0120052025t001','GRAHA EXPO WOIHA oleh PT ANUGERAH LAPPABUKA PERMAI (REI).
Alamat: Woiha, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 114.75 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. POROS RATE-RATE LADONGI; Telp: 085333370662; Email: pt.anugerahlappabukapermai@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120052025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Woiha','Woiha, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.026224,121.9137295,'https://www.google.com/maps?q=-4.026224,121.9137295',173000000.0,'total',FALSE,2,1,36,114.75,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/09/file-lokasi-c1d4482a-d76a-45a2-81bf-fabf9b337287.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/09/file-lokasi-2f43c280-fcc6-4db5-906e-d481a3787e40.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/09/file-lokasi-33abdd56-96f4-4964-b6dc-6f3d4882f3fc.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5a696f83-ede3-4b3d-9fad-03b5af5e9b6b',NULL,'rumah_subsidi','rumah_tapak','ALFATIH LAND','sikumbang-adl0820162025t001','ALFATIH LAND oleh PT NEO ELECTRONIK PROPERTI GROUP (APERSI).
Alamat: Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.RAMBUTAN II NO 24 A; Telp: 085241533398; Email: neoelectronikpropertigroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820162025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Langgea','Langgea, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.035394444444444,122.4646,'https://www.google.com/maps?q=-4.035394444444444,122.4646',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/23/file-lokasi-4fe5b3c0-8812-41ef-a11b-c1511b6b4289.JPG","https://sikumbang.tapera.go.id/public/upload/2025/09/23/file-lokasi-3d55ca8d-ace9-496a-b632-7141f593a0a2.JPG","https://sikumbang.tapera.go.id/public/upload/2025/09/23/file-lokasi-6a21c59b-6714-49cc-81fa-5207c56ed7d4.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('13ac6233-4754-4de8-b8e4-1d06a6af1133',NULL,'rumah_subsidi','rumah_tapak','SINAR MANIS RESIDENCE','sikumbang-wgw0510252025t001','SINAR MANIS RESIDENCE oleh PT SINAR MANIS GROUP (PI).
Alamat: Mandati Iii, Kec. Wangi Wangi Selatan, Kab Wakatobi, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 1 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl. poros liya, kel. mandati III kec. wangi-wangi selatan kab. wakatobi; Telp: 081361708455; Email: desisabani.sh@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/WGW0510252025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Wakatobi','Kab Wakatobi','Wangi Wangi Selatan','Mandati Iii','Mandati Iii, Kec. Wangi Wangi Selatan, Kab Wakatobi, Sulawesi Tenggara',NULL,-5.346202777777777,123.54830277777778,'https://www.google.com/maps?q=-5.346202777777777,123.54830277777778',173000000.0,'total',FALSE,1,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/23/file-lokasi-dfd016ea-da77-42d8-b588-1430cef02b9c.JPG","https://sikumbang.tapera.go.id/public/upload/2025/09/23/file-lokasi-c6cbc88b-b1b4-4676-8370-cc69889c0270.JPG","https://sikumbang.tapera.go.id/public/upload/2025/09/23/file-lokasi-577c01a5-024f-4d98-a1fd-6c89b7cbfa19.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0c7721b9-a24b-4822-ba60-5c6ad78046eb',NULL,'rumah_subsidi','rumah_tapak','GRYA PERMATA INDAH 2','sikumbang-adl0720192025t002','GRYA PERMATA INDAH 2 oleh PT TUWU PERKASA ABADI (REI).
Alamat: Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan BTN Kendari Permai Blok I No. 5; Telp: 081245791664; Email: pttuwuperkasaabadi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720192025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Lalowiu','Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.062204972222222,122.48901397222222,'https://www.google.com/maps?q=-4.062204972222222,122.48901397222222',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/22/file-lokasi-31901eed-d0d6-4cd6-99d7-10a203573a0d.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/22/file-lokasi-5613bd9b-bd57-4ea7-bcbc-1058145473e8.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/22/file-lokasi-1f4390e7-3fb7-442f-b4a3-fc9f61a7a2c4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('019a8b09-4365-491f-976c-63844c9ed550',NULL,'rumah_subsidi','rumah_tapak','RAJENDRA RESIDENCE','sikumbang-kdi0910022025t004','RAJENDRA RESIDENCE oleh PT RIZKY AZKA KONSTRUKSI (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- RAJENDRA RESIDENCE (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL  BUDI UTOMO; Telp: 082231810164; Email: inhadafa15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022025T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9788305555555556,122.48819722222223,'https://www.google.com/maps?q=-3.9788305555555556,122.48819722222223',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/06/18/file-lokasi-7a028f37-b4d0-4dfe-a1dc-76ed91de201f.JPG","https://sikumbang.tapera.go.id/public/upload/2025/06/18/file-lokasi-f390e0bd-5b28-4fb9-8347-de10fc395a81.JPG","https://sikumbang.tapera.go.id/public/upload/2025/06/18/file-lokasi-ea200f9b-2fe2-4b11-92f3-a168357c8574.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7caded9c-0d17-4007-84a7-4105a5fafeb9',NULL,'rumah_subsidi','rumah_tapak','GRIYA PESONA','sikumbang-bau0110132025t001','GRIYA PESONA oleh CV SAFIRAH (ASPRUMNAS).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 19 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Langkariri; Telp: 081342954489; Email: yasrulchamp9@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.5111316666666665,122.57254333333333,'https://www.google.com/maps?q=-5.5111316666666665,122.57254333333333',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/05/29/file-lokasi-0a8fd33d-39b9-4877-8368-6f0bfd9fc534.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/29/file-lokasi-bf1ac45d-5c35-4e5b-a9b5-101024d50969.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/29/file-lokasi-9e12c99e-ce54-42c6-ae82-d3a7e321629b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e44234f6-edd3-493e-b650-52a75a48c6bd',NULL,'rumah_subsidi','rumah_tapak','GREEN MANSION 3','sikumbang-kdi0710042025t003','GREEN MANSION 3 oleh PT DELAPAN SEMBILAN KONSTRUKSI (HIMPERRA).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Ahmad Yani, Kompleks Ahmad Yani Square; Telp: 082271005816; Email: Dsembilankonstruksi@gmail.com; Web: https://maps.app.goo.gl/ijLasrw1U9pKgvhv5

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.010235777777778,122.48404691666667,'https://www.google.com/maps?q=-4.010235777777778,122.48404691666667',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/06/20/file-lokasi-b34a9c89-7ecc-43a1-b9e5-c832af625491.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/20/file-lokasi-09e8393c-b624-46d6-b490-7fcafab5e815.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/20/file-lokasi-8f00476e-31ee-403a-ad76-f6998c70e0a4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('98ea744e-8002-4466-b9f9-9b1e2d48a369',NULL,'rumah_subsidi','rumah_tapak','GREEN MANSION 2','sikumbang-kdi0710042025t004','GREEN MANSION 2 oleh PT DELAPAN SEMBILAN KONSTRUKSI (HIMPERRA).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Ahmad Yani, Kompleks Ahmad Yani Square; Telp: 082271005816; Email: Dsembilankonstruksi@gmail.com; Web: https://maps.app.goo.gl/iwd9Em6qiULDckfF6

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042025T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.011274805555556,122.48304747222222,'https://www.google.com/maps?q=-4.011274805555556,122.48304747222222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/06/23/file-lokasi-f2636948-069f-440c-98ea-0bf458286c34.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/23/file-lokasi-6407bafb-af74-4822-b2fd-a7aeae443869.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/23/file-lokasi-4da7fcbc-5fdf-4ebd-99a6-faf450e49aeb.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d2d654ac-22ef-4584-90d1-a82737062e2b',NULL,'rumah_subsidi','rumah_tapak','Griya Aflah 2','sikumbang-adl0810012025t002','Griya Aflah 2 oleh PT LANGGENG JAYA KONSTRUKSI (PI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 28 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN Maleo 2 Blok B; Telp: 081341527019; Email: ptlanggengjayakonstruksi3@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.049533833333333,122.45883941666666,'https://www.google.com/maps?q=-4.049533833333333,122.45883941666666',173000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/06/20/file-lokasi-d44bff94-1889-4c5f-838a-7ed73b2d9432.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/20/file-lokasi-6dd6786c-98bb-40f5-b2e9-ccca6afe96e6.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/20/file-lokasi-b542cff7-7512-4dbc-a5cc-a113102bc503.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('56b51a68-61e4-44ff-8216-ec47c41a15f9',NULL,'rumah_subsidi','rumah_tapak','MARSYA RESIDENCE','sikumbang-bau0110142025t001','MARSYA RESIDENCE oleh PT BERKAH BUTON MANDIRI (APERNAS).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 110.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN LIMBO WOLIO
RT.002 RW.003; Telp: 085299548109; Email: bbmberkahbutonmandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.465802777777778,122.59062777777777,'https://www.google.com/maps?q=-5.465802777777778,122.59062777777777',173000000.0,'total',FALSE,2,1,36,110.5,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/06/24/file-lokasi-6040164a-6f39-4392-9708-a98155555e13.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/24/file-lokasi-3f219292-4def-4daa-9f5c-c5333e6597d6.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/24/file-lokasi-4b007cb9-80fa-4574-a395-ed0ede659cde.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0a6580d0-fb2f-4ac5-b2ac-42de23d7d398',NULL,'rumah_subsidi','rumah_tapak','GRAHA PESONA HILLS','sikumbang-bau0210072025t003','GRAHA PESONA HILLS oleh PT PONDOK SUMBER BAHAGIA (REI).
Alamat: Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 94 subsidi / 5 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan Graha Pesona Hills Bok D No.1 Kelurahan Kadolokatapi Kecamatan Wolio Kota Baubau; Telp: 081244404199; Email: ptpondoksumberbahagia@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210072025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Kadolo Katapi','Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.472886111111111,122.63230833333333,'https://www.google.com/maps?q=-5.472886111111111,122.63230833333333',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/06/16/file-4bff9bb3-38ec-4475-9622-3d262c53ec42.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/16/file-179e1ea7-588d-42ff-a7a6-96787789ce2f.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/16/file-44da5fcd-af93-48d4-ad64-7e30803a5a4c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a543cfa3-0b3c-49cd-8a90-b25fd42ef19c',NULL,'rumah_subsidi','rumah_tapak','SALIKA LAND PUUWATU','sikumbang-kdi0910022025t005','SALIKA LAND PUUWATU oleh PT SALIKA JAYA MANDIRI (AB).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: kel. Puuwatu, kec. puuwatu, Kota Kendari; Telp: 085256504286; Email: Salikajayamandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022025T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.964302777777778,122.472975,'https://www.google.com/maps?q=-3.964302777777778,122.472975',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/06/26/file-lokasi-3ccda8ba-63d2-4a09-8809-e2d6f506ef26.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/26/file-lokasi-fd9d2a11-6da9-4de6-9cdb-281ffa3e3e4f.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/26/file-lokasi-b6b73a82-41c7-4410-8682-9ac3acc3176e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fcfe8034-3a86-4acb-b662-1961108eecd6',NULL,'rumah_subsidi','rumah_tapak','SALIKA LAND BONDOALA TAHAP 2','sikumbang-unh2110032025t001','SALIKA LAND BONDOALA TAHAP 2 oleh PT SALIKA JAYA MANDIRI (AB).
Alamat: Laosu, Kec. Bondoala, Kab Konawe, Sulawesi Tenggara.
Total unit: 74 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Poros Laosu; Telp: 085256504286; Email: salikajayamandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH2110032025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Bondoala','Laosu','Laosu, Kec. Bondoala, Kab Konawe, Sulawesi Tenggara',NULL,-3.892227777777778,122.46257222222222,'https://www.google.com/maps?q=-3.892227777777778,122.46257222222222',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/10/12/file-lokasi-1c62fa66-fabf-40ca-8c52-defc1c7e9388.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/12/file-lokasi-fce663ae-6f4a-4fe0-9519-467a906a1d81.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/12/file-lokasi-3d7f5397-07b0-421c-a442-e9f9f84f27dc.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('16927387-eaea-463f-9a47-4f1d30cf67e1',NULL,'rumah_subsidi','rumah_tapak','BARUGA HARMONI 5','sikumbang-kdi0710012025t002','BARUGA HARMONI 5 oleh PT RASYA DWI MANDIRI (APERSI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 43 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 93.75 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL CHAIRIL ANWAR HARMONI BUILDING ; Telp: 085397374244; Email: rasyadwimandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.989466999722222,122.4882785,'https://www.google.com/maps?q=-3.989466999722222,122.4882785',173000000.0,'total',FALSE,2,1,36,93.75,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/07/02/file-lokasi-9d9849ac-39cd-4899-97d0-20d24085a33f.jpg","https://sikumbang.tapera.go.id/public/upload/2025/07/02/file-lokasi-1a5924d6-5f2f-4681-86c2-8d7997c8438f.jpg","https://sikumbang.tapera.go.id/public/upload/2025/07/02/file-lokasi-0deabdd4-fa71-483b-ac3c-ada753d52291.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('04994745-037e-440f-9a22-070ec535b629',NULL,'rumah_subsidi','rumah_tapak','ALYA RESIDENCE TAHAP 3','sikumbang-kdi0310082025t001','ALYA RESIDENCE TAHAP 3 oleh PT MAJU GRIYA CAHAYA (APERSI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. WULELE; Telp: 08114019700; Email: majugriyacahaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.021732777777777,122.49526194444445,'https://www.google.com/maps?q=-4.021732777777777,122.49526194444445',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/07/05/file-lokasi-17637c24-c7ee-44dd-9adb-efeec71ec277.jpg","https://sikumbang.tapera.go.id/public/upload/2025/07/05/file-lokasi-c2ca4ffa-9fb9-4a08-ba32-5a3fcad0be10.jpg","https://sikumbang.tapera.go.id/public/upload/2025/07/05/file-lokasi-57f2d19a-1686-4562-b425-e737aec8452a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ef6c3300-0913-491e-bba4-10795213b731',NULL,'rumah_subsidi','rumah_tapak','Perumahan Rezky Anawai','sikumbang-kdi0710042025t005','Perumahan Rezky Anawai oleh PT REZKY NUR PRATAMA (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Tunggala Dalam RT. 003 RW. 006 ; Telp: 082210397161  081324758988; Email: suprieva811@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042025T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.006548,122.494096,'https://www.google.com/maps?q=-4.006548,122.494096',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/07/03/file-lokasi-b40d41ce-4fa4-4548-b26b-a5ca6aa3246f.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/07/03/file-lokasi-afec82d9-5150-4ded-a500-aab26f2e498b.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/07/03/file-lokasi-ffa6daec-2908-49d3-85a3-ee3d336d0d02.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('62747391-eaa4-4b6b-8c75-002f43411028',NULL,'rumah_subsidi','rumah_tapak','RATU BUMI 2','sikumbang-kdi0310012025t002','RATU BUMI 2 oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL H SUPU YUSUF; Telp: 0811405887; Email: margahayumega@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.052845,122.5098266388889,'https://www.google.com/maps?q=-4.052845,122.5098266388889',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/07/18/file-lokasi-7f5a077a-f2f3-4900-a675-e54fc6e0109a.jpg","https://sikumbang.tapera.go.id/public/upload/2025/07/18/file-lokasi-ca8bac66-93b2-422a-ab5f-e7776b140113.jpg","https://sikumbang.tapera.go.id/public/upload/2025/07/18/file-lokasi-92739816-faf1-4b71-87bd-eb9d84445f82.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b0d13159-94a3-4a90-9bac-dfdec1d37d9a',NULL,'rumah_subsidi','rumah_tapak','PEMBANGUNAN PERUMAHAN ANOA CIPTA RESIDENCE','sikumbang-kdi1010022025t002','PEMBANGUNAN PERUMAHAN ANOA CIPTA RESIDENCE oleh PT ANOA CIPTA PROPERTY (REI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 68 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Haluoleo, Depan Lrg Bambu; Telp: 082247654356; Email: ptanoaciptaproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.054040555555555,122.53224972222222,'https://www.google.com/maps?q=-4.054040555555555,122.53224972222222',173000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/17/fotoContoh-f1d1ff2c-9cf6-426e-9ccf-81aaf156ea4d.JPG","https://sikumbang.tapera.go.id/public/upload/2025/09/17/fotoGerbang--9dc20e4e-b880-4611-841e-cee7f883f11b.JPG","https://sikumbang.tapera.go.id/public/upload/2025/09/17/fotoTengah-b0ef2443-3b25-4d3e-a786-1d8df036c78e.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('001c4657-d93e-496f-b438-17f61730747d',NULL,'rumah_subsidi','rumah_tapak','Puspa Hills','sikumbang-kdi1010022025t003','Puspa Hills oleh PT SAM PUTRA INDONESIA (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 81 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kampung baru; Telp: 082231784332; Email: ptsamputraindonesia@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.048038888888889,122.55474722222222,'https://www.google.com/maps?q=-4.048038888888889,122.55474722222222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/08/04/file-89586d93-2f6f-49e1-a5a6-18fa31277ed1.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/08/04/file-b39e3af4-ea7a-4582-aebe-e4c0890c383b.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/08/04/file-962d029f-fa93-4e6e-bc72-e0991d007269.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6631c093-89f0-4f2c-8afa-627c8bcb8bf6',NULL,'rumah_subsidi','rumah_tapak','ALAM KEMUNING RESIDENCE','sikumbang-kdi1010022025t004','ALAM KEMUNING RESIDENCE oleh PT SEMESTA ALAM KEMUNING (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl. lingkung pesantren kel, mokoau kec. kambu kota kendari; Telp: 08114099978; Email: kemuningalam@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022025T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.0493356,122.55823859972222,'https://www.google.com/maps?q=-4.0493356,122.55823859972222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/07/31/file-lokasi-35876ebe-e6e7-475e-b764-e50780194d8a.jpg","https://sikumbang.tapera.go.id/public/upload/2025/07/31/file-lokasi-6850dca7-105d-4033-b21b-9676df21ab25.jpg","https://sikumbang.tapera.go.id/public/upload/2025/07/31/file-lokasi-7bab6bb7-0b91-4c39-ab01-ee3c20d7bc1c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('922ef4c4-c064-447d-b427-eddd31e215b5',NULL,'rumah_subsidi','rumah_tapak','BANUA GRAND PATOWONUA','sikumbang-lss0120152025t001','BANUA GRAND PATOWONUA oleh PT PT. BABANA KONSTRUKSI PERSADA (REI).
Alamat: Patowonua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Tomakkeda; Telp: 082293706311; Email: babanakonstruksipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120152025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Patowonua','Patowonua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.509358333333333,120.889375,'https://www.google.com/maps?q=-3.509358333333333,120.889375',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/08/07/file-lokasi-fe484cb3-440b-4708-bf61-6df5463dcd25.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/07/file-lokasi-00c83fde-927b-4f0d-9f27-1a72154e27fb.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/07/file-lokasi-8f0eae08-1e32-42e8-a274-a052c124e7b3.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1e47b295-aea9-40a3-97bf-929378f76414',NULL,'rumah_subsidi','rumah_tapak','GRIYA BESTARI','sikumbang-kdi0710012025t003','GRIYA BESTARI oleh PT LIRAS BESTARI ADISABA (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Bunggasi; Telp: 08114038646; Email: bestariadisaba@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.9884029,122.48263490000001,'https://www.google.com/maps?q=-3.9884029,122.48263490000001',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/08/04/file-lokasi-691c3e42-4024-464a-87af-7c0be3fc100f.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/04/file-lokasi-5a6df1bf-44ba-416c-8d26-acb7e5f2c13e.jpg","https://sikumbang.tapera.go.id/public/upload/2025/08/04/file-lokasi-09ac423c-3cae-429f-91ed-6936038aab90.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a5342f7e-d75b-46a1-b988-b21814ed4ef4',NULL,'rumah_subsidi','rumah_tapak','AQILA RESIDENCE','sikumbang-kdi0610032025t001','AQILA RESIDENCE oleh PT ARAZ TRISULA MANDIRI (REI).
Alamat: Abeli, Kec. Abeli, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Oikumene; Telp: 085241813163; Email: fredif112@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0610032025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Abeli','Abeli','Abeli, Kec. Abeli, Kota Kendari, Sulawesi Tenggara',NULL,-3.986552777777778,122.58298611111111,'https://www.google.com/maps?q=-3.986552777777778,122.58298611111111',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/03/27/file-lokasi-aeb5a8e2-4772-4db7-9150-907aff93a915.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/03/27/file-lokasi-76ee5e94-4a19-4fc0-ae83-f0d787efee13.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/03/27/file-lokasi-cc25bac2-f00f-4947-a81a-8498d94cbcc0.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a5ea36e1-3c1a-4239-b544-c901dfa4cbe4',NULL,'rumah_subsidi','rumah_tapak','MUTIARA AINUN','sikumbang-lss0120072025t001','MUTIARA AINUN oleh PT BIRU ADITYA PERSADA (REI).
Alamat: Tojabi, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36/98 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Cengkeh Watuliwu; Telp: 082266077574; Email: ptbiruadityapersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120072025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Tojabi','Tojabi, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.511913,120.90222200000001,'https://www.google.com/maps?q=-3.511913,120.90222200000001',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/04/13/file-lokasi-db37072e-c406-4bf6-bdef-1c2d97ba4462.jpg","https://sikumbang.tapera.go.id/public/upload/2025/04/13/file-lokasi-c4140fbe-0c82-4a5a-9347-3d11ad615a1b.jpg","https://sikumbang.tapera.go.id/public/upload/2025/04/13/file-lokasi-fdbd78cf-81e7-46a7-9f70-3c52bbd143ce.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a155572f-ed1c-4cdf-a46a-4adf8bb0bb4b',NULL,'rumah_subsidi','rumah_tapak','GRIYA CITRA BARUGA','sikumbang-kdi0310012025t001','GRIYA CITRA BARUGA oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com; Web: https://maps.app.goo.gl/Q3kCemu1vxrhkF15A

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.053907861111111,122.5158615,'https://www.google.com/maps?q=-4.053907861111111,122.5158615',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/04/15/file-lokasi-2c14c412-0c83-4313-9815-53a602c75e9a.jpg","https://sikumbang.tapera.go.id/public/upload/2025/04/15/file-lokasi-93ece008-f832-4df8-8a3c-863fc40dda5d.jpg","https://sikumbang.tapera.go.id/public/upload/2025/04/15/file-lokasi-4262864c-be83-45c1-b518-b31fc11dea7f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4e2eca1e-a50e-4b58-8c22-89b1811024e3',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN NUR EMPAT TAHAP VI','sikumbang-kdi0410032025t002','PERUMAHAN NUR EMPAT TAHAP VI oleh PT USFADAH NUR EMPAT (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 114 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. LIAMBO KOMP. BTN II; Telp: 085333371835; Email: ptnurempat@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0399883999999995,122.55626239972221,'https://www.google.com/maps?q=-4.0399883999999995,122.55626239972221',173000000.0,'total',FALSE,2,1,36,114,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/05/01/file-lokasi-0be4be64-ba57-445d-827f-f7091abe6356.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/01/file-lokasi-180f0f00-90a2-4cf3-99fd-4af455c0aa90.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/01/file-lokasi-6155db4d-2e08-4239-b32d-c1dff9db46bb.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5df3341d-a192-43b1-8468-70f91d4c8a18',NULL,'rumah_subsidi','rumah_tapak','Watuliandu Hills','sikumbang-kka0410022025t001','Watuliandu Hills oleh PT BUMI MEKONGGA PROPERTY (REI).
Alamat: Watuliandu, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36/84 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Pemuda; Telp: 082132232224; Email: pt.bumimekonggaproperty2015@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410022025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Watuliandu','Watuliandu, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.05265,121.59989999999999,'https://www.google.com/maps?q=-4.05265,121.59989999999999',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/04/30/file-21342d8f-79cc-44c2-b472-344d6dd1aff1.jpg","https://sikumbang.tapera.go.id/public/upload/2025/04/30/file-822311d7-22ec-4579-b075-06540bff17bf.jpg","https://sikumbang.tapera.go.id/public/upload/2025/04/30/file-e0d8e04b-c6b9-4868-90b4-a0c3c4b918a7.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('caf290e4-753b-4ac8-ae73-fc608a042ccc',NULL,'rumah_subsidi','rumah_tapak','ISTANA CITY','sikumbang-kdi0410032025t003','ISTANA CITY oleh PT WAKUMORO JAYA PROPERTINDO (APERSI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. TINGGOLOLI; Telp: 085242467819; Email: kahar_uvri@yahoo.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.039091944444444,122.56027499999999,'https://www.google.com/maps?q=-4.039091944444444,122.56027499999999',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/05/02/file-lokasi-35906f81-61a1-4759-ac96-582cac438421.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/02/file-lokasi-9603d621-d12e-43a8-be74-958ae3ea3333.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/02/file-lokasi-0c03fa4e-70b6-4832-9592-7c869c173a66.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bb8760b3-7c85-41c7-b39e-c04df5a9a2b5',NULL,'rumah_subsidi','rumah_tapak','DANAPATI RESIDENCE','sikumbang-kdi0410032025t004','DANAPATI RESIDENCE oleh PT YUZAM GRIYA DEVELOPMENT (APERSI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. JAMBU,KEL. ANGGOEYA,KEC. POASIA; Telp: 082197170330; Email: yuzamgriyadevelopment@gmail.com; Web: WWW.SURGAHUNIAN.COM

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032025T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.01672,122.5604286111111,'https://www.google.com/maps?q=-4.01672,122.5604286111111',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/05/08/file-lokasi-05ae1387-9cf2-4258-90e2-dfe7506c7189.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/08/file-lokasi-d69dfb57-4545-48b3-ad31-bfe1813afbec.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/08/file-lokasi-6ca9a609-3977-4e20-a7b6-f35120da2d08.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0d640fc6-32da-4211-b710-621ed92aa325',NULL,'rumah_subsidi','rumah_tapak','PESONA ALAM KENDARI TAHAP 5','sikumbang-kdi0410032025t005','PESONA ALAM KENDARI TAHAP 5 oleh PT PRATAMA JAYA PROPERTI (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: PUURI TAMAN KENDARI; Telp: 082352623961; Email: pratamajayaproperti19@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032025T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.042658333333333,122.56076388888889,'https://www.google.com/maps?q=-4.042658333333333,122.56076388888889',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/07/16/fotoContoh-658e7722-16dc-40ac-8c4b-bcc76783ca45.JPG","https://sikumbang.tapera.go.id/public/upload/2025/07/16/fotoGerbang--afb72b9a-b1c6-497c-9f4e-ca846961c9e8.jpg","https://sikumbang.tapera.go.id/public/upload/2025/07/16/fotoTengah-5131276f-5b5d-423d-a33d-957a53f5a9e4.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f5a06964-905e-417c-ae15-dd98c034cd63',NULL,'rumah_subsidi','rumah_tapak','MARGAHAYU LAND KAMBU 3','sikumbang-kdi1010022025t001','MARGAHAYU LAND KAMBU 3 oleh PT MARGAHAYU MEGA UTAMA (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN SUSPU YUSUF; Telp: 0811405887; Email: margahayumega@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.034866666666667,122.54416666666667,'https://www.google.com/maps?q=-4.034866666666667,122.54416666666667',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/05/14/file-lokasi-4c682d5f-2ba7-4cab-86dc-b009320d637e.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/14/file-lokasi-66af7098-4813-408a-8c56-a103e84e88fc.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/14/file-lokasi-23a89c9d-c880-485b-8ba3-da89d4e02549.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('67e75341-2038-417c-9295-8cfee334be2c',NULL,'rumah_subsidi','rumah_tapak','SINTARO LAND','sikumbang-kdi0310072025t007','SINTARO LAND oleh PT SULTRA RAYA MANDIRI (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 35 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Ade Irma Nasution Perumahan SINTARO LAND Blok C ; Telp: 085341920400 ; Email: sultraraya421@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072025T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0314266,122.4934755,'https://www.google.com/maps?q=-4.0314266,122.4934755',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/05/11/file-lokasi-4538daae-3bd3-486d-b490-466bbb1332db.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/11/file-lokasi-d43251f7-5ce5-45c3-b53f-d3140895280d.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/11/file-lokasi-e905d72a-06f0-4559-ac15-1422fb359cb6.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('01b3f1aa-0d5d-4615-bf06-87a3feb7f352',NULL,'rumah_subsidi','rumah_tapak','AISYAH RESIDENCE 3','sikumbang-adl0820192025t002','AISYAH RESIDENCE 3 oleh PT ANNUR BERKAH PROPERTI (REI).
Alamat: Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 14 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 94.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Gersamata Desa Laikaha Kec. Ranomeeto; Telp: 085123238493; Email: berkahannur200@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820192025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Laikaha','Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.040578611111111,122.44985527777779,'https://www.google.com/maps?q=-4.040578611111111,122.44985527777779',173000000.0,'total',FALSE,2,1,36,94.5,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/05/15/file-lokasi-54afc0ac-7a05-4eb1-92d6-63491c45b453.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/15/file-lokasi-ccb5dbee-03db-4434-b419-e8e8031e9edf.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/15/file-lokasi-8193d5fb-4656-4949-864d-8e233e296a85.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0799f381-a284-4b4f-80f8-0929c3779b4b',NULL,'rumah_subsidi','rumah_tapak','ADNAN RESIDENCE','sikumbang-trw0520122025t001','ADNAN RESIDENCE oleh PT ADNAN MANDIRI PROPERTINDO (REI).
Alamat: Lambandia, Kec. Lambandia, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 185 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Poros Lambandia, Kel.Lambandia, Kec. Lambandia, Kab. Kolaka Timur; Telp: 081245591521; Email: smada2013@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0520122025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Lambandia','Lambandia','Lambandia, Kec. Lambandia, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.3012609444444445,121.91925047222223,'https://www.google.com/maps?q=-4.3012609444444445,121.91925047222223',173000000.0,'total',FALSE,2,1,36,185,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/01/17/file-lokasi-a1ace115-3c0a-45fd-b77c-2bb8e7084232.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/17/file-lokasi-a36aaddc-2598-4d38-a320-93e017910f74.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/17/file-lokasi-d5c38e66-05ac-44e9-9e06-01303e96d5d4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1f45b8d9-4c81-4346-8067-85fe04cfab96',NULL,'rumah_subsidi','rumah_tapak','RAPID ASRI MEKAR','sikumbang-kdi0810012025t001','RAPID ASRI MEKAR oleh PT RAPID CAHAYA LAND (REI).
Alamat: Kadia, Kec. Kadia, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN SWADAYA; Telp: 082111100515; Email: pt.rapidcahayaland@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0810012025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kadia','Kadia','Kadia, Kec. Kadia, Kota Kendari, Sulawesi Tenggara',NULL,-3.9760750000000002,122.49485638888889,'https://www.google.com/maps?q=-3.9760750000000002,122.49485638888889',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/05/09/file-lokasi-d7c5baea-5fbd-4e33-bfd9-6ee9f32240e2.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/09/file-lokasi-f2c399b7-cc04-4cfa-b74f-90856aed72ef.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/09/file-lokasi-118b5560-041a-4b1b-8819-fba449900778.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5b34c01e-8164-4d67-b814-1fd50b40ed5f',NULL,'rumah_subsidi','rumah_tapak','Riketeng Residence By Jagakarsa','sikumbang-lss0120092025t001','Riketeng Residence By Jagakarsa oleh PT JAGAKARSA ZHAKI THREPOWERS (HIMPERRA).
Alamat: Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36/84 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. Trans Sulawesi, Watuliwu; Telp: 082177771300; Email: jagakarsatripower@gmail.com; Web: 0

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120092025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Watuliwu','Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.5008396,120.890049,'https://www.google.com/maps?q=-3.5008396,120.890049',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/05/22/file-lokasi-b9e2bf95-253d-436b-a725-d1405efe834c.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/05/22/file-lokasi-8c2e1c36-49c9-4b96-a248-7f6c569dad32.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/05/22/file-lokasi-1d45b474-7b60-4c71-9793-4f8e1b69e700.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('95b50083-3a37-435a-853c-d6e7685a1e9a',NULL,'rumah_subsidi','rumah_tapak','IKAY RESIDENCE I','sikumbang-kdi0910022025t002','IKAY RESIDENCE I oleh PT IKAY MANDIRI GROUP (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 39 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. KONGGOASA KEL. WATULONDO KEC. PUUWATU KOTA KENDARI; Telp: 081222206992; Email: ptikaymandirigroup@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9512543,122.4713145,'https://www.google.com/maps?q=-3.9512543,122.4713145',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/05/20/file-lokasi-0c03fe98-3e09-4d9b-bbb6-baa6a2b2351d.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/20/file-lokasi-2b9f391b-aacb-4e4a-93d9-a6bfa24707db.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/20/file-lokasi-b46a0b5e-6d11-45d1-9c1b-b1afc97f66be.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9aeba418-7d3a-4a08-ab28-f36b89cdc505',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN PERSEN CITY','sikumbang-kdi0910022025t003','PERUMAHAN PERSEN CITY oleh PT ARAF SEMBILAN SEMBILAN CORP (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 25 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.HURAMI; Telp: 0811805499; Email: pt.arafsembilansembilancorp@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.95,122.48333333333333,'https://www.google.com/maps?q=-3.95,122.48333333333333',173000000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/05/24/file-lokasi-af12a645-5394-4ea2-8f6b-c6914f9e7f82.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/24/file-lokasi-198cf4a9-bf3d-4b71-bde3-7272f086a06b.jpg","https://sikumbang.tapera.go.id/public/upload/2025/05/24/file-lokasi-9678bea1-534c-47d8-99bb-cf8890ef737e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('493726e0-1a75-4d25-ba0d-9ea883d5b76e',NULL,'rumah_subsidi','rumah_tapak','AWAL REGENCY I TAHAP II','sikumbang-adl0820152025t001','AWAL REGENCY I TAHAP II oleh PT AWAL UTAMA GROUP (REI).
Alamat: Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat:  JL SERMA TNI AU BLOK A7 Desa/Kelurahan Ranooha Kecamatan Ranomeeto Kabupaten Konawe Selatan Provinsi Sulawesi Tenggara; Telp: 082260539442; Email: ptawalutamagroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820152025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranooha','Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.053287799722222,122.44196879972223,'https://www.google.com/maps?q=-4.053287799722222,122.44196879972223',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/06/02/file-lokasi-b12031bc-388f-4f22-a3d1-98f6b03dca99.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/02/file-lokasi-20b430c7-3c75-417a-b500-22180d8f5fb6.jpg","https://sikumbang.tapera.go.id/public/upload/2025/06/02/file-lokasi-b04322d6-c491-4b87-a76f-68b80fc4ad12.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('771ecfd4-600b-44f3-9195-bd8ce34a06f9',NULL,'rumah_subsidi','rumah_tapak','RIZKY REGENCY','sikumbang-kdi0410062025t001','RIZKY REGENCY oleh PT BAZPROPER SUKSES INDONESIA (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 44 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL PATTIMURA TERMINAL LAMA; Telp: 082372863011; Email: bazproper15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410062025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.009166666666666,122.56714722222222,'https://www.google.com/maps?q=-4.009166666666666,122.56714722222222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/03/06/file-lokasi-c48a8de0-df33-402e-a482-095801194701.JPG","https://sikumbang.tapera.go.id/public/upload/2025/03/06/file-lokasi-64c35b03-6799-4245-af34-cb1407136aee.JPG","https://sikumbang.tapera.go.id/public/upload/2025/03/06/file-lokasi-3add43a7-d19c-4547-9721-246a850c4066.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1915e9e4-8056-4472-a101-83d3745ba7ea',NULL,'rumah_subsidi','rumah_tapak','BARUGA HARMONI 4','sikumbang-kdi0710042025t001','BARUGA HARMONI 4 oleh PT RASYA DWI MANDIRI (APERSI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 100 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL CHAIRIL ANWAR BUILDING HARMONI KAV 7; Telp: 085241655027; Email: rasyadwimandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.012944444444445,122.49373055555556,'https://www.google.com/maps?q=-4.012944444444445,122.49373055555556',173000000.0,'total',FALSE,2,1,36,100,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/02/21/file-lokasi-2d57da82-0e36-4f93-91c1-9ab3e23a91a1.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/21/file-lokasi-fea9062c-e01e-434f-9384-20da4c3b6007.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/21/file-lokasi-9e0e3d1c-f69c-45cc-a357-54e821b300f6.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('85d08883-4a86-4ab2-900c-b4ae5f286fa3',NULL,'rumah_subsidi','rumah_tapak','VILLA MAHKOTA 4','sikumbang-bau0210072025t002','VILLA MAHKOTA 4 oleh PT ANDROMEDA BANGUN PERKASA (HIMPERRA).
Alamat: Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 28 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Bukit ABRI Perumahan Villa Mahkota Blok E ; Telp: 081341637619; Email: andromedabangunperkasa1926@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210072025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Kadolo Katapi','Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.477196194444445,122.62163541666666,'https://www.google.com/maps?q=-5.477196194444445,122.62163541666666',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-439e8911-0c11-439d-bb09-bb37b594eaeb.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-6667a5bb-362e-4033-bd33-aaf57eb14988.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-8f6e1b66-6293-41f3-9015-0109205d5887.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b60f3653-ce7c-470b-8063-af472f2c6a85',NULL,'rumah_subsidi','rumah_tapak','ALDZAKIY RESIDENCE 2','sikumbang-kdi0410042025t002','ALDZAKIY RESIDENCE 2 oleh PT ALDZAKIY JAYA SULTRA (APERSI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.LINGKUNGAN PADA JL KAYU MANIS, SULAWESI TENGGARA, KOTA KENDARI, Poasia, Rahandouna; Telp: 085242536770; Email: PT.aldzakiyjayasultra@mailnesia.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.035578199722222,122.56038839972221,'https://www.google.com/maps?q=-4.035578199722222,122.56038839972221',173000000.0,'total',FALSE,2,1,36,97.5,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/01/22/file-2d5b3b99-7086-4e2f-8f1b-b7049bc45b77.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/22/file-735326f4-6f2a-4358-b4c8-0dfe7bc9d1e5.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/22/file-d92018db-594a-4e58-bfa3-6a52ed20c6c5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('236a8f91-770d-4ebf-972b-5b93dbcddfd1',NULL,'rumah_subsidi','rumah_tapak','DJAVINO RESIDENCE 8','sikumbang-kdi0310072025t002','DJAVINO RESIDENCE 8 oleh PT DJAVINO GRUP INDONESIA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 633 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Ade Irma Nasution Kel. Watu Bangga Kota Kendari Sulawesi Tenggara; Telp: 082368884546; Email: djavinogroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.019535199722222,122.482027,'https://www.google.com/maps?q=-4.019535199722222,122.482027',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-eccdf59c-ecd0-47c9-be1b-2c0f59b127ed.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-8d24810f-ff75-41ec-89d9-7661c2e3cbb1.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-ddb3e9ec-25e3-49bd-8acf-b0b3fa7ed90c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e1ba7a67-4198-4542-9ff7-b7095bdbd69b',NULL,'rumah_subsidi','rumah_tapak','DJAVINO RESIDENCE VII TAHAP 2','sikumbang-kdi0310072025t001','DJAVINO RESIDENCE VII TAHAP 2 oleh PT DJAVINO GRUP INDONESIA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Ade Irma Nasution Kel. Watu Bangga Kota Kendari Sulawesi Tenggara; Telp: 082368884546; Email: djavinogroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.019535199722222,122.482027,'https://www.google.com/maps?q=-4.019535199722222,122.482027',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-a58f335d-a2d7-434e-be95-0ba7bb1d2e9a.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-084c9edc-b5fb-4f25-8cdb-5a23f828e8a9.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-16cb1b9d-bd00-4cd1-9eb1-0fc91eda27fb.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2f155a73-eebe-4a1f-8a25-0ef324d7865c',NULL,'rumah_subsidi','rumah_tapak','PURI MEGA AMALIAH II','sikumbang-kdi0910062025t001','PURI MEGA AMALIAH II oleh PT MEGA BENAA PROPERTY (HIMPERRA).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 30 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. dr. Soetomo, Kompleks Perumahan Puri Mega Amaliah; Telp: 081291752766; Email: kamaluddin2024kdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.953652777777778,122.502425,'https://www.google.com/maps?q=-3.953652777777778,122.502425',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/02/26/file-lokasi-1b504a2c-5c28-40f6-96cb-8c0d1cc5c984.JPG","https://sikumbang.tapera.go.id/public/upload/2025/02/26/file-lokasi-ce25620a-7dfe-41b1-a74c-a47a3dba5643.JPG","https://sikumbang.tapera.go.id/public/upload/2025/02/26/file-lokasi-52ee4cd6-0bb4-4158-97ba-e25e1cd59ee9.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('90da5c1c-fee1-4991-b7bf-094062cf6733',NULL,'rumah_subsidi','rumah_tapak','RINSU RESIDENCE','sikumbang-kdi0910012025t001','RINSU RESIDENCE oleh PT RINSU GROUP INDONESIA (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Puwatu Jl Prof Myamin, nomor 01, SULAWESI TENGGARA, KOTA KENDAR; Telp: 082246740049; Email: rinsugroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9616722222222225,122.46560000000001,'https://www.google.com/maps?q=-3.9616722222222225,122.46560000000001',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/02/27/file-lokasi-a212c857-ce58-4a73-889b-c38b108332b6.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/27/file-lokasi-a30cd492-0024-45db-a644-9673d527640f.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/02/27/file-lokasi-5b19ae77-19bf-454e-987d-dbb5ed354b2e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2719239d-e9e9-4fa1-832c-73bcb413c64b',NULL,'rumah_subsidi','rumah_tapak','GRIYA 21 BANTENG TAHAP II','sikumbang-kdi0410042025t003','GRIYA 21 BANTENG TAHAP II oleh PT REZKY MEGA PROPERTI (HIMPERRA).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN KENDARI PERMAI BLOK B1. NO. 7; Telp: 082280158228; Email: diunnzulfa@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.028074799722222,122.55857369972222,'https://www.google.com/maps?q=-4.028074799722222,122.55857369972222',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/02/13/file-lokasi-2ce48e05-b663-490c-a496-d41b9b9338ea.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/13/file-lokasi-99041364-0c30-40e6-aabe-7634e6258e9e.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/13/file-lokasi-c0b96b32-d998-4b5e-84a2-966a08de30bd.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1bf8aa73-611c-420d-bce8-8a11d9b6f3d3',NULL,'rumah_subsidi','rumah_tapak','GREEN ANUGERAH REGENCY 3','sikumbang-kdi0410052025t001','GREEN ANUGERAH REGENCY 3 oleh PT PUTRA ANUGERAH PROPERTINDO (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 29 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan Green Anugerah Regency Blok C; Telp: 082228889225; Email: putraanugerahpropertindo.pt@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0044925,122.56555444444444,'https://www.google.com/maps?q=-4.0044925,122.56555444444444',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/03/05/file-ead9621e-2788-4614-9575-a49d18a98dad.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/05/file-8949bfb6-ada1-4f3f-a21d-1ea3315ad10b.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/05/file-a3d32552-67b5-4d40-b7cb-5c1570b03c95.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2af3f91e-1528-4f04-b35a-dd1a89548dcb',NULL,'rumah_subsidi','rumah_tapak','GRIYA CITRA WATUBANGGA','sikumbang-kdi0310072025t004','GRIYA CITRA WATUBANGGA oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 29 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com; Web: https://maps.app.goo.gl/FpJdQa6aFc5ofXWVA

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072025T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.03290175,122.47621152777778,'https://www.google.com/maps?q=-4.03290175,122.47621152777778',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/03/06/file-lokasi-5627ed4f-c190-4659-838d-9c6fc3504fac.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/06/file-lokasi-5b16a967-9806-493e-a402-220c7969878b.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/06/file-lokasi-514a5b91-425c-481d-a490-3715d1a2ec7c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8733285e-178d-4d4e-828c-04ae4b774d7e',NULL,'rumah_subsidi','rumah_tapak','AMARTHA TOWN HOUSE','sikumbang-adl0820192025t001','AMARTHA TOWN HOUSE oleh PT JIRUNA AKUSARA MESARI (APERSI).
Alamat: Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 60 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 99 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Desa Laikaaha; Telp: 081238486059; Email: pt.jirunaakusaramesari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820192025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Laikaha','Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.040791666666666,122.45491111111112,'https://www.google.com/maps?q=-4.040791666666666,122.45491111111112',173000000.0,'total',FALSE,2,1,36,99,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/03/11/file-lokasi-6fe7235c-fd32-46f6-b074-68f9736353c2.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/11/file-lokasi-bb359791-3e7b-4ef8-9126-04ed91341a76.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/11/file-lokasi-d50551ad-b7cb-4806-a1b6-697a418e0729.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('40b67f40-5015-4996-b09f-5cdc4ace2663',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN SUKARIA RESIDENCE','sikumbang-kdi0410052025t002','PERUMAHAN SUKARIA RESIDENCE oleh PT RAFAS SUKARIA UTAMA (HIMPERRA).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN UNHALU, BLOK X, NO. 37, KEL. KAMBU, KEC. KAMBU, KOTA KENDARI; Telp: 081341695231; Email: pt.rafassukariautama@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0031027777777775,122.55998055555555,'https://www.google.com/maps?q=-4.0031027777777775,122.55998055555555',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/03/05/file-5178a3fb-6ae0-430b-a6f9-a37ead886d23.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/05/file-a985a167-7ec3-404c-ac13-a0a7e903bc6e.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/05/file-b0f4dba2-3387-482f-994f-62ed76598e2b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fde265fa-3ab6-43c7-aed2-35f47b4512b1',NULL,'rumah_subsidi','rumah_tapak','ZAVIER ANUGRAH RESIDENCE TAHAP 2','sikumbang-kdi0710042025t002','ZAVIER ANUGRAH RESIDENCE TAHAP 2 oleh PT LASEGO PUTRA MANDIRI (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 64 subsidi / 5 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL TUNGGALA DALAM BAITO BTN ZAVIER ANUGRAH RESIDENCE ; Telp: 082348311691; Email: lasegoputra@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042025T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.002552777777778,122.47856944444445,'https://www.google.com/maps?q=-4.002552777777778,122.47856944444445',173000000.0,'total',FALSE,2,1,36,97.5,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/03/13/file-lokasi-6c95fbea-c155-434e-8c74-e7f2bf6bd594.JPG","https://sikumbang.tapera.go.id/public/upload/2025/03/13/file-lokasi-b8f8a269-e46d-4b1e-a7e4-8fc2f86b7696.JPG","https://sikumbang.tapera.go.id/public/upload/2025/03/13/file-lokasi-688591d9-9840-4fcd-a564-3b9e2c6eec61.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b41b3d69-313d-44e7-94e4-0bc8af360e68',NULL,'rumah_subsidi','rumah_tapak','CITRA PURI PRADANA','sikumbang-kdi0710012025t001','CITRA PURI PRADANA oleh PRADANA GROUP INDONESIA (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- CITRA PURI PRADANA (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BUDI UTOMO BARU; Telp: 082231810164; Email: innadafa16@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.9910277777777776,122.48097222222222,'https://www.google.com/maps?q=-3.9910277777777776,122.48097222222222',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/03/14/file-lokasi-6db5ca1b-f35d-4956-8897-ad51afee0508.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/14/file-lokasi-07b217d5-4ead-4768-9a18-f03c5fb5c9dc.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/14/file-lokasi-4cd6663a-d938-47ba-9d7f-33260705bc51.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2dbb0360-1f30-4a91-a4e5-840aedab8f8b',NULL,'rumah_subsidi','rumah_tapak','MEGA BOLA RESIDANCE 2','sikumbang-lss0110012025t001','MEGA BOLA RESIDANCE 2 oleh PT MEGA BOLA MASAGENA (HIMPERRA).
Alamat: Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36/tapak (Subsidi): Rp 173.000.000, LB 36 m2 / LT 78 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Griya Bintang Elegan; Telp: 0811401970; Email: hijau.daunsagi79@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0110012025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Lasusua','Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.5083333333333333,120.89611111111111,'https://www.google.com/maps?q=-3.5083333333333333,120.89611111111111',173000000.0,'total',FALSE,2,1,36,78,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/04/08/file-fbbc24b9-62f6-4a77-a520-c64aeb90c8b3.jpg","https://sikumbang.tapera.go.id/public/upload/2025/04/08/file-306cb358-cc83-4935-9971-7ed7f22b889f.jpg","https://sikumbang.tapera.go.id/public/upload/2025/04/08/file-1bcb1ec7-e265-4121-841e-b57702b9e222.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fd33dda7-3734-4dd1-acd7-1ae2aa1c749c',NULL,'rumah_subsidi','rumah_tapak','MADINAH CITY SQUARE VI','sikumbang-kdi0310072025t006','MADINAH CITY SQUARE VI oleh PT SWARNA DWIPA PROPERTY (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 92.3 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Sao Sao, Bende, Kec. Kadia, Kota Kendari, Sulawesi Tenggara; Telp: 082199714654; Email: ptswarnadwipaproperty@gmail.com; Web: https://swarnadwipaproperty.com/

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072025T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.028088889999112,122.48822778001883,'https://www.google.com/maps?q=-4.028088889999112,122.48822778001883',173000000.0,'total',FALSE,2,1,36,92.3,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/04/09/file-d797543a-0677-45f6-ad12-02d4b9dd316d.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/04/09/file-91db8237-430e-434c-aa06-b06a2539340a.jpeg","https://sikumbang.tapera.go.id/public/upload/2025/04/09/file-be1b79c9-1768-4a6d-8101-7032d4e6d8a3.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('be79429e-f0d2-4fe7-b767-d3260f978495',NULL,'rumah_subsidi','rumah_tapak','DJAVINO RESIDENCE V TAHAP 2','sikumbang-kdi0310072025t005','DJAVINO RESIDENCE V TAHAP 2 oleh PT DJAVINO GRUP INDONESIA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Ade Irma Nasution Kel. Watu Bangga Kota Kendari Sulawesi Tenggara; Telp: 082368884546; Email: djavinogroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072025T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.019535199722222,122.482027,'https://www.google.com/maps?q=-4.019535199722222,122.482027',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/03/17/file-lokasi-aa28eb1c-c64d-47b1-a8ab-42ca71fe4be4.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/17/file-lokasi-8acf7f40-ed81-4f41-9b34-27dd43873b33.jpg","https://sikumbang.tapera.go.id/public/upload/2025/03/17/file-lokasi-cb781fa3-b4e1-451a-8715-9ff7c9e7b2d5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bbff2782-6b46-4916-a785-18cc8e448dcc',NULL,'rumah_subsidi','rumah_tapak','DJAVINO RESIDENCE VI TAHAP 2','sikumbang-kdi0310072025t003','DJAVINO RESIDENCE VI TAHAP 2 oleh PT DJAVINO GRUP INDONESIA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Ade Irma Nasution Kel. Watu Bangga Kota Kendari Sulawesi Tenggara; Telp: 082368884546; Email: djavinogroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072025T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.019535199722222,122.482027,'https://www.google.com/maps?q=-4.019535199722222,122.482027',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-96784242-56fe-49aa-b486-1b6869e87434.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-bc56e394-ab2b-415e-9af0-e2f321881b4e.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/25/file-lokasi-b4904463-7c13-429c-959f-6a3f81efb92f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('27e8c5a8-b03c-4afd-be3f-70bfde894613',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN ASYRAF PERDANA RESIDENCE','sikumbang-kdi0910022024t018','PERUMAHAN ASYRAF PERDANA RESIDENCE oleh PT SUMBER MEGA DEVELOPERS (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Lalombaku ; Telp: 081210962596; Email: Sumbermegadevelopers@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T018 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9812555555555558,122.48613888888889,'https://www.google.com/maps?q=-3.9812555555555558,122.48613888888889',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/11/08/file-c9255237-79d2-4cdf-8de8-51f86eeaec89.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/08/file-20c73b52-c0ff-4b95-a8df-c086183e2b07.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/08/file-3eed3e9a-07c4-4ca6-aa0a-62a0e4caf2be.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e1312041-c73a-43ec-8e42-fe199d787ee2',NULL,'rumah_subsidi','rumah_tapak','BINTANG MASAGENA 2','sikumbang-lss0110012024t003','BINTANG MASAGENA 2 oleh PT MEGA BOLA MASAGENA (HIMPERRA).
Alamat: Tojabi, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- Rumah Tapak (Subsidi): Rp 173.000.000, LB 36 m2 / LT 78 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN GRIYA BINTANG ELEGAN; Telp: 0811401970; Email: hijau.daunsagi79@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0110012024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Tojabi','Tojabi, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.516618499722222,120.9053741,'https://www.google.com/maps?q=-3.516618499722222,120.9053741',173000000.0,'total',FALSE,2,1,36,78,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/11/14/file-lokasi-8af72a14-52d9-40b3-b849-0687ed8495e9.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/14/file-lokasi-78ee6a9e-f91c-4573-a50e-cd5822ceed12.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/14/file-lokasi-014cb092-22e0-4428-b9af-9b5638248d1e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('eecd40a3-ec2e-463d-b6ea-a1667476440f',NULL,'rumah_subsidi','rumah_tapak','TINGGOLOLI RESIDENCE','sikumbang-kdi0410032024t003','TINGGOLOLI RESIDENCE oleh PT SINAR PRIBUMI GRUP (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. HALUOLEO; Telp: 085241515081; Email: suben422@Gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.041257777777778,122.56266305555555,'https://www.google.com/maps?q=-4.041257777777778,122.56266305555555',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/09/19/fotoContoh-fb937740-4a85-44e0-a1fa-a00f26c12744.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/19/fotoGerbang--8eff85fe-8bfd-477b-b8dd-f22cf2f55dd3.jpg","https://sikumbang.tapera.go.id/public/upload/2025/09/19/fotoTengah-e9416757-023e-4490-b282-d1502f8c43ed.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('01836cb4-46e8-4163-a464-a4fce02e7139',NULL,'rumah_subsidi','rumah_tapak','AZALIA ZAKI HILLS','sikumbang-kdi0710012024t005','AZALIA ZAKI HILLS oleh PT AZALIA ZAKI RESIDENS (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 18 subsidi / 2 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BUDI UTOMO BARU WUA-WUA; Telp: 087842059525; Email: pt.azaliazakir@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012024T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.9888194444444447,122.48487777777778,'https://www.google.com/maps?q=-3.9888194444444447,122.48487777777778',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/11/26/file-lokasi-e19b30c4-1d75-43fe-be9a-addd8723aeb1.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/26/file-lokasi-d7fcccd6-88b8-4d7b-b5bc-fbe30ce7aa6f.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/26/file-lokasi-cd7bcc28-745f-4656-95a7-6d6905f6b01d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('11803a87-75e7-4735-9974-8f6a3f18b4c9',NULL,'rumah_subsidi','rumah_tapak','Trimitra Bukit Baruga','sikumbang-kdi0310072024t008','Trimitra Bukit Baruga oleh PT TRIMITRA PRAWARA (IKADERI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 144 m2, 2 KT / 1 KM, 1 lantai.
- 36A (Subsidi): Rp 173.000.000, LB 36 m2 / LT 138 m2, 1 KT / 1 KM, 1 lantai.
- 36B (Subsidi): Rp 173.000.000, LB 36 m2 / LT 141 m2, 2 KT / 1 KM, 1 lantai.
- 36C (Subsidi): Rp 173.000.000, LB 36 m2 / LT 145 m2, 2 KT / 1 KM, 1 lantai.
- 36D (Subsidi): Rp 173.000.000, LB 36 m2 / LT 152 m2, 2 KT / 1 KM, 1 lantai.
- 36E (Subsidi): Rp 173.000.000, LB 36 m2 / LT 159 m2, 2 KT / 1 KM, 1 lantai.
- 36F (Subsidi): Rp 173.000.000, LB 36 m2 / LT 166 m2, 2 KT / 1 KM, 1 lantai.
- 36 G (Subsidi): Rp 173.000.000, LB 36 m2 / LT 158 m2, 2 KT / 1 KM, 1 lantai.
- 36H (Subsidi): Rp 173.000.000, LB 36 m2 / LT 165 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Lingkungan pada jalan simbo perumahan trimitra bukit baruga ; Telp: 085497032539; Email: trimitrabaruga@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072024T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.029234722222222,122.47495388888889,'https://www.google.com/maps?q=-4.029234722222222,122.47495388888889',173000000.0,'total',FALSE,2,1,36,144,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/10/23/file-f5b0bb57-3ac3-48b0-8aa5-8df971b19482.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/23/file-bb6fb71b-9cb0-442f-a1ff-f58a440cb37d.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/23/file-350d5d3d-e622-469a-86d0-01516898fdd8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('da6339f0-d503-4724-9786-84f9ec17f172',NULL,'rumah_subsidi','rumah_tapak','MAHIYA RESIDENCE','sikumbang-rah1510042024t001','MAHIYA RESIDENCE oleh PT PUTRI SYAFIKA SEJAHTERA (HIMPERRA).
Alamat: Laiworu, Kec. Batalaiworu, Kab Muna, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36/112 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan kulidawa, Kelurahan Laiworu, Kecamatan Batalaiworu, Kabupaten Muna; Telp: 082394493813; Email: mahiyarecidence@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/RAH1510042024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Muna','Kab Muna','Batalaiworu','Laiworu','Laiworu, Kec. Batalaiworu, Kab Muna, Sulawesi Tenggara',NULL,-4.8172137,122.7150389,'https://www.google.com/maps?q=-4.8172137,122.7150389',173000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/11/10/file-4d163f0a-7645-4679-8fda-36e4a9d97359.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/10/file-1eb3c9c3-123c-44bf-aa54-36caed06bab9.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/10/file-87c1eb51-0a58-48cd-a753-f8c8c006c61e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a64df71a-4517-41d9-adf1-ee584b7d8af0',NULL,'rumah_subsidi','rumah_tapak','PESONA ALAM KENDARI TAHAP 4','sikumbang-kdi0410032024t002','PESONA ALAM KENDARI TAHAP 4 oleh PT KARITAS AGRO PRATAMA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.040091666666666,122.56101111111111,'https://www.google.com/maps?q=-4.040091666666666,122.56101111111111',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/12/20/fotoContoh-a1a57cee-dadb-49d4-83f7-7d18e41f7f00.jpg","https://sikumbang.tapera.go.id/public/upload/2024/12/20/fotoGerbang--0c88516b-74a8-4db0-b553-da52bc34122f.jpg","https://sikumbang.tapera.go.id/public/upload/2024/12/20/fotoTengah-248613a9-b91d-4963-b75e-a301dfc496af.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('927256e0-4dc7-412b-bbae-b0ac55e27ad7',NULL,'rumah_subsidi','rumah_tapak','FAHMI RESIDENCE 2 TAHAP 2','sikumbang-adl0810012024t001','FAHMI RESIDENCE 2 TAHAP 2 oleh PT PERMATA TIRTA JAYA (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36/ 104 (Subsidi): Rp 170.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- Subsidi 36/ 104 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kapten Piere Tendean No. 27 Kel. Baruga Kec. Baruga Kota Kendari; Telp: 081342813438; Email: cecepanshory@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.040891666666667,122.45732222222223,'https://www.google.com/maps?q=-4.040891666666667,122.45732222222223',170000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/11/29/file-lokasi-c4363b6b-4471-4287-ac52-a1bca66831ff.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/29/file-lokasi-bfbcc902-44d2-4fb1-b351-bb1153afdf97.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/29/file-lokasi-0969bc22-bbcb-4ff8-9522-0f43030cba58.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('85dc2568-9edd-4012-8df6-8c86b70b87de',NULL,'rumah_subsidi','rumah_tapak','FAHMI RESIDENCE 4','sikumbang-adl0820172024t002','FAHMI RESIDENCE 4 oleh PT PERMATA TIRTA JAYA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI 36/ 97.5 (Subsidi): Rp 170.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- Subsidi 36/ 97.5 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kapten Piere Tendean No. 27 Kel. Baruga Kec. Baruga Kota Kendari; Telp: 081342813438; Email: cecepanshory@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.051847222222222,122.47483333333334,'https://www.google.com/maps?q=-4.051847222222222,122.47483333333334',170000000.0,'total',FALSE,2,1,36,97.5,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/11/29/file-lokasi-aa5795d8-6e71-417c-85d2-d654f0edc7b2.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/29/file-lokasi-4a49c478-2041-4edd-903f-1da2780a80e3.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/29/file-lokasi-ff79c021-66f4-4a62-9598-68d21c02254c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d4dc48bb-0fb7-4cf7-a22e-1edee74c5365',NULL,'rumah_subsidi','rumah_tapak','VILLA MADINA LAND','sikumbang-kdi0410032025t001','VILLA MADINA LAND oleh PT GETRACO TIMUR PERSADA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 50 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 92.3 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Sao Sao; Telp: 085242016538; Email: getracotimurpersada@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0520436,122.5613407,'https://www.google.com/maps?q=-4.0520436,122.5613407',173000000.0,'total',FALSE,2,1,36,92.3,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/01/03/file-lokasi-2064da28-cb5c-4011-81b2-73f2aca134fb.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/03/file-lokasi-d77973ef-5c2a-485d-b582-5b11003caf35.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/03/file-lokasi-b48a6a80-0ca0-47e3-96e7-8bd163510483.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('acf6d578-2e42-412c-9639-793fce3ac574',NULL,'rumah_subsidi','rumah_tapak','TIMAKO RESIDENCE','sikumbang-bau0210072025t001','TIMAKO RESIDENCE oleh YUDIS HD (APERNAS).
Alamat: Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36/96 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BONEKOM; Telp: 081241439268; Email: fando26februari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210072025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Kadolo Katapi','Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.463705555555555,122.63675555555557,'https://www.google.com/maps?q=-5.463705555555555,122.63675555555557',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/01/03/file-lokasi-3052fd43-134e-4269-af9b-13883ff7ddfa.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/03/file-lokasi-571c7930-a368-4300-80a8-82f6c86e6274.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/03/file-lokasi-d7e25bae-7837-4202-b287-6b123e58fd0b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a423376a-5c2b-4a4f-8723-d169e3196fbf',NULL,'rumah_subsidi','rumah_tapak','MUNANDO REGENCY','sikumbang-kdi0410042025t001','MUNANDO REGENCY oleh PT MUNANDO BARAKATI MANDIRI (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. H. Lamuse (Perumahan  BTN GREEN SILVA MAS BLOK B No. 2); Telp: 085241664211; Email: adhammalikdandi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.0216747,122.5530976,'https://www.google.com/maps?q=-4.0216747,122.5530976',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/01/16/file-lokasi-05152fe8-b658-47f2-8181-8ea63fb70ad5.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/16/file-lokasi-c669fa65-93d4-4ba2-b833-67987b2dbe27.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/16/file-lokasi-0513cfb7-68a8-40e6-82f6-d993690d1731.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e492d484-f9a4-49b6-92ea-c655e9cdf923',NULL,'rumah_subsidi','rumah_tapak','GRIYA ULU WOLO','sikumbang-kka1010072025t001','GRIYA ULU WOLO oleh PT AMANAH GRAHA ASRINUSA (APERSI).
Alamat: Ulu Wolo, Kec. Wolo, Kab Kolaka, Sulawesi Tenggara.
Total unit: 27 subsidi / 0 komersil.

Tipe rumah:
- 36 kopel (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl. waro; Telp: 082259080357; Email: raldyrauf@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1010072025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Wolo','Ulu Wolo','Ulu Wolo, Kec. Wolo, Kab Kolaka, Sulawesi Tenggara',NULL,-3.8166666666666664,121.26666666666667,'https://www.google.com/maps?q=-3.8166666666666664,121.26666666666667',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/01/13/file-lokasi-a551977d-88df-4bdc-b053-62e7e81b294b.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/13/file-lokasi-8ac854ab-ca94-4985-b7dd-3cf1a9c7523c.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/13/file-lokasi-60c99b4a-39de-443d-a8b5-e11944470863.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('569aa5ac-53f5-4366-8293-de0004ca1661',NULL,'rumah_subsidi','rumah_tapak','KOTA PRAJA 2 KENDARI','sikumbang-kdi1010032025t001','KOTA PRAJA 2 KENDARI oleh PT HARWIN JAYA BAROKAH PROPERTY (HIMPERRA).
Alamat: Padaleu, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 89 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Praja Boulevard ; Telp: 085398786061; Email: jayaharwin@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010032025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Padaleu','Padaleu, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.0314845,122.52161359972222,'https://www.google.com/maps?q=-4.0314845,122.52161359972222',173000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/01/23/file-lokasi-89b72a77-00f6-4c27-9f5e-2e58d8dcdd94.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/23/file-lokasi-1f6395bc-f94e-40a1-b755-9f9baff399e5.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/23/file-lokasi-7ed42bff-cc43-4b90-9029-da6e7f7c14dd.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6c7892b4-40f6-453b-b3b5-9cad4caaf9e6',NULL,'rumah_subsidi','rumah_tapak','Deneta Residence 6','sikumbang-adl0810012025t001','Deneta Residence 6 oleh PT ANUGERAH JAYA BUNDA (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Mandiri, PR. Deneta Residence Blok D; Telp: 085397601437; Email: ptanugerahjayabunda@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.047797194444445,122.45742033333333,'https://www.google.com/maps?q=-4.047797194444445,122.45742033333333',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/01/22/file-lokasi-aa761161-9669-4e8c-8e38-f5a52b662e9a.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/22/file-lokasi-3d55da39-6749-4367-8bdf-8d4a3c352a1b.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/22/file-lokasi-4df63b49-f5a8-4adf-8ac2-e3367d8dbd41.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('93c80c57-13f6-4e0f-b330-c21ef8cd406d',NULL,'rumah_subsidi','rumah_tapak','TJARAKA ESTATE','sikumbang-kdi0910032025t001','TJARAKA ESTATE oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Syech Yusuf; Telp: 082293198772; Email: Yusharisharm@gmail.com; Web: https://g.co/kgs/7pPZXwZ

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9662640000000002,122.49453733333334,'https://www.google.com/maps?q=-3.9662640000000002,122.49453733333334',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/02/13/file-lokasi-169da3fa-7f11-4084-bc3e-cce73494ffcc.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/13/file-lokasi-2ba31a95-4d03-4b15-8bc5-b3476c47097e.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/13/file-lokasi-020e49d4-0d2e-4e9f-bf82-2106dfa25de5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6667d3fc-6a74-49e4-a131-fe26b831b2a5',NULL,'rumah_subsidi','rumah_tapak','OGI RESIDENCE','sikumbang-kka0720042025t001','OGI RESIDENCE oleh PT YUKO AMANDA KONSTRUKSI (REI).
Alamat: Pelambua, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 24 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BADEWI NO. 34 KOLAKA, KEL. BALANDETE, KEC. KOLAKA, KAB. KOLAKA SULAWESI TENGGARA; Telp: 085241674114; Email: yukoamandakonstruksi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720042025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Pelambua','Pelambua, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.178537833333333,121.62741849999999,'https://www.google.com/maps?q=-4.178537833333333,121.62741849999999',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2025/02/19/file-lokasi-ef7c6493-ae6f-4e69-a11d-0da65081a19e.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/19/file-lokasi-806253ce-13da-430d-9c1f-4519e94f4106.jpg","https://sikumbang.tapera.go.id/public/upload/2025/02/19/file-lokasi-ef3c2efc-8f37-4fd4-ac20-d1666a3ca4bf.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('25cc257b-5d0c-468c-8f1d-647e6bdbfe79',NULL,'properti_developer','rumah_tapak','Blue House','sikumbang-kdi0910022025t001','Blue House oleh PT PUTRA ALBIRRU GEMILANG (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- MODERN CLUSTER (Komersil): Rp 600.000.000, LB 120 m2 / LT 78 m2, 3 KT / 4 KM, 2 lantai.

Kantor pemasaran: Alamat: jl. Chairil Anwar; Telp: 081240153005; Email: bluehousekdi@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022025T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9779224,122.482112,'https://www.google.com/maps?q=-3.9779224,122.482112',600000000.0,'total',FALSE,3,4,120,78,2,'{"https://sikumbang.tapera.go.id/public/upload/2025/01/07/file-d1af2e2f-e7d4-491c-8f48-2e7311005df0.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/07/file-4772cc25-1f5d-4305-90c9-41c19e9516f3.jpg","https://sikumbang.tapera.go.id/public/upload/2025/01/07/file-54755e6b-fa9f-4c9d-836c-e2fd49671781.jpg"}','{}',NULL,TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0d53729c-1db9-48d4-bf1f-859540bd3ae7',NULL,'rumah_subsidi','rumah_tapak','MANGGARAI RESIDENCE','sikumbang-kdi1010032024t001','MANGGARAI RESIDENCE oleh TRIKA SARI PUTRA (REI).
Alamat: Padaleu, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 45 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Syech yusuf ; Telp: 040134111300; Email: trikasariputra88@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010032024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Padaleu','Padaleu, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.020491444444445,122.52105883333333,'https://www.google.com/maps?q=-4.020491444444445,122.52105883333333',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1583904136220-10667.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1583904128228-10667.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1583904141248-10667.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('63c4db0f-99c8-415f-8dec-832f069d1cf4',NULL,'rumah_subsidi','rumah_tapak','PESONA ALAM KENDARI TAHAP 3','sikumbang-kdi0410032024t001','PESONA ALAM KENDARI TAHAP 3 oleh PRATAMA GRUP MANDIRI (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: PERUMAHAN PURI TAMAN KENDARI; Telp: 082352623961; Email: agilmirwan07@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.042436111111111,122.56083333333333,'https://www.google.com/maps?q=-4.042436111111111,122.56083333333333',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/12/20/fotoContoh-e1afb0ef-2e76-4882-ba56-7e4daba0f271.jpg","https://sikumbang.tapera.go.id/public/upload/2024/12/20/fotoGerbang--14598e7b-faf1-478c-a937-283b8e419cb8.jpg","https://sikumbang.tapera.go.id/public/upload/2024/12/20/fotoTengah-31fb83c1-c25b-4c11-be37-eaa5bf13abe6.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('28389784-1d4f-412c-a3c8-98b86f9aca45',NULL,'rumah_subsidi','rumah_tapak','VILLA INDAH BALANDETE 3','sikumbang-kka0410032024t002','VILLA INDAH BALANDETE 3 oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.PEMUDA; Telp: 082293212640; Email: pt.villa.mutiara.ramadhan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410032024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Balandete','Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.067508999999999,121.62932897222221,'https://www.google.com/maps?q=-4.067508999999999,121.62932897222221',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1720663640536-c84d7654-f9f1-4f88-8712-df564f255a8d.jpg","https://sikumbang.tapera.go.id/public/upload/1720663640242-d3727211-9578-4865-8275-9ade6dd7f659.jpg","https://sikumbang.tapera.go.id/public/upload/1720663640291-da926e03-a124-4a3c-8e36-11e2e9dbb2d8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f93cc1e4-60d8-4c8a-beaf-d019f06a1310',NULL,'rumah_subsidi','rumah_tapak','HULU RESIDENCE','sikumbang-adl0820152024t001','HULU RESIDENCE oleh PRIBUMI JAYA PROPERTI (REI).
Alamat: Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 93 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan poros bandara; Telp: 085341450745; Email: propertijayapribumi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820152024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranooha','Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.051207777777778,122.4408538888889,'https://www.google.com/maps?q=-4.051207777777778,122.4408538888889',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1717045115900-962133af-2acf-4389-946b-9ca953a05e71.jpg","https://sikumbang.tapera.go.id/public/upload/1717045116182-3560feb9-2da7-4bcd-8a5a-1abe02aff926.jpg","https://sikumbang.tapera.go.id/public/upload/1717045116409-ce87dae0-dda2-4c34-b930-dc8ff54fbe2a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4962512f-a9b3-48f1-bedb-cc019546a5c2',NULL,'rumah_subsidi','rumah_tapak','Perumahan Griya Liwanda','sikumbang-lbk0120062024t001','Perumahan Griya Liwanda oleh PT PT RAJA KARYA VIJAYA ASIA (REI).
Alamat: Matawine, Kec. Lakudo, Kab Buton Tengah, Sulawesi Tenggara.
Total unit: 39 subsidi / 2 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 70 (Komersil): Rp 550.000.000, LB 70 m2 / LT 152 m2, 3 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Wolter Monginsidi RT 001 RW 002; Telp: 0811401850; Email: rkv.asia@gmail.com; Web: shankaraland.weebly.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LBK0120062024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton Tengah','Kab Buton Tengah','Lakudo','Matawine','Matawine, Kec. Lakudo, Kab Buton Tengah, Sulawesi Tenggara',NULL,-5.2799805555555555,122.54039999999999,'https://www.google.com/maps?q=-5.2799805555555555,122.54039999999999',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/04/09/fotoContoh-7d226f58-18f6-4a7d-bd4b-9586caa5fd45.JPG","https://sikumbang.tapera.go.id/public/upload/2026/04/09/fotoGerbang--7817c141-9229-496a-885f-045472700f32.JPG","https://sikumbang.tapera.go.id/public/upload/2026/04/09/fotoTengah-09ccb3c3-59c2-4d97-8af9-f6ff3253bbcc.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE)
) AS v(id,seller_id,category,property_type,title,slug,description,province,city,regency_name,district,subdistrict_name,address_detail,postal_code,latitude,longitude,maps_link,price,price_type,is_negotiable,bedrooms,bathrooms,building_area_sqm,land_area_sqm,floors,images,amenities,subsidy_program,can_kpr,certificate_type,condition,status,is_admin_verified,is_featured,views_count,favorites_count,inquiries_count,published_at,ai_generated)
WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.slug = v.slug);


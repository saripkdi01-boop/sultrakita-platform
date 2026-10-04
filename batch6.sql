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
('7c68f15f-0df3-4498-a2b8-cfa005c5c99e',NULL,'rumah_subsidi','rumah_tapak','MEKAR ASRI','sikumbang-bau0210072022t001','MEKAR ASRI oleh PT MEKAR ALAM PRINDO (REI).
Alamat: Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Wr. Monginsidi No 31; Telp: 085240624067; Email: mekaralamprindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210072022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Kadolo Katapi','Kadolo Katapi, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.468446305555556,122.63462291666667,'https://www.google.com/maps?q=-5.468446305555556,122.63462291666667',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1649758622003-e59f7766-bbdb-4f17-8ae7-1a9c588edef9.jpg","https://sikumbang.tapera.go.id/public/upload/1649758623721-4216813a-a783-4bb0-8024-4423a091de3b.jpg","https://sikumbang.tapera.go.id/public/upload/1649758618194-598fc11b-9c4d-42ac-af7d-c85726812e0a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('cf8a5a7a-4434-46e5-b5b1-e30ddaf79efd',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE XI','sikumbang-kdi0910022022t003','PRADANA RESIDENCE XI oleh PT ZENK NAWANK KENJEL (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. JEND AHMAD YANI ; Telp: 085377764209; Email: igustimadeteguhsuyobi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.978411916666667,122.48571013888889,'https://www.google.com/maps?q=-3.978411916666667,122.48571013888889',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1650413637354-d2ddb85f-5940-48a5-8f8b-d877c1ae3d20.jpg","https://sikumbang.tapera.go.id/public/upload/1650413629347-79b14d61-396a-405f-a578-7747173d7800.jpg","https://sikumbang.tapera.go.id/public/upload/1650413632737-657e1b55-c3d5-425b-937a-901d4cb39905.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b354640f-1ac0-4baa-a308-765644993e80',NULL,'rumah_subsidi','rumah_tapak','HUSADA RESIDENCE','sikumbang-bau0110132022t003','HUSADA RESIDENCE oleh KOPERASI PEMASARAN PEGAWAI NEGERI HUSADA BAUBAU (HIMPERRA).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. WR Monginsidi ; Telp: 085298365009; Email: koperasihusadabaubau@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132022T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.516110888888889,122.56361388888888,'https://www.google.com/maps?q=-5.516110888888889,122.56361388888888',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1651087671962-f35afb74-4815-4319-b93f-6aa71ea1b244.jpg","https://sikumbang.tapera.go.id/public/upload/1651087672637-080017a4-29c7-4bfe-8385-dc90f597c082.jpg","https://sikumbang.tapera.go.id/public/upload/1651087671595-9bcdf9c9-67ff-4b24-b3b5-09625b798af5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6486a498-7673-405a-97aa-19f7dfcda30c',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN ANGGORO PERMAI II','sikumbang-bau0210072022t002','PERUMAHAN ANGGORO PERMAI II oleh PT ANGGORO MAJU ABADI (REI).
Alamat: Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 16 subsidi / 0 komersil.

Tipe rumah:
- TAPAK (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Gajah Mada; Telp: 081285090436; Email: anggoromajuabadi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210072022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Bukit Wolio Indah','Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.475903027777778,122.62171172222222,'https://www.google.com/maps?q=-5.475903027777778,122.62171172222222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1613727009152-14999.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1613727009167-14999.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1613727009160-14999.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7154e385-b89b-4f34-9208-35e7051129b1',NULL,'rumah_subsidi','rumah_tapak','BUKIT MEMORY 3','sikumbang-bau0110142022t001','BUKIT MEMORY 3 oleh CV BUKIT MEMORY (APERNAS).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 New (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Erlangga pos2 ; Telp: 085335747282; Email: rezaari03@gmail.com; Web: https://bukitmemory.wordpress.com/

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.501711833333333,122.57874297222222,'https://www.google.com/maps?q=-5.501711833333333,122.57874297222222',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1651109176931-795ca2af-7baa-4150-bb59-4bcce5ca0ef8.jpg","https://sikumbang.tapera.go.id/public/upload/1651109172808-d81b006c-0261-4501-a871-d544fb44cbb6.jpg","https://sikumbang.tapera.go.id/public/upload/1651109174838-adde1aea-eed7-4bc0-a9d9-47bf1287ff9f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2d452553-143d-4e8f-b44c-eba71b4ab40b',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN AFLAH MUTIARA BARUGA','sikumbang-kdi0310012022t002','PERUMAHAN AFLAH MUTIARA BARUGA oleh PT AFLAH BUMI PROPERTI (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. K.S. TUBUN LR. LALOEPIS; Telp: 082248881168; Email: aflahbumiproperti@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.050264833333333,122.49745936111111,'https://www.google.com/maps?q=-4.050264833333333,122.49745936111111',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1652053143919-739e03f6-fabf-47f6-a1dd-de6cb063ea00.jpg","https://sikumbang.tapera.go.id/public/upload/1652053143794-c28240fc-62bd-44a7-9314-53f476d32c1f.jpg","https://sikumbang.tapera.go.id/public/upload/1652053143855-66289c2c-bea3-43c4-80b5-6f3544e1161f.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('83ee185e-48ca-4e28-9a36-92f1c9bcbda0',NULL,'rumah_subsidi','rumah_tapak','THE GREEN RESIDENCE','sikumbang-lss0110012022t001','THE GREEN RESIDENCE oleh PT PT. BABANA KONSTRUKSI PERSADA (REI).
Alamat: Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 0 subsidi / 8 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 42 (Komersil): Rp 210.000.000, LB 42 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jalan tomangera; Telp: 085232424644; Email: babankolut20208@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0110012022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Lasusua','Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.504166666666667,120.88333333333334,'https://www.google.com/maps?q=-3.504166666666667,120.88333333333334',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1652430298638-659f612d-121e-48f6-9685-83502ef07911.jpg","https://sikumbang.tapera.go.id/public/upload/1652430302202-079a931a-001a-4961-beeb-6ddc6b69c058.jpg","https://sikumbang.tapera.go.id/public/upload/1652430301786-3f063c04-8ebe-4c4d-ac2f-f9cbe237adb8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('754c184a-b547-463a-92a8-15df0622ce36',NULL,'rumah_subsidi','rumah_tapak','SULTRA HILLS RESIDENCE','sikumbang-kdi0310082022t002','SULTRA HILLS RESIDENCE oleh PT SULTRA RAYA MANDIRI (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kapten Piere Tendean Lorong No. 04 Pengayoman Kelurahan Baruga Kecamatan Baruga Kota Kendari; Telp: 085341920400; Email: sultraraya421@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0192937777777775,122.49588775,'https://www.google.com/maps?q=-4.0192937777777775,122.49588775',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1642386339141-445f70b7-bca3-42e9-9f52-74e29ddcccdb.jpg","https://sikumbang.tapera.go.id/public/upload/1642386317472-30033c43-b741-40fd-b656-7049ae1d9bde.jpg","https://sikumbang.tapera.go.id/public/upload/1642386327367-cd405342-8a24-4914-9e42-f797d34e7ae1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7c35388f-c8ff-41ec-8d2b-195e74f1b275',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN WONUA MORINI','sikumbang-kdi0410052022t002','PERUMAHAN WONUA MORINI oleh ANUGRAH SINAR KONSEL (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL RURUHI ; Telp: 085299377437; Email: anugrahsuryamuhammadji@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.007329,122.56082397222222,'https://www.google.com/maps?q=-4.007329,122.56082397222222',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1650871726882-9c24409b-17ff-478f-ac15-c2e66ccaa6de.jpg","https://sikumbang.tapera.go.id/public/upload/1650871715793-c66dc106-91bd-411f-bd3d-27c431c965c6.jpg","https://sikumbang.tapera.go.id/public/upload/1650871721240-0545dde2-058a-4f48-a091-fca50bd9a066.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8a414efd-faf3-429d-b8d7-f68ae39d5ff0',NULL,'properti_developer','rumah_tapak','PRADANA REGENCY II','sikumbang-kdi0710042021t008','PRADANA REGENCY II oleh PT ZENK NAWANK KENJEL (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 11 komersil.

Tipe rumah:
- 45 (Komersil): Rp 35.000.000, LB 64 m2 / LT 126 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.JENDRAL AHMAD YANI ; Telp: 085377764209; Email: halisanur1210@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042021T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.001552083333333,122.48891447222222,'https://www.google.com/maps?q=-4.001552083333333,122.48891447222222',35000000.0,'total',FALSE,2,1,64,126,1,'{"https://sikumbang.tapera.go.id/public/upload/1640246718073-63ec7c96-6718-468c-86ba-61016f5476ac.jpg","https://sikumbang.tapera.go.id/public/upload/1640246708896-ac21d493-dd0f-43d6-8326-4358e5e1097a.jpg","https://sikumbang.tapera.go.id/public/upload/1640246710846-eb8cbee2-2dc9-4eab-98cf-b6809abd079d.jpg"}','{}',NULL,TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2f3672a8-411a-429a-b1c3-2624d8031be1',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN GRIYA ACI INDAH TAHAP 3','sikumbang-kdi0310022022t001','PERUMAHAN GRIYA ACI INDAH TAHAP 3 oleh PT GRAHA BERKAH ALAM (PI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 1 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ahmad Yani; Telp: 085299482291; Email: armanlagadi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.029763888888889,122.50559166666666,'https://www.google.com/maps?q=-4.029763888888889,122.50559166666666',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1643868003694-aea9e339-6f8d-4b38-84ba-fa8dbbf3313a.jpg","https://sikumbang.tapera.go.id/public/upload/1643868002767-d80e86ee-32b9-405c-8c54-525289eb29ff.jpg","https://sikumbang.tapera.go.id/public/upload/1643868002593-e0656e94-8515-46ae-ba2f-4b89a3ff792e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0687017a-29d6-465e-bd1b-79002486e2a0',NULL,'rumah_subsidi','rumah_tapak','TAPERA KENDARI','sikumbang-kdi0910012022t001','TAPERA KENDARI oleh PT BAZPROPER SUKSES INDONESIA (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. D.I Pandjaitan; Telp: 082188061043; Email: bazproper15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9722228997222224,122.46552499972222,'https://www.google.com/maps?q=-3.9722228997222224,122.46552499972222',NULL,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1641179542081-f336af49-bc59-4203-ae09-159479dfc032.jpg","https://sikumbang.tapera.go.id/public/upload/1641179552363-6c75eb37-926a-4bcf-8ca4-8a1fbd99c533.jpg","https://sikumbang.tapera.go.id/public/upload/1641179547021-8f248a8c-471e-48f8-afe7-6b0bcbabffad.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5f3e3449-9cfc-478f-a19b-dca351d2829a',NULL,'rumah_subsidi','rumah_tapak','GRAND ANDHIKA TEPOROMBUA 2','sikumbang-kdi0310072022t001','GRAND ANDHIKA TEPOROMBUA 2 oleh FATAN JAYA PERKASA (PI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 14 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 167.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. JEND. A. YANI KOMP. PU NO. 07; Telp: 085342440215; Email: erickusman84@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.028097222222222,122.48430555555555,'https://www.google.com/maps?q=-4.028097222222222,122.48430555555555',167500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1629637643402-3206b1c8-53eb-45a7-8012-390cb961e10d.jpg","https://sikumbang.tapera.go.id/public/upload/1629637656146-c4bb0333-8450-418d-95a7-94f3c6c18f4d.jpg","https://sikumbang.tapera.go.id/public/upload/1629637657233-4318a7c6-2894-49b0-a43b-9cee3862ec83.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6cb8e810-4681-4521-a7d3-5a316bdc232f',NULL,'rumah_subsidi','rumah_tapak','RIZKY AMBAIPUA PERMAI','sikumbang-adl0820142022t001','RIZKY AMBAIPUA PERMAI oleh PT RIZKY ALMEERA PROPERTINDO (REI).
Alamat: Ambaipua, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 15 subsidi / 0 komersil.

Tipe rumah:
- 36/96 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN AMBAIPUA PERMAI; Telp: 081355123257; Email: rizkyalmeerapropertindo31@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820142022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ambaipua','Ambaipua, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.065826972222222,122.40513797222222,'https://www.google.com/maps?q=-4.065826972222222,122.40513797222222',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1641799145207-54556716-14f3-4c1c-84e3-ae7af225e2e3.jpg","https://sikumbang.tapera.go.id/public/upload/1641799140473-bbfcbaf1-233c-47f4-b9b8-4b253f15c1e4.jpg","https://sikumbang.tapera.go.id/public/upload/1641799146352-84734ca3-3db4-4773-b13a-db5ded9931d8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('cb04da44-17a3-48a3-a2e2-57ad9f9634c3',NULL,'rumah_subsidi','rumah_tapak','Griya Land Puuwatu','sikumbang-kdi0910012022t002','Griya Land Puuwatu oleh PT AMANAH JAYA PROPERTI (PI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 HARGA BARU (Subsidi): Rp 168.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. R.E MARTADINATA; Telp: 082235742445; Email: amanahjayapropertipusatkendari@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.972775,122.46546666666667,'https://www.google.com/maps?q=-3.972775,122.46546666666667',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1642586763949-f7ae136a-90a3-4880-813d-d8ac34c460f9.jpg","https://sikumbang.tapera.go.id/public/upload/1642586767191-212982cc-764b-4943-9251-6529315b1998.jpg","https://sikumbang.tapera.go.id/public/upload/1642586767051-d1d61ab1-6175-4c78-9911-64653a3d0835.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('db3a3d03-743a-412f-bacf-9a483fb2e6dd',NULL,'rumah_subsidi','rumah_tapak','KUMALA RESIDENCE','sikumbang-adl0820022022t001','KUMALA RESIDENCE oleh PT KUMALA KURNIA KARYA (PI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 19 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Badak ; Telp: 081221888857; Email: kumalakurniakarya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820022022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0495,122.45694722222223,'https://www.google.com/maps?q=-4.0495,122.45694722222223',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/upload/1644208348899-18132582-9c42-4a0a-a243-6019a6b5fc4e.jpg","https://sikumbang.tapera.go.id/public/upload/1644208345630-888dc529-e213-438e-a417-3c0af85ba78c.jpg","https://sikumbang.tapera.go.id/public/upload/1644208347452-84b68bb4-f8b5-43b5-b2b7-1940d6e0ecdc.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fdedc02f-da3d-41c3-ae5c-929119771edf',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN BUANA HIJAU RESIDENCE','sikumbang-bau0110132022t002','PERUMAHAN BUANA HIJAU RESIDENCE oleh CV FAIZ PUTRA PRATAMA (PIN).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 17 subsidi / 1 komersil.

Tipe rumah:
- 36 PLUS (Komersil): Rp 185.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 standard (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- NEW PRODUK SUBSIDI (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan BUANA HIJAU RESIDENCE BLOK C/6
GOA LAKASA,BELAKANG LABORATORIUM KESEHATAN KOTA BAUBAU,SULAA; Telp: 082310697125; Email: cvfaizputrapratama2@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132022T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.512066833333333,122.57279202777778,'https://www.google.com/maps?q=-5.512066833333333,122.57279202777778',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1642161349541-1961dfc8-377b-44d2-9abb-179a8fc652dc.jpg","https://sikumbang.tapera.go.id/public/upload/1642161347488-a25aeabd-668b-4020-aad3-5c4cf8dc3e3b.jpg","https://sikumbang.tapera.go.id/public/upload/1642161349508-c1cf3a79-3d37-4dca-8684-9ac559d92347.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('67de468c-1fe1-435c-8de0-df03f3432971',NULL,'rumah_subsidi','rumah_tapak','GRAHA TERATAI INDAH 3','sikumbang-kdi0710042022t001','GRAHA TERATAI INDAH 3 oleh PT PATMINDO RAYA (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- Rumah Sederhana 36/96 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 (168) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Malaka, Ruko Gateway RK B 01
Kompleks Citraland, Kendari; Telp: 082348767323; Email: admpatmindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.0036205,122.4839766,'https://www.google.com/maps?q=-4.0036205,122.4839766',156000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1644635751338-f6fa022a-a412-4f77-be45-57798e43f9d6.jpg","https://sikumbang.tapera.go.id/public/upload/1644635753001-eccd5c6b-591a-42a0-bf1a-f68dfe245363.jpg","https://sikumbang.tapera.go.id/public/upload/1644635750914-17692a63-4ada-4987-8e2b-8d92cd0b4f18.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d66d2c71-a075-4cd4-999b-73a0ebd0d4b2',NULL,'rumah_subsidi','rumah_tapak','GIANNA REGENCY','sikumbang-kdi0310012022t001','GIANNA REGENCY oleh PT MAHA KARYA HALUOLEO (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 35 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Kompleks Ruko Citra land Blok B 1; Telp: 082189935153; Email: btngianna12@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.054277888888889,122.51881408333334,'https://www.google.com/maps?q=-4.054277888888889,122.51881408333334',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1645099093113-4e5b6ea7-a8d3-4ca3-b14b-afdcae1aad3c.jpg","https://sikumbang.tapera.go.id/public/upload/1645099103182-8a5017e1-9b4e-4c40-a86b-e579d4fb9009.jpg","https://sikumbang.tapera.go.id/public/upload/1645099107012-c705dfe2-0725-4f58-8bb5-81bc0c0f803b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f6e97265-d4bb-456b-9da7-b4482eaf5c3b',NULL,'rumah_subsidi','rumah_tapak','Deneta Residence 2','sikumbang-adl0810012022t001','Deneta Residence 2 oleh PT ANUGERAH JAYA BUNDA (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Mandiri, PR. Deneta Residence Blok D; Telp: 085397601437; Email: ptanugerahjayabunda@gmail.com; Web: 0

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.044475555555556,122.4578813888889,'https://www.google.com/maps?q=-4.044475555555556,122.4578813888889',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/upload/1645010528683-104ee709-c51e-4e7c-90f6-6a3b6e3cbd1b.jpg","https://sikumbang.tapera.go.id/public/upload/1645010535849-aa2b5ecc-696f-4952-8139-e7b2860c4ed9.jpg","https://sikumbang.tapera.go.id/public/upload/1645010578628-4e93c3d7-1cc4-4041-b216-fb37d898e648.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a57838c0-e946-430d-8901-a3221d118870',NULL,'rumah_subsidi','rumah_tapak','TAPALOSA RESIDENCE 2','sikumbang-kdi0710012022t001','TAPALOSA RESIDENCE 2 oleh PT TAPALOSA CIPTA SARANA (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 22 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. D.I. PANJAITAN No. 279 KDI; Telp: 0811402799; Email: tapalosa.cskendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012022T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.999518,122.48122497222222,'https://www.google.com/maps?q=-3.999518,122.48122497222222',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1645089252179-86efe076-a2f1-4e33-9ae9-19f0b334a9c8.jpg","https://sikumbang.tapera.go.id/public/upload/1645089237911-4e9f25d0-8242-46af-9372-98abd9816054.jpg","https://sikumbang.tapera.go.id/public/upload/1645089244946-be52037e-229a-41be-95c0-08c65e503a62.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0771d0fd-64c8-40fe-a99d-dcf96fd0450e',NULL,'rumah_subsidi','rumah_tapak','Al- RAZEQI RESIDENCE','sikumbang-bau0110132021t008','Al- RAZEQI RESIDENCE oleh CV AL-RAZEQI BERSAUDARA (HIMPERRA).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 41 subsidi / 7 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 70 (Komersil): Rp 485.500.000, LB 70 m2 / LT 150 m2, 3 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN DAYANU IKHSANUDIN; Telp: 081280504179; Email: cv.alrazeqibersaudara@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132021T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.515611166666667,122.56255338888889,'https://www.google.com/maps?q=-5.515611166666667,122.56255338888889',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1631586800307-97889e0e-69e1-4d92-84a4-9459680c1654.jpg","https://sikumbang.tapera.go.id/public/upload/1631586788808-62d5bb4e-fcc0-4d2f-afac-2767f66cc0e0.jpg","https://sikumbang.tapera.go.id/public/upload/1631586794448-dbd6c4a0-0a83-4b00-9c23-2f36c589c044.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ef838819-8be4-445b-ac60-d14ca05efc16',NULL,'rumah_subsidi','rumah_tapak','BTN GRIYA NUDIFA RESIDENCE','sikumbang-adl0720192021t004','BTN GRIYA NUDIFA RESIDENCE oleh PT GRIYA NUDIFA PERMAI (APERSI).
Alamat: Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 56 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 120 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Lorong Sepakat; Telp: 08114000046; Email: griyanudifapermai@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720192021T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Lalowiu','Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.060526833333333,122.48876952777778,'https://www.google.com/maps?q=-4.060526833333333,122.48876952777778',156500000.0,'total',FALSE,2,1,36,120,1,'{"https://sikumbang.tapera.go.id/public/upload/1631152736819-0453580f-8891-4633-ba4f-efd48711a720.jpg","https://sikumbang.tapera.go.id/public/upload/1631152745394-0057fa32-d5c6-40e1-859f-195631570a91.jpg","https://sikumbang.tapera.go.id/public/upload/1631152741364-28d5d20f-b68d-4ebb-b4fd-b25d5cbd7106.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('841ff37b-ef63-4e17-b2e9-897140a23ff1',NULL,'rumah_subsidi','rumah_tapak','GRAND MARIO BARUGA','sikumbang-kdi0310012021t006','GRAND MARIO BARUGA oleh PT PROPERTI NIAGA MANDIRI (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36/84 (Subsidi): Rp 156.500.000, LB 35 m2 / LT 84 m2, 2 KT / -2 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.chairil anwar; Telp: +62823-2165-0050; Email: propertiniagamandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012021T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.045977972222222,122.503611,'https://www.google.com/maps?q=-4.045977972222222,122.503611',156500000.0,'total',FALSE,2,-2,35,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1631758579872-f54717d6-9f4b-4a4d-80f4-c0d373804ada.jpg","https://sikumbang.tapera.go.id/public/upload/1631758292059-da8f53b7-e089-496f-9fc3-dcc72de5ac5a.jpg","https://sikumbang.tapera.go.id/public/upload/1631758293403-485563cb-609c-48aa-aef7-55de94b66cae.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('42f24863-615a-4039-8839-991637b419e8',NULL,'properti_developer','rumah_tapak','The Villas','sikumbang-kdi0310082021t001','The Villas oleh PT GRAHA PROPERTI PRIMA (REI).
Alamat: Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 14 komersil.

Tipe rumah:
- Kuta (Komersil): Rp 850.000.000, LB 93 m2 / LT 180 m2, 3 KT / 3 KM, 2 lantai.
- Ubud (Komersil): Rp 620.000.000, LB 56 m2 / LT 91 m2, 2 KT / 2 KM, 1 lantai.
- Ciwidey (Komersil): Rp 900.000.000, LB 93 m2 / LT 120 m2, 3 KT / 2 KM, 2 lantai.
- Tangkuban (Komersil): Rp 1.485.000.000, LB 155 m2 / LT 180 m2, 4 KT / 4 KM, 2 lantai.
- DAGO (Komersil): Rp 1.025.225.225, LB 76 m2 / LT 91 m2, 2 KT / 2 KM, 2 lantai.
- Ruko The Villas (Komersil): Rp 1.989.189.189, LB 280 m2 / LT 120 m2, 2 KT / 2 KM, 2 lantai.

Kantor pemasaran: Alamat: Jl. D.I. Panjaitan Perumahan The Villas Blok B2; Telp: 0401 3092888; Email: thevillaskendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Wundudopi','Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.020050152777777,122.50033979166666,'https://www.google.com/maps?q=-4.020050152777777,122.50033979166666',620000000.0,'total',FALSE,2,2,56,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1632552168381-571ed918-6d34-44b8-b62b-db52b9cea47b.jpg","https://sikumbang.tapera.go.id/public/upload/1632552166387-2b1263bc-98e6-4055-8438-68921d422691.jpg","https://sikumbang.tapera.go.id/public/upload/1632552165260-41ff3128-a2ea-414f-95c2-d51c40e49d9d.jpg"}','{}',NULL,TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('42301dee-4bd2-44db-9f22-3aea437a1595',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE V','sikumbang-kdi0310022021t007','PRADANA RESIDENCE V oleh PT ZENK NAWANK KENJEL (REI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BRIDJEN KATAMSO; Telp: 0853-7776-4209; Email: pt.zenknawankkenjel.888@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022021T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0328165,122.51594219972222,'https://www.google.com/maps?q=-4.0328165,122.51594219972222',NULL,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1632536932247-188cf5da-824a-48e5-813d-72296a1ba6cc.jpg","https://sikumbang.tapera.go.id/public/upload/1632536946298-4a12a3cc-6f3e-48c6-ab6a-4dbbc9a28e44.jpg","https://sikumbang.tapera.go.id/public/upload/1632536935520-e83a94cb-5703-4d4b-8258-eab9fe9f893c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ba4842d2-1e67-4fa0-ba88-95a9566c7c4c',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN DELTA GRIYA PERMAI','sikumbang-kdi0110072021t001','PERUMAHAN DELTA GRIYA PERMAI oleh DELTA BETON NUSANTARA (REI).
Alamat: Labibia, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 5 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln.Sao sao; Telp: 085242413600; Email: deltamasperkasa228@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0110072021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Mandonga','Labibia','Labibia, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara',NULL,-3.9322177,122.4973992,'https://www.google.com/maps?q=-3.9322177,122.4973992',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1624527596659.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1624527596654.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1624527596662.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('82fe9536-68ac-47a7-9158-2d362ee0778b',NULL,'rumah_subsidi','rumah_tapak','Baruga Saranani Lestari','sikumbang-kdi0310012021t007','Baruga Saranani Lestari oleh PT BUNGA SRI REJEKI LESTARI (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 22 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: DS Konda Satu, Kec Konda, Kab Konawe Selatan; Telp: 085398154893; Email: bungasrirejeki@yahoo.co.id; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012021T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0434406944444445,122.484185,'https://www.google.com/maps?q=-4.0434406944444445,122.484185',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1634093259584-0b5da0a3-6bd1-4864-b419-b47a77f25c37.jpg","https://sikumbang.tapera.go.id/public/upload/1634093255437-4ae26ec1-39fd-437f-8a48-3f7abeb51168.jpg","https://sikumbang.tapera.go.id/public/upload/1634093260615-c3663cc0-0737-4643-805d-c01b4650ee2b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('84da65ed-51c7-421f-90ab-78dfb7db4427',NULL,'rumah_subsidi','rumah_tapak','BUMI PALAGIMATA RESIDENCE','sikumbang-bau0110142021t007','BUMI PALAGIMATA RESIDENCE oleh PT BUANA SULTRA MANDIRI (REI).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 96 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 70 (Komersil): Rp 500.000.000, LB 70 m2 / LT 150 m2, 3 KT / 2 KM, 1 lantai.
- 100 (Komersil): Rp 800.000.000, LB 100 m2 / LT 240 m2, 3 KT / 2 KM, 1 lantai.
- Subsidi Terbaru (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. DAYANU IKHSANUDDIN (PERUMAHAN WANABAKTI INDAH); Telp: 081242188620; Email: amdk.bsm@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142021T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.478845111111111,122.59683224999999,'https://www.google.com/maps?q=-5.478845111111111,122.59683224999999',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1634888526884-0d4c3d3c-d7d0-4c3c-a035-26a92439b87f.jpg","https://sikumbang.tapera.go.id/public/upload/1634888535058-a3b945d7-83d7-4339-9dc0-aba06cbbf4ff.jpg","https://sikumbang.tapera.go.id/public/upload/1634888531477-eb14114d-d340-4a23-ba43-3db761948507.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('84fc2644-d8b5-4cc9-ae9e-589765471c82',NULL,'rumah_subsidi','rumah_tapak','GRAHA ASRI PUUWATU THE ROSEMARY','sikumbang-kdi0910022021t007','GRAHA ASRI PUUWATU THE ROSEMARY oleh PT PRATJNAGRAHA ASRIREALTY (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 1 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 45 (Komersil): Rp 250.000.000, LB 45 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.
- 36 Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. PATTIMURA KOMPLEKS PERUMAHAN GRAHA ASRI BLOK Y; Telp: 085255003000; Email: pt.prajnagraha@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022021T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.965277777777778,122.47666666666667,'https://www.google.com/maps?q=-3.965277777777778,122.47666666666667',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1581565158486.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1581565138291.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1581565166177.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9358168c-5703-4c14-97dc-729202eae735',NULL,'rumah_subsidi','rumah_tapak','Perumahan Bestari Indah','sikumbang-kdi0410032021t012','Perumahan Bestari Indah oleh PT LIRAS BESTARI ADISABA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- Subsisi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan bunggasi ; Telp: 08114038646; Email: bestariadisaba@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032021T012 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.040225027777778,122.55792236111111,'https://www.google.com/maps?q=-4.040225027777778,122.55792236111111',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1639016243565-8711e9d8-74b0-4308-b922-e5592dd99e81.jpg","https://sikumbang.tapera.go.id/public/upload/1639016224761-91d41f48-20bc-4ef5-aca6-dd5f12b6cadd.jpg","https://sikumbang.tapera.go.id/public/upload/1639016242032-f135eeb9-e8c0-4443-ae2b-3cde8757de7e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fa61cf50-015c-4b6a-a841-2c2b3d3c2f5d',NULL,'rumah_subsidi','rumah_tapak','BUMI PRAJA RESIDENCE TAHAP II','sikumbang-kdi0410032021t011','BUMI PRAJA RESIDENCE TAHAP II oleh PT HARWIN JAYA BAROKAH PROPERTY (HIMPERRA).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 23 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Komp. Perumahan Bumi Praja Residence Blok C; Telp:  085394748880; Email: jayaharwin.com@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032021T011 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.031066666666667,122.55147222222222,'https://www.google.com/maps?q=-4.031066666666667,122.55147222222222',NULL,'total',FALSE,2,1,36,97,1,'{"https://sikumbang.tapera.go.id/public/upload/1635241896575-eb606f5a-1b9e-4547-8bee-7aa4b807f2aa.jpg","https://sikumbang.tapera.go.id/public/upload/1635241899956-f82d0b9f-f032-439f-b6d3-5e946a6a3810.jpg","https://sikumbang.tapera.go.id/public/upload/1635241901948-20f2390d-4d3a-47b6-9a2a-4533b13dc62c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9a5ffef4-4ea1-4d7d-b226-ff24a7778d69',NULL,'rumah_subsidi','rumah_tapak','BAITO PERMAI','sikumbang-kdi0710042021t007','BAITO PERMAI oleh PT YAKTI TIGA PERMATA (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL TUNGGALA; Telp: 081341555251; Email: yaktipermata3@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042021T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.999525,122.47988055555555,'https://www.google.com/maps?q=-3.999525,122.47988055555555',156000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1628482996306-16956.JPG","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1628507489035-16956.JPG","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1628482996306-16956.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8cd88e17-f2d4-4227-bd88-5b59be0bdd11',NULL,'properti_developer','rumah_tapak','CitraLand Kendari','sikumbang-kdi0410032021t009','CitraLand Kendari oleh PT CIPUTRA ABDI PERSADA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 28 komersil.

Tipe rumah:
- FLORENCE (Komersil): Rp 662.441.023, LB 45 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.
- SOFIA (Komersil): Rp 1.051.972.727, LB 82 m2 / LT 96 m2, 3 KT / 2 KM, 2 lantai.
- RUKO IMPERIUM (Komersil): Rp 3.233.522.727, LB 384 m2 / LT 144 m2, - KT / 3 KM, 3 lantai.
- Salzburg (Komersil): Rp 3.614.948.840, LB 245 m2 / LT 220 m2, 5 KT / 4 KM, 2 lantai.
- VIENA (Komersil): Rp 3.575.730.574, LB 245 m2 / LT 220 m2, 5 KT / 4 KM, 2 lantai.
- Grand Viena (Komersil): Rp 4.663.721.619, LB 245 m2 / LT 264 m2, 5 KT / 4 KM, 2 lantai.
- Ruko Spazia E (Komersil): Rp 1.675.000.000, LB 160 m2 / LT 80 m2, - KT / 2 KM, 2 lantai.
- ORLANDO (Komersil): Rp 1.414.127.273, LB 93 m2 / LT 144 m2, 3 KT / 2 KM, 2 lantai.
- NEO VICTORIA (Komersil): Rp 4.311.363.636, LB 323 m2 / LT 300 m2, 5 KT / 4 KM, 2 lantai.
- Ruko Spazia (Komersil): Rp 3.675.000.000, LB 336 m2 / LT 112 m2, - KT / 3 KM, 3 lantai.
- Ruko The Corridor (Komersil): Rp 1.762.485.455, LB 160 m2 / LT 80 m2, - KT / 2 KM, 2 lantai.
- BOULEVARD (Komersil): Rp 3.500.827.273, LB 245 m2 / LT 220 m2, 5 KT / 4 KM, 2 lantai.

Kantor pemasaran: Alamat: Komp Perum CitraLand, Ruko Spazia Blok H, Jl Malaka; Telp: 04013198008; Email: citralandkendari@ciputra.com; Web: www.citralandkendari.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032021T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-3.9924344,122.5335616,'https://www.google.com/maps?q=-3.9924344,122.5335616',662441023.0,'total',FALSE,2,1,45,90,1,'{"https://sikumbang.tapera.go.id/public/upload/1629868226440-389b3753-d2f6-4f1e-8e4f-2713a9bde9a8.jpg","https://sikumbang.tapera.go.id/public/upload/1629868226034-9edcda8e-42b8-47f4-b629-49cdfd4d674f.jpg","https://sikumbang.tapera.go.id/public/upload/1629868225142-1aab9c90-8b6b-416a-97e8-434a75943322.jpg"}','{}',NULL,TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ad45f2ee-d34c-4528-95dd-8bb5b86b7ce5',NULL,'rumah_subsidi','rumah_tapak','ANNAAFIU RESIDENCE','sikumbang-unh0210062021t005','ANNAAFIU RESIDENCE oleh ANNAAFIU TAMA GROUP (DEPRINDO).
Alamat: Asinua, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl Bung Tomo Blok B; Telp: 08114050541; Email: annaafiugroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210062021T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Asinua','Asinua, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,-3.8555703,122.06635369972221,'https://www.google.com/maps?q=-3.8555703,122.06635369972221',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1630583866965-45df6649-de43-4af9-9b88-33f698d69949.jpg","https://sikumbang.tapera.go.id/public/upload/1630583844814-5a991e76-eccc-40d6-ba34-faa9b0150847.jpg","https://sikumbang.tapera.go.id/public/upload/1630583859348-3d9ecb19-0b61-4054-a102-5c8a93eda020.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0fb92425-2c26-41c4-bea5-2237a6d7d4b9',NULL,'rumah_subsidi','rumah_tapak','NURHIDAYAT RESIDENCE','sikumbang-kdi0410052021t004','NURHIDAYAT RESIDENCE oleh PT LINGKAR SULTRA GRUP (APERSI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.BRIGJEN M JOENOES HOTEL MILENIUM; Telp: 082188817501; Email: amsassas08@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052021T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.012163,122.56199699999999,'https://www.google.com/maps?q=-4.012163,122.56199699999999',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1630993364695-a1a44c30-a150-444f-a2de-762c404b88d4.jpg","https://sikumbang.tapera.go.id/public/upload/1630993358534-68f3f06b-27fd-4134-8268-de0a64adce73.jpg","https://sikumbang.tapera.go.id/public/upload/1630993354507-8c16131e-f469-4242-a211-d7d35295ed0e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ef4e62d4-d5c9-4562-a315-8246842caa7d',NULL,'rumah_subsidi','rumah_tapak','VILLA KITA REGENCY','sikumbang-kdi0410062021t002','VILLA KITA REGENCY oleh PT AGFE JAYA PROPERTINDO (HIMPERRA).
Alamat: Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Dewi Sartika; Telp: 085145799995; Email: pt.agfejayapropertindo@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410062021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Matabubu','Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-3.998047222222222,122.57298055555555,'https://www.google.com/maps?q=-3.998047222222222,122.57298055555555',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1630663193758-9655dfb6-8c5b-4d4c-a38e-8c46c8e93bce.jpg","https://sikumbang.tapera.go.id/public/upload/1630663119988-0cc910d5-0cac-401f-8a70-62573e063207.jpg","https://sikumbang.tapera.go.id/public/upload/1630663271149-04483575-56dc-4285-96ea-891ea364cb60.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('24372f27-932d-4859-9653-19b6250047d7',NULL,'rumah_subsidi','rumah_tapak','PUWATU GREEN PARK','sikumbang-kdi0910012021t003','PUWATU GREEN PARK oleh PT SULTRA DUTA PROPERTY (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. IR. SOEKARNO; Telp: 082187423310; Email: sarahlahmbebeh@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.963877416666667,122.46446988888889,'https://www.google.com/maps?q=-3.963877416666667,122.46446988888889',156500000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1583998931275-10657.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1583998925969-10657.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1583998941391-10657.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c0284576-c890-4d6d-9a00-126f8ef572e3',NULL,'rumah_subsidi','rumah_tapak','FAHMI RESIDENCE','sikumbang-kdi0310012021t005','FAHMI RESIDENCE oleh PT PERMATA TIRTA JAYA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- TAPAK (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. MELATI DESA KOTA BANGUN KECAMATAN RANOMEETO KABUPATEN KONAWE SELATAN; Telp: 081245661819; Email: permatajusnadi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012021T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.050043083333333,122.50595091666666,'https://www.google.com/maps?q=-4.050043083333333,122.50595091666666',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1631153635949-13299626-bb3b-4ad2-b1bc-ef526b8630ff.jpg","https://sikumbang.tapera.go.id/public/upload/1631153632996-f203ba91-d66f-414e-b14c-647a9da7299b.jpg","https://sikumbang.tapera.go.id/public/upload/1631153654098-d00c1278-236f-4c37-bd2b-92ad5e8fc3ca.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1f7c4e70-00c6-41d7-b012-0a98466eb6ca',NULL,'rumah_subsidi','rumah_tapak','HALUOLEO GARDEN','sikumbang-kdi1010022021t002','HALUOLEO GARDEN oleh PT SULAIMAN ABDI PERSADA (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 25 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 HARGA BARU (Subsidi): Rp 168.000.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN. GRAHA REKSA ; Telp: 081244061663; Email: ptsulaimanabdipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.044202,122.55389519972222,'https://www.google.com/maps?q=-4.044202,122.55389519972222',156500000.0,'total',FALSE,2,1,36,97.5,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1628428000912-16930.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1628230597200-16930.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1628428006353-16930.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a3684cfc-44ed-4823-8ae1-4b187f22491f',NULL,'rumah_subsidi','rumah_tapak','Aura Residence 2','sikumbang-kdi0310072021t008','Aura Residence 2 oleh PT ABBA JAYA SUKSES (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 89 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Ahmad Yani; Telp: 082123353540; Email: marketing.abbajayasukses@gmail.com; Web: villawuawua.wordpress.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072021T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0201989722222224,122.483287,'https://www.google.com/maps?q=-4.0201989722222224,122.483287',156500000.0,'total',FALSE,2,1,36,89,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1624074430090-16431.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1624074430087-16431.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1624074430077-16431.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a8c868ae-0f21-4161-9c50-614ac6ff5c17',NULL,'rumah_subsidi','rumah_tapak','AFIKA LAND','sikumbang-kdi0910022021t006','AFIKA LAND oleh PT SAHIR PROPERTINDO NIAGA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 64 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.
- 3 6 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan Afika Residence. Jl. Chairil Anwar  Kel. Watulondo  Kec. Puuwatu  Kota Kendari  Sulawesi Tenggara; Telp: 082393287000; Email: pt.sahirproperty@gmail.com; Web: http://afikaresidence.com/

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022021T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9780249166666666,122.48008727777778,'https://www.google.com/maps?q=-3.9780249166666666,122.48008727777778',173000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1631174670202-2716ff6d-8a34-4af1-8f8a-f2ff39275e89.jpg","https://sikumbang.tapera.go.id/public/upload/1631174677161-d08fa947-d356-4991-ae5e-ac5a021d1278.jpg","https://sikumbang.tapera.go.id/public/upload/1631174678945-3aec5d4f-2e3f-4182-b70e-6b3c6e8bcd34.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c6f9ea6d-42db-44dc-9e27-39e56019735a',NULL,'rumah_subsidi','rumah_tapak','BUMI ARUM III','sikumbang-kdi0310012021t003','BUMI ARUM III oleh PT BUMI ARUM LESTARI (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Brigjen Katamso Desa Puosu Jaya; Telp: 082398999431; Email: pt.bumiarumlestari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.043994166666667,122.49186472222222,'https://www.google.com/maps?q=-4.043994166666667,122.49186472222222',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1619580395302-15896.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1619580395294-15896.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1619580395299-15896.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d872cef8-acaf-47e6-b04c-b885eb138e93',NULL,'rumah_subsidi','rumah_tapak','KEMALA TOWN HOUSE','sikumbang-kdi0310022021t006','KEMALA TOWN HOUSE oleh PT JIRUNA AKUSARA MESARI (APERSI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln Brigjen Katamso (depan Perum Graha Mulya); Telp: 0811411447; Email: pt.jirunaakusaramesari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022021T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.034212111111111,122.50386047222223,'https://www.google.com/maps?q=-4.034212111111111,122.50386047222223',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1628491197855-16966.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1628491197847-16966.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1628491197854-16966.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('630789ef-5e29-4023-8c40-36b7fac693b7',NULL,'rumah_subsidi','rumah_tapak','SINGAPORE GOLDEN','sikumbang-kdi0410042021t007','SINGAPORE GOLDEN oleh PT BERKAH ALAM RIMBA (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln.AH.Nasuation, Kambu, Kota Kendari; Telp: 082298913530; Email: alwisetiawan199704@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042021T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.020295833333333,122.55830833333333,'https://www.google.com/maps?q=-4.020295833333333,122.55830833333333',156500000.0,'total',FALSE,2,1,36,97,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1628484766659-16958.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1628484766658-16958.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1628484766660-16958.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('262458a5-4ce0-4383-9661-fb2db94b6e11',NULL,'rumah_subsidi','rumah_tapak','VILLA INDAH BALANDETE 2','sikumbang-kka0410032021t002','VILLA INDAH BALANDETE 2 oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. WUTALAWU PERUMAHAN VILLA INDAH TAHOA BLOK C NO 08 KELURAHAN TAHOA KECAMATAN KOLAKA KABUPATEN KOLAKA; Telp: 082293833529; Email: pt.villa.mutiara.ramadhan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410032021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Balandete','Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.068033194444444,121.6317443611111,'https://www.google.com/maps?q=-4.068033194444444,121.6317443611111',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1628923860211-17089.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1628923860208-17089.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1628923860212-17089.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('425c8d7b-7880-4d01-8655-62fa539b22a5',NULL,'rumah_subsidi','rumah_tapak','GREEN BOSE BOSE PERMAI','sikumbang-unh0310272021t001','GREEN BOSE BOSE PERMAI oleh PT TRI MAHKOTA WONUANDO (APERSI).
Alamat: Bose-bose, Kec. Wawotobi, Kab Konawe, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 HARGA BARU (Subsidi): Rp 168.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: btn kendari indah blok E24; Telp: 082324437773; Email: pt.trimahkotawonuando@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0310272021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Wawotobi','Bose-bose','Bose-bose, Kec. Wawotobi, Kab Konawe, Sulawesi Tenggara',NULL,-3.878782388888889,122.10877419444444,'https://www.google.com/maps?q=-3.878782388888889,122.10877419444444',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1625935101969-16675.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1625935101966-16675.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1625935101972-16675.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2a90c6c0-53e6-43e9-91fa-c14aa78d3d0a',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE VII','sikumbang-kdi0710042021t005','PRADANA RESIDENCE VII oleh PT RIZKY AZKA KONSTRUKSI (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 35 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl.AHMAD YANI, ; Telp: 085377764209; Email: nurhalisasanusii@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042021T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.001552083333333,122.48880002777778,'https://www.google.com/maps?q=-4.001552083333333,122.48880002777778',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1624933581400-16540.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1624933581399-16540.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1624933581401-16540.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('27032baf-1881-4b71-b450-301f7823dc25',NULL,'rumah_subsidi','rumah_tapak','Puuwatu Indah Permai Dua','sikumbang-kdi0910022021t005','Puuwatu Indah Permai Dua oleh PT BUMI ARUM LESTARI (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 34 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Brigjend Katamso Desa Puosu jaya; Telp: 082398999431; Email: pt.bumiarumlestari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022021T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.967744111111111,122.46777341666667,'https://www.google.com/maps?q=-3.967744111111111,122.46777341666667',156500000.0,'total',FALSE,2,1,34,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1625018839203-16551.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1625018839206-16551.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1625018839187-16551.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('233b166c-0ae2-4d22-b02b-cb48f8482525',NULL,'rumah_subsidi','rumah_tapak','GRHA JATIMBER','sikumbang-rah1510042021t002','GRHA JATIMBER oleh PT PATMINDO RAYA (REI).
Alamat: Laiworu, Kec. Batalaiworu, Kab Muna, Sulawesi Tenggara.
Total unit: 28 subsidi / 0 komersil.

Tipe rumah:
- Rumah Sederhana (Subsidi): Rp 156.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (168) (Subsidi): Rp 168.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Malaka, Kompl. Citra Land Kendari Ruko Gateway, Blok RK B01; Telp: 082348767323; Email: admpatmindo@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/RAH1510042021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Muna','Kab Muna','Batalaiworu','Laiworu','Laiworu, Kec. Batalaiworu, Kab Muna, Sulawesi Tenggara',NULL,-4.816697899999999,122.73285199972223,'https://www.google.com/maps?q=-4.816697899999999,122.73285199972223',156000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1623144627408-16280.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1623137421655-16280.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1623144676115-16280.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c4be2034-3e6e-4260-bfcd-d3b1d98a74ed',NULL,'rumah_subsidi','rumah_tapak','Orawa Residence','sikumbang-trw0120092021t001','Orawa Residence oleh PT LANGGAI TUNGGAL PERKASA (REI).
Alamat: Orawa, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- orawa residece (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Kel.rate-rate,kec.tirawuta,kab.kolaka timur ; Telp: 082217250793; Email: rydhorahman@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120092021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Orawa','Orawa, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.043286,121.89864619444445,'https://www.google.com/maps?q=-4.043286,121.89864619444445',156500000.0,'total',FALSE,2,1,36,97,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1624601236570-16513.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1624601236575-16513.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1624601236565-16513.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('50b271c7-5d61-4705-84d7-a967a373cd11',NULL,'rumah_subsidi','rumah_tapak','RAFA RESIDENCE','sikumbang-kdi0110082021t001','RAFA RESIDENCE oleh RAFA BANGUN PROPERTI (HIMPERRA).
Alamat: Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 M2 HARGA BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. IMAM BONJOL; Telp: 082187466125; Email: rafa.bangunproperti@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0110082021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Mandonga','Wawombalata','Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara',NULL,-3.943055555555556,122.50944444444444,'https://www.google.com/maps?q=-3.943055555555556,122.50944444444444',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1624808133615-16526.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1624808133620-16526.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1624808133610-16526.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3ba6aac4-8224-42c6-9676-66265981939b',NULL,'rumah_subsidi','rumah_tapak','MAHARANI POASIA','sikumbang-kdi0410042021t006','MAHARANI POASIA oleh PT MAHARANI JAYA GEMILANG (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: PERUMAHAN GREN SILVA MAS BLOK B NO 2 JALAN H. LAMUSE; Telp: 085241664211; Email: basbangunproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042021T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.011762,122.54906799999999,'https://www.google.com/maps?q=-4.011762,122.54906799999999',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1624990076201.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1624990076197.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1624990076207.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('237c6bac-97a0-4bcd-bf6b-ebee062e417c',NULL,'rumah_subsidi','rumah_tapak','ALTOS RESIDENCE','sikumbang-bau0110132021t006','ALTOS RESIDENCE oleh PT ALTOS SENTOSA UTAMA (APERNAS).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 27 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Dr Wahidin, Safari 1; Telp: 082292027260 ; Email: pt.altossentosautama@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132021T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.513038138888889,122.57340316666667,'https://www.google.com/maps?q=-5.513038138888889,122.57340316666667',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1616387625951.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1616387625948.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1616387625942.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('054453ab-9ea8-41a1-a26e-9bdf279902fc',NULL,'rumah_subsidi','rumah_tapak','RESKITA ANAWAI','sikumbang-kdi0710042021t006','RESKITA ANAWAI oleh PT IRFAN JAYA SULTRA (PI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 40 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 SUBSIDI (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.cristina martha tiahahu; Telp: 085322222987; Email: muhirfanjaya13@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042021T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.006816861111111,122.48862455555556,'https://www.google.com/maps?q=-4.006816861111111,122.48862455555556',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1625731598326-16653.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1625731598321-16653.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1625731634830-16653.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('40e78174-e563-40e6-bb20-04a850f4a9dc',NULL,'rumah_subsidi','rumah_tapak','BUKIT ARSILA RESIDENCE','sikumbang-kdi0410032021t007','BUKIT ARSILA RESIDENCE oleh TRI PUTRA CELEBES (HIMPERRA).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 57 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl, Kayu Manis (Ex Jl. Banteng), Perum. Bukit Arsila Residence Blok D ; Telp: 081242223123; Email: triputracelebes@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032021T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.018611111111111,122.55127222222222,'https://www.google.com/maps?q=-4.018611111111111,122.55127222222222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1626256828304-16715.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1626256828322-16715.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1626256828311-16715.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5a40402a-2f48-4dae-92aa-dffef701fc5c',NULL,'rumah_subsidi','rumah_tapak','ANOVA GRIYA PERMAI TAHAP IV','sikumbang-rah1420072021t002','ANOVA GRIYA PERMAI TAHAP IV oleh PT PT. ANOVA GRAHA PROPERTY (ASPRUMNAS).
Alamat: Wakorambu, Kec. Batalaiworu, Kab Muna, Sulawesi Tenggara.
Total unit: 81 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: RUKO ANOVA JL. GATOT SUBROTO KEL.SIDODADI KEC. BATALAIWORU KAB. MUNA PROV. SULTRA; Telp: 04013198303; Email: anovaproperty.18@gmail.com; Web: www.anova-indonesia.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/RAH1420072021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Muna','Kab Muna','Batalaiworu','Wakorambu','Wakorambu, Kec. Batalaiworu, Kab Muna, Sulawesi Tenggara',NULL,-4.7961789999999995,122.73244597222222,'https://www.google.com/maps?q=-4.7961789999999995,122.73244597222222',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1625192979934-16585.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1625192979943-16585.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1625192979939-16585.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e895210c-f1f9-4944-a1b6-35c41c87ed84',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE 8','sikumbang-kdi0910032021t005','PRADANA RESIDENCE 8 oleh PT ZENK NAWANK KENJEL (REI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL DI PANJAITAN ; Telp: 082188061043; Email: pt.zenknawankkenjel.888@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032021T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.970913888888889,122.48929166666667,'https://www.google.com/maps?q=-3.970913888888889,122.48929166666667',NULL,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1627287514594.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1627287514596.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1627287514586.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('dc1f6029-d2a5-43de-9713-90deb8ca7ab0',NULL,'rumah_subsidi','rumah_tapak','OLIVE HALUOLEO','sikumbang-kdi0410032021t008','OLIVE HALUOLEO oleh PT LIMA PILAR SUKSES RAHA (REI).
Alamat: Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 36 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 135 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Apel Cluster Kancil Mas Blok B; Telp: 081283486993; Email: btnolivekendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410032021T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Andonohu','Andonohu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.029201972222222,122.54929697222222,'https://www.google.com/maps?q=-4.029201972222222,122.54929697222222',156500000.0,'total',FALSE,2,1,36,135,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1627780201607-16860.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1627780201604-16860.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1627780201601-16860.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bba73e29-7d04-4a6b-8304-5a54457cc367',NULL,'rumah_subsidi','rumah_tapak','Permata Residence 5','sikumbang-adl0810012021t002','Permata Residence 5 oleh PT PERMATA TIRTA JAYA (REI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 11 subsidi / 0 komersil.

Tipe rumah:
- TAPAK (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Melati Desa Kota Bangun Kec. Ranomeeto Kab. Konsel; Telp: 081342813438; Email: permata.residence@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0810012021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.049569111111111,122.45693205555555,'https://www.google.com/maps?q=-4.049569111111111,122.45693205555555',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1624268456121-16448.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1624268456126-16448.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1624268456117-16448.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8d05a099-69d5-4406-ac05-5174d9aaeb70',NULL,'rumah_subsidi','rumah_tapak','GREEN BASNAPAL RESIDENCE','sikumbang-trw0110022021t002','GREEN BASNAPAL RESIDENCE oleh AKAR MAS DEVELOPMENT (REI).
Alamat: Rate-rate, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 103 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 117 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. RERE LING, LING II LATIKU ; Telp: 08114113269; Email: akarmas.development@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0110022021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Rate-rate','Rate-rate, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.049722194444445,121.8949966388889,'https://www.google.com/maps?q=-4.049722194444445,121.8949966388889',156000000.0,'total',FALSE,2,1,36,117,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1620185786149-15983.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1620185786141-15983.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1620185786136-15983.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8360a0b2-c778-4f39-b326-967488cef605',NULL,'rumah_subsidi','rumah_tapak','TUMPAS RESIDENCE 2','sikumbang-unh0210152021t002','TUMPAS RESIDENCE 2 oleh PT AMANAH BERSAMA BINTANG (AB).
Alamat: Inolobunggadue, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 35 subsidi / 0 komersil.

Tipe rumah:
- residence 2 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. Inolobunggadue Komp. Perumahan Tumpas Residence I Unaaha; Telp: 08114039443; Email: amanahbersamabintang03@gmail.com; Web: www.amanahfoundation.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210152021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Inolobunggadue','Inolobunggadue, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,-3.8530555555555557,122.04583333333333,'https://www.google.com/maps?q=-3.8530555555555557,122.04583333333333',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1620153993822-15980.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1620154893136-15980.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1620154727304-15980.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c6501012-ec7f-4963-8a4d-53c39795037c',NULL,'rumah_subsidi','rumah_tapak','BTN GRIYA NUDIFA PERMAI','sikumbang-adl0720192021t003','BTN GRIYA NUDIFA PERMAI oleh PT GRIYA NUDIFA PERMAI (APERSI).
Alamat: Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 41 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Lorong Sepakat; Telp: 08114000046; Email: ptgriyanudifapermai@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720192021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Lalowiu','Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.060417166666666,122.48912047222223,'https://www.google.com/maps?q=-4.060417166666666,122.48912047222223',156500000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1619532247247-15889.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1619532247252-15889.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1619532247256-15889.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5746ace1-75cd-449a-88f2-ec6fd85631ec',NULL,'rumah_subsidi','rumah_tapak','WAHANA RESIDENCE','sikumbang-bau0110142021t003','WAHANA RESIDENCE oleh WAHANA SUMBER BAHAGIA (PI).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Dayanu Ikhsanuddin; Telp: 082235510007; Email: wahanasumber253@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.4960950833333335,122.56992249999999,'https://www.google.com/maps?q=-5.4960950833333335,122.56992249999999',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1621651377490-16105.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1621651377498-16105.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1621651377494-16105.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('85387536-55de-4012-abca-ca11312eb532',NULL,'rumah_subsidi','rumah_tapak','GREEN FARIDZ','sikumbang-kdi0310022021t004','GREEN FARIDZ oleh PT MEKAR ALAM PRINDO (REI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Alam Sabila 1; Telp: 081245794040; Email: sarvendi09@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022021T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.024213888888889,122.51415277777778,'https://www.google.com/maps?q=-4.024213888888889,122.51415277777778',NULL,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1621490126134-16080.JPG","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1621490133979-16080.JPG","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1621490077316-16080.JPG"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('dc23616c-2714-4293-8b01-337feed5f736',NULL,'rumah_subsidi','rumah_tapak','NABIGHA RESIDENCE','sikumbang-kdi0410042021t005','NABIGHA RESIDENCE oleh LAWA RAYA GRUP (APERSI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36/108 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- 36/96 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36 m2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- 36 m2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. La Ode Hadi, By Pass, RT. 012, RW. 004; Telp: 085338729778; Email: Harlanantek10@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042021T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.023055555555556,122.5611111111111,'https://www.google.com/maps?q=-4.023055555555556,122.5611111111111',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1654667482339-16146.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1654669587638-16146.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1654669133003-16146.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ccc1624c-07bd-4f8c-a29c-c87af0a5df51',NULL,'rumah_subsidi','rumah_tapak','TUNGGALA STREET MANSION','sikumbang-kdi0710012021t003','TUNGGALA STREET MANSION oleh PT DELAPAN SEMBILAN KONSTRUKSI (HIMPERRA).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36 Subsidii (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Tunggala; Telp: 085255577725; Email: delapansembilankonstruksi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.9996194444444444,122.48341388888889,'https://www.google.com/maps?q=-3.9996194444444444,122.48341388888889',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1621400489484-16064.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1621400489497-16064.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1621400489491-16064.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4df3a7c6-a380-45aa-8355-9b73959411c6',NULL,'rumah_subsidi','rumah_tapak','WONUA MORINI 2','sikumbang-kdi0410052021t003','WONUA MORINI 2 oleh ANUGRAH SINAR KONSEL (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL RURUHI ANGGOEYA ; Telp: 085299377430; Email: mudrikahwahyu28@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.006898388888889,122.56086877777777,'https://www.google.com/maps?q=-4.006898388888889,122.56086877777777',NULL,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1622446035677-16156.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1622090278375-16156.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1622090278378-16156.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('11fa505c-c511-4b36-b79a-cd39afb79e7a',NULL,'rumah_subsidi','rumah_tapak','BUMI ARUM IV','sikumbang-kdi0310022021t005','BUMI ARUM IV oleh PT BUMI ARUM LESTARI (APERSI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 22 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Brigjen Katamso Desa Puosu Jaya ( Depan Kompleks Graha Mulya ); Telp: 082398999431; Email: pt.bumiarumlestari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022021T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.029620166666667,122.51482388888888,'https://www.google.com/maps?q=-4.029620166666667,122.51482388888888',156500000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1622854144178-16253.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1622854144171-16253.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1622854144181-16253.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('164cd9f7-9b86-462a-a352-e50af66db175',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN ERA BARU RESIDENCE','sikumbang-adl0720022021t002','PERUMAHAN ERA BARU RESIDENCE oleh NEO ELECTRONIK (APERSI).
Alamat: Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL POROS MALEO ; Telp: 085241533398; Email: neo_elektronik@yahoo.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720022021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranomeeto','Ranomeeto, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.052866972222222,122.469569,'https://www.google.com/maps?q=-4.052866972222222,122.469569',NULL,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1623500114964-16352.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1623500114967-16352.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1623500114969-16352.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('66333ced-35fc-4d68-a36e-e36bf2a5cb46',NULL,'rumah_subsidi','rumah_tapak','DJAVINO RESIDENCE IV','sikumbang-adl0820022021t001','DJAVINO RESIDENCE IV oleh PT DJAVINO GROUP SULTRA (DEPRINDO).
Alamat: Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Poros Bandara Haluoleo, kompleks Perumahan DJAVINO RESIDENCE I, gedung 3 Lantai DJAVINO GROUP
; Telp: 08114038833; Email: djavinogroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820022021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Onewila','Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.062338055555555,122.42088944444446,'https://www.google.com/maps?q=-4.062338055555555,122.42088944444446',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1623833874095-16388.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1623834519620-16388.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1623833874099-16388.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ffa0deb7-b3b2-4ea4-8cd6-289085a6a454',NULL,'rumah_subsidi','rumah_tapak','NIRWANA RESIDENCE 02','sikumbang-bau0110162021t002','NIRWANA RESIDENCE 02 oleh PT ALMA AWI JAYA SENTOSA (APERNAS).
Alamat: Labalawa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 156.500.000, LB 35 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. TARBIYAH ; Telp: 085395506687; Email: almaawijayas376@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110162021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Labalawa','Labalawa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.536745694444444,122.58236133333332,'https://www.google.com/maps?q=-5.536745694444444,122.58236133333332',156500000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1622436966306-16192.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1622436966318-16192.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1622436966310-16192.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('592f84c2-4b86-4387-bd9c-630ca96ff0a1',NULL,'rumah_subsidi','rumah_tapak','GRIYA ELEGAN HUKO-HUKO','sikumbang-kka0720032021t001','GRIYA ELEGAN HUKO-HUKO oleh PT GRIYA BINTANG ELEGAN (HIMPERRA).
Alamat: Huko-huko, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 36 subsidi / 0 komersil.

Tipe rumah:
- Rumah Tapak (Subsidi): Rp 156.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. TPI; Telp: 0811401970; Email: hijau.daunsagi79@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720032021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Huko-huko','Huko-huko, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.170922694444445,121.655225,'https://www.google.com/maps?q=-4.170922694444445,121.655225',156000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1623899701851-16393.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1623899701865-16393.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1623899701858-16393.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2e3bd7bf-8bdd-43d0-8130-16493c4528ee',NULL,'rumah_subsidi','rumah_tapak','WARDHANA ANGGOEYA PERMAI','sikumbang-kdi0410062021t001','WARDHANA ANGGOEYA PERMAI oleh PT WARDHANA ANGGOEYA PERMAI (PI).
Alamat: Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. LAPATO; Telp: 082347888488; Email: wardhanaanggoeyapermai@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410062021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Matabubu','Matabubu, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-3.994406,122.56478116666666,'https://www.google.com/maps?q=-3.994406,122.56478116666666',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1606286330059-14150.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1606286328725-14150.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1606286331125-14150.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b44fb395-052c-4725-a4e0-f1361be8bbfe',NULL,'rumah_subsidi','rumah_tapak','Griya Lepo-lepo','sikumbang-kdi0310022021t001','Griya Lepo-lepo oleh PT MAJU GRIYA CAHAYA (APERSI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 99 m2, 2 KT / 1 KM, 1 lantai.
- subsidi 36/93.5 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 93.5 m2, 2 KT / 2 KM, 1 lantai.
- subsidi 36/99 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 99 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Wulele Depan Lorong Idhata; Telp: 082149461079; Email: majugriyacahaya@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.031109805555555,122.50249480555556,'https://www.google.com/maps?q=-4.031109805555555,122.50249480555556',156500000.0,'total',FALSE,2,1,36,99,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1616664415780-15522.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1616664415790-15522.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1616664415795-15522.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ac755fd7-6efd-40cb-9c42-c608a758c061',NULL,'rumah_subsidi','rumah_tapak','MANDALA REGENCY','sikumbang-kdi0310012021t002','MANDALA REGENCY oleh BUMI CHAKRA MANDALA (HIMPERRA).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 30 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- SUBSIDI (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan KS. Tubun. Kel. Baruga Kec. Baruga; Telp: 085241726784; Email: perumahanmandalaregency@gmail.com; Web: perumahanmandalaregency.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0424619999999996,122.504045,'https://www.google.com/maps?q=-4.0424619999999996,122.504045',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1619927119111-15952.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1619927119106-15952.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1619927119114-15952.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8ec81c12-feaa-418d-980e-439213c9425a',NULL,'rumah_subsidi','rumah_tapak','GREEN DIRLAND RESIDENCE 2','sikumbang-kdi0910022021t004','GREEN DIRLAND RESIDENCE 2 oleh PT NASYATUL DIRU UTAMA (APPERNAS JAYA).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 27 subsidi / 0 komersil.

Tipe rumah:
- 36 m2 New (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- Subsidi 36 New 173 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: ODIXY CAFE LT 3 JL. SUPU YUSUF; Telp: 0811405887; Email: margahayu_megautama@yahoo.co.id

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022021T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.961835,122.478667,'https://www.google.com/maps?q=-3.961835,122.478667',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1619508922091.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1619508922067.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1619508922080.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c3dedc22-e280-46d7-a047-b5de5bbc2886',NULL,'rumah_subsidi','rumah_tapak','GREEN WATULONDO PERMAI','sikumbang-kdi0910022021t003','GREEN WATULONDO PERMAI oleh PT BONE UTAMA SULTRA (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 23 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.RA.KARTINI ; Telp: 08114031050; Email: muhnasbir@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.970555555555556,122.48194444444445,'https://www.google.com/maps?q=-3.970555555555556,122.48194444444445',156500000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1606127583908-14135.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1606127516092-14135.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1606127642989-14135.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8c0e0f64-c169-458a-9f62-cd648d2fe318',NULL,'rumah_subsidi','rumah_tapak','Zelika Residence','sikumbang-kdi0310022021t002','Zelika Residence oleh PT SYNERGY CREATIVE INDONESIA (APERSI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 34 subsidi / 0 komersil.

Tipe rumah:
- SUBSIDI (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Made Sabara, Korumba, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara 93461; Telp: 081343511782; Email: synergy.creative01@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.028044223611111,122.50434875472222,'https://www.google.com/maps?q=-4.028044223611111,122.50434875472222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1616911773299-15549.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1616911773291-15549.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1616911773296-15549.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('737c3ff4-9d0b-4d41-aefd-069ecab332c5',NULL,'rumah_subsidi','rumah_tapak','PESONA ELEGAN LASUSUA','sikumbang-lss0110012021t002','PESONA ELEGAN LASUSUA oleh PT GRIYA BINTANG ELEGAN (HIMPERRA).
Alamat: Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- Rumah Tapak (Subsidi): Rp 156.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN TPU TOJABI; Telp: 0811401970; Email: hijau.daunsagi79@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0110012021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Lasusua','Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.512219388888889,120.88240049999999,'https://www.google.com/maps?q=-3.512219388888889,120.88240049999999',156000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1618386305887-15726.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1618386305882-15726.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1618386305871-15726.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('23601f5c-a8af-4e6c-9d63-3c70db301cd2',NULL,'rumah_subsidi','rumah_tapak','AMERTON RESIDENCE','sikumbang-unh0210062021t004','AMERTON RESIDENCE oleh PT BERKAH ALAM RIMBA (REI).
Alamat: Asinua, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 97 m2, 2 KT / 2 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 87 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN AHMAD NASUATION; Telp: 082298913530; Email: alwisetiawan199704@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210062021T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Asinua','Asinua, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,-3.8582922222222225,122.06055777777777,'https://www.google.com/maps?q=-3.8582922222222225,122.06055777777777',156500000.0,'total',FALSE,2,2,36,97,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1618449295585-15728.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1618449295580-15728.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1618449295590-15728.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('de82e274-9093-4d7b-9f7e-0859a4599934',NULL,'rumah_subsidi','rumah_tapak','Swarna Dwipa Residence','sikumbang-kdi0310072021t006','Swarna Dwipa Residence oleh PT SWARNA DWIPA PROPERTY (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 41 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Grand Boulevard Regency Blok A, ; Telp: 082120860799; Email: ptswarnadwipaproperty@gmail.com; Web: swarnaproject.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072021T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.029444444444445,122.49027777777778,'https://www.google.com/maps?q=-4.029444444444445,122.49027777777778',156500000.0,'total',FALSE,2,1,36,92,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1618798114619-15773.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1618798114628-15773.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1618798114624-15773.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d49a0ea7-2003-4bca-9cfc-0bedd13274a4',NULL,'rumah_subsidi','rumah_tapak','RITONGA RESIDENCE KONDA','sikumbang-adl0720022021t001','RITONGA RESIDENCE KONDA oleh PT KANDARINDO BUMI PERKASA (PI).
Alamat: Puosu Jaya, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36/104 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: DESA PUOSU JAYA, KEC. KONDA; Telp: 081355648346; Email: ptkandarindobumiperkasa@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720022021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Puosu Jaya','Puosu Jaya, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.055759444444444,122.47213888888889,'https://www.google.com/maps?q=-4.055759444444444,122.47213888888889',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1619171692467-15837.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1619171692464-15837.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1619171692455-15837.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c46fef2d-8a41-4855-8310-b845d0b069bf',NULL,'rumah_subsidi','rumah_tapak','PRADANA RESIDENCE 6','sikumbang-kdi0910032021t003','PRADANA RESIDENCE 6 oleh PT ZENK NAWANK KENJEL (REI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Komersil): Rp 156.500.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL DI PANJAITAN ; Telp: 082188061043; Email: pt.zenknawankkenjel.888@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9720861111111114,122.49543888888888,'https://www.google.com/maps?q=-3.9720861111111114,122.49543888888888',156500000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1619422208298-15868.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1619422208309-15868.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1619422208302-15868.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ac4b2ea0-3dee-4a49-9427-6defb99f4881',NULL,'rumah_subsidi','rumah_tapak','Alam Muliadira Residence','sikumbang-swg0910042021t001','Alam Muliadira Residence oleh PT TIWORO ANAK BAKTI (HIMPERRA).
Alamat: Waumere, Kec. Tiworo Kepulauan, Kab Muna Barat, Sulawesi Tenggara.
Total unit: 60 subsidi / 13 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.000.000, LB 36 m2 / LT 117 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 117 m2, 2 KT / 1 KM, 1 lantai.
- RUKO (Komersil): Rp 1.000.000.000, LB 160 m2 / LT 150 m2, 1 KT / 2 KM, 2 lantai.

Kantor pemasaran: Alamat: Jalan Poros Raha - Tondasi (depan kantor PLN Kambara/tikep) Kel. Waumere Kec. Tiworo Kepulauan, Kab. Muna Barat; Telp: 082251666695; Email: tiworoanakbakti@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/SWG0910042021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Muna Barat','Kab Muna Barat','Tiworo Kepulauan','Waumere','Waumere, Kec. Tiworo Kepulauan, Kab Muna Barat, Sulawesi Tenggara',NULL,-4.8000685,122.41659719972223,'https://www.google.com/maps?q=-4.8000685,122.41659719972223',156000000.0,'total',FALSE,2,1,36,117,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1619558160508.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1619558160509.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1619558160497.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3bace7b8-8d9e-4378-a399-4cc37ae167fa',NULL,'rumah_subsidi','rumah_tapak','NADATULLAH NUR GANDI','sikumbang-bau0110122021t001','NADATULLAH NUR GANDI oleh PT FADEL MOLAGI NUR GANDI (REI).
Alamat: Waborobo, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 156.500.000, LB 36 m2 / LT 120 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jln.Padat karya. Betoambari,Kota Baubau; Telp: 082347995086; Email: fadelmolagi@gmail.com; Web: Nadatullah Nurgandi

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110122021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Waborobo','Waborobo, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.505933333333333,122.59046666666666,'https://www.google.com/maps?q=-5.505933333333333,122.59046666666666',156500000.0,'total',FALSE,2,1,36,120,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1586173776231-11126.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1779966110242-11126.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1586173793550-11126.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3e04a166-b7ab-412b-814a-672ef5512d86',NULL,'rumah_subsidi','rumah_tapak','MBR SUBSIDI TIKONU','sikumbang-kka0120092021t001','MBR SUBSIDI TIKONU oleh PT PELANGI DWI PROPERTINDO (PI).
Alamat: Tikonu, Kec. Wundulako, Kab Kolaka, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- SANGIA (Subsidi): Rp 156.500.000, LB 36 m2 / LT 150 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.POROS POMALAA; Telp: 0811407020; Email: petrussambira@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0120092021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Wundulako','Tikonu','Tikonu, Kec. Wundulako, Kab Kolaka, Sulawesi Tenggara',NULL,-4.124444444444444,121.67333333333333,'https://www.google.com/maps?q=-4.124444444444444,121.67333333333333',156500000.0,'total',FALSE,2,1,36,150,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1619197811022-15810.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1619197800431-15810.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1618990588187-15810.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('37446d9e-53e8-40b6-a0bd-fcd45d1f7e3b',NULL,'rumah_subsidi','rumah_tapak','JAMBU REGENCY','sikumbang-kdi0410052021t002','JAMBU REGENCY oleh PT MUNANDO BARAKATI MANDIRI (REI).
Alamat: Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan BTN GREEN SILVA MAS. Jl. H. Lamuse, Lepo-Lepo, Baruga, Kota Kendari, Sulawesi Tenggara 93118; Telp: 085241664211; Email: adhammalikdandi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410052021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Anggoeya','Anggoeya, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.012432972222222,122.55918697222222,'https://www.google.com/maps?q=-4.012432972222222,122.55918697222222',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1618140595927-15695.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1618140595916-15695.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1618140595921-15695.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('73241861-4de1-4bde-9f79-774db7562609',NULL,'rumah_subsidi','rumah_tapak','GREEN ADHAM LAND','sikumbang-adl0820172021t003','GREEN ADHAM LAND oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 93 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SYECH YUSUF; Telp: 081245833044 082293198772; Email: yusharisharm@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0445437,122.47221089972223,'https://www.google.com/maps?q=-4.0445437,122.47221089972223',156500000.0,'total',FALSE,2,1,36,93,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1615259488135.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1615259488126.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1615259488132.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('dac36bab-f719-444c-83ea-d375f4e98c96',NULL,'rumah_subsidi','rumah_tapak','AMNAH RESIDENT','sikumbang-unh0210152021t001','AMNAH RESIDENT oleh HAS JAYA INDONESIA (PI).
Alamat: Inolobunggadue, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Inolonggobue; Telp: 0823-7685-7575; Email: pthasjayaindonesia@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0210152021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Unaaha','Inolobunggadue','Inolobunggadue, Kec. Unaaha, Kab Konawe, Sulawesi Tenggara',NULL,-3.8534979444444444,122.03741452777777,'https://www.google.com/maps?q=-3.8534979444444444,122.03741452777777',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1611819033501-14626.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1611819030456-14626.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1611819037153-14626.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0cd4b365-dc3e-407f-9779-b7f2104fded0',NULL,'rumah_subsidi','rumah_tapak','Sri Amalia Bau Bau','sikumbang-bau0110162021t001','Sri Amalia Bau Bau oleh CV SAFIRAH (ASPRUMNAS).
Alamat: Labalawa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- RUMAH TAPAK 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.langkariri ; Telp: 081345524533; Email: dpdpisultra@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110162021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Labalawa','Labalawa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.504444444444444,122.57694444444444,'https://www.google.com/maps?q=-5.504444444444444,122.57694444444444',156500000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580899441644.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580899441447.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580899444369.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('cb015007-ef27-4a81-adcb-b78e8121345b',NULL,'rumah_subsidi','rumah_tapak','AFIKA RESIDENCE TAHAP 4','sikumbang-kdi0910022021t002','AFIKA RESIDENCE TAHAP 4 oleh PT SAHIR PROPERTINDO NIAGA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 27 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): harga belum valid di sumber, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.
- 3 6 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Chairil Anwar  Kel. Watulondo  Kec. Puuwatu  Kota Kendari  Provinsi  Sulawesi Tenggara; Telp: 082393287000; Email: pt.sahirproperty@gmail.com; Web: https://afikaresidence.com/

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9780249166666666,122.48010252777777,'https://www.google.com/maps?q=-3.9780249166666666,122.48010252777777',173000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1614744306487.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1614744306483.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1614744306476.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b9837f77-bf82-4688-baf5-c46aa59fd17c',NULL,'rumah_subsidi','rumah_tapak','GRIYA MEMBUKU','sikumbang-bng0120232021t001','GRIYA MEMBUKU oleh CV SUMBER DAYA (HIMPERRA).
Alamat: Kadacua, Kec. Kulisusu, Kab Buton Utara, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 182 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: DESA KADACUA; Telp: 082247763287; Email: laodemuharfan@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BNG0120232021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton Utara','Kab Buton Utara','Kulisusu','Kadacua','Kadacua, Kec. Kulisusu, Kab Buton Utara, Sulawesi Tenggara',NULL,-4.774838055555556,123.19486833333333,'https://www.google.com/maps?q=-4.774838055555556,123.19486833333333',156500000.0,'total',FALSE,2,1,36,182,1,'{"https://sikumbang.tapera.go.id/public/upload/2026/02/08/fotoContoh-73cd8251-c1da-42c0-9480-2f7e56770879.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/02/08/fotoGerbang--7de7852f-6f55-401e-b0d4-0a00d10e3faa.jpeg","https://sikumbang.tapera.go.id/public/upload/2026/02/08/fotoTengah-ce190896-44d8-43fa-bfff-fae6336f3e38.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9c31eefa-a22e-4e62-bd9b-ea49a7d10859',NULL,'rumah_subsidi','rumah_tapak','Asriwijaya 02','sikumbang-bau0610102021t001','Asriwijaya 02 oleh PT LIAM JAYA PERMAI (HIMPERRA).
Alamat: Baadia, Kec. Murhum, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Labuke; Telp: 085342484418; Email: Sarnia09.amik@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0610102021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Murhum','Baadia','Baadia, Kec. Murhum, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.479237055555556,122.59965513888888,'https://www.google.com/maps?q=-5.479237055555556,122.59965513888888',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1580289696351.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1580289682457.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1580289709077.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7292dfdd-3fe0-4b79-b63a-0ffeb4c38b43',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN ASRIWIJAYA','sikumbang-bau0210112021t001','PERUMAHAN ASRIWIJAYA oleh PT LIAM JAYA PERMAI (HIMPERRA).
Alamat: Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36 New (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JLN. BHAKTI ABRI; Telp: 082189915858; Email: SARNIA09.AMIK@GMAIL.COM

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0210112021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Wolio','Bukit Wolio Indah','Bukit Wolio Indah, Kec. Wolio, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.471484972222222,122.6113181111111,'https://www.google.com/maps?q=-5.471484972222222,122.6113181111111',156500000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1616569587492.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1616569587500.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1616569587507.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ae06f731-84e8-4eb1-b1a7-019adbb59f02',NULL,'rumah_subsidi','rumah_tapak','Puri Puuwatu Indah','sikumbang-kdi0910012021t002','Puri Puuwatu Indah oleh PT PROPERTI NIAGA MANDIRI (APERSI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36/98 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.chairil Anwar kota kendari; Telp: 082321650050; Email: propertiniagamandiri@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012021T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9801583333333332,122.47303333333333,'https://www.google.com/maps?q=-3.9801583333333332,122.47303333333333',156500000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1615345985413-15289.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1615345985431-15289.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1615345985425-15289.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d2a9c091-9c92-4e41-901c-ffe101482b2d',NULL,'rumah_subsidi','rumah_tapak','MENARA GRAHA TONGGONI','sikumbang-kka0720042021t001','MENARA GRAHA TONGGONI oleh PT MENARA KENSETSU NUSANTARA (REI).
Alamat: Pelambua, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 HARGA BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ekonomi ; Telp: 082193111333; Email: sulaiman.asmar69@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720042021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Pelambua','Pelambua, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.170163888888889,121.6189611111111,'https://www.google.com/maps?q=-4.170163888888889,121.6189611111111',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1615803443377-14308.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1609137386763-14308.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1609137441156-14308.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('751b9e96-c560-43f8-bc2c-7caf5dc3a525',NULL,'rumah_subsidi','rumah_tapak','PURI ANDUONOHU','sikumbang-kdi0410042021t003','PURI ANDUONOHU oleh PT ROVINDO GLOBAL INTI SUKSES (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL PRAMUKA; Telp: 085340679659; Email: roland.a.lukman@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042021T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.027481055555556,122.55654141666666,'https://www.google.com/maps?q=-4.027481055555556,122.55654141666666',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1615179490854-15248.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1615179490845-15248.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1615179490858-15248.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('cedb97de-7e84-4ff2-be5b-a451668ecfeb',NULL,'rumah_subsidi','rumah_tapak','GREEN HILL PUDAY','sikumbang-kdi0610012021t001','GREEN HILL PUDAY oleh MITRA MANDIRI GRUP (APERSI).
Alamat: Puday, Kec. Abeli, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Konggoasa RT.001 RW. 006 ; Telp: 085342260250; Email: muhar.rocket@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0610012021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Abeli','Puday','Puday, Kec. Abeli, Kota Kendari, Sulawesi Tenggara',NULL,-3.9861850555555556,122.57598113888889,'https://www.google.com/maps?q=-3.9861850555555556,122.57598113888889',156500000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1615343084694-15287.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1615343084700-15287.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1615343084704-15287.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b90321d2-1bbb-4167-b4e4-6e288c2dadfe',NULL,'rumah_subsidi','rumah_tapak','GRIYA TIRAWUTA','sikumbang-trw0110022021t001','GRIYA TIRAWUTA oleh PT GRAHA BERKAH ALAM (PI).
Alamat: Rate-rate, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 40 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 156.500.000, LB 36 m2 / LT 140 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: PERUMAHAN GRIYA TIRAWUTA BLOK; Telp: 082238199081; Email: anisafjriani@ymail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0110022021T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Rate-rate','Rate-rate, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.0472869722222224,121.88217697222221,'https://www.google.com/maps?q=-4.0472869722222224,121.88217697222221',156500000.0,'total',FALSE,2,1,36,140,1,'{"https://sikumbang.tapera.go.id/public/generated/images/fotoContoh-1592197860070-11994.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoGerbang-1592197784804-11994.jpg","https://sikumbang.tapera.go.id/public/generated/images/fotoTengah-1592197888124-11994.jpg"}','{}','KPR Subsidi',TRUE,NULL,'baru','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE)
) AS v(id,seller_id,category,property_type,title,slug,description,province,city,regency_name,district,subdistrict_name,address_detail,postal_code,latitude,longitude,maps_link,price,price_type,is_negotiable,bedrooms,bathrooms,building_area_sqm,land_area_sqm,floors,images,amenities,subsidy_program,can_kpr,certificate_type,condition,status,is_admin_verified,is_featured,views_count,favorites_count,inquiries_count,published_at,ai_generated)
WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.slug = v.slug);


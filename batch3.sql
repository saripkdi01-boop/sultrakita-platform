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
('8c1c6fdb-cb5c-4f36-ae8a-bd77f092bca1',NULL,'rumah_subsidi','rumah_tapak','DJAVINO RESIDENCE VII','sikumbang-kdi0310072024t006','DJAVINO RESIDENCE VII oleh PT DJAVINO GRUP INDONESIA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ade Irma Nasution; Telp: 082368884546; Email: djavinogroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072024T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.019494444444445,122.48208611111112,'https://www.google.com/maps?q=-4.019494444444445,122.48208611111112',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1725905782768-c4b79564-6a00-441d-a379-839ad48c560b.jpg","https://sikumbang.tapera.go.id/public/upload/1725905783896-34504b52-eecc-4340-9a34-1e8d37a867ae.jpg","https://sikumbang.tapera.go.id/public/upload/1725905783164-66ef7f39-7844-4181-bc88-2b0ab01cc450.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('34382644-95e3-423e-9c25-f92e191f11da',NULL,'rumah_subsidi','rumah_tapak','VILLA INDAH PONDUI 2 TAHAP 2','sikumbang-kka0410062024t001','VILLA INDAH PONDUI 2 TAHAP 2 oleh PT VILLA MUTIARA RAMADHAN (REI).
Alamat: Laloeha, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JLN.PEMUDA; Telp: 082293212640; Email: pt.villa.mutiara.ramadhan@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410062024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Laloeha','Laloeha, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.054163888888889,121.61091388888889,'https://www.google.com/maps?q=-4.054163888888889,121.61091388888889',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1720063838963-5ba78133-2228-4cc4-91f0-6439f681d30e.jpg","https://sikumbang.tapera.go.id/public/upload/1720063836919-320e8a7f-511c-4657-87bf-509055b9830b.jpg","https://sikumbang.tapera.go.id/public/upload/1720063839060-f99582bb-a7de-4179-9500-e5223235ade0.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('12ff0d3c-4694-4fe3-84fb-6682824fc4a2',NULL,'rumah_subsidi','rumah_tapak','AWAL REGENCY','sikumbang-adl0820152024t002','AWAL REGENCY oleh PT AWAL UTAMA GROUP (REI).
Alamat: Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL LINGKUNGAN KAKAO (BLOK A1 - A16) Kel/Desa. Ranooha Kec.Ranomeeto Kab. Konawe Selatan Prov Sulawesi Tenggara; Telp: 082399378788; Email: ptawalutamagroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820152024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ranooha','Ranooha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.053155555555556,122.44188333333334,'https://www.google.com/maps?q=-4.053155555555556,122.44188333333334',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1727662376129-75d85536-6311-44b0-ac7f-15ac1e634a2d.jpg","https://sikumbang.tapera.go.id/public/upload/1727662376639-345a524e-762e-429d-8560-0ac79773eab1.jpg","https://sikumbang.tapera.go.id/public/upload/1727662376625-3f43e3c1-8a2f-4d98-9737-a8751c0e62c7.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('5a63326f-2614-454a-b8f2-e57722034e75',NULL,'rumah_subsidi','rumah_tapak','LAKUDO PERMAI','sikumbang-lbk0110072024t001','LAKUDO PERMAI oleh PT ALMA AWI JAYA SENTOSA (APERNAS).
Alamat: Lakudo, Kec. Lakudo, Kab Buton Tengah, Sulawesi Tenggara.
Total unit: 18 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN POROS WAMENGKOLI MAWASANGKA; Telp: 085395506687; Email: almaawijayasentosa39@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LBK0110072024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Buton Tengah','Kab Buton Tengah','Lakudo','Lakudo','Lakudo, Kec. Lakudo, Kab Buton Tengah, Sulawesi Tenggara',NULL,-5.286616666666666,122.5226,'https://www.google.com/maps?q=-5.286616666666666,122.5226',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1727508826475-6d9880e1-a546-403f-a311-798887bc8ed1.jpg","https://sikumbang.tapera.go.id/public/upload/1727508826513-dd8ad574-5545-41f7-af26-046af7368ecd.jpg","https://sikumbang.tapera.go.id/public/upload/1727508827544-8fef9720-4a82-435b-9d3e-51fd7c4c107d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('dc6f1682-42e9-4813-ba86-3bd9a97fb5db',NULL,'rumah_subsidi','rumah_tapak','AURORA TERATAI','sikumbang-adl0720192024t002','AURORA TERATAI oleh PT MEGAH LOHE BUANNA (HIMPERRA).
Alamat: Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 149 subsidi / 9 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 70 (Komersil): Rp 450.000.000, LB 70 m2 / LT 120 m2, 3 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: Gedung Resys (lantai II) Tunggala JL. Seratus Ribu Lrg Adhyaska BTN Bumi Indah Permatasari; Telp: 082345645536; Email: megahlohebuanna.office@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720192024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Lalowiu','Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.074552777777778,122.48694166666667,'https://www.google.com/maps?q=-4.074552777777778,122.48694166666667',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/10/01/file-ed21ecc0-7dda-42f5-adaa-c569584730cd.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/01/file-22289801-0818-413a-ba85-4e77043e09ec.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/01/file-1f5fe803-f9d1-44e9-ace2-962975279125.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e23b1134-fa91-46e6-a303-ba2bb32167f9',NULL,'rumah_subsidi','rumah_tapak','AZIZAH RESIDENCE','sikumbang-kdi0310022024t003','AZIZAH RESIDENCE oleh PT MEGA HARAPAN (APERSI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 36 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. A. YANI ; Telp: 082293430073; Email: megaharapan227@gmail.cocm

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-3.9932333333333334,122.55834444444444,'https://www.google.com/maps?q=-3.9932333333333334,122.55834444444444',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1726792690653-ed18651d-a1aa-4b46-ac05-3bf48481581c.jpg","https://sikumbang.tapera.go.id/public/upload/1726792690709-657ee236-644c-44b2-879a-a7a10d3a755f.jpg","https://sikumbang.tapera.go.id/public/upload/1726792691799-ab02e3f0-3226-4312-a729-b344ef6c7047.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6794a1ec-5b41-48b5-a98f-acf1ebd2cb5c',NULL,'rumah_subsidi','rumah_tapak','Bahagia Land 1','sikumbang-kdi0710042024t007','Bahagia Land 1 oleh PT TATA BAHAGIA LAND (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 25 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Perumahan Bahagia Land, Jl. Anawai, Kel. Anwai, Kec. Wua-Wua,; Telp: 085284002224; Email: bahagialand.kdi@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042024T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.0082559444444446,122.48966216666666,'https://www.google.com/maps?q=-4.0082559444444446,122.48966216666666',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/10/14/file-lokasi-12490e4e-f4f0-4a31-a4c1-559b0e65629b.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/14/file-lokasi-1c5dc8ca-2b38-4b6f-9cf3-5b40b1475fb2.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/14/file-lokasi-8d31f063-943f-4c83-a2e2-2ff391b15043.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ed3f5294-475b-4b75-8a7e-305581a30af7',NULL,'rumah_subsidi','rumah_tapak','TIRAWUTA LAND','sikumbang-trw0120112024t001','TIRAWUTA LAND oleh PT MEGA BOLA MASAGENA (HIMPERRA).
Alamat: Tirawuta, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 43 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN GRIYA BINTANG ELEGAN; Telp: 0811401970; Email: megabolamasagena@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120112024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Tirawuta','Tirawuta, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.0488888888888885,121.88361111111112,'https://www.google.com/maps?q=-4.0488888888888885,121.88361111111112',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/10/16/file-lokasi-a77cba31-b9bc-435c-9b64-e40f95d50faa.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/16/file-lokasi-b7f3e557-ddcc-4f75-8c04-36c139826e0f.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/16/file-lokasi-2ab13b31-65fc-4826-8dee-2450bd0e1ff9.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9d466ee1-cd18-42aa-ab96-b2f692009edf',NULL,'rumah_subsidi','rumah_tapak','HALUOLEO GARDEN 5','sikumbang-kdi0310072024t007','HALUOLEO GARDEN 5 oleh PT SULAIMAN ABDI PERSADA (APERSI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 9 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl. kancil; Telp: 082187336495; Email: ptsulaimanabdipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072024T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.018897777777778,122.48689,'https://www.google.com/maps?q=-4.018897777777778,122.48689',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/10/07/file-lokasi-0aeaedf1-77eb-4817-8a8f-67c4613d8e0e.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/07/file-lokasi-cc74ea04-4df8-4972-8595-33b6d6a89fdb.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/07/file-lokasi-77836568-2cc4-495b-8727-ec1df831edf1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('117e9fc2-c610-429d-af95-86fe0ad4deab',NULL,'rumah_subsidi','rumah_tapak','Diamond Hills','sikumbang-kdi1010022024t003','Diamond Hills oleh PT DIAMOND KONSTRUCTION INDONESIA (REI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 25 subsidi / 0 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.Bahagia, Perumahan Diamond Alfa Praja (kantor); Telp: 0822-3041-5794; Email: Indonesiadiamond61@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.0307288055555555,122.5284423611111,'https://www.google.com/maps?q=-4.0307288055555555,122.5284423611111',173000000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/10/17/file-4e084510-1dcc-484b-be53-bb7606115e36.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/17/file-bc4e9a8c-0a23-4a9d-8680-45b1c3fa0246.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/17/file-ab916965-e8af-450f-a17f-0a253a0b6171.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('54d34d1b-6a45-4870-ad92-41bd7ef7a99a',NULL,'rumah_subsidi','rumah_tapak','RABBANI LAND','sikumbang-kdi0910022024t017','RABBANI LAND oleh PT RABBANI PRIMA CIPTA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 26 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Lalonggida; Telp: 082188596762; Email: rabbaniprimacipta15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T017 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.954402916666667,122.47906491666667,'https://www.google.com/maps?q=-3.954402916666667,122.47906491666667',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/11/04/file-lokasi-56bdcbd5-c42a-434c-be69-85cce3c33314.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/04/file-lokasi-8507a6d6-3ebd-4f7e-be84-f60e84fbf013.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/04/file-lokasi-a0932323-4da1-451c-a401-984bb212f55d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8b5ce97a-45b5-4e4d-b0ee-b3a8368b8a9c',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN BAITO PERMAI II','sikumbang-kdi0710042024t006','PERUMAHAN BAITO PERMAI II oleh PT YAKTI TIGA PERMATA (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 36 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Tunggala Dalam BTN BAITO PERMAI BLOK B; Telp: 081341555251; Email: yaktipermata3@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042024T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.999852777777778,122.47965277777777,'https://www.google.com/maps?q=-3.999852777777778,122.47965277777777',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1722480884725-775ece0a-a2b4-45dd-b402-7dc39abdde69.jpeg","https://sikumbang.tapera.go.id/public/upload/1722480884321-72b0ab3c-ae73-4792-b1a0-7a58efed50b0.jpeg","https://sikumbang.tapera.go.id/public/upload/1722480884626-0b66a197-398c-4840-91a9-c8854def39fa.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c0137266-cf84-4276-af5c-0ae11ff611a3',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN AISYAH RESIDENCE 2','sikumbang-adl0820192024t003','PERUMAHAN AISYAH RESIDENCE 2 oleh PT ANNUR BERKAH PROPERTI (REI).
Alamat: Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL MANDIRI; Telp: 085241515081; Email: annurberkahproperty@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820192024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Laikaha','Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.040116666666666,122.4495388888889,'https://www.google.com/maps?q=-4.040116666666666,122.4495388888889',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/11/01/file-lokasi-3114afbc-b968-4c9c-9c42-cb9af6656033.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/01/file-lokasi-97a9b16a-94c0-447a-ae97-4207cd41379a.jpg","https://sikumbang.tapera.go.id/public/upload/2024/11/01/file-lokasi-c2a3eb88-2fdf-42de-8a38-bddc694d8de5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1275da13-5b30-4a94-a62c-f1ca5b6e5cff',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN PESONA BUMI ARUM','sikumbang-kdi0910012024t001','PERUMAHAN PESONA BUMI ARUM oleh PT BUMI ARUM LESTARI (APERSI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 14 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL BRIGJEND KATAMSO; Telp: 082398999431; Email: pt.bumiarumlestari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.974997055555556,122.47060391666668,'https://www.google.com/maps?q=-3.974997055555556,122.47060391666668',173000000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/upload/1721450889372-984daea8-0f30-4a64-9df5-b2af08e96c4d.jpg","https://sikumbang.tapera.go.id/public/upload/1721450889294-c06c7ae3-1bf1-4c39-8e74-8b2c6ce594e3.jpg","https://sikumbang.tapera.go.id/public/upload/1721450889567-f82106e7-2fb7-411a-935e-e65e1bee37b2.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('132412d7-976a-4ef5-becd-2221f30f0854',NULL,'rumah_subsidi','rumah_tapak','PURI LESTARI TAHAP 3','sikumbang-adl0820192024t002','PURI LESTARI TAHAP 3 oleh PT PURI LESTARI GRUP (APERSI).
Alamat: Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 110 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Laode Hadi No. 56; Telp: 082293408035; Email: purilestarigrup330@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820192024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Laikaha','Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.038927055555556,122.44895169444445,'https://www.google.com/maps?q=-4.038927055555556,122.44895169444445',173000000.0,'total',FALSE,2,1,36,97,1,'{"https://sikumbang.tapera.go.id/public/upload/1716854643911-4dc14e4b-b4ee-4fb7-b9f7-a3c730bf944e.jpg","https://sikumbang.tapera.go.id/public/upload/1716854645544-a7c481ad-d2a1-4991-9a84-f3f33447b52e.jpg","https://sikumbang.tapera.go.id/public/upload/1716854645047-6861a818-70aa-4706-9080-7905f222dc68.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4227822b-9301-40f2-b2e3-dcea5b23cae7',NULL,'rumah_subsidi','rumah_tapak','Grand Huko-Huko Residence','sikumbang-kka0720032024t002','Grand Huko-Huko Residence oleh ANUGERAH DWITAMA NUSANTARA (APERSI).
Alamat: Huko-huko, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112 m2, - KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: GRAND HUKO-HUKO REIDENCE  BLOK A; Telp: 081232014872; Email: pt.anugerahdwitamanusantara@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720032024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Huko-huko','Huko-huko, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.179647222222223,121.65539722222223,'https://www.google.com/maps?q=-4.179647222222223,121.65539722222223',173000000.0,'total',FALSE,0,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/1721805185315-9f22ba1b-c9e6-4ddc-8f94-c1d8ac0005f6.jpg","https://sikumbang.tapera.go.id/public/upload/1721805184233-2836d9ff-f6d4-418f-adda-ccfa9580e0dc.jpg","https://sikumbang.tapera.go.id/public/upload/1721805184254-89d0aff9-2267-40d4-bafd-73e461bd30b1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a02a48f3-409f-45c5-b9f5-67a10f091d8c',NULL,'rumah_subsidi','rumah_tapak','salika land','sikumbang-unh0310062024t001','salika land oleh PT SALIKA JAYA MANDIRI (AB).
Alamat: Lalosabila, Kec. Wawotobi, Kab Konawe, Sulawesi Tenggara.
Total unit: 3 subsidi / 1 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jalan jend.sudirman tuoy {towooi cafe}; Telp: 081222530875; Email: salikajayamandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH0310062024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Wawotobi','Lalosabila','Lalosabila, Kec. Wawotobi, Kab Konawe, Sulawesi Tenggara',NULL,-3.867405111111111,122.08674152777778,'https://www.google.com/maps?q=-3.867405111111111,122.08674152777778',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1722043477652-8ccccf86-bed8-4e94-930c-65e4ecae1234.jpg","https://sikumbang.tapera.go.id/public/upload/1722043474789-090ab706-22af-44ae-9c14-38eb1079b41d.jpg","https://sikumbang.tapera.go.id/public/upload/1722043476442-2f3cd37d-15ec-474a-83ff-2e3290030bd5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('06840006-14ae-4b17-bab4-3ee03ad439b4',NULL,'rumah_subsidi','rumah_tapak','Taman Juanda Residence II','sikumbang-kdi0310072024t005','Taman Juanda Residence II oleh PT GAVRILA PETRA SILABAN (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 103 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. SANGGOLEO LRG. CAPPUCINO; Telp: 0817446679; Email: ptgavrilapetrasilaban@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072024T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.033161944444444,122.48392,'https://www.google.com/maps?q=-4.033161944444444,122.48392',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1721637207999-a109bfe9-cf36-48e2-b87c-386a2c41ab8c.jpg","https://sikumbang.tapera.go.id/public/upload/1721637209726-c4cfc800-e5e2-4b71-82c9-5d2c601206fb.jpg","https://sikumbang.tapera.go.id/public/upload/1721637208888-f0b78c71-77d4-4db9-bbc2-14e13aecb85c.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b18a356b-4b1d-45d9-aced-ce5f70b19ce5',NULL,'rumah_subsidi','rumah_tapak','MELATI RESIDENCE','sikumbang-adl0820172024t001','MELATI RESIDENCE oleh PT GINI MEGA TAMA INDAH (REI).
Alamat: Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 6 subsidi / 13 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 48 (Komersil): Rp 275.000.000, LB 48 m2 / LT 117 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. Brigjen M. Yoennoes, samping STIK AVICENNA Kendari; Telp: 081398366226 085242024996; Email: pt.gmi027@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820172024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Kota Bangun','Kota Bangun, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0406831,122.4696844,'https://www.google.com/maps?q=-4.0406831,122.4696844',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/2024/10/20/fotoContoh-586adbce-6d9b-4c3b-99c6-3ddaa3c3843e.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/20/fotoGerbang--1e98216d-b953-4c25-abc9-db9d4e6d8754.jpg","https://sikumbang.tapera.go.id/public/upload/2024/10/20/fotoTengah-88a93d7d-a305-43c4-a101-e1c944f413fc.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('73e01925-c234-40e5-b151-6c7d678fa72c',NULL,'rumah_subsidi','rumah_tapak','GREEN TUNGGALA INDAH','sikumbang-kdi0710012024t004','GREEN TUNGGALA INDAH oleh PT BINAYA PROPERTINDO NIAGA (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 101.5 m2, 2 KT / 1 KM, 1 lantai.
- Komersil (Komersil): Rp 195.000.000, LB 39 m2 / LT 101.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Sorumba; Telp: 085243623302; Email: ptbinayapropertindoniaga@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012024T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.002141666666667,122.4786388888889,'https://www.google.com/maps?q=-4.002141666666667,122.4786388888889',173000000.0,'total',FALSE,2,1,36,101.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1722064668440-f3c87084-41e3-48aa-a9cb-3b934eecbe9f.jpg","https://sikumbang.tapera.go.id/public/upload/1722064668983-98fe7c55-e043-436e-a2e4-0cecf165aac3.jpg","https://sikumbang.tapera.go.id/public/upload/1722064668631-875bae9b-24c0-4e8a-9511-e7b15c8ef354.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('851fe2a5-66fb-41ee-a2b7-75e27082e9b1',NULL,'rumah_subsidi','rumah_tapak','FELICYA RESIDENCE','sikumbang-kdi0110082024t002','FELICYA RESIDENCE oleh PT SULTRA ALAM PERKASA (PI).
Alamat: Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara.
Total unit: 14 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL IMAM BONJOL; Telp: 085242036831; Email: alamperkasaputra@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0110082024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Mandonga','Wawombalata','Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara',NULL,-3.9344555555555556,122.50224166666666,'https://www.google.com/maps?q=-3.9344555555555556,122.50224166666666',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1722472965692-f1c479f0-9cc0-4acd-9ebe-218042366ad5.JPG","https://sikumbang.tapera.go.id/public/upload/1722472963812-b3486596-2bf1-4739-9937-5cd383f58b38.JPG","https://sikumbang.tapera.go.id/public/upload/1722472964731-b475690f-31d1-4fed-a6b0-dbae4b1d125d.JPG"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e1ecc216-98d4-4800-876c-bfaaffd5c4c2',NULL,'rumah_subsidi','rumah_tapak','MENARA GRAHA 3 RESIDENCE','sikumbang-kka0720032024t003','MENARA GRAHA 3 RESIDENCE oleh PT MENARA KENSETSU NUSANTARA (REI).
Alamat: Huko-huko, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 22 subsidi / 0 komersil.

Tipe rumah:
- 36 M2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl. ekonomi; Telp: 081242319567; Email: menarakensetsunusantara69@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720032024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Huko-huko','Huko-huko, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.1747250000000005,121.65387777777778,'https://www.google.com/maps?q=-4.1747250000000005,121.65387777777778',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1723087060619-b95004ee-580e-47f9-906b-4486628a007e.jpg","https://sikumbang.tapera.go.id/public/upload/1723087062887-3b68442d-0e91-4252-8a9c-607ed0cdf1d4.jpg","https://sikumbang.tapera.go.id/public/upload/1723087062325-78b5d3e8-2450-472c-bd9a-0ee29411e8ca.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('304a3b2d-96f2-4cbe-b928-d991c8143603',NULL,'rumah_subsidi','rumah_tapak','BINTANG RESIDENCE 2','sikumbang-kdi0410042024t004','BINTANG RESIDENCE 2 oleh PT WAKUMORO JAYA PROPERTINDO (APERSI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN KAYU MANIS; Telp: 085242467819; Email: kahar_uvri@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042024T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.033542138888889,122.55855558333333,'https://www.google.com/maps?q=-4.033542138888889,122.55855558333333',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1723033103471-40b1435f-c24a-41d8-a8ba-cf415650c247.jpg","https://sikumbang.tapera.go.id/public/upload/1723033099094-267fc500-014d-4881-ba48-99d1d58dc58d.jpg","https://sikumbang.tapera.go.id/public/upload/1723033103436-0d01d3f1-ad20-4a75-986d-230ac36dd5a1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('32657f42-351d-41a2-a304-f38fcdfa9745',NULL,'rumah_subsidi','rumah_tapak','KABA RESIDENCE TAHAP 4','sikumbang-kdi0310012024t009','KABA RESIDENCE TAHAP 4 oleh PT KARYABARU BERKAH NUSANTARA (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Brigejen Katamso, Perumahan Kaba Residence, nomor E2, SULAWESI TENGGARA, KOTA KENDARI, Baruga, Baruga; Telp: 082226666906; Email: kbnproperti@gmail.com; Web: kabaresidence.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012024T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.049220899722222,122.49470139972222,'https://www.google.com/maps?q=-4.049220899722222,122.49470139972222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1722045725599-8e1eaee9-5e45-4b61-80ae-d5f07b4b4cb5.jpg","https://sikumbang.tapera.go.id/public/upload/1722045724483-24bda406-e887-4533-a77b-a8c16a923ea9.jpg","https://sikumbang.tapera.go.id/public/upload/1722045725418-c5fccb1d-ff2a-4e17-8cb9-67d379de10f5.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3b36f4a2-4cfa-4614-9e3f-f0e6d757d1f8',NULL,'rumah_subsidi','rumah_tapak','TAPERA KENDARI TAHAP 3B','sikumbang-kdi0910012024t002','TAPERA KENDARI TAHAP 3B oleh PT BAZPROPER SUKSES INDONESIA (REI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL PATTIMURA TERMINAL LAMA; Telp: 082372863011; Email: bazproper15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.971905555555556,122.46329166666666,'https://www.google.com/maps?q=-3.971905555555556,122.46329166666666',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1723614753209-fd33a2f1-304f-460b-82ed-734419f6a319.JPG","https://sikumbang.tapera.go.id/public/upload/1723614753691-b3132589-2c00-47ac-8663-479412decd74.JPG","https://sikumbang.tapera.go.id/public/upload/1723614753951-97693f24-0bea-401f-81b0-5a8f0a912acc.JPG"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9eba7efa-543c-464d-a02b-9121d55a7c33',NULL,'rumah_subsidi','rumah_tapak','KHAYRA RESIDENCE 2','sikumbang-kdi0910022024t014','KHAYRA RESIDENCE 2 oleh PT KHALID INDO PROPERTY (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- 36/84 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL CHAIRIL ANWAR; Telp: 085338169674; Email: khalidindopropery@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T014 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9589628611111114,122.47479247222222,'https://www.google.com/maps?q=-3.9589628611111114,122.47479247222222',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1723600045496-9613d7f9-1c8d-43fd-ac49-cd9b14dbe27c.jpg","https://sikumbang.tapera.go.id/public/upload/1723600045412-147cced2-54cf-49e5-9b76-be91a3f106a4.jpg","https://sikumbang.tapera.go.id/public/upload/1723600045674-31d01f36-b435-4d89-8c7e-f5969d5736aa.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('8d1329bf-08ed-4172-9306-c52379155519',NULL,'rumah_subsidi','rumah_tapak','Rajawali Citra Property','sikumbang-bau0110132024t004','Rajawali Citra Property oleh PT RAJAWALI CITRA PROPERTY (APERSI).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 19 subsidi / 0 komersil.

Tipe rumah:
- 36/84 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Dayanu Ikhsanuddin
Perumahan Topaz Residence 3; Telp: 082160738888; Email: rajawalicitraproperty88@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132024T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.518283333333334,122.56442777777778,'https://www.google.com/maps?q=-5.518283333333334,122.56442777777778',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1722903070993-b8ce4fc8-fac0-4c82-b969-f77bf49e8270.jpg","https://sikumbang.tapera.go.id/public/upload/1722903069696-92b4002d-4758-48c2-b14d-cfbdb4407254.jpg","https://sikumbang.tapera.go.id/public/upload/1722903071366-c5256af9-acd2-4b95-94a1-c6351db58847.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('faf0911e-4af4-4337-a2bb-70d6851a0a93',NULL,'rumah_subsidi','rumah_tapak','Amar Residence','sikumbang-kdi0910022024t015','Amar Residence oleh PT AMAR MULYA MANDIRI (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36/94,5 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 94 m2, 2 KT / 1 KM, 1 lantai.
- 36/94,5 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 94 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN Amar Residence, Jl Lalombaku Kec. Puuwatu; Telp: 085225334357; Email: amar.mulya.mandiri.01@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T015 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9863055555555555,122.47843888888889,'https://www.google.com/maps?q=-3.9863055555555555,122.47843888888889',173000000.0,'total',FALSE,2,1,36,94,1,'{"https://sikumbang.tapera.go.id/public/upload/1723100337115-f1e1f2db-4a53-4003-8e37-1c7129ac129a.jpeg","https://sikumbang.tapera.go.id/public/upload/1723100333234-21e21832-799e-4d41-9b6c-2e407c16a62c.jpeg","https://sikumbang.tapera.go.id/public/upload/1723100335481-4d1ffa07-a8e9-4837-9471-77896afd0ddf.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6efb3535-7f6a-4b99-83fd-59291dd6b767',NULL,'rumah_subsidi','rumah_tapak','millenial point residence','sikumbang-kka0410052024t001','millenial point residence oleh PT PUTRA KEMBAR LUWU (REI).
Alamat: Sabilambo, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 20 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Abunawas Lasandara, No. 87 Kel. Sabilambo, Kec. Kolaka, Kab. Kolaka; Telp: 085281777705; Email: ptputrakembarluwu@gmail.com; Web: https://www.facebook.com/abdullahshoalihin.shoalihin/

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410052024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Sabilambo','Sabilambo, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.0878429999999994,121.63633300000001,'https://www.google.com/maps?q=-4.0878429999999994,121.63633300000001',173000000.0,'total',FALSE,2,1,36,105,1,'{"https://sikumbang.tapera.go.id/public/upload/1724034860572-23c25a83-90ca-439d-a4eb-06a1f45e05fb.jpg","https://sikumbang.tapera.go.id/public/upload/1724034860491-53c57dc4-6537-4704-88a0-1dd8c23a202a.jpg","https://sikumbang.tapera.go.id/public/upload/1724034860652-37d25aad-746d-4c38-80cb-171193748123.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('030b61b3-6224-43c4-8a21-061a508a0ecd',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN MEKAR ALAMANDA 1','sikumbang-kdi0910022024t016','PERUMAHAN MEKAR ALAMANDA 1 oleh PT MEKAR ALAM PRINDO (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL IDHATA; Telp: 0853-4217-4589; Email: asdianto8796@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T016 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.957989,122.476191,'https://www.google.com/maps?q=-3.957989,122.476191',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1724237295737-56aa5151-25b6-4f82-8a7b-9e8bb178c3c0.jpg","https://sikumbang.tapera.go.id/public/upload/1724237296184-6e3f28db-162a-4f63-bd9d-2799bf18cf89.jpg","https://sikumbang.tapera.go.id/public/upload/1724237296248-08c1d747-171e-4df4-be29-4bb020781d20.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3faf47e3-c286-4dc3-b38e-e1a5f9c12bcd',NULL,'rumah_subsidi','rumah_tapak','GRIYA LAND PUUWATU Tahap III','sikumbang-kdi0910012024t003','GRIYA LAND PUUWATU Tahap III oleh PT AMANAH JAYA PROPERTI (PI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 47 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.
- 36 HARGA BARU (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. TPA Puuwatu ; Telp: 0822-3574-2445; Email: amanahjayapropertipusatkendari@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910012024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9842269166666666,122.47406005555555,'https://www.google.com/maps?q=-3.9842269166666666,122.47406005555555',168000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1724229939818-151a863d-e42b-4a4b-af7c-21609f070468.jpg","https://sikumbang.tapera.go.id/public/upload/1724229930424-c71ac0db-c989-46a8-bc2f-190cb1ef67a3.jpg","https://sikumbang.tapera.go.id/public/upload/1724229935106-d9fa50eb-e685-4ee6-9022-31d2a17516ba.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('60ed3d8d-b932-4381-8191-790442198bc3',NULL,'rumah_subsidi','rumah_tapak','Nafilah residence','sikumbang-kdi0410042024t003','Nafilah residence oleh PT PRAMITA KONSTRUKSI INDONESIA (APERSI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- rumah tapak (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN GRAND DIVA BLOK A; Telp: 081281233930; Email: ptpramitrakontruksiindonesia@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.015393213888889,122.54992298055555,'https://www.google.com/maps?q=-4.015393213888889,122.54992298055555',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1717401915476-e0253b0c-5177-400b-a29e-a2628c67f23f.jpg","https://sikumbang.tapera.go.id/public/upload/1717401916316-4ca61a47-0542-4b5a-ae2f-b6a3cfe06a3c.jpg","https://sikumbang.tapera.go.id/public/upload/1717401914189-453e2a51-3333-448c-8367-3b5baf0bfeef.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e1515e43-04a7-4bd0-a6ae-75a2a3275c34',NULL,'rumah_subsidi','rumah_tapak','Nawasena Land','sikumbang-kdi0910022024t011','Nawasena Land oleh PT NAWASENA INDO REALTY (APERSI).
Alamat: Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36/128 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 128 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. H. Supu Yusuf; Telp: 085947538359; Email: indorealtynawasena@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T011 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Puuwatu','Puuwatu, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.985732708309801,122.47951174724969,'https://www.google.com/maps?q=-3.985732708309801,122.47951174724969',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1717483825587-30f408e5-f413-4ed9-b07a-24244ece2f7e.jpg","https://sikumbang.tapera.go.id/public/upload/1717483824754-d57c4b54-17e7-4de4-a7f2-dc163e21b95c.jpg","https://sikumbang.tapera.go.id/public/upload/1717483825148-1ac4312e-fe62-4f25-9ccc-191d1ba435cf.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('abfeac8f-14a0-4a85-8aca-6647d5d11e58',NULL,'rumah_subsidi','rumah_tapak','Mawar saron residence 3','sikumbang-adl0820022024t001','Mawar saron residence 3 oleh PT MAWAR SARON SUSANTA (REI).
Alamat: Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 40 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 95 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Onewila, kecamatan ranomeeto, kabupaten konawe selatan. Provinsi sulawesi tenggara; Telp: 082292044649; Email: mawarsaronsusanta@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820022024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Onewila','Onewila, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.0581401999999995,122.432974,'https://www.google.com/maps?q=-4.0581401999999995,122.432974',173000000.0,'total',FALSE,2,1,36,95,1,'{"https://sikumbang.tapera.go.id/public/upload/1714381381383-7b03c440-f827-40a8-af91-6e8d4141ae1f.jpg","https://sikumbang.tapera.go.id/public/upload/1714381381696-496be9e4-0b19-42f3-8247-0bd04d969a2c.jpg","https://sikumbang.tapera.go.id/public/upload/1714381382196-36a4ba9e-a420-4d7e-9967-f4001558a230.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9fb8ead5-5323-453d-8144-c5022f00c42b',NULL,'rumah_subsidi','rumah_tapak','SHAFA MARWAH RESIDENCE 3','sikumbang-kdi0310072024t004','SHAFA MARWAH RESIDENCE 3 oleh PT GETRACO TIMUR PERSADA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 16 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ade Irma II; Telp: 085242016538; Email: getracotimurpersada@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072024T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.025799799722222,122.4889248,'https://www.google.com/maps?q=-4.025799799722222,122.4889248',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1718242518606-8b8f3c3a-1f94-4b39-b361-cd3096015ac8.jpg","https://sikumbang.tapera.go.id/public/upload/1718242518932-53daedcd-1fa4-4bbb-b119-1924aa63ff2d.jpg","https://sikumbang.tapera.go.id/public/upload/1718242518835-7d9b042e-5833-4fba-8e8c-a6b854ba6aeb.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4f9bbfd8-578f-4cbd-9d53-5ab0955d73ca',NULL,'rumah_subsidi','rumah_tapak','BEYZA ALESANDRIA VILLAGE','sikumbang-bau0110142024t001','BEYZA ALESANDRIA VILLAGE oleh CV BEYZA AYLA PROPERTI (PIN).
Alamat: Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Dayanu Ikhsanuddin, Lorong BKM; Telp: 0811401379; Email: fadel.abraham81@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110142024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Lipu','Lipu, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.488072861111111,122.58410644444444,'https://www.google.com/maps?q=-5.488072861111111,122.58410644444444',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1718958775381-133ff42c-009a-49a8-818b-0a2c4f68dbe8.jpg","https://sikumbang.tapera.go.id/public/upload/1718958776747-8278ce9a-e643-4d67-823f-0866ff275607.jpg","https://sikumbang.tapera.go.id/public/upload/1718958775679-0f389dac-e673-4f43-82e8-e1982590b81a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('811736b7-6243-43e2-bbbc-83fe8c2a7c3b',NULL,'rumah_subsidi','rumah_tapak','BUKIT TINOMU PERMAI 2','sikumbang-trw0120092024t002','BUKIT TINOMU PERMAI 2 oleh PT ALMUBARAK MULTI INSANI (REI).
Alamat: Orawa, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 23 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 135 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. TINOMU PERMAI; Telp: 082120191916; Email: almubarakmulti@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120092024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Orawa','Orawa, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.038841388888889,121.89839861111112,'https://www.google.com/maps?q=-4.038841388888889,121.89839861111112',173000000.0,'total',FALSE,2,1,36,135,1,'{"https://sikumbang.tapera.go.id/public/upload/1718251355801-5dddb8f3-9ef0-47b4-873d-6c894b41051f.jpg","https://sikumbang.tapera.go.id/public/upload/1718251365106-ad0cce6d-08d0-4d84-baf7-b9f3af18f769.jpg","https://sikumbang.tapera.go.id/public/upload/1718251365243-ad422907-fb82-470a-ab72-0fff0124f164.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('133f9e13-804c-4783-8f9d-637ae8b8534c',NULL,'rumah_subsidi','rumah_tapak','JAGAKARSA RESIDENCE','sikumbang-lss0110012024t002','JAGAKARSA RESIDENCE oleh PT JAGAKARSA ZHAKI THREPOWERS (HIMPERRA).
Alamat: Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 6 subsidi / 0 komersil.

Tipe rumah:
- 36/98 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.
- 36/98 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JLN. TRANS SULAWESI, WATULIWU; Telp: 082177771300 0811401661 085215256545; Email: jagakarsatripower@gmail.com; Web: 0

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0110012024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Lasusua','Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.51193,120.88023999999999,'https://www.google.com/maps?q=-3.51193,120.88023999999999',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1719455614719-a2acb33c-a09d-46bd-9d66-4bd38a939316.jpeg","https://sikumbang.tapera.go.id/public/upload/1719455613916-8b580c67-3888-4da3-8d54-a1e878a2289f.jpeg","https://sikumbang.tapera.go.id/public/upload/1719455614422-0acecdcb-f450-4140-ba62-556de901c740.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b0589118-9b3e-450e-9883-005879ab0bf8',NULL,'rumah_subsidi','rumah_tapak','KABA RESIDENCE TAHAP 3','sikumbang-kdi0310012024t008','KABA RESIDENCE TAHAP 3 oleh PT KARYABARU BERKAH NUSANTARA (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Brigejen Katamso, Perumahan Kaba Residence; Telp: 082226666906; Email: kbnproperti@gmail.com; Web: kabaresidence.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012024T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.045495999722222,122.490238,'https://www.google.com/maps?q=-4.045495999722222,122.490238',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1719248752650-155426d3-ef2b-455e-89cb-7f3e37192ca9.jpg","https://sikumbang.tapera.go.id/public/upload/1719248752782-39fa2d1e-b618-41ac-9e4b-d173d1ab448b.jpg","https://sikumbang.tapera.go.id/public/upload/1719248752855-c07b39cb-03de-4592-a918-d4faba867812.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9c4d735f-1124-4e1d-bab1-a277a3f60e08',NULL,'rumah_subsidi','rumah_tapak','BUMI POMALAA PERMAI','sikumbang-kka0720032024t001','BUMI POMALAA PERMAI oleh PT KOLAKA BUMI REALTY (ASPRUMNAS).
Alamat: Huko-huko, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36/98 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Kompleks Perumahan Royal Madani Blok A ; Telp: +628114006342; Email: kolakakbr@gmail.com; Web: https://sites.google.com/view/kolakabumirealty/tentang-kami

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0720032024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Pomalaa','Huko-huko','Huko-huko, Kec. Pomalaa, Kab Kolaka, Sulawesi Tenggara',NULL,-4.173066111111112,121.65108833333333,'https://www.google.com/maps?q=-4.173066111111112,121.65108833333333',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1719810328614-ad7d39bb-6169-44c0-96ed-251ea73934e3.jpg","https://sikumbang.tapera.go.id/public/upload/1719810333897-c8a74525-0bb9-4a50-995d-dbf63383a035.jpg","https://sikumbang.tapera.go.id/public/upload/1719810332428-97e20b15-0ab9-4d98-9dbe-6864401d0442.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c189ccc0-244e-4366-b629-163956129c46',NULL,'rumah_subsidi','rumah_tapak','MCP RANOMEETO','sikumbang-adl0820192024t001','MCP RANOMEETO oleh PT TADISANGKA REZKI BAROKAH (APPERNAS JAYA).
Alamat: Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 167.270.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. H. Supu Yusuf ; Telp: 082363226387; Email: mitraciptaproperty21@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820192024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Laikaha','Laikaha, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.042681944444444,122.45434694444445,'https://www.google.com/maps?q=-4.042681944444444,122.45434694444445',167270000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1715213792800-e54dd0cf-a443-4696-a4b0-6dffdf958b0a.jpg","https://sikumbang.tapera.go.id/public/upload/1715213792897-107b6850-6d4b-4b9c-91aa-b16a797a20f3.jpg","https://sikumbang.tapera.go.id/public/upload/1715213792144-5b493d69-60ba-4802-91ba-c20e7e178adf.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('0e7f3bc9-356e-4d5f-8188-360edafc2a58',NULL,'rumah_subsidi','rumah_tapak','MEGA BOLA RESIDANCE','sikumbang-lss0120092024t001','MEGA BOLA RESIDANCE oleh PT MEGA BOLA MASAGENA (HIMPERRA).
Alamat: Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- Rumah Tapak (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Griya Bintang Elegan; Telp: 0811401970; Email: hijau.daunsagi79@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120092024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Watuliwu','Watuliwu, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.499722222222222,120.89583333333334,'https://www.google.com/maps?q=-3.499722222222222,120.89583333333334',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1720168298405-bb850241-0f22-4529-bfb2-c71aaa910736.jpg","https://sikumbang.tapera.go.id/public/upload/1720168299587-51b88979-430a-42b7-8d5f-221006c6e158.jpg","https://sikumbang.tapera.go.id/public/upload/1720168299575-a9560599-32ee-4f67-b361-2b214b01b0a4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e5f23806-dc64-4628-a2f1-faf2c54dc632',NULL,'rumah_subsidi','rumah_tapak','D''MARYO RESIDENCE','sikumbang-adl0820142024t001','D''MARYO RESIDENCE oleh MUTIARA UTAMA PAPAN SEJAHTERA (REI).
Alamat: Ambaipua, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 229 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Poros Bandara Haluoleo; Telp: 085696677003; Email: olivia.asdar12@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0820142024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Ranomeeto','Ambaipua','Ambaipua, Kec. Ranomeeto, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.065904408333333,122.40208977500001,'https://www.google.com/maps?q=-4.065904408333333,122.40208977500001',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1708321248316-688ec3c8-046f-4e73-8d72-4139e7c01489.jpg","https://sikumbang.tapera.go.id/public/upload/1708321258778-cc957d39-953c-433f-8f1c-bda10405944e.jpg","https://sikumbang.tapera.go.id/public/upload/1708321253881-9c77fa8e-2310-4cf1-a525-5633b80c6538.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9f522962-5ead-47dc-8e67-11c8fdb1ad49',NULL,'rumah_subsidi','rumah_tapak','ANAY RESIDENCE I','sikumbang-kdi0910022024t012','ANAY RESIDENCE I oleh PT RATU ANAY KONSTRUKSI (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. GUNUNG WATUWILA KEL. WATULONDO KEC. PUUWATU; Telp: 082335265213; Email: ratuanaykonstruksi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T012 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9545805555555558,122.47556944444445,'https://www.google.com/maps?q=-3.9545805555555558,122.47556944444445',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1720667561225-b8a59c32-0e02-478f-b64c-d2f31b4ecfd0.jpg","https://sikumbang.tapera.go.id/public/upload/1720667567549-90f99242-a34f-42a2-8dd9-0a42575a1980.jpg","https://sikumbang.tapera.go.id/public/upload/1720667565610-9a52839e-4baa-4c31-b2f4-821b7b90fb5d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('680c2d24-7931-4d8e-aa41-a4743a7bc1e3',NULL,'rumah_subsidi','rumah_tapak','PUTRI AULIA RESIDENCE','sikumbang-trw0110022024t001','PUTRI AULIA RESIDENCE oleh PT PUTRI AULIA JAYA PROPERTI (REI).
Alamat: Rate-rate, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 17 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 97 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BOLO ; Telp: 082265262135; Email: kartikarahmat321@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0110022024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Rate-rate','Rate-rate, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.0516629166666664,121.89191436111112,'https://www.google.com/maps?q=-4.0516629166666664,121.89191436111112',173000000.0,'total',FALSE,2,1,36,97,1,'{"https://sikumbang.tapera.go.id/public/upload/1710839472033-4cfae421-ee8e-41d8-b947-86725a1f0b21.jpg","https://sikumbang.tapera.go.id/public/upload/1710839472899-13e6c7fa-21e7-4872-bf0f-30d0c0071219.jpg","https://sikumbang.tapera.go.id/public/upload/1710839472309-b2bef271-b4bb-4787-8995-0d8f9703250d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c0eb660f-4991-4394-9d44-cbbc582cc773',NULL,'rumah_subsidi','rumah_tapak','SAPROLITE INDAH 2','sikumbang-kdi0110082024t001','SAPROLITE INDAH 2 oleh PT HASSCO INDO KONSUL (APERSI).
Alamat: Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara.
Total unit: 45 subsidi / 0 komersil.

Tipe rumah:
- Tunggal LB 36 / LT 91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- Tunggal D11 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 105 m2, 2 KT / 1 KM, 1 lantai.
- Tunggal D14 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 167 m2, 2 KT / 1 KM, 1 lantai.
- Tunggal E12 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 139 m2, 2 KT / 1 KM, 1 lantai.
- Tunggal Kecil (Subsidi): Rp 173.000.000, LB 36 m2 / LT 86 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Bunga Matahari ; Telp: 085656349525; Email: hasscoindkonsul@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0110082024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Mandonga','Wawombalata','Wawombalata, Kec. Mandonga, Kota Kendari, Sulawesi Tenggara',NULL,-3.939739979277778,122.50469729305556,'https://www.google.com/maps?q=-3.939739979277778,122.50469729305556',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1721034719361-fbc6a90c-b6d1-4996-9e14-d20b2d88489a.jpg","https://sikumbang.tapera.go.id/public/upload/1721034720675-83eba2dc-b25c-414b-9f78-5a339333c8c5.jpg","https://sikumbang.tapera.go.id/public/upload/1721034723967-ca1f06d8-089f-46cc-b92d-895e9a6989bf.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b318355b-55eb-41cf-8a7c-976c41a0a184',NULL,'rumah_subsidi','rumah_tapak','IRAKSEL RESIDENCE PERMAI','sikumbang-trw0120102024t001','IRAKSEL RESIDENCE PERMAI oleh IRAKSEL RESIDENCE PERMAI (REI).
Alamat: Lalingato, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 22 subsidi / 8 komersil.

Tipe rumah:
- 36/101.5 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 101.5 m2, 2 KT / 1 KM, 1 lantai.
- RUKO 2 LANTAI (Komersil): Rp 1.500.000.000, LB 193.5 m2 / LT 100 m2, 2 KT / 1 KM, 2 lantai.

Kantor pemasaran: Alamat: JL. POROS LALINGATO KOLAKA TIMUR; Telp: 081341782337; Email: ilyasrasyad@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120102024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Lalingato','Lalingato, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.004039722222222,121.85663694444443,'https://www.google.com/maps?q=-4.004039722222222,121.85663694444443',173000000.0,'total',FALSE,2,1,36,101.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1721198105495-f5a3b4c8-dde8-476a-990e-97941583a32c.jpg","https://sikumbang.tapera.go.id/public/upload/1721198106396-720e3544-82f8-4ac3-8f63-cf808abffa46.jpg","https://sikumbang.tapera.go.id/public/upload/1721198105887-b77ac7e8-c48e-40e9-b57b-c2a8c50edaae.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('491ac24d-0acc-4c2c-9e29-4469d547fc9b',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN BUMI ARUM HILLS','sikumbang-kdi0910022024t013','PERUMAHAN BUMI ARUM HILLS oleh PT MUSTIKA PUTRA PERSADA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 108 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Brigjend Katamso; Telp: 082398999431; Email: pt.bumiarumlestari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T013 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9758329166666666,122.48263547222223,'https://www.google.com/maps?q=-3.9758329166666666,122.48263547222223',173000000.0,'total',FALSE,2,1,36,108,1,'{"https://sikumbang.tapera.go.id/public/upload/1718765005879-cf8403c8-1d61-41e8-bcf7-f0d101da36df.jpg","https://sikumbang.tapera.go.id/public/upload/1718765005681-9abcd546-a426-4a3b-8f0b-4ae460f0f793.jpg","https://sikumbang.tapera.go.id/public/upload/1718765005329-24904b06-d4bc-43df-967d-b3f52f45ec55.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('f30e43dc-9701-4c05-8c32-67810ddc5dee',NULL,'rumah_subsidi','rumah_tapak','Mega Amaliah Residencee','sikumbang-kdi0910062024t002','Mega Amaliah Residencee oleh PT KARYA LANCA MANDIRI (HIMPERRA).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 15 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.Dr.Soetomo ; Telp: 085241892724; Email: karyalancamandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9372972222222224,122.48731111111111,'https://www.google.com/maps?q=-3.9372972222222224,122.48731111111111',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1721359416828-ab2612b8-645e-4bae-a160-bd1dfc0e0a4d.JPG","https://sikumbang.tapera.go.id/public/upload/1721359416910-667c310d-33fb-4e18-9b6b-014b9a9b51a2.JPG","https://sikumbang.tapera.go.id/public/upload/1721359416730-3ce02112-5c38-4428-a7d4-743947e79aca.JPG"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c991dbc0-0dde-49a9-9dff-fbf1be9f9ed1',NULL,'rumah_subsidi','rumah_tapak','GRIYA CITRA ANAWAI','sikumbang-kdi0710042024t003','GRIYA CITRA ANAWAI oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 32 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com; Web: https://maps.app.goo.gl/bFy6dnMdwR5hgNnp9

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.007176861111111,122.48689269444445,'https://www.google.com/maps?q=-4.007176861111111,122.48689269444445',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1713336753381-36aaf8e4-9aed-43c4-88a1-d65af40204e1.jpg","https://sikumbang.tapera.go.id/public/upload/1713336753145-4ec676b4-f537-4327-8986-e4df6d936857.jpg","https://sikumbang.tapera.go.id/public/upload/1713336753537-8b000cd2-606b-4051-b8fa-cd95d7f49eeb.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7875cfbe-336b-4107-91ac-a34106a753b2',NULL,'rumah_subsidi','rumah_tapak','Bimbus Residence','sikumbang-unh3920082024t001','Bimbus Residence oleh BUMI LASINRANG PROPERTI (PI).
Alamat: Paku Jaya, Kec. Morosi, Kab Konawe, Sulawesi Tenggara.
Total unit: 40 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kampung Jawa; Telp: 082192479893; Email: ptbumilasinrangproperti@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/UNH3920082024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe','Kab Konawe','Morosi','Paku Jaya','Paku Jaya, Kec. Morosi, Kab Konawe, Sulawesi Tenggara',NULL,-3.889403319874383,122.38670352109169,'https://www.google.com/maps?q=-3.889403319874383,122.38670352109169',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1713696686131-44bd5162-b4a2-4592-bb68-a9b313ae6662.jpg","https://sikumbang.tapera.go.id/public/upload/1713696685265-d0e02dab-667e-4e90-9944-5700f4c83ade.jpg","https://sikumbang.tapera.go.id/public/upload/1713696685720-f5414f9a-9311-4b6d-a5c4-42f114284a81.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2b37803a-eba3-420b-a1c4-4f7946bdbaaf',NULL,'rumah_subsidi','rumah_tapak','Evlogia Residence','sikumbang-kdi0910052024t001','Evlogia Residence oleh PT ALGEIS MEGA MANDIRI (APERSI).
Alamat: Abeli Dalam, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 33 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Tunggala Dalam Baito; Telp: 081245707086; Email: algeismm1199@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910052024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Abeli Dalam','Abeli Dalam, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9950222,122.4630602,'https://www.google.com/maps?q=-3.9950222,122.4630602',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1705135223318-b9505433-6035-488c-a8b1-3e46fe2d8493.jpg","https://sikumbang.tapera.go.id/public/upload/1705135210044-ed9b6ac1-4050-4981-8a57-6d17735c082f.jpg","https://sikumbang.tapera.go.id/public/upload/1705135192234-1a62ba5a-7b5f-4b74-8d46-fcbdcde5a2cf.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('d08eb1a6-fdd5-4732-922e-1260d9c79cfc',NULL,'rumah_subsidi','rumah_tapak','HALUOLEO GARDEN 6','sikumbang-kdi0310012024t007','HALUOLEO GARDEN 6 oleh PT SULAIMAN ABDI PERSADA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 7 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: BTN RAFAS RESIDENCE; Telp: 081244061663; Email: ptsulaimanabdipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012024T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.047931111111111,122.50463611111111,'https://www.google.com/maps?q=-4.047931111111111,122.50463611111111',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1713701194786-e3daeb0d-64bf-4d67-8f0b-e435009841f4.jpg","https://sikumbang.tapera.go.id/public/upload/1713701196001-95020fbc-72a9-49e7-9eac-441d67fcb923.jpg","https://sikumbang.tapera.go.id/public/upload/1713701195105-cd74709a-a048-40ba-8d29-59b66fbb6317.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('63b4eba8-099b-4502-b6db-5d137bc9134a',NULL,'rumah_subsidi','rumah_tapak','TAPALOSA RESIDENCE TAHAP 3','sikumbang-kdi0710012024t002','TAPALOSA RESIDENCE TAHAP 3 oleh PT TAPALOSA CIPTA SARANA (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 84 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. BRIGJEN M. YOENOES BY PASS; Telp: +62 852-9950-4451; Email: tapalosa.grupkendari@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.999572777777778,122.48139083333334,'https://www.google.com/maps?q=-3.999572777777778,122.48139083333334',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1714011604850-8ab5a9d8-3164-4b69-b5e2-4e4a4b6f1cbc.jpg","https://sikumbang.tapera.go.id/public/upload/1714011604254-d8258d07-7090-4759-be8f-47b798615880.jpg","https://sikumbang.tapera.go.id/public/upload/1714011604742-c8809326-0137-41e4-90d9-8f83c4f73d17.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3edeed81-f2d2-4b6f-b875-0bf2cc4a69b8',NULL,'rumah_subsidi','rumah_tapak','GRAHANARA LALODATI','sikumbang-kdi0910062024t001','GRAHANARA LALODATI oleh PT HANARA GEMA REALTY (REI).
Alamat: Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 1 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN DOKTOR SUTOMO; Telp: 081342026161; Email: hanaragemarealty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910062024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Lalodati','Lalodati, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9441222222222225,122.49401944444445,'https://www.google.com/maps?q=-3.9441222222222225,122.49401944444445',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1714629184773-f29c85be-3da9-48fa-a736-918e66baae57.jpg","https://sikumbang.tapera.go.id/public/upload/1714629189245-95180872-2d71-4e5f-be80-a4abd59e64bd.jpg","https://sikumbang.tapera.go.id/public/upload/1714629186026-2e89886d-2be6-4c34-af06-0feaec051c8e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('52d14c96-e65d-4602-beee-2d38465c2be0',NULL,'rumah_subsidi','rumah_tapak','PESONA BAITUL HUDA','sikumbang-kdi0910022024t009','PESONA BAITUL HUDA oleh PT MEKAR ALAM PRINDO (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. KONGGOASA. KEL. WATULONDO KEC. PUUWATU KOTA KENDARI SULAWESI TENGGARA 93115; Telp: 085342174589; Email: asdianto8796@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T009 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.956331,122.47426697222222,'https://www.google.com/maps?q=-3.956331,122.47426697222222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1709788115728-d2bdc9c0-83f8-4e8b-b47b-7f071548230f.jpg","https://sikumbang.tapera.go.id/public/upload/1709788116605-6e638db4-37d8-4a07-bd4f-39aeb6d84588.jpg","https://sikumbang.tapera.go.id/public/upload/1709788116305-141fdb0d-929f-43f9-b5dd-49720414ef82.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b52013d1-07d0-4791-89e6-3b5c1523b1ba',NULL,'rumah_subsidi','rumah_tapak','MUTIARA YASMIN','sikumbang-lss0120072024t001','MUTIARA YASMIN oleh PT KOLUT INDOTAMA PERSADA (REI).
Alamat: Tojabi, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36/98 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.
- 36/98 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Lasusua; Telp: 082266077574; Email: ptkolutindotamapersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120072024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Tojabi','Tojabi, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.506428,120.901139,'https://www.google.com/maps?q=-3.506428,120.901139',168000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1715060738243-23429391-dfdf-47a7-acde-6e75fa40994d.jpg","https://sikumbang.tapera.go.id/public/upload/1715060738197-db092ecb-32d4-4614-bbcb-47b6f1421411.jpg","https://sikumbang.tapera.go.id/public/upload/1715060738285-e4929988-9c9b-483d-a72c-335b1f452c66.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e26bbcc3-93bb-4ef5-91f3-73111aaec966',NULL,'rumah_subsidi','rumah_tapak','MUTIARA LAND','sikumbang-lss0920072024t001','MUTIARA LAND oleh PT BIRU ADITYA PERSADA (REI).
Alamat: Samaturu, Kec. Watunohu, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 64 subsidi / 0 komersil.

Tipe rumah:
- 36/98 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: LASUSUA; Telp: 082266077574; Email: ptbiruadityapersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0920072024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Watunohu','Samaturu','Samaturu, Kec. Watunohu, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.290956,120.996806,'https://www.google.com/maps?q=-3.290956,120.996806',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1715063361633-b8aafade-baf9-4304-b699-dd86fda2e311.jpg","https://sikumbang.tapera.go.id/public/upload/1715063361622-35b3790b-553e-4b52-bddc-4e7e849042c2.jpg","https://sikumbang.tapera.go.id/public/upload/1715063361616-789fe83a-66b0-48fb-9bf9-8fee6aec64d7.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('93f4b005-774d-4b71-bf8d-f062bf1e97e5',NULL,'rumah_subsidi','rumah_tapak','GRIYA MULYA ANAWAI','sikumbang-kdi0710042024t004','GRIYA MULYA ANAWAI oleh PT MEGA HARAPAN (APERSI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. AHMAD YANI; Telp: 082293430079; Email: malikking6115@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042024T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.006666666666667,122.48827777777778,'https://www.google.com/maps?q=-4.006666666666667,122.48827777777778',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1714364318809-225e5b48-3dd4-452e-90e7-d43ebc3db3ed.jpg","https://sikumbang.tapera.go.id/public/upload/1714364319039-aef075f4-5f97-494c-b796-7049a948c431.jpg","https://sikumbang.tapera.go.id/public/upload/1714364319003-05409a11-a141-4b70-8f16-750e15a361e4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('aa9b4982-a1df-4939-b00c-01b5f139aa1e',NULL,'rumah_subsidi','rumah_tapak','BARUGA HARMONI 2 TAHAP 3','sikumbang-kdi0910022024t010','BARUGA HARMONI 2 TAHAP 3 oleh PT RASYA DWI MANDIRI (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. CHAIRIL ANWAR; Telp: 085241655027; Email: rasyadwimandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T010 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.977536111111111,122.47686666666667,'https://www.google.com/maps?q=-3.977536111111111,122.47686666666667',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1715072594312-aacc5525-133e-4be2-99df-232b77eae5a3.jpg","https://sikumbang.tapera.go.id/public/upload/1715072594575-ae540225-d64b-4861-94d2-95f3053eeef1.jpg","https://sikumbang.tapera.go.id/public/upload/1715072595675-f0cc97db-ff31-4f8f-8a67-9eb303e8a401.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('4c9c85ba-fad5-4f18-bc6f-ec8a02d57f48',NULL,'rumah_subsidi','rumah_tapak','PURI PRADANA','sikumbang-kdi0710012024t003','PURI PRADANA oleh PRADANA GROUP INDONESIA (REI).
Alamat: Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- PURI PRADANA (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. CHAIRIL ANWAR; Telp: 082231810164; Email: inhadafa15@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710012024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Wua Wua','Wua Wua, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-3.9911219444444446,122.48105472222223,'https://www.google.com/maps?q=-3.9911219444444446,122.48105472222223',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1715652407197-bd8e4062-96d9-49df-b46d-1e08e8acf567.jpg","https://sikumbang.tapera.go.id/public/upload/1715652407213-3426669c-e98f-40dd-9323-6aceb3c40105.jpg","https://sikumbang.tapera.go.id/public/upload/1715652407003-2835d22e-df0a-4805-8327-cc55dc5082a2.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e49f940b-b6e1-452c-a0bf-008e20f813da',NULL,'rumah_subsidi','rumah_tapak','PURI KHANISSA RESIDENCE V','sikumbang-kka1220102024t001','PURI KHANISSA RESIDENCE V oleh PT KHAILAH BERKAH JAYA (PI).
Alamat: Ulu Baula, Kec. Baula, Kab Kolaka, Sulawesi Tenggara.
Total unit: 56 subsidi / 6 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 45 (Komersil): Rp 300.000.000, LB 52.5 m2 / LT 120 m2, 2 KT / 2 KM, 1 lantai.

Kantor pemasaran: Alamat: Dsn. III Ulu Baula; Telp: 082238234938; Email: pt.khalahberkahjayakdi@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA1220102024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Baula','Ulu Baula','Ulu Baula, Kec. Baula, Kab Kolaka, Sulawesi Tenggara',NULL,-4.153015000000001,121.687121,'https://www.google.com/maps?q=-4.153015000000001,121.687121',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1709860369436-ec3a0a77-0717-4d12-b7e8-2a201f88c000.jpeg","https://sikumbang.tapera.go.id/public/upload/1709860369329-2189e931-bce7-4e2e-b666-6945d81d2160.jpeg","https://sikumbang.tapera.go.id/public/upload/1709860369458-e2c659a7-a512-4d4d-91f5-40d6163eb68d.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c815a80c-f686-4bcc-9053-f99987144063',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN BAROKAH ABADI','sikumbang-kdi0310072024t003','PERUMAHAN BAROKAH ABADI oleh PT SWARNA DWIPA PROPERTY (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Sao Sao; Telp: 082120860799; Email: ptswarnadwipaproperty@gmail.com; Web: swarnadwipaproperty.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0250737,122.474361,'https://www.google.com/maps?q=-4.0250737,122.474361',173000000.0,'total',FALSE,2,1,36,92,1,'{"https://sikumbang.tapera.go.id/public/upload/1716270216870-5d0742b3-6676-4028-9bd2-03fdd7ad0d50.jpg","https://sikumbang.tapera.go.id/public/upload/1716270217269-6ba58f49-2d4a-4048-a0df-1477e930cf9f.jpg","https://sikumbang.tapera.go.id/public/upload/1716270217574-e8879734-50b2-4fa5-a9a7-c2f41de651c8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6884cdb2-62b4-4117-9a1d-6c1eae0b6ba8',NULL,'rumah_subsidi','rumah_tapak','GRIYA SHAFANA','sikumbang-kdi0710042024t005','GRIYA SHAFANA oleh CV RAYYANKA PROPERTY (APERSI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 23 subsidi / 0 komersil.

Tipe rumah:
- 36 SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. Antero Hamra; Telp: 081213220192; Email: Rayyankaproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042024T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.0019527777777775,122.47866527777778,'https://www.google.com/maps?q=-4.0019527777777775,122.47866527777778',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1716182007642-675e09d5-2a7e-4d7a-b4b0-53ee621054df.jpg","https://sikumbang.tapera.go.id/public/upload/1716182007884-e6ac7e82-d507-4ba9-807c-bb9c09cfcebf.jpg","https://sikumbang.tapera.go.id/public/upload/1716182007917-76a9c4f6-448a-410c-b1ad-44f16b44cae1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('6d54ea54-311b-46d2-8ad4-ef12dea1bfb9',NULL,'rumah_subsidi','rumah_tapak','SHAN VILLAGE','sikumbang-kdi1010022024t002','SHAN VILLAGE oleh PT SHAN CELEBES CONSTRUCTION (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36 SUBSIDI (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jalan Balaikota IV; Telp: 081233054277; Email: ptshancelebesconstriction@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.0540280555555555,122.53134333333334,'https://www.google.com/maps?q=-4.0540280555555555,122.53134333333334',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1715343227200-13cffae5-99c7-46bf-8b4d-24ddf4f3087d.jpg","https://sikumbang.tapera.go.id/public/upload/1715343229615-6c992ad5-fc69-4650-b8cb-6656d87c9951.jpg","https://sikumbang.tapera.go.id/public/upload/1715343230021-89e5c19a-787e-4973-99bb-b88c47cabee8.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a130805d-9066-487a-8039-1604236b13b8',NULL,'rumah_subsidi','rumah_tapak','BINTANG REGENCY II','sikumbang-adl0720192024t001','BINTANG REGENCY II oleh PT BINTANG GROUP TERBUKA (REI).
Alamat: Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Belakang Brimob; Telp: 082216773545; Email: bintanggrouptbk@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/ADL0720192024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Konawe Selatan','Kab Konawe Selatan','Konda','Lalowiu','Lalowiu, Kec. Konda, Kab Konawe Selatan, Sulawesi Tenggara',NULL,-4.069780555555555,122.48739722222223,'https://www.google.com/maps?q=-4.069780555555555,122.48739722222223',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1717418598674-4dfe643f-de29-4326-9751-b62e4dd8a452.JPG","https://sikumbang.tapera.go.id/public/upload/1717418594771-e30416c1-3d91-4a3b-9a58-67746a802cb1.JPG","https://sikumbang.tapera.go.id/public/upload/1717418594933-778a7ebe-f979-4860-9ad7-f2a3b1beec88.JPG"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('3c642f28-5262-491a-9ea9-0b541840f799',NULL,'rumah_subsidi','rumah_tapak','Griya Mutiara Rahandouna','sikumbang-kdi0410042024t002','Griya Mutiara Rahandouna oleh PT MUTIARA BUMI PROPERTI (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- Rumah Subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Griya Mutiara Rahandouna, Jl. Kayu Santigi, Rahandouna, Poasia, Kota Kendari, Sulawesi Tenggara; Telp: +6282190338406; Email: mutiarabumipersada2023@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.011880555555556,122.55639722222222,'https://www.google.com/maps?q=-4.011880555555556,122.55639722222222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1716955440785-bfcb94a3-c83b-4b27-bd57-788039c6008e.jpeg","https://sikumbang.tapera.go.id/public/upload/1716955442748-34fa8cf0-97e3-480e-99b7-f257bcfffb07.jpeg","https://sikumbang.tapera.go.id/public/upload/1716955444417-dcc6d368-4f54-41dd-a82b-e2b521bc7208.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e26c3ded-99a7-4791-9f96-98140acd7957',NULL,'rumah_subsidi','rumah_tapak','TITA INDAH RESIDENCE TAHAP 2','sikumbang-kdi0410042024t001','TITA INDAH RESIDENCE TAHAP 2 oleh PT MAHA KARYA HALUOLEO (REI).
Alamat: Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara.
Total unit: 53 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN ABUNAWAS; Telp: 082333999914; Email: haluoleoproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0410042024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Poasia','Rahandouna','Rahandouna, Kec. Poasia, Kota Kendari, Sulawesi Tenggara',NULL,-4.020875,122.55180555555555,'https://www.google.com/maps?q=-4.020875,122.55180555555555',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1708499461149-315ac650-51ce-403c-8eb8-ab088849f379.jpg","https://sikumbang.tapera.go.id/public/upload/1708499462569-2328e936-c6e9-42e6-a3e7-bf6290dda80f.jpg","https://sikumbang.tapera.go.id/public/upload/1708499462108-037793b3-46e2-45d7-a8e6-3528a5e4eb8d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('ead06f67-2a0b-4860-9965-91b4f3c500bc',NULL,'rumah_subsidi','rumah_tapak','HUSADA RESIDENCE 2','sikumbang-bau0110132024t003','HUSADA RESIDENCE 2 oleh CV HUSADA RESIDENCE (APERNAS).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 74 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Wolter Monginsidi; Telp: 085298365009; Email: cvhusadaresidence152@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.517618166666667,122.56460569444444,'https://www.google.com/maps?q=-5.517618166666667,122.56460569444444',173000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/1707784958044-e63f278e-9028-431e-abaf-2f77b6803f8b.jpg","https://sikumbang.tapera.go.id/public/upload/1707784942264-63d87d3a-3aa5-41a9-8aa5-885c282767c8.jpg","https://sikumbang.tapera.go.id/public/upload/1707785004180-e7f643e0-dc0e-4182-abf7-2e75db8ea026.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('9a1a14c7-3f7e-4aec-9bdc-55f9b4363530',NULL,'rumah_subsidi','rumah_tapak','ODIXY LAND','sikumbang-kdi1010022024t001','ODIXY LAND oleh PT ODIXY PRATAMA GROUP (APERSI).
Alamat: Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara.
Total unit: 10 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF; Telp: 082291838426; Email: odixygroup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI1010022024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kambu','Mokoau','Mokoau, Kec. Kambu, Kota Kendari, Sulawesi Tenggara',NULL,-4.0404653999999995,122.53993729999999,'https://www.google.com/maps?q=-4.0404653999999995,122.53993729999999',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1708931552592-beadf7ee-bd03-48a2-a5ef-5f5be47d7958.jpg","https://sikumbang.tapera.go.id/public/upload/1708931550510-ae7e0613-25fd-4db7-a394-91056f5a1d41.jpg","https://sikumbang.tapera.go.id/public/upload/1708931551609-b28c7c10-647f-4672-8ad9-ba0209f9b431.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('933c224b-96b7-43e8-8d56-48c02bd9c928',NULL,'rumah_subsidi','rumah_tapak','CANTIKA RESIDENCE BARUGA','sikumbang-kdi0310012024t002','CANTIKA RESIDENCE BARUGA oleh PT GANTARI MEGA PRATAMA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.KS TUBUN; Telp: 082226666928; Email: Gantarimegapratama@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0546888999999995,122.50751809972222,'https://www.google.com/maps?q=-4.0546888999999995,122.50751809972222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1708930884148-4e810b4b-9902-4587-8f71-66fea81dae02.jpg","https://sikumbang.tapera.go.id/public/upload/1708930882873-28700654-98dd-4ea2-ae4d-ca1064c064d8.jpg","https://sikumbang.tapera.go.id/public/upload/1708930886374-19c74333-b412-44f5-a901-a704528f4d82.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a8bcea5e-22f2-4bb1-8a22-3d5df7d65a9d',NULL,'rumah_subsidi','rumah_tapak','LAGALIGO 3','sikumbang-kdi0310012024t003','LAGALIGO 3 oleh PT LAGALIGO PUTRA PERKASA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 60 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUPU YUSUF; Telp: 082259717776; Email: lagaligo_putraperkasa@yahoo.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0469824,122.50398479972222,'https://www.google.com/maps?q=-4.0469824,122.50398479972222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1708929386000-2ccf847f-7b62-4cf0-861b-d25e8caa92dd.jpg","https://sikumbang.tapera.go.id/public/upload/1708929381912-b56e43c8-6f93-48ea-992c-a6890cb8ced3.jpg","https://sikumbang.tapera.go.id/public/upload/1708929386269-6e43d32c-2bee-462c-ba58-cc8c70717ac7.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('23f827e4-d00f-4d3f-a788-60e6f711e4d6',NULL,'rumah_subsidi','rumah_tapak','HIDAYAT RESIDENCE PATOWONUA','sikumbang-lss0120152024t001','HIDAYAT RESIDENCE PATOWONUA oleh PT PT. BABANA KONSTRUKSI PERSADA (REI).
Alamat: Patowonua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 3 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl.Tamangera ; Telp: 085298747679; Email: babanakonstruksipersada@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0120152024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Patowonua','Patowonua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.512661,120.88823497222224,'https://www.google.com/maps?q=-3.512661,120.88823497222224',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1709272541637-563d7dfa-5e36-4263-9573-2f73e27ae355.jpg","https://sikumbang.tapera.go.id/public/upload/1709272542139-bb137bda-5f4c-49e0-9f76-9b10d9988ed1.jpg","https://sikumbang.tapera.go.id/public/upload/1709272542145-54d5cd8b-e015-45ab-932c-8d8cf5d31035.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a683e588-7852-4046-98b7-f864b7287ee6',NULL,'rumah_subsidi','rumah_tapak','VILLA BARUGA','sikumbang-kdi0310082024t001','VILLA BARUGA oleh PT CITRA HANABI PROPERTY (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 4 subsidi / 0 komersil.

Tipe rumah:
- 36/91 (Subsidi): Rp 17.300.000, LB 36 m2 / LT 200 m2, 2 KT / 1 KM, 1 lantai.
- 36/91 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 200 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. DI PANJAITAN KOMPLEKS THE VILLAS; Telp: 08114499519; Email: citrahanabiproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310082024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.016299166666666,122.48484888888889,'https://www.google.com/maps?q=-4.016299166666666,122.48484888888889',17300000.0,'total',FALSE,2,1,36,200,1,'{"https://sikumbang.tapera.go.id/public/upload/1709523127317-48dd14d7-5a75-42a1-aa0f-8df6e00dc78d.jpg","https://sikumbang.tapera.go.id/public/upload/1709523127487-ef245ae3-0ae0-4299-a7b0-cfd24ff8a950.jpg","https://sikumbang.tapera.go.id/public/upload/1709523130439-8d1bb195-727d-4e54-949e-19d5ab1ec3f3.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e440ac56-61bd-423a-ac02-54682edee137',NULL,'rumah_subsidi','rumah_tapak','AZHARNA BARUGA','sikumbang-kdi0310012024t004','AZHARNA BARUGA oleh SURYA AZHARNA GRAHA (APERSI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 0 komersil.

Tipe rumah:
- 36/87.5 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 87.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.SUSPU YUSUF; Telp: 081221888857; Email: margahayumega@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012024T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0424996,122.50138149972223,'https://www.google.com/maps?q=-4.0424996,122.50138149972223',173000000.0,'total',FALSE,2,1,36,87.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1709783066528-3905442c-3e14-4d5a-956e-251f28ca6e60.jpg","https://sikumbang.tapera.go.id/public/upload/1709783060517-d203e30a-2993-4b7e-8117-2395f8a4385e.jpg","https://sikumbang.tapera.go.id/public/upload/1709783066365-7271f23c-96b4-4b42-bea6-31ab66169923.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('657cf68e-6314-44ee-b1c1-b14669b2b3a8',NULL,'rumah_subsidi','rumah_tapak','GRIYA MUTIARA BARUGA TAHAP 2','sikumbang-kdi0310012024t005','GRIYA MUTIARA BARUGA TAHAP 2 oleh PT RIZKI ANAWONUA PROPERTINDO (ASPRUMNAS).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: GRIYA MUTIRA BARUGA1  JALAN PASAR BARUGA; Telp: 085349749983; Email: rizki.anawonua@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012024T005 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0496469444444445,122.48027694444444,'https://www.google.com/maps?q=-4.0496469444444445,122.48027694444444',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1709803040483-2edeb5d9-4d65-46db-bf9c-8f68a6cf2525.jpg","https://sikumbang.tapera.go.id/public/upload/1709803040047-612d6925-1d51-4a5f-8fb8-f2a849779453.jpg","https://sikumbang.tapera.go.id/public/upload/1709803040172-47954e8f-491a-41ee-a9ea-80f806ea46ac.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('695692f0-6c99-4523-8ac5-a28318455421',NULL,'rumah_subsidi','rumah_tapak','MADINAH CITY SQUARE V','sikumbang-kdi0910022024t007','MADINAH CITY SQUARE V oleh PT SWARNA DWIPA PROPERTY (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 29 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Sao Sao ; Telp: 082120860799; Email: ptswarnadwipaproperty@gmail.com; Web: swarnadwipaproperty.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T007 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9759069,122.47556509972222,'https://www.google.com/maps?q=-3.9759069,122.47556509972222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1710731931316-7f6894ca-74a8-4776-a412-0f3f768e5e6c.jpg","https://sikumbang.tapera.go.id/public/upload/1710731931353-ba04a37f-6a8f-4f2f-9f53-c8a36ecffe90.jpg","https://sikumbang.tapera.go.id/public/upload/1710731931236-1e82e406-b0ef-4229-a88c-f275c0a32b63.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('cb9d8e5f-303a-4f91-be0a-f13d03bb2d1e',NULL,'rumah_subsidi','rumah_tapak','GRAND MANGKUBUMI RESIDENCE 2','sikumbang-kdi0910022024t008','GRAND MANGKUBUMI RESIDENCE 2 oleh PT SWARNA DWIPA PROPERTY (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Sao Sao; Telp: 082120860799; Email: ptswarnadwipaproperty@gmail.com; Web: swarnadwipaproperty.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T008 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.958379252777778,122.47333774444445,'https://www.google.com/maps?q=-3.958379252777778,122.47333774444445',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1711089106554-435c16c2-28bc-4822-b20f-4d897c1fb249.jpg","https://sikumbang.tapera.go.id/public/upload/1711089106651-0b011151-ff16-4491-9559-f2557dbdab6c.jpg","https://sikumbang.tapera.go.id/public/upload/1711089106883-ccc26c4d-fdef-4489-b567-281bb0d3a48a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('e7d0fe42-e936-49a6-a92b-79442577a65b',NULL,'rumah_subsidi','rumah_tapak','Virera Residance','sikumbang-trw0110162024t001','Virera Residance oleh PT VIRERA JAYA INDONESIA (REI).
Alamat: Tababu, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 5 subsidi / 0 komersil.

Tipe rumah:
- subsidi 36 m2 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 110 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Kel.Rate-Rate,Kec.Tirawuta,Kab.kolaka Timur; Telp: 082217250793; Email: jayavirera@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0110162024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Tababu','Tababu, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.053157805555555,121.8902358888889,'https://www.google.com/maps?q=-4.053157805555555,121.8902358888889',173000000.0,'total',FALSE,2,1,36,110,1,'{"https://sikumbang.tapera.go.id/public/upload/1711413537530-ab578137-a071-4797-b4e6-a9c8969919f1.jpg","https://sikumbang.tapera.go.id/public/upload/1711413485458-bc91f959-5a59-4192-9d8d-5e0ff46c683f.jpg","https://sikumbang.tapera.go.id/public/upload/1711413510961-31c09fda-1f53-4020-b149-871df628ce40.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('81abd25d-7e64-4ef6-8506-cd91f65b8e22',NULL,'rumah_subsidi','rumah_tapak','Dickyland','sikumbang-trw0120092024t001','Dickyland oleh PT LANGGAI TUNGGAL PERKASA (REI).
Alamat: Orawa, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 21 subsidi / 0 komersil.

Tipe rumah:
- 36/84 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: DUSUN III INEA; Telp: 0823 - 4743 - 3699; Email: langgaitunggalperkasa@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120092024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Orawa','Orawa, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.034575833333333,121.91084194444446,'https://www.google.com/maps?q=-4.034575833333333,121.91084194444446',173000000.0,'total',FALSE,2,1,36,112,1,'{"https://sikumbang.tapera.go.id/public/upload/1711097473329-fa49874c-6552-495d-b8fa-77eb9977a72b.jpg","https://sikumbang.tapera.go.id/public/upload/1711097481057-1c922adc-1dff-4fe0-ae92-ffb306badf50.jpg","https://sikumbang.tapera.go.id/public/upload/1711097477996-67d4404e-dea4-474c-a91c-d7349841a6c1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c9e9bb00-7443-48a1-bb57-27c24df25d71',NULL,'rumah_subsidi','rumah_tapak','BUKIT NUSANTARA SQUARE','sikumbang-kdi0310072024t002','BUKIT NUSANTARA SQUARE oleh PT TULUS BERKARYA UTAMA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 8 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Sao-Sao; Telp: 082349601510; Email: tulusberkaryautama@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0180993916666665,122.48897795555555,'https://www.google.com/maps?q=-4.0180993916666665,122.48897795555555',173000000.0,'total',FALSE,2,1,36,92,1,'{"https://sikumbang.tapera.go.id/public/upload/1711597364434-22e83b1f-bf26-4146-a810-2ee7fd1c9354.jpg","https://sikumbang.tapera.go.id/public/upload/1711597364781-6b9684f7-fd14-474e-b101-8c4275b8c580.jpg","https://sikumbang.tapera.go.id/public/upload/1711597364498-8e6e5446-7b35-4939-a790-24bac2ce14d1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('22149987-3139-480c-bafc-c527d91c3ab3',NULL,'rumah_subsidi','rumah_tapak','AFIKA PARK','sikumbang-kdi0310012024t006','AFIKA PARK oleh PT SAHIR PROPERTINDO NIAGA (REI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 151 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ks Tubun; Telp: 082393287000; Email: pt.sahirproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012024T006 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.050308,122.505731,'https://www.google.com/maps?q=-4.050308,122.505731',173000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1711950922802-20053496-e06f-43cb-950e-a536182bb3bd.jpg","https://sikumbang.tapera.go.id/public/upload/1711950923292-eb59424d-e08c-4ccc-b643-4d7bb74c6e0e.jpg","https://sikumbang.tapera.go.id/public/upload/1711950922786-7fb2fd45-9b21-4305-aee7-8161be2f31c4.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('fdba5472-28f1-4318-b5f3-ed7259bd7f64',NULL,'rumah_subsidi','rumah_tapak','LARA REGENSY II','sikumbang-trw0120072024t001','LARA REGENSY II oleh BANUA BAKKARANG DEVELOPMENT (HIMPERRA).
Alamat: Lara, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara.
Total unit: 23 subsidi / 0 komersil.

Tipe rumah:
- subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 120 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Desa Lara,kec.Tirawuta,Kab.Kolaka Timur; Telp: 082217250793; Email: banuabakkarang@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/TRW0120072024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Timur','Kab Kolaka Timur','Tirawuta','Lara','Lara, Kec. Tirawuta, Kab Kolaka Timur, Sulawesi Tenggara',NULL,-4.049172861111111,121.92213438888889,'https://www.google.com/maps?q=-4.049172861111111,121.92213438888889',173000000.0,'total',FALSE,2,1,36,120,1,'{"https://sikumbang.tapera.go.id/public/upload/1712198636035-68fcd096-5d1d-44dd-8f82-361df788024b.jpg","https://sikumbang.tapera.go.id/public/upload/1712198595701-e061ce02-cce1-4523-8e85-0c9864cd8926.jpg","https://sikumbang.tapera.go.id/public/upload/1712198613525-363f50e8-bf67-4ae1-9331-45a42dc1b30b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('7ef7d94a-80bf-4580-8182-2250f4dfb8b4',NULL,'rumah_subsidi','rumah_tapak','GRIYA MULYA','sikumbang-kdi0710042024t002','GRIYA MULYA oleh PT MEGA HARAPAN (APERSI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 2 subsidi / 2 komersil.

Tipe rumah:
- 45 (Komersil): Rp 250.000.000, LB 45 m2 / LT 112 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Ahmad Yani ; Telp: 082293430073; Email: megaharapan277@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.006666666666667,122.48827777777778,'https://www.google.com/maps?q=-4.006666666666667,122.48827777777778',173000000.0,'total',FALSE,2,1,36,98,1,'{"https://sikumbang.tapera.go.id/public/upload/1713255970109-cbc6c291-d83d-43a9-8bdf-4da4204e98e1.jpg","https://sikumbang.tapera.go.id/public/upload/1713255970352-77a79faa-ed19-4ac6-bf03-e90f69d01c85.jpg","https://sikumbang.tapera.go.id/public/upload/1713255970528-e7ca694d-5518-4396-8b8f-8a04d510baac.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('60ee55b8-ec9f-4ee2-938a-6cc4250a7abe',NULL,'rumah_subsidi','rumah_tapak','THREEA HILL RESIDENCE','sikumbang-kdi0310022024t002','THREEA HILL RESIDENCE oleh PT THREEA PUTRA MANDIRI (REI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 37 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 92 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: KELURAHAN LEPO-LEPO, KECAMATAN BARUGA, PROVINSI SULAWESI TENGGARA. JLN BOULEVARD, KOTA KENDARI; Telp: 0821-8970-2253; Email: pt.threeaputramandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.031350833333334,122.51194083333333,'https://www.google.com/maps?q=-4.031350833333334,122.51194083333333',173000000.0,'total',FALSE,2,1,36,92,1,'{"https://sikumbang.tapera.go.id/public/upload/1711519357516-581fbdcc-fd9c-4000-89d6-f275bf75dc4a.jpg","https://sikumbang.tapera.go.id/public/upload/1711519356735-498fcc55-1383-4255-b2a0-bf726890ce6f.jpg","https://sikumbang.tapera.go.id/public/upload/1711519358461-be4eb420-c394-4429-99f5-515274fbd410.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a75162fc-566a-4145-806e-893eb70a82b6',NULL,'rumah_subsidi','rumah_tapak','GRAND LAGOSI','sikumbang-kdi0710042024t001','GRAND LAGOSI oleh PT PROPERTI NIAGA MANDIRI (APERSI).
Alamat: Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara.
Total unit: 15 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL.CHAIRIL ANWAR; Telp: 08114531208; Email: propertiniagamandiri@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0710042024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Wua-wua','Anawai','Anawai, Kec. Wua-wua, Kota Kendari, Sulawesi Tenggara',NULL,-4.000323888888889,122.48090194444444,'https://www.google.com/maps?q=-4.000323888888889,122.48090194444444',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1703391884957-9cdcec68-e722-41bd-a660-3c609e2b9617.jpg","https://sikumbang.tapera.go.id/public/upload/1703391885608-ec07ab2c-f3ac-4c7c-9df1-6037f3a2de2b.jpg","https://sikumbang.tapera.go.id/public/upload/1703391658577-fb3f7f2d-5aa6-4ed4-8e8b-1b0b468f62bc.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('42f93785-e460-4c24-b22b-a7d37802248c',NULL,'rumah_subsidi','rumah_tapak','Hamonangan Green House 2','sikumbang-kdi0910022024t001','Hamonangan Green House 2 oleh PT HAMONANGAN PERSADA GRUP (APERSI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 30 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Made Sabara, Kompl. Ruko (Samping toko Roti Caprisca) lt. 2; Telp: 08114000225; Email: hamonanganpersadagrup@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.954015027777778,122.47229766666666,'https://www.google.com/maps?q=-3.954015027777778,122.47229766666666',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1704676075761-7f6a12a9-fc25-46d9-b99f-775c3c0aa583.jpg","https://sikumbang.tapera.go.id/public/upload/1704676074490-0ddc5da6-9a81-496d-9da7-36be014e2ad1.jpg","https://sikumbang.tapera.go.id/public/upload/1704676075537-595763eb-f532-4325-9a2f-e096b38f1288.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('24427464-446e-4444-aafa-6ad15826a1dc',NULL,'rumah_subsidi','rumah_tapak','ADHWA RUMAH ASRI','sikumbang-kdi0310012024t001','ADHWA RUMAH ASRI oleh PT CIPTA UPAJIWA ANAK NEGERI (PI).
Alamat: Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 168.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Kstubun; Telp: 082228198468; Email: alwisetiawan199704@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310012024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Baruga','Baruga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.042361111111111,122.50393055555556,'https://www.google.com/maps?q=-4.042361111111111,122.50393055555556',168000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1704717497320-60a81633-13fa-460b-a0d1-69475858d57d.jpg","https://sikumbang.tapera.go.id/public/upload/1704717497317-bdae9dcd-f28f-4d98-9555-119a8000097d.jpg","https://sikumbang.tapera.go.id/public/upload/1704717497433-97df0168-8588-48ac-846c-de1bb70cb56d.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('b697e080-dfe9-43e6-8ccd-c1dfb9ab99cb',NULL,'rumah_subsidi','rumah_tapak','PRIMA CAMPUS SQUARE','sikumbang-kdi0310022024t001','PRIMA CAMPUS SQUARE oleh PT TULUS BERKARYA UTAMA (REI).
Alamat: Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 28 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 92.3 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Sao Sao; Telp: 082349601510; Email: tulusberkaryautama@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310022024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Lepo Lepo','Lepo Lepo, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.0265165,122.51218576944444,'https://www.google.com/maps?q=-4.0265165,122.51218576944444',173000000.0,'total',FALSE,2,1,36,92.3,1,'{"https://sikumbang.tapera.go.id/public/upload/1704935935818-4f54df17-045e-4f49-baa4-67661b53a7f3.jpg","https://sikumbang.tapera.go.id/public/upload/1704935936355-55ddc0b8-e5e8-47b2-91d8-0c8177292860.jpg","https://sikumbang.tapera.go.id/public/upload/1704935936498-8bbf0f6e-83f7-4cea-bdec-d590fc3912db.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('88a8277f-15fb-4f2d-a5f0-cc2f21387f5a',NULL,'rumah_subsidi','rumah_tapak','MUTIARA ATHIRA 3','sikumbang-kdi0310072024t001','MUTIARA ATHIRA 3 oleh PT SHIFA ISTHIN NEISYA (REI).
Alamat: Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidii) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL SYECH YUSUF; Telp: 082293198772; Email: Yusharisharm@gmail.com; Web: https://maps.app.goo.gl/HevCgDdhTdPNHeoy8

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0310072024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Baruga','Watubangga','Watubangga, Kec. Baruga, Kota Kendari, Sulawesi Tenggara',NULL,-4.034670805555556,122.47866058333334,'https://www.google.com/maps?q=-4.034670805555556,122.47866058333334',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1704885657368-74d05d96-f511-4337-9b34-e5149780f109.jpg","https://sikumbang.tapera.go.id/public/upload/1704885656929-6ed16291-f5a5-4581-a380-50c92a836171.jpg","https://sikumbang.tapera.go.id/public/upload/1704885657178-9e2b6fde-3431-486b-8d30-2f4c1f9ff1b1.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('07360692-ba33-49f9-bd39-1f4734b9a727',NULL,'rumah_subsidi','rumah_tapak','PERUMAHAN KHAYRA RESIDENCE','sikumbang-kdi0910022024t002','PERUMAHAN KHAYRA RESIDENCE oleh PT KHALID INDO PROPERTY (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL CHAIRIL ANWAR; Telp: 085338169674; Email: khalidindopropery@gmail.com; Web: 00

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9592806997222225,122.4749017,'https://www.google.com/maps?q=-3.9592806997222225,122.4749017',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1704960413313-79703c28-ee39-4040-b31e-0d633ef31bb3.jpg","https://sikumbang.tapera.go.id/public/upload/1704960413864-185fb7af-918e-48d6-a1a8-8073d776d2be.jpg","https://sikumbang.tapera.go.id/public/upload/1704960413897-98145295-2ecf-411c-8fa3-1d1549256aab.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c63fc264-fc4f-4682-b56a-f3cecdff4ab7',NULL,'rumah_subsidi','rumah_tapak','FELYCIA RESIDENCE 4','sikumbang-kdi0910022024t003','FELYCIA RESIDENCE 4 oleh PT FELYCIA PROPERTINDO NIAGA (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 13 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: jl.chairil Anwar, Perumahan Afika Residence; Telp: 082393287000; Email: pt.sahirproperty@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T003 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.981472,122.481465,'https://www.google.com/maps?q=-3.981472,122.481465',173000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1705369743109-1efc179e-f1de-4566-a221-980c304e812e.jpg","https://sikumbang.tapera.go.id/public/upload/1705369737037-60450a8f-0e9e-4548-9ec1-6307d4b873d7.JPG","https://sikumbang.tapera.go.id/public/upload/1705369740455-04049313-e21a-4944-8bd5-cfca0724ed2a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('94e1e6d1-4f00-4df8-a076-67e3fd63ad0d',NULL,'properti_developer','rumah_tapak','Sentra GMT 2','sikumbang-kdi0810042024t001','Sentra GMT 2 oleh PT GRAHA PROPERTI PRIMA (REI).
Alamat: Wowawanggu, Kec. Kadia, Kota Kendari, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- Ruko GMT 2 (Komersil): Rp 2.500.000.000, LB 310 m2 / LT 178 m2, 3 KT / 3 KM, 3 lantai.

Kantor pemasaran: Alamat: Jl. D.I. Pandajitan Perum The Villas Kendari Blok B2; Telp: 3092888; Email: thevillaskendari@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0810042024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Kadia','Wowawanggu','Wowawanggu, Kec. Kadia, Kota Kendari, Sulawesi Tenggara',NULL,-3.9912538997222224,122.5074666,'https://www.google.com/maps?q=-3.9912538997222224,122.5074666',2500000000.0,'total',FALSE,3,3,310,178,3,'{"https://sikumbang.tapera.go.id/public/upload/1705031270425-5e20d64f-d3c6-406a-8b5c-4ae3ca20f40b.jpg","https://sikumbang.tapera.go.id/public/upload/1705031271529-b389f8d6-5d05-4325-ba27-31cb0edeaf46.jpg","https://sikumbang.tapera.go.id/public/upload/1705031272928-90f574f8-a6e1-4d17-b14c-50582f3c291f.jpg"}','{}',NULL,TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('1932adaf-b5b2-4c47-941f-b0ffae5008b1',NULL,'rumah_subsidi','rumah_tapak','CECERIA RESIDENCE LANJUTAN TAHAP III','sikumbang-bau0110132024t001','CECERIA RESIDENCE LANJUTAN TAHAP III oleh CV MELAJU JAYA (PI).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 41 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 102 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. GAJAH MADA; Telp: 082290115797; Email: melajujayacv@gmail.com; Web: -

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.519380555555555,122.57125555555555,'https://www.google.com/maps?q=-5.519380555555555,122.57125555555555',173000000.0,'total',FALSE,2,1,36,102,1,'{"https://sikumbang.tapera.go.id/public/upload/1705310082033-0b87b5fc-8210-4e61-a7a4-1b6ca4477b82.jpg","https://sikumbang.tapera.go.id/public/upload/1705310075354-db9e6331-5656-4184-95ad-62cdd6e5f5ce.jpg","https://sikumbang.tapera.go.id/public/upload/1705310083910-fb56dc97-0554-4054-9046-d598ad7165ae.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('bde0ead2-5afd-4682-ba3d-511004716932',NULL,'rumah_subsidi','rumah_tapak','BINTANG MASAGENAH','sikumbang-lss0110012024t001','BINTANG MASAGENAH oleh PT MEGA BOLA MASAGENA (HIMPERRA).
Alamat: Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara.
Total unit: 1 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JALAN GRIYA BINTANG ELEGAN; Telp: 0811401970; Email: megabolamasagena@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/LSS0110012024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka Utara','Kab Kolaka Utara','Lasusua','Lasusua','Lasusua, Kec. Lasusua, Kab Kolaka Utara, Sulawesi Tenggara',NULL,-3.5005555555555556,120.88222222222221,'https://www.google.com/maps?q=-3.5005555555555556,120.88222222222221',173000000.0,'total',FALSE,2,1,36,84,1,'{"https://sikumbang.tapera.go.id/public/upload/1705634490317-8726b267-19a5-4f30-aabf-e4f02620bad7.jpg","https://sikumbang.tapera.go.id/public/upload/1705634491134-e09178bf-3c12-44b6-ad4d-587f46c8720f.jpg","https://sikumbang.tapera.go.id/public/upload/1705634490996-b9c08fa9-eac2-4608-bc7a-3a3fcb4d7c90.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('2fb87822-edb3-4a41-b6ae-e452f1e3cbae',NULL,'rumah_subsidi','rumah_tapak','GRIYA TANAH JAYA','sikumbang-kka0410032024t001','GRIYA TANAH JAYA oleh PT BUMI MEKONGGA PROPERTY (REI).
Alamat: Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara.
Total unit: 0 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 84.5 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Pemuda (Samping SPBU SMP 1 Kolaka); Telp: 082299407478; Email: pt.bumimekonggaproperty2015@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KKA0410032024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Kolaka','Kab Kolaka','Kolaka','Balandete','Balandete, Kec. Kolaka, Kab Kolaka, Sulawesi Tenggara',NULL,-4.071411111111111,121.63050077777777,'https://www.google.com/maps?q=-4.071411111111111,121.63050077777777',173000000.0,'total',FALSE,2,1,36,84.5,1,'{"https://sikumbang.tapera.go.id/public/upload/1705683027675-eecca9ec-c6d9-4a0f-9bce-5466f0c6c3f7.jpg","https://sikumbang.tapera.go.id/public/upload/1705683013001-3be68a38-976e-4542-8885-3ece18b73993.jpg","https://sikumbang.tapera.go.id/public/upload/1705683022187-43c00971-6f39-4e05-a136-d93e475bbdf0.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('c4457c2d-76c9-4243-9f62-1cf024088f01',NULL,'rumah_subsidi','rumah_tapak','PURI TAMAN KENDARI TAHAP 2','sikumbang-kdi0910032024t001','PURI TAMAN KENDARI TAHAP 2 oleh PT PRATAMA JAYA PROPERTI (REI).
Alamat: Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 12 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: PERM. PURI TAMAN KENDARI BLOK B; Telp: 082352623961; Email: ptpratamajayaproperti19@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910032024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Punggolaka','Punggolaka, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9696805555555557,122.49507222222222,'https://www.google.com/maps?q=-3.9696805555555557,122.49507222222222',173000000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1706062640444-c06933ef-4ed8-4c1c-b362-6caf678cc905.jpeg","https://sikumbang.tapera.go.id/public/upload/1706062639352-41fb67f7-892e-4e5d-8f62-6c5a9e9d9074.jpeg","https://sikumbang.tapera.go.id/public/upload/1706062640077-0b39d5a0-afa5-46d2-a296-8b6717ba1734.jpeg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('46c18e3e-4b1a-44eb-bf69-78a073450135',NULL,'rumah_subsidi','rumah_tapak','BUKIT MEDINA INDAH 2','sikumbang-bau0110132024t002','BUKIT MEDINA INDAH 2 oleh PT KENSU PUTRA JAYA (PI).
Alamat: Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara.
Total unit: 29 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 96 m2, 2 KT / 1 KM, 1 lantai.
- 36  (New) (Subsidi): Rp 173.000.000, LB 36 m2 / LT 90 m2, 2 KT / 1 KM, 1 lantai.
- 36/116 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 116 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jl. Dayanu Ikhsanuddin; Telp: 085256904454; Email: kensuputrajy@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/BAU0110132024T002 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Bau Bau','Kota Bau Bau','Betoambari','Sulaa','Sulaa, Kec. Betoambari, Kota Bau Bau, Sulawesi Tenggara',NULL,-5.502935861111111,122.56207275,'https://www.google.com/maps?q=-5.502935861111111,122.56207275',173000000.0,'total',FALSE,2,1,36,96,1,'{"https://sikumbang.tapera.go.id/public/upload/1705964938713-aaa59c00-7342-4d2f-9166-2515cecd79ed.jpg","https://sikumbang.tapera.go.id/public/upload/1705964951461-59bfe2d2-46b8-438a-a8a7-a4575130c2a7.jpg","https://sikumbang.tapera.go.id/public/upload/1705964964274-bae17ebd-776c-49ce-8e21-762564efdd0a.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('00c4768c-0e69-4f1c-9d7c-86fe887011be',NULL,'rumah_subsidi','rumah_tapak','PURI KONGGOASA','sikumbang-kdi0910022024t004','PURI KONGGOASA oleh PT ROVINDO GLOBAL INTI SUKSES (REI).
Alamat: Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara.
Total unit: 46 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 17.300.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.
- 36 subsidi (Subsidi): Rp 173.000.000, LB 36 m2 / LT 98 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: JL. PRAMUKA; Telp: 08124588815; Email: roland.a.lukman@gmail.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/KDI0910022024T004 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kota Kendari','Kota Kendari','Puuwatu','Watulondo','Watulondo, Kec. Puuwatu, Kota Kendari, Sulawesi Tenggara',NULL,-3.9534358333333337,122.47211194444445,'https://www.google.com/maps?q=-3.9534358333333337,122.47211194444445',17300000.0,'total',FALSE,2,1,36,91,1,'{"https://sikumbang.tapera.go.id/public/upload/1706769569141-646fafba-f8b8-43b5-8627-fda26da193d8.jpg","https://sikumbang.tapera.go.id/public/upload/1706769567192-1690f22b-2686-4226-afd3-4114ca6ae2b9.jpg","https://sikumbang.tapera.go.id/public/upload/1706769569492-c531467f-817a-4935-af04-9cb9d26fcd5b.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE),
('a2ef5a6c-bc2f-4926-b6f5-373b0d494e55',NULL,'rumah_subsidi','rumah_tapak','AHNAF RESIDENCE','sikumbang-rmb0410042024t001','AHNAF RESIDENCE oleh PT MAM SENTOSA INDONESIA (REI).
Alamat: Lantawonua, Kec. Rumbia, Kab Bombana, Sulawesi Tenggara.
Total unit: 46 subsidi / 0 komersil.

Tipe rumah:
- 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 104 m2, 2 KT / 1 KM, 1 lantai.

Kantor pemasaran: Alamat: Jln. Sangkona Desa Lantawonua Kec. Rumbia Kab. Bombana Sulawesi Tenggara; Telp: 082259214595; Email: mamsentosaindonesia@gmail.com; Web: www.ahnafresidence.com

Sumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/RMB0410042024T001 (diakses 2026-10-04). Data direktori agregat, bukan listing yang dipasang SUKI.','Sulawesi Tenggara','Kab Bombana','Kab Bombana','Rumbia','Lantawonua','Lantawonua, Kec. Rumbia, Kab Bombana, Sulawesi Tenggara',NULL,-4.768936138888889,122.037117,'https://www.google.com/maps?q=-4.768936138888889,122.037117',173000000.0,'total',FALSE,2,1,36,104,1,'{"https://sikumbang.tapera.go.id/public/upload/1681365541121-0b45bfc1-b040-45fb-92ab-99bb4e3c8f82.jpg","https://sikumbang.tapera.go.id/public/upload/1681365545689-d0062bac-bd08-48df-987a-14bd2e55adc1.jpg","https://sikumbang.tapera.go.id/public/upload/1681365548916-df113ca5-92ed-4127-87ee-1a7d51eff87e.jpg"}','{}','KPR Subsidi',TRUE,NULL,'new','available',FALSE,FALSE,0,0,0,'2026-10-03T17:00:05.506777+00:00',FALSE)
) AS v(id,seller_id,category,property_type,title,slug,description,province,city,regency_name,district,subdistrict_name,address_detail,postal_code,latitude,longitude,maps_link,price,price_type,is_negotiable,bedrooms,bathrooms,building_area_sqm,land_area_sqm,floors,images,amenities,subsidy_program,can_kpr,certificate_type,condition,status,is_admin_verified,is_featured,views_count,favorites_count,inquiries_count,published_at,ai_generated)
WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.slug = v.slug);


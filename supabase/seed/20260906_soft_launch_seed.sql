-- SultraKita soft-launch fixture seed.
-- Run only after creating these five users in Supabase Auth:
-- admin@sultrakita.local, seller.kendari1@sultrakita.local,
-- seller.kendari2@sultrakita.local, creator.wakatobi@sultrakita.local,
-- buyer.kendari@sultrakita.local.
-- This script never creates, updates, or deletes auth users and is idempotent.

begin;

create temporary table if not exists _sultra_seed_users on commit drop as
select id, email from auth.users where email in (
  'admin@sultrakita.local', 'seller.kendari1@sultrakita.local',
  'seller.kendari2@sultrakita.local', 'creator.wakatobi@sultrakita.local',
  'buyer.kendari@sultrakita.local'
);

-- Missing users are intentionally a no-op rather than a partial production seed.
do $$
begin
  if (select count(*) from _sultra_seed_users) <> 5 then
    raise exception 'Soft-launch seed requires exactly five pre-created Auth users; found %', (select count(*) from _sultra_seed_users);
  end if;
end $$;

insert into public.profiles (id, full_name, phone)
select u.id, v.full_name, v.phone
from _sultra_seed_users u
join (values
  ('admin@sultrakita.local', 'Admin SultraKita', '+6281230000001'),
  ('seller.kendari1@sultrakita.local', 'Nurul Tenun Kendari', '+6281230000002'),
  ('seller.kendari2@sultrakita.local', 'Rizal Rasa Kendari', '+6281230000003'),
  ('creator.wakatobi@sultrakita.local', 'Aulia Wakatobi', '+6281230000004'),
  ('buyer.kendari@sultrakita.local', 'Dian Pembeli Kendari', '+6281230000005')
) as v(email, full_name, phone) on v.email = u.email
on conflict (id) do update set full_name = excluded.full_name, phone = excluded.phone;

-- The production schema uses seller_id/category_id on the marketplace tables.
-- Category slugs are resolved instead of hardcoding IDs.
with sellers as (
  select (select id from _sultra_seed_users where email = 'seller.kendari1@sultrakita.local') as seller_id,
         (select id from _sultra_seed_users where email = 'seller.kendari2@sultrakita.local') as seller2_id
), fixtures(title, description, price, category_slug, district, seller_id) as (
  select f.title, f.description, f.price, f.category_slug, f.district,
         case when f.seller_key = 1 then s.seller_id else s.seller2_id end
  from sellers s cross join (values
    ('Kain Tenun Buton Motif Emas', 'Tenun Buton handmade dengan benang emas, cocok untuk acara adat dan hadiah premium.', 875000, 'fashion', 'Wolio', 1),
    ('Tas Anyaman Pandan Wakatobi', 'Tas anyaman ringan buatan perajin lokal Wakatobi, tersedia ukuran harian dan oleh-oleh.', 185000, 'fashion', 'Wangi-Wangi', 1),
    ('Jasa Tour Guide Wakatobi 2 Hari', 'Pendamping wisata lokal untuk snorkeling, kuliner, dan cerita budaya Wakatobi.', 1250000, 'jasa', 'Wangi-Wangi', 1),
    ('Sinonggi Kemasan Premium', 'Sinonggi siap masak dengan bahan pilihan, kemasan higienis untuk keluarga dan oleh-oleh.', 45000, 'kuliner', 'Kendari Barat', 2),
    ('Kopi Tolaki Sangrai Medium', 'Kopi lokal Sulawesi Tenggara, aroma cokelat dan rempah dengan roast medium.', 98000, 'kuliner', 'Mandonga', 2),
    ('Ikan Teri Kering Muna 250g', 'Teri kering pilihan dari Muna, gurih dan cocok untuk stok dapur.', 68000, 'hasil-laut', 'Napabalano', 2),
    ('Hampers Kuliner Sultra', 'Paket oleh-oleh berisi abon ikan, kacang mete, kopi lokal, dan sambal roa.', 225000, 'kuliner', 'Kadia', 2),
    ('Foto Produk UMKM Kendari', 'Jasa foto produk dengan 10 foto edit siap katalog dan marketplace.', 350000, 'jasa', 'Kambu', 2),
    ('Keranjang Rotan Dekorasi Rumah', 'Keranjang rotan buatan tangan untuk hampers dan dekorasi rumah.', 145000, 'perabotan', 'Baruga', 1),
    ('Bibit Kakao Unggul Konawe', 'Bibit kakao sehat untuk kebun rakyat, konsultasi tanam termasuk.', 75000, 'pertanian', 'Unaaha', 1)
  ) as f(title, description, price, category_slug, district, seller_key)
)
insert into public.listings (seller_id, category_id, title, description, price, status, district, city, province, is_demo)
select f.seller_id, c.id, f.title, f.description, f.price, 'active', f.district,
       case when f.district in ('Wolio','Wangi-Wangi','Napabalano') then 'Baubau' else 'Kendari' end,
       'Sulawesi Tenggara', true
from fixtures f join public.categories c on c.slug = f.category_slug
where not exists (select 1 from public.listings l where l.title = f.title and l.is_demo = true);

insert into public.reels (user_id, video_url, caption, district)
select u.id, x.video_url, x.caption, x.district
from _sultra_seed_users u
join (values
  ('creator.wakatobi@sultrakita.local', 'https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_25fps.mp4', 'Pagi di laut Wakatobi: biru yang bikin ingin kembali. #SultraKita #Wakatobi', 'Wangi-Wangi'),
  ('seller.kendari1@sultrakita.local', 'https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4', 'Di balik tenun Buton, ada cerita keluarga dan ketekunan. #TenunButon #SultraKita', 'Wolio'),
  ('seller.kendari2@sultrakita.local', 'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4', 'Sinonggi hangat dan cerita sore dari Kendari. #KulinerSultra #Kendari', 'Kendari Barat')
) as x(email, video_url, caption, district) on x.email = u.email
where not exists (select 1 from public.reels r where r.video_url = x.video_url);

with buyer as (select id from _sultra_seed_users where email = 'buyer.kendari@sultrakita.local'),
     seller1 as (select id from _sultra_seed_users where email = 'seller.kendari1@sultrakita.local'),
     seller2 as (select id from _sultra_seed_users where email = 'seller.kendari2@sultrakita.local'),
     listing1 as (select id from public.listings where title = 'Kain Tenun Buton Motif Emas' limit 1),
     listing2 as (select id from public.listings where title = 'Sinonggi Kemasan Premium' limit 1),
     conversations as (
       insert into public.conversations (listing_id, buyer_id, seller_id, last_message, last_message_at)
       select listing1.id, buyer.id, seller1.id, 'Baik, saya cek ongkir ke Kendari ya.', now() from buyer, seller1, listing1
       where not exists (select 1 from public.conversations c where c.listing_id = listing1.id and c.buyer_id = buyer.id and c.seller_id = seller1.id)
       union all
       select listing2.id, buyer.id, seller2.id, 'Bisa dikirim besok pagi.', now() from buyer, seller2, listing2
       where not exists (select 1 from public.conversations c where c.listing_id = listing2.id and c.buyer_id = buyer.id and c.seller_id = seller2.id)
       returning id, listing_id
     )
insert into public.messages (conversation_id, sender_id, content, created_at)
select c.id, s.sender_id, s.content, now() - s.offset_value
from public.conversations c
join (values
  ('Kain Tenun Buton Motif Emas', 'buyer.kendari@sultrakita.local', 'Apakah motif emas ini tersedia dan bisa dikirim ke Kendari?', interval '4 minutes'),
  ('Kain Tenun Buton Motif Emas', 'seller.kendari1@sultrakita.local', 'Tersedia, Kak. Kami bisa kirim hari ini dari Baubau.', interval '3 minutes'),
  ('Kain Tenun Buton Motif Emas', 'buyer.kendari@sultrakita.local', 'Baik, saya cek ongkir ke Kendari ya.', interval '2 minutes'),
  ('Sinonggi Kemasan Premium', 'buyer.kendari@sultrakita.local', 'Kalau pesan 5 bungkus, kapan bisa dikirim?', interval '4 minutes'),
  ('Sinonggi Kemasan Premium', 'seller.kendari2@sultrakita.local', 'Bisa dikirim besok pagi, Kak.', interval '3 minutes'),
  ('Sinonggi Kemasan Premium', 'buyer.kendari@sultrakita.local', 'Siap, saya ambil lima. Terima kasih.', interval '2 minutes')
) as s(title, email, content, offset_value) on s.title = (select l.title from public.listings l where l.id = c.listing_id)
join _sultra_seed_users u on u.email = s.email
where not exists (select 1 from public.messages m where m.conversation_id = c.id and m.content = s.content);

commit;

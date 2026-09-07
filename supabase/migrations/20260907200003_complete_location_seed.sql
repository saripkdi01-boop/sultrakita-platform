insert into public.locations (regency_name, district_name, subdistrict_name) values
('Kota Kendari','Kendari Barat','Kemaraya'),
('Kota Kendari','Baruga','Anduonohu'),
('Kota Kendari','Kadia','Baruga'),
('Kota Kendari','Poasia','Watu-Watu'),
('Kota Kendari','Kambu','Anduonohu'),
('Kota Kendari','Mandonga','Korumba Selatan'),
('Kota Kendari','Kendari','Kampung Salo'),
('Kota Kendari','Puuwatu','Lalora'),
('Kota Baubau','Wolio','Tee Batu'),
('Kota Baubau','Murhum','Tanganapada'),
('Kota Baubau','Kokalukuna','Sukanayo'),
('Kota Baubau','Sorawolio','Bugi Selatan'),
('Kota Baubau','Batupoaro','Nganganaumala Selatan')
on conflict (regency_name, district_name, subdistrict_name) do nothing;

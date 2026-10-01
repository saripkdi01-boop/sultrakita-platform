-- Fase 3 (2026-10-01): fondasi geo untuk peta properti map-first ala Zillow.
-- FILE MIGRASI SAJA. PostGIS diasumsikan TERSEDIA di Supabase, tetapi migrasi ini
-- tetap defensif: bila ekstensi tidak dapat diaktifkan, kolom/fungsi spasial dilewati
-- dan kode aplikasi otomatis fallback ke perbandingan latitude/longitude biasa
-- (lihat lib/actions/property-geo.ts).

-- 1. Aktifkan PostGIS bila tersedia.
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS postgis;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Fase 3: PostGIS tidak dapat diaktifkan (%), lanjut tanpa kolom spasial.', SQLERRM;
END
$$;

-- 2. Kolom geography untuk query spasial yang akurat (meter, bukan derajat).
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS geog geography(Point, 4326);

-- 3. Trigger: sinkronkan geog setiap latitude/longitude berubah (hanya bila PostGIS aktif).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    CREATE OR REPLACE FUNCTION public.sync_properties_geog() RETURNS trigger
    LANGUAGE plpgsql AS $func$
    BEGIN
      IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.geog := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
      ELSE
        NEW.geog := NULL;
      END IF;
      RETURN NEW;
    END
    $func$;
    DROP TRIGGER IF EXISTS trg_properties_sync_geog ON public.properties;
    CREATE TRIGGER trg_properties_sync_geog
      BEFORE INSERT OR UPDATE OF latitude, longitude ON public.properties
      FOR EACH ROW EXECUTE FUNCTION public.sync_properties_geog();
  END IF;
END
$$;

-- 4. Backfill untuk baris yang sudah punya koordinat.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    UPDATE public.properties
    SET geog = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND geog IS NULL;
  END IF;
END
$$;

-- 5. Index spasial GIST.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    CREATE INDEX IF NOT EXISTS properties_geog_gix ON public.properties USING GIST (geog);
  END IF;
END
$$;

-- 6. RPC: properti di dalam bounding box viewport peta (+ filter opsional).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    CREATE OR REPLACE FUNCTION public.properties_in_bbox(
      p_min_lng double precision,
      p_min_lat double precision,
      p_max_lng double precision,
      p_max_lat double precision,
      p_category text DEFAULT NULL,
      p_min_price numeric DEFAULT NULL,
      p_max_price numeric DEFAULT NULL,
      p_limit integer DEFAULT 200
    )
    RETURNS SETOF public.properties
    LANGUAGE sql STABLE SECURITY INVOKER
    SET search_path = public
    AS $func$
      SELECT p.*
      FROM public.properties p
      WHERE p.status IN ('available', 'rented', 'sold')
        AND p.geog IS NOT NULL
        AND p.geog && ST_MakeEnvelope(p_min_lng, p_min_lat, p_max_lng, p_max_lat, 4326)::geography
        AND (p_category IS NULL OR p.category = p_category)
        AND (p_min_price IS NULL OR p.price >= p_min_price)
        AND (p_max_price IS NULL OR p.price <= p_max_price)
      ORDER BY p.is_featured DESC, p.created_at DESC
      LIMIT p_limit;
    $func$;
  END IF;
END
$$;

-- 7. RPC: properti terdekat untuk "serupa di dekat sini" di halaman detail.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    CREATE OR REPLACE FUNCTION public.properties_nearby(
      p_lat double precision,
      p_lng double precision,
      p_radius_km double precision DEFAULT 10,
      p_exclude_id uuid DEFAULT NULL,
      p_limit integer DEFAULT 6
    )
    RETURNS SETOF public.properties
    LANGUAGE sql STABLE SECURITY INVOKER
    SET search_path = public
    AS $func$
      SELECT p.*
      FROM public.properties p
      WHERE p.status IN ('available', 'rented', 'sold')
        AND p.geog IS NOT NULL
        AND (p_exclude_id IS NULL OR p.id <> p_exclude_id)
        AND ST_DWithin(
          p.geog,
          ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
          p_radius_km * 1000
        )
      ORDER BY p.geog <-> ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
      LIMIT p_limit;
    $func$;
  END IF;
END
$$;

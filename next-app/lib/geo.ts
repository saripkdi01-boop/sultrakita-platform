// Fase 3: helper geografi isomorfik — aman dipakai di client maupun server.
// Tidak ada akses network/DOM di sini; murni matematika + parsing.

export type MapView = { lat: number; lng: number; zoom: number };
export type MapBounds = { minLat: number; minLng: number; maxLat: number; maxLng: number };

// Tampilan awal: Kota Kendari, Sulawesi Tenggara.
export const SULTRA_DEFAULT_VIEW: MapView = { lat: -3.99, lng: 122.52, zoom: 11 };

/**
 * URL tile basemap CARTO Voyager untuk Leaflet — satu-satunya titik konfigurasi tile.
 * CARTO mewajibkan API key sejak akhir 2026: tanpa key, tile dikembalikan dengan
 * watermark "API KEY REQUIRED" ter-bake di gambarnya.
 * Key gratis: https://carto.com/basemaps/apikey (1 jt request/bln untuk komersial).
 * Key bersifat publik by design (proteksi via domain allowlist saat request key),
 * jadi diekspos via NEXT_PUBLIC_CARTO_API_KEY. Tanpa key (dev lokal), URL dikembalikan
 * apa adanya — watermark muncul tapi peta tetap berfungsi.
 */
export function cartoTileUrl(): string {
  const key = process.env.NEXT_PUBLIC_CARTO_API_KEY;
  const base = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  return key ? `${base}?key=${encodeURIComponent(key)}` : base;
}

/** Atribusi wajib untuk tile CARTO (OSM + CARTO harus selalu tampil). */
export const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export function isValidCoord(lat: unknown, lng: unknown): lat is number {
  return typeof lat === 'number' && typeof lng === 'number'
    && Number.isFinite(lat) && Number.isFinite(lng)
    && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Baca ?lat=&lng=&zoom= dari URL; fallback ke default Sultra bila tidak valid.
export function parseMapView(params: { lat?: string | null; lng?: string | null; zoom?: string | null }): MapView {
  const lat = Number(params.lat);
  const lng = Number(params.lng);
  const zoom = Number(params.zoom);
  return {
    lat: isValidCoord(lat, lng) ? lat : SULTRA_DEFAULT_VIEW.lat,
    lng: isValidCoord(lat, lng) ? lng : SULTRA_DEFAULT_VIEW.lng,
    zoom: Number.isFinite(zoom) && zoom >= 3 && zoom <= 19 ? Math.round(zoom) : SULTRA_DEFAULT_VIEW.zoom,
  };
}

// Web Mercator: ubah viewport (tengah + zoom + ukuran piksel) menjadi bounding box.
// Dipakai untuk query "properti di area peta yang terlihat".
export function viewportToBounds(view: MapView, widthPx = 800, heightPx = 600): MapBounds {
  const { lat, lng, zoom } = view;
  const worldSize = 256 * Math.pow(2, zoom);
  const latRad = (lat * Math.PI) / 180;
  const x = ((lng + 180) / 360) * worldSize;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * worldSize;
  const pxToLng = (px: number) => (px / worldSize) * 360 - 180;
  const pxToLat = (py: number) => {
    const n = Math.PI * (1 - (2 * py) / worldSize);
    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  };
  return {
    minLng: pxToLng(x - widthPx / 2),
    maxLng: pxToLng(x + widthPx / 2),
    maxLat: pxToLat(y - heightPx / 2),
    minLat: pxToLat(y + heightPx / 2),
  };
}

// Jarak garis lurus (km) — dipakai untuk fallback "terdekat" tanpa PostGIS.
export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2
    + Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Format harga ringkas ala Zillow untuk pin peta: "Rp 450 jt", "Rp 1,2 M".
export function shortPriceIdr(value: number): string {
  if (!Number.isFinite(value) || value < 0) return 'Rp –';
  const withComma = (n: number) => n.toLocaleString('id-ID', { maximumFractionDigits: 1 });
  if (value >= 1_000_000_000) return `Rp ${withComma(value / 1_000_000_000)} M`;
  if (value >= 1_000_000) return `Rp ${withComma(value / 1_000_000)} jt`;
  if (value >= 1_000) return `Rp ${Math.round(value / 1_000)} rb`;
  return `Rp ${Math.round(value)}`;
}

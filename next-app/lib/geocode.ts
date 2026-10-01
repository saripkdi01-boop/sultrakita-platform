// Fase 3.3: geocode SAAT SIMPAN (bukan saat search), hasilnya di-cache di DB
// pada kolom latitude/longitude properti.
// PENTING: modul ini hanya diimpor dari Server Actions — jangan dipakai di client.

type GeocodeInput = { addressDetail?: string | null; district?: string | null; city?: string | null; province?: string | null };

// Jeda antar request dalam satu instance, menghormati kebijakan penggunaan Nominatim.
let lastCallAt = 0;
const MIN_GAP_MS = 1100;

export async function geocodeAddressNominatim(input: GeocodeInput): Promise<{ lat: number; lng: number } | null> {
  const query = [input.addressDetail, input.district, input.city, input.province || 'Sulawesi Tenggara', 'Indonesia']
    .filter(part => typeof part === 'string' && part.trim().length > 0)
    .join(', ');
  if (query.length < 4) return null;

  const wait = MIN_GAP_MS - (Date.now() - lastCallAt);
  if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=id&q=${encodeURIComponent(query)}`,
      {
        // Kebijakan Nominatim mewajibkan User-Agent yang mengidentifikasi aplikasi.
        headers: { 'User-Agent': 'SUKIApps/1.0 (https://sukiapps.web.id)', 'Accept-Language': 'id' },
        signal: controller.signal,
      },
    );
    lastCallAt = Date.now();
    if (!response.ok) return null;
    const data: unknown = await response.json();
    const first = Array.isArray(data) ? data[0] : null;
    const lat = Number(first?.lat);
    const lng = Number(first?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    return { lat, lng };
  } catch {
    // Kegagalan geocode TIDAK boleh menggagalkan penyimpanan listing (aturan Fase 3.3).
    return null;
  } finally {
    clearTimeout(timer);
  }
}

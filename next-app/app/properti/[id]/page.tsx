import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Bath, Bed, Building2, CheckCircle2, Eye, Heart, MapPin, Maximize, MessageCircle, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/AppLayout';
import { getPublicPropertyById } from '@/lib/actions/property-public';
import { getProperties } from '@/lib/actions/property';
import { getNearbyProperties } from '@/lib/actions/property-geo';
import { PropertyInquiryForm } from '@/components/property/PropertyInquiryForm';
import PropertyMiniMapLazy from '@/components/property/PropertyMiniMapLazy';
import PropertyCard from '@/components/property/PropertyCard';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import MortgageCalculator from '@/components/property/MortgageCalculator';
import { pricePerSqm } from '@/lib/property-format';
import { AdSlot } from '@/components/ads/AdSlot';
import { ReportPropertyButton } from '@/components/property/ReportPropertyButton';
import { siteUrl, sukiWaLink } from '@/lib/whatsapp';

function rupiah(value: number) { return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value)}`; }
function formatPriceType(value?: string) { return !value || value === 'total' ? '' : ` / ${value.replace('per_', '')}`; }
function locationOf(property: any) { return [property.subdistrict_name, property.district, property.regency_name || property.city || 'Sulawesi Tenggara'].filter(Boolean).join(', '); }
function label(value?: string) { return value ? value.replaceAll('_', ' ').replace(/\b\w/g, char => char.toUpperCase()) : ''; }
function freshness(value?: string) { if (!value) return 'Waktu pembaruan belum tersedia'; const date = new Date(value); if (Number.isNaN(date.getTime())) return 'Waktu pembaruan belum tersedia'; return `Diperbarui ${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`; }

// Fase 1.1: ISR — halaman detail di-cache 5 menit agar cepat dan tetap segar.
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const property: any = await getPublicPropertyById(id).catch(() => null);
  if (!property) return { title: 'Properti tidak ditemukan | SUKI Suits' };
  const place = [property.subdistrict_name, property.regency_name || property.city].filter(Boolean).join(', ');
  const title = `${property.title} - Jual/Sewa di ${place || 'Sulawesi Tenggara'} | SUKI Suits`;
  const description = `${property.description || 'Listing properti pilihan Sulawesi Tenggara.'} Harga ${rupiah(Number(property.price))}${formatPriceType(property.price_type)}. Sertifikat ${property.certificate_type || 'belum dicantumkan'}.`.slice(0, 160);
  const image = Array.isArray(property.images) ? property.images[0] : undefined;
  return { title, description, openGraph: { title, description, type: 'website', ...(image ? { images: [{ url: image, alt: property.title }] } : {}) } };
}

// Properti serupa ala portal properti (pola Zillow "Nearby homes" / 99.co rekomendasi):
// kategori sama, lalu skor: kecamatan sama +2, harga dalam ±35% +2,
// kabupaten sama +1, ada foto +0.5. Tanpa fetch tambahan di luar yang sudah ada.
async function getSimilarProperties(property: any) {
  try {
    const result = await getProperties({ category: property.category });
    if (!result.ok || !Array.isArray(result.data)) return [];
    const price = Number(property.price) || 0;
    return result.data
      .filter((item: any) => String(item.id) !== String(property.id))
      .map((item: any) => {
        let score = 0;
        if (item.district && property.district && item.district === property.district) score += 2;
        const itemPrice = Number(item.price) || 0;
        if (price > 0 && itemPrice > 0 && Math.abs(itemPrice - price) / price <= 0.35) score += 2;
        if (item.regency_name && property.regency_name && item.regency_name === property.regency_name) score += 1;
        if (Array.isArray(item.images) && item.images.length > 0) score += 0.5;
        return { item, score };
      })
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(entry => entry.item);
  } catch {
    return [];
  }
}

const centroids: Record<string, { lat: number; lng: number }> = { 'Kendari Barat': { lat: -3.968, lng: 122.507 }, Baruga: { lat: -4.004, lng: 122.526 }, Kadia: { lat: -3.982, lng: 122.514 }, Poasia: { lat: -4.015, lng: 122.548 }, Kambu: { lat: -4.010, lng: 122.528 }, Mandonga: { lat: -3.965, lng: 122.519 }, Wolio: { lat: -5.463, lng: 122.601 }, Betoambari: { lat: -5.491, lng: 122.596 }, Murhum: { lat: -5.470, lng: 122.600 } };

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property: any = await getPublicPropertyById(id).catch(() => null);
  if (!property) notFound();
  const images = Array.isArray(property.images) ? property.images.filter(Boolean) : [];
  // Anti-fabrikasi: tanpa nama seller, tampilkan label jujur (bukan nama karangan).
  const sellerName = property.seller?.full_name || 'Belum dicantumkan';
  const location = locationOf(property);
  const centroid = centroids[property.district] || { lat: -3.99, lng: 122.52 };
  // Fase 3: koordinat asli bila listing memilikinya; fallback centroid kecamatan berlabel jujur "perkiraan".
  const propLat = Number(property.latitude);
  const propLng = Number(property.longitude);
  const hasCoords = Number.isFinite(propLat) && Number.isFinite(propLng) && propLat >= -90 && propLat <= 90 && propLng >= -180 && propLng <= 180;
  const mapLat = hasCoords ? propLat : centroid.lat;
  const mapLng = hasCoords ? propLng : centroid.lng;
  const nearby = hasCoords ? await getNearbyProperties({ id: property.id, lat: propLat, lng: propLng, radiusKm: 10, limit: 6 }).catch(() => ({ ok: false as const, data: [] as any[] })) : { ok: false as const, data: [] as any[] };
  // Fase 3: JSON-LD RealEstateListing — hanya field yang datanya benar-benar ada (tanpa info palsu).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    url: `https://sukiapps.web.id/properti/${property.id}`,
    ...(property.description ? { description: property.description } : {}),
    ...(images[0] ? { image: images[0] } : {}),
    offers: { '@type': 'Offer', price: Number(property.price), priceCurrency: 'IDR' },
    address: { '@type': 'PostalAddress', addressLocality: location || undefined, addressRegion: 'Sulawesi Tenggara', addressCountry: 'ID' },
    ...(hasCoords ? { geo: { '@type': 'GeoCoordinates', latitude: propLat, longitude: propLng } } : {}),
  };
  const badges = [property.is_lelang && `Lelang${property.lelang_type ? `: ${label(property.lelang_type)}` : ''}`, property.takeover_status && `Takeover ${label(property.takeover_status)}`, property.can_kpr && 'Bisa KPR', property.certificate_type && `Sertifikat ${property.certificate_type}`].filter(Boolean) as string[];
  const perSqm = pricePerSqm(Number(property.price), property.land_area_sqm, property.building_area_sqm, property.price_type);
  const perSqmArea = property.land_area_sqm ? `LT ${property.land_area_sqm} m²` : property.building_area_sqm ? `LB ${property.building_area_sqm} m²` : '';
  const similar = await getSimilarProperties(property);
  // Chat WhatsApp: inquiry diteruskan ke WA Business resmi SUKI (bukan nomor
  // pribadi seller — privasi seller terjaga). Tombol hanya muncul bila
  // NEXT_PUBLIC_SUKI_WA_NUMBER dikonfigurasi.
  const waHref = sukiWaLink(
    `Halo SUKI, saya tertarik dengan properti "${property.title}" (${rupiah(Number(property.price))}) di SUKI: ${siteUrl()}/properti/${property.id}`
  );
  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-6xl px-4 py-6 md:px-8">
        <Link href="/properti" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-sultra-teal hover:text-sultra-forest"><ArrowLeft size={16} /> Kembali ke properti</Link>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <section>
            <div className="relative">
              <PropertyGallery images={images} title={property.title} />
              {property.is_demo && <span className="absolute left-4 top-4 z-10 rounded-full bg-slate-700/90 px-3 py-1.5 text-xs font-bold text-white">Demo</span>}
              {(property.is_bank_verified || property.is_admin_verified) && <span title="Terverifikasi oleh bank atau admin SUKI" className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-sultra-gold px-3 py-1.5 text-xs font-bold text-white"><CheckCircle2 size={14} /> Terverifikasi</span>}
            </div>
            {/* Fase 3: mini-map Leaflet asli (fallback centroid kecamatan berlabel "perkiraan" bila tanpa koordinat) */}
            <div className="mt-6 overflow-hidden rounded-3xl border border-sultra-mint bg-sultra-mint/30 p-5 dark:border-sultra-forest/30">
              <div className="flex items-center gap-2 text-sultra-forest dark:text-sultra-sand"><MapPin size={18} /><h2 className="font-bold">{hasCoords ? 'Peta lokasi' : 'Peta lokasi perkiraan'}</h2></div>
              <div className="relative mt-4 h-52 overflow-hidden rounded-2xl"><PropertyMiniMapLazy lat={mapLat} lng={mapLng} title={property.title} isEstimate={!hasCoords} /></div>
              <p className="mt-2 text-xs text-slate-500">{hasCoords ? location : `Titik tengah kecamatan${property.district ? ` ${property.district}` : ''} · ${mapLat.toFixed(3)}, ${mapLng.toFixed(3)} — lokasi pasti dikonfirmasi seller`}</p>
            </div>
          </section>
          <section className="rounded-3xl border border-sultra-mint bg-white p-6 shadow-soft dark:border-sultra-forest/30 dark:bg-sultra-dark">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-sultra-teal">{label(property.category) || 'Properti'}</p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-sultra-forest dark:text-sultra-sand">{property.title}</h1>
            <p className="mt-4 text-2xl font-bold text-sultra-forest dark:text-sultra-mint">{rupiah(Number(property.price))}<span className="text-sm font-normal text-sultra-teal">{formatPriceType(property.price_type)}</span></p>
            {perSqm && <p className="mt-1 text-sm font-semibold text-sultra-teal">{perSqm}{perSqmArea ? ` · ${perSqmArea}` : ''}</p>}
            <p className="mt-3 flex items-center gap-2 text-sm text-sultra-teal"><MapPin size={16} /> {location}</p>
            <p className="mt-2 text-xs text-slate-500">{freshness(property.updated_at || property.created_at)} · ID listing {property.id}</p>
            {badges.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{badges.map(badge => <span key={badge} className="rounded-full bg-sultra-mint px-3 py-1.5 text-xs font-bold text-sultra-forest"><ShieldCheck size={13} className="mr-1 inline" />{badge}</span>)}</div>}
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-sultra-forest dark:text-sultra-sand">
              {property.building_area_sqm && <span className="flex items-center gap-2"><Maximize size={16} /> {property.building_area_sqm} m²</span>}
              {property.bedrooms !== undefined && <span className="flex items-center gap-2"><Bed size={16} /> {property.bedrooms} kamar</span>}
              {property.bathrooms !== undefined && <span className="flex items-center gap-2"><Bath size={16} /> {property.bathrooms} kamar mandi</span>}
              <span className="flex items-center gap-2"><Eye size={16} /> {property.views_count || 0} dilihat</span>
            </div>
            <div className="mt-7 border-t border-sultra-mint pt-5 dark:border-sultra-forest/30">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-sultra-teal">Seller</p>
              <p className="mt-2 font-semibold text-sultra-forest dark:text-sultra-sand">{sellerName}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/login?redirect=/properti/${id}`} aria-label="Simpan properti" className="inline-flex items-center gap-2 rounded-xl bg-sultra-teal px-4 py-3 text-sm font-semibold text-white"><Heart size={16} /> Simpan</Link>
              {waHref && (
                <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label={`Tanya tentang ${property.title} via WhatsApp`} className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white"><MessageCircle size={16} /> WhatsApp</a>
              )}
              <PropertyInquiryForm propertyId={id} />
              <ReportPropertyButton propertyId={String(id)} />
            </div>
            {/* T-ADS: slot sidebar detail properti (300×250) */}
            <div className="mt-6"><AdSlot placementId="properti-detail-sidebar" /></div>
          </section>
        </div>
        <section className="mt-6 rounded-3xl border border-sultra-mint bg-white p-6 dark:border-sultra-forest/30 dark:bg-sultra-dark">
          <div className="flex items-center gap-2 text-sultra-forest dark:text-sultra-sand"><Building2 size={18} /><h2 className="text-lg font-bold">Deskripsi properti</h2></div>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">{property.description || 'Deskripsi properti belum tersedia.'}</p>
        </section>
        <MortgageCalculator price={Number(property.price)} canKpr={property.can_kpr} priceType={property.price_type} />
        {/* Fase 3: properti di dekat lokasi (query geo; hanya bila listing punya koordinat) */}
        {nearby.ok && nearby.data.length > 0 && (
          <section className="mt-6" aria-labelledby="nearby-properties-title">
            <div className="flex items-center gap-2 text-sultra-forest dark:text-sultra-sand"><MapPin size={18} /><h2 id="nearby-properties-title" className="text-lg font-bold">Serupa di dekat sini</h2></div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{nearby.data.map((item: any) => <PropertyCard key={item.id} property={item} />)}</div>
          </section>
        )}
        {/* Properti serupa (skor atribut ala 99.co) */}
        {similar.length > 0 && (
          <section className="mt-6" aria-labelledby="similar-properties-title">
            <div className="flex items-end justify-between gap-3">
              <h2 id="similar-properties-title" className="text-lg font-bold text-sultra-forest dark:text-sultra-sand">Properti serupa</h2>
              <Link href="/properti" className="text-sm font-semibold text-sultra-teal hover:text-sultra-forest">Lihat semua</Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{similar.map((item: any) => <PropertyCard key={item.id} property={item} />)}</div>
          </section>
        )}
        {/* Fase 3: JSON-LD RealEstateListing jujur */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </main>
    </AppLayout>
  );
}

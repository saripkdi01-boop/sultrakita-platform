'use client';

// Fase 3: peta properti map-first ala Zillow.
// Leaflet hanya dimuat di client (dynamic import) agar tidak menambah beban SSR.
// Dimuat dinamis via komponen pembungkus dengan `dynamic(() => import(...), { ssr: false })`.

import { useEffect, useRef } from 'react';
import type { MapView, MapBounds } from '@/lib/geo';
import { shortPriceIdr, isValidCoord } from '@/lib/geo';

export type PropertyPin = {
  id: string;
  title: string;
  price: number;
  lat: number;
  lng: number;
  detailUrl: string;
};

type PropertyMapProps = {
  pins: PropertyPin[];
  initialView: MapView;
  hoveredId?: string | null;
  onViewportChange: (view: MapView, bounds: MapBounds) => void;
  onPinClick?: (id: string) => void;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] as string));
}

export default function PropertyMap({ pins, initialView, hoveredId, onViewportChange, onPinClick }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const clusterRef = useRef<any>(null);
  const callbacksRef = useRef({ onViewportChange, onPinClick });
  callbacksRef.current = { onViewportChange, onPinClick };
  const pinsRef = useRef(pins);
  pinsRef.current = pins;
  const hoveredRef = useRef(hoveredId);
  hoveredRef.current = hoveredId;

  // Inisialisasi Leaflet sekali, hanya di client.
  useEffect(() => {
    let cancelled = false;
    let map: any = null;
    let moveHandler: (() => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;

    async function init() {
      if (!containerRef.current) return;
      const L = (await import('leaflet')).default;
      await import('leaflet.markercluster');
      // CSS Leaflet dimuat dari page yang memanggil via import global di komponen pembungkus.
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        zoomControl: true,
        worldCopyJump: true,
        scrollWheelZoom: true,
      });
      mapRef.current = map;

      // Tile CARTO Voyager — netral, ramah untuk tampilan properti; atribusi wajib OSM + CARTO.
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      map.setView([initialView.lat, initialView.lng], initialView.zoom, { animate: false });

      const cluster = (L as any).markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 48 });
      clusterRef.current = cluster;
      map.addLayer(cluster);

      moveHandler = () => {
        const center = map.getCenter();
        const b = map.getBounds();
        callbacksRef.current.onViewportChange(
          { lat: center.lat, lng: center.lng, zoom: map.getZoom() },
          { minLat: b.getSouth(), minLng: b.getWest(), maxLat: b.getNorth(), maxLng: b.getEast() },
        );
      };
      map.on('moveend', moveHandler);

      // Render pin awal.
      renderPins(L, cluster, pinsRef.current, hoveredRef.current, callbacksRef.current.onPinClick, map);
      // Kabari viewport awal ke parent agar query bbox langsung jalan.
      moveHandler();

      // Bila container berubah ukuran (mis. tab Peta di mobile baru ditampilkan),
      // paksa Leaflet mengukur ulang agar tile tidak terpotong.
      const observer = typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => { map.invalidateSize(); })
        : null;
      resizeObserver = observer;
      if (observer && containerRef.current) observer.observe(containerRef.current);
    }

    init();
    return () => {
      cancelled = true;
      if (moveHandler && map) map.off('moveend', moveHandler);
      if (resizeObserver) resizeObserver.disconnect();
      if (clusterRef.current && map) map.removeLayer(clusterRef.current);
      if (map) map.remove();
      mapRef.current = null;
      clusterRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update pin saat daftar properti atau hover berubah.
  useEffect(() => {
    (async () => {
      const L = (await import('leaflet')).default;
      if (clusterRef.current && mapRef.current) {
        renderPins(L, clusterRef.current, pinsRef.current, hoveredRef.current, callbacksRef.current.onPinClick, mapRef.current);
      }
    })();
  }, [pins, hoveredId]);

  function handleLocate() {
    if (!('geolocation' in navigator) || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        mapRef.current.flyTo([latitude, longitude], 13, { duration: reduceMotion ? 0 : 1.2 });
      },
      () => {},
      { timeout: 8000, maximumAge: 60000 },
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0 z-0" role="application" aria-label="Peta properti SultraKita" />
      <button
        type="button"
        onClick={handleLocate}
        className="absolute bottom-4 right-4 z-10 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-slate-700 shadow-md ring-1 ring-slate-900/10 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        aria-label="Tampilkan lokasi saya di peta"
      >
        <span aria-hidden="true">📍</span> Lokasi saya
      </button>
    </div>
  );
}

function renderPins(
  L: any,
  cluster: any,
  pins: PropertyPin[],
  hoveredId: string | null | undefined,
  onPinClick: ((id: string) => void) | undefined,
  map: any,
) {
  cluster.clearLayers();
  for (const pin of pins) {
    if (!isValidCoord(pin.lat, pin.lng)) continue;
    const isHovered = hoveredId != null && hoveredId === pin.id;
    const icon = L.divIcon({
      className: '',
      html: `<span class="property-price-pin${isHovered ? ' property-price-pin--hovered' : ''}">${escapeHtml(shortPriceIdr(pin.price))}</span>`,
      iconSize: undefined as any,
    });
    const marker = L.marker([pin.lat, pin.lng], { icon, title: pin.title });
    marker.bindPopup(
      `<div style="min-width:180px">` +
        `<strong>${escapeHtml(pin.title)}</strong><br/>` +
        `<span>${escapeHtml(shortPriceIdr(pin.price))}</span><br/>` +
        `<a href="${escapeHtml(pin.detailUrl)}">Lihat detail &rarr;</a>` +
        `</div>`,
    );
    marker.on('click', () => onPinClick?.(pin.id));
    cluster.addLayer(marker);
  }
}

'use client';

// Mini-map satu pin untuk halaman detail properti. Client-only via dynamic ssr:false.

import { useEffect, useRef } from 'react';
import { isValidCoord } from '@/lib/geo';

type PropertyMiniMapProps = { lat: number; lng: number; title: string; isEstimate?: boolean };

export default function PropertyMiniMap({ lat, lng, title, isEstimate = false }: PropertyMiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let map: any = null;
    async function init() {
      if (!containerRef.current || !isValidCoord(lat, lng)) return;
      const L = (await import('leaflet')).default;
      if (cancelled || !containerRef.current) return;
      map = L.map(containerRef.current, {
        zoomControl: false,
        dragging: true,
        scrollWheelZoom: false,
      }).setView([lat, lng], isEstimate ? 11 : 14);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);
      L.circleMarker([lat, lng], {
        radius: 12,
        color: '#0d9488',
        weight: 3,
        fillColor: '#14b8a6',
        fillOpacity: 0.5,
      })
        .addTo(map)
        .bindTooltip(title, { direction: 'top', offset: [0, -12] });
    }
    init();
    return () => {
      cancelled = true;
      if (map) map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return <div ref={containerRef} className="h-full w-full" role="application" aria-label={`Peta lokasi properti${isEstimate ? ' (perkiraan)' : ''}`} />;
}

'use client';

// Mini-map dinamis untuk halaman detail properti (Leaflet tidak ikut SSR).

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { ComponentProps } from 'react';
import type PropertyMiniMap from './PropertyMiniMap';

const LazyMiniMap = dynamic(() => import('./PropertyMiniMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500" role="status">
      Memuat peta…
    </div>
  ),
});

export default function PropertyMiniMapLazy(props: ComponentProps<typeof PropertyMiniMap>) {
  return <LazyMiniMap {...props} />;
}

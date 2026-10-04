'use client';

// Pembungkus dinamis agar Leaflet (berat + butuh window) TIDAK di-bundle ke SSR.
// Dipakai oleh page-client properti; detail page memakai komponen ini langsung.

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import type { ComponentProps } from 'react';
import type PropertyMap from './PropertyMap';
import { usePreferences } from '@/lib/preferences';
import { tpj } from '@/lib/i18n/dict-propertijobs';

function MapLoading() {
  const { language } = usePreferences();
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500" role="status">
      {tpj(language, 'pjMapLoading')}
    </div>
  );
}

const LazyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => <MapLoading />,
});

export type PropertyMapLazyProps = ComponentProps<typeof PropertyMap>;

export default function PropertyMapLazy(props: PropertyMapLazyProps) {
  return <LazyMap {...props} />;
}

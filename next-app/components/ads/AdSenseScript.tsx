'use client';

import Script from 'next/script';
import { ADSENSE_CLIENT_ID } from '@/lib/ads/config';

/**
 * Loader library AdSense (pagead2.googlesyndication.com).
 * Hanya di-render bila NEXT_PUBLIC_ADSENSE_CLIENT_ID di-set —
 * tanpa env, tidak ada request ke Google sama sekali.
 * Dipasang sekali di root layout.
 */
export function AdSenseScript() {
  if (!ADSENSE_CLIENT_ID) return null;
  return (
    <Script
      id="suki-adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT_ID)}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

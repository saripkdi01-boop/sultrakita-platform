'use client';

import { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT_ID } from '@/lib/ads/config';
import styles from './ads.module.css';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & { requestNonPersonalizedAds?: number };
  }
}

interface AdSenseUnitProps {
  /** Ad unit slot ID dari AdSense (diatur di /admin/ads, bukan di kode). */
  slot: string;
  /** true untuk native/fluid (data-ad-format="auto"), false untuk ukuran tetap IAB. */
  fluid?: boolean;
  /** Ukuran tetap bila fluid=false, mis. { w: 728, h: 90 }. */
  fixedSize?: { w: number; h: number };
  /** true bila user menolak/belum memberi consent → minta non-personalized (npa=1). */
  nonPersonalized?: boolean;
}

/**
 * Unit AdSense tunggal. Tidak me-render apa pun bila publisher ID belum
 * dikonfigurasi (env kosong) — tanpa error console.
 */
export function AdSenseUnit({ slot, fluid = true, fixedSize, nonPersonalized = true }: AdSenseUnitProps) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    pushedRef.current = true;
    try {
      const queue = (window.adsbygoogle = window.adsbygoogle || []);
      // UU PDP: default non-personalized kecuali consent eksplisit.
      if (nonPersonalized) queue.requestNonPersonalizedAds = 1;
      (queue as Array<Record<string, unknown>>).push({});
    } catch {
      /* diam: slot tetap aman, tidak merusak halaman */
    }
  }, [nonPersonalized, slot]);

  if (!ADSENSE_CLIENT_ID || !slot) return null;

  return (
    <div className={styles['skad-unit']}>
      <span className={styles['skad-label']}>Iklan</span>
      <ins
        className="adsbygoogle"
        style={fluid ? { display: 'block' } : { display: 'inline-block', width: fixedSize?.w, height: fixedSize?.h }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={fluid ? 'auto' : undefined}
        data-full-width-responsive={fluid ? 'true' : undefined}
      />
    </div>
  );
}

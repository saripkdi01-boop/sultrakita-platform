'use client';

import { useEffect } from 'react';
import { captureUtmFromUrl } from '@/lib/utm';

/**
 * Menangkap atribusi UTM first-touch dari URL ke cookie `sk_utm`.
 * Dipasang sekali di root layout; tidak merender apa pun.
 */
export function UtmCapture() {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);
  return null;
}

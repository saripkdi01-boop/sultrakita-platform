'use client';

import { useEffect } from 'react';
import { captureReferralFromUrl } from '@/lib/referral-attribution';

/**
 * Menangkap atribusi referral first-touch (`?ref=KODE`) dari URL ke cookie `sk_ref`.
 * Dipasang sekali di root layout; tidak merender apa pun.
 */
export function ReferralCapture() {
  useEffect(() => {
    captureReferralFromUrl();
  }, []);
  return null;
}

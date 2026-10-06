'use client';

import { useEffect } from 'react';

/**
 * Mendaftarkan service worker SUKI Apps.
 * Hanya di production — di dev sengaja tidak diregistrasi agar tidak
 * mengganggu hot-reload dengan cache basi.
 */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* registrasi gagal bukan fatal — situs tetap jalan normal */
      });
    };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);
  return null;
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { ADSENSE_CLIENT_ID } from '@/lib/ads/config';
import { isPersonalizedAdsAllowed } from '@/lib/ads/consent';
import { AdSenseUnit } from './AdSenseUnit';
import { HouseAd, type HouseAdCreative } from './HouseAd';
import styles from './ads.module.css';

interface PopupSlotConfig {
  provider: 'adsense' | 'house' | 'off';
  adsenseSlot?: string;
  houseAd?: (HouseAdCreative & { html_snippet?: string | null }) | null;
}

const POPUP_PLACEMENT = 'beranda-popup';
const POPUP_DELAY_MS = 5000; // beri waktu user membaca halaman dulu
const POPUP_COOLDOWN_MS = 24 * 60 * 60 * 1000; // maks 1× per 24 jam per pengunjung
const STORAGE_KEY = 'skad-popup-beranda-popup';

function readLastShown(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const ts = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(ts) ? ts : 0;
  } catch {
    return 0;
  }
}

function markShown(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* mode privat: abaikan, popup cukup tidak dibuka ulang sesi ini */
  }
}

/**
 * Merender kode HTML/JS mentah dari jaringan iklan (MGID, Adsterra, dsb)
 * dan MENJALANKAN <script> di dalamnya.
 *
 * innerHTML biasa tidak mengeksekusi script, jadi setiap <script> dibuat
 * ulang sebagai elemen baru agar browser menjalankannya.
 *
 * KEAMANAN: hanya tempel kode dari jaringan iklan yang dipercaya — kolom ini
 * hanya bisa diisi lewat /admin/ads (admin saja).
 */
function AdSnippet({ html }: { html: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.innerHTML = html;
    // Eksekusi ulang setiap script agar tag iklan jaringan berjalan.
    const scripts = Array.from(host.querySelectorAll('script'));
    for (const oldScript of scripts) {
      const fresh = document.createElement('script');
      for (const attr of Array.from(oldScript.attributes)) {
        fresh.setAttribute(attr.name, attr.value);
      }
      fresh.text = oldScript.text || '';
      oldScript.replaceWith(fresh);
    }
    return () => {
      host.innerHTML = '';
    };
  }, [html]);

  return <div ref={hostRef} className={styles['skad-snippet']} />;
}

interface PopupAdProps {
  /** Hook QA: paksa render dengan config ini — lewati fetch API, delay, dan frequency cap. */
  previewConfig?: PopupSlotConfig | null;
}

/**
 * Slot popup interstitial khusus /beranda (placement `beranda-popup`).
 *
 * - Provider-agnostik: AdSense / house ads (gambar sponsor) / kode HTML-JS
 *   jaringan iklan apapun — dikonfigurasi di /admin/ads, default NONAKTIF.
 * - Tampil maks 1× per 24 jam per pengunjung, setelah delay 5 detik.
 * - Dismissible: tombol ✕, tombol ESC, atau klik backdrop.
 * - Tidak ada layout shift (overlay fixed), hormat prefers-reduced-motion.
 *
 * CATATAN KEBIJAKAN: jangan aktifkan provider AdSense di placement ini untuk
 * unit AdSense biasa — popup kustom melanggar kebijakan AdSense. Untuk iklan
 * layar-penuh yang patuh, gunakan Vignette ads di Auto ads AdSense.
 */
export function PopupAd({ previewConfig }: PopupAdProps) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<PopupSlotConfig | null>(previewConfig ?? null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openedOnceRef = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  // Mode preview QA: langsung buka tanpa delay/cap/fetch.
  useEffect(() => {
    if (previewConfig === undefined) return;
    setConfig(previewConfig);
    setOpen(!!previewConfig && previewConfig.provider !== 'off');
  }, [previewConfig]);

  // Mode produksi: delay → cek cap → fetch config → buka bila aktif.
  useEffect(() => {
    if (previewConfig !== undefined) return;
    if (Date.now() - readLastShown() < POPUP_COOLDOWN_MS) return;

    let active = true;
    const timer = window.setTimeout(() => {
      void fetch(`/api/ads/slot?placement=${encodeURIComponent(POPUP_PLACEMENT)}`, { credentials: 'same-origin' })
        .then((res) => (res.ok ? res.json() : { provider: 'off' }))
        .then((data): PopupSlotConfig => {
          const provider = data?.provider === 'adsense' || data?.provider === 'house' ? data.provider : 'off';
          return {
            provider,
            adsenseSlot: typeof data?.adsenseSlot === 'string' ? data.adsenseSlot : undefined,
            houseAd: data?.houseAd ?? null,
          };
        })
        .catch((): PopupSlotConfig => ({ provider: 'off' }))
        .then((result) => {
          if (!active || openedOnceRef.current) return;
          const hasAdSense = result.provider === 'adsense' && !!ADSENSE_CLIENT_ID && !!result.adsenseSlot;
          const hasHouse = result.provider === 'house' && !!result.houseAd;
          if (!hasAdSense && !hasHouse) return;
          openedOnceRef.current = true;
          markShown();
          setConfig(result);
          setOpen(true);
        });
    }, POPUP_DELAY_MS);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [previewConfig]);

  // ESC untuk menutup + kunci scroll body saat terbuka.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open, close]);

  if (!open || !config) return null;

  const showAdSense = config.provider === 'adsense' && !!ADSENSE_CLIENT_ID && !!config.adsenseSlot;
  const showHouse = config.provider === 'house' && !!config.houseAd;
  if (!showAdSense && !showHouse) return null;

  const houseAd = config.houseAd;

  return (
    <div
      className={styles['skad-popup-backdrop']}
      role="dialog"
      aria-modal="true"
      aria-label="Iklan"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className={styles['skad-popup-card']}>
        <button ref={closeRef} type="button" className={styles['skad-popup-close']} onClick={close} aria-label="Tutup iklan">
          <X size={16} aria-hidden="true" />
        </button>
        {showAdSense ? (
          <AdSenseUnit slot={config.adsenseSlot as string} fluid nonPersonalized={!isPersonalizedAdsAllowed()} />
        ) : houseAd?.html_snippet ? (
          <>
            <span className={styles['skad-label']}>Iklan</span>
            <AdSnippet html={houseAd.html_snippet} />
          </>
        ) : (
          houseAd && <HouseAd creative={houseAd} placementId={POPUP_PLACEMENT} />
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { ADSENSE_CLIENT_ID, getPlacement, isExcludedAdPath, type PlacementId } from '@/lib/ads/config';
import { isPersonalizedAdsAllowed } from '@/lib/ads/consent';
import { AdSenseUnit } from './AdSenseUnit';
import { HouseAd, type HouseAdCreative } from './HouseAd';
import styles from './ads.module.css';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

interface SlotConfig {
  provider: 'adsense' | 'house' | 'off';
  adsenseSlot?: string;
  houseAd?: HouseAdCreative | null;
}

// Cache per placement selama sesi: beberapa slot satu placement = 1 request.
const configCache = new Map<string, Promise<SlotConfig>>();

async function loadSlotConfig(placementId: PlacementId): Promise<SlotConfig> {
  let pending = configCache.get(placementId);
  if (!pending) {
    pending = fetch(`/api/ads/slot?placement=${encodeURIComponent(placementId)}`, { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : { provider: 'off' }))
      .then((data): SlotConfig => {
        const provider = data?.provider === 'adsense' || data?.provider === 'house' ? data.provider : 'off';
        return { provider, adsenseSlot: typeof data?.adsenseSlot === 'string' ? data.adsenseSlot : undefined, houseAd: data?.houseAd ?? null };
      })
      .catch((): SlotConfig => ({ provider: 'off' }));
    configCache.set(placementId, pending);
  }
  return pending;
}

interface AdSlotProps {
  placementId: PlacementId;
  /** true bila slot di atas fold → load segera tanpa menunggu IntersectionObserver. */
  eager?: boolean;
  className?: string;
}

/**
 * Slot iklan agnostik-provider (AdSense / house ads / off).
 *
 * - Bila tidak dikonfigurasi: me-render placeholder KOSONG yang tetap
 *   me-reserve ruang via CSS (min-height per placement) → ZERO layout shift,
 *   tanpa error console.
 * - Slot di bawah fold di-load malas via IntersectionObserver.
 * - Tidak tampil di /admin/*, /billing/*, /checkout/*.
 * - Mobile banner dismissible (tombol tutup, tidak sticky).
 */
export function AdSlot({ placementId, eager = false, className }: AdSlotProps) {
  const pathname = usePathname();
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(eager);
  const [config, setConfig] = useState<SlotConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const spec = getPlacement(placementId);
  const excluded = isExcludedAdPath(pathname);

  useEffect(() => {
    if (eager || !hostRef.current || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' },
    );
    observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!inView || excluded || dismissed) return;
    let active = true;
    void loadSlotConfig(placementId).then((result) => {
      if (active) setConfig(result);
    });
    return () => {
      active = false;
    };
  }, [inView, excluded, dismissed, placementId]);

  if (!spec || excluded || dismissed) return null;

  const isMobileBanner = placementId === 'mobile-banner';
  const showAdSense = config?.provider === 'adsense' && !!ADSENSE_CLIENT_ID && !!config.adsenseSlot;
  const showHouse = config?.provider === 'house' && !!config.houseAd;

  // Unit ukuran tetap IAB (non-fluid) per placement
  const fixedSize =
    placementId === 'marketplace-leaderboard' ? { w: 728, h: 90 } : placementId === 'sidebar-desktop' || placementId === 'properti-detail-sidebar' ? { w: 300, h: 250 } : placementId === 'mobile-banner' ? { w: 320, h: 50 } : undefined;

  return (
    <div
      ref={hostRef}
      className={`${styles['skad-slot']}${className ? ` ${className}` : ''}`}
      data-placement={placementId}
      role="complementary"
      aria-label={t.adSlotLabel.replace('{title}', spec.title)}
    >
      {!config ? (
        // Reserve ruang saat konfigurasi dimuat — tanpa konten, tanpa label.
        <div className={styles['skad-loading']} aria-hidden="true" />
      ) : showAdSense ? (
        <AdSenseUnit slot={config.adsenseSlot as string} fluid={!fixedSize} fixedSize={fixedSize} nonPersonalized={!isPersonalizedAdsAllowed()} />
      ) : showHouse && config.houseAd ? (
        <HouseAd creative={config.houseAd} placementId={placementId} />
      ) : (
        // Tidak dikonfigurasi / nonaktif: ruang tetap di-reserve, konten kosong.
        <div aria-hidden="true" />
      )}
      {isMobileBanner && config && (
        <button type="button" className={styles['skad-close']} onClick={() => setDismissed(true)} aria-label={t.adClose}>
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

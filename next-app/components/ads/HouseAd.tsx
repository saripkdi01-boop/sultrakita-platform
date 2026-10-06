'use client';

import { AD_TEMPLATES, getPlacement, type PlacementId } from '@/lib/ads/config';
import styles from './ads.module.css';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

export interface HouseAdCreative {
  id: string;
  placement: string;
  title: string;
  image_url: string | null;
  link_url: string | null;
  /** Kode HTML/JS mentah dari jaringan iklan (MGID, Adsterra, dsb). Bila ada, menggantikan gambar+link. */
  html_snippet?: string | null;
}

/** Rasio kontainer house ad mengikuti template placement (tidak boleh distorsi). */
function ratioKey(placementId: PlacementId): string {
  const spec = getPlacement(placementId);
  const template = spec?.templates[0] || 'native-16:9';
  const ratio = AD_TEMPLATES[template]?.ratio;
  if (!ratio) return '16:9';
  return `${ratio[0]}:${ratio[1]}`;
}

/** House ad: kreatif sponsor langsung (UMKM lokal). Selalu berlabel "Bersponsor". */
export function HouseAd({ creative, placementId }: { creative: HouseAdCreative; placementId: PlacementId }) {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  // Kreatif berbasis kode HTML/JS (tanpa gambar) hanya dirender oleh PopupAd
  // (butuh eksekusi script client-side) — di slot inline dilewati dengan aman.
  if (creative.html_snippet && !creative.image_url) return null;
  return (
    <div className={styles['skad-unit']}>
      <span className={styles['skad-label']}>{t.adSponsored}</span>
      <a
        href={creative.link_url ?? undefined}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className={styles['skad-house']}
        aria-label={t.adSponsoredTitle.replace('{title}', creative.title)}
      >
        {creative.image_url ? (
          <span className={styles['skad-house-media']} data-ratio={ratioKey(placementId)}>
            {/* img biasa (bukan next/image): URL eksternal milik sponsor, tanpa domain config */}
            <img src={creative.image_url} alt={creative.title} loading="lazy" referrerPolicy="no-referrer" />
          </span>
        ) : null}
        <span className={styles['skad-house-body']}>
          <span className={styles['skad-house-title']}>{creative.title}</span>
          <span className={styles['skad-house-cta']}>{t.adVisit}</span>
        </span>
      </a>
    </div>
  );
}

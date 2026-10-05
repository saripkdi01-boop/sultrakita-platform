'use client';

/**
 * Audit 2026-10-06 (P0-PERF): kamus i18n lazy-load per bahasa.
 *
 * Masalah: `dictionaries.ts` mengimpor SEMUA kamus 27 bahasa secara statis
 * (~3,7 MB source, ~1,7 MB JS gzip). Setiap halaman client (termasuk
 * homepage) ikut memuatnya walau user hanya memakai 1 bahasa.
 *
 * Solusi: modul ini memuat kamus per bahasa secara DINAMIS (dynamic import)
 * hanya untuk bahasa aktif. Bahasa Indonesia (default, mayoritas user)
 * di-bundle langsung sebagai fallback sinkron agar first paint tidak
 * menunggu network.
 *
 * Pola pakai:
 *   import { useCoreLabels } from '@/lib/i18n/dictionaries-lazy';
 *   const t = useCoreLabels(language); // t: CoreLabels (selalu terisi)
 *
 * Saat bahasa non-Indonesia dipilih, hook me-render fallback Indonesia dulu,
 * lalu menukar ke bahasa target setelah chunk dimuat (transisi mulus, tanpa
 * loading spinner — user tetap melihat teks yang benar, hanya bahasanya
 * menyusul <100ms).
 */

import { useEffect, useState } from 'react';
import type { LanguageCode } from '@/lib/preferences';
import { CORE_LABELS_ID, type CoreLabelKey } from './core-labels';
import type { CoreLabels } from './dictionaries';

export type { CoreLabels };

type LangDict = Record<string, string>;

/** Kamus Indonesia: fallback sinkron, selalu tersedia tanpa network. */
const ID_FALLBACK: CoreLabels = { ...CORE_LABELS_ID } as CoreLabels;

/** Cache kamus per bahasa yang sudah dimuat. */
const dictCache = new Map<LanguageCode, CoreLabels>();
dictCache.set('id', ID_FALLBACK);

/**
 * Loader dinamis per bahasa. Setiap bahasa dipetakan ke SATU chunk gabungan
 * region + fitur agar jumlah request minimal (1 chunk per bahasa).
 *
 * Struktur file dict: dict-*.ts mengekspor Record<lang, Record<key, string>>.
 * Dynamic import me-load file, lalu kita ambil hanya bahasa yang diminta.
 */
async function loadLanguage(language: LanguageCode): Promise<CoreLabels> {
  const cached = dictCache.get(language);
  if (cached) return cached;

  // Muat semua file kamus secara paralel, ambil hanya bahasa target.
  const modules = await Promise.all([
    import('./dict-local').then((m) => m.dictLocal as Record<string, LangDict>),
    import('./dict-european').then((m) => m.dictEuropean as Record<string, LangDict>),
    import('./dict-asian').then((m) => m.dictAsian as Record<string, LangDict>),
    import('./dict-southasia-mena').then((m) => m.dictSouthAsiaMena as Record<string, LangDict>),
    import('./dict-homepage').then((m) => m.dictHomepage as Record<string, LangDict>),
    import('./dict-navigation').then((m) => m.dictNavigation as Record<string, LangDict>),
    import('./dict-beranda').then((m) => m.dictBeranda as Record<string, LangDict>),
    import('./dict-marketplace').then((m) => m.dictMarketplace as Record<string, LangDict>),
    import('./dict-authprofile').then((m) => m.dictAuthProfile as Record<string, LangDict>),
    import('./dict-propertijobs').then((m) => m.dictPropertiJobs as Record<string, LangDict>),
    import('./dict-groups').then((m) => m.dictGroups as Record<string, LangDict>),
    import('./dict-chatnews').then((m) => m.dictChatNews as Record<string, LangDict>),
    import('./dict-misc').then((m) => m.dictMisc as Record<string, LangDict>),
  ]);

  // Gabung dengan fallback Indonesia per kunci (pola sama dengan withFallback).
  const out = { ...CORE_LABELS_ID } as Record<string, string>;
  for (const dict of modules) {
    const langDict = dict[language];
    if (langDict) Object.assign(out, langDict);
  }
  // Kunci non-inti dari dict fitur ikut terbawa via Object.assign di atas.
  void ({} as Record<CoreLabelKey, string>);

  const labels = out as CoreLabels;
  dictCache.set(language, labels);
  return labels;
}

/** Preload kamus bahasa tanpa menunggu (untuk hover/anticipation). */
export function preloadLanguage(language: LanguageCode): void {
  if (language === 'id' || dictCache.has(language)) return;
  void loadLanguage(language).catch(() => undefined);
}

/**
 * Hook: label inti untuk bahasa aktif (lazy-load, fallback Indonesia).
 * Pengganti drop-in untuk `getCoreLabels(language)` di client components.
 */
export function useCoreLabels(language: LanguageCode): CoreLabels {
  const [labels, setLabels] = useState<CoreLabels>(() => dictCache.get(language) ?? ID_FALLBACK);

  useEffect(() => {
    const cached = dictCache.get(language);
    if (cached) {
      setLabels(cached);
      return;
    }
    let cancelled = false;
    // Tampilkan Indonesia dulu, tukar ke bahasa target saat chunk tiba.
    setLabels(ID_FALLBACK);
    void loadLanguage(language)
      .then((loaded) => {
        if (!cancelled) setLabels(loaded);
      })
      .catch(() => {
        /* network gagal: tetap Indonesia */
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  return labels;
}

/**
 * Versi sinkron untuk kode yang BELUM migrasi ke hook (server components,
 * util non-React): mengembalikan cache bila ada, fallback Indonesia bila
 * belum. PENTING: tidak me-load network — untuk bahasa non-id yang belum
 * di-cache, panggil preloadLanguage() dulu dari client.
 */
export function getCoreLabelsSync(language: LanguageCode): CoreLabels {
  return dictCache.get(language) ?? ID_FALLBACK;
}

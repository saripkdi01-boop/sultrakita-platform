/**
 * SUKI Apps — Kamus terpadu 27 bahasa
 * Merakit semua kamus per region menjadi satu Record<LanguageCode, CoreLabels>
 */

import type { LanguageCode } from '@/lib/preferences';
import { CORE_LABELS_ID, type CoreLabelKey } from './core-labels';
import { dictAsian } from './dict-asian';
import { dictEuropean } from './dict-european';
import { dictLocal } from './dict-local';
import { dictSouthAsiaMena } from './dict-southasia-mena';

export type CoreLabels = Record<CoreLabelKey, string>;

const assembled = {
  ...dictLocal,       // id, jv, su
  ...dictEuropean,    // en, es, fr, de, pt, it, nl, ru
  ...dictAsian,       // zh, ja, ko, th, vi, tl, hi
  ...dictSouthAsiaMena, // bn, ur, ta, ar, fa, tr, my, km, ms
} as Record<string, Partial<Record<CoreLabelKey, string>>>;

// Bahasa yang belum ada di kamus (fil, sw) fallback ke Inggris/Indonesia
const FALLBACKS: Partial<Record<LanguageCode, CoreLabels>> = {
  fil: (assembled['en'] ?? {}) as CoreLabels,
  sw: (assembled['en'] ?? {}) as CoreLabels,
};

function withFallback(lang: Partial<Record<CoreLabelKey, string>>): CoreLabels {
  const out = {} as CoreLabels;
  for (const key of Object.keys(CORE_LABELS_ID) as CoreLabelKey[]) {
    out[key] = lang[key] ?? CORE_LABELS_ID[key];
  }
  return out;
}

export const CORE_DICTIONARIES: Record<LanguageCode, CoreLabels> = (() => {
  const result = {} as Record<LanguageCode, CoreLabels>;
  const codes: LanguageCode[] = ['id','en','ms','jv','su','zh','ja','ko','ar','hi','es','fr','de','pt','it','nl','ru','tr','th','vi','fil','sw','bn','ur','ta','fa','my'];
  for (const code of codes) {
    const direct = assembled[code];
    if (direct && Object.keys(direct).length > 0) {
      result[code] = withFallback(direct);
    } else if (FALLBACKS[code]) {
      result[code] = withFallback(FALLBACKS[code]!);
    } else {
      result[code] = { ...CORE_LABELS_ID };
    }
  }
  return result;
})();

/** Ambil label inti untuk bahasa aktif (fallback ke Indonesia) */
export function getCoreLabels(language: LanguageCode): CoreLabels {
  return CORE_DICTIONARIES[language] ?? CORE_DICTIONARIES.id;
}

/**
 * SUKI Apps — Kamus terpadu 27 bahasa
 * Merakit semua kamus per region + per fitur menjadi satu Record<LanguageCode, CoreLabels>
 */

import type { LanguageCode } from '@/lib/preferences';
import { CORE_LABELS_ID, type CoreLabelKey } from './core-labels';
import { dictAsian } from './dict-asian';
import { dictEuropean } from './dict-european';
import { dictLocal } from './dict-local';
import { dictSouthAsiaMena } from './dict-southasia-mena';
// Kamus per fitur (dari migrasi i18n full coverage)
import { dictHomepage } from './dict-homepage';
import { dictNavigation } from './dict-navigation';
import { dictBeranda } from './dict-beranda';
import { dictMarketplace } from './dict-marketplace';
import { dictAuthProfile } from './dict-authprofile';
import { dictPropertiJobs } from './dict-propertijobs';
import { dictGroups } from './dict-groups';
import { dictChatNews } from './dict-chatnews';
import { dictMisc } from './dict-misc';

export type CoreLabels = Record<CoreLabelKey, string>;

// Daftar 27 kode bahasa (tunggal, tanpa fil/sw)
export const LANGUAGE_CODES: LanguageCode[] = ['id','en','ms','jv','su','zh','ja','ko','th','vi','tl','hi','bn','ur','ta','my','km','ar','fa','tr','es','fr','de','pt','it','nl','ru'];

// Gabungkan semua kamus per bahasa
function mergeDicts(...dicts: Record<string, Record<string, string>>[]): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};
  for (const code of LANGUAGE_CODES) {
    result[code] = {};
    for (const dict of dicts) {
      const langDict = dict[code];
      if (langDict) {
        Object.assign(result[code], langDict);
      }
    }
  }
  return result;
}

const assembled = mergeDicts(
  dictLocal,         // id, jv, su (+ fil, sw legacy — diabaikan)
  dictEuropean,      // en, es, fr, de, pt, it, nl, ru
  dictAsian,         // zh, ja, ko, th, vi, tl, hi
  dictSouthAsiaMena, // bn, ur, ta, ar, fa, tr, my, km, ms
  dictHomepage,
  dictNavigation,
  dictBeranda,
  dictMarketplace,
  dictAuthProfile,
  dictPropertiJobs,
  dictGroups,
  dictChatNews,
  dictMisc,
) as Record<string, Partial<Record<CoreLabelKey, string>>>;

function withFallback(lang: Partial<Record<CoreLabelKey, string>>): CoreLabels {
  const out = {} as CoreLabels;
  for (const key of Object.keys(CORE_LABELS_ID) as CoreLabelKey[]) {
    out[key] = lang[key] ?? CORE_LABELS_ID[key];
  }
  // Sertakan juga kunci non-inti (dari dict fitur) tanpa fallback ketat
  for (const key of Object.keys(lang)) {
    if (!(key in out)) {
      (out as Record<string, string>)[key] = lang[key as CoreLabelKey] ?? '';
    }
  }
  return out;
}

export const CORE_DICTIONARIES: Record<LanguageCode, CoreLabels> = (() => {
  const result = {} as Record<LanguageCode, CoreLabels>;
  for (const code of LANGUAGE_CODES) {
    const direct = assembled[code];
    if (direct && Object.keys(direct).length > 0) {
      result[code] = withFallback(direct);
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

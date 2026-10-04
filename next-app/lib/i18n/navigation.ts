/**
 * SUKI Apps — accessor kamus navigasi & layout.
 * Mandiri dari dictionaries.ts (milik tim paralel); parent merakit di akhir.
 */
import type { LanguageCode } from '@/lib/preferences';
import { dictNavigation } from './dict-navigation';

/** Label navigasi untuk bahasa aktif; fallback per-kunci ke Bahasa Indonesia. */
export function getNavLabels(language: LanguageCode): Record<string, string> {
  const id = dictNavigation.id ?? {};
  const lang = dictNavigation[language] ?? {};
  return { ...id, ...lang };
}

/**
 * SUKI Apps i18n — 27 bahasa
 * Bahasa default: Indonesia (id)
 */

export type LanguageCode =
  | 'id' | 'en' | 'ms' | 'jv' | 'su' | 'zh' | 'ja' | 'ko'
  | 'th' | 'vi' | 'tl' | 'hi' | 'bn' | 'ur' | 'ta' | 'my'
  | 'km' | 'ar' | 'fa' | 'tr' | 'es' | 'fr' | 'de' | 'pt'
  | 'it' | 'nl' | 'ru';

export interface LanguageMeta {
  code: LanguageCode;
  /** Nama dalam bahasa itu sendiri */
  nativeName: string;
  /** Nama dalam Bahasa Indonesia */
  indonesianName: string;
  /** Kode flag emoji */
  flag: string;
  /** Arah teks */
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'id', nativeName: 'Bahasa Indonesia', indonesianName: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'en', nativeName: 'English', indonesianName: 'Bahasa Inggris', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ms', nativeName: 'Bahasa Melayu', indonesianName: 'Bahasa Melayu', flag: '🇲🇾', dir: 'ltr' },
  { code: 'jv', nativeName: 'Basa Jawa', indonesianName: 'Bahasa Jawa', flag: '🇮🇩', dir: 'ltr' },
  { code: 'su', nativeName: 'Basa Sunda', indonesianName: 'Bahasa Sunda', flag: '🇮🇩', dir: 'ltr' },
  { code: 'zh', nativeName: '简体中文', indonesianName: 'Mandarin (Sederhana)', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', nativeName: '日本語', indonesianName: 'Bahasa Jepang', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', nativeName: '한국어', indonesianName: 'Bahasa Korea', flag: '🇰🇷', dir: 'ltr' },
  { code: 'th', nativeName: 'ภาษาไทย', indonesianName: 'Bahasa Thailand', flag: '🇹🇭', dir: 'ltr' },
  { code: 'vi', nativeName: 'Tiếng Việt', indonesianName: 'Bahasa Vietnam', flag: '🇻🇳', dir: 'ltr' },
  { code: 'tl', nativeName: 'Tagalog', indonesianName: 'Bahasa Tagalog', flag: '🇵🇭', dir: 'ltr' },
  { code: 'hi', nativeName: 'हिन्दी', indonesianName: 'Bahasa Hindi', flag: '🇮🇳', dir: 'ltr' },
  { code: 'bn', nativeName: 'বাংলা', indonesianName: 'Bahasa Bengali', flag: '🇧🇩', dir: 'ltr' },
  { code: 'ur', nativeName: 'اردو', indonesianName: 'Bahasa Urdu', flag: '🇵🇰', dir: 'rtl' },
  { code: 'ta', nativeName: 'தமிழ்', indonesianName: 'Bahasa Tamil', flag: '🇮🇳', dir: 'ltr' },
  { code: 'my', nativeName: 'မြန်မာဘာသာ', indonesianName: 'Bahasa Myanmar', flag: '🇲🇲', dir: 'ltr' },
  { code: 'km', nativeName: 'ភាសាខ្មែរ', indonesianName: 'Bahasa Khmer', flag: '🇰🇭', dir: 'ltr' },
  { code: 'ar', nativeName: 'العربية', indonesianName: 'Bahasa Arab', flag: '🇸🇦', dir: 'rtl' },
  { code: 'fa', nativeName: 'فارسی', indonesianName: 'Bahasa Persia', flag: '🇮🇷', dir: 'rtl' },
  { code: 'tr', nativeName: 'Türkçe', indonesianName: 'Bahasa Turki', flag: '🇹🇷', dir: 'ltr' },
  { code: 'es', nativeName: 'Español', indonesianName: 'Bahasa Spanyol', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', nativeName: 'Français', indonesianName: 'Bahasa Prancis', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', nativeName: 'Deutsch', indonesianName: 'Bahasa Jerman', flag: '🇩🇪', dir: 'ltr' },
  { code: 'pt', nativeName: 'Português', indonesianName: 'Bahasa Portugis', flag: '🇵🇹', dir: 'ltr' },
  { code: 'it', nativeName: 'Italiano', indonesianName: 'Bahasa Italia', flag: '🇮🇹', dir: 'ltr' },
  { code: 'nl', nativeName: 'Nederlands', indonesianName: 'Bahasa Belanda', flag: '🇳🇱', dir: 'ltr' },
  { code: 'ru', nativeName: 'Русский', indonesianName: 'Bahasa Rusia', flag: '🇷🇺', dir: 'ltr' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'id';

export const LANGUAGE_CODES = LANGUAGES.map(l => l.code);

export function isValidLanguageCode(code: string): code is LanguageCode {
  return LANGUAGE_CODES.includes(code as LanguageCode);
}

export function getLanguageMeta(code: LanguageCode): LanguageMeta {
  return LANGUAGES.find(l => l.code === code) ?? LANGUAGES[0];
}

export const LANGUAGE_COOKIE = 'suki-lang';
export const LANGUAGE_STORAGE_KEY = 'suki-language';

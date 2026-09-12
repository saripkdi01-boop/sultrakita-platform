'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export const LANGUAGES = [
  ['id', 'Bahasa Indonesia'], ['en', 'English'], ['ms', 'Bahasa Melayu'], ['jv', 'Basa Jawa'], ['su', 'Basa Sunda'], ['zh', '中文'], ['ja', '日本語'], ['ko', '한국어'], ['ar', 'العربية'], ['hi', 'हिन्दी'], ['es', 'Español'], ['fr', 'Français'], ['de', 'Deutsch'], ['pt', 'Português'], ['it', 'Italiano'], ['nl', 'Nederlands'], ['ru', 'Русский'], ['tr', 'Türkçe'], ['th', 'ไทย'], ['vi', 'Tiếng Việt'], ['fil', 'Filipino'], ['sw', 'Kiswahili'], ['bn', 'বাংলা'], ['ur', 'اردو'],
] as const;
export type LanguageCode = typeof LANGUAGES[number][0];
export type ThemeMode = 'light' | 'dark';

type PreferencesContextValue = { theme: ThemeMode; setTheme: (theme: ThemeMode) => void; toggleTheme: () => void; language: LanguageCode; setLanguage: (language: LanguageCode) => void; languageName: string; hydrated: boolean };
const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [language, setLanguageState] = useState<LanguageCode>('id');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('sultrakita-theme');
    const savedLanguage = window.localStorage.getItem('sultrakita-language');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const initialTheme: ThemeMode = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : prefersDark.matches ? 'dark' : 'light';
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setLanguageState(LANGUAGES.some(([code]) => code === savedLanguage) ? savedLanguage as LanguageCode : 'id');
    setHydrated(true);

    if (savedTheme !== 'dark' && savedTheme !== 'light') {
      const handleSystemTheme = (event: MediaQueryListEvent) => {
        const nextTheme = event.matches ? 'dark' : 'light';
        setThemeState(nextTheme);
        applyTheme(nextTheme);
      };
      prefersDark.addEventListener?.('change', handleSystemTheme);
      return () => prefersDark.removeEventListener?.('change', handleSystemTheme);
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    if (hydrated) window.localStorage.setItem('sultrakita-theme', theme);
  }, [theme, hydrated]);

  useEffect(() => {
    document.documentElement.lang = language;
    if (hydrated) window.localStorage.setItem('sultrakita-language', language);
  }, [language, hydrated]);

  const value = useMemo(() => ({
    theme,
    setTheme: (next: ThemeMode) => setThemeState(next),
    toggleTheme: () => setThemeState((current) => current === 'dark' ? 'light' : 'dark'),
    language,
    setLanguage: (next: LanguageCode) => setLanguageState(next),
    languageName: LANGUAGES.find(([code]) => code === language)?.[1] || 'Bahasa Indonesia',
    hydrated,
  }), [theme, language, hydrated]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error('usePreferences harus digunakan di dalam PreferencesProvider.');
  return value;
}

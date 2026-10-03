'use client';

import { Moon, Sun } from 'lucide-react';
import { usePreferences } from '@/lib/preferences';

/**
 * Toggle mode terang/gelap — memakai usePreferences (sumber kebenaran tunggal:
 * PreferencesProvider). Ditaruh di kiri hamburger pada mobile bar.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = usePreferences();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`sknav-icon-btn sknav-theme-toggle ${className}`.trim()}
      aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      aria-pressed={theme === 'dark'}
      title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
    >
      {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}

'use client';

import './language-switcher.css';
import { useState, useRef, useEffect } from 'react';
import { Languages, Check, ChevronDown } from 'lucide-react';
import { LANGUAGES, usePreferences, type LanguageCode } from '@/lib/preferences';
import { getLabels } from '@/lib/i18n';

type LanguageSwitcherProps = {
  /** 'dropdown' = tombol + menu, 'select' = elemen select native, 'grid' = daftar tombol */
  variant?: 'dropdown' | 'select' | 'grid';
  className?: string;
  showLabel?: boolean;
};

export function LanguageSwitcher({ variant = 'dropdown', className = '', showLabel = true }: LanguageSwitcherProps) {
  const { language, setLanguage } = usePreferences();
  const labels = getLabels(language);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== 'dropdown') return;
    function onClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [variant]);

  if (variant === 'select') {
    return (
      <label className={`suki-lang-select ${className}`}>
        {showLabel && <span><Languages size={14} /> {labels.chooseLanguage}</span>}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          aria-label={labels.chooseLanguage}
        >
          {LANGUAGES.map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </label>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`suki-lang-grid ${className}`} role="group" aria-label={labels.chooseLanguage}>
        {LANGUAGES.map(([code, name]) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={language === code ? 'active' : ''}
            aria-pressed={language === code}
          >
            {language === code && <Check size={13} />}
            <span>{name}</span>
          </button>
        ))}
      </div>
    );
  }

  // dropdown (default)
  const currentName = LANGUAGES.find(([code]) => code === language)?.[1] ?? 'Bahasa Indonesia';
  return (
    <div ref={ref} className={`suki-lang-dropdown ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={labels.chooseLanguage}
        className="suki-lang-toggle"
      >
        <Languages size={16} />
        {showLabel && <span>{currentName}</span>}
        <ChevronDown size={14} className={open ? 'rotate-180' : ''} />
      </button>
      {open && (
        <div className="suki-lang-menu" role="listbox" aria-label={labels.chooseLanguage}>
          {LANGUAGES.map(([code, name]) => (
            <button
              key={code}
              role="option"
              aria-selected={language === code}
              onClick={() => { setLanguage(code); setOpen(false); }}
              className={language === code ? 'active' : ''}
            >
              <span>{name}</span>
              {language === code && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

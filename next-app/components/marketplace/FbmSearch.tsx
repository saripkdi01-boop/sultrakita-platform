'use client';

import { Search, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { getMarketplaceLabels } from '@/lib/i18n/dict-marketplace';

// Kotak "Cari di Marketplace" ala FB — dipakai di sidebar desktop
// dan sebagai search pill sticky di mobile. Saran: riwayat lokal +
// tren, submit-based (sinkron URL via onSearch).

const suggestions = {
  trending: ['Laptop HP', 'Tanah Kavling', 'Ruko'],
  categories: ['Elektronik', 'Otomotif', 'Properti'],
  locations: ['Kendari', 'Konawe', 'Baubau'],
};

const RECENT_KEY = 'suki-marketplace-recent-searches';

export function FbmSearch({ value, onSearch, id }: { value: string; onSearch: (value: string) => void; id: string }) {
  const { language } = usePreferences();
  const t = getCoreLabels(language);
  const mp = getMarketplaceLabels(language);
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setDraft(value); }, [value]);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(RECENT_KEY) || '[]');
      if (Array.isArray(stored)) setRecent(stored.filter((item): item is string => typeof item === 'string').slice(0, 4));
    } catch { /* local storage opsional */ }
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const filtered = useMemo(() => {
    const needle = draft.trim().toLowerCase();
    const all = [...recent, ...suggestions.trending, ...suggestions.categories, ...suggestions.locations];
    return all.filter((item, index) => (!needle || item.toLowerCase().includes(needle)) && all.indexOf(item) === index).slice(0, 7);
  }, [draft, recent]);

  function choose(term: string) {
    onSearch(term);
    setDraft(term);
    setOpen(false);
    const next = [term, ...recent.filter((item) => item !== term)].slice(0, 4);
    setRecent(next);
    try { window.localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* abaikan */ }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = draft.trim();
    if (term) choose(term);
    else onSearch('');
    setOpen(false);
  }

  return (
    <div className="fbm-search" ref={ref}>
      <form className="fbm-search-box" onSubmit={submit} role="search">
        <Search size={17} aria-hidden="true" />
        <input
          id={id}
          value={draft}
          onFocus={() => setOpen(true)}
          onChange={(event) => { setDraft(event.target.value); setOpen(true); }}
          placeholder={mp.mpSearchPlaceholder}
          aria-label={mp.mpSearchPlaceholder}
          aria-autocomplete="list"
          aria-controls={`${id}-suggestions`}
          autoComplete="off"
        />
        {draft && (
          <button type="button" className="fbm-search-clear" onClick={() => { setDraft(''); onSearch(''); setOpen(false); }} aria-label={mp.mpClearSearch}>
            <X size={15} aria-hidden="true" />
          </button>
        )}
        <button className="fbm-search-go" type="submit">{t.search}</button>
      </form>
      {open && (
        <div id={`${id}-suggestions`} className="fbm-suggestions" role="listbox" aria-label={mp.mpSearchSuggestions}>
          <div className="fbm-suggestion-label">{draft ? mp.mpSearchSuggestions : recent.length ? mp.mpRecentSearches : mp.mpTrending}</div>
          {filtered.map((item) => (
            <button key={item} type="button" role="option" className="fbm-suggestion" onClick={() => choose(item)} aria-selected={false}>
              <Search size={14} aria-hidden="true" /> {item}
              <small>{suggestions.locations.includes(item) ? mp.mpLocationTag : suggestions.categories.includes(item) ? mp.mpCategoryTag : mp.mpSearchTag}</small>
            </button>
          ))}
          {!filtered.length && <p className="fbm-suggestions-empty">{mp.mpNoSuggestions}</p>}
        </div>
      )}
    </div>
  );
}

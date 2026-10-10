'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Search, Tag } from 'lucide-react';
import { getPropertySearchSuggestions } from '@/lib/actions/property';

type Suggestion = { type: 'district' | 'title'; label: string; sub?: string };

// Omnibox ala Zillow/Brighton: saran lokasi & judul dari DATA NYATA (debounce 300ms).
// Tidak ada saran karangan — daftar kosong = tidak ada dropdown.
export default function PropertySearchAutocomplete({
  value,
  onChange,
  onSubmit,
  placeholder,
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const q = value.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await getPropertySearchSuggestions(q);
        if (res.ok && res.data.length > 0) {
          setSuggestions(res.data);
          setOpen(true);
          setActive(-1);
        } else {
          setSuggestions([]);
          setOpen(false);
        }
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function pick(s: Suggestion) {
    onChange(s.label);
    setOpen(false);
    onSubmit();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Enter') { e.preventDefault(); onSubmit(); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % suggestions.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + suggestions.length) % suggestions.length); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(suggestions[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  }

  return (
    <div ref={boxRef} className={`relative min-w-0 flex-1 ${className ?? ''}`}>
      <div className="flex min-h-11 flex-1 items-center gap-2 rounded-lg bg-white px-3 sm:gap-3 sm:rounded-xl sm:px-4 dark:bg-slate-900">
        {loading ? <Loader2 size={19} className="shrink-0 animate-spin text-slate-400" aria-hidden="true" /> : <Search size={19} className="shrink-0 text-slate-400" aria-hidden="true" />}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          placeholder={placeholder}
          aria-label={ariaLabel}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls="properti-search-suggestions"
          autoComplete="off"
        />
      </div>
      {open && suggestions.length > 0 && (
        <ul
          id="properti-search-suggestions"
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          {suggestions.map((s, i) => (
            <li key={`${s.type}-${s.label}-${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(s); }}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition ${i === active ? 'bg-sultra-mint/60 dark:bg-slate-800' : ''}`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  {s.type === 'district' ? <MapPin size={15} aria-hidden="true" /> : <Tag size={15} aria-hidden="true" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-slate-800 dark:text-slate-100">{s.label}</span>
                  {s.sub && <span className="block truncate text-xs text-slate-400">{s.sub}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

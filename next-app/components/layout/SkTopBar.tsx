'use client';

import Link from 'next/link';
import { MessageCircle, Plus, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { NotificationCenter } from './NotificationCenter';
import { useProfileStore } from '@/store/profile';
import { SK_OPEN_NOTIFICATIONS_EVENT } from './skNavBus';

const SEARCH_DEBOUNCE_MS = 280;

type SkTopBarProps = {
  onCreate?: (type?: 'post' | 'reel') => void;
  profileHref: string;
};

function initialsOf(name: string): string {
  const clean = name.trim();
  if (!clean) return 'SK';
  const parts = clean.split(/\s+/);
  const first = parts[0]?.charAt(0) ?? 'S';
  const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) ?? '' : '';
  return `${first}${last}`.toUpperCase();
}

export function SkTopBar({ onCreate, profileHref }: SkTopBarProps) {
  const profile = useProfileStore((state) => state.profile);
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  const focusSearch = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // "/" fokus ke pencarian (kecuali sedang mengetik); Esc menutup & membersihkan.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        focusSearch();
        return;
      }
      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('');
        setDebounced('');
        setPanelOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusSearch]);

  // Jembatan: item "Notifikasi" di left rail / bottom nav membuka panel yang sama
  // tanpa mengubah NotificationCenter (klik pemicu aslinya secara terprogram).
  useEffect(() => {
    const openPanel = () => {
      rootRef.current?.querySelector<HTMLButtonElement>('.notification-trigger')?.click();
    };
    window.addEventListener(SK_OPEN_NOTIFICATIONS_EVENT, openPanel);
    return () => window.removeEventListener(SK_OPEN_NOTIFICATIONS_EVENT, openPanel);
  }, []);

  const submitSearch = (event?: React.FormEvent) => {
    event?.preventDefault();
    const q = query.trim();
    if (!q) return;
    setPanelOpen(false);
    inputRef.current?.blur();
    window.location.href = `/marketplace?search=${encodeURIComponent(q)}`;
  };

  const displayName = profile.full_name?.trim() || profile.username?.trim() || 'Warga SUKI';
  const avatarInitials = initialsOf(profile.full_name || profile.username).slice(0, 2);

  return (
    <header className="sk-topbar" ref={rootRef}>
      <div className="sk-topbar-inner">
        <BrandLogo />
        <div className="sk-search">
          <form role="search" onSubmit={submitSearch}>
            <Search size={17} aria-hidden="true" className="sk-search-icon" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPanelOpen(true);
              }}
              onFocus={() => setPanelOpen(true)}
              onBlur={() => window.setTimeout(() => setPanelOpen(false), 150)}
              placeholder="Cari produk, komunitas, atau warga…"
              aria-label="Cari di SUKI"
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                className="sk-search-clear"
                aria-label="Hapus pencarian"
                onClick={() => {
                  setQuery('');
                  setDebounced('');
                  focusSearch();
                }}
              >
                <X size={15} aria-hidden="true" />
              </button>
            ) : null}
            <kbd className="sk-search-kbd" aria-hidden="true" title="Tekan / untuk fokus ke pencarian">
              /
            </kbd>
          </form>
          {panelOpen && debounced ? (
            <div className="sk-search-panel" role="listbox" aria-label="Saran pencarian">
              <button type="button" role="option" aria-selected="false" className="sk-search-suggestion" onClick={() => submitSearch()}>
                <Search size={15} aria-hidden="true" />
                <span>
                  Cari <strong>&ldquo;{debounced}&rdquo;</strong> di Marketplace
                </span>
              </button>
              <p className="sk-search-hint">Enter untuk mencari · Esc untuk menutup</p>
            </div>
          ) : null}
        </div>
        <nav className="sk-topbar-actions" aria-label="Aksi cepat">
          {onCreate ? (
            <button type="button" className="sk-create-btn" onClick={() => onCreate('post')} aria-label="Buat postingan baru">
              <Plus size={18} aria-hidden="true" />
              <span>Buat</span>
            </button>
          ) : null}
          <NotificationCenter />
          <Link href="/chat" className="sk-icon-btn" aria-label="Pesan">
            <MessageCircle size={19} aria-hidden="true" />
          </Link>
          <Link href={profileHref} className="sk-avatar-btn" aria-label={`Buka profil ${displayName}`}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" />
            ) : (
              <span aria-hidden="true">{avatarInitials}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

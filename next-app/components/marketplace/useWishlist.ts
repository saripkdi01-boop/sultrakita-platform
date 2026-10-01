'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSessionProfile } from '@/hooks/useSessionProfile';
import { getWishlistIds, toggleWishlist } from '@/lib/actions/marketplace';

// Fase 2.4: wishlist optimistis — UI berubah instan, rollback saat gagal.
// Bila belum login: simpan id pending ke localStorage, buka login sheet,
// dan lanjutkan aksi otomatis setelah user kembali dalam keadaan login.

const PENDING_KEY = 'suki-pending-wishlist';

function readPending(): string | null {
  try {
    const value = window.localStorage.getItem(PENDING_KEY);
    window.localStorage.removeItem(PENDING_KEY);
    return value;
  } catch {
    return null;
  }
}

export function useWishlist() {
  const { user } = useSessionProfile();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loginSheetOpen, setLoginSheetOpen] = useState(false);
  const [lastError, setLastError] = useState('');
  const resumedRef = useRef(false);

  useEffect(() => {
    let active = true;
    getWishlistIds().then((result) => { if (active && result.ok) setSavedIds(result.ids); });
    return () => { active = false; };
  }, [user?.id]);

  const runToggle = useCallback(async (id: string): Promise<boolean> => {
    const was = savedIds.includes(id);
    setSavedIds((current) => (was ? current.filter((item) => item !== id) : [...current, id]));
    setLastError('');
    const result = await toggleWishlist(id);
    if (result.ok && result.saved !== was) return true;
    // Rollback: kembalikan state semula.
    setSavedIds((current) => (was ? (current.includes(id) ? current : [...current, id]) : current.filter((item) => item !== id)));
    if (!result.ok && 'code' in result && result.code === 'LOGIN_REQUIRED') {
      try { window.localStorage.setItem(PENDING_KEY, id); } catch { /* abaikan */ }
      setLoginSheetOpen(true);
    } else if (!result.ok) {
      setLastError(result.error || 'Gagal menyimpan. Coba lagi.');
    }
    return false;
  }, [savedIds]);

  const toggle = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      try { window.localStorage.setItem(PENDING_KEY, id); } catch { /* abaikan */ }
      setLoginSheetOpen(true);
      return false;
    }
    return runToggle(id);
  }, [user, runToggle]);

  // Lanjutkan aksi yang tertunda setelah user login (kembali dari /login?redirect=...).
  useEffect(() => {
    if (!user || resumedRef.current) return;
    resumedRef.current = true;
    const pending = readPending();
    if (pending) void runToggle(pending);
  }, [user, runToggle]);

  return { savedIds, toggle, loginSheetOpen, setLoginSheetOpen, lastError, setLastError };
}

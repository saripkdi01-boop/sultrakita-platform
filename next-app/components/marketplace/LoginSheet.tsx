'use client';

import { Heart, LogIn, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

// Fase 2.4: bottom sheet saat aksi butuh login (mis. wishlist).
// Setelah login, redirect kembali ke halaman asal agar aksi bisa dilanjutkan.

export function LoginSheet({ open, onClose, title = 'Masuk untuk menyimpan', description = 'Buat akun atau masuk agar listing favoritmu tersimpan di semua perangkat.' }: { open: boolean; onClose: () => void; title?: string; description?: string }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const primaryRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeButton = closeRef.current;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    primaryRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = previous; closeButton?.focus(); };
  }, [open, onClose]);

  if (!open) return null;
  const redirect = typeof window !== 'undefined' ? encodeURIComponent(`${window.location.pathname}${window.location.search}`) : '%2Fmarketplace';
  return (
    <div className="login-sheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="login-sheet" role="dialog" aria-modal="true" aria-labelledby="login-sheet-title">
        <button ref={closeRef} type="button" className="login-sheet-close" onClick={onClose} aria-label="Tutup"><X size={18} /></button>
        <div className="login-sheet-icon"><Heart size={26} aria-hidden="true" /></div>
        <h2 id="login-sheet-title">{title}</h2>
        <p>{description}</p>
        <Link ref={primaryRef} href={`/login?redirect=${redirect}`} className="login-sheet-primary"><LogIn size={16} aria-hidden="true" /> Masuk ke akun</Link>
        <Link href={`/signup?redirect=${redirect}`} className="login-sheet-secondary">Buat akun baru</Link>
        <button type="button" className="login-sheet-later" onClick={onClose}>Nanti saja</button>
      </section>
    </div>
  );
}

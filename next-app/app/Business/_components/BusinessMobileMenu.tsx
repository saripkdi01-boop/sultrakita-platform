'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export type BusinessMobileMenuLink = { href: string; label: string };

type BusinessMobileMenuProps = {
  /** Tautan navigasi (ditampilkan sebagai daftar). */
  links: BusinessMobileMenuLink[];
  /** Aksi (mis. Masuk, Daftarkan bisnis) — aksi terakhir tampil sebagai tombol gelap. */
  actions: BusinessMobileMenuLink[];
  /** Label aria untuk <nav> di dalam panel. */
  label?: string;
};

/** Menu hamburger untuk header /Business di layar ≤900px.
 *  Di desktop, tombol disembunyikan oleh CSS (.suki-business-menu) dan panel tak pernah dibuka. */
export default function BusinessMobileMenu({ links, actions, label = 'Menu SUKI Business' }: BusinessMobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const primary = actions[actions.length - 1];
  const secondary = actions.slice(0, -1);

  return (
    <>
      <button
        type="button"
        className="suki-business-menu"
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={open}
        aria-controls="suki-business-mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
      </button>
      {open && (
        <div id="suki-business-mobile-menu" className="suki-business-menu-panel">
          <nav aria-label={label}>
            {links.map((link) => (
              <Link key={`${link.href}|${link.label}`} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          {actions.length > 0 && (
            <div className="suki-business-menu-actions">
              {secondary.map((action) => (
                <Link
                  key={`${action.href}|${action.label}`}
                  href={action.href}
                  onClick={() => setOpen(false)}
                >
                  {action.label}
                </Link>
              ))}
              {primary && (
                <Link
                  key={`${primary.href}|${primary.label}`}
                  href={primary.href}
                  onClick={() => setOpen(false)}
                  className="suki-business-button suki-business-button-dark"
                >
                  {primary.label}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

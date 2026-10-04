'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

export type BusinessNavItem = { href: string; label: string };

type BusinessNavProps = {
  /** Tautan navigasi utama (tampil di desktop & panel mobile). */
  links: BusinessNavItem[];
  /** Tautan aksi sekunder, mis. Masuk / Dashboard. */
  actions?: BusinessNavItem[];
  /** CTA utama. */
  cta?: BusinessNavItem;
  /** Sembunyikan CTA (mis. di halaman daftar). */
  hideCta?: boolean;
  brandHref?: string;
  brandAriaLabel?: string;
};

/** Navigasi SUKI Business: logo vektor resmi + hamburger mobile yang berfungsi. */
export default function BusinessNav({
  links,
  actions = [],
  cta,
  hideCta = false,
  brandHref = '/Business',
  brandAriaLabel,
}: BusinessNavProps) {
  const { language } = usePreferences();
  const b = getGroupsLabels(language);
  const resolvedCta = cta ?? { href: '/Business/daftar', label: b.bNavRegister };
  const resolvedBrandAria = brandAriaLabel ?? b.bNavBrandAria;
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (
        target &&
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open ]);

  return (
    <header className="suki-business-nav">
      <Link href={brandHref} className="suki-business-brand" aria-label={resolvedBrandAria}>
        <span className="suki-business-mark" aria-hidden="true">
          <img src="/suki-logo-mark.svg" alt="" width={36} height={36} />
        </span>
        <span>
          <strong>SUKI</strong>
          <small>Business</small>
        </span>
      </Link>
      <nav aria-label={b.bNavAria}>
        {links.map((link) => (
          <Link key={link.href + link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="suki-business-nav-actions">
        {actions.map((action) => (
          <Link key={action.href + action.label} href={action.href} className="suki-business-login">
            {action.label}
          </Link>
        ))}
        {!hideCta && (
          <Link href={resolvedCta.href} className="suki-business-button suki-business-button-dark">
            {resolvedCta.label} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        )}
      </div>
      <button
        ref={buttonRef}
        type="button"
        className="suki-business-menu"
        aria-label={open ? b.bNavCloseMenu : b.bNavOpenMenu}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
      </button>
      <div
        ref={panelRef}
        className={`suki-business-mobile-panel${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        {links.map((link) => (
          <Link key={link.href + link.label} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        {actions.map((action) => (
          <Link
            key={action.href + action.label}
            href={action.href}
            onClick={() => setOpen(false)}
          >
            {action.label}
          </Link>
        ))}
        {!hideCta && (
          <Link
            href={resolvedCta.href}
            className="suki-business-mobile-cta"
            onClick={() => setOpen(false)}
          >
            {resolvedCta.label} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        )}
      </div>
    </header>
  );
}

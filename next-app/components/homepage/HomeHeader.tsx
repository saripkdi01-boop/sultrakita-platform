'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import { DOORS, SIGNUP_HREF } from '@/lib/homepage/content';
import { DoorIcon } from './DoorIcons';

/**
 * Header sticky + blur. CTA "Mulai Gratis" selalu ada di desktop: bergaya
 * sekunder (outline) selama hero terlihat — supaya hanya ada 1 CTA primer per
 * layar — lalu menjadi primer (terra) setelah hero lewat.
 * Mobile: logo + menu; CTA dipegang hero lalu sticky bar bawah.
 */
export function HomeHeader({ heroVisible }: { heroVisible: boolean }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.dataset.theme = next;
    root.style.colorScheme = next;
    root.classList.toggle('dark', next === 'dark');
    try {
      window.localStorage.setItem('sultrakita-theme', next);
    } catch (error) {
      console.warn('[homepage] preferensi tema tidak tersimpan', error);
    }
    setTheme(next);
  }

  const close = () => setOpen(false);

  return (
    <header className={`hm-header${open ? ' is-open' : ''}`}>
      <div className="hm-wrap hm-header-inner">
        <Link href="/" className="hm-brand" aria-label="Suki Apps — beranda" onClick={close}>
          <Image src="/brand/suki-logo-mark.svg" alt="" width={32} height={32} priority />
          <span>
            <strong>Suki Apps</strong>
            <small>Kendari · Sultra</small>
          </span>
        </Link>

        <nav id="hm-nav" className="hm-nav" aria-label="Enam pintu Suki Apps">
          <ul>
            {DOORS.map((door) => (
              <li key={door.id}>
                <Link
                  href={door.href}
                  onClick={close}
                  data-track="door_click"
                  data-track-door={door.id}
                  data-track-placement="header"
                >
                  <span className="hm-nav-icon"><DoorIcon id={door.id} size={18} /></span>
                  {door.name}
                </Link>
              </li>
            ))}
            <li className="hm-nav-extra"><a href="#harga" onClick={close}>Harga</a></li>
            <li className="hm-nav-extra"><Link href="/login" onClick={close}>Masuk</Link></li>
          </ul>
          <Link
            href={SIGNUP_HREF}
            className="hm-btn hm-btn--primary hm-nav-cta"
            onClick={close}
            data-track="cta_mulai_gratis"
            data-track-placement="menu"
          >
            Mulai Gratis <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </nav>

        <div className="hm-header-actions">
          <button
            type="button"
            className="hm-icon-btn"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
          >
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <Link href="/login" className="hm-header-login">Masuk</Link>
          <Link
            href={SIGNUP_HREF}
            className={`hm-btn hm-btn--sm ${heroVisible ? 'hm-btn--outline' : 'hm-btn--primary'} hm-header-cta`}
            data-track="cta_mulai_gratis"
            data-track-placement="header"
          >
            Mulai Gratis
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="hm-icon-btn hm-menu-btn"
            aria-controls="hm-nav"
            aria-expanded={open}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}

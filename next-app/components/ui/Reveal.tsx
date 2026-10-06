'use client';

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactElement, type ReactNode } from 'react';

export interface RevealProps {
  /** Elemen pembungkus yang dirender. Default: 'div'. */
  as?: ElementType;
  /** Jeda sebelum animasi mulai, dalam milidetik. */
  delay?: number;
  /** Jarak geser vertikal awal (px) sebelum elemen terlihat. */
  y?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Reveal — animasi muncul saat elemen masuk viewport.
 *
 * Hanya menganimasikan opacity + transform (tanpa layout shift).
 * Nonaktif total saat pengguna memilih prefers-reduced-motion:
 * elemen langsung tampil tanpa animasi. Observer dibersihkan
 * saat komponen dilepas atau setelah elemen terlihat.
 */
export function Reveal({
  as: asProp = 'div',
  delay = 0,
  y = 24,
  className,
  children,
}: RevealProps): ReactElement {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Tanpa IntersectionObserver (SSR/edge case) atau reduced-motion:
    // tampilkan langsung, tanpa animasi.
    if (
      typeof IntersectionObserver === 'undefined' ||
      (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate3d(0, 0, 0)' : `translate3d(0, ${y}px, 0)`,
    transitionProperty: 'opacity, transform',
    // Memakai token motion --dn-* bila tersedia, dengan fallback aman.
    transitionDuration: 'var(--dn-duration-normal, 240ms)',
    transitionTimingFunction: 'var(--dn-ease-out, cubic-bezier(0.22, 1, 0.36, 1))',
    transitionDelay: `${delay}ms`,
    willChange: visible ? undefined : 'opacity, transform',
  };

  const Tag = asProp as 'div';

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

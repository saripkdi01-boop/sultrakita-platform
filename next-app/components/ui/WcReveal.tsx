'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * WcReveal — scroll-reveal untuk World-Class Overhaul.
 * Menambah class .is-visible saat masuk viewport (IntersectionObserver).
 * Tanpa JS / reduced-motion: konten tetap terlihat (CSS .wc-reveal menonaktifkan
 * animasi bila prefers-reduced-motion).
 */
export default function WcReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`wc-reveal ${className}`.trim()} data-delay={delay || undefined}>
      {children}
    </div>
  );
}

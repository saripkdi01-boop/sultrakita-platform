'use client';

import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 1200;
const format = (n: number) => new Intl.NumberFormat('id-ID').format(n);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Angka count-up 1200ms saat masuk viewport.
 * - SSR merender angka final (SEO / tanpa JS) dengan state "pending" → CSS
 *   menampilkannya sebagai skeleton, bukan angka kosong.
 * - `replay` berubah (mis. saat hover kartu) → hitung ulang dari 0.
 * - prefers-reduced-motion: langsung tampil final, tanpa animasi.
 */
export function CountUp({ value, replay = 0 }: { value: number; replay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const [state, setState] = useState<'pending' | 'done'>('pending');
  const started = useRef(false);
  const frame = useRef<number | null>(null);

  const run = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    setState('done');
    if (prefersReducedMotion() || value <= 0) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      setDisplay(Math.round(value * easeOutCubic(t)));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    setDisplay(0);
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      started.current = true;
      setDisplay(value);
      setState('done');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          io.disconnect();
          run();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run() membaca value terbaru
  }, [value]);

  useEffect(() => {
    if (replay > 0 && started.current) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hanya dipicu oleh replay
  }, [replay]);

  return (
    <span ref={ref} className="hm-count" data-state={state}>
      {format(display)}
    </span>
  );
}

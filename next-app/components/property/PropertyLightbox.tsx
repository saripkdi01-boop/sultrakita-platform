'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type Props = {
  images: string[];
  title: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/**
 * Lightbox fullscreen ala aplikasi properti:
 * - Swipe kiri/kanan untuk pindah foto
 * - Pinch-to-zoom + double-tap untuk zoom
 * - Keyboard: panah navigasi, Escape tutup
 * - Counter + tombol tutup + panah
 */
export function PropertyLightbox({ images, title, index, onIndexChange, onClose }: Props) {
  const count = images.length;
  const [scale, setScale] = useState(1);
  const [dragX, setDragX] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const pinchStart = useRef<number | null>(null);
  const pinchBase = useRef(1);
  const lastTap = useRef(0);

  const goTo = useCallback(
    (next: number) => {
      setScale(1);
      setDragX(0);
      onIndexChange(((next % count) + count) % count);
    },
    [count, onIndexChange]
  );

  // Kunci scroll body + keyboard
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') goTo(index + 1);
      else if (e.key === 'ArrowLeft') goTo(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [goTo, index, onClose]);

  const distance = (a: React.Touch, b: React.Touch) =>
    Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStart.current = distance(e.touches[0], e.touches[1]);
      pinchBase.current = scale;
      touchStartX.current = null;
    } else if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      // Double-tap: toggle zoom 1x / 2.2x
      const now = Date.now();
      if (now - lastTap.current < 300) {
        setScale(s => (s > 1.2 ? 1 : 2.2));
        touchStartX.current = null;
      }
      lastTap.current = now;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart.current !== null) {
      const d = distance(e.touches[0], e.touches[1]);
      const next = Math.min(4, Math.max(1, (pinchBase.current * d) / pinchStart.current));
      setScale(next);
    } else if (e.touches.length === 1 && touchStartX.current !== null && scale === 1) {
      // Swipe hanya saat tidak zoom
      setDragX(e.touches[0].clientX - touchStartX.current);
    }
  };

  const onTouchEnd = () => {
    if (touchStartX.current !== null && scale === 1) {
      if (dragX < -60) goTo(index + 1);
      else if (dragX > 60) goTo(index - 1);
    }
    setDragX(0);
    touchStartX.current = null;
    pinchStart.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Galeri foto ${title}`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Bar atas */}
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm font-bold">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          aria-label="Tutup galeri"
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 transition hover:bg-white/25"
        >
          <X size={20} />
        </button>
      </div>

      {/* Area foto */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div
          className="transition-transform duration-200 ease-out"
          style={{ transform: `translateX(${dragX}px) scale(${scale})` }}
        >
          <Image
            key={images[index]}
            src={images[index]}
            alt={`${title}, foto ${index + 1} dari ${count}`}
            width={1600}
            height={1200}
            priority
            sizes="100vw"
            className="max-h-[75vh] w-auto max-w-[100vw] select-none object-contain"
            draggable={false}
          />
        </div>

        {count > 1 && scale === 1 && (
          <>
            <button
              type="button"
              aria-label="Foto sebelumnya"
              onClick={() => goTo(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/25"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label="Foto berikutnya"
              onClick={() => goTo(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/25"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Indikator titik */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5 px-4 pb-6">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ke foto ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { PropertyLightbox } from './PropertyLightbox';

type Props = {
  images: string[];
  title: string;
};

/**
 * Galeri foto properti ala aplikasi properti (Brighton/99.co):
 * - Hero carousel dengan swipe sentuh + tombol panah di desktop
 * - Badge counter "3/12"
 * - Strip thumbnail dengan highlight aktif
 * - Ketuk foto untuk buka lightbox fullscreen
 */
export function PropertyGallery({ images, title }: Props) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const count = images.length;
  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    setDragX(e.touches[0].clientX - touchStartX.current);
  };
  const onTouchEnd = () => {
    if (touchStartX.current === null) return;
    if (dragX < -50) goTo(index + 1);
    else if (dragX > 50) goTo(index - 1);
    setDragX(0);
    touchStartX.current = null;
  };

  // Reset drag saat index berubah via tombol/thumbnail
  useEffect(() => setDragX(0), [index]);

  if (count === 0) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-3xl bg-gradient-to-br from-sultra-mint to-sultra-sand font-semibold text-sultra-forest">
        Hunian pilihan Sultra
      </div>
    );
  }

  return (
    <div>
      {/* Hero carousel */}
      <div
        className="relative select-none overflow-hidden rounded-3xl bg-gradient-to-br from-sultra-mint to-sultra-sand"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(calc(${-index * 100}% + ${dragX}px))` }}
        >
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              aria-label={`Buka foto ${i + 1} dari ${count}`}
              onClick={() => {
                setIndex(i);
                setLightboxOpen(true);
              }}
              className="relative aspect-[4/3] w-full shrink-0 cursor-zoom-in"
            >
              <Image
                src={src}
                alt={`${title}, foto ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>

        {/* Badge counter */}
        {count > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white">
            {index + 1}/{count}
          </span>
        )}

        {/* Tombol expand */}
        <button
          type="button"
          aria-label="Lihat galeri fullscreen"
          onClick={() => setLightboxOpen(true)}
          className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
        >
          <Expand size={16} />
        </button>

        {/* Panah desktop */}
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto sebelumnya"
              onClick={() => goTo(index - 1)}
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 md:block"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Foto berikutnya"
              onClick={() => goTo(index + 1)}
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 md:block"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Strip thumbnail */}
      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Thumbnail foto">
          {images.map((src, i) => (
            <button
              key={`thumb-${src}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Foto ${i + 1}`}
              onClick={() => goTo(i)}
              className={`relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl transition ${
                i === index ? 'ring-2 ring-sultra-teal ring-offset-2' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                loading="lazy"
                sizes="80px"
                className="object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <PropertyLightbox
          images={images}
          title={title}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

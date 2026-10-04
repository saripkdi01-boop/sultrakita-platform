'use client';

import { useState } from 'react';

/**
 * ImageSlot — boundary tunggal untuk foto identitas Kendari.
 * Pola: <img> di atas fallback CSS; saat gambar gagal dimuat (slot kosong),
 * img disembunyikan sehingga fallback gradasi yang indah tampil.
 * Overlay duotone teal+emas menjaga kohesi "Teluk Senja" apa pun sumber fotonya.
 */
export default function ImageSlot({
  src,
  alt,
  fallbackClass,
  eager = false,
  duotone = true,
  imgAltHidden = false,
}: {
  src: string;
  alt: string;
  /** Kelas fallback, mis. "kh-fb-masjid". */
  fallbackClass: string;
  eager?: boolean;
  duotone?: boolean;
  imgAltHidden?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="kh-slot">
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={imgAltHidden ? '' : alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="kh-slot-img"
          onError={() => setFailed(true)}
        />
      )}
      <div className={`kh-slot-fb ${fallbackClass}`} aria-hidden="true" />
      {duotone && <div className="kh-slot-duo" aria-hidden="true" />}
    </div>
  );
}

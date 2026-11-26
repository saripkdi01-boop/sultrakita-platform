'use client';

import Image from 'next/image';
import { useState } from 'react';
import { assetSrc, type HomeAsset } from '@/lib/homepage/assets';

/**
 * Gambar homepage dengan rantai cadangan:
 *   aset baru (bila `uploaded`) → foto lokal asli (fallback) → tidak dirender.
 * onError juga turun ke fallback, jadi file yang salah nama tidak pernah
 * menampilkan ikon gambar rusak atau kotak abu-abu.
 */
export function HomeImage({
  asset,
  sizes,
  priority = false,
  className,
}: {
  asset: HomeAsset;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(assetSrc(asset));
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={asset.alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      className={className}
      onError={() => setSrc(src === asset.src && asset.fallback ? asset.fallback : null)}
    />
  );
}

export function hasAsset(asset: HomeAsset): boolean {
  return assetSrc(asset) !== null;
}

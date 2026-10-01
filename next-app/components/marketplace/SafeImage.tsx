'use client';

import Image from 'next/image';

// Fase 2.2: next/image (lazy + ukuran teroptimasi + anti-CLS via fill)
// dengan fallback <img> biasa untuk host yang belum terdaftar di
// next.config.mjs (mis. custom domain R2) — agar halaman tidak crash.

const ALLOWED_HOSTS = [/^images\.unsplash\.com$/, /(^|\.)supabase\.co$/, /(^|\.)r2\.dev$/, /amazonaws\.com$/];

function hostAllowed(src: string): boolean {
  try {
    const host = new URL(src).hostname.toLowerCase();
    return ALLOWED_HOSTS.some((pattern) => pattern.test(host));
  } catch {
    return false;
  }
}

type Props = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function SafeImage({ src, alt, sizes = '(max-width: 700px) 50vw, (max-width: 1050px) 33vw, 25vw', priority = false, className = 'object-cover' }: Props) {
  if (!hostAllowed(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} className={`safe-img-fallback ${className}`} />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} loading={priority ? 'eager' : 'lazy'} className={className} />;
}

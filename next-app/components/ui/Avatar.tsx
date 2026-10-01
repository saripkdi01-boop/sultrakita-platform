'use client';

import { useState } from 'react';
import { cx } from './a11y';

export type AvatarPresence = 'online' | 'offline' | 'away';

export interface AvatarProps {
  /** Nama untuk inisial fallback dan alt text. */
  name: string;
  src?: string | null;
  /** Diameter dalam px. */
  size?: number;
  presence?: AvatarPresence;
  className?: string;
}

/** Ambil inisial: huruf pertama dari maksimal 2 kata pertama. */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0].charAt(0);
  const second = words.length > 1 ? words[1].charAt(0) : '';
  return (first + second).toUpperCase();
}

/** Avatar dengan fallback inisial bila gambar gagal dimuat, plus indikator presence opsional. */
export function Avatar({ name, src, size = 36, presence, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const fontSize = Math.max(10, Math.round(size * 0.36));

  return (
    <span
      className={cx('sk-avatar', className)}
      style={{ width: size, height: size, fontSize }}
      role="img"
      aria-label={name}
      title={name}
    >
      {showImage ? (
        // Avatar kecil remote: next/image butuh domain config; <img> + lazy sudah cukup.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src as string} alt="" aria-hidden="true" onError={() => setFailed(true)} loading="lazy" />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
      {presence && (
        <span
          className={cx('sk-avatar-dot', `sk-avatar-dot-${presence}`)}
          aria-label={presence === 'online' ? 'Online' : presence === 'away' ? 'Sibuk' : 'Offline'}
        />
      )}
    </span>
  );
}

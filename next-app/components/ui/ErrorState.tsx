'use client';

import { RotateCcw, WifiOff } from 'lucide-react';
import { cx } from './a11y';
import { Button } from './Button';

export interface ErrorStateProps {
  /** Judul manusiawi, bukan kode error. Default ramah id-ID. */
  title?: string;
  /** Penjelasan singkat yang bisa dipahami pengguna. */
  message?: string;
  onRetry: () => void;
  retryLabel?: string;
  className?: string;
}

/** State error: pesan manusiawi + tombol "Coba lagi". */
export function ErrorState({
  title = 'Ups, ada yang tidak beres',
  message = 'Kami tidak bisa memuat bagian ini. Periksa koneksi internetmu, lalu coba lagi.',
  onRetry,
  retryLabel = 'Coba lagi',
  className,
}: ErrorStateProps) {
  return (
    <div className={cx('sk-state', 'sk-state-error', className)} role="alert">
      <span className="sk-state-icon" aria-hidden="true">
        <WifiOff size={26} />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
      <Button variant="secondary" size="md" onClick={onRetry}>
        <RotateCcw size={16} aria-hidden="true" />
        {retryLabel}
      </Button>
    </div>
  );
}

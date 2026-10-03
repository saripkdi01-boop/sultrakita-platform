'use client';

import { RotateCcw, WifiOff } from 'lucide-react';
import { cx } from './a11y';
import { Button } from './Button';
import { usePreferences } from '@/lib/preferences';
import { dictChatNews } from '@/lib/i18n/dict-chatnews';

export interface ErrorStateProps {
  /** Judul manusiawi, bukan kode error. Default ramah mengikuti bahasa aktif. */
  title?: string;
  /** Penjelasan singkat yang bisa dipahami pengguna. */
  message?: string;
  onRetry: () => void;
  retryLabel?: string;
  className?: string;
}

/** State error: pesan manusiawi + tombol "Coba lagi" — mengikuti bahasa aktif. */
export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel,
  className,
}: ErrorStateProps) {
  const { language } = usePreferences();
  const t = dictChatNews[language] ?? dictChatNews.id;
  return (
    <div className={cx('sk-state', 'sk-state-error', className)} role="alert">
      <span className="sk-state-icon" aria-hidden="true">
        <WifiOff size={26} />
      </span>
      <h3>{title ?? t.uiErrorTitle}</h3>
      <p>{message ?? t.uiErrorMessage}</p>
      <Button variant="secondary" size="md" onClick={onRetry}>
        <RotateCcw size={16} aria-hidden="true" />
        {retryLabel ?? t.uiTryAgain}
      </Button>
    </div>
  );
}

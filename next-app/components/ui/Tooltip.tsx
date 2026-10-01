'use client';

import { useId, type ReactNode } from 'react';
import { cx } from './a11y';

export interface TooltipProps {
  /** Teks tooltip (juga dipakai sebagai aria-label pemicu bila pemicu bukan elemen interaktif berlabel). */
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

/** Tooltip hover/fokus, muncul via CSS. Hormat reduced-motion. */
export function Tooltip({ content, children, position = 'top', className }: TooltipProps) {
  const tipId = useId();
  return (
    <span
      className={cx('sk-tooltip-wrap', position === 'bottom' && 'sk-tooltip-bottom', className)}
      aria-describedby={tipId}
    >
      {children}
      <span id={tipId} role="tooltip" className="sk-tooltip">
        {content}
      </span>
    </span>
  );
}

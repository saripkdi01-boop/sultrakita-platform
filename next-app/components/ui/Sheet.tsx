'use client';

import { useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cx } from './a11y';
import { overlayAriaProps, useOverlay } from './overlay';
import { IconButton } from './IconButton';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Label aksesibel bila tanpa title. */
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Bottom sheet mobile (jadi dialog terpusat di ≥640px).
 * Slide + fade, backdrop, Esc, focus trap ringan, safe-area inset.
 */
export function Sheet({ open, onClose, title, ariaLabel, children, className }: SheetProps) {
  const titleId = useId();
  const { containerRef } = useOverlay({
    open,
    onClose,
    labelledBy: title ? titleId : undefined,
  });

  if (!open) return null;

  return createPortal(
    <>
      <div className="sk-sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={containerRef}
        className={cx('sk-sheet', className)}
        {...overlayAriaProps(title ? titleId : undefined)}
        aria-label={title ? undefined : ariaLabel}
      >
        <div className="sk-sheet-handle" aria-hidden="true" />
        <div className="sk-sheet-head">
          {title ? (
            <h2 id={titleId} className="sk-sheet-title">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <IconButton label="Tutup" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </IconButton>
        </div>
        <div className="sk-sheet-body">{children}</div>
      </div>
    </>,
    document.body,
  );
}

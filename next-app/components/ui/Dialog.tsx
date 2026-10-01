'use client';

import { useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cx } from './a11y';
import { overlayAriaProps, useOverlay } from './overlay';
import { IconButton } from './IconButton';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/** Modal aksesibel: role dialog, aria-modal, backdrop, Esc, focus trap ringan. */
export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const { containerRef } = useOverlay({
    open,
    onClose,
    labelledBy: titleId,
    describedBy: description ? descId : undefined,
  });

  if (!open) return null;

  return createPortal(
    <div className="sk-dialog-backdrop" onClick={onClose}>
      <div
        ref={containerRef}
        className={cx('sk-dialog', className)}
        {...overlayAriaProps(titleId, description ? descId : undefined)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sk-dialog-head">
          <h2 id={titleId} className="sk-dialog-title">
            {title}
          </h2>
          <IconButton label="Tutup dialog" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </IconButton>
        </div>
        {description && (
          <p id={descId} className="sk-dialog-desc">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}

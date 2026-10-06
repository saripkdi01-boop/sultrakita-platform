'use client';

import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from 'react';
import { firstFocusable, trapFocus } from './a11y';

export interface OverlayOptions {
  open: boolean;
  onClose: () => void;
  /** Id elemen judul untuk aria-labelledby. */
  labelledBy?: string;
  /** Id elemen deskripsi untuk aria-describedby. */
  describedBy?: string;
}

export interface OverlayRefs {
  containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * Perilaku bersama overlay (Sheet & Dialog):
 * - Esc menutup
 * - Tab di-trap ringan di dalam kontainer
 * - autofocus ke elemen fokusable pertama saat dibuka
 * - scroll body dikunci, fokus dikembalikan ke pemicu saat ditutup
 */
export function useOverlay({ open, onClose, labelledBy, describedBy }: OverlayOptions): OverlayRefs {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    const container = containerRef.current;
    if (container) {
      // Tunggu frame berikutnya agar portal ter-render sebelum autofocus.
      const raf = window.requestAnimationFrame(() => {
        const target = firstFocusable(container);
        if (target) target.focus();
        else {
          container.setAttribute('tabindex', '-1');
          container.focus();
        }
      });
      return () => window.cancelAnimationFrame(raf);
    }
    return undefined;
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      const trigger = triggerRef.current;
      if (trigger && typeof trigger.focus === 'function') trigger.focus();
    };
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      const container = containerRef.current;
      if (container) trapFocus(container, event);
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, onClose]);

  return { containerRef };
}

/** Props ARIA bersama untuk kontainer overlay. */
export function overlayAriaProps(labelledBy?: string, describedBy?: string): {
  role: 'dialog';
  'aria-modal': true;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
} {
  const props: {
    role: 'dialog';
    'aria-modal': true;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
  } = { role: 'dialog', 'aria-modal': true };
  if (labelledBy) props['aria-labelledby'] = labelledBy;
  if (describedBy) props['aria-describedby'] = describedBy;
  return props;
}

export type OverlayKeyHandler = (event: ReactKeyboardEvent<HTMLDivElement>) => void;

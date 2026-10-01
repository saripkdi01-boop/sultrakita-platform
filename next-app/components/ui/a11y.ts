import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

/** Gabung daftar class secara aman (abaikan nilai kosong/undefined). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Focus trap "ringan" untuk Sheet/Dialog: putar fokus dengan Tab di dalam
 * kontainer. Dipanggil dari handler onKeyDown.
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent | ReactKeyboardEvent): void {
  if (event.key !== 'Tab') return;
  const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement as HTMLElement | null;
  if (event.shiftKey) {
    if (active === first || !container.contains(active)) {
      event.preventDefault();
      last.focus();
    }
  } else if (active === last) {
    event.preventDefault();
    first.focus();
  }
}

/** Kembalikan daftar elemen fokusable di dalam kontainer (untuk autofocus awal). */
export function firstFocusable(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
}

'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from './a11y';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** WAJIB: label aksesibel (dibaca screen reader). */
  label: string;
  bordered?: boolean;
  tonal?: boolean;
}

/**
 * Tombol ikon dengan hit area minimum 44×44px (WCAG target size).
 * `label` wajib diisi dan dirender sebagai aria-label.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, bordered = false, tonal = false, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      aria-label={label}
      title={label}
      className={cx(
        'sk-icon-btn',
        bordered && 'sk-icon-btn-bordered',
        tonal && 'sk-icon-btn-tonal',
        className,
      )}
      {...rest}
    />
  );
});

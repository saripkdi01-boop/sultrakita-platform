'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from './a11y';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Tampilkan spinner dan nonaktifkan interaksi. */
  loading?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'sk-btn-primary',
  secondary: 'sk-btn-secondary',
  ghost: 'sk-btn-ghost',
  danger: 'sk-btn-danger',
};

/** Tombol utama design system Teluk & Tenun. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, className, disabled, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx('sk-btn', VARIANTS[variant], size === 'sm' ? 'sk-btn-sm' : 'sk-btn-md', loading && 'sk-btn-loading', className)}
      {...rest}
    >
      {loading && <span className="sk-btn-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
});

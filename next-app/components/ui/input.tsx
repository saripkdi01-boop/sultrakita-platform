'use client';

import { forwardRef, useId, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Input, with optional label, hint and error text.
 *
 * Two label treatments are supported:
 * - `label` renders a static label above the field (the default).
 * - `floatingLabel` renders the label inside the field, shrinking on focus or
 *   when the field has a value. The spec asks for floating labels on the auth
 *   screens, so it lives here rather than being re-implemented per page.
 *
 * Accessibility notes:
 * - The label is a real <label> bound by `htmlFor`, not a placeholder. A
 *   placeholder vanishes on first keystroke and is not an accessible name.
 * - `aria-invalid` and `aria-describedby` are wired automatically, so the error
 *   is announced with the field instead of being a loose red sentence.
 * - The error region is only rendered when there is an error; a permanently
 *   present alert region would re-announce on every render.
 *
 * The floating label needs a little state because CSS cannot observe the value
 * of a controlled input that is set programmatically (e.g. autofill or a
 * server-provided default). `filled` tracks that; the visual shift itself is a
 * transition on `top`/`font-size`, which the global reduced-motion rule in
 * suki-foundation.css §9 already neutralises.
 */

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> & {
  label: string;
  /** Visually hide the label but keep it for assistive tech. */
  hideLabel?: boolean;
  hint?: ReactNode;
  error?: string;
  /** Render the label inside the field, shrinking on focus or when filled. */
  floatingLabel?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hideLabel = false, hint, error, floatingLabel = false, className, id, onBlur, onFocus, onChange, value, defaultValue, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const [filled, setFilled] = useState(Boolean(value ?? defaultValue));
  const [focused, setFocused] = useState(false);

  const describedBy =
    [error ? errorId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') || undefined;

  const field = (
    <input
      ref={ref}
      id={inputId}
      value={value}
      defaultValue={defaultValue}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      // `placeholder=" "` is what lets the floating label detect an empty field
      // in CSS. It is a layout hook, not user-facing copy.
      placeholder={floatingLabel ? ' ' : undefined}
      className={cn(
        'peer h-11 w-full rounded-qwen-md border bg-surface-elevated px-3 text-sm text-text-primary',
        'placeholder:text-text-muted',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-base',
        'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-60',
        error ? 'border-danger' : 'border-border-subtle hover:border-border-strong',
        floatingLabel && 'pt-5 pb-1',
        className,
      )}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        setFilled(Boolean(event.target.value));
        onBlur?.(event);
      }}
      onChange={(event) => {
        setFilled(Boolean(event.target.value));
        onChange?.(event);
      }}
      {...rest}
    />
  );

  return (
    <div className="flex w-full flex-col gap-1.5">
      {floatingLabel ? (
        <div className="relative">
          {field}
          <label
            htmlFor={inputId}
            className={cn(
              'pointer-events-none absolute left-3 origin-left text-text-muted transition-all duration-150',
              // Resting (empty and unfocused) sits centred; focused or filled
              // lifts to the top and shrinks.
              filled || focused ? 'top-1.5 text-xs' : 'top-1/2 -translate-y-1/2 text-sm',
            )}
          >
            {label}
          </label>
        </div>
      ) : (
        <>
          <label
            htmlFor={inputId}
            className={cn('text-xs font-semibold tracking-qwen-wide text-text-secondary', hideLabel && 'sr-only')}
          >
            {label}
          </label>
          {field}
        </>
      )}

      {hint && !error ? (
        <p id={hintId} className="text-xs text-text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
});

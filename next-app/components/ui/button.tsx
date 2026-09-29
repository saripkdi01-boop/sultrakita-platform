import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Button — the canonical interactive control.
 *
 * Variants are plain lookup objects rather than `class-variance-authority`. The
 * spec's example imports `cva`, but `cva` is not on this branch's allowed
 * dependency list and two lookup tables do not justify adding a package. If
 * `cva` is approved later, only this file changes.
 *
 * Colours come from the spec tokens (`brand-*`, `surface-*`, `text-*`,
 * `border-*`) so nothing here is a hardcoded palette class, per the spec's
 * consistency criterion.
 *
 * The loading state disables the control *and* sets `aria-busy`, because a
 * spinner alone is invisible to assistive tech. The spinner is `aria-hidden`
 * and its animation is disabled under `prefers-reduced-motion` via Tailwind's
 * `motion-reduce:` variant, satisfying the spec's motion requirement without a
 * hook.
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-tint-sm hover:shadow-tint-md',
  secondary:
    'bg-surface-elevated text-text-primary border border-border-subtle hover:bg-surface-sunken hover:border-border-strong',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-sunken hover:text-text-primary',
  danger: 'bg-danger text-white hover:opacity-90 active:opacity-95 shadow-tint-sm',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

/** Icon-only buttons get a square footprint so the glyph stays centred. */
const ICON_ONLY_SIZES: Record<Size, string> = {
  sm: 'h-9 w-9 p-0',
  md: 'h-10 w-10 p-0',
  lg: 'h-12 w-12 p-0',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /** Swaps the leading icon for a spinner and blocks interaction. */
  loading?: boolean;
  /** Renders a square control. Requires `aria-label` — enforced below. */
  iconOnly?: boolean;
  /** Leading icon, hidden from assistive tech (the label carries meaning). */
  icon?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, iconOnly = false, icon, className, children, disabled, ...rest },
  ref,
) {
  // An icon-only control with no accessible name is unusable with a screen
  // reader. Fail loudly in development rather than shipping a silent a11y bug.
  if (process.env.NODE_ENV !== 'production' && iconOnly && !rest['aria-label'] && !rest['aria-labelledby']) {
    console.warn('[SUKI] <Button iconOnly> needs an aria-label or aria-labelledby.');
  }

  return (
    <button
      ref={ref}
      // Disabled while loading so a double-tap cannot fire the action twice.
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-qwen-md font-medium tracking-qwen-wide',
        'transition-[background-color,border-color,box-shadow,color] duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
        'disabled:pointer-events-none disabled:opacity-50',
        iconOnly ? ICON_ONLY_SIZES[size] : SIZES[size],
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <LoaderCircle className="size-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      ) : icon ? (
        <span className="shrink-0" aria-hidden="true">{icon}</span>
      ) : null}
      {children}
    </button>
  );
});

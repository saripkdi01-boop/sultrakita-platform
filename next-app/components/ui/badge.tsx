import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge — small status or category pill.
 *
 * Tones map to the semantic state colours so a "Terverifikasi" badge and a
 * success banner cannot drift apart. `brand` is the default because most badges
 * in this app mark a listing as SUKI-affiliated.
 *
 * The tint is composed with `color-mix` rather than an `/12` alpha suffix.
 * Both work, but `color-mix` keeps the pill readable if a tone's token is ever
 * changed from a channel triplet to a flat colour, which the alpha form would
 * silently break. The border uses a stronger mix so the pill keeps an edge on
 * both light and dark surfaces.
 */

type Tone = 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
type Size = 'sm' | 'md';

const TONES: Record<Tone, string> = {
  brand: 'text-brand-700 dark:text-brand-500 [--badge-tone:var(--suki-rgb-primary)]',
  neutral: 'text-text-secondary [--badge-tone:var(--suki-rgb-text-muted)]',
  success: 'text-success [--badge-tone:var(--suki-rgb-success)]',
  warning: 'text-warning [--badge-tone:var(--suki-rgb-warning)]',
  danger: 'text-danger [--badge-tone:var(--suki-rgb-danger)]',
  info: 'text-info [--badge-tone:var(--suki-rgb-info)]',
};

const SIZES: Record<Size, string> = {
  sm: 'h-5 px-2 text-[11px] gap-1',
  md: 'h-6 px-2.5 text-xs gap-1.5',
};

export function Badge({
  tone = 'brand',
  size = 'sm',
  icon,
  className,
  children,
}: {
  tone?: Tone;
  size?: Size;
  /** Optional leading icon. Kept `aria-hidden` — the label carries meaning. */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-qwen-full border font-semibold tracking-qwen-wide whitespace-nowrap',
        SIZES[size],
        TONES[tone],
        className,
      )}
      style={{
        backgroundColor: 'color-mix(in srgb, var(--badge-tone) 12%, transparent)',
        borderColor: 'color-mix(in srgb, var(--badge-tone) 32%, transparent)',
      }}
    >
      {icon ? (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}

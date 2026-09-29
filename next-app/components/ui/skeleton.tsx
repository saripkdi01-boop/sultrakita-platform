'use client';

import { cn } from '@/lib/utils';

/**
 * Skeleton — the single implementation for this app.
 *
 * PR #16 shipped a `Skeleton` inside `components/ui/States.tsx`. The spec asks
 * for `components/ui/skeleton.tsx`. Rather than end up with two shimmer
 * implementations that drift, this file is now canonical and `States.tsx`
 * re-exports it, so both import paths resolve to the same component.
 *
 * The shimmer itself is `.suki-skeleton` from app/styles/suki-foundation.css
 * §7, which already stops animating under `prefers-reduced-motion: reduce` and
 * under the in-app `html.reduce-motion` preference. Nothing here needs its own
 * motion guard as a result.
 *
 * Skeletons are decorative — the surrounding region carries `aria-busy` — so
 * they are hidden from assistive tech to avoid announcing placeholder boxes.
 */

type SkeletonProps = {
  /** `text` = one line, `rect` = block, `circle` = avatar. */
  variant?: 'text' | 'rect' | 'circle';
  /** Number of stacked lines. Only meaningful for `variant="text"`. */
  lines?: number;
  /** Any CSS length. Defaults follow the variant. */
  width?: string;
  height?: string;
  className?: string;
};

const DEFAULTS: Record<NonNullable<SkeletonProps['variant']>, { width: string; height: string }> = {
  text: { width: '100%', height: '0.875rem' },
  rect: { width: '100%', height: '7rem' },
  circle: { width: '2.5rem', height: '2.5rem' },
};

export function Skeleton({
  variant = 'text',
  lines = 1,
  width,
  height,
  className,
}: SkeletonProps) {
  const fallback = DEFAULTS[variant];
  const count = variant === 'text' ? Math.max(1, lines) : 1;
  const items = Array.from({ length: count });

  return (
    <div
      className={cn('flex flex-col gap-2', className)}
      aria-hidden="true"
      data-variant={variant}
    >
      {items.map((_, index) => (
        <span
          key={index}
          className={cn(
            'suki-skeleton block',
            variant === 'circle' && 'rounded-full',
            variant === 'rect' && 'rounded-qwen-md',
            variant === 'text' && 'rounded-qwen-sm',
          )}
          style={{
            // Last line of a stack stops short, the way a real paragraph does,
            // so a multi-line skeleton does not read as a solid block.
            width: index === items.length - 1 && count > 1 ? '72%' : (width ?? fallback.width),
            height: height ?? fallback.height,
          }}
        />
      ))}
    </div>
  );
}

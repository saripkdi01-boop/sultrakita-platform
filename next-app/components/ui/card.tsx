import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Card — compound component.
 *
 * Split into named slots so spacing, border and radius rules live in one place
 * instead of being re-invented at every call site. This is the "compound
 * components" pattern the spec asks for.
 *
 * Elevation uses the spec's tinted shadow (`shadow-tint-sm`) and the spec's
 * `lg` radius (20px) by default. `interactive` adds the brand-tinted hover lift
 * that the spec reserves for hover only, so a resting card stays neutral.
 *
 * The wrapper is a plain element, not a button: making the whole card a tab
 * stop duplicates the inner link and breaks the tab order. When a card must be
 * clickable, pass `as="article"` and put a real link on the title.
 *
 * Why `as` is cast to `ElementType`: props are typed as `HTMLAttributes<HTMLElement>`,
 * and spreading those onto a union of intrinsic tags (`'div' | 'li'`) makes
 * TypeScript intersect the tag prop types, which turns `onToggle` into an
 * unsatisfiable `HTMLDivElement & HTMLLIElement`. The public type stays narrow
 * so callers keep autocomplete on `as`, and the cast is confined to the tag.
 */

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'section' | 'li';
  interactive?: boolean;
};

export function Card({ as = 'div', interactive = false, className, ...rest }: CardProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={cn(
        'rounded-qwen-lg border border-border-subtle bg-surface-elevated shadow-tint-sm',
        // Transitions are neutralised globally under prefers-reduced-motion by
        // suki-foundation.css §9, so no per-component guard is needed here.
        interactive &&
          'transition-shadow duration-200 hover:shadow-tint-md-hover focus-within:shadow-tint-md-hover',
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1 px-5 pt-5', className)} {...rest} />;
}

export function CardTitle({
  as = 'h3',
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' }) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={cn('font-semibold tracking-qwen-tight text-text-primary', className)}
      {...rest}
    />
  );
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-text-secondary', className)} {...rest} />;
}

export function CardContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-4', className)} {...rest} />;
}

export function CardFooter({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return (
    <div
      className={cn('flex items-center gap-2 border-t border-border-subtle px-5 py-4', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

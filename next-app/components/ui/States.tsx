'use client';

import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, LoaderCircle, RefreshCw, type LucideIcon } from 'lucide-react';

/**
 * Shared state primitives.
 *
 * The audit found loading handled in 19 files, empty in 16 and error in 17 —
 * each with its own markup, wording and colour. These components give every
 * surface one vocabulary. They are presentation-only: they render no data and
 * call no API.
 *
 * Styling comes from app/styles/suki-foundation.css §7, so they follow the
 * canonical theme contract and work in light, dark, reduced-motion and
 * forced-colors modes without per-call-site classes.
 */

type IconType = LucideIcon;

export type StateTone = 'neutral' | 'error';

type StateProps = {
  /** Short, plain-language headline. */
  title: string;
  /** Optional one-line explanation. */
  description?: ReactNode;
  /** Optional icon override. */
  icon?: IconType;
  /** Optional action, e.g. a retry button or a link back. */
  action?: ReactNode;
  /** `error` switches the surface to the danger palette. */
  tone?: StateTone;
  /** Extra class names are appended, never replacing the base styling. */
  className?: string;
};

function classes(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ');
}

/**
 * Generic state surface. Prefer the named helpers below so intent stays obvious.
 */
export function StatePanel({ title, description, icon: Icon, action, tone = 'neutral', className }: StateProps) {
  return (
    <div
      className={classes('suki-state', tone === 'error' && 'suki-state--error', className)}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {Icon ? <Icon size={28} aria-hidden /> : null}
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      {action ? <div className="suki-state__action">{action}</div> : null}
    </div>
  );
}

/**
 * Empty state. Use when a request succeeded but returned nothing, so the user
 * needs to know the difference between "nothing here yet" and "something broke".
 */
export function EmptyState({
  title,
  description,
  icon = Inbox,
  action,
  className,
}: Omit<StateProps, 'tone'>) {
  return (
    <StatePanel
      title={title}
      description={description}
      icon={icon}
      action={action}
      tone="neutral"
      className={className}
    />
  );
}

/**
 * Error state. Announces via `role="alert"` and offers a recovery action.
 * `onRetry` renders a ready-made retry control so callers do not hand-roll one.
 */
export function ErrorState({
  title,
  description,
  icon = AlertTriangle,
  action,
  onRetry,
  retryLabel = 'Coba lagi',
  className,
}: Omit<StateProps, 'tone'> & { onRetry?: () => void; retryLabel?: string }) {
  const resolvedAction =
    action ??
    (onRetry ? (
      <button type="button" onClick={onRetry}>
        <RefreshCw size={15} aria-hidden />
        {retryLabel}
      </button>
    ) : null);

  return (
    <StatePanel
      title={title}
      description={description}
      icon={icon}
      action={resolvedAction}
      tone="error"
      className={className}
    />
  );
}

/**
 * Inline loading state for surfaces that cannot use a skeleton.
 * Uses `aria-busy` + a live region so assistive tech announces it once.
 */
export function LoadingState({ label = 'Memuat…', className }: { label?: string; className?: string }) {
  return (
    <div className={classes('suki-state', 'suki-state--loading', className)} role="status" aria-busy="true" aria-live="polite">
      <LoaderCircle size={26} aria-hidden />
      <strong>{label}</strong>
    </div>
  );
}

/**
 * Skeleton block. `lines` renders a text-like stack; `height`/`width` cover
 * media and card placeholders. Purely decorative, so it is hidden from AT.
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  radius = 'var(--suki-radius-sm)',
  lines = 1,
  className,
}: {
  width?: string;
  height?: string;
  radius?: string;
  lines?: number;
  className?: string;
}) {
  const items = Array.from({ length: Math.max(1, lines) });
  return (
    <div className={classes('suki-skeleton-stack', className)} aria-hidden="true">
      {items.map((_, index) => (
        <span
          key={index}
          className="suki-skeleton"
          style={{
            display: 'block',
            width: index === items.length - 1 && lines > 1 ? '72%' : width,
            height,
            borderRadius: radius,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Inline feedback banner for form submissions and settings saves.
 * `tone="error"` uses `role="alert"`; anything else is a polite status.
 */
export function FeedbackBanner({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: 'neutral' | 'error' | 'success';
  children: ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <div
      className={classes('suki-feedback', className)}
      data-tone={tone}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}

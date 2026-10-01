'use client';

import type { CSSProperties } from 'react';
import { cx } from './a11y';

export interface SkeletonProps {
  /** Bentuk skeleton. */
  variant?: 'line' | 'circle' | 'block';
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Skeleton shimmer. Animasi shimmer dimatikan otomatis saat
 * `prefers-reduced-motion: reduce` (lihat ui-primitives.css).
 */
export function Skeleton({ variant = 'line', width, height, className, style }: SkeletonProps) {
  const resolvedStyle: CSSProperties = { ...style };
  if (width !== undefined) resolvedStyle.width = width;
  if (height !== undefined) resolvedStyle.height = height;
  if (variant === 'circle' && height === undefined && width !== undefined) {
    resolvedStyle.height = width;
  }
  if (variant === 'line' && height === undefined) resolvedStyle.height = 12;

  return (
    <span
      className={cx('sk-skeleton', variant === 'circle' && 'sk-skeleton-circle', className)}
      style={resolvedStyle}
      aria-hidden="true"
    />
  );
}

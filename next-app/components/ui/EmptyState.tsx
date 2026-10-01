'use client';

import type { ComponentType, ReactNode } from 'react';
import { cx } from './a11y';
import { Button, type ButtonVariant } from './Button';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
}

export interface EmptyStateProps {
  /** Ikon lucide kecil (bukan ilustrasi raksasa). */
  icon: ComponentType<{ size?: number | string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: ReactNode;
  className?: string;
}

/** State kosong: judul + deskripsi + aksi. Tanpa ilustrasi raksasa. */
export function EmptyState({ icon: Icon, title, description, action, secondaryAction, className }: EmptyStateProps) {
  return (
    <div className={cx('sk-state', className)}>
      <span className="sk-state-icon" aria-hidden="true">
        <Icon size={26} />
      </span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && (
        <Button variant={action.variant ?? 'primary'} size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      {secondaryAction}
    </div>
  );
}

'use client';

import { useRef, type ComponentType } from 'react';
import { cx } from './a11y';

export interface TabItem {
  id: string;
  label: string;
  /** Komponen ikon lucide opsional. */
  icon?: ComponentType<{ size?: number | string; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  className?: string;
}

/** Tab terkontrol dengan role tablist/tab + navigasi panah keyboard. */
export function Tabs({ tabs, value, onChange, ariaLabel, className }: TabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const current = tabs.findIndex((t) => t.id === value);
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = tabs[(current + delta + tabs.length) % tabs.length];
    onChange(next.id);
    tabRefs.current[tabs.findIndex((t) => t.id === next.id)]?.focus();
  }

  return (
    <div role="tablist" aria-label={ariaLabel} className={cx('sk-tabs', className)} onKeyDown={onKeyDown}>
      {tabs.map((tab, index) => {
        const selected = tab.id === value;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className="sk-tab"
            onClick={() => onChange(tab.id)}
          >
            {Icon && <Icon size={16} aria-hidden="true" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

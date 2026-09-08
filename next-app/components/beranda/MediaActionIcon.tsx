'use client';

import type { ReactNode } from 'react';

type MediaActionIconProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'active';
};

export function MediaActionIcon({ icon, label, onClick, variant = 'default' }: MediaActionIconProps) {
  const active = variant === 'active';

  return <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`group flex h-[72px] min-w-[88px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border bg-white px-3 transition-all duration-200 hover:scale-[1.02] hover:border-teal-500 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 ${active ? 'border-teal-500 bg-teal-50 text-teal-700 ring-2 ring-teal-200' : 'border-gray-200 text-gray-700'}`}
  >
    <span className={`mb-1 flex h-6 w-6 items-center justify-center ${active ? 'text-teal-600' : 'text-gray-700'}`} aria-hidden="true">{icon}</span>
    <span className={`max-w-[80px] truncate text-xs font-medium ${active ? 'text-teal-700' : 'text-gray-500'}`}>{label}</span>
  </button>;
}

'use client';

import type { LucideIcon } from 'lucide-react';

type SidebarMenuItemProps = { label: string; href?: string; Icon: LucideIcon; description?: string; badge?: string | number; onClick?: () => void };
export function SidebarMenuItem({ label, href = '#', Icon, description, badge, onClick }: SidebarMenuItemProps) {
  const content = <><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sultra-mint/60 text-sultra-teal dark:bg-sultra-forest/30"><Icon size={18}/></span><span className="min-w-0 flex-1 text-left"><strong className="block truncate text-sm text-gray-800 dark:text-sultra-sand">{label}</strong>{description && <small className="block truncate text-[10px] text-gray-500 dark:text-sultra-sand/60">{description}</small>}</span>{badge !== undefined && <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">{badge}</span>}</>;
  if (onClick) return <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-sultra-forest/20">{content}</button>;
  return <a href={href} onClick={onClick} className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-sultra-forest/20">{content}</a>;
}

'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

type ExpandableSectionProps = { title: string; children: ReactNode; defaultExpanded?: boolean };
export function ExpandableSection({ title, children, defaultExpanded = false }: ExpandableSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return <section className="border-t border-gray-200 pt-4 dark:border-sultra-forest/30"><button onClick={() => setExpanded(!expanded)} className="flex w-full items-center justify-between px-2 py-2 text-left" aria-expanded={expanded}><span className="text-sm font-semibold text-sultra-forest dark:text-sultra-mint">{title}</span><ChevronDown size={17} className={`text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}/></button><div className={`overflow-hidden transition-all duration-200 ${expanded ? 'mt-1 max-h-[520px] opacity-100' : 'max-h-0 opacity-0'}`}>{children}</div></section>;
}

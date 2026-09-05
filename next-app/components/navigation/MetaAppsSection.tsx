'use client';

import { BriefcaseBusiness, CalendarDays, MessageCircle, Home } from 'lucide-react';
import { SidebarMenuItem } from './SidebarMenuItem';
export function MetaAppsSection() { return <section className="border-t border-gray-200 pt-4 dark:border-sultra-forest/30"><h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Ekosistem SUKI</h2><div className="space-y-0.5"><SidebarMenuItem label="SUKI Chat" href="#chat" Icon={MessageCircle}/><SidebarMenuItem label="SUKI Events" href="#events" Icon={CalendarDays}/><SidebarMenuItem label="SUKI Jobs" href="#jobs" Icon={BriefcaseBusiness} description="Segera hadir"/><SidebarMenuItem label="SUKI Properti" href="#property" Icon={Home}/></div></section>; }

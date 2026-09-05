'use client';

import { CalendarDays, Clapperboard, Plus, ShoppingBag, Users } from 'lucide-react';
import { useState } from 'react';

type Shortcut = { id: string; title: string; href: string; Icon: typeof ShoppingBag };
const defaults: Shortcut[] = [{ id: 'promo', title: 'Promo Belanja', href: '#marketplace', Icon: ShoppingBag }, { id: 'market', title: 'Marketplace', href: '#marketplace', Icon: ShoppingBag }, { id: 'reels', title: 'Reels', href: '#reels', Icon: Clapperboard }, { id: 'groups', title: 'Grup', href: '#groups', Icon: Users }];
export function ShortcutsGrid() {
  const [shortcuts, setShortcuts] = useState(defaults);
  function addShortcut() { setShortcuts(current => current.length >= 6 ? current : [...current, { id: `events-${Date.now()}`, title: 'Acara Lokal', href: '#events', Icon: CalendarDays }]); }
  function removeShortcut(id: string) { setShortcuts(current => current.filter(item => item.id !== id)); }
  return <section><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-sultra-forest dark:text-sultra-mint">Pintasan Anda</h2><button onClick={addShortcut} className="text-xs text-sultra-teal hover:underline">Kelola</button></div><div className="grid grid-cols-2 gap-2">{shortcuts.map(({ id, title, href, Icon }) => <a key={id} href={href} onContextMenu={event => { event.preventDefault(); removeShortcut(id); }} className="group flex flex-col items-center gap-2 rounded-xl p-2 text-center transition-colors hover:bg-gray-100 dark:hover:bg-sultra-forest/20"><span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-sultra-teal to-sultra-forest text-white shadow-sm"><Icon size={22}/></span><span className="line-clamp-2 text-[11px] text-gray-700 dark:text-sultra-sand">{title}</span></a>)}{shortcuts.length < 6 && <button onClick={addShortcut} className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-2 text-center transition-colors hover:border-sultra-teal hover:bg-sultra-mint/20 dark:border-sultra-forest/30"><span className="grid h-12 w-12 place-items-center rounded-xl bg-gray-100 text-gray-500 dark:bg-sultra-forest/20"><Plus size={22}/></span><span className="text-[11px] text-gray-500">Tambah</span></button>}</div><p className="mt-2 text-[9px] text-gray-400">Klik kanan shortcut untuk menghapus.</p></section>;
}

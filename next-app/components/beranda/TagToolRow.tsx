'use client';

import { useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

export type TagToolItem = {
  id: string;
  icon: ReactNode;
  label: string;
  action?: () => void;
};

type TagToolRowProps = {
  items: TagToolItem[];
  selectedTags?: string[];
  onSelectedTagsChange?: (selectedIds: string[]) => void;
};

export function TagToolRow({ items, selectedTags: controlledSelectedTags, onSelectedTagsChange }: TagToolRowProps) {
  const [internalSelectedTags, setInternalSelectedTags] = useState<string[]>(controlledSelectedTags || []);
  const selectedTags = controlledSelectedTags ?? internalSelectedTags;

  function updateSelectedTags(next: string[]) {
    if (controlledSelectedTags === undefined) setInternalSelectedTags(next);
    onSelectedTagsChange?.(next);
  }

  function toggleTag(item: TagToolItem) {
    const next = selectedTags.includes(item.id) ? selectedTags.filter((id) => id !== item.id) : [...selectedTags, item.id];
    updateSelectedTags(next);
    item.action?.();
  }

  function removeTag(id: string) {
    updateSelectedTags(selectedTags.filter((selectedId) => selectedId !== id));
  }

  const selectedItems = items.filter((item) => selectedTags.includes(item.id));

  return <div className="border-b border-gray-100">
    <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Metadata postingan">
      {items.map((item) => { const active = selectedTags.includes(item.id); return <button key={item.id} type="button" aria-pressed={active} onClick={() => toggleTag(item)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border bg-white px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 hover:bg-gray-50 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${active ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-300 text-gray-700'}`}><span className="flex h-4 w-4 items-center justify-center text-base leading-none" aria-hidden="true">{item.icon}</span>{item.label}</button>; })}
    </div>
    {selectedItems.length > 0 && <div className="flex flex-wrap gap-2 px-4 pb-3" aria-label="Metadata terpilih">{selectedItems.map((item) => <span key={item.id} className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"><span>{item.icon}</span>{item.label}<button type="button" onClick={() => removeTag(item.id)} className="ml-0.5 rounded-full p-0.5 hover:bg-teal-100" aria-label={`Hapus ${item.label}`}><X size={12}/></button></span>)}</div>}
  </div>;
}

'use client';

import { BriefcaseBusiness, Building2, Image, Plus, ShoppingBag, Video, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useProfileStore } from '@/store/profile';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { getNavLabels } from '@/lib/i18n/navigation';

type CreateMenuProps = { onCreateStory?: (type?: 'post' | 'reel') => void };

type CreateOption = {
  title: string;
  description: string;
  href?: string;
  Icon: typeof Image;
  available: boolean;
  badge?: string;
  kind?: 'post' | 'reel';
};

export function CreateMenu({ onCreateStory }: CreateMenuProps) {
  const [open, setOpen] = useState(false);
  const { language } = usePreferences();
  const t: Record<string, string> = { ...getCoreLabels(language), ...getNavLabels(language) };
  const role = useProfileStore((state) => state.profile.role);
  const canSell = role === 'seller' || role === 'admin';
  const canHire = role === 'admin';

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = previousOverflow; };
  }, [open]);

  const options: CreateOption[] = [
    { title: t.createStory, description: t.createStoryDesc, Icon: Image, available: true, kind: 'post' },
    { title: t.postVideo, description: t.postVideoDesc, Icon: Video, available: true, kind: 'reel' },
    { title: t.sellMarketplace, description: t.sellMarketplaceDesc, href: '/marketplace/create', Icon: ShoppingBag, available: canSell, badge: t.roleSeller },
    { title: t.propertyListing, description: t.propertyListingDesc, href: '/properti/create', Icon: Building2, available: canSell, badge: t.roleSeller },
    { title: t.openVacancy, description: t.openVacancyDesc, href: '/jobs/create', Icon: BriefcaseBusiness, available: canHire, badge: t.badgeUpgrade },
  ];

  function close() { setOpen(false); }
  function handleCreate(type: 'post' | 'reel') { close(); if (onCreateStory) onCreateStory(type); else window.location.href = `/beranda?compose=${type}`; }

  return <>
    <button type="button" role="button" className="create-fab" onClick={() => setOpen(true)} aria-label={t.createNewContent} aria-haspopup="dialog" aria-expanded={open} title={t.create}><span className="create-fab-surface"><Plus className="create-fab-icon" strokeWidth={2.5} aria-hidden="true" /></span><span className="create-fab-label" aria-hidden="true">{t.create}</span></button>
    {open && <div className="create-modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-modal-title">
        <header className="create-modal-header"><div><span className="eyebrow">SUKI Create</span><h2 id="create-modal-title">{t.createPost}</h2></div><button type="button" className="create-modal-close" onClick={close} aria-label={t.closeAddMenu}><X size={19} /></button></header>
        <div className="create-option-list">{options.map(({ title, description, href, Icon, available, badge, kind }) => available && !href ? <button key={title} type="button" className="create-option" onClick={() => handleCreate(kind ?? 'post')}><span className="create-option-icon"><Icon size={20} aria-hidden="true" /></span><span className="create-option-copy"><strong>{title}</strong><small>{description}</small></span></button> : available && href ? <Link key={title} href={href} className="create-option" onClick={close}><span className="create-option-icon"><Icon size={20} aria-hidden="true" /></span><span className="create-option-copy"><strong>{title}</strong><small>{description}</small></span></Link> : <button key={title} type="button" className="create-option create-option-disabled" disabled aria-disabled="true"><span className="create-option-icon"><Icon size={20} aria-hidden="true" /></span><span className="create-option-copy"><strong>{title}</strong><small>{description}</small></span>{badge && <span className="create-option-badge">{badge}</span>}</button>)}</div>
      </section>
    </div>}
  </>;
}

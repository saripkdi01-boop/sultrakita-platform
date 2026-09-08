'use client';

import { BriefcaseBusiness, Building2, Image, Plus, ShoppingBag, Video, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useProfileStore } from '@/store/profile';

type CreateMenuProps = { onCreateStory?: () => void };

type CreateOption = {
  title: string;
  description: string;
  href?: string;
  Icon: typeof Image;
  available: boolean;
  badge?: string;
};

export function CreateMenu({ onCreateStory }: CreateMenuProps) {
  const [open, setOpen] = useState(false);
  const role = useProfileStore((state) => state.profile.role);
  const canSell = role === 'seller' || role === 'admin';
  const canHire = role === 'admin';

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const options: CreateOption[] = [
    { title: 'Buat Cerita / Status', description: 'Bagikan momen Anda hari ini', href: '/create/story', Icon: Image, available: true },
    { title: 'Posting Video / Reels', description: 'Upload video pendek menarik', href: '/create/reels', Icon: Video, available: true },
    { title: 'Jual di Marketplace', description: 'Tawarkan produk atau jasa Anda', href: '/marketplace/create', Icon: ShoppingBag, available: canSell, badge: 'Seller' },
    { title: 'Listing Properti', description: 'Pasang iklan rumah, tanah, kos', href: '/properti/create', Icon: Building2, available: canSell, badge: 'Seller' },
    { title: 'Buka Lowongan Kerja', description: 'Cari talent terbaik untuk tim Anda', href: '/jobs/create', Icon: BriefcaseBusiness, available: canHire, badge: 'Upgrade' },
  ];

  function close() { setOpen(false); }
  function handleStoryClick() { close(); onCreateStory?.(); }

  return <>
    <button type="button" className="create-fab" onClick={() => setOpen(true)} aria-label="Tambah" aria-haspopup="dialog" aria-expanded={open} title="Tambah"><Plus size={20} strokeWidth={2.5} aria-hidden="true" /></button>
    {open && <div className="create-modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-modal-title">
        <header className="create-modal-header"><div><span className="eyebrow">SUKI Create</span><h2 id="create-modal-title">Buat Postingan</h2></div><button type="button" className="create-modal-close" onClick={close} aria-label="Tutup menu tambah"><X size={19} /></button></header>
        <div className="create-option-list">{options.map(({ title, description, href, Icon, available, badge }) => available && href ? <Link key={title} href={href} className="create-option" onClick={title === 'Buat Cerita / Status' ? handleStoryClick : close}><span className="create-option-icon"><Icon size={20} aria-hidden="true" /></span><span className="create-option-copy"><strong>{title}</strong><small>{description}</small></span></Link> : <button key={title} type="button" className="create-option create-option-disabled" disabled aria-disabled="true"><span className="create-option-icon"><Icon size={20} aria-hidden="true" /></span><span className="create-option-copy"><strong>{title}</strong><small>{description}</small></span>{badge && <span className="create-option-badge">{badge}</span>}</button>)}</div>
      </section>
    </div>}
  </>;
}

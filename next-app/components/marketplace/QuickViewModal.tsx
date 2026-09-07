'use client';

import { ArrowRight, Check, MapPin, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import type { MarketplaceListing } from './MarketplaceCard';

function rupiah(value: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value); }
function conditionLabel(value?: string | null) { return value === 'new' ? 'Baru' : value === 'like_new' ? 'Seperti baru' : value === 'fair' ? 'Cukup baik' : 'Terawat'; }

export function QuickViewModal({ item, onClose }: { item: MarketplaceListing | null; onClose: () => void }) {
  useEffect(() => { if (!item) return; const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; document.addEventListener('keydown', closeOnEscape); return () => document.removeEventListener('keydown', closeOnEscape); }, [item, onClose]);
  if (!item) return null;
  return <div className="marketplace-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="marketplace-quick-modal" role="dialog" aria-modal="true" aria-labelledby="quick-view-title"><button className="marketplace-modal-close" onClick={onClose} aria-label="Tutup quick view"><X size={18} /></button><div className="marketplace-quick-modal-art">{item.thumbnail_url || item.images?.[0] ? <img src={item.thumbnail_url || item.images?.[0]} alt={item.title} /> : <b>{item.title.slice(0, 1)}</b>}</div><div className="marketplace-quick-modal-content"><span className="marketplace-kicker">Detail listing</span><h2 id="quick-view-title">{item.title}</h2><strong>{rupiah(Number(item.price))}</strong><p>{item.description || 'Listing lokal pilihan dari penjual di Sulawesi Tenggara.'}</p><div className="marketplace-quick-meta"><span><MapPin size={14} />{item.district || item.city || 'Sulawesi Tenggara'}</span><span><Check size={14} />{conditionLabel(item.condition)}</span><span><ShieldCheck size={14} />Terverifikasi</span></div><Link href={`/marketplace?listing=${encodeURIComponent(item.id)}`} onClick={onClose}>Lihat detail lengkap <ArrowRight size={15} /></Link></div></section></div>;
}

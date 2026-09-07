'use client';

import { ChevronLeft, ChevronRight, Heart, MapPin, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export type MarketplaceListing = { id: string; title: string; description?: string | null; price: number; images?: string[]; thumbnail_url?: string | null; district?: string | null; city?: string | null; condition?: string | null; is_featured?: boolean; is_demo?: boolean };

function conditionLabel(value?: string | null) { return value === 'new' ? 'Baru' : value === 'like_new' ? 'Seperti baru' : value === 'fair' ? 'Cukup baik' : 'Terawat'; }
function rupiah(value: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value); }

export function MarketplaceCard({ item, saved, onSave, onQuickView, compared, onCompare }: { item: MarketplaceListing; saved: boolean; onSave: (id: string) => void; onQuickView: (item: MarketplaceListing) => void; compared: boolean; onCompare: (item: MarketplaceListing) => void }) {
  const images = (item.images || []).filter(Boolean); const [imageIndex, setImageIndex] = useState(0); const image = images.length ? images[imageIndex] : item.thumbnail_url;
  function moveImage(direction: number) { setImageIndex(index => (index + direction + images.length) % images.length); }
  return <article className="marketplace-card">
    <div className="marketplace-card-image">{image ? <img src={image} alt={`${item.title} — foto ${imageIndex + 1}`} loading="lazy" /> : <div className="marketplace-card-placeholder"><span>{item.is_featured ? 'Pilihan warga Sultra' : 'Produk lokal'}</span><b>{item.title.slice(0, 1)}</b></div>}{images.length > 1 && <><button className="marketplace-carousel-control previous" onClick={() => moveImage(-1)} aria-label="Foto sebelumnya"><ChevronLeft size={15} /></button><button className="marketplace-carousel-control next" onClick={() => moveImage(1)} aria-label="Foto berikutnya"><ChevronRight size={15} /></button><div className="marketplace-carousel-dots" aria-label={`Foto ${imageIndex + 1} dari ${images.length}`}>{images.map((_, index) => <i key={index} className={index === imageIndex ? 'active' : ''} />)}</div></>}{(item.is_featured || item.is_demo) && <span className="marketplace-nearby-badge">Di sekitar</span>}<button className={`marketplace-save ${saved ? 'saved' : ''}`} onClick={() => onSave(item.id)} aria-label={saved ? `Hapus ${item.title} dari tersimpan` : `Simpan ${item.title}`}><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button></div>
    <div className="marketplace-card-body"><div className="marketplace-card-price">{rupiah(Number(item.price))}</div><h2>{item.title}</h2><p className="marketplace-card-meta"><MapPin size={13} />{item.district || item.city || 'Sulawesi Tenggara'}<span aria-hidden="true">·</span>{conditionLabel(item.condition)}</p><div className="marketplace-trust"><ShieldCheck size={13} /> Listing lokal terverifikasi</div><div className="marketplace-card-actions"><button className="marketplace-quick-view-button" onClick={() => onQuickView(item)}>Lihat cepat</button><button className={`marketplace-compare-button ${compared ? 'active' : ''}`} onClick={() => onCompare(item)} aria-pressed={compared}>{compared ? 'Dipilih' : 'Bandingkan'}</button></div></div>
  </article>;
}

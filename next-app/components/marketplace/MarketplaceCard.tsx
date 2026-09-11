'use client';

import { ChevronLeft, ChevronRight, Heart, MapPin, ShieldCheck, Star } from 'lucide-react';
import { useState } from 'react';

export type MarketplaceSeller = {
  name: string;
  verification_status: string;
  rating_average: number;
  rating_count: number;
  avatar_url?: string | null;
};

export type MarketplaceListing = {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  images?: string[];
  thumbnail_url?: string | null;
  district?: string | null;
  city?: string | null;
  condition?: string | null;
  is_featured?: boolean;
  is_demo?: boolean;
  seller_id?: number | null;
  seller?: MarketplaceSeller | null;
};

function conditionLabel(value?: string | null) {
  return value === 'new' ? 'Baru' : value === 'like_new' ? 'Seperti baru' : value === 'fair' ? 'Cukup baik' : 'Terawat';
}

function rupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function sellerIsVerified(seller?: MarketplaceSeller | null) {
  return seller?.verification_status === 'approved';
}

export function MarketplaceCard({ item, saved, onSave, onQuickView, compared, onCompare }: { item: MarketplaceListing; saved: boolean; onSave: (id: string) => void; onQuickView: (item: MarketplaceListing) => void; compared: boolean; onCompare: (item: MarketplaceListing) => void }) {
  const images = (item.images || []).filter(Boolean);
  const [imageIndex, setImageIndex] = useState(0);
  const image = images.length ? images[imageIndex] : item.thumbnail_url;
  const verified = sellerIsVerified(item.seller);
  const rating = Number(item.seller?.rating_average || 0);
  const ratingCount = Number(item.seller?.rating_count || 0);
  const location = item.district || item.city || 'Sulawesi Tenggara';

  function moveImage(direction: number) {
    setImageIndex(index => (index + direction + images.length) % images.length);
  }

  return <article className="marketplace-card group">
    <div className="marketplace-card-image">
      {image ? <img src={image} alt={`${item.title} — foto ${imageIndex + 1}`} loading="lazy" /> : <div className="marketplace-card-placeholder"><span>{item.is_featured ? 'Pilihan warga Sultra' : 'Produk lokal'}</span><b>{item.title.slice(0, 1)}</b></div>}
      <div className="marketplace-card-image-shade" aria-hidden="true" />
      {item.is_featured && <span className="marketplace-card-badge"><Star size={11} fill="currentColor" aria-hidden="true" /> Pilihan warga</span>}
      {images.length > 1 && <>
        <button type="button" className="marketplace-gallery-button marketplace-gallery-prev" onClick={() => moveImage(-1)} aria-label="Foto sebelumnya"><ChevronLeft size={15} /></button>
        <button type="button" className="marketplace-gallery-button marketplace-gallery-next" onClick={() => moveImage(1)} aria-label="Foto berikutnya"><ChevronRight size={15} /></button>
        <div className="marketplace-gallery-dots" aria-label={`Foto ${imageIndex + 1} dari ${images.length}`}>{images.map((_, index) => <i key={index} className={index === imageIndex ? 'active' : ''} />)}</div>
      </>}
      <button type="button" className={`marketplace-save ${saved ? 'saved' : ''}`} onClick={() => onSave(item.id)} aria-label={saved ? `Hapus ${item.title} dari tersimpan` : `Simpan ${item.title}`} aria-pressed={saved}><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="marketplace-card-body">
      <div className="marketplace-card-price">{rupiah(Number(item.price))}</div>
      <h2 title={item.title}>{item.title}</h2>
      <p className="marketplace-card-meta"><MapPin size={13} aria-hidden="true" /><span>{location}</span><span aria-hidden="true">·</span><span>{conditionLabel(item.condition)}</span></p>
      <div className="seller-trust-row" aria-label={`Informasi kepercayaan penjual ${item.seller?.name || 'Penjual lokal'}`}>
        <div className="seller-avatar">{item.seller?.avatar_url ? <img src={item.seller.avatar_url} alt="" /> : <span>{(item.seller?.name || 'PL').slice(0, 2).toUpperCase()}</span>}</div>
        <div className="seller-trust-copy"><strong>{item.seller?.name || 'Penjual lokal'}</strong><span>{verified ? <><ShieldCheck size={12} aria-hidden="true" /> Terverifikasi</> : 'Profil belum terverifikasi'}</span></div>
        {ratingCount > 0 ? <div className="seller-rating" aria-label={`Rating ${rating.toFixed(1)} dari 5 dari ${ratingCount} ulasan`}><Star size={13} fill="currentColor" aria-hidden="true" /><b>{rating.toFixed(1)}</b><small>({ratingCount})</small></div> : <small className="seller-rating-empty">Belum ada ulasan</small>}
      </div>
      <div className={`marketplace-trust ${verified ? 'is-verified' : ''}`}>{verified ? <><ShieldCheck size={13} aria-hidden="true" /> Identitas seller disetujui</> : <><ShieldCheck size={13} aria-hidden="true" /> Trust data belum tersedia</>}</div>
      <div className="marketplace-card-actions">
        <button type="button" className="marketplace-card-primary" onClick={() => onQuickView(item)}>Lihat cepat</button>
        <button type="button" className={`marketplace-card-secondary ${compared ? 'active' : ''}`} onClick={() => onCompare(item)} aria-pressed={compared}>{compared ? 'Dipilih' : 'Bandingkan'}</button>
      </div>
    </div>
  </article>;
}

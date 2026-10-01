'use client';

import { ArrowRight, BadgeCheck, Check, ChevronLeft, ChevronRight, Heart, MapPin, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { PublicListing } from '@/lib/listings-query';
import { sellerRatingText, sellerTier } from '@/lib/seller-trust';
import { SafeImage } from './SafeImage';

// Fase 2: quick view dengan galeri multi-foto + info penjual jujur
// (tier dari data nyata + tautan ke etalase toko).

export function QuickViewModal({ listing, saved = false, onToggleWishlist, onClose }: { listing: PublicListing | null; saved?: boolean; onToggleWishlist?: () => void; onClose: () => void }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    setPhotoIndex(0);
    if (!listing) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = previous; };
  }, [listing, onClose]);

  if (!listing) return null;
  const images = Array.isArray(listing.images) && listing.images.length > 0 ? listing.images : listing.thumbnail_url ? [listing.thumbnail_url] : [];
  const image = images[Math.min(photoIndex, images.length - 1)];
  const price = Math.trunc(Number(listing.price) || 0);
  const priceText = price > 0 ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price) : 'Harga hubungi penjual';
  const tier = sellerTier(listing.seller);
  const ratingText = sellerRatingText(listing.seller);
  const district = typeof listing.district === 'string' ? listing.district : '';
  const description = typeof listing.description === 'string' ? listing.description : '';

  return (
    <div className="quick-view-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="quick-view" role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
        <button type="button" className="quick-view-close" onClick={onClose} aria-label="Tutup pratinjau"><X size={18} /></button>
        <div className="quick-view-media">
          {image ? <SafeImage src={image} alt={listing.title} priority /> : <div className="mp-card-image-empty" aria-hidden="true">📦</div>}
          {images.length > 1 && (
            <>
              <button type="button" className="mp-card-gallery-nav mp-card-gallery-prev" onClick={() => setPhotoIndex((i) => (i - 1 + images.length) % images.length)} aria-label="Foto sebelumnya"><ChevronLeft size={16} aria-hidden="true" /></button>
              <button type="button" className="mp-card-gallery-nav mp-card-gallery-next" onClick={() => setPhotoIndex((i) => (i + 1) % images.length)} aria-label="Foto berikutnya"><ChevronRight size={16} aria-hidden="true" /></button>
              <div className="quick-view-thumbs" role="group" aria-label="Pilih foto">
                {images.slice(0, 6).map((src, thumb) => (
                  <button key={thumb} type="button" className={`quick-view-thumb${thumb === photoIndex ? ' active' : ''}`} onClick={() => setPhotoIndex(thumb)} aria-label={`Foto ${thumb + 1}`} aria-pressed={thumb === photoIndex}>
                    <SafeImage src={src} alt="" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="quick-view-body">
          <h2 id="quick-view-title">{listing.title}</h2>
          <p className="quick-view-price">{priceText}</p>
          {description && <p className="quick-view-description">{description.slice(0, 220)}{description.length > 220 ? '…' : ''}</p>}
          {listing.seller && (
            <Link href={`/marketplace/toko/${encodeURIComponent(String(listing.seller.id ?? ''))}`} className="quick-view-seller">
              <span>{listing.seller.name}</span>
              {tier && <span className={`mp-badge mp-badge-tier mp-badge-tier-${tier.kind}`}><BadgeCheck size={12} aria-hidden="true" /> {tier.label}</span>}
              {ratingText && <span className="mp-card-rating">★ {ratingText}</span>}
            </Link>
          )}
          <p className="quick-view-meta">
            {district && <span><MapPin size={13} aria-hidden="true" /> {district}</span>}
            <span><Check size={13} aria-hidden="true" /> Stok tersedia</span>
          </p>
          <div className="quick-view-actions">
            <Link href={`/marketplace/${encodeURIComponent(String(listing.id))}`} className="quick-view-primary">Lihat detail <ArrowRight size={15} aria-hidden="true" /></Link>
            {onToggleWishlist && (
              <button type="button" className={`quick-view-wishlist${saved ? ' saved' : ''}`} onClick={onToggleWishlist} aria-pressed={saved} aria-label={saved ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}>
                <Heart size={16} aria-hidden="true" fill={saved ? 'currentColor' : 'none' } /> {saved ? 'Tersimpan' : 'Simpan'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

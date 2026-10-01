'use client';

import { BadgeCheck, ChevronLeft, ChevronRight, Heart, MapPin, Scale, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { PublicListing } from '@/lib/listings-query';
import { sellerRatingText, sellerTier } from '@/lib/seller-trust';
import { SafeImage } from './SafeImage';

// Tipe kanonis listing publik — diimpor komponen marketplace lain dari sini.
export type MarketplaceListing = PublicListing;

// Fase 2.2: kartu listing kelas dunia.
// - next/image lazy + ukuran responsif, anti-CLS (container aspect rasio tetap)
// - Harga diformat Intl id-ID IDR (tidak ada harga 0 yang diada-ada)
// - Chip penjual + rating asli; badge kondisi; badge tier dari data nyata
// - Galeri multi-foto (swipe/klik) bila listing punya >1 foto
// - Hover lift hanya untuk perangkat dengan hover (mobile tidak nempel)

const conditionLabels: Record<string, string> = { new: 'Baru', like_new: 'Seperti baru', good: 'Bekas baik', fair: 'Bekas layak' };

type Props = {
  listing: PublicListing;
  index?: number;
  saved?: boolean;
  inCompare?: boolean;
  onToggleWishlist?: () => void;
  onQuickView?: () => void;
  onCompare?: () => void;
};

export function MarketplaceCard({ listing, index = 0, saved = false, inCompare = false, onToggleWishlist, onQuickView, onCompare }: Props) {
  const id = String(listing.id);
  const images = Array.isArray(listing.images) && listing.images.length > 0 ? listing.images : listing.thumbnail_url ? [listing.thumbnail_url] : [];
  const [photoIndex, setPhotoIndex] = useState(0);
  const image = images[Math.min(photoIndex, images.length - 1)];
  const price = Math.trunc(Number(listing.price) || 0);
  const priceText = price > 0 ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price) : 'Harga hubungi penjual';
  const tier = sellerTier(listing.seller);
  const ratingText = sellerRatingText(listing.seller);
  const district = typeof listing.district === 'string' ? listing.district : '';
  const createdAt = typeof listing.created_at === 'string' ? new Date(listing.created_at) : null;
  const isRecent = createdAt ? Date.now() - createdAt.getTime() < 72 * 60 * 60 * 1000 : false;

  return (
    <article className="mp-card" aria-label={listing.title}>
      <div className="mp-card-media">
        <Link href={`/marketplace/${encodeURIComponent(id)}`} className="mp-card-image-link" aria-label={`Lihat detail ${listing.title}`}>
          {image ? (
            <SafeImage src={image} alt={listing.title} priority={index < 4} />
          ) : (
            <div className="mp-card-image-empty" aria-hidden="true">📦</div>
          )}
        </Link>
        <div className="mp-card-badges">
          {listing.condition && conditionLabels[listing.condition] && <span className="mp-badge mp-badge-condition">{conditionLabels[listing.condition]}</span>}
          {listing.is_featured ? <span className="mp-badge mp-badge-featured">Pilihan</span> : isRecent ? <span className="mp-badge mp-badge-new">Baru</span> : null}
        </div>
        <button type="button" className={`mp-card-wishlist${saved ? ' saved' : ''}`} onClick={onToggleWishlist} aria-pressed={saved} aria-label={saved ? `Hapus ${listing.title} dari wishlist` : `Simpan ${listing.title} ke wishlist`}>
          <Heart size={17} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
        </button>
        {images.length > 1 && (
          <>
            <button type="button" className="mp-card-gallery-nav mp-card-gallery-prev" onClick={() => setPhotoIndex((i) => (i - 1 + images.length) % images.length)} aria-label="Foto sebelumnya">
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button type="button" className="mp-card-gallery-nav mp-card-gallery-next" onClick={() => setPhotoIndex((i) => (i + 1) % images.length)} aria-label="Foto berikutnya">
              <ChevronRight size={16} aria-hidden="true" />
            </button>
            <div className="mp-card-dots" aria-hidden="true">
              {images.slice(0, 5).map((_, dot) => <span key={dot} className={dot === photoIndex ? 'active' : ''} />)}
            </div>
          </>
        )}
      </div>

      <div className="mp-card-body">
        <Link href={`/marketplace/${encodeURIComponent(id)}`} className="mp-card-title">{listing.title}</Link>
        <p className="mp-card-price">{priceText}</p>

        {listing.seller && (
          <Link href={`/marketplace/toko/${encodeURIComponent(String(listing.seller.id ?? ''))}`} className="mp-card-seller" aria-label={`Lihat toko ${listing.seller.name}`}>
            <span className="mp-card-seller-name">{listing.seller.name}</span>
            {tier && (
              <span className={`mp-badge mp-badge-tier mp-badge-tier-${tier.kind}`}>
                <BadgeCheck size={12} aria-hidden="true" /> {tier.label}
              </span>
            )}
            {ratingText && <span className="mp-card-rating">★ {ratingText}</span>}
          </Link>
        )}

        <p className="mp-card-meta">
          {district && <span><MapPin size={12} aria-hidden="true" /> {district}</span>}
          {createdAt && <time dateTime={createdAt.toISOString()}>{createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</time>}
        </p>

        <div className="mp-card-actions">
          {onQuickView && <button type="button" className="mp-card-action" onClick={onQuickView}><Zap size={14} aria-hidden="true" /> Lihat cepat</button>}
          {onCompare && <button type="button" className={`mp-card-action${inCompare ? ' active' : ''}`} onClick={onCompare} aria-pressed={inCompare}><Scale size={14} aria-hidden="true" /> Bandingkan</button>}
        </div>
      </div>
    </article>
  );
}

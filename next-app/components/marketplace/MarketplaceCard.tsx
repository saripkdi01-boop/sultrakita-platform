'use client';

import { BadgeCheck, Heart, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import type { PublicListing } from '@/lib/listings-query';
import { sellerRatingText, sellerTier } from '@/lib/seller-trust';
import { SafeImage } from './SafeImage';
import { discountPercent } from './promo';
import { usePreferences } from '@/lib/preferences';
import { getMarketplaceLabels } from '@/lib/i18n/dict-marketplace';

// Tipe kanonis listing publik — diimpor komponen marketplace lain dari sini.
export type MarketplaceListing = PublicListing;

// Kartu ala Facebook Marketplace + pola Amazon/Rakuten:
// - Gambar kotak 1:1, flat tanpa border/shadow (hover halus khusus device hover)
// - Harga BOLD besar, judul 2-baris clamp, lokasi kecil abu
// - Badge kondisi kecil di pojok gambar; "Pilihan SUKI" hanya dari is_featured nyata
// - Hati wishlist melayang di pojok kanan atas gambar
// - Amazon: bintang rating HANYA dari data nyata (rating_count > 0)
// - Rakuten: baris toko menonjol (inisial + nama + badge tier nyata) -> /marketplace/toko/[id]
// - Kartu bersih: tanpa tombol Lihat cepat/Bandingkan (pindah ke QuickViewModal)
// - Klik gambar/judul membuka quick view (?listing= deep link tetap didukung)

function rupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

type Props = {
  listing: PublicListing;
  index?: number;
  saved?: boolean;
  onToggleWishlist?: () => void;
  onQuickView?: () => void;
};

export function MarketplaceCard({ listing, index = 0, saved = false, onToggleWishlist, onQuickView }: Props) {
  const { language } = usePreferences();
  const mp = getMarketplaceLabels(language);
  const conditionLabels: Record<string, string> = { new: mp.mpCondNew, like_new: mp.mpCondLikeNew, good: mp.mpCondGoodShort, fair: mp.mpCondFairShort };
  const id = String(listing.id);
  const images = Array.isArray(listing.images) && listing.images.length > 0 ? listing.images : listing.thumbnail_url ? [listing.thumbnail_url] : [];
  const image = images[0];
  const price = Math.trunc(Number(listing.price) || 0);
  const priceText = price > 0 ? rupiah(price) : mp.mpContactSellerPrice;
  const tier = sellerTier(listing.seller);
  const ratingText = sellerRatingText(listing.seller);
  const ratingAverage = Number(listing.seller?.rating_average || 0);
  const ratingCount = Number(listing.seller?.rating_count || 0);
  const district = typeof listing.district === 'string' ? listing.district : '';
  const createdAt = typeof listing.created_at === 'string' ? new Date(listing.created_at) : null;
  const sellerId = listing.seller?.id != null ? String(listing.seller.id) : '';
  // Badge promo "-X%" ala Shopee — hanya dari original_price nyata.
  const discount = discountPercent(listing);

  const media = (
    <>
      {image ? <SafeImage src={image} alt={listing.title} priority={index < 4} /> : <div className="fbm-card-empty" aria-hidden="true">📦</div>}
      <div className="fbm-card-badges">
        {discount > 0 && <span className="fbm-badge fbm-badge-discount" aria-label={mp.mpDiscountPercent.replace('{n}', String(discount))}>-{discount}%</span>}
        {listing.condition && conditionLabels[listing.condition] && <span className="fbm-badge fbm-badge-condition">{conditionLabels[listing.condition]}</span>}
        {listing.is_featured ? <span className="fbm-badge fbm-badge-featured">{mp.mpFeaturedPick}</span> : null}
      </div>
    </>
  );

  return (
    <article className="fbm-card" aria-label={listing.title}>
      <div className="fbm-card-media">
        {onQuickView ? (
          <button type="button" className="fbm-card-media-btn" onClick={onQuickView} aria-label={`${mp.mpView} ${listing.title}`}>
            {media}
          </button>
        ) : (
          media
        )}
        {onToggleWishlist && (
          <button
            type="button"
            className={`fbm-card-wishlist${saved ? ' saved' : ''}`}
            onClick={onToggleWishlist}
            aria-pressed={saved}
            aria-label={saved ? mp.mpRemoveFromWishlistTitle.replace('{title}', listing.title) : mp.mpSaveToWishlistTitle.replace('{title}', listing.title)}
          >
            <Heart size={17} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="fbm-card-body">
        <p className="fbm-card-price">{priceText}</p>
        {onQuickView ? (
          <button type="button" className="fbm-card-title" onClick={onQuickView}>{listing.title}</button>
        ) : (
          <p className="fbm-card-title">{listing.title}</p>
        )}

        {ratingCount > 0 && ratingText && (
          <span className="fbm-stars" aria-label={mp.mpSellerRating.replace('{rating}', ratingText)}>
            <span className="fbm-stars-icons" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={12} className={star <= Math.round(ratingAverage) ? '' : 'off'} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            {ratingText}
          </span>
        )}

        {listing.seller && sellerId && (
          <Link href={`/marketplace/toko/${encodeURIComponent(sellerId)}`} className="fbm-card-shop" aria-label={`${mp.mpVisitStore} ${listing.seller.name}`}>
            <span className="fbm-shop-avatar" aria-hidden="true">
              {listing.seller.avatar_url ? <img src={listing.seller.avatar_url} alt="" loading="lazy" /> : listing.seller.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="fbm-shop-name">{listing.seller.name}</span>
            {tier && (
              <span className={`fbm-tier fbm-tier-${tier.kind}`}>
                <BadgeCheck size={11} aria-hidden="true" /> {tier.label}
              </span>
            )}
          </Link>
        )}

        <p className="fbm-card-meta">
          {district && <span><MapPin size={12} aria-hidden="true" /> {district}</span>}
          {createdAt && <time dateTime={createdAt.toISOString()}>{createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</time>}
        </p>
      </div>
    </article>
  );
}

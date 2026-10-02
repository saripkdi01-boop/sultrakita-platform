'use client';

import { ArrowRight, BadgeCheck, Check, ChevronLeft, ChevronRight, Heart, MapPin, Scale, Store, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { PublicListing } from '@/lib/listings-query';
import { sellerRatingText, sellerTier } from '@/lib/seller-trust';
import { reportListing } from '@/lib/actions/reports';
import { ReportButton } from '@/components/moderation/ReportButton';
import { SafeImage } from './SafeImage';
import { discountPercent, originalPriceValue } from './promo';

// Quick view — galeri multi-foto + info penjual jujur (tier dari data nyata
// + tautan ke etalase toko). Aksi "Bandingkan" pindah ke sini agar kartu
// listing tetap bersih ala FB. Tautan detail lama (/marketplace/{id})
// diganti "Kunjungi toko" karena rute detail per listing tidak ada.
// Slice 1 (program 4-jam): rail "Produk serupa" ala Shopee/Amazon di dalam
// quick view (pola discovery terpenting di halaman detail produk) + badge
// promo "-X%" & harga coret HANYA dari original_price nyata.

function rupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

type Props = {
  listing: PublicListing | null;
  saved?: boolean;
  inCompare?: boolean;
  onToggleWishlist?: () => void;
  onToggleCompare?: () => void;
  onClose: () => void;
  // Produk serupa (dihitung parent dari listing yang sudah dimuat — tanpa fetch tambahan).
  similar?: PublicListing[];
  onSelectSimilar?: (item: PublicListing) => void;
};

export function QuickViewModal({ listing, saved = false, inCompare = false, onToggleWishlist, onToggleCompare, onClose, similar = [], onSelectSimilar }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPhotoIndex(0);
    bodyRef.current?.scrollTo({ top: 0 });
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
  const priceText = price > 0 ? rupiah(price) : 'Harga hubungi penjual';
  const discount = discountPercent(listing);
  const original = originalPriceValue(listing);
  // Stok jujur: tampilkan hanya bila kolom stock_quantity tersedia di DB.
  // Tanpa klaim "Stok tersedia" bila datanya tidak ada.
  const stock = typeof listing.stock_quantity === 'number' ? Math.trunc(listing.stock_quantity) : null;
  const tier = sellerTier(listing.seller);
  const ratingText = sellerRatingText(listing.seller);
  const district = typeof listing.district === 'string' ? listing.district : '';
  const description = typeof listing.description === 'string' ? listing.description : '';
  const sellerId = listing.seller?.id != null ? String(listing.seller.id) : '';

  return (
    <div className="fbm-qv-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="fbm-qv" role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
        <button type="button" className="fbm-qv-close" onClick={onClose} aria-label="Tutup pratinjau"><X size={18} aria-hidden="true" /></button>
        <div className="fbm-qv-media">
          {image ? <SafeImage src={image} alt={listing.title} priority /> : <div className="fbm-card-empty" aria-hidden="true">📦</div>}
          {images.length > 1 && (
            <>
              <button type="button" className="fbm-card-gallery-nav fbm-card-gallery-prev" onClick={() => setPhotoIndex((i) => (i - 1 + images.length) % images.length)} aria-label="Foto sebelumnya"><ChevronLeft size={16} aria-hidden="true" /></button>
              <button type="button" className="fbm-card-gallery-nav fbm-card-gallery-next" onClick={() => setPhotoIndex((i) => (i + 1) % images.length)} aria-label="Foto berikutnya"><ChevronRight size={16} aria-hidden="true" /></button>
              <div className="fbm-qv-thumbs" role="group" aria-label="Pilih foto">
                {images.slice(0, 6).map((src, thumb) => (
                  <button key={thumb} type="button" className={`fbm-qv-thumb${thumb === photoIndex ? ' active' : ''}`} onClick={() => setPhotoIndex(thumb)} aria-label={`Foto ${thumb + 1}`} aria-pressed={thumb === photoIndex}>
                    <SafeImage src={src} alt="" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="fbm-qv-body" ref={bodyRef}>
          <h2 id="quick-view-title">{listing.title}</h2>
          <p className="fbm-qv-price">
            {priceText}
            {discount > 0 && (
              <span className="fbm-qv-discount">
                <s className="fbm-qv-original">{rupiah(original)}</s>
                <span className="fbm-badge fbm-badge-discount">-{discount}%</span>
              </span>
            )}
          </p>
          {description && <p className="fbm-qv-desc">{description.slice(0, 220)}{description.length > 220 ? '…' : ''}</p>}
          {listing.seller && sellerId && (
            <Link href={`/marketplace/toko/${encodeURIComponent(sellerId)}`} className="fbm-qv-shop" aria-label={`Kunjungi toko ${listing.seller.name}`}>
              <span className="fbm-shop-avatar" aria-hidden="true">
                {listing.seller.avatar_url ? <img src={listing.seller.avatar_url} alt="" loading="lazy" /> : listing.seller.name.slice(0, 1).toUpperCase()}
              </span>
              <span>{listing.seller.name}</span>
              {tier && <span className={`fbm-tier fbm-tier-${tier.kind}`}><BadgeCheck size={11} aria-hidden="true" /> {tier.label}</span>}
              {ratingText && <span className="fbm-stars">★ {ratingText}</span>}
            </Link>
          )}
          <p className="fbm-qv-meta">
            {district && <span><MapPin size={13} aria-hidden="true" /> {district}</span>}
            {stock !== null && (stock > 0
              ? <span><Check size={13} aria-hidden="true" /> Stok: {stock} tersedia</span>
              : <span className="fbm-qv-outofstock">Stok habis</span>)}
          </p>
          <div className="fbm-qv-actions">
            {sellerId ? (
              <Link href={`/marketplace/toko/${encodeURIComponent(sellerId)}`} className="fbm-qv-primary">
                <Store size={15} aria-hidden="true" /> Kunjungi toko <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ) : null}
            {onToggleWishlist && (
              <button type="button" className={`fbm-qv-secondary${saved ? ' saved' : ''}`} onClick={onToggleWishlist} aria-pressed={saved} aria-label={saved ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}>
                <Heart size={16} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Tersimpan' : 'Simpan'}
              </button>
            )}
            {onToggleCompare && (
              <button type="button" className={`fbm-qv-secondary${inCompare ? ' active' : ''}`} onClick={onToggleCompare} aria-pressed={inCompare} aria-label={inCompare ? 'Hapus dari perbandingan' : 'Tambah ke perbandingan'}>
                <Scale size={16} aria-hidden="true" /> {inCompare ? 'Dibandingkan' : 'Bandingkan'}
              </button>
            )}
            <ReportButton
              className="fbm-qv-secondary"
              onReport={(reason) => reportListing(String(listing.id), reason, sellerId || undefined)}
            />
          </div>

          {similar.length > 0 && onSelectSimilar && (
            <section className="fbm-qv-similar" aria-labelledby="qv-similar-heading">
              <h3 id="qv-similar-heading">Produk serupa</h3>
              <div className="fbm-qv-similar-rail">
                {similar.map((item) => {
                  const itemPrice = Math.trunc(Number(item.price) || 0);
                  const itemImages = Array.isArray(item.images) && item.images.length > 0 ? item.images : item.thumbnail_url ? [item.thumbnail_url] : [];
                  return (
                    <button
                      key={String(item.id)}
                      type="button"
                      className="fbm-qv-similar-card"
                      onClick={() => onSelectSimilar(item)}
                      aria-label={`Lihat ${item.title}`}
                    >
                      <span className="fbm-qv-similar-art">
                        {itemImages[0] ? <SafeImage src={itemImages[0]} alt="" /> : <span aria-hidden="true">📦</span>}
                      </span>
                      <strong>{itemPrice > 0 ? rupiah(itemPrice) : 'Hubungi penjual'}</strong>
                      <span className="fbm-qv-similar-title">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { PublicListing } from '@/lib/listings-query';
import { MarketplaceCard } from '@/components/marketplace/MarketplaceCard';
import { LoginSheet } from '@/components/marketplace/LoginSheet';
import { useWishlist } from '@/components/marketplace/useWishlist';

// Grid listing etalase toko — reuse kartu + wishlist yang sama dengan halaman utama.

export function TokoListings({ items }: { items: PublicListing[] }) {
  const wishlist = useWishlist();
  const [notice, setNotice] = useState('');
  if (items.length === 0) return <p className="toko-empty">Toko ini belum memasang listing aktif.</p>;
  return (
    <>
      <div className="marketplace-grid">
        {items.map((item, index) => (
          <MarketplaceCard
            key={String(item.id)}
            listing={item}
            index={index}
            saved={wishlist.savedIds.includes(String(item.id))}
            onToggleWishlist={() => { void wishlist.toggle(String(item.id)); }}
          />
        ))}
      </div>
      <LoginSheet open={wishlist.loginSheetOpen} onClose={() => wishlist.setLoginSheetOpen(false)} />
      {notice && <p role="status">{notice}</p>}
    </>
  );
}

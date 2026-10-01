import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BadgeCheck } from 'lucide-react';
import { fetchPublicListings, fetchSellerProfile } from '@/lib/listings-query';
import { sellerTier, sellerRatingText } from '@/lib/seller-trust';
import { SafeImage } from '@/components/marketplace/SafeImage';
import { AppLayout } from '@/components/layout/AppLayout';
import { TokoListings } from './toko-listings';

// Fase 2.5: etalase toko publik — profil penjual + semua listing aktifnya.
// Badge kepercayaan DITURUNKAN dari data (bukan klaim manual).

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const profile = await fetchSellerProfile(decodeURIComponent(id));
  const name = profile.ok ? profile.seller.name : 'Toko';
  const title = `${name} | Toko di SUKI Marketplace`;
  const description = `Lihat semua produk dari ${name} di SUKI Marketplace, Sulawesi Tenggara.`;
  const canonical = `${siteUrl}/marketplace/toko/${encodeURIComponent(id)}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: 'profile', url: canonical, siteName: 'SUKI Apps', locale: 'id_ID' },
  };
}

export default async function TokoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sellerId = decodeURIComponent(id);
  const [profile, listings] = await Promise.all([
    fetchSellerProfile(sellerId),
    fetchPublicListings({ sellerId, limit: 50, sort: 'terbaru' }),
  ]);
  if (!profile.ok) notFound();
  const seller = profile.seller;
  const tier = sellerTier(seller);
  const ratingText = sellerRatingText(seller);
  const items = listings.ok && 'items' in listings ? listings.items : [];

  return (
    <AppLayout>
    <main className="toko-page">
      <header className="toko-header">
        <div className="toko-avatar">
          {seller.avatar_url ? <SafeImage src={seller.avatar_url} alt={seller.name} /> : <span aria-hidden="true">{seller.name.slice(0, 1).toUpperCase()}</span>}
        </div>
        <div className="toko-header-copy">
          <h1>{seller.name}</h1>
          <div className="toko-trust">
            {tier && (
              <span className={`mp-badge mp-badge-tier mp-badge-tier-${tier.kind}`}>
                <BadgeCheck size={13} aria-hidden="true" /> {tier.label}
              </span>
            )}
            {ratingText ? <span className="toko-rating">★ {ratingText} ulasan</span> : <span className="toko-rating-muted">Belum ada ulasan</span>}
          </div>
          <p className="toko-count">{items.length} listing aktif</p>
        </div>
      </header>
      <section aria-label={`Listing dari ${seller.name}`}>
        <TokoListings items={items} />
      </section>
    </main>
    </AppLayout>
  );
}

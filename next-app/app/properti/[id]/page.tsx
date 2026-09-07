import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Bed, Bath, Building2, CheckCircle2, Eye, Heart, MapPin, Maximize } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getPublicPropertyById } from '@/lib/actions/property-public';
import { PropertyInquiryForm } from '@/components/property/PropertyInquiryForm';

function rupiah(value: number) {
  return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value)}`;
}

function formatPriceType(value?: string) {
  if (!value || value === 'total') return '';
  return ` / ${value.replace('per_', '')}`;
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let property: any;
  try {
    property = await getPublicPropertyById(id);
  } catch {
    notFound();
  }

  if (!property) notFound();

  const images = Array.isArray(property.images) ? property.images.filter(Boolean) : [];
  const sellerName = property.seller?.full_name || 'Seller SultraKita';

  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-6xl px-4 py-6 md:px-8">
        <Link href="/properti" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-sultra-teal hover:text-sultra-forest">
          <ArrowLeft size={16} /> Kembali ke properti
        </Link>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <section>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sultra-mint to-sultra-sand">
              {images[0] ? <img src={images[0]} alt={property.title} className="aspect-[4/3] h-full w-full object-cover" /> : <div className="grid aspect-[4/3] place-items-center font-semibold text-sultra-forest">Hunian pilihan Sultra</div>}
              {property.is_demo && <span className="absolute left-4 top-4 rounded-full bg-slate-700/90 px-3 py-1.5 text-xs font-bold text-white">Demo</span>}
              {(property.is_bank_verified || property.is_admin_verified) && <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-sultra-gold px-3 py-1.5 text-xs font-bold text-white"><CheckCircle2 size={14} /> Terverifikasi</span>}
            </div>
            {images.length > 1 && <div className="mt-3 grid grid-cols-4 gap-2">{images.slice(0, 4).map((image: string) => <img key={image} src={image} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />)}</div>}
          </section>
          <section className="rounded-3xl border border-sultra-mint bg-white p-6 shadow-soft dark:border-sultra-forest/30 dark:bg-sultra-dark">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-sultra-teal">{property.category || 'Properti'}</p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-sultra-forest dark:text-sultra-sand">{property.title}</h1>
            <p className="mt-4 text-2xl font-bold text-sultra-forest dark:text-sultra-mint">{rupiah(Number(property.price))}<span className="text-sm font-normal text-sultra-teal">{formatPriceType(property.price_type)}</span></p>
            <p className="mt-3 flex items-center gap-2 text-sm text-sultra-teal"><MapPin size={16} /> {property.district}, {property.city || 'Sulawesi Tenggara'}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-sultra-forest dark:text-sultra-sand">
              {property.building_area_sqm && <span className="flex items-center gap-2"><Maximize size={16} /> {property.building_area_sqm} m²</span>}
              {property.bedrooms !== undefined && <span className="flex items-center gap-2"><Bed size={16} /> {property.bedrooms} kamar</span>}
              {property.bathrooms !== undefined && <span className="flex items-center gap-2"><Bath size={16} /> {property.bathrooms} kamar mandi</span>}
              <span className="flex items-center gap-2"><Eye size={16} /> {property.views_count || 0} dilihat</span>
            </div>
            <div className="mt-7 border-t border-sultra-mint pt-5 dark:border-sultra-forest/30">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-sultra-teal">Seller</p>
              <p className="mt-2 font-semibold text-sultra-forest dark:text-sultra-sand">{sellerName}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/login?redirect=/properti/${id}`} className="inline-flex items-center gap-2 rounded-xl bg-sultra-teal px-4 py-3 text-sm font-semibold text-white"><Heart size={16} /> Simpan</Link>
              <PropertyInquiryForm propertyId={id} />
            </div>
          </section>
        </div>
        <section className="mt-6 rounded-3xl border border-sultra-mint bg-white p-6 dark:border-sultra-forest/30 dark:bg-sultra-dark">
          <div className="flex items-center gap-2 text-sultra-forest dark:text-sultra-sand"><Building2 size={18} /><h2 className="text-lg font-bold">Deskripsi properti</h2></div>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">{property.description || 'Deskripsi properti belum tersedia.'}</p>
        </section>
      </main>
    </AppLayout>
  );
}

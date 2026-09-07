import { ArrowRight, Clock3, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';
import type { MarketplaceListing } from './MarketplaceCard';

function rupiah(value: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value); }

export function DealOfTheDay({ items }: { items: MarketplaceListing[] }) {
  const deals = items.filter(item => item.is_featured).slice(0, 3);
  if (!deals.length) return null;
  return <section className="marketplace-deals" aria-labelledby="deals-heading"><div className="marketplace-deals-head"><div><span className="marketplace-kicker"><Sparkles size={13} /> Penawaran pilihan</span><h2 id="deals-heading">Deal of the Day</h2><p>Harga spesial dari penjual lokal Sultra.</p></div><Link href="/marketplace?deal=day">Lihat semua <ArrowRight size={14} /></Link></div><div className="marketplace-deals-grid">{deals.map(item => <Link href={`/marketplace?listing=${encodeURIComponent(item.id)}`} className="marketplace-deal-card" key={item.id}><div className="marketplace-deal-art">{item.images?.[0] ? <img src={item.images[0]} alt="" loading="lazy" /> : <Tag size={25} />}</div><div><b>{item.title}</b><strong>{rupiah(Number(item.price))}</strong><small><Clock3 size={11} /> Berakhir hari ini</small></div></Link>)}</div></section>;
}

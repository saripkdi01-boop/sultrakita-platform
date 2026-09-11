import { Bookmark, CalendarDays, Car, ChevronRight, Home, Laptop, MoreHorizontal, Shirt, Sofa, UsersRound } from 'lucide-react';

const popular = [{ label: 'Kendaraan', Icon: Car }, { label: 'Properti', Icon: Home }, { label: 'Elektronik', Icon: Laptop }, { label: 'Pakaian', Icon: Shirt }, { label: 'Perabotan', Icon: Sofa }, { label: 'Lainnya', Icon: MoreHorizontal }];
const quick = [{ label: 'Grup jual beli', Icon: UsersRound }, { label: 'Acara penjualan', Icon: CalendarDays }, { label: 'Item tersimpan', Icon: Bookmark }];

export function CategoryBrowser() {
  return <aside className="marketplace-category-browser" aria-labelledby="marketplace-explore-heading">
    <div className="marketplace-category-heading marketplace-explore-heading"><div><span className="marketplace-category-kicker">Temukan lebih cepat</span><h2 id="marketplace-explore-heading">Jelajahi marketplace</h2></div><a href="/marketplace/categories" className="marketplace-explore-all">Lihat semua</a></div>
    <div className="marketplace-quick-links" aria-label="Akses cepat marketplace">{quick.map(({ label, Icon }) => <button key={label} type="button" onClick={() => { window.location.hash = label.toLowerCase().replaceAll(' ', '-'); }}><span className="marketplace-quick-icon"><Icon size={16} strokeWidth={2} /></span><span className="marketplace-quick-label">{label}</span><ChevronRight className="marketplace-quick-arrow" size={14} aria-hidden="true" /></button>)}</div>
    <div className="marketplace-category-section"><div className="marketplace-category-heading"><h3>Kategori populer</h3><a href="/marketplace/categories">Semua kategori</a></div><div className="marketplace-popular-grid">{popular.map(({ label, Icon }) => <a key={label} href={`/marketplace?category=${encodeURIComponent(label)}`}><span><Icon size={17} strokeWidth={2} /></span><b>{label}</b></a>)}</div></div>
  </aside>;
}

import { Bookmark, CalendarDays, Car, ChevronRight, Home, Laptop, MoreHorizontal, Shirt, Sofa, UsersRound } from 'lucide-react';

const popular = [{ label: 'Kendaraan', Icon: Car }, { label: 'Properti', Icon: Home }, { label: 'Elektronik', Icon: Laptop }, { label: 'Pakaian', Icon: Shirt }, { label: 'Perabotan', Icon: Sofa }, { label: 'Lainnya', Icon: MoreHorizontal }];
const quick = [{ label: 'Grup jual beli', Icon: UsersRound }, { label: 'Acara penjualan', Icon: CalendarDays }, { label: 'Item tersimpan', Icon: Bookmark }];

export function CategoryBrowser() {
  return <aside className="marketplace-category-browser"><h2>Jelajahi marketplace</h2><div className="marketplace-quick-links">{quick.map(({ label, Icon }) => <button key={label} onClick={() => { window.location.hash = label.toLowerCase().replaceAll(' ', '-'); }}><span><Icon size={17} /></span>{label}<ChevronRight size={15} /></button>)}</div><div className="marketplace-category-section"><div className="marketplace-category-heading"><h3>Kategori populer</h3><a href="/marketplace/categories">Lihat semua</a></div><div className="marketplace-popular-grid">{popular.map(({ label, Icon }) => <a key={label} href={`/marketplace?category=${encodeURIComponent(label)}`}><span><Icon size={19} /></span>{label}</a>)}</div></div></aside>;
}

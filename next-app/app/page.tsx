import Link from 'next/link';
import { ArrowRight, Building2, MessageCircle, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

const destinations = [
  { title: 'Marketplace', description: 'Produk dan jasa pilihan dari seller lokal Sultra.', href: '/marketplace', Icon: ShoppingBag, tone: 'mint' },
  { title: 'SUKI Properti', description: 'Hunian, ruko, dan ruang usaha terverifikasi.', href: '/properti', Icon: Building2, tone: 'sand' },
  { title: 'Komunitas', description: 'Terhubung dengan warga dan grup lokal.', href: '/groups', Icon: Users, tone: 'blue' },
  { title: 'SUKI Chat', description: 'Mulai percakapan dengan seller dan warga.', href: '/chat', Icon: MessageCircle, tone: 'gold' },
];

export default function Home() {
  return <AppLayout><main className="page-shell">
    <section className="hero-panel">
      <div className="hero-copy"><span className="eyebrow"><Sparkles size={14} /> Ruang warga Sulawesi Tenggara</span><h1>Belanja lokal,<br /><em>rasa global.</em></h1><p>Temukan produk, jasa, cerita, komunitas, dan seller terpercaya dari Sulawesi Tenggara dalam satu ruang yang hangat.</p><div className="hero-actions"><Link className="primary-btn" href="/marketplace">Mulai jelajahi <ArrowRight size={15} /></Link><Link className="ghost-btn" href="/marketplace">Pasang iklan gratis</Link></div><div className="hero-stats"><span><strong>7.2K</strong>Warga aktif</span><span><strong>1.8K</strong>Listing lokal</span><span><strong>98%</strong>Seller terpercaya</span></div></div><div className="hero-art" aria-hidden="true"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-art-card"><Sparkles size={22} /><div>Ruang lokal yang berarti<strong>SultraKita</strong></div></div></div>
    </section>
    <section className="welcome-strip"><div><span className="eyebrow">Selamat datang kembali</span><h2>Jelajahi lebih dekat, Wan.</h2></div><p>Gunakan menu di samping untuk menemukan semua fitur SUKI.</p></section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">Temukan lebih cepat</span><h2>Ruang pilihan untukmu</h2></div><Link className="text-link" href="/marketplace">Lihat semua <ArrowRight size={14} /></Link></div><div className="destination-grid">{destinations.map(({ title, description, href, Icon, tone }) => <Link className="destination-card" href={href} key={href}><span className={`destination-icon ${tone}`}><Icon size={21} /></span><strong>{title}</strong><p>{description}</p><span className="destination-arrow"><ArrowRight size={15} /></span></Link>)}</div></section>
    <section className="trust-strip"><span className="trust-icon"><Sparkles size={18} /></span><div><strong>Dibangun untuk warga Sultra</strong><span>Ruang aman untuk menemukan, berbagi, dan bertumbuh bersama.</span></div><Link className="ghost-btn" href="/security-center">Pelajari keamanan</Link></section>
  </main></AppLayout>;
}

'use client';

import { BarChart3, ChevronRight, ClipboardList, DollarSign, ImagePlus, Lightbulb, Plus, Settings2, ShieldCheck, Store, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SellerAnalyticsCard } from '@/components/analytics/SellerAnalyticsCard';
import { MarketplaceTopNav } from '@/components/marketplace/MarketplaceTopNav';
import { supabase } from '@/lib/supabase/client';

const tools = [{ label: 'Buat listing baru', description: 'Jual produk atau jasa lokal', Icon: Plus, href: '/marketplace/create' }, { label: 'Kelola listing', description: 'Edit dan atur status produk', Icon: ClipboardList, href: '/dashboard/properties' }, { label: 'Foto produk', description: 'Panduan foto yang menjual', Icon: ImagePlus, href: '/help-center' }, { label: 'Pengaturan toko', description: 'Atur profil dan preferensi', Icon: Settings2, href: '/marketplace/profile' }];

export default function SellerToolsPage() {
  const [userId, setUserId] = useState(''); const [name, setName] = useState('Seller Sultra');
  useEffect(() => { void supabase?.auth.getUser().then(result => { if (result.data.user) { setUserId(result.data.user.id); setName(String(result.data.user.user_metadata?.full_name || result.data.user.email?.split('@')[0] || 'Seller Sultra')); } }); }, []);
  return <><MarketplaceTopNav /><main className="seller-tools-page"><Link href="/marketplace" className="marketplace-back-link">← Kembali ke Marketplace</Link><header className="seller-tools-hero"><div><span className="marketplace-kicker"><Store size={13} /> Seller tools</span><h1>Bangun toko yang dipercaya warga.</h1><p>Kelola listing, pantau performa, dan kembangkan penjualan lokal dari satu ruang.</p></div><div className="seller-tools-hero-icon"><BarChart3 size={38} /></div></header><section className="seller-tools-welcome"><div className="marketplace-avatar">{name.slice(0, 2).toUpperCase()}</div><div><b>Halo, {name}</b><small>Siap membuat listing berikutnya?</small></div><Link href="/marketplace/create"><Plus size={16} /> Buat listing</Link></section>{userId ? <SellerAnalyticsCard sellerId={userId} /> : <section className="seller-tools-login"><UserRound size={25} /><h2>Masuk untuk melihat performa</h2><p>Analytics toko akan tersedia setelah akun Supabase terhubung.</p><Link href="/login?redirect=%2Fmarketplace%2Fseller-tools">Masuk ke akun <ChevronRight size={15} /></Link></section>}<section className="seller-tools-section"><div className="seller-tools-heading"><div><span className="marketplace-kicker">Pusat kontrol</span><h2>Tindakan cepat</h2></div><ShieldCheck size={21} /></div><div className="seller-tools-grid">{tools.map(({ label, description, Icon, href }) => <Link href={href} key={label}><span><Icon size={19} /></span><div><b>{label}</b><small>{description}</small></div><ChevronRight size={15} /></Link>)}</div></section><section className="seller-tools-tip"><Lightbulb size={20} /><div><b>Tips seller hari ini</b><p>Listing dengan 4–6 foto dan deskripsi yang jelas lebih mudah dipercaya calon pembeli.</p></div><DollarSign size={22} /></section></main></>;
}

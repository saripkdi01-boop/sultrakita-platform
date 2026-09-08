'use client';

import Link from 'next/link';
import { ArrowLeft, Store } from 'lucide-react';

export default function MarketplaceCreatePage() {
  return <main className="platform-shell mx-auto max-w-2xl p-6"><Link href="/marketplace" className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sultra-teal"><ArrowLeft size={16}/> Kembali ke Marketplace</Link><section className="rounded-3xl border border-sultra-mint bg-white p-8 shadow-sm dark:bg-sultra-dark"><Store size={28} className="text-sultra-teal"/><h1 className="mt-4 text-2xl font-bold text-sultra-forest dark:text-sultra-sand">Buat listing Marketplace</h1><p className="mt-2 text-sm leading-6 text-gray-600 dark:text-sultra-sand/70">Form listing sedang disiapkan. Anda dapat mengelola penjualan melalui alat seller yang tersedia.</p><Link href="/marketplace/seller-tools" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-sultra-forest px-5 text-sm font-bold text-white">Buka Seller Tools</Link></section></main>;
}

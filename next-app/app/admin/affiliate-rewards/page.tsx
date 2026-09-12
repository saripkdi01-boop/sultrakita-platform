'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

const stages = [
  ['01', 'Periksa kelayakan', 'Pastikan star berasal dari aktivasi qualified dan tidak ada self-referral, duplikasi, bot, atau pola abuse.'],
  ['02', 'Validasi identitas payout', 'Cocokkan metode payout dan data akun yang sudah dimasking. Jangan menampilkan data payout lengkap pada layar bersama.'],
  ['03', 'Persetujuan manual', 'Operator kedua melakukan review sebelum pengajuan dapat berpindah ke approved.'],
  ['04', 'Bukti pembayaran', 'Simpan referensi transaksi dan tanggal pembayaran pada audit trail internal.'],
];

export default function AdminAffiliateRewardsPage() {
  const [notice, setNotice] = useState('');
  return <AppLayout><main className="platform-shell mx-auto max-w-6xl">
    <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div><span className="eyebrow text-sultra-teal">ADMIN · AFFILIATE REWARDS</span><h1 className="mt-2 text-3xl font-bold text-sultra-forest">Payout Operations</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Ruang kerja read-only untuk memastikan review reward konsisten, dapat diaudit, dan tidak mengekspos data finansial affiliator.</p></div>
      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">READ-ONLY SAFETY MODE</span>
    </header>
    <section className="grid gap-4 md:grid-cols-3" aria-label="Payout safeguards">
      <article className="rounded-2xl border border-sultra-mint bg-white p-5"><span className="text-xs font-bold text-slate-500">Status workflow</span><strong className="mt-2 block text-2xl text-sultra-forest">Manual review</strong><small className="mt-1 block text-xs text-slate-500">Tidak ada payout otomatis</small></article>
      <article className="rounded-2xl border border-sultra-mint bg-white p-5"><span className="text-xs font-bold text-slate-500">Data exposure</span><strong className="mt-2 block text-2xl text-sultra-forest">Minimized</strong><small className="mt-1 block text-xs text-slate-500">Akun payout wajib dimasking</small></article>
      <article className="rounded-2xl border border-sultra-mint bg-white p-5"><span className="text-xs font-bold text-slate-500">Audit posture</span><strong className="mt-2 block text-2xl text-sultra-forest">Two-person</strong><small className="mt-1 block text-xs text-slate-500">Persetujuan kedua direkomendasikan</small></article>
    </section>
    <section className="mt-6 rounded-2xl border border-sultra-mint bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="eyebrow text-sultra-teal">OPERATOR PLAYBOOK</span><h2 className="mt-2 text-xl font-bold text-sultra-forest">Checklist review payout</h2></div><button className="soft-btn" onClick={() => setNotice('Checklist siap digunakan. Perubahan status payout belum diaktifkan dalam safety mode.')}>Tandai siap review</button></div><div className="mt-5 grid gap-3 md:grid-cols-2">{stages.map(([number, title, text]) => <article key={number} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="flex gap-3"><b className="text-sultra-teal">{number}</b><div><h3 className="font-bold text-slate-800">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div></div></article>)}</div>{notice && <p className="mt-5 rounded-xl bg-sultra-mint/40 p-3 text-sm text-sultra-forest" role="status">{notice}</p>}</section>
    <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6"><h2 className="font-bold text-amber-900">Batasan keamanan fase ini</h2><p className="mt-2 text-sm leading-6 text-amber-800">Panel ini belum membaca atau mengubah queue payout production. Status approved, paid, dan rejected tetap harus diproses melalui jalur operasional yang memiliki otorisasi, audit log, verifikasi rekening, dan bukti pembayaran. Dengan demikian tidak ada risiko mutasi finansial tidak sengaja dari halaman ini.</p></section>
  </main></AppLayout>;
}

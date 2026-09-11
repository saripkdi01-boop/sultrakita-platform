'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export default function AjakTemanPage() {
  const [friends, setFriends] = useState(5);
  const points = Math.max(0, Math.min(1000, friends || 0)) * 100;
  const rupiah = points * 100;
  const referralLink = useMemo(() => `${typeof window === 'undefined' ? 'https://sultrakita-platform.vercel.app' : window.location.origin}/?ref=SULTRA-LAUNCH`, []);
  async function share() {
    const payload = { title: 'Ajak Teman, Tumbuh Bersama', text: 'Gabung SultraKita dan tumbuh bersama warga Sulawesi Tenggara.', url: referralLink };
    if (navigator.share) await navigator.share(payload); else { await navigator.clipboard?.writeText(referralLink); alert('Link referral disalin.'); }
  }
  return <main className="referral-page"><header className="referral-top"><Link className="referral-brand" href="/">SULTRA<span>KI</span>TA</Link><Link className="referral-back" href="/">← Kembali ke SultraKita</Link></header>
    <section className="referral-hero"><div><p className="referral-eyebrow">Campaign peluncuran · 2026</p><h1>Bagikan yang baik.<br /><em>Tumbuh bersama.</em></h1><p className="referral-lead">Ajak teman, tetangga, dan UMKM Sulawesi Tenggara bergabung di ruang digital lokal yang lebih dekat. Kumpulkan poin dari referral yang valid dan ajukan penukaran melalui verifikasi resmi.</p><div className="referral-actions"><button className="referral-btn" onClick={share}>Bagikan campaign ↗</button><Link className="referral-btn referral-btn-alt" href="/signup">Mulai sekarang</Link></div></div><div className="referral-hero-card"><small>Setiap referral valid bernilai</small><strong>100 poin</strong><small>10 poin = Rp1 · minimum penukaran 1.000 poin</small><button className="referral-btn" onClick={share}>Salin link referral</button></div></section>
    <section className="referral-steps">{[['01','Daftar','Buat akun SultraKita dan lengkapi profil secara wajar.'],['02','Bagikan','Kirim link personal ke WhatsApp, Instagram, TikTok, Facebook, atau komunitasmu.'],['03','Dapatkan poin','Poin masuk setelah teman melakukan aktivitas bermakna dan lolos pemeriksaan anti-abuse.']].map(([number, title, text]) => <article key={number}><span>{number}</span><h2>{title}</h2><p>{text}</p></article>)}</section>
    <section className="referral-section"><h2>Hitung potensi poinmu</h2><p>Ini adalah simulasi campaign, bukan janji pendapatan. Penukaran tetap melalui pemeriksaan.</p><div className="referral-calc"><label>Jumlah teman yang diajak<input type="number" min={0} max={1000} value={friends} onChange={event => setFriends(Number(event.target.value))} /></label><div><small>Estimasi poin</small><strong>{points.toLocaleString('id-ID')} poin</strong><small>≈ Rp{rupiah.toLocaleString('id-ID')} saat ditukar</small></div></div></section>
    <section className="referral-section"><h2>Aturan yang jelas</h2><ul><li>Satu orang hanya dapat dihitung satu kali sebagai referral.</li><li>Aktivitas otomatis, akun ganda, spam, dan manipulasi tidak memenuhi syarat.</li><li>Penukaran diproses manual setelah data dan aktivitas diverifikasi.</li><li>Program dapat diperbarui atau dihentikan dengan pemberitahuan di halaman ini.</li></ul></section>
  </main>;
}

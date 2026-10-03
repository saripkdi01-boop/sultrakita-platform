import Link from 'next/link';

// Daftar modul Operations Center — dipakai bersama oleh
// /admin/dashboard dan /dashboard/admin agar satu sumber kebenaran.
export const ADMIN_MODULES = [
  { href: '/admin/overview', title: 'Ringkasan operasional', description: 'KPI jujur dari database: pengguna, listing, laporan, dan aktivitas admin terbaru.', tone: 'bg-[#e9f7f2]' },
  { href: '/admin/users', title: 'Kelola pengguna', description: 'Cari, saring, tangguhkan/pulihkan akun, ubah peran, dan catatan internal.', tone: 'bg-[#eaf1ff]' },
  { href: '/admin/team', title: 'Tim admin', description: 'Kelola staf SUKI: beri/cabut role admin, moderator, support — khusus super_admin, tercatat di audit.', tone: 'bg-[#eaf1ff]' },
  { href: '/admin/moderation', title: 'Moderasi laporan', description: 'Antrean laporan marketplace: tinjau, tolak, atau takedown listing dengan alasan.', tone: 'bg-[#fff5dc]' },
  { href: '/admin/monitoring', title: 'Monitoring operasional', description: 'Uptime endpoint, latensi, kesehatan DB/storage, status cron & integrasi — dicek live saat halaman dibuka.', tone: 'bg-[#e9f7f2]' },
  { href: '/admin/errors', title: 'Error inbox', description: 'Pipeline error terpusat: kelompok error server-side, hitung kejadian, tandai resolved.', tone: 'bg-red-50' },
  { href: '/admin/database', title: 'Database', description: 'Hitung baris per tabel utama, efek RLS dari sudut anon-key, dan bucket storage.', tone: 'bg-[#eaf1ff]' },
  { href: '/admin/audit', title: 'Audit trail', description: 'Jejak aksi admin & moderasi: siapa melakukan apa dan kapan — transparan, dapat diaudit.', tone: 'bg-[#f3efff]' },
  { href: '/admin/billing', title: 'Billing & langganan', description: 'Paket, entitlement, dan pesanan (sandbox).', tone: 'bg-[#f3efff]' },
  { href: '/admin/ads', title: 'Iklan', description: 'Kelola slot iklan dan inventaris monetisasi ekosistem.', tone: 'bg-[#fff5dc]' },
  { href: '/admin/announcements', title: 'Pengumuman', description: 'Broadcast banner ke seluruh situs: maintenance, info penting, promo — tanpa deploy.', tone: 'bg-[#fff8e1]' },
  { href: '/admin/settings', title: 'Pengaturan situs', description: 'Feature flags & maintenance mode. Perubahan berlaku ≤60 detik, tercatat di audit.', tone: 'bg-[#f3efff]' },
  { href: '/admin/support-tickets', title: 'Support tickets', description: 'Triage, respons, dan lifecycle tiket dukungan.', tone: 'bg-[#e9f7f2]' },
  { href: '/admin/ecosystem-banners', title: 'Ecosystem banners', description: 'Kelola banner lintas Marketplace, Jobs, dan SUKI Suits.', tone: 'bg-[#fff5dc]' },
  { href: '/admin/property-verification', title: 'Property verification', description: 'Tinjau dokumen dan status verifikasi properti.', tone: 'bg-[#eaf1ff]' },
  { href: '/admin/businesses', title: 'Moderasi bisnis', description: 'Tinjau pengajuan direktori bisnis: setujui, tolak, kelola unggulan & verifikasi.', tone: 'bg-[#e9f7f2]' },
  { href: '/admin/affiliate-rewards', title: 'Affiliate rewards', description: 'Review dan rekonsiliasi antrean payout affiliate.', tone: 'bg-[#f7edff]' },
  { href: '/admin/launch', title: 'Checklist launch', description: 'Daftar verifikasi pra-launch dari data/launch-checklist.json — status lolos/gagal/belum diperiksa.', tone: 'bg-[#eaf1ff]' },
] as const;

export function AdminHomeContent({ displayName, role }: { displayName: string; role: string }) {
  return (
    <main className="platform-shell mx-auto max-w-6xl">
      <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Admin governance</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">Satu pintu untuk operasi, moderasi, dukungan, dan kontrol kualitas ekosistem SultraKita.</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm">
            <p className="text-[#bce8d8]">Sesi terverifikasi</p>
            <p className="mt-1 font-bold">{displayName}</p>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-[#bce8d8]">{role}</p>
          </div>
        </div>
      </section>
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {ADMIN_MODULES.map((module) => (
          <Link key={module.href} href={module.href} className={`group rounded-3xl border border-[#dcebe5] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${module.tone}`}>
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#1b806f]">Governance module</p>
            <h2 className="mt-3 text-xl font-extrabold text-[#123f38]">{module.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#55736b]">{module.description}</p>
            <span className="mt-5 inline-flex text-sm font-bold text-[#1b806f]">Buka modul <span className="ml-2 transition group-hover:translate-x-1">→</span></span>
          </Link>
        ))}
      </section>
      <p className="mt-8 text-center text-xs text-[#78948c]">Akses dashboard dan mutasi data selalu divalidasi server-side berdasarkan sesi Supabase dan role profile.</p>
    </main>
  );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { requireAdminUser } from '@/lib/supabase/server';

const adminModules = [
  { href: '/admin/support-tickets', title: 'Support tickets', description: 'Triage, respons, dan lifecycle tiket dukungan.', tone: 'bg-[#e9f7f2]' },
  { href: '/admin/ecosystem-banners', title: 'Ecosystem banners', description: 'Kelola banner lintas Marketplace, Jobs, dan SUKI Suits.', tone: 'bg-[#fff5dc]' },
  { href: '/admin/property-verification', title: 'Property verification', description: 'Tinjau dokumen dan status verifikasi properti.', tone: 'bg-[#eaf1ff]' },
  { href: '/admin/affiliate-rewards', title: 'Affiliate rewards', description: 'Review dan rekonsiliasi antrean payout affiliate.', tone: 'bg-[#f7edff]' },
] as const;

export default async function AdminHomePage() {
  try {
    const { user, profile } = await requireAdminUser();
    const displayName = profile.display_name || profile.full_name || user.email || 'Admin';
    return (
      <AppLayout active="home">
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
                <p className="mt-0.5 text-xs uppercase tracking-wide text-[#bce8d8]">{profile.role}</p>
              </div>
            </div>
          </section>
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {adminModules.map((module) => (
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
      </AppLayout>
    );
  } catch {
    redirect('/login?redirect=/admin');
  }
}

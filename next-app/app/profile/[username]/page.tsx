import Link from 'next/link';
import { ArrowLeft, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';

type PublicProfile = {
  display_name: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  district: string | null;
  role: string | null;
  visibility_settings?: { avatar?: 'public' | 'followers' | 'private' } | null;
};

function initials(profile: PublicProfile) {
  const name = profile.display_name || profile.full_name || profile.username || 'Pengguna';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function publicName(profile: PublicProfile) {
  return profile.display_name?.trim() || profile.full_name?.trim() || profile.username?.trim() || 'Pengguna Sultra';
}

function roleLabel(role: string | null) {
  const labels: Record<string, string> = {
    buyer: 'Warga',
    seller: 'Seller / UMKM',
    creator: 'Kreator',
    community: 'Komunitas',
    admin: 'Admin',
    super_admin: 'Admin',
  };
  return role ? labels[role] || 'Anggota SultraKita' : 'Anggota SultraKita';
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const normalizedUsername = decodeURIComponent(username).replace(/^@+/, '').trim().toLowerCase();
  if (!normalizedUsername || !/^[a-z0-9_.-]{2,40}$/.test(normalizedUsername)) notFound();

  let profile: PublicProfile | null = null;
  try {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name,full_name,username,avatar_url,bio,district,role,visibility_settings')
      .eq('username', normalizedUsername)
      .maybeSingle();
    if (error || !data) notFound();
    profile = data as PublicProfile;
  } catch {
    notFound();
  }

  if (!profile) notFound();
  const name = publicName(profile);
  const avatar = profile.visibility_settings?.avatar === 'public' ? profile.avatar_url?.trim() || null : null;

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-3xl">
        <Link href="/beranda" className="inline-flex items-center gap-2 text-sm font-semibold text-sultra-teal">
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke beranda
        </Link>
        <section className="mt-5 overflow-hidden rounded-3xl border border-sultra-mint/70 bg-white shadow-sm dark:border-sultra-forest/30 dark:bg-sultra-dark">
          <div className="h-32 bg-gradient-to-br from-sultra-forest via-sultra-teal to-sultra-blue md:h-44" aria-hidden="true" />
          <div className="px-5 pb-7 md:px-9 md:pb-9">
            <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white bg-sultra-mint text-3xl font-bold text-sultra-forest shadow-md dark:border-sultra-dark dark:bg-sultra-forest dark:text-sultra-sand sm:h-32 sm:w-32">
                {avatar ? <img src={avatar} alt={`Foto profil ${name}`} className="h-full w-full object-cover" /> : <span aria-label={`Inisial ${name}`}>{initials(profile)}</span>}
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sultra-mint px-3 py-2 text-xs font-bold text-sultra-forest dark:bg-sultra-forest/30 dark:text-sultra-sand">
                <ShieldCheck size={14} aria-hidden="true" /> Profil publik
              </span>
            </div>
            <div className="mt-5">
              <h1 className="text-3xl font-bold text-sultra-forest dark:text-sultra-sand">{name}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-sultra-sand/65">@{profile.username || normalizedUsername} · {roleLabel(profile.role)}</p>
              {profile.bio && <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-sultra-sand/80">{profile.bio}</p>}
              {profile.district && <p className="mt-4 inline-flex items-center gap-2 text-sm text-gray-600 dark:text-sultra-sand/70"><MapPin size={16} className="text-sultra-teal" aria-hidden="true" /> {profile.district}</p>}
            </div>
          </div>
        </section>
        <section className="mt-5 rounded-3xl border border-gray-200 bg-white p-6 dark:border-sultra-forest/30 dark:bg-sultra-dark md:p-8">
          <div className="flex items-center gap-3 text-sultra-forest dark:text-sultra-sand"><UserRound size={20} className="text-sultra-teal" /><h2 className="font-bold">Tentang profil ini</h2></div>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-sultra-sand/70">Profil ini dapat dilihat oleh pengguna lain di SultraKita. Informasi kontak pribadi tidak ditampilkan di halaman publik.</p>
        </section>
      </main>
    </AppLayout>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return { title: `Profil @${decodeURIComponent(username).replace(/^@+/, '')} · SultraKita` };
}

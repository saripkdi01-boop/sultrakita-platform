import { notFound } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { PublicProfileView, type PublicProfileData } from '@/components/profile/PublicProfileView';

type PublicProfile = {
  display_name: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  district: string | null;
  role: string | null;
  visibility_settings?: Partial<Record<'avatar' | 'full_name' | 'username' | 'bio' | 'phone' | 'email' | 'location' | 'interests' | 'online_status', 'public' | 'followers' | 'private'>> | null;
};

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
  const visibility = profile.visibility_settings || {};
  const isPublic = (field: keyof NonNullable<PublicProfile['visibility_settings']> | 'full_name' | 'username' | 'bio' | 'location') => visibility[field] === 'public';

  // Hanya teruskan field yang boleh tampil publik; label/fallback diterjemahkan di komponen client.
  const data: PublicProfileData = {
    initialsName: profile.display_name?.trim() || profile.full_name?.trim() || profile.username?.trim() || null,
    displayName: (isPublic('full_name') || isPublic('username'))
      ? (profile.display_name?.trim() || profile.full_name?.trim() || profile.username?.trim() || null)
      : null,
    publicUsername: isPublic('username') ? profile.username || normalizedUsername : null,
    avatar: isPublic('avatar') ? profile.avatar_url?.trim() || null : null,
    bio: isPublic('bio') ? profile.bio : null,
    location: isPublic('location') ? profile.district : null,
    role: profile.role,
  };

  return <PublicProfileView profile={data} />;
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return { title: `Profil @${decodeURIComponent(username).replace(/^@+/, '')} · SultraKita` };
}

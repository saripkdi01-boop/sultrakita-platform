'use client';

import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type SessionProfile = {
  id: string;
  full_name: string | null;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: 'buyer' | 'seller' | 'admin' | 'warga' | 'creator' | 'community' | null;
  bio: string | null;
  district: string | null;
};

function cleanNickname(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/^@+/, '').replace(/\s+/g, ' ').slice(0, 60);
}

/** The only display-name policy: a user's nickname/username, then verified auth metadata. */
export function getProfileNickname(user: User | null, profile: Partial<SessionProfile> | null) {
  const metadata = user?.user_metadata || {};
  const candidate = cleanNickname(profile?.username) || cleanNickname(profile?.display_name) || cleanNickname(metadata.username) || cleanNickname(metadata.nickname);
  if (candidate) return candidate;
  const fullName = cleanNickname(profile?.full_name) || cleanNickname(metadata.full_name) || cleanNickname(metadata.name);
  if (fullName) return fullName.split(' ')[0];
  return cleanNickname(user?.email?.split('@')[0]) || 'Pengguna';
}

export function useSessionProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SessionProfile | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const hydrate = useCallback(async (nextUser: User | null) => {
    setUser(nextUser);
    if (!nextUser || !supabase) { setProfile(null); setNotificationCount(0); return; }
    const [{ data: nextProfile }, { count }] = await Promise.all([
      supabase.from('profiles').select('id,full_name,display_name,username,avatar_url,role,bio,district').eq('id', nextUser.id).maybeSingle(),
      supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('recipient_id', nextUser.id).is('read_at', null),
    ]);
    setProfile(nextProfile as SessionProfile | null);
    setNotificationCount(count || 0);
  }, []);
  const refresh = useCallback(async () => { if (!supabase) return; const { data } = await supabase.auth.getSession(); await hydrate(data.session?.user ?? null); }, [hydrate]);
  useEffect(() => {
    if (!supabase) return;
    const client = supabase; let active = true;
    const load = async () => { const { data } = await client.auth.getSession(); if (active) await hydrate(data.session?.user ?? null); };
    void load();
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => { void hydrate(session?.user ?? null); });
    const onProfileUpdated = () => { void refresh(); };
    window.addEventListener('sultra-profile-updated', onProfileUpdated);
    return () => { active = false; listener.subscription.unsubscribe(); window.removeEventListener('sultra-profile-updated', onProfileUpdated); };
  }, [hydrate, refresh]);
  return { user, profile, nickname: getProfileNickname(user, profile), notificationCount, refresh };
}

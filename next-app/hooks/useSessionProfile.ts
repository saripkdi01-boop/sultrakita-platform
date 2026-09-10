'use client';

import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type Profile = { id: string; full_name: string | null; avatar_url: string | null; role: 'buyer' | 'seller' | 'admin'; headline: string | null };

export function useSessionProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const hydrate = useCallback(async (nextUser: User | null) => {
    setUser(nextUser);
    if (!nextUser || !supabase) {
      setProfile(null);
      setNotificationCount(0);
      return;
    }
    const [{ data: nextProfile }, { count }] = await Promise.all([
      supabase.from('profiles').select('id,full_name,avatar_url,role,headline').eq('id', nextUser.id).maybeSingle(),
      supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('profile_id', nextUser.id).eq('is_read', false),
    ]);
    setProfile(nextProfile as Profile | null);
    setNotificationCount(count || 0);
  }, []);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    await hydrate(data.session?.user ?? null);
  }, [hydrate]);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let active = true;
    const load = async () => {
      const { data } = await client.auth.getSession();
      if (active) await hydrate(data.session?.user ?? null);
    };
    void load();
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => { void hydrate(session?.user ?? null); });
    const onProfileUpdated = () => { void refresh(); };
    window.addEventListener('sultra-profile-updated', onProfileUpdated);
    return () => {
      active = false;
      listener.subscription.unsubscribe();
      window.removeEventListener('sultra-profile-updated', onProfileUpdated);
    };
  }, [hydrate, refresh]);

  return { user, profile, notificationCount, refresh };
}

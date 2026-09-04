'use client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type Profile = { id: string; full_name: string | null; avatar_url: string | null; role: 'buyer' | 'seller' | 'admin'; headline: string | null };

export function useSessionProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    let active = true;
    async function hydrate(nextUser: User | null) {
      if (!active) return;
      setUser(nextUser);
      if (!nextUser) { setProfile(null); setNotificationCount(0); return; }
      const [{ data: nextProfile }, { count }] = await Promise.all([
        supabase.from('profiles').select('id,full_name,avatar_url,role,headline').eq('id', nextUser.id).maybeSingle(),
        supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', nextUser.id).eq('is_read', false),
      ]);
      if (active) { setProfile(nextProfile as Profile | null); setNotificationCount(count || 0); }
    }
    supabase.auth.getSession().then(({ data }) => hydrate(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { void hydrate(session?.user ?? null); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  return { user, profile, notificationCount };
}

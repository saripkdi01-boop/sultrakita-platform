import { supabase } from '@/lib/supabase/client';

export async function signOutAndRedirect() {
  if (supabase) await supabase.auth.signOut();
  window.location.assign('/login');
}
